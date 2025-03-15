ccm.files["ccm.select_courses.js"] = {
    name: "select_courses",
    ccm: "../../libs/ccm/ccm.js",
    config: {
        store: ["ccm.store", { url: "https://ccm2.inf.h-brs.de", name: "tniede2s_mycollection" }],
        css: ["ccm.load", "./style.css"],
        html: {
            main: `
            <div id="user"></div>        
            <h1>%title%</h1>
            <div id="schedule-container">
                <select id="schedule-dropdown">
                    <option value="">-- Stundenplan auswählen --</option>
                    %schedule_options%
                </select>
                <div id="selected-schedule"></div>
                <div id="add-course-container">
                    <select id="add-course-dropdown">
                        <option value="">-- Kurs hinzufügen --</option>
                        %course_options%
                    </select>
                </div>
                <button id="save-button">Speichern</button>
            </div>
            `,
            courseItem: `
            <div class="course-item" data-key="%key%">
                <h3>%activity%</h3>
                <p>Tag: %day%, %from% - %until%, Raum: %room%</p>
                <select class="color-select">
                    <option value="">-- Farbe auswählen --</option>
                    <option value="#ff9999">Hellrot</option>
                    <option value="#ff4d4d">Rot</option>
                    <option value="#ffcc99">Pfirsich</option>
                    <option value="#ff8c1a">Orange</option>
                    <option value="#ffff99">Hellgelb</option>
                    <option value="#ffeb3b">Gelb</option>
                    <option value="#b3ff99">Hellgrün</option>
                    <option value="#4caf50">Grün</option>
                    <option value="#99ccff">Hellblau</option>
                    <option value="#2196f3">Blau</option>
                    <option value="#cc99ff">Lavendel</option>
                    <option value="#9c27b0">Lila</option>
                    <option value="#ff99cc">Rosa</option>
                    <option value="#f06292">Pink</option>
                    <option value="#d3d3d3">Hellgrau</option>
                    <option value="#808080">Grau</option>
                </select>
                <button class="remove-button">Entfernen</button>
            </div>
            `
        },
    },

    Instance: function () {
        let self = this;

        this.start = async () => {
            console.log("Starte select_courses...");

            // Alle verfügbaren Kurse abrufen
            const alleKurse = await self.store.get({});
            console.log("Alle Kurse:", alleKurse);

            // Neue JSON-Struktur für Stundenpläne erstellen
            const groupedCourses = {};
            if (Array.isArray(alleKurse)) {
                alleKurse.forEach(kurs => {
                    if (kurs && kurs.value && kurs.value.course) {
                        const courseName = kurs.value.course; // z. B. "BCSP 1"
                        if (!groupedCourses[courseName]) {
                            groupedCourses[courseName] = [];
                        }
                        groupedCourses[courseName].push(kurs);
                    }
                });
            } else {
                console.error("Fehler: alleKurse ist kein Array:", alleKurse);
            }

            // Ausgabe des neuen JSON-Objekts
            console.log("Grouped Courses JSON:", JSON.stringify(groupedCourses, null, 2));

            // Dropdown-Optionen für Stundenpläne (course-Namen)
            const scheduleOptions = Object.keys(groupedCourses).map(courseName => {
                return `<option value="${courseName}">${courseName}</option>`;
            }).join('');

            // Dropdown-Optionen für alle individuellen Kurse, gruppiert nach course
            const courseOptions = Array.isArray(alleKurse) ? Object.keys(groupedCourses).map(courseName => {
                const courses = groupedCourses[courseName];
                const courseItems = courses
                    .filter(kurs => kurs && kurs.value && kurs.value.activity)
                    .map(kurs => {
                        const label = `${kurs.value.activity} (Tag: ${kurs.value.day}, ${kurs.value.from} - ${kurs.value.until}, Raum: ${kurs.value.room})`;
                        return `<option value="${kurs.key}">${label}</option>`;
                    }).join('');
                return `<optgroup label="${courseName}">${courseItems}</optgroup>`;
            }).join('') : '';

            // Haupt-HTML rendern
            self.element.appendChild(self.ccm.helper.html(self.html.main, {
                title: "Stundenplan bearbeiten",
                schedule_options: scheduleOptions,
                course_options: courseOptions
            }));

            // Container und Elemente
            const scheduleDropdown = self.element.querySelector('#schedule-dropdown');
            const selectedScheduleContainer = self.element.querySelector('#selected-schedule');
            const addCourseDropdown = self.element.querySelector('#add-course-dropdown');
            const saveButton = self.element.querySelector('#save-button');

            // Liste der aktuell ausgewählten Kurse mit Farben
            let currentCourses = [];

            // Funktion zum Rendern eines Kurses
            const renderCourse = (kurs) => {
                const courseHtml = self.ccm.helper.html(self.html.courseItem, {
                    key: kurs.key,
                    activity: kurs.value.activity,
                    day: kurs.value.day,
                    from: kurs.value.from,
                    until: kurs.value.until,
                    room: kurs.value.room
                });
                selectedScheduleContainer.appendChild(courseHtml);

                // Farbauswahl-Logik
                const colorSelect = courseHtml.querySelector('.color-select');
                if (kurs.color) {
                    colorSelect.value = kurs.color; // Vorhandene Farbe setzen
                    courseHtml.style.backgroundColor = kurs.color; // Farbe anwenden
                }
                colorSelect.addEventListener('change', (e) => {
                    const selectedColor = e.target.value;
                    kurs.color = selectedColor; // Farbe im Objekt speichern
                    courseHtml.style.backgroundColor = selectedColor || ''; // Farbe anwenden oder zurücksetzen
                    console.log("Farbe für Kurs", kurs.key, "geändert zu:", selectedColor);
                });

                // Entfernen-Button-Logik
                courseHtml.querySelector('.remove-button').addEventListener('click', () => {
                    const key = courseHtml.getAttribute('data-key');
                    currentCourses = currentCourses.filter(k => k.key !== key);
                    selectedScheduleContainer.removeChild(courseHtml);
                    console.log("Entfernter Kurs, neue Liste:", currentCourses);
                });
            };

            // Event-Listener für das Stundenplan-Dropdown
            scheduleDropdown.addEventListener('change', (e) => {
                const selectedSchedule = e.target.value;
                selectedScheduleContainer.innerHTML = ''; // Alte Anzeige löschen
                currentCourses = []; // Zurücksetzen

                if (selectedSchedule) {
                    currentCourses = [...groupedCourses[selectedSchedule]];
                    console.log("Ausgewählter Stundenplan:", selectedSchedule, currentCourses);

                    // Anzeige der Kurse des ausgewählten Stundenplans
                    currentCourses.forEach(renderCourse);
                }
            });

            // Event-Listener für das Hinzufügen eines Kurses
            addCourseDropdown.addEventListener('change', (e) => {
                const selectedCourseKey = e.target.value;
                if (selectedCourseKey) {
                    const kurs = alleKurse.find(k => k.key === selectedCourseKey);
                    if (kurs && kurs.value) {
                        // Nur hinzufügen, wenn der Kurs nicht bereits in der Liste ist
                        if (!currentCourses.some(k => k.key === kurs.key)) {
                            currentCourses.push(kurs);
                            console.log("Hinzugefügter Kurs:", kurs);
                            renderCourse(kurs);
                        } else {
                            console.log("Kurs bereits in der Liste:", kurs);
                        }
                    }

                    // Dropdown zurücksetzen
                    addCourseDropdown.value = '';
                }
            });

            // Event-Listener für den Speichern-Button
            saveButton.addEventListener('click', async () => {
                const studentId = "tmiede2s"; // Beispiel-Kürzel, später anpassbar
                const scheduleData = {
                    key: studentId,
                    value: {
                        student_id: studentId,
                        courses: currentCourses.map(kurs => ({
                            key: kurs.key,
                            color: kurs.color || "" // Farbe speichern, leer wenn nicht gesetzt
                        }))
                    }
                };

                console.log("Zu speicherndes JSON:", JSON.stringify(scheduleData, null, 2));

                // Speichern im Store
                await self.store.set(scheduleData);
                console.log("Stundenplan gespeichert unter:", studentId);
                alert("Stundenplan erfolgreich gespeichert!");
            });
        };
    }
};
