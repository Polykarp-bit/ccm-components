ccm.files["ccm.teacher_cours_self.js"] = {
    name: "teacher_courses",
    ccm: "../../libs/ccm/ccm.js",
    config: {
        store: ["ccm.store", { url: "https://ccm2.inf.h-brs.de", name: "tniede2s_mycollection" }],
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
                        <button class="add-button">Add Link</button>
                        <div class="note-input-container" style="display: none;">
                            <input class="note-headline" placeholder="Enter a headline (e.g., Weblink)..." required>
                            <input type="url" class="note-input" placeholder="Enter a web link (e.g., https://example.com)..." required>
                            <button class="confirm-button">Confirm</button>
                        </div>
                        <ul class="notes-list"></ul>
                    </main>
                    <footer></footer>
                </article>
            `,
            subitem: `
                <article>
                    <main>
                        <h2>%name%</h2>
                    </main>
                    <footer></footer>
                </article>
            `
        }
    },

    Instance: function () {
        let self = this;

        this.start = async () => {
            try {
                // Lade alle Kurse aus der Datenbank
                const alleKurse = await self.store.get({});
                console.log("Alle Kurse:", alleKurse);

                let meineKurse = [];
                if (Array.isArray(alleKurse)) {
                    meineKurse = alleKurse.filter(kurs => {
                        try {
                            return kurs && kurs.value && kurs.value.who === "Weil";
                        } catch (e) {
                            console.warn("Ungültiger Kurseintrag:", kurs, e);
                            return false;
                        }
                    });
                } else {
                    console.error("Fehler: alleKurse ist kein Array:", alleKurse);
                    throw new Error("Datenbank enthält keine gültigen Kurse.");
                }
                console.log("Gefilterte Kurse:", meineKurse);

                // Haupt-HTML rendern
                this.element.innerHTML = '';
                this.element.appendChild(this.ccm.helper.html(this.html.main, {
                    title: "Meine Kurse"
                }));

                const courseFormContainer = this.element.querySelector('#course-form-container');
                const courseForm = this.element.querySelector('#course-form');
                const kursButton = this.element.querySelector('.Kurs-button');
                const cancelButton = this.element.querySelector('.cancel-button');
                const itemElement = this.element.querySelector('#items');

                // Event-Listener für das Anzeigen des Formulars
                kursButton.addEventListener('click', () => {
                    courseFormContainer.style.display = 'block';
                    kursButton.style.display = 'none';
                });

                // Event-Listener für das Abbrechen des Formulars
                cancelButton.addEventListener('click', () => {
                    courseFormContainer.style.display = 'none';
                    kursButton.style.display = 'block';
                    courseForm.reset();
                });

                // Event-Listener für das Absenden des Formulars
                courseForm.addEventListener('submit', async (event) => {
                    event.preventDefault();

                    try {
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
                            id: this.ccm.helper.generateKey()
                        };

                        // Erstelle einen eindeutigen Schlüssel für den Kurs
                        const courseId = courseData.id + "";

                        // Speichere den neuen Kurs in der Datenbank
                        await self.store.set({
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
                    } catch (e) {
                        console.error("Fehler beim Hinzufügen eines Kurses:", e);
                        alert("Fehler beim Hinzufügen des Kurses. Bitte versuche es erneut.");
                    }
                });

                // Kurse rendern
                const item_element = this.element.querySelector('#items');
                meineKurse.forEach(kurs => {
                    try {
                        const kursHtml = this.ccm.helper.html(this.html.item, {
                            title: kurs.value.activity || "Unbekannter Kurs",
                            course: kurs.key
                        });
                        console.log("Kurs HTML:", kursHtml);
                        item_element.appendChild(kursHtml);

                        const addButton = kursHtml.querySelector('.add-button');
                        const noteInputContainer = kursHtml.querySelector('.note-input-container');
                        const noteInput = kursHtml.querySelector('.note-input');
                        const noteHeadline = kursHtml.querySelector('.note-headline');
                        const confirmButton = kursHtml.querySelector('.confirm-button');
                        const notesList = kursHtml.querySelector('.notes-list');
                        const courseId = kurs.key;

                        // Lade bestehende Notizen (Weblinks)
                        this.loadNotes(courseId, notesList);

                        // Event-Listener für das Anzeigen des Eingabeformulars
                        addButton.addEventListener('click', () => {
                            noteInputContainer.style.display = 'block';
                            addButton.style.display = 'none';
                        });

                        // Event-Listener für das Bestätigen eines Weblinks
                        confirmButton.addEventListener('click', async () => {
                            const headline = noteHeadline.value.trim();
                            const note = noteInput.value.trim();
                            // Überprüfe, ob der eingegebene Wert eine gültige URL ist
                            const urlPattern = /^(https?:\/\/)?(www\.)?([^\s$.?#]+\.[^\s]{2,})$/i;
                            if (!headline) {
                                alert("Bitte gib eine Überschrift ein.");
                                return;
                            }
                            if (note && urlPattern.test(note)) {
                                // Stelle sicher, dass die URL ein Protokoll hat (falls nicht, füge https:// hinzu)
                                const normalizedNote = note.startsWith('http') ? note : `https://${note}`;
                                // Erstelle ein Objekt mit Überschrift und URL
                                const noteObject = {
                                    headline: headline,
                                    url: normalizedNote
                                };
                                await this.addNote(courseId, noteObject, notesList);
                                noteHeadline.value = '';
                                noteInput.value = '';
                                noteInput.focus();
                                noteInputContainer.style.display = 'none';
                                addButton.style.display = 'block';
                            } else {
                                alert("Bitte gib eine gültige URL ein (z. B. https://example.com oder www.google.de).");
                            }
                        });
                    } catch (e) {
                        console.warn("Fehler beim Rendern eines Kurses:", kurs, e);
                    }
                });
            } catch (e) {
                console.error("Fehler beim Starten der Komponente:", e);
                this.element.innerHTML = '<p>Fehler beim Laden der Kurse. Bitte überprüfe die Datenbank.</p>';
            }
        };

        // Notizen (Weblinks) hinzufügen
        this.addNote = async (courseId, noteObject, notesList) => {
            try {
                const kurs = await self.store.get(courseId + "");
                console.log("Kurs beim Hinzufügen:", kurs);
                if (!kurs || !kurs.value) {
                    throw new Error(`Kurs mit ID ${courseId} nicht gefunden.`);
                }

                // Wenn der Kurs keine Materialien (Weblinks) hat, initialisieren wir das Feld
                if (!kurs.value.materials) {
                    kurs.value.materials = [];
                }

                // Füge das neue Notiz-Objekt (mit Überschrift und URL) zu den Materialien hinzu
                kurs.value.materials.push(noteObject);

                // Speichern der Änderungen in der Datenbank
                await self.store.set({ key: courseId + "", value: kurs.value });
                console.log("Kurs nach Hinzufügen:", kurs);

                // Weblink im Frontend rendern
                this.renderNote(noteObject, notesList, courseId);
            } catch (e) {
                console.error("Fehler beim Hinzufügen eines Weblinks:", e);
            }
        };

        // Notizen (Weblinks) laden
        this.loadNotes = async (courseId, notesList) => {
            try {
                console.log("Lade Notizen für courseId:", courseId);
                const kurs = await self.store.get(courseId + "");
                if (kurs && kurs.value && kurs.value.materials) {
                    // Überprüfe jedes Material
                    const urlPattern = /^(https?:\/\/)?(www\.)?([^\s$.?#]+\.[^\s]{2,})$/i;
                    kurs.value.materials.forEach(note => {
                        // Fall 1: Neues Format (Objekt mit headline und url)
                        if (typeof note === 'object' && note.headline && note.url && urlPattern.test(note.url)) {
                            this.renderNote(note, notesList, courseId);
                        }
                        // Fall 2: Altes Format (nur URL als String)
                        else if (typeof note === 'string' && urlPattern.test(note)) {
                            // Konvertiere in das neue Format mit einer Standard-Überschrift
                            const noteObject = {
                                headline: "Weblink",
                                url: note.startsWith('http') ? note : `https://${note}`
                            };
                            this.renderNote(noteObject, notesList, courseId);
                        } else {
                            console.log(`Ignoriere ungültigen Weblink für Kurs ${courseId}: ${JSON.stringify(note)}`);
                        }
                    });
                }
            } catch (e) {
                console.error("Fehler beim Laden der Notizen:", e);
            }
        };

        // Weblink rendern
        this.renderNote = (noteObject, notesList, courseId) => {
            try {
                const li = document.createElement('li');
                const headline = document.createElement('div');
                headline.className = 'note-headline-text';
                headline.textContent = noteObject.headline;

                const link = document.createElement('a');
                link.href = noteObject.url;
                link.textContent = noteObject.url;
                link.target = "_blank"; // Öffnet den Link in einem neuen Tab
                link.rel = "noopener noreferrer"; // Sicherheitsmaßnahme

                // Erstelle den Delete-Button
                const deleteButton = document.createElement('button');
                deleteButton.className = 'delete-button';
                deleteButton.textContent = 'Delete';

                // Füge die Elemente zum li hinzu
                li.appendChild(headline);
                li.appendChild(link);
                li.appendChild(deleteButton);

                // Füge das li zur Liste hinzu
                notesList.appendChild(li);

                // Event-Listener für den Delete-Button
                deleteButton.addEventListener('click', () => {
                    this.deleteNote(noteObject, notesList, li, courseId);
                });
            } catch (e) {
                console.error("Fehler beim Rendern eines Weblinks:", e);
            }
        };

        // Weblink löschen
        this.deleteNote = async (noteObject, notesList, listItem, courseId) => {
            try {
                const kurs = await self.store.get(courseId + "");
                console.log("Kurs beim Löschen:", kurs);
                if (!kurs || !kurs.value || !kurs.value.materials) return;

                // Entferne das Notiz-Objekt aus den Materialien des Kurses
                const index = kurs.value.materials.findIndex(item =>
                    (typeof item === 'object' && item.headline === noteObject.headline && item.url === noteObject.url) ||
                    (typeof item === 'string' && item === noteObject.url)
                );
                if (index !== -1) {
                    kurs.value.materials.splice(index, 1);
                    await self.store.set({ key: courseId + "", value: kurs.value });
                    console.log("Kurs nach Löschen:", kurs);
                    notesList.removeChild(listItem);
                }
            } catch (e) {
                console.error("Fehler beim Löschen eines Weblinks:", e);
            }
        };

        // Kurse neu rendern (nach Hinzufügen eines neuen Kurses)
        this.renderCourses = async (itemElement) => {
            try {
                itemElement.innerHTML = ''; // Leere die aktuelle Liste

                const alleKurse = await self.store.get({});
                let meineKurse = [];
                if (Array.isArray(alleKurse)) {
                    meineKurse = alleKurse.filter(kurs => {
                        try {
                            return kurs && kurs.value && kurs.value.who === "Weil";
                        } catch (e) {
                            console.warn("Ungültiger Kurseintrag:", kurs, e);
                            return false;
                        }
                    });
                }

                meineKurse.forEach(kurs => {
                    try {
                        const kursHtml = this.ccm.helper.html(this.html.item, {
                            title: kurs.value.activity || "Unbekannter Kurs",
                            course: kurs.key
                        });
                        itemElement.appendChild(kursHtml);

                        const addButton = kursHtml.querySelector('.add-button');
                        const noteInputContainer = kursHtml.querySelector('.note-input-container');
                        const noteInput = kursHtml.querySelector('.note-input');
                        const noteHeadline = kursHtml.querySelector('.note-headline');
                        const confirmButton = kursHtml.querySelector('.confirm-button');
                        const notesList = kursHtml.querySelector('.notes-list');
                        const courseId = kurs.key;

                        this.loadNotes(courseId, notesList);

                        addButton.addEventListener('click', () => {
                            noteInputContainer.style.display = 'block';
                            addButton.style.display = 'none';
                        });

                        confirmButton.addEventListener('click', async () => {
                            const headline = noteHeadline.value.trim();
                            const note = noteInput.value.trim();
                            const urlPattern = /^(https?:\/\/)?(www\.)?([^\s$.?#]+\.[^\s]{2,})$/i;
                            if (!headline) {
                                alert("Bitte gib eine Überschrift ein.");
                                return;
                            }
                            if (note && urlPattern.test(note)) {
                                const normalizedNote = note.startsWith('http') ? note : `https://${note}`;
                                const noteObject = {
                                    headline: headline,
                                    url: normalizedNote
                                };
                                await this.addNote(courseId, noteObject, notesList);
                                noteHeadline.value = '';
                                noteInput.value = '';
                                noteInput.focus();
                                noteInputContainer.style.display = 'none';
                                addButton.style.display = 'block';
                            } else {
                                alert("Bitte gib eine gültige URL ein (z. B. https://example.com oder www.google.de).");
                            }
                        });
                    } catch (e) {
                        console.warn("Fehler beim Rendern eines Kurses:", kurs, e);
                    }
                });
            } catch (e) {
                console.error("Fehler beim Rendern der Kurse:", e);
            }
        };
    }
};
