/**
 * @overview ccm component for a timetable
 * @author Tobias Niederprüm <t.niederpruem@gmail.com>, 2025
 * @license The MIT License (MIT)
 */

ccm.files["ccm.timetable.js"] = {
    name: "time-table",
    ccm: "https://ccmjs.github.io/ccm/ccm.js",
    //ccm: "../libs/ccm/ccm.js",
    config: {
        // alle Kurse aus Curriculum
        courseStore: ["ccm.store", {url: "https://ccm2.inf.h-brs.de", name: "tniede2s_teacher_courses"}],
        // alle Kurse, die der Student selbst erstellt hat
        studentCourseStore: ["ccm.store", {url: "https://ccm2.inf.h-brs.de", name: "tniede2s_student_courses"}],
        // alle Kurse, die der Student ausgewählt hat
        studentStore: ["ccm.store", {url: "https://ccm2.inf.h-brs.de", name: "tniede2s_student_schedules"}],
        css: ["ccm.load", "./resources/style.css"],
        user: ["ccm.instance", "https://ccmjs.github.io/akless-components/user/ccm.user.js"],
        helper: ["ccm.load", "https://ccmjs.github.io/akless-components/modules/versions/helper-8.4.2.min.mjs"],
        html: {
            mainTemplate: `
                <div id="main-template">
                    <div id="toggle-button"></div>
                    <div id="user"></div>
                    <div id="main-content">
                        <h1>Stundenplan</h1>
                        <p>Bitte logge dich ein, um deinen Stundenplan zu sehen</p>
                    </div>
                </div>
            `,
            editView: {
                main: `
                  <h1>Stundenplan bearbeiten</h1>
                  <div id="schedule-container">
                    <div class="add-course-header">
                      <button id="add-course-button">Eigenen Kurs hinzufügen</button>
                    </div>
                    <div id="course-form-container" style="display: none;">
                      <form id="course-form">
                        <h2>Kurs hinzufügen</h2>
                        <div class="form-group">
                          <label for="course-title">Kursname: *</label>
                          <input type="text" id="course-title" name="course-title" placeholder="z.B. Einführung in die ..." required>
                        </div>
                        <div id="events-container"></div>
                        <button type="button" id="add-event-button">Weitere Veranstaltung hinzufügen</button><br><br>
                        <button type="submit" id="submit-course-button">Kurs Hinzufügen</button>
                        <button type="button" id="cancel-button">Abbrechen</button>
                      </form>
                    </div>
                    <div class="dropdown-container">
                      <button id="course-dropdown-button" class="dropdown-button">Kurs hinzufügen ▼</button>
                      <div id="course-dropdown-content" class="dropdown-content">
                        <input type="text" id="course-search" placeholder="Kurs suchen ...">
                        <div id="course-checkbox-list"></div>
                      </div>
                    </div>
                    <h2>Ausgewählter Stundenplan</h2>
                    <div id="selected-schedule"></div>
                  </div>
                `,
                eventItem: `
                    <div class="event-form" data-index="%index%">
                      <h4>%title%</h4>
                      <div class="form-group">
                        <label for="event-type-%index%">Typ *</label>
                        <select id="event-type-%index%" name="event-type-%index%" required>
                          <option value="" disabled selected>Wähle einen Typ</option>
                          <option value="Vorlesung">Vorlesung</option>
                          <option value="Übung">Übung</option>
                          <option value="Seminar">Seminar</option>
                          <option value="Praktikum">Praktikum</option>
                          <option value="Sportkurs">Sportkurs</option>
                          <option value="Sprachkurs">Sprachkurs</option>
                          <option value="Tutorium">Tutorium</option>
                          <option value="Sonstiges">Sonstiges</option>
                        </select>
                      </div>
                      <div class="form-group">
                        <label for="event-day-%index%">Tag *</label>
                        <select id="event-day-%index%" name="event-day-%index%" required>
                          <option value="" disabled selected>Wähle einen Tag</option>
                          <option value="Mo">Montag</option>
                          <option value="Di">Dienstag</option>
                          <option value="Mi">Mittwoch</option>
                          <option value="Do">Donnerstag</option>
                          <option value="Fr">Freitag</option>
                        </select>
                      </div>
                      <div class="form-group">
                        <label for="event-from-%index%">Startzeit *</label>
                        <input type="time" id="event-from-%index%" name="event-from-%index%" required>
                      </div>
                      <div class="form-group">
                        <label for="event-until-%index%">Endzeit *</label>
                        <input type="time" id="event-until-%index%" name="event-until-%index%" required>
                      </div>
                      <div class="form-group">
                        <label for="event-room-%index%">Raum *</label>
                        <input type="text" id="event-room-%index%" name="event-room-%index%" placeholder="z.B. St-C116" required>
                      </div>
                      <div class="form-group">
                        <label for="event-period-from-%index%">Startdatum *</label>
                        <input type="date" id="event-period-from-%index%" name="event-period-from-%index%" placeholder="z.B. 03.04.2025" required>
                      </div>
                      <div class="form-group">
                        <label for="event-period-until-%index%">Enddatum *</label>
                        <input type="date" id="event-period-until-%index%" name="event-period-until-%index%" placeholder="z.B. 26.06.2025" required>
                      </div>
                      <div class="form-group">
                        <label for="event-who-%index%">Dozent (optional)</label>
                        <input type="text" id="event-who-%index%" name="event-who-%index%" placeholder="z.B. Prof. Müller">
                      </div>
                      <div class="form-group">
                        <label for="event-group-%index%">Gruppe (optional)</label>
                        <input type="text" id="event-group-%index%" name="event-group-%index%" placeholder="z.B. A">
                      </div>
                      <button type="button" class="remove-event-button" style="%removeEventButtonStyle%">Veranstaltung entfernen</button>
                    </div>
                `,
                courseItem: `
                    <div class="course-item" data-key="%key%">
                        <h3>%courseTitle%</h3>
                        <div class="event-info" data-event-key="%eventKey%">
                            <!-- Veranstaltungsinfos werden hier dynamisch eingefügt -->
                        </div>
                        <div class="event-note" id="event-note-container-%eventKey%">
                            <!-- Notizinput wird hier dynamisch eingefügt -->
                        </div>
                        <div class="event-color" id="event-color-container-%eventKey%">
                            <label for="event-color-%eventKey%">Farbe:</label>
                            <select class="color-select" id="event-color-%eventKey%">
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
                        </div>
                        <div class="course-actions">
                            <button class="remove-event-button">Entfernen</button>
                        </div>
                    </div>
                `
            },
            scheduleView: {
                main: `
                  <h1>Stundenplan für %studentId%</h1>
                  <div class="container">
                    <div class="section">
                      <div class="week-schedule">
                        %scheduleContent%
                      </div>
                    </div>
                    <div id="modal" class="modal">
                      <div class="modal-content">
                        <span class="close">×</span>
                        <h3 id="modal-title"></h3>
                        <h4>Links</h4>
                        <div id="modal-links">
                            Keine Links vorhanden
                        </div>
                        <br>
                        <h4>Notizen</h4>
                        <div id="modal-note">
                            Keine Notizen vorhanden
                        </div>
                      </div>
                    </div>
                  </div>
                `
            }
        }
    },

    Instance: function () {
        let self = this;
        let studentId;
        let allCourses = [];
        let currentCourses = [];
        let isEditMode = false;
        let toggleButton;

        this.init = async () => {
            if (this.user) this.user.onchange = this.start;
        }

        this.start = async () => {
            console.log("courseStore:", await self.courseStore.get());
            console.log("studentCourseStore:", await self.studentCourseStore.get());
            console.log("studentStore:", await self.studentStore.get());

            self.element.innerHTML = self.html.mainTemplate;
            const mainTemplate = self.element.querySelector('#main-template');

            if (this.user) {
                mainTemplate.querySelector('#user').append(this.user.root);
                this.user.start();
            }

            studentId = await this.user.getValue();
            if (!studentId) {
                alert("Please log in to continue.");
                console.log("User is not logged in");
                return;
            }
            studentId = studentId.key;
            //studentId = "tmiede2s";

            toggleButton = document.createElement('button');
            toggleButton.id = 'toggle-view-button';
            toggleButton.addEventListener('click', async () => {
                isEditMode = !isEditMode;
                await self.renderView();
            });
            mainTemplate.querySelector("#toggle-button").appendChild(toggleButton);

            let savedSchedule;
            try {
                savedSchedule = await self.studentStore.get(studentId);
                const teacherCourses = await self.courseStore.get();
                const studentCourses = await self.studentCourseStore.get();
                const ownStudentCourses = studentCourses.filter(course => course.value.who === studentId);
                console.log("Gespeicherte Konfiguration für", studentId, ":", savedSchedule);
                allCourses = [...teacherCourses, ...ownStudentCourses];
            } catch (e) {
                console.error("Fehler beim Laden der Kurse:", e);
                alert("Fehler beim Laden der Kurse. Bitte versuche es erneut.");
                return;
            }
            console.log("allCourses", allCourses);

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
                        course: course.course,
                        value: {
                            course: course.course,
                            events: course.events || [],
                            course_of_study: course.course_of_study || []
                        }
                    }));
                console.log("currentCourses", currentCourses);
            } else {
                isEditMode = true;
            }

            await self.renderView();

        };

        this.renderView = async () => {
            toggleButton.textContent = isEditMode ? 'Zur Stundenplanansicht' : 'Stundenplan Konfigurieren';

            if (isEditMode) {
                await self.renderEditView();
            } else {
                await self.renderScheduleView();
            }
        };



        // Render Edit View
        this.renderEditView = async () => {
            const mainHtml = self.ccm.helper.html(self.html.editView.main);
            const container = self.element.querySelector('#main-content');
            container.innerHTML = '';
            container.appendChild(mainHtml);

            await initAddNewCourse(container);
            await initSelectCoursesDropdown(container);

            // render selected courses
            currentCourses.forEach(course => {
                renderCourse(course);
            });
        };

        const initAddNewCourse = async (container) => {
            const courseFormContainer = container.querySelector('#course-form-container');
            const courseForm = container.querySelector('#course-form');
            const addCourseButton = container.querySelector('#add-course-button');
            const cancelButton = container.querySelector('#cancel-button');
            const eventsContainer = courseForm.querySelector('#events-container');
            const addEventButton = courseForm.querySelector('#add-event-button');

            let eventIndex = 0;

            // Event listeners
            addCourseButton.addEventListener('click', () => {
                eventsContainer.innerHTML = '';
                eventIndex = 0;
                addEventForm(eventIndex);
                courseFormContainer.style.display = 'block';
                addCourseButton.style.display = 'none';
                courseForm.querySelector('#course-title').focus();
            });

            cancelButton.addEventListener('click', () => {
                courseFormContainer.style.display = 'none';
                addCourseButton.style.display = 'block';
                courseForm.querySelector('#course-title').value = '';
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
                        form.querySelectorAll('input, select, label').forEach(element => {
                            if (element.tagName === 'LABEL') {
                                const forAttr = element.getAttribute('for');
                                if (forAttr) {
                                    element.setAttribute('for', forAttr.replace(/\d+$/, idx));
                                }
                            } else {
                                const name = element.name.replace(/\d+$/, idx);
                                const id = element.id.replace(/\d+$/, idx);
                                element.name = name;
                                element.id = id;
                                // todo checken ob man das if braucht
                                if (element.tagName === 'SELECT') {
                                    element.querySelectorAll('option').forEach(option => {
                                        if (option.value === '') {
                                            option.textContent = 'Wähle einen Typ';
                                        }
                                    });
                                }
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
                    await addNewCourse(courseForm);
                    await self.renderEditView();
                } catch (e) {
                    console.error("Fehler beim Hinzufügen eines Kurses: ", e);
                    alert(e.message);
                }
            });

            const addEventForm = (index) => {
                const eventForm = eventsContainer.querySelector(`.event-form[data-index="${index}"]`);
                if (!eventForm) {
                    const eventFormHtml = self.ccm.helper.html(self.html.editView.eventItem, {
                        index: index,
                        title: `Veranstaltung ${index + 1}`,
                        removeEventButtonStyle: index === 0 ? 'display: none;' : ''
                    });
                    eventsContainer.appendChild(eventFormHtml);
                }
            };

            const addNewCourse = async (form) => {
                try {
                    const courseName = form.querySelector('#course-title').value.trim();
                    if (!courseName) {
                        throw new Error("Bitte gib einen Kursnamen ein.");
                    }

                    const eventForms = form.querySelectorAll('.event-form');
                    const events = Array.from(eventForms).map((eventForm, index) => {
                        const eventData = {
                            key: self.ccm.helper.generateKey(),
                            type: eventForm.querySelector(`#event-type-${index}`).value,
                            day: eventForm.querySelector(`#event-day-${index}`).value,
                            from: eventForm.querySelector(`#event-from-${index}`).value,
                            until: eventForm.querySelector(`#event-until-${index}`).value,
                            room: eventForm.querySelector(`#event-room-${index}`).value,
                            period_from: eventForm.querySelector(`#event-period-from-${index}`).value.replace(/(\d{4})-(\d{2})-(\d{2})/, '$3.$2.$1'),
                            period_until: eventForm.querySelector(`#event-period-until-${index}`).value.replace(/(\d{4})-(\d{2})-(\d{2})/, '$3.$2.$1')
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
                        events: events,
                        course_of_study: []
                    };

                    const courseId = self.ccm.helper.generateKey();
                    await self.studentCourseStore.set({key: courseId, value: courseData});
                    console.log("Neuer studentischer Kurs hinzugefügt:", courseData);

                    const newCourse = {
                        key: courseId,
                        value: courseData,
                    };
                    allCourses.push(newCourse);

                    currentCourses.push(newCourse);
                    await saveSelectedCourses();
                    return newCourse;
                } catch (e) {
                    console.error("Fehler beim Hinzufügen eines studentischen Kurses:", e);
                    throw new Error(e.message || "Fehler beim Hinzufügen des Kurses. Bitte versuche es erneut.");
                }
            };
        };

        const initSelectCoursesDropdown = async (container) => {
            const courseCheckboxList = container.querySelector('#course-checkbox-list');
            const studyGroups = {};
            allCourses.forEach(course => {
                if (course && course.value && course.value.course) {
                    const studies = course.value.course_of_study && course.value.course_of_study.length > 0
                        ? course.value.course_of_study
                        : [{courseOfStudy: "Ohne Studiengang", semester: "N/A"}];

                    studies.forEach(study => {
                        const studyName = study.courseOfStudy || "Ohne Studiengang";
                        const semester = study.semester || "N/A";
                        if (!studyGroups[studyName]) studyGroups[studyName] = {};
                        if (!studyGroups[studyName][semester]) studyGroups[studyName][semester] = {};
                        if (!studyGroups[studyName][semester][course.value.course]) {
                            studyGroups[studyName][semester][course.value.course] = [];
                        }
                        studyGroups[studyName][semester][course.value.course].push(course);
                    });
                }
            });
            console.log(studyGroups)

            let html = '';
            // Studiengänge durchlaufen (alphabetisch sortiert)
            for (const studyName of Object.keys(studyGroups).sort()) {
                html += `<div class="study-group" data-study="${studyName}">
                    <div class="study-item">
                        <label>${studyName}</label>
                    </div>
                    <div class="semesters">`;

                const semesters = studyGroups[studyName];
                // Semester sortieren (N/A ans Ende)
                const semesterList = Object.keys(semesters).sort((a, b) => {
                    if (a === "N/A") return 1;
                    if (b === "N/A") return -1;
                    return parseInt(a) - parseInt(b);
                });

                // Semester durchlaufen
                for (const semester of semesterList) {
                    html += `<div class="semester-group" data-semester="${semester}">
                        <div class="semester-item">
                            <input type="checkbox" class="semester-checkbox">
                            <label>Semester ${semester}</label>
                        </div>
                        <div class="courses">`;

                    // Kurse durchlaufen (alphabetisch sortiert)
                    const courses = semesters[semester];
                    for (const courseName of Object.keys(courses).sort()) {
                        const courseList = courses[courseName];
                        html += `<div class="course-group" data-course="${courseName}">
                            <div class="course-item">
                                <input type="checkbox" class="course-checkbox">
                                <label>${courseName}</label>
                            </div>
                            <div class="courses">`;

                        // Kurseinträge durchlaufen und Events anzeigen
                        for (const kurs of courseList) {
                            if (kurs?.value?.events) {
                                for (const event of kurs.value.events) {
                                    const eventInfo = `${event.type} (${event.day}, ${event.from} - ${event.until}, Raum: ${event.room}${event.who ? `, Dozent: ${event.who}` : ''}${event.group ? `, Gruppe: ${event.group}` : ''}, ${event.period_from} - ${event.period_until})`;
                                    const isChecked = currentCourses.some(c => c.value.events.some(e => e.key === event.key)); // Prüfe, ob Event ausgewählt ist
                                    html += `<div class="event-item">
                                        <input type="checkbox" class="event-checkbox" data-course-key="${kurs.key}" data-event-key="${event.key}" ${isChecked ? 'checked' : ''}>
                                        <label>${eventInfo}${kurs.value.createdBy === "student" ? ' [eigene Veranstaltung]' : ''}</label>
                                    </div>`;
                                }
                            }
                        }
                        html += `</div></div>`;
                    }
                    html += `</div></div>`;
                }
                html += `</div></div>`;
            }
            courseCheckboxList.innerHTML = html;

            courseCheckboxList.querySelectorAll('.event-checkbox').forEach(checkbox => {
                updateParentCheckboxes(checkbox);
            });

            await initCheckboxListeners(container, courseCheckboxList);
            initDropdownButtonAndSearch(container, courseCheckboxList);
        };

        const updateParentCheckboxes = (eventCheckbox) => {
            const eventItem = eventCheckbox.closest('.event-item');
            const courseGroup = eventItem.closest('.course-group');
            const semesterGroup = courseGroup.closest('.semester-group');

            const eventCheckboxes = courseGroup.querySelectorAll('.event-checkbox');
            const courseCheckbox = courseGroup.querySelector('.course-checkbox');

            const courseAllChecked = Array.from(eventCheckboxes).every(cb => cb.checked);
            const courseSomeChecked = Array.from(eventCheckboxes).some(cb => cb.checked);

            if (courseCheckbox) {
                courseCheckbox.checked = courseAllChecked;
                courseCheckbox.indeterminate = courseSomeChecked && !courseAllChecked;
            }

            const semesterCheckbox = semesterGroup.querySelector('.semester-checkbox');
            const courseCheckboxes = semesterGroup.querySelectorAll('.course-checkbox');
            const semesterAllChecked = Array.from(courseCheckboxes).every(cb => cb.checked);
            const semesterSomeChecked = Array.from(courseCheckboxes).some(cb => cb.checked || cb.indeterminate);
            if (semesterCheckbox) {
                semesterCheckbox.checked = semesterAllChecked;
                semesterCheckbox.indeterminate = semesterSomeChecked && !semesterAllChecked;
            }
        };

        const saveSelectedCourses = async () => {
            try {
                const scheduleData = {
                    key: studentId,
                    value: {
                        student_id: studentId,
                        courses: currentCourses
                            .filter(course => course && course.value && course.value.course)
                            .map(course => ({
                                key: course.key,
                                course: course.value.course,
                                events: course.value.events.map(event => ({
                                    ...event,
                                    color: event.color || "",
                                    note: event.note || ""
                                }))
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

        const initCheckboxListeners = async (container, courseCheckboxList) => {
            const selectedScheduleContainer = container.querySelector('#selected-schedule');

            courseCheckboxList.querySelectorAll('.semester-checkbox').forEach(checkbox => {
                checkbox.addEventListener('change', async (e) => {
                    const semesterGroup = e.target.closest('.semester-group');
                    const eventCheckboxes = semesterGroup.querySelectorAll('.event-checkbox');
                    eventCheckboxes.forEach(cb => {
                        cb.checked = e.target.checked;
                        const courseKey = cb.dataset.courseKey;
                        const eventKey = cb.dataset.eventKey;
                        const course = allCourses.find(k => k.key === courseKey);
                        const event = course.value.events.find(e => e.key === eventKey);

                        if (e.target.checked) {
                            let courseInCurrent = currentCourses.find(c => c.key === courseKey);
                            if (!courseInCurrent) {
                                courseInCurrent = {
                                    key: courseKey,
                                    course: course.value.course,
                                    value: {
                                        course: course.value.course,
                                        course_of_study: course.value.course_of_study,
                                        createdBy: course.value.createdBy,
                                        events: []
                                    }
                                };
                                currentCourses.push(courseInCurrent);
                            }
                            if (!courseInCurrent.value.events.some(e => e.key === eventKey)) {
                                courseInCurrent.value.events.push(event);
                                renderCourse(courseInCurrent, updateParentCheckboxes);
                            }
                        } else {
                            const courseInCurrent = currentCourses.find(c => c.key === courseKey);
                            if (courseInCurrent) {
                                courseInCurrent.value.events = courseInCurrent.value.events.filter(e => e.key !== eventKey);
                                if (courseInCurrent.value.events.length === 0) {
                                    currentCourses = currentCourses.filter(c => c.key !== courseKey);
                                    const courseElement = selectedScheduleContainer.querySelector(`.course-item[data-key="${courseKey}"]`);
                                    if (courseElement) selectedScheduleContainer.removeChild(courseElement);
                                } else {
                                    const courseElement = selectedScheduleContainer.querySelector(`.course-item[data-key="${courseKey}"]`);
                                    if (courseElement) selectedScheduleContainer.removeChild(courseElement);
                                    renderCourse(courseInCurrent, updateParentCheckboxes);
                                }
                            }
                        }
                    });
                    if (eventCheckboxes.length > 0) {
                        eventCheckboxes.forEach(cb => updateParentCheckboxes(cb));
                    }
                    await saveSelectedCourses();
                });
            });

            courseCheckboxList.querySelectorAll('.course-checkbox').forEach(checkbox => {
                checkbox.addEventListener('change', async (e) => {
                    const courseGroup = e.target.closest('.course-group');
                    const eventCheckboxes = courseGroup.querySelectorAll('.event-checkbox');
                    eventCheckboxes.forEach(cb => {
                        cb.checked = e.target.checked;
                        const courseKey = cb.dataset.courseKey;
                        const eventKey = cb.dataset.eventKey;
                        const course = allCourses.find(k => k.key === courseKey);
                        const event = course.value.events.find(e => e.key === eventKey);

                        if (e.target.checked) {
                            let courseInCurrent = currentCourses.find(c => c.key === courseKey);
                            if (!courseInCurrent) {
                                courseInCurrent = {
                                    key: courseKey,
                                    course: course.value.course,
                                    color: "",
                                    note: "",
                                    value: {
                                        course: course.value.course,
                                        course_of_study: course.value.course_of_study,
                                        createdBy: course.value.createdBy,
                                        events: []
                                    }
                                };
                                currentCourses.push(courseInCurrent);
                            }
                            if (!courseInCurrent.value.events.some(e => e.key === eventKey)) {
                                courseInCurrent.value.events.push(event);
                                renderCourse(courseInCurrent, updateParentCheckboxes);
                            }
                        } else {
                            const courseInCurrent = currentCourses.find(c => c.key === courseKey);
                            if (courseInCurrent) {
                                courseInCurrent.value.events = courseInCurrent.value.events.filter(e => e.key !== eventKey);
                                if (courseInCurrent.value.events.length === 0) {
                                    currentCourses = currentCourses.filter(c => c.key !== courseKey);
                                    const courseElement = selectedScheduleContainer.querySelector(`.course-item[data-key="${courseKey}"]`);
                                    if (courseElement) selectedScheduleContainer.removeChild(courseElement);
                                } else {
                                    const courseElement = selectedScheduleContainer.querySelector(`.course-item[data-key="${courseKey}"]`);
                                    if (courseElement) selectedScheduleContainer.removeChild(courseElement);
                                    renderCourse(courseInCurrent, updateParentCheckboxes);
                                }
                            }
                        }
                    });
                    if (eventCheckboxes.length > 0) {
                        updateParentCheckboxes(eventCheckboxes[0]);
                    }
                    await saveSelectedCourses();
                });
            });

            courseCheckboxList.querySelectorAll('.event-checkbox').forEach(checkbox => {
                checkbox.addEventListener('change', async (e) => {
                    const courseKey = e.target.dataset.courseKey;
                    const eventKey = e.target.dataset.eventKey;
                    const course = allCourses.find(k => k.key === courseKey);
                    const event = course.value.events.find(e => e.key === eventKey);

                    if (e.target.checked) {
                        let courseInCurrent = currentCourses.find(c => c.key === courseKey);
                        if (!courseInCurrent) {
                            courseInCurrent = {
                                key: courseKey,
                                course: course.value.course,
                                value: {
                                    course: course.value.course,
                                    course_of_study: course.value.course_of_study,
                                    createdBy: course.value.createdBy,
                                    events: []
                                }
                            };
                            currentCourses.push(courseInCurrent);
                        }
                        // Check if the event already exists
                        if (!courseInCurrent.value.events.some(e => e.key === eventKey)) {
                            courseInCurrent.value.events.push({
                                ...event,
                                color: event.color || "", // Initialize color
                                note: event.note || ""   // Initialize note
                            });
                            renderCourse(courseInCurrent, updateParentCheckboxes);
                        }
                    } else {
                        const courseInCurrent = currentCourses.find(c => c.key === courseKey);
                        if (courseInCurrent) {
                            courseInCurrent.value.events = courseInCurrent.value.events.filter(e => e.key !== eventKey);
                            if (courseInCurrent.value.events.length === 0) {
                                currentCourses = currentCourses.filter(c => c.key !== courseKey);
                                const courseElement = selectedScheduleContainer.querySelector(`.course-item[data-key="${courseKey}"]`);
                                if (courseElement) selectedScheduleContainer.removeChild(courseElement);
                            } else {
                                const courseElement = selectedScheduleContainer.querySelector(`.course-item[data-key="${courseKey}"]`);
                                if (courseElement) selectedScheduleContainer.removeChild(courseElement);
                                renderCourse(courseInCurrent, updateParentCheckboxes);
                            }
                        }
                    }
                    updateParentCheckboxes(e.target);
                    await saveSelectedCourses();
                });
            });
        };

        const renderCourse = (course, updateParentCheckbox) => {
            const selectedScheduleContainer = self.element.querySelector('#selected-schedule');
            if (!course.value.events || !Array.isArray(course.value.events)) {
                console.warn(`Kurs ${course.value.course} hat keine gültigen Events.`, course);
                course.value.events = [];
            }

            course.value.events.forEach(event => {
                const existingCourseHtml = selectedScheduleContainer.querySelector(`.event-info[data-event-key="${event.key}"]`);
                if (existingCourseHtml) {
                    return;
                }
                const courseHtml = self.ccm.helper.html(self.html.editView.courseItem, {
                    key: course.key,
                    courseTitle: course.value.course + " (" + event.type + ")" || "Unbekannter Kurs",
                    eventKey: event.key
                });
                selectedScheduleContainer.appendChild(courseHtml);

                const eventInfo = courseHtml.querySelector('.event-info');
                eventInfo.innerText = `${event.day}, ${event.from} - ${event.until}, Raum: ${event.room}${event.who ? `, Dozent: ${event.who}` : ''}${event.group ? `, Gruppe: ${event.group}` : ''}, ${event.period_from} - ${event.period_until}`;
                eventInfo.setAttribute('data-event-key', event.key);

                // Handle color
                const colorSelect = courseHtml.querySelector(`#event-color-${event.key}`);
                if (event.color) {
                    colorSelect.value = event.color;
                    courseHtml.style.backgroundColor = event.color;
                }
                colorSelect.addEventListener('change', async (e) => {
                    event.color = e.target.value;
                    courseHtml.style.backgroundColor = e.target.value || '';
                    await saveSelectedCourses();
                });

                // Handle note
                const noteContainer = courseHtml.querySelector(`#event-note-container-${event.key}`);
                if (event.note && event.note.trim() !== "") {
                    noteContainer.innerHTML = `
                        <label for="event-note-${event.key}">Notiz:</label>
                        <textarea class="event-note-textarea" id="event-note-${event.key}" placeholder="Deine Notiz...">${event.note}</textarea>
                    `;

                    const noteTextarea = noteContainer.querySelector(`#event-note-${event.key}`);
                    noteTextarea.addEventListener('blur', async function handleBlur() {
                        const newNote = noteTextarea.value.trim();
                        event.note = newNote;
                        await saveSelectedCourses();
                        if (!newNote) {
                            initAddNoteButton(noteContainer, event);
                        }
                    });
                } else {
                    initAddNoteButton(noteContainer, event);
                }

                function initAddNoteButton(container, event) {
                    container.innerHTML = `<button class="add-note-button">Notiz hinzufügen</button>`;
                    const addNoteButton = container.querySelector('.add-note-button');
                    addNoteButton.addEventListener('click', () => {
                        container.innerHTML = `
                            <label for="event-note-${event.key}">Notiz:</label>
                            <textarea class="event-note-textarea" id="event-note-${event.key}" placeholder="Deine Notiz..."></textarea>
                        `;
                        const newTextarea = container.querySelector(`#event-note-${event.key}`);
                        newTextarea.focus();
                        newTextarea.addEventListener('blur', async function handleBlur() {
                            const newNote = newTextarea.value.trim();
                            event.note = newNote;
                            await saveSelectedCourses();
                            if (!newNote) {
                                initAddNoteButton(container, event);
                            }
                        });
                    });
                }

                // Event entfernen
                courseHtml.querySelector('.remove-event-button').addEventListener('click', async () => {
                    console.log('Removing event with key:', event.key);
                    const courseInCurrent = currentCourses.find(c => c.key === course.key);
                    if (courseInCurrent) {
                        courseInCurrent.value.events = courseInCurrent.value.events.filter(e => e.key !== event.key);
                        if (courseInCurrent.value.events.length === 0) {
                            currentCourses = currentCourses.filter(c => c.key !== course.key);
                        }
                        selectedScheduleContainer.removeChild(courseHtml);

                        const courseCheckboxList = self.element.querySelector('#course-checkbox-list');
                        const checkbox = courseCheckboxList.querySelector(`.event-checkbox[data-event-key="${event.key}"]`);
                        if (checkbox) {
                            checkbox.checked = false;
                            updateParentCheckboxes(checkbox);
                        }

                        await saveSelectedCourses();
                    }
                });
            });
        };

        const initDropdownButtonAndSearch = (container, courseCheckboxList) => {
            const dropdownButton = container.querySelector('#course-dropdown-button');
            const dropdownContent = container.querySelector('#course-dropdown-content');
            const searchInput = container.querySelector('#course-search');

            dropdownButton.onclick = (event) => {
                event.stopPropagation();
                const isOpen = dropdownContent.style.display === 'block';
                dropdownContent.style.display = isOpen ? 'none' : 'block';
                dropdownButton.textContent = isOpen ? 'Kurs hinzufügen ▼' : 'Kurs hinzufügen ▲';
                if (!isOpen) searchInput.focus();
            };
            // todo nicht genau engeschaut, aberscheint zu funktionieren
            //  todo überprfen nach was man suchen könnnen soll
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

        const addNoteToCourse = async (courseKey, note) => {
            const course = currentCourses.find(c => c.key === courseKey);
            if (course) {
                course.note = note;
                await saveSelectedCourses();
            }
        };



        // Render Schedule View
        this.renderScheduleView = async () => {
            const scheduleHtml = await renderSchedule();
            const container = self.element.querySelector('#main-content');
            container.innerHTML = '';
            container.appendChild(scheduleHtml);

            container.querySelectorAll('.event').forEach(event => {
                event.addEventListener('click', async () => {
                    const courseId = event.getAttribute('data-course-id');
                    const eventId = event.getAttribute('data-event-id');
                    await self.openModal(courseId, eventId);
                });
            });

            container.querySelector('.close').addEventListener('click', self.closeModal);
        };

        const renderSchedule = async () => {
            const schedule = {};

            if (currentCourses.length > 0) {
                currentCourses.forEach(course => {
                    if (course && course.value && course.value.events) {
                        course.value.events.forEach(event => {
                            const normalizedDay = normalizeDay(event.day || "Unbekannt");
                            if (!schedule[normalizedDay]) schedule[normalizedDay] = [];
                            schedule[normalizedDay].push({
                                title: `${course.value.course} (${event.type})${event.group ? ` [${event.group}]` : ''}`,
                                time: `${event.from} - ${event.until}`,
                                room: event.room,
                                who: event.who || "Unbekannt",
                                period: `${event.period_from} - ${event.period_until}`,
                                color: event.color || "#F0F0F0",
                                courseId: course.key,
                                eventId: event.key,
                                note: event.note || ""
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
                    <div class="event" data-course-id="${event.courseId}" data-event-id="${event.eventId}" style="background-color: ${event.color};">
                      <div class="event-header">
                        <strong>${event.title}</strong>
                        ${event.note && event.note.trim() !== "" ? `
                          <span class="note-icon">📝
                            <span class="tooltip">${event.note}</span>
                          </span>
                        ` : ''}
                      </div>
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

        this.openModal = async (courseId, eventId) => {
            let course = currentCourses.filter(c => c.key === courseId)[0];
            let event = course.value.events.filter(e => e.key === eventId)[0];

            self.element.querySelector("#modal-title").innerText = `${course.value.course} (${event.type})${event.group ? ` [${event.group}]` : ''}`;
            // todo fix links
            /*
            if (!event || !event.links) {
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

             */

            if (event.links) {
                self.element.querySelector('#modal-links').innerText = event.note;
            } else {
                self.element.querySelector('#modal-links').innerText = 'Keine Links vorhanden.';
            }

            if (event.note) {
                self.element.querySelector('#modal-note').innerText = event.note;
            } else {
                self.element.querySelector('#modal-note').innerText = 'Keine Notiz vorhanden.';
            }
            self.element.querySelector('#modal').style.display = 'block';
        };

        this.closeModal = () => {
            const modal = self.element.querySelector('#modal');
            if (modal) modal.style.display = 'none';
            else console.error("Modal element not found in closeModal!");
        };



        // Small helper functions
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
    }
};
