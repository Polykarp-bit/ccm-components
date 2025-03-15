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
                </select>
                <div id="selected-schedule"></div>
                <div id="add-course-container">
                    <select id="add-course-dropdown">
                        <option value="">-- Kurs hinzufügen --</option>
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

            // Dummy student ID
            const studentId = "tmiede2s";

            // Fetch the saved schedule for the user
            const savedSchedule = await self.store.get(studentId);
            console.log("Saved schedule for user", studentId, ":", savedSchedule);

            // Initialize currentCourses with saved courses (if any)
            let currentCourses = [];
            let preSelectedSchedule = null;
            if (savedSchedule && savedSchedule.value && savedSchedule.value.courses) {
                // Map the saved courses to their full data from the store
                const savedCourseKeys = savedSchedule.value.courses.map(course => course.key);
                const savedCoursesWithColors = savedSchedule.value.courses;

                // We'll fetch the full course data later after loading all courses
                currentCourses = savedCoursesWithColors;
                // Determine the pre-selected schedule based on the first course
                if (savedCoursesWithColors.length > 0) {
                    preSelectedSchedule = savedCoursesWithColors[0].course; // Will be set after fetching all courses
                }
            }

            // Alle verfügbaren Kurse abrufen
            const alleKurse = await self.store.get({});
            console.log("Alle Kurse:", alleKurse);

            // Map saved courses to their full data now that we have alleKurse
            if (currentCourses.length > 0) {
                currentCourses = currentCourses.map(savedCourse => {
                    const fullCourse = alleKurse.find(k => k.key === savedCourse.key);
                    if (fullCourse) {
                        return { ...fullCourse, color: savedCourse.color };
                    }
                    return null;
                }).filter(course => course !== null);

                // Determine the pre-selected schedule based on the first course
                if (currentCourses.length > 0 && currentCourses[0].value && currentCourses[0].value.course) {
                    preSelectedSchedule = currentCourses[0].value.course;
                }
            }

            // Neue JSON-Struktur für Stundenpläne erstellen
            const groupedCourses = {};
            if (Array.isArray(alleKurse)) {
                alleKurse.forEach(kurs => {
                    if (kurs && kurs.value && kurs.value.course) {
                        const courseName = kurs.value.course;
                        if (!groupedCourses[courseName]) {
                            groupedCourses[courseName] = [];
                        }
                        groupedCourses[courseName].push(kurs);
                    }
                });
            } else {
                console.error("Fehler: alleKurse ist kein Array:", alleKurse);
            }

            console.log("Grouped Courses JSON:", JSON.stringify(groupedCourses, null, 2));

            // Dropdown-Optionen für Stundenpläne
            const scheduleOptions = Object.keys(groupedCourses).map(courseName => {
                return `<option value="${courseName}">${courseName}</option>`;
            }).join('');
            console.log("Schedule Options:", scheduleOptions);

            // Dropdown-Optionen für alle individuellen Kurse
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
            console.log("Course Options:", courseOptions);

            // Haupt-HTML rendern
            const mainHtml = self.ccm.helper.html(self.html.main, {
                title: "Stundenplan bearbeiten"
            });
            console.log("self.element before append:", self.element);
            self.element.appendChild(mainHtml);
            console.log("Rendered HTML:", self.element.innerHTML);

            // Manually insert options into the <select> elements
            const scheduleDropdown = self.element.querySelector('#schedule-dropdown');
            const addCourseDropdown = self.element.querySelector('#add-course-dropdown');
            scheduleDropdown.innerHTML = `<option value="">-- Stundenplan auswählen --</option>${scheduleOptions}`;
            addCourseDropdown.innerHTML = `<option value="">-- Kurs hinzufügen --</option>${courseOptions}`;

            // Force visibility
            const scheduleContainer = self.element.querySelector('#schedule-container');
            scheduleContainer.style.display = 'block';
            scheduleContainer.style.visibility = 'visible';

            // Remove loading spinner
            const loadingSpinner = self.element.querySelector('.ccm_loading');
            if (loadingSpinner) {
                loadingSpinner.style.display = 'none';
            }

            // Container und Elemente
            const selectedScheduleContainer = self.element.querySelector('#selected-schedule');
            const saveButton = self.element.querySelector('#save-button');

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
                    colorSelect.value = kurs.color;
                    courseHtml.style.backgroundColor = kurs.color;
                }
                colorSelect.addEventListener('change', (e) => {
                    const selectedColor = e.target.value;
                    kurs.color = selectedColor;
                    courseHtml.style.backgroundColor = selectedColor || '';
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

            // Pre-select the schedule and render saved courses
            if (preSelectedSchedule && groupedCourses[preSelectedSchedule]) {
                scheduleDropdown.value = preSelectedSchedule;
                currentCourses.forEach(renderCourse);
                console.log("Pre-selected schedule:", preSelectedSchedule, "with courses:", currentCourses);
            }

            // Event-Listener für das Stundenplan-Dropdown
            scheduleDropdown.addEventListener('change', (e) => {
                const selectedSchedule = e.target.value;
                selectedScheduleContainer.innerHTML = '';
                currentCourses = [];

                if (selectedSchedule) {
                    currentCourses = [...groupedCourses[selectedSchedule]];
                    console.log("Ausgewählter Stundenplan:", selectedSchedule, currentCourses);
                    currentCourses.forEach(renderCourse);
                }
            });

            // Event-Listener für das Hinzufügen eines Kurses
            addCourseDropdown.addEventListener('change', (e) => {
                const selectedCourseKey = e.target.value;
                if (selectedCourseKey) {
                    const kurs = alleKurse.find(k => k.key === selectedCourseKey);
                    if (kurs && kurs.value) {
                        if (!currentCourses.some(k => k.key === kurs.key)) {
                            currentCourses.push(kurs);
                            console.log("Hinzugefügter Kurs:", kurs);
                            renderCourse(kurs);
                        } else {
                            console.log("Kurs bereits in der Liste:", kurs);
                        }
                    }
                    addCourseDropdown.value = '';
                }
            });

            // Event-Listener für den Speichern-Button
            saveButton.addEventListener('click', async () => {
                const scheduleData = {
                    key: studentId,
                    value: {
                        student_id: studentId,
                        courses: currentCourses.map(kurs => ({
                            key: kurs.key,
                            color: kurs.color || "",
                            course: kurs.value.course // Save the course name for pre-selection
                        }))
                    }
                };

                console.log("Zu speicherndes JSON:", JSON.stringify(scheduleData, null, 2));
                await self.store.set(scheduleData);
                console.log("Stundenplan gespeichert unter:", studentId);
                alert("Stundenplan erfolgreich gespeichert!");
            });
        };
    }
};
