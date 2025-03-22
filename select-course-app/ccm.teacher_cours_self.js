ccm.files["ccm.teacher_cours_self.js"] = {
    name: "teacher_courses",
    ccm: "../../libs/ccm/ccm.js",
    config: {
        store: ["ccm.store", {url: "https://ccm2.inf.h-brs.de", name: "tniede2s_mycollection"}],
        css: ["ccm.load", "./style.css"],
        helper: ["ccm.load", "../../libs/ccm/helper/helper-8.4.2.mjs"],
        html: {
            main: `
                    <div id="user"></div>        
                    <h1>%title%</h1>
                    <button class="Kurs-button">Kurs Manuel Anlegen</button>
                    <div id="course-form-container" style="display: none;">
                        <form id="course-form">
                            <div class="form-group">
                                <label for="course">Kursname:</label>
                                <input type="text" id="course" name="course" placeholder="z. B. BCSP 2" required>
                            </div>
                            <div class="form-group">
                                <label for="day">Tag:</label>
                                <select id="day" name="day" required>
                                    <option value="" disabled selected>Wähle einen Tag</option>
                                    <option value="Mo">Montag</option>
                                    <option value="Di">Dienstag</option>
                                    <option value="Mi">Mittwoch</option>
                                    <option value="Do">Donnerstag</option>
                                    <option value="Fr">Freitag</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="from">Startzeit:</label>
                                <input type="time" id="from" name="from" required>
                            </div>
                            <div class="form-group">
                                <label for="until">Endzeit:</label>
                                <input type="time" id="until" name="until" required>
                            </div>
                            <div class="form-group">
                                <label for="room">Raum:</label>
                                <input type="text" id="room" name="room" placeholder="z. B. St-C116" required>
                            </div>
                            <div class="form-group">
                                <label for="activity">Aktivität:</label>
                                <input type="text" id="activity" name="activity" placeholder="z. B. Angewandte Kryptographie 1 (Ü)" required>
                            </div>
                            <div class="form-group">
                                <label for="period">Zeitraum:</label>
                                <input type="text" id="period" name="period" placeholder="z. B. 03.04.2025-26.06.2025 (gKW (ab KW14))" required>
                            </div>
                            <div class="form-group">
                                <label for="id">ID:</label>
                                <input type="number" id="id" name="id" placeholder="z. B. 19" required>
                            </div>
                            <button type="submit">Kurs hinzufügen</button>
                            <button type="button" class="cancel-button">Abbrechen</button>
                        </form>
                    </div>
                    <div id="items"></div>
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
            // Kursdaten zum Einfügen in die Datenbank

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

            const courseFormContainer = this.element.querySelector('#course-form-container');
            const courseForm = this.element.querySelector('#course-form');
            const kursButton = this.element.querySelector('.Kurs-button');
            const cancelButton = this.element.querySelector('.cancel-button');
            const itemElement = this.element.querySelector('#items');

            kursButton.addEventListener('click', () => {
                courseFormContainer.style.display = 'block';
                kursButton.style.display = 'none';
            });

            cancelButton.addEventListener('click', () => {
                courseFormContainer.style.display = 'none';
                kursButton.style.display = 'block';
                courseForm.reset();
            });

            courseForm.addEventListener('submit', async (event) => {
                event.preventDefault();

                // Sammle die Formulardaten
                const courseData = {
                    course: courseForm.querySelector('#course').value,
                    day: courseForm.querySelector('#day').value,
                    from: courseForm.querySelector('#from').value,
                    until: courseForm.querySelector('#until').value,
                    room: courseForm.querySelector('#room').value,
                    activity: courseForm.querySelector('#activity').value,
                    period: courseForm.querySelector('#period').value,
                    who: "Weil",
                    id: ccm.helper.generateKey()
                };

                // Erstelle einen eindeutigen Schlüssel für den Kurs (z. B. basierend auf der ID)
                const courseId = courseData.id + "";

                // Speichere den neuen Kurs in der Datenbank
                await this.store.set({
                    key: courseId,
                    value: courseData
                });

                console.log("Neuer Kurs hinzugefügt:", courseData);

                // Schließe das Formular und zeige den Button wieder an
                courseFormContainer.style.display = 'none';
                kursButton.style.display = 'block';
                courseForm.reset();

                // Aktualisiere die Kursliste
                await this.renderCourses(itemElement);
            });

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


        this.renderNote = async (note, notesList, courseId) => {
            // Die Notiz ist ein Embed-Code für ein Quiz
            const li = document.createElement('li');
            console.log("Note:", note);

            // Dekomponiere den Embed-Code
            const decomposedMaterial = this.helper.decomposeEmbedCode(note);
            console.log("Decomposed Material:", decomposedMaterial);

            // Erstelle ein div für die Komponente
            const noteComponentDiv = document.createElement('div');
            noteComponentDiv.className = 'note-component';

            // Starte die CCM-Komponente und rendere sie in das div
            await this.ccm.start(decomposedMaterial.component, {
                root: noteComponentDiv, // Rendere die Komponente in dieses div
                ...decomposedMaterial.config
            });

            // Erstelle den Delete-Button
            const deleteButton = document.createElement('button');
            deleteButton.className = 'delete-button';
            deleteButton.textContent = 'Delete';

            // Füge die Elemente zum li hinzu
            li.appendChild(noteComponentDiv);
            li.appendChild(deleteButton);

            // Füge das li zur Liste hinzu
            notesList.appendChild(li);

            // Füge den Event-Listener für den Delete-Button hinzu
            deleteButton.addEventListener('click', () => {
                this.deleteNote(note, notesList, li, courseId, decomposedMaterial.config.key);
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
