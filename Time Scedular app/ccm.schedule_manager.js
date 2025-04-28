ccm.files["ccm.schedule_manager.js"] = {
    name: "schedule_manager",
    ccm: "https://ccmjs.github.io/ccm/ccm.js",
    config: {
        studentStore: ["ccm.store", {url: "https://ccm2.inf.h-brs.de", name: "tniede2s_student_schedules"}],
        courseStore: ["ccm.store", {url: "https://ccm2.inf.h-brs.de", name: "tniede2s_teacher_courses"}],
        studentCourseStore: ["ccm.store", {url: "https://ccm2.inf.h-brs.de", name: "tniede2s_student_courses"}],
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
                        <div id="events-container">
                          <div class="event-form" data-index="0">
                            <h4>Veranstaltung 1</h4>
                            <div class="form-group">
                              <label for="event-type-0">Typ:</label>
                              <select id="event-type-0" name="event-type-0" required>
                                <option value="" disabled selected>Wähle einen Typ</option>
                                <option value="Vorlesung">Vorlesung</option>
                                <option value="Übung">Übung</option>
                                <option value="Seminar">Seminar</option>
                                <option value="Praktikum">Praktikum</option>
                              </select>
                            </div>
                            <div class="form-group">
                              <label for="event-day-0">Tag:</label>
                              <select id="event-day-0" name="event-day-0" required>
                                <option value="" disabled selected>Wähle einen Tag</option>
                                <option value="Mo">Montag</option>
                                <option value="Di">Dienstag</option>
                                <option value="Mi">Mittwoch</option>
                                <option value="Do">Donnerstag</option>
                                <option value="Fr">Freitag</option>
                              </select>
                            </div>
                            <div class="form-group">
                              <label for="event-from-0">Startzeit:</label>
                              <input type="time" id="event-from-0" name="event-from-0" required>
                            </div>
                            <div class="form-group">
                              <label for="event-until-0">Endzeit:</label>
                              <input type="time" id="event-until-0" name="event-until-0" required>
                            </div>
                            <div class="form-group">
                              <label for="event-room-0">Raum:</label>
                              <input type="text" id="event-room-0" name="event-room-0" placeholder="z. B. St-C116" required>
                            </div>
                            <div class="form-group">
                              <label for="event-period-from-0">Startdatum:</label>
                              <input type="text" id="event-period-from-0" name="event-period-from-0" placeholder="z. B. 03.04.2025" required>
                            </div>
                            <div class="form-group">
                              <label for="event-period-until-0">Enddatum:</label>
                              <input type="text" id="event-period-until-0" name="event-period-until-0" placeholder="z. B. 26.06.2025" required>
                            </div>
                            <div class="form-group">
                              <label for="event-who-0">Dozent:</label>
                              <input type="text" id="event-who-0" name="event-who-0" placeholder="z. B. Weil">
                            </div>
                            <div class="form-group">
                              <label for="event-group-0">Gruppe:</label>
                              <input type="text" id="event-group-0" name="event-group-0" placeholder="z. B. A">
                            </div>
                            <button type="button" class="remove-event-button" style="display: none;">Veranstaltung entfernen</button>
                          </div>
                        </div>
                        <button type="button" id="add-event-button">Weitere Veranstaltung hinzufügen</button><br><br>
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
            <div class="events-list">
              <!-- Veranstaltungen werden hier dynamisch eingefügt -->
            </div>
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
        let allCourses = [];
        let currentCourses = [];
        let isEditMode = false;
        let toggleButton;

        // Helper functions
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
//////
        const addCourse = async (form) => {
            try {
                const courseName = form.querySelector('#course').value.trim();
                if (!courseName) {
                    throw new Error("Bitte gib einen Kursnamen ein.");
                }

                const eventForms = form.querySelectorAll('.event-form');
                const events = Array.from(eventForms).map((eventForm, index) => {
                    const eventData = {
                        type: eventForm.querySelector(`#event-type-${index}`).value,
                        day: eventForm.querySelector(`#event-day-${index}`).value,
                        from: eventForm.querySelector(`#event-from-${index}`).value,
                        until: eventForm.querySelector(`#event-until-${index}`).value,
                        room: eventForm.querySelector(`#event-room-${index}`).value,
                        period_from: eventForm.querySelector(`#event-period-from-${index}`).value,
                        period_until: eventForm.querySelector(`#event-period-until-${index}`).value
                    };
                    const who = eventForm.querySelector(`#event-who-${index}`).value.trim();
                    const group = eventForm.querySelector(`#event-group-${index}`).value.trim();
                    if (who) eventData.who = who;
                    if (group) eventData.group = group;
                    return eventData;
                });

                if (events.length === 0) {
                    throw new Error("Bitte füge mindestens eine Veranstaltung hinzu.");
                }

                const courseData = {
                    course: courseName,
                    createdBy: "student",
                    who: studentId,
                    materials: [],
                    events: events, // Jede Veranstaltung hat ein Event
                    course_of_study: []
                };

                const courseId = self.ccm.helper.generateKey();
                await self.studentCourseStore.set({key: courseId, value: courseData});
                console.log("Neuer studentischer Kurs hinzugefügt:", courseData);

                const newCourse = {
                    key: courseId,
                    value: courseData,
                    color: "",
                    note: ""
                };
                allCourses.push(newCourse);
                return newCourse;
            } catch (e) {
                console.error("Fehler beim Hinzufügen eines studentischen Kurses:", e);
                throw new Error(e.message || "Fehler beim Hinzufügen des Kurses. Bitte versuche es erneut.");
            }
        };

        const saveCourses = async () => {
            try {
                const scheduleData = {
                    key: studentId,
                    value: {
                        student_id: studentId,
                        courses: currentCourses
                            .filter(kurs => kurs && kurs.value && kurs.value.course)
                            .map(kurs => ({
                                key: kurs.key,
                                color: kurs.color || "",
                                course: kurs.value.course,
                                note: kurs.note || "",
                                events: kurs.value.events
                            }))
                    }
                };
                await self.studentStore.set(scheduleData);
                console.log("Kurse automatisch gespeichert:", scheduleData);
            } catch (e) {
                console.error("Fehler beim Speichern der Kurse:", e);
                alert("Fehler beim Speichern der Kurse. Bitte versuche es erneut.");
            }
        };

        const addNoteToCourse = async (courseKey, note) => {
            const course = currentCourses.find(c => c.key === courseKey);
            if (course) {
                course.note = note;
                await saveCourses();
            }
        };

        const renderCourse = (kurs, container, updateParentCheckbox) => {
            if (!kurs.value.events || !Array.isArray(kurs.value.events)) {
                console.warn(`Kurs ${kurs.value.course} hat keine gültigen Events.`, kurs);
                kurs.value.events = [];
            }

            const courseHtml = self.ccm.helper.html(self.html.editView.courseItem, {
                key: kurs.key,
                course: kurs.value.course || "Unbekannter Kurs"
            });

            const eventsList = courseHtml.querySelector('.events-list');
            kurs.value.events.forEach(event => {
                const eventHtml = `
          <div class="event-item">
            ${event.type}: ${event.day}, ${event.from} - ${event.until}, Raum: ${event.room}${event.who ? `, Dozent: ${event.who}` : ''}${event.group ? `, Gruppe: ${event.group}` : ''}, ${event.period_from} - ${event.period_until}
          </div>
        `;
                eventsList.insertAdjacentHTML('beforeend', eventHtml);
            });

            container.appendChild(courseHtml);

            const noteContainer = courseHtml.querySelector(`#course-note-container-${kurs.key}`);
            if (kurs.note && kurs.note.trim() !== "") {
                const noteHtml = `
          <label for="course-note-${kurs.key}">Notiz:</label>
          <textarea class="course-note-textarea" id="course-note-${kurs.key}" placeholder="Deine Notiz...">${kurs.note}</textarea>
        `;
                noteContainer.innerHTML = noteHtml;

                const noteTextarea = noteContainer.querySelector(`#course-note-${kurs.key}`);
                noteTextarea.addEventListener('blur', async () => {
                    const newNote = noteTextarea.value.trim();
                    await addNoteToCourse(kurs.key, newNote);
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
                console.log('Removing course with key:', kurs.key);
                currentCourses = currentCourses.filter(k => k.key !== kurs.key);
                container.removeChild(courseHtml);

                const checkbox = document.querySelector(`.event-checkbox[data-key="${kurs.key}"]`);
                if (checkbox) {
                    checkbox.checked = false;
                    if (updateParentCheckbox) {
                        updateParentCheckbox(checkbox);
                    }
                }

                await saveCourses();
            });

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

        const renderSchedule = async () => {
            const userConfig = await self.studentStore.get(studentId);
            const schedule = {};

            if (userConfig && userConfig.value && userConfig.value.courses) {
                const teacherCourses = await self.courseStore.get({});
                const studentCourses = await self.studentCourseStore.get({});
                const ownStudentCourses = studentCourses.filter(kurs => kurs.value.who === studentId);
                const allCourses = [...teacherCourses, ...ownStudentCourses];

                userConfig.value.courses.forEach(course => {
                    const kurs = allCourses.find(k => k.key === course.key) || {
                        value: {
                            course: course.course,
                            events: course.events
                        }
                    };
                    if (kurs && kurs.value && kurs.value.events) {
                        kurs.value.events.forEach(event => {
                            const normalizedDay = normalizeDay(event.day || "Unbekannt");
                            if (!schedule[normalizedDay]) schedule[normalizedDay] = [];
                            schedule[normalizedDay].push({
                                title: `${kurs.value.course} (${event.type})${event.group ? ` [${event.group}]` : ''}`,
                                time: `${event.from} - ${event.until}`,
                                room: event.room,
                                who: event.who || "Unbekannt",
                                period: `${event.period_from} - ${event.period_until}`,
                                color: course.color || "#F0F0F0",
                                courseId: course.key,
                                note: course.note || ""
                            });
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
            <div class="event" data-course-id="${event.courseId}" style="background-color: ${event.color};">
              <div class="event-header">
                <strong>${event.title}</strong>
                ${event.note && event.note.trim() !== "" ? `
                  <span class="note-icon">📝
                    <span class="tooltip">${event.note}</span>
                  </span>
                ` : ''}
              </divMui
              <span>${event.time}</span><br>
              <span>Raum: ${event.room}</span><br>
              <span>Dozent: ${event.who}</span><br>
              <span>Zeitraum: ${event.period}</span>
            </div>
          `).join('') : '<p>Keine Kurse an diesem Tag.</p>'}
        </div>
      `).join('');

            return self.ccm.helper.html(self.html.scheduleView.main, {studentId, scheduleContent});
        };

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
                const studyGroups = courseCheckboxList.querySelectorAll('.study-group');

                studyGroups.forEach(studyGroup => {
                    const studyName = studyGroup.dataset.study.toLowerCase();
                    const semesterGroups = studyGroup.querySelectorAll('.semester-group');
                    let hasVisibleSemester = false;

                    semesterGroups.forEach(semesterGroup => {
                        const semester = semesterGroup.dataset.semester.toLowerCase();
                        const courseGroups = semesterGroup.querySelectorAll('.course-group');
                        let hasVisibleCourse = false;

                        courseGroups.forEach(courseGroup => {
                            const courseName = courseGroup.dataset.course.toLowerCase();
                            const eventItems = courseGroup.querySelectorAll('.event-item');
                            let hasVisibleEvent = false;

                            eventItems.forEach(eventItem => {
                                const label = eventItem.querySelector('label').textContent.toLowerCase();
                                const matches = (
                                    studyName.includes(searchTerm) ||
                                    semester.includes(searchTerm) ||
                                    courseName.includes(searchTerm) ||
                                    label.includes(searchTerm)
                                );
                                eventItem.style.display = matches ? 'flex' : 'none';
                                if (matches) hasVisibleEvent = true;
                            });

                            courseGroup.style.display = hasVisibleEvent ? 'block' : 'none';
                            if (hasVisibleEvent) hasVisibleCourse = true;
                        });

                        semesterGroup.style.display = hasVisibleCourse ? 'block' : 'none';
                        if (hasVisibleCourse) hasVisibleSemester = true;
                    });

                    studyGroup.style.display = hasVisibleSemester ? 'block' : 'none';
                });
            });
        };
//////
        this.start = async () => {
            console.log("courseStore:", await self.courseStore.get());
            console.log("studentCourseStore:", await self.studentCourseStore.get());
            console.log("studentStore:", await self.studentStore.get());

            if (typeof self.courseStore.get !== 'function' || typeof self.studentCourseStore.set !== 'function' || typeof self.studentStore.set !== 'function') {
                console.error("Eine oder mehrere Store-Methoden sind nicht verfügbar. Überprüfe CCM-Version oder Authentifizierung.");
                alert("Fehler bei der Store-Initialisierung. Bitte überprüfe die Konsole.");
                return;
            }

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

            try {
                const teacherCourses = await self.courseStore.get({});
                const studentCourses = await self.studentCourseStore.get({});
                allCourses = [...teacherCourses, ...studentCourses];
            } catch (e) {
                console.error("Fehler beim Laden der Kurse:", e);
                alert("Fehler beim Laden der Kurse. Bitte versuche es erneut.");
                return;
            }

            if (savedSchedule && savedSchedule.value && savedSchedule.value.courses) {
                currentCourses = savedSchedule.value.courses
                    .filter(course => {
                        const fullCourse = allCourses.find(c => c.key === course.key) || {
                            value: {
                                course: course.course,
                                events: course.events
                            }
                        };
                        return fullCourse && fullCourse.value && fullCourse.value.course;
                    })
                    .map(course => ({
                        key: course.key,
                        color: course.color,
                        course: course.course,
                        note: course.note || "",
                        value: {
                            course: course.course,
                            events: course.events || [],
                            materials: course.materials || [],
                            course_of_study: course.course_of_study || []
                        }
                    }));
            } else {
                isEditMode = true;
            }

            await self.renderView();
        };
/////
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

        this.renderEditView = async (container) => {
            const mainHtml = self.ccm.helper.html(self.html.editView.main, {title: "Stundenplan bearbeiten"});
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

            // Debugging logs
            console.log('kursButton:', kursButton);
            console.log('courseFormContainer:', courseFormContainer);
            console.log('courseForm:', courseForm);

            // Check if critical elements exist
            if (!kursButton || !courseFormContainer || !courseForm) {
                console.error('Error: Critical elements not found in DOM. Check self.html.editView.main template.');
                return;
            }

            const eventsContainer = courseForm.querySelector('#events-container');
            const addEventButton = courseForm.querySelector('#add-event-button');

            let eventIndex = 0;

            // Add event form
            const addEventForm = (index) => {
                const eventForm = eventsContainer.querySelector(`.event-form[data-index="${index}"]`);
                if (!eventForm) {
                    const eventFormHtml = `
            <div class="event-form" data-index="${index}">
              <h4>Veranstaltung ${index + 1}</h4>
              <div class="form-group">
                <label for="event-type-${index}">Typ *</label>
                <select id="event-type-${index}" name="event-type-${index}" required>
                  <option value="" disabled selected>Wähle einen Typ</option>
                  <option value="Vorlesung">Vorlesung</option>
                  <option value="Übung">Übung</option>
                  <option value="Seminar">Seminar</option>
                  <option value="Praktikum">Praktikum</option>
                </select>
              </div>
              <div class="form-group">
                <label for="event-day-${index}">Tag *</label>
                <select id="event-day-${index}" name="event-day-${index}" required>
                  <option value="" disabled selected>Wähle einen Tag</option>
                  <option value="Mo">Montag</option>
                  <option value="Di">Dienstag</option>
                  <option value="Mi">Mittwoch</option>
                  <option value="Do">Donnerstag</option>
                  <option value="Fr">Freitag</option>
                </select>
              </div>
              <div class="form-group">
                <label for="event-from-${index}">Startzeit *</label>
                <input type="time" id="event-from-${index}" name="event-from-${index}" required>
              </div>
              <div class="form-group">
                <label for="event-until-${index}">Endzeit *</label>
                <input type="time" id="event-until-${index}" name="event-until-${index}" required>
              </div>
              <div class="form-group">
                <label for="event-room-${index}">Raum *</label>
                <input type="text" id="event-room-${index}" name="event-room-${index}" placeholder="z. B. St-C116" required>
              </div>
              <div class="form-group">
                <label for="event-period-from-${index}">Startdatum *</label>
                <input type="text" id="event-period-from-${index}" name="event-period-from-${index}" placeholder="z. B. 03.04.2025" required>
              </div>
              <div class="form-group">
                <label for="event-period-until-${index}">Enddatum *</label>
                <input type="text" id="event-period-until-${index}" name="event-period-until-${index}" placeholder="z. B. 26.06.2025" required>
              </div>
              <div class="form-group">
                <label for="event-who-${index}">Dozent (optional)</label>
                <input type="text" id="event-who-${index}" name="event-who-${index}" placeholder="z. B. Prof. Müller">
              </div>
              <div class="form-group">
                <label for="event-group-${index}">Gruppe (optional)</label>
                <input type="text" id="event-group-${index}" name="event-group-${index}" placeholder="z. B. A">
              </div>
              <button type="button" class="remove-event-button" ${index === 0 ? 'style="display: none;"' : ''}>Veranstaltung entfernen</button>
            </div>
          `;
                    eventsContainer.insertAdjacentHTML('beforeend', eventFormHtml);
                }
            };

            // Event listeners
            kursButton.addEventListener('click', () => {
                console.log('KursButton clicked');
                courseFormContainer.style.display = 'block';
                kursButton.style.display = 'none';
                courseForm.querySelector('#course').focus();
            });

            cancelButton.addEventListener('click', () => {
                courseFormContainer.style.display = 'none';
                kursButton.style.display = 'block';
                courseForm.reset();
                eventsContainer.innerHTML = '';
                eventIndex = 0;
                addEventForm(eventIndex);
            });

            addEventButton.addEventListener('click', () => {
                eventIndex++;
                addEventForm(eventIndex);
            });

            eventsContainer.addEventListener('click', (e) => {
                if (e.target.classList.contains('remove-event-button')) {
                    const eventForm = e.target.closest('.event-form');
                    eventsContainer.removeChild(eventForm);
                    Array.from(eventsContainer.children).forEach((form, idx) => {
                        form.dataset.index = idx;
                        form.querySelector('h4').textContent = `Veranstaltung ${idx + 1}`;
                        form.querySelectorAll('input, select').forEach(input => {
                            const name = input.name.replace(/\d+$/, idx);
                            const id = input.id.replace(/\d+$/, idx);
                            input.name = name;
                            input.id = id;
                            input.setAttribute('name', name);
                            input.setAttribute('id', id);
                            if (input.tagName === 'SELECT') {
                                input.querySelectorAll('option').forEach(option => {
                                    if (option.value === '') {
                                        option.textContent = idx === 0 ? 'Wähle einen Typ' : 'Wähle einen Typ';
                                    }
                                });
                            }
                        });
                        form.querySelector('.remove-event-button').style.display = idx === 0 ? 'none' : 'block';
                    });
                    eventIndex = eventsContainer.children.length - 1;
                }
            });

            courseForm.addEventListener('submit', async (event) => {
                event.preventDefault();
                try {
                    const newCourse = await addCourse(courseForm);
                    currentCourses.push(newCourse);
                    courseFormContainer.style.display = 'none';
                    kursButton.style.display = 'block';
                    courseForm.reset();
                    eventsContainer.innerHTML = '';
                    eventIndex = 0;
                    addEventForm(eventIndex);
                    await self.renderEditView(container);
                } catch (e) {
                    console.error("Fehler beim Hinzufügen eines Kurses:", e);
                    alert(e.message);
                }
            });

            let teacherCourses = [];
            let studentCourses = [];
            try {
                teacherCourses = await self.courseStore.get({});
                studentCourses = await self.studentCourseStore.get({});
                const ownStudentCourses = studentCourses.filter(kurs => kurs.value.who === studentId);
                allCourses = [...teacherCourses, ...ownStudentCourses];
            } catch (e) {
                console.error("Fehler beim Laden der Kurse für die Kursliste:", e);
                alert("Fehler beim Laden der Kursliste. Bitte versuche es erneut.");
                return;
            }

            const studyGroups = {};
            allCourses.forEach(kurs => {
                if (kurs && kurs.value && kurs.value.course) {
                    const studies = kurs.value.course_of_study && kurs.value.course_of_study.length > 0
                        ? kurs.value.course_of_study
                        : [{courseOfStudy: "Ohne Studiengang", semester: "N/A"}];

                    studies.forEach(study => {
                        const studyName = study.courseOfStudy || "Ohne Studiengang";
                        const semester = study.semester || "N/A";
                        if (!studyGroups[studyName]) {
                            studyGroups[studyName] = {};
                        }
                        if (!studyGroups[studyName][semester]) {
                            studyGroups[studyName][semester] = {};
                        }
                        if (!studyGroups[studyName][semester][kurs.value.course]) {
                            studyGroups[studyName][semester][kurs.value.course] = [];
                        }
                        studyGroups[studyName][semester][kurs.value.course].push(kurs);
                    });
                }
            });

            const updateParentCheckboxes = (eventCheckbox) => {
                if (!(eventCheckbox instanceof HTMLElement)) {
                    console.warn('updateParentCheckboxes: Invalid input, expected HTMLElement, got:', eventCheckbox);
                    return;
                }

                const eventItem = eventCheckbox.closest('.event-item');
                if (!eventItem) {
                    console.warn('updateParentCheckboxes: No .event-item found for checkbox:', eventCheckbox);
                    return;
                }

                const courseGroup = eventItem.closest('.course-group');
                if (!courseGroup) {
                    console.warn('updateParentCheckboxes: No .course-group found for eventItem:', eventItem);
                    return;
                }

                const semesterGroup = courseGroup.closest('.semester-group');
                if (!semesterGroup) {
                    console.warn('updateParentCheckboxes: No .semester-group found for courseGroup:', courseGroup);
                    return;
                }

                const courseCheckbox = courseGroup.querySelector('.course-checkbox');
                const eventCheckboxes = courseGroup.querySelectorAll('.event-checkbox');
                const courseAllChecked = Array.from(eventCheckboxes).every(cb => cb.checked);
                const courseSomeChecked = Array.from(eventCheckboxes).some(cb => cb.checked);
                if (courseCheckbox) {
                    courseCheckbox.checked = courseAllChecked;
                    courseCheckbox.indeterminate = courseSomeChecked && !courseAllChecked;
                }

                const semesterCheckbox = semesterGroup.querySelector('.semester-checkbox');
                const courseCheckboxes = semesterGroup.querySelectorAll('.course-checkbox');
                const semesterAllChecked = Array.from(courseCheckboxes).every(cb => cb.checked);
                const semesterSomeChecked = Array.from(courseCheckboxes).some(cb => cb.checked);
                if (semesterCheckbox) {
                    semesterCheckbox.checked = semesterAllChecked;
                    semesterCheckbox.indeterminate = semesterSomeChecked && !semesterAllChecked;
                }
            };

            const courseListHtml = Object.keys(studyGroups).sort().map(studyName => {
                const semesters = studyGroups[studyName];
                const semesterHtml = Object.keys(semesters).sort((a, b) => {
                    if (a === "N/A") return 1;
                    if (b === "N/A") return -1;
                    return parseInt(a) - parseInt(b);
                }).map(semester => {
                    const courses = semesters[semester];
                    const courseHtml = Object.keys(courses).sort().map(courseName => {
                        const courseList = courses[courseName];
                        const eventHtml = courseList
                            .filter(kurs => kurs && kurs.value && kurs.value.events)
                            .map(kurs => {
                                return kurs.value.events.map((event, eventIndex) => {
                                    const eventInfo = `${event.type} (${event.day}, ${event.from} - ${event.until}, Raum: ${event.room}${event.who ? `, Dozent: ${event.who}` : ''}${event.group ? `, Gruppe: ${event.group}` : ''}, ${event.period_from} - ${event.period_until})`;
                                    const isChecked = currentCourses.some(c => c.key === kurs.key);
                                    return `
                    <div class="event-item">
                      <input type="checkbox" class="event-checkbox" data-key="${kurs.key}" ${isChecked ? 'checked' : ''}>
                      <label>${eventInfo}${kurs.value.createdBy === "student" ? ' [Student]' : ''}</label>
                    </div>
                  `;
                                }).join('');
                            }).join('');
                        return `
              <div class="course-group" data-course="${courseName}">
                <div class="course-item">
                  <input type="checkbox" class Ascendant: true;
                  <label>${courseName}</label>
                </div>
                <div class="courses">${eventHtml}</div>
              </div>
            `;
                    }).join('');
                    return `
            <div class="semester-group" data-semester="${semester}">
              <div class="semester-item">
                <input type="checkbox" class="semester-checkbox">
                <label>Semester ${semester}</label>
              </div>
              <div class="courses">${courseHtml}</div>
            </div>
          `;
                }).join('');
                return `
          <div class="study-group" data-study="${studyName}">
            <div class="study-item">
              <label>${studyName}</label>
            </div>
            <div class="semesters">${semesterHtml}</div>
          </div>
        `;
            }).join('');

            courseCheckboxList.innerHTML = courseListHtml;

            courseCheckboxList.querySelectorAll('.event-checkbox').forEach(checkbox => {
                updateParentCheckboxes(checkbox);
            });

            courseCheckboxList.querySelectorAll('.semester-checkbox').forEach(checkbox => {
                checkbox.addEventListener('change', async (e) => {
                    const semesterGroup = e.target.closest('.semester-group');
                    const eventCheckboxes = semesterGroup.querySelectorAll('.event-checkbox');
                    eventCheckboxes.forEach(cb => {
                        cb.checked = e.target.checked;
                        const kursKey = cb.dataset.key;
                        const kurs = allCourses.find(k => k.key === kursKey);
                        if (e.target.checked && !currentCourses.some(c => c.key === kursKey)) {
                            const filteredCourse = {
                                key: kursKey,
                                value: {
                                    course: kurs.value.course,
                                    course_of_study: kurs.value.course_of_study,
                                    materials: kurs.value.materials,
                                    events: kurs.value.events,
                                    createdBy: kurs.value.createdBy
                                },
                                color: "",
                                note: ""
                            };
                            currentCourses.push(filteredCourse);
                            renderCourse(filteredCourse, selectedScheduleContainer, updateParentCheckboxes);
                        } else if (!e.target.checked) {
                            currentCourses = currentCourses.filter(c => c.key !== kursKey);
                            const courseElement = selectedScheduleContainer.querySelector(`.course-item[data-key="${kursKey}"]`);
                            if (courseElement) selectedScheduleContainer.removeChild(courseElement);
                        }
                    });
                    if (eventCheckboxes.length > 0) {
                        updateParentCheckboxes(eventCheckboxes[0]);
                    }
                    await saveCourses();
                });
            });

            courseCheckboxList.querySelectorAll('.course-checkbox').forEach(checkbox => {
                checkbox.addEventListener('change', async (e) => {
                    const courseGroup = e.target.closest('.course-group');
                    const eventCheckboxes = courseGroup.querySelectorAll('.event-checkbox');
                    eventCheckboxes.forEach(cb => {
                        cb.checked = e.target.checked;
                        const kursKey = cb.dataset.key;
                        const kurs = allCourses.find(k => k.key === kursKey);
                        if (e.target.checked && !currentCourses.some(c => c.key === kursKey)) {
                            const filteredCourse = {
                                key: kursKey,
                                value: {
                                    course: kurs.value.course,
                                    course_of_study: kurs.value.course_of_study,
                                    materials: kurs.value.materials,
                                    events: kurs.value.events,
                                    createdBy: kurs.value.createdBy
                                },
                                color: "",
                                note: ""
                            };
                            currentCourses.push(filteredCourse);
                            renderCourse(filteredCourse, selectedScheduleContainer, updateParentCheckboxes);
                        } else if (!e.target.checked) {
                            currentCourses = currentCourses.filter(c => c.key !== kursKey);
                            const courseElement = selectedScheduleContainer.querySelector(`.course-item[data-key="${kursKey}"]`);
                            if (courseElement) selectedScheduleContainer.removeChild(courseElement);
                        }
                    });
                    if (eventCheckboxes.length > 0) {
                        updateParentCheckboxes(eventCheckboxes[0]);
                    }
                    await saveCourses();
                });
            });

            courseCheckboxList.querySelectorAll('.event-checkbox').forEach(checkbox => {
                checkbox.addEventListener('change', async (e) => {
                    const kursKey = e.target.dataset.key;
                    const kurs = allCourses.find(k => k.key === kursKey);
                    if (e.target.checked && !currentCourses.some(c => c.key === kursKey)) {
                        const filteredCourse = {
                            key: kursKey,
                            value: {
                                course: kurs.value.course,
                                course_of_study: kurs.value.course_of_study,
                                materials: kurs.value.materials,
                                events: kurs.value.events,
                                createdBy: kurs.value.createdBy
                            },
                            color: "",
                            note: ""
                        };
                        currentCourses.push(filteredCourse);
                        renderCourse(filteredCourse, selectedScheduleContainer, updateParentCheckboxes);
                    } else if (!e.target.checked) {
                        currentCourses = currentCourses.filter(c => c.key !== kursKey);
                        const courseElement = selectedScheduleContainer.querySelector(`.course-item[data-key="${kursKey}"]`);
                        if (courseElement) selectedScheduleContainer.removeChild(courseElement);
                    }
                    updateParentCheckboxes(e.target);
                    await saveCourses();
                });
            });

            initializeDropdownAndSearch(dropdownButton, dropdownContent, searchInput, courseCheckboxList);

            currentCourses.forEach(course => {
                renderCourse(course, selectedScheduleContainer, updateParentCheckboxes);
                const checkbox = courseCheckboxList.querySelector(`.event-checkbox[data-key="${course.key}"]`);
                if (checkbox) {
                    checkbox.checked = true;
                    updateParentCheckboxes(checkbox);
                }
            });
        };

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

        this.openModal = async (courseId, modalApps) => {
            let course = await self.courseStore.get(courseId) || await self.studentCourseStore.get(courseId);
            if (!course || !course.value || !course.value.materials) {
                modalApps.innerHTML = '<p>Keine Links vorhanden.</p>';
                self.element.querySelector('#modal').style.display = 'block';
                return;
            }

            const urlPattern = /^(https?:\/\/)?(www\.)?([^\s$.?#]+\.[^\s]{2,})$/i;
            const links = course.value.materials.filter(material =>
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

        this.closeModal = () => {
            const modal = self.element.querySelector('#modal');
            if (modal) modal.style.display = 'none';
            else console.error("Modal element not found in closeModal!");
        };
    }
};
