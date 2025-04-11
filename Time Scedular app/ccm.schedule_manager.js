ccm.files["ccm.schedule_manager.js"] = {
    name: "schedule_manager",
    ccm: "../../libs/ccm/ccm.js",
    config: {
        studentStore: ["ccm.store", { url: "https://ccm2.inf.h-brs.de", name: "tniede2s_student_schedules" }],
        courseStore: ["ccm.store", { url: "https://ccm2.inf.h-brs.de", name: "tniede2s_teacher_courses" }],
        studentCourseStore: ["ccm.store", { url: "https://ccm2.inf.h-brs.de", name: "tniede2s_student_courses" }],
        css: ["ccm.load", "./style.css"],
        helper: ["ccm.load", "https://ccmjs.github.io/akless-components/modules/versions/helper-8.4.2.min.mjs"],
        html: {
            editView: {
                main: `
                    <div id="user"></div>        
                    <h1>%title%</h1>
                    <div id="schedule-container">
                        <div class="add-course-header">
                            <h2>Füge einen Kurs hinzu</h2>
                            <button id="KursButton">Kurs Hinzufügen</button>
                        </div>
                        <div id="course-form-container" style="display: none;">
                            <form id="course-form">
                                <div class="form-group">
                                    <label for="course">Kursname:</label>
                                    <input type="text" id="course" name="course" placeholder="z. B. Einführung in die" required>
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
                                    <label for="period">Zeitraum:</label>
                                    <input type="text" id="period" name="period" placeholder="z. B. 03.04.2025-26.06.2025" required>
                                </div>
                                <button type="submit">Kurs hinzufügen</button>
                                <button type="button" class="cancel-button">Abbrechen</button>
                            </form>
                        </div>
                        <div class="dropdown-container">
                            <button id="course-dropdown-button" class="dropdown-button">Kurs auswählen ▼</button>
                            <div id="course-dropdown-content" class="dropdown-content">
                                <input type="text" id="course-search" placeholder="Kurs suchen...">
                                <div id="course-checkbox-list"></div>
                            </div>
                        </div>
                        <h2>Ausgewählter Stundenplan</h2>
                        <div id="selected-schedule"></div>
                    </div>
                `,
                courseItem: `
                    <div class="course-item" data-key="%key%">
                        <h3>%course%</h3>
                        <p>Tag: %day%, %from% - %until%, Raum: %room%</p>
                        <div class="course-note" id="course-note-container-%key%">
                            <!-- Notiz oder Button wird hier dynamisch eingefügt -->
                        </div>
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
                        <div class="course-actions">
                            <button class="remove-button">Entfernen</button>
                        </div>
                        <div class="course-links">
                            <h4>Weblinks:</h4>
                            <ul class="links-list"></ul>
                        </div>
                    </div>
                `
            },
            scheduleView: {
                main: `
                    <div class="container">
                        <div class="section">
                            <h2>Stundenplan für %studentId%</h2>
                            <div class="week-schedule">
                                %scheduleContent%
                            </div>
                        </div>
                        <div id="modal" class="modal">
                            <div class="modal-content">
                                <span class="close">×</span>
                                <h3>Apps für ausgewählte Veranstaltung</h3>
                                <div id="modal-apps" class="modal-apps"></div>
                            </div>
                        </div>
                    </div>
                `
            }
        }
    },

    Instance: function () {
        let self = this;
        const studentId = "tmiede2s";
        let currentCourses = [];
        let isEditMode = false;
        let toggleButton;

        // Hilfsfunktionen
        const normalizeDay = (day) => {
            const dayMap = {
                "mo": "Montag", "montag": "Montag",
                "di": "Dienstag", "dienstag": "Dienstag",
                "mi": "Mittwoch", "mittwoch": "Mittwoch",
                "do": "Donnerstag", "donnerstag": "Donnerstag",
                "fr": "Freitag", "freitag": "Freitag",
                "sa": "Samstag", "samstag": "Samstag",
                "so": "Sonntag", "sonntag": "Sonntag"
            };
            return dayMap[day.toLowerCase()] || "Unbekannt";
        };

        const timeToMinutes = (time) => {
            const [hours, minutes] = time.split(':').map(Number);
            return hours * 60 + minutes;
        };

        // Kurs hinzufügen
        const addCourse = async (form) => {
            try {
                const courseData = {
                    course: form.querySelector('#course').value,
                    day: form.querySelector('#day').value,
                    from: form.querySelector('#from').value,
                    until: form.querySelector('#until').value,
                    room: form.querySelector('#room').value,
                    period: form.querySelector('#period').value,
                    who: studentId,
                    id: self.ccm.helper.generateKey(),
                    isBlock: false,
                    materials: [],
                    createdBy: "student",
                    note: ""
                };

                const courseId = courseData.id;
                await self.studentCourseStore.set({ key: courseId, value: courseData });
                console.log("Neuer studentischer Kurs hinzugefügt:", courseData);

                // Stelle sicher, dass der neue Kurs die richtige Struktur hat
                const newCourse = {
                    key: courseId,
                    value: courseData,
                    color: "",
                    note: ""
                };
                return newCourse;
            } catch (e) {
                console.error("Fehler beim Hinzufügen eines studentischen Kurses:", e);
                throw new Error("Fehler beim Hinzufügen des Kurses. Bitte versuche es erneut.");
            }
        };

        // Kurse speichern
        const saveCourses = async () => {
            const scheduleData = {
                key: studentId,
                value: {
                    student_id: studentId,
                    courses: currentCourses
                        .filter(kurs => kurs && kurs.value && kurs.value.course) // Nur Kurse mit gültiger value-Eigenschaft
                        .map(kurs => ({
                            key: kurs.key,
                            color: kurs.color || "",
                            course: kurs.value.course,
                            note: kurs.note || ""
                        }))
                }
            };
            await self.studentStore.set(scheduleData);
            console.log("Kurse automatisch gespeichert:", scheduleData);
        };

        // Notiz hinzufügen/aktualisieren
        const addNoteToCourse = async (courseKey, note) => {
            const course = currentCourses.find(c => c.key === courseKey);
            if (course) {
                course.note = note;
                await saveCourses();
            }
        };

        // Kurs rendern
        const renderCourse = (kurs, container, updateParentCheckbox) => {
            const courseHtml = self.ccm.helper.html(self.html.editView.courseItem, {
                key: kurs.key,
                course: kurs.value.course || "Unbekannter Kurs",
                day: kurs.value.day || "Unbekannt",
                from: kurs.value.from || "Unbekannt",
                until: kurs.value.until || "Unbekannt",
                room: kurs.value.room || "Unbekannt"
            });

            if (kurs.value.isBlock) {
                const blockLabel = document.createElement('span');
                blockLabel.textContent = 'Blockkurs';
                blockLabel.className = 'block-course-label';
                courseHtml.querySelector('h3').appendChild(blockLabel);
            }

            container.appendChild(courseHtml);

            // Notiz-Container
            const noteContainer = courseHtml.querySelector(`#course-note-container-${kurs.key}`);

            // Prüfen, ob eine Notiz existiert
            if (kurs.note && kurs.note.trim() !== "") {
                // Notiz existiert: Zeige das Textarea
                const noteHtml = `
                    <label for="course-note-${kurs.key}">Notiz:</label>
                    <textarea class="course-note-textarea" id="course-note-${kurs.key}" placeholder="Deine Notiz...">${kurs.note}</textarea>
                `;
                noteContainer.innerHTML = noteHtml;

                const noteTextarea = noteContainer.querySelector(`#course-note-${kurs.key}`);
                noteTextarea.addEventListener('blur', async () => {
                    const newNote = noteTextarea.value.trim();
                    await addNoteToCourse(kurs.key, newNote);
                    // Wenn die Notiz leer ist, entferne das Textarea und zeige den Button
                    if (!newNote) {
                        noteContainer.innerHTML = `<button class="add-note-button">Notiz hinzufügen</button>`;
                        const addNoteButton = noteContainer.querySelector('.add-note-button');
                        addNoteButton.addEventListener('click', () => {
                            noteContainer.innerHTML = `
                                <label for="course-note-${kurs.key}">Notiz:</label>
                                <textarea class="course-note-textarea" id="course-note-${kurs.key}" placeholder="Deine Notiz..."></textarea>
                            `;
                            const newTextarea = noteContainer.querySelector(`#course-note-${kurs.key}`);
                            newTextarea.focus();
                            newTextarea.addEventListener('blur', async () => {
                                const updatedNote = newTextarea.value.trim();
                                await addNoteToCourse(kurs.key, updatedNote);
                                if (!updatedNote) {
                                    noteContainer.innerHTML = `<button class="add-note-button">Notiz hinzufügen</button>`;
                                    const newAddNoteButton = noteContainer.querySelector('.add-note-button');
                                    newAddNoteButton.addEventListener('click', arguments.callee);
                                }
                            });
                        });
                    }
                });
            } else {
                // Keine Notiz: Zeige den "Notiz hinzufügen"-Button
                noteContainer.innerHTML = `<button class="add-note-button">Notiz hinzufügen</button>`;
                const addNoteButton = noteContainer.querySelector('.add-note-button');
                addNoteButton.addEventListener('click', () => {
                    noteContainer.innerHTML = `
                        <label for="course-note-${kurs.key}">Notiz:</label>
                        <textarea class="course-note-textarea" id="course-note-${kurs.key}" placeholder="Deine Notiz..."></textarea>
                    `;
                    const newTextarea = noteContainer.querySelector(`#course-note-${kurs.key}`);
                    newTextarea.focus();
                    newTextarea.addEventListener('blur', async () => {
                        const newNote = newTextarea.value.trim();
                        await addNoteToCourse(kurs.key, newNote);
                        if (!newNote) {
                            noteContainer.innerHTML = `<button class="add-note-button">Notiz hinzufügen</button>`;
                            const newAddNoteButton = noteContainer.querySelector('.add-note-button');
                            newAddNoteButton.addEventListener('click', arguments.callee);
                        }
                    });
                });
            }

            const colorSelect = courseHtml.querySelector('.color-select');
            if (kurs.color) {
                colorSelect.value = kurs.color;
                courseHtml.style.backgroundColor = kurs.color;
            }

            colorSelect.addEventListener('change', async (e) => {
                kurs.color = e.target.value;
                courseHtml.style.backgroundColor = e.target.value || '';
                const courseInList = currentCourses.find(c => c.key === kurs.key);
                if (courseInList) {
                    courseInList.color = kurs.color;
                    await saveCourses();
                }
            });

            courseHtml.querySelector('.remove-button').addEventListener('click', async () => {
                currentCourses = currentCourses.filter(k => k.key !== kurs.key);
                container.removeChild(courseHtml);
                const checkbox = document.querySelector(`.subcourse-checkbox[data-key="${kurs.key}"]`);
                if (checkbox) checkbox.checked = false;
                if (updateParentCheckbox) updateParentCheckbox(kurs.value.course);
                await saveCourses();
            });

            // Weblinks rendern und Sichtbarkeit steuern
            const linksContainer = courseHtml.querySelector('.links-list');
            const courseLinksSection = courseHtml.querySelector('.course-links');
            if (kurs.value.materials && kurs.value.materials.length > 0) {
                const urlPattern = /^(https?:\/\/)?(www\.)?([^\s$.?#]+\.[^\s]{2,})$/i;
                const links = kurs.value.materials.filter(material =>
                    typeof material === 'string' ? urlPattern.test(material) : material.url && urlPattern.test(material.url)
                );

                if (links.length > 0) {
                    links.forEach(material => {
                        const headline = typeof material === 'object' && material.headline ? material.headline : 'Weblink';
                        const url = typeof material === 'string' ? material : material.url;
                        const normalizedUrl = url.startsWith('http') ? url : `https://${url}`;
                        const li = document.createElement('li');
                        li.innerHTML = `<a href="${normalizedUrl}" target="_blank" rel="noopener noreferrer">${headline}</a>`;
                        linksContainer.appendChild(li);
                    });
                    courseLinksSection.style.display = 'block';
                } else {
                    courseLinksSection.style.display = 'none';
                }
            } else {
                courseLinksSection.style.display = 'none';
            }
        };

        // Stundenplan rendern
        const renderSchedule = async () => {
            const userConfig = await self.studentStore.get(studentId);
            const schedule = {};

            if (userConfig && userConfig.value && userConfig.value.courses) {
                const teacherCourses = await self.courseStore.get({});
                const studentCourses = await self.studentCourseStore.get({});
                const ownStudentCourses = studentCourses.filter(kurs => kurs.value.who === studentId);
                const allCourses = [...teacherCourses, ...ownStudentCourses];

                userConfig.value.courses.forEach(course => {
                    const kurs = allCourses.find(k => k.key === course.key);
                    if (kurs && kurs.value) {
                        const normalizedDay = normalizeDay(kurs.value.day || "Unbekannt");
                        if (!schedule[normalizedDay]) schedule[normalizedDay] = [];
                        schedule[normalizedDay].push({
                            title: kurs.value.course || "Unbekannter Kurs",
                            time: `${kurs.value.from} - ${kurs.value.until}`,
                            room: kurs.value.room,
                            color: course.color || "#F0F0F0",
                            courseId: kurs.key,
                            isBlock: kurs.value.isBlock || false,
                            period: kurs.value.period || "Kein Zeitraum angegeben",
                            note: course.note || ""
                        });
                    }
                });
            }

            Object.keys(schedule).forEach(day => {
                schedule[day].sort((a, b) => timeToMinutes(a.time.split(' - ')[0]) - timeToMinutes(b.time.split(' - ')[0]));
            });

            const dayOrder = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"];
            const alwaysShowDays = dayOrder.slice(0, 5);
            const optionalDays = dayOrder.slice(5).filter(day => schedule[day] && schedule[day].length > 0);
            const daysToDisplay = [...alwaysShowDays, ...optionalDays];

            const scheduleContent = daysToDisplay.map(day => `
                <div class="day">
                    <h3>${day}</h3>
                    ${schedule[day] && schedule[day].length > 0 ? schedule[day].map(event => `
                        <div class="event ${event.isBlock ? 'block-course' : ''}" data-course-id="${event.courseId}" style="background-color: ${event.color};">
                            <div class="event-header">
                                <strong>${event.title}${event.isBlock ? ' (Blockkurs)' : ''}</strong>
                                ${event.note && event.note.trim() !== "" ? `
                                    <span class="note-icon">📝
                                        <span class="tooltip">${event.note}</span>
                                    </span>
                                ` : ''}
                            </div>
                            <span>${event.time}</span><br>
                            <span>Raum: ${event.room}</span>
                            ${event.isBlock ? `<br><span>Zeitraum: ${event.period}</span>` : ''}
                        </div>
                    `).join('') : '<p>Keine Kurse an diesem Tag.</p>'}
                </div>
            `).join('');

            return self.ccm.helper.html(self.html.scheduleView.main, { studentId, scheduleContent });
        };

        // Dropdown und Suche initialisieren
        const initializeDropdownAndSearch = (dropdownButton, dropdownContent, searchInput, courseCheckboxList) => {
            document.addEventListener('click', (event) => {
                if (!dropdownContent.contains(event.target) && !dropdownButton.contains(event.target)) {
                    dropdownContent.style.display = 'none';
                    dropdownButton.textContent = 'Kurs auswählen ▼';
                }
            });

            dropdownButton.onclick = (event) => {
                event.stopPropagation();
                const isOpen = dropdownContent.style.display === 'block';
                dropdownContent.style.display = isOpen ? 'none' : 'block';
                dropdownButton.textContent = isOpen ? 'Kurs auswählen ▼' : 'Kurs auswählen ▲';
                if (!isOpen) searchInput.focus();
            };

            searchInput.addEventListener('input', () => {
                const searchTerm = searchInput.value.toLowerCase();
                const courseGroups = courseCheckboxList.querySelectorAll('.course-group');
                courseGroups.forEach(group => {
                    const courseName = group.querySelector('.course-checkbox').dataset.course.toLowerCase();
                    const subCourses = group.querySelectorAll('.subcourse-item');
                    let hasVisibleSubCourse = false;

                    subCourses.forEach(subCourse => {
                        const label = subCourse.querySelector('label').textContent.toLowerCase();
                        subCourse.style.display = (courseName.includes(searchTerm) || label.includes(searchTerm)) ? 'flex' : 'none';
                        if (subCourse.style.display === 'flex') hasVisibleSubCourse = true;
                    });

                    group.style.display = hasVisibleSubCourse ? 'block' : 'none';
                });
            });
        };

        // Startmethode
        this.start = async () => {
            console.log("Starte schedule_manager...");

            toggleButton = document.createElement('button');
            toggleButton.id = 'toggle-view-button';
            toggleButton.style.position = 'absolute';
            toggleButton.style.top = '10px';
            toggleButton.style.right = '10px';
            toggleButton.addEventListener('click', async () => {
                isEditMode = !isEditMode;
                await self.renderView();
            });
            self.element.appendChild(toggleButton);

            const savedSchedule = await self.studentStore.get(studentId);
            console.log("Gespeicherte Konfiguration für", studentId, ":", savedSchedule);

            if (savedSchedule && savedSchedule.value && savedSchedule.value.courses) {
                // Lade alle verfügbaren Kurse
                const teacherCourses = await self.courseStore.get({});
                const studentCourses = await self.studentCourseStore.get({});
                const allCourses = [...teacherCourses, ...studentCourses];

                // Bereinige currentCourses: Nur Kurse, die noch existieren und eine value-Eigenschaft haben
                currentCourses = savedSchedule.value.courses
                    .filter(course => {
                        const fullCourse = allCourses.find(c => c.key === course.key);
                        return fullCourse && fullCourse.value && fullCourse.value.course;
                    })
                    .map(course => {
                        const fullCourse = allCourses.find(c => c.key === course.key);
                        return {
                            key: course.key,
                            color: course.color,
                            course: course.course,
                            note: course.note || (course.notes && course.notes.length > 0 ? course.notes[course.notes.length - 1] : ""),
                            value: fullCourse.value // Stelle sicher, dass value gesetzt ist
                        };
                    });
            } else {
                isEditMode = true;
            }

            await self.renderView();
        };

        // View rendern
        this.renderView = async () => {
            const mainContent = self.element.querySelector('#main-content');
            if (mainContent) mainContent.remove();

            const contentDiv = document.createElement('div');
            contentDiv.id = 'main-content';
            self.element.insertBefore(contentDiv, toggleButton);

            toggleButton.textContent = isEditMode ? 'Zur Stundenplanansicht' : 'Settings';

            if (isEditMode) {
                await self.renderEditView(contentDiv);
            } else {
                await self.renderScheduleView(contentDiv);
            }
        };

        // Edit-Ansicht rendern
        this.renderEditView = async (container) => {
            const mainHtml = self.ccm.helper.html(self.html.editView.main, { title: "Stundenplan bearbeiten" });
            container.appendChild(mainHtml);

            const courseFormContainer = container.querySelector('#course-form-container');
            const courseForm = container.querySelector('#course-form');
            const kursButton = container.querySelector('#KursButton');
            const cancelButton = container.querySelector('.cancel-button');
            const courseCheckboxList = container.querySelector('#course-checkbox-list');
            const selectedScheduleContainer = container.querySelector('#selected-schedule');
            const dropdownButton = container.querySelector('#course-dropdown-button');
            const dropdownContent = container.querySelector('#course-dropdown-content');
            const searchInput = container.querySelector('#course-search');

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
                try {
                    const newCourse = await addCourse(courseForm);
                    currentCourses.push(newCourse);
                    courseFormContainer.style.display = 'none';
                    kursButton.style.display = 'block';
                    courseForm.reset();
                    await self.renderEditView(container);
                } catch (e) {
                    console.error("Fehler beim Hinzufügen eines Kurses:", e);
                    alert(e.message);
                }
            });

            const teacherCourses = await self.courseStore.get({});
            const studentCourses = await self.studentCourseStore.get({});
            const ownStudentCourses = studentCourses.filter(kurs => kurs.value.who === studentId);
            const allCourses = [...teacherCourses, ...ownStudentCourses];
            const searchCourses = teacherCourses;

            const groupedCourses = {};
            searchCourses.forEach(kurs => {
                if (kurs && kurs.value && kurs.value.course) {
                    const courseName = kurs.value.course;
                    groupedCourses[courseName] = groupedCourses[courseName] || [];
                    groupedCourses[courseName].push(kurs);
                }
            });

            const updateParentCheckbox = (courseName) => {
                const parentCheckbox = courseCheckboxList.querySelector(`.course-checkbox[data-course="${courseName}"]`);
                const subCheckboxes = courseCheckboxList.querySelectorAll(`.subcourse-checkbox[data-parent="${courseName}"]`);
                if (!parentCheckbox) return;
                const allChecked = Array.from(subCheckboxes).every(sub => sub.checked);
                const someChecked = Array.from(subCheckboxes).some(sub => sub.checked);
                parentCheckbox.checked = allChecked;
                parentCheckbox.indeterminate = someChecked && !allChecked;
            };

            const courseListHtml = Object.keys(groupedCourses).map(courseName => {
                const courses = groupedCourses[courseName];
                const subCoursesHtml = courses
                    .filter(kurs => kurs && kurs.value)
                    .map(kurs => `
                        <div class="subcourse-item">
                            <input type="checkbox" class="subcourse-checkbox" data-key="${kurs.key}" data-parent="${courseName}" ${currentCourses.some(c => c.key === kurs.key) ? 'checked' : ''}>
                            <label>${kurs.value.course} (Tag: ${kurs.value.day}, ${kurs.value.from} - ${kurs.value.until}, Raum: ${kurs.value.room})${kurs.value.createdBy === "student" ? ' [Student]' : ''}</label>
                        </div>
                    `).join('');
                return `
                    <div class="course-group">
                        <div class="course-item">
                            <input type="checkbox" class="course-checkbox" data-course="${courseName}" ${currentCourses.some(c => c.course === courseName && groupedCourses[courseName].every(k => currentCourses.some(ck => ck.key === k.key))) ? 'checked' : ''}>
                            <label>${courseName}</label>
                        </div>
                        <div class="subcourses">${subCoursesHtml}</div>
                    </div>
                `;
            }).join('');

            courseCheckboxList.innerHTML = courseListHtml;

            initializeDropdownAndSearch(dropdownButton, dropdownContent, searchInput, courseCheckboxList);

            currentCourses.forEach(course => {
                const fullCourse = allCourses.find(k => k.key === course.key);
                if (fullCourse) {
                    fullCourse.color = course.color;
                    fullCourse.note = course.note || "";
                    renderCourse(fullCourse, selectedScheduleContainer, updateParentCheckbox);
                    const checkbox = courseCheckboxList.querySelector(`.subcourse-checkbox[data-key="${course.key}"]`);
                    if (checkbox) checkbox.checked = true;
                    if (fullCourse.value.createdBy !== "student") updateParentCheckbox(fullCourse.value.course);
                }
            });

            courseCheckboxList.querySelectorAll('.course-checkbox').forEach(checkbox => {
                checkbox.addEventListener('change', async (e) => {
                    const courseName = e.target.dataset.course;
                    const subCheckboxes = courseCheckboxList.querySelectorAll(`.subcourse-checkbox[data-parent="${courseName}"]`);
                    subCheckboxes.forEach(subCheckbox => {
                        subCheckbox.checked = e.target.checked;
                        const kursKey = subCheckbox.dataset.key;
                        const kurs = allCourses.find(k => k.key === kursKey);
                        if (e.target.checked && !currentCourses.some(c => c.key === kursKey)) {
                            currentCourses.push(kurs);
                            renderCourse(kurs, selectedScheduleContainer, updateParentCheckbox);
                        } else if (!e.target.checked) {
                            currentCourses = currentCourses.filter(c => c.key !== kursKey);
                            const courseElement = selectedScheduleContainer.querySelector(`.course-item[data-key="${kursKey}"]`);
                            if (courseElement) selectedScheduleContainer.removeChild(courseElement);
                        }
                    });
                    await saveCourses();
                });
            });

            courseCheckboxList.querySelectorAll('.subcourse-checkbox').forEach(checkbox => {
                checkbox.addEventListener('change', async (e) => {
                    const kursKey = e.target.dataset.key;
                    const kurs = allCourses.find(k => k.key === kursKey);
                    if (e.target.checked && !currentCourses.some(c => c.key === kursKey)) {
                        currentCourses.push(kurs);
                        renderCourse(kurs, selectedScheduleContainer, updateParentCheckbox);
                    } else if (!e.target.checked) {
                        currentCourses = currentCourses.filter(c => c.key !== kursKey);
                        const courseElement = selectedScheduleContainer.querySelector(`.course-item[data-key="${kursKey}"]`);
                        if (courseElement) selectedScheduleContainer.removeChild(courseElement);
                    }
                    updateParentCheckbox(kurs.value.course);
                    await saveCourses();
                });
            });
        };

        // Schedule-Ansicht rendern
        this.renderScheduleView = async (container) => {
            const scheduleHtml = await renderSchedule();
            container.appendChild(scheduleHtml);

            container.querySelectorAll('.event').forEach(event => {
                event.addEventListener('click', async () => {
                    const courseId = event.getAttribute('data-course-id');
                    const modalApps = container.querySelector('#modal-apps');
                    modalApps.innerHTML = '<p>Lade Links...</p>';
                    await self.openModal(courseId, modalApps);
                });
            });

            container.querySelector('.close').addEventListener('click', self.closeModal);
            window.addEventListener('click', (event) => {
                if (event.target === container.querySelector('#modal')) self.closeModal();
            });
        };

        // Modal öffnen
        this.openModal = async (courseId, modalApps) => {
            let kurs = await self.courseStore.get(courseId) || await self.studentCourseStore.get(courseId);
            if (!kurs || !kurs.value || !kurs.value.materials) {
                modalApps.innerHTML = '<p>Keine Links vorhanden.</p>';
                self.element.querySelector('#modal').style.display = 'block';
                return;
            }

            const urlPattern = /^(https?:\/\/)?(www\.)?([^\s$.?#]+\.[^\s]{2,})$/i;
            const links = kurs.value.materials.filter(material =>
                typeof material === 'string' ? urlPattern.test(material) : material.url && urlPattern.test(material.url)
            );

            if (links.length === 0) {
                modalApps.innerHTML = '<p>Keine Links vorhanden.</p>';
                self.element.querySelector('#modal').style.display = 'block';
                return;
            }

            if (links.length === 1) {
                const link = typeof links[0] === 'string' ? links[0] : links[0].url;
                window.open(link.startsWith('http') ? link : `https://${link}`, '_blank');
                return;
            }

            modalApps.innerHTML = links.map(material => {
                const headline = typeof material === 'object' && material.headline ? material.headline : 'Weblink';
                const url = typeof material === 'string' ? material : material.url;
                const normalizedUrl = url.startsWith('http') ? url : `https://${url}`;
                return `
                    <div class="modal-link">
                        <strong>${headline}</strong><br>
                        <a href="${normalizedUrl}" target="_blank" rel="noopener noreferrer">${normalizedUrl}</a>
                    </div>
                `;
            }).join('');

            self.element.querySelector('#modal').style.display = 'block';
        };

        // Modal schließen
        this.closeModal = () => {
            const modal = self.element.querySelector('#modal');
            if (modal) modal.style.display = 'none';
            else console.error("Modal element not found in closeModal!");
        };
    }
};
