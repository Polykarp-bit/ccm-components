ccm.files["ccm.teacher_cours_self.js"] = {
    name: "teacher_courses",
    ccm: "../../libs/ccm/ccm.js",
    config: {
        store: ["ccm.store", {url: "https://ccm2.inf.h-brs.de", name: "tniede2s_mycollection"}],
        css: ["ccm.load", "./style.css"],
        html: {
            main: `
            <div id="user" ></div>        
            <h1>%title%</h1>
            <div id="items"> </div>
            `,
            item: `
            <article data-course="%course%">
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
                <main>
                    <h2>%name%</h2>
                </main>
                <footer></footer>
            </article>`,
        },
    },

    Instance: function () {
        this.start = async () => {
            const alleKurse = await this.store.get({});
            console.log("Alle Kurse:", alleKurse);

            let meineKurse = [];
            if (Array.isArray(alleKurse)) {
                meineKurse = alleKurse.filter(kurs => {
                    if (kurs && kurs.value && kurs.value.who) {
                        return kurs.value.who === "tmiede2s";
                    }
                    return false; // Ignoriere Einträge ohne value oder who
                });
            } else {
                console.error("Fehler: alleKurse ist kein Array:", alleKurse);
            }
            console.log("Gefilterte Kurse:", meineKurse);

            this.element.appendChild(this.ccm.helper.html(this.html.main, {
                title: "Meine Kurse"
            }));

            const item_element = this.element.querySelector('#items');

            meineKurse.forEach(kurs => {
                const kursHtml = this.ccm.helper.html(this.html.item, {
                    title: kurs.value.activity,
                    course: kurs.key
                });
                console.log("Kurs HTML:", kursHtml);
                item_element.appendChild(kursHtml);

                const addButton = kursHtml.querySelector('.add-button');
                const noteInputContainer = kursHtml.querySelector('.note-input-container');
                const noteInput = kursHtml.querySelector('.note-input');
                const confirmButton = kursHtml.querySelector('.confirm-button');
                const notesList = kursHtml.querySelector('.notes-list');
                const courseId = kurs.key;

                this.loadNotes(courseId, notesList);

                addButton.addEventListener('click', () => {
                    noteInputContainer.style.display = 'block';
                    addButton.style.display = 'none';
                });

                confirmButton.addEventListener('click', async () => {
                    const note = noteInput.value.trim();
                    if (note) {
                        await this.addNote(courseId, note, notesList);
                        noteInput.value = '';
                        noteInput.focus();
                    }
                });
            });
        };

        // Notizen hinzufügen
        this.addNote = async (courseId, note, notesList) => {
            const kurs = await this.store.get(courseId + "");
            console.log("Kurs beim Hinzufügen:", kurs);
            if (!kurs || !kurs.value) return;

            // Wenn der Kurs keine Materialien (Notizen) hat, initialisieren wir das Feld
            if (!kurs.value.materials) {
                kurs.value.materials = [];
            }

            // Füge die neue Notiz zu den Materialien hinzu
            kurs.value.materials.push(note);

            // Speichern der Änderungen in der Datenbank
            await this.store.set({key: courseId + "", value: kurs.value}); // Direkt das gesamte Objekt speichern
            console.log("Kurs nach Hinzufügen:", kurs);

            // Notiz im Frontend rendern
            this.renderNote(note, notesList, courseId); // courseId mitgeben
        };

        // Notizen laden
        this.loadNotes = async (courseId, notesList) => {
            console.log("Lade Notizen für courseId:", courseId);
            const kurs = await this.store.get(courseId + "");
            if (kurs && kurs.value && kurs.value.materials) {
                // Alle Notizen des Kurses rendern
                kurs.value.materials.forEach(note => this.renderNote(note, notesList, courseId));
            }
        };

        // Notiz rendern
        this.renderNote = (note, notesList, courseId) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span class="note-text">${note}</span>
                <button class="delete-button">Delete</button>
            `;
            notesList.appendChild(li);

            li.querySelector('.delete-button').addEventListener('click', () => {
                this.deleteNote(note, notesList, li, courseId); // courseId übergeben
            });
        };

        // Notiz löschen
        this.deleteNote = async (note, notesList, listItem, courseId) => {
            const kurs = await this.store.get(courseId + "");
            console.log("Kurs beim Löschen:", kurs);
            if (!kurs || !kurs.value || !kurs.value.materials) return;

            // Entferne die Notiz aus den Materialien des Kurses
            const index = kurs.value.materials.indexOf(note);
            if (index !== -1) {
                kurs.value.materials.splice(index, 1);
                await this.store.set(kurs); // Aktualisiertes Objekt speichern
                console.log("Kurs nach Löschen:", kurs);
                notesList.removeChild(listItem);
            }
        };
    }
};
