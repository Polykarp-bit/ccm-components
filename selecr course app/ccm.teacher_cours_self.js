ccm.files["ccm.teacher_cours_self.js"] = {
    name: "teacher_courses",
    ccm: "../../libs/ccm/ccm.js",
    //ccm: "https://ccmjs.github.io/ccm/ccm.js", // Uncomment to test online version if needed
    config: {
        data: {
            store: ["ccm.store", {
                local: {
                    courses: {
                        key: 'courses',
                        title: 'Gallerie der Kurse',
                        items: [
                            {
                                course: 1,
                                title: 'Kurs 1',
                                image: 'https://via.placeholder.com/150',
                                teacher: 'Max Mustermann'
                            },
                            {
                                course: 2,
                                title: 'Kurs 2',
                                image: 'https://via.placeholder.com/150',
                                teacher: 'Max Mustermann'
                            },
                            {
                                course: 3,
                                title: 'Kurs 3',
                                image: 'https://via.placeholder.com/150',
                                teacher: 'tniede2s'
                            }
                        ]
                    }
                }
            }],
            key: 'courses',
        }, // kurse werden aus einer mongo db geladen
        css: ["ccm.load", "./style.css"],
        user: ['ccm.start', './libs/fb02user/ccm.fb02user.js'],
        html: {
            main: `
            <div id="user" ></div>        
            <h1>%title%</h1>
            <div id="items"> </div>
            `,
            item: `
    <article data-course="%course%">
        <header>
            <img src="%image%">
        </header>
        <main>
            <h2>%title%</h2>
            <button class="add-button">Add Note</button>
            <div class="note-input-container" style="display: none;">
                <input type="text" class="note-input" placeholder="Enter a note...">
                <button class="confirm-button">Confirm</button>
            </div>
            <ul class="notes-list"></ul>
        </main>
        <footer></footer>
    </article>`,

            subitem: `
            <article>
            <header>
            <img src="%image%">
            </header>
            <main>
                <h2>%name%</h2>
            </main>
            <footer></footer>
            </article>`,
        },
    },

    Instance: function () {
        this.start = async () => {
            console.log('this.data:', this.data); // Debug: Check if this.data.key is defined
            const data = await this.data.store.get(this.data.key);
            console.log('Fetched data with key:', this.data.key); // Debug the key used

            this.element.innerHTML = ``;

            this.element.appendChild(this.ccm.helper.html(this.html.main, {
                title: data.title
            }));

            this.element.querySelector('#user').appendChild(this.user.root);
            const item_element = this.element.querySelector('#items');

            const currentUser = this.user.getValue().user;
            const tniede2sItems = data.items.filter(item => item.teacher === currentUser);

            console.log(tniede2sItems);

            tniede2sItems.forEach(item => {
                const itemHtml = this.ccm.helper.html(this.html.item, item);
                item_element.appendChild(itemHtml);

                const addButton = itemHtml.querySelector('.add-button');
                const noteInputContainer = itemHtml.querySelector('.note-input-container');
                const noteInput = itemHtml.querySelector('.note-input');
                const confirmButton = itemHtml.querySelector('.confirm-button');
                const notesList = itemHtml.querySelector('.notes-list');
                const courseId = item.course;

                this.loadNotes(courseId, notesList);

                addButton.addEventListener('click', () => {
                    noteInputContainer.style.display = 'block';
                    addButton.style.display = 'none';
                });

                confirmButton.addEventListener('click', () => {
                    const note = noteInput.value.trim();
                    if (note) {
                        this.addNote(courseId, note, notesList);
                        noteInput.value = '';
                        noteInput.focus();
                    }
                });
            });
        };

        this.addNote = async (courseId, note, notesList) => {
            console.log('this.data.key in addNote:', this.data.key); // Debug the key
            const store = this.data.store;
            let dataKey = this.data.key; // Fallback to 'courses' if undefined
            console.log('Using data key:', dataKey); // Debug the key being used
            const courseData = await store.get(dataKey) || {items: []};
            console.log('Course data before set:', courseData); // Debug the data being set
            const itemIndex = courseData.items.findIndex(item => item.course === courseId);

            if (itemIndex !== -1) {
                if (!courseData.items[itemIndex].notes) {
                    courseData.items[itemIndex].notes = [];
                }
                courseData.items[itemIndex].notes.push(note);

                // Create dataToSet with title and items, avoiding key conflict
                const dataToSet = {
                    title: courseData.title,
                    items: [...courseData.items]
                };

                try {
                    // Explicitly pass dataKey to bypass potential hook issues
                    await store.set(dataKey, dataToSet);
                    console.log('Set operation completed with key:', dataKey);
                } catch (error) {
                    console.error('Error in set operation:', error);
                }
            }

            this.renderNote(note, notesList);
        };

        this.loadNotes = async (courseId, notesList) => {
            const store = this.data.store;
            const dataKey = this.data.key;
            const courseData = await store.get(dataKey) || {items: []};
            const item = courseData.items.find(item => item.course === courseId);

            if (item && item.notes && Array.isArray(item.notes)) {
                item.notes.forEach(note => this.renderNote(note, notesList));
            }
        };

        this.renderNote = (note, notesList) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span class="note-text">${note}</span>
                <button class="delete-button">Delete</button>
            `;
            notesList.appendChild(li);

            const deleteButton = li.querySelector('.delete-button');
            deleteButton.addEventListener('click', () => {
                this.deleteNote(note, notesList, li);
            });
        };

        this.deleteNote = async (note, notesList, listItem) => {
            const store = this.data.store;
            let dataKey = this.data.key;
            const courseData = await store.get(dataKey) || {items: []};
            const itemIndex = courseData.items.findIndex(item =>
                item.notes && item.notes.includes(note)
            );

            if (itemIndex !== -1) {
                const noteIndex = courseData.items[itemIndex].notes.indexOf(note);
                if (noteIndex !== -1) {
                    courseData.items[itemIndex].notes.splice(noteIndex, 1);

                    // Create dataToSet with title and items, avoiding key conflict
                    const dataToSet = {
                        title: courseData.title,
                        items: [...courseData.items]
                    };

                    try {
                        // Explicitly pass dataKey to bypass potential hook issues
                        await store.set(dataKey, dataToSet);
                        console.log('Delete set operation completed with key:', dataKey);
                    } catch (error) {
                        console.error('Error in delete set operation:', error);
                    }
                    notesList.removeChild(listItem);
                }
            }
        };
    }
}
