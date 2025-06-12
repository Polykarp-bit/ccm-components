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
        text: {
            configureTimetableText: "Stundenplan Konfigurieren",
            timeTableText: "Stundenplan",
            plsLoggin: "Bitte logge dich ein, um deinen Stundenplan zu sehen",
            timtableEditText: "Stundenplan bearbeiten",
            addOwnCourseText: "Eigenen Kurs hinzufügen",
            addCourseText: "Kurs hinzufügen",
            courseNameText: "Kursname: *",
            coursePlaceholderText: "z.B. Einführung in die ...",
            cancelText: "Abbrechen",
            addCourseDropdownText: "Kurs hinzufügen ▼",
            courseSearchPlaceholderText: "Kurs suchen ...",
            allDaysText: "Alle Tage",
            mondayText: "Montag",
            tuesdayText: "Dienstag",
            wednesdayText: "Mittwoch",
            thursdayText: "Donnerstag",
            fridayText: "Freitag",
            saturdayText: "Samstag",
            sundayText: "Sonntag",
            selectedScheduleText: "Ausgewählter Stundenplan",
            typeText: "Typ *",
            chooseTypeText: "Wähle einen Typ",
            lectureText: "Vorlesung",
            exerciseText: "Übung",
            seminarText: "Seminar",
            practicalText: "Praktikum",
            sportCourseText: "Sportkurs",
            languageCourseText: "Sprachkurs",
            tutorialText: "Tutorium",
            otherText: "Sonstiges",
            dayText: "Tag *",
            chooseDayText: "Wähle einen Tag",
            startTimeText: "Startzeit *",
            endTimeText: "Endzeit *",
            roomText: "Raum *",
            roomPlaceholderText: "z.B. St-C116",
            startDateText: "Startdatum *",
            startDatePlaceholderText: "z.B. 03.04.2025",
            endDateText: "Enddatum *",
            endDatePlaceholderText: "z.B. 26.06.2025",
            teacherText: "Dozent (optional)",
            teacherPlaceholderText: "z.B. Prof. Müller",
            groupText: "Gruppe (optional)",
            groupPlaceholderText: "z.B. A",
            removeEventButtonText: "Veranstaltung entfernen",
            courseItemTitleText: "Kursname",
            eventTimeDataText: "Veranstaltungszeit",
            eventNoteText: "Notizen",
            eventColorText: "Farbe:",
            noNotesText: "Keine Notizen vorhanden",
            noLinksText: "Keine Links vorhanden",
        },
        user: ["ccm.instance", "https://ccmjs.github.io/akless-components/user/ccm.user.js"],
        helper: ["ccm.load", "https://ccmjs.github.io/akless-components/modules/versions/helper-8.4.2.min.mjs"],
        html: {
            // hier sind noch texte
            mainTemplate: `
                <div id="main-template">
                    <div id="toggle-button">
                    <button id="toggle-view-button" onclick="%onToggleButton%">Stundenplan Konfigurieren</button>
                    </div>
                    <div id="user"></div>
                    <div id="main-content">
                        <h1>Stundenplan</h1>
                        <p>Bitte logge dich ein, um deinen Stundenplan zu sehen</p>
                    </div>
                </div>
            `,
            editView: {
                main: `
                  <h1>%timtableEditText%</h1>
                  <div id="schedule-container">
                    <div class="add-course-header">
                      <button id="add-course-button" onclick="%onAddCourseButton%">%addOwnCourseText%</button>
                    </div>
                    <div id="course-form-container" style="display: none;">
                      <form id="course-form" onsubmit="%onCourseForm%">
                        <h2>%addCourseText%</h2>
                        <div class="form-group">
                          <label for="course-title">%courseNameText%</label>
                          <input type="text" id="course-title" name="course-title" placeholder="%coursePlaceholderText%" required>
                        </div>
                        <div id="events-container" onclick="%onEventContainer%"></div>
                        <button type="submit" id="submit-course-button">%addCourseText%</button>
                        <button type="button" id="cancel-button" onclick="%onCancelButton%">%cancelText%</button>
                      </form>
                    </div>
                    <div class="dropdown-container">
                      <button id="course-dropdown-button" class="dropdown-button">%addCourseDropdownText%</button>
                      <div id="course-dropdown-content" class="dropdown-content">
                        <input type="text" id="course-search" placeholder="%courseSearchPlaceholderText%">
                        <select id="day-filter">
                          <option value="">%allDaysText%</option>
                          <option value="Montag">%mondayText%</option>
                          <option value="Dienstag">%tuesdayText%</option>
                          <option value="Mittwoch">%wednesdayText%</option>
                          <option value="Donnerstag">%thursdayText%</option>
                          <option value="Freitag">%fridayText%</option>
                          <option value="Sa">%saturdayText%</option>
                          <option value="So">%sundayText%</option>
                        </select>
                        <div id="course-checkbox-list"></div>
                      </div>
                    </div>
                    <h2>%selectedScheduleText%</h2>
                    <div id="selected-schedule"></div>
                  </div>
                `,

                checkboxStudyName:`
                    <div class="study-group" data-study="%studyName%">
                        <div class="study-item">
                            <label>%studyName%</label>
                        </div>
                        <div class="semesters"></div>
                    </div>`,

                checkboxSemester:`
                    <div class="semester-group" data-semester="%semester%">
                        <div class="semester-item">
                            <input type="checkbox" class="semester-checkbox">
                            <label>Semester %semester%</label>
                        </div>
                        <div class="courses"></div>
                    </div>`,

                checkboxCourseItem:
                    `<div class="course-group" data-course="%courseName%">
                        <div class="course-item">
                            <input type="checkbox" class="course-checkbox">
                            <label>%courseName%</label>
                        </div>
                        <div class="courses"></div>
                    </div>`,

                checkboxStudyEvent:
                    `<div class="event-item">
                        <input type="checkbox" class="event-checkbox" data-course-key="%courseKey%" data-event-key="%eventKey%" data-event-day="%day%" checked=%isChecked%>
                        <label>%eventInfo%</label>
                    </div>`,

                eventItem: `
                    <div class="event-form" data-index="%index%">
                      <div class="form-group">
                        <label for="event-type-%index%">%typeText%</label>
                        <select id="event-type-%index%" name="event-type-%index%" required>
                          <option value="" disabled selected>%chooseTypeText%</option>
                          <option value="Vorlesung">%lectureText%</option>
                          <option value="Übung">%exerciseText%</option>
                          <option value="Seminar">%seminarText%</option>
                          <option value="Praktikum">%practicalText%</option>
                          <option value="Sportkurs">%sportCourseText%</option>
                          <option value="Sprachkurs">%languageCourseText%</option>
                          <option value="Tutorium">%tutorialText%</option>
                          <option value="Sonstiges">%otherText%</option>
                        </select>
                      </div>
                      <div class="form-group">
                        <label for="event-day-%index%">%dayText%</label>
                        <select id="event-day-%index%" name="event-day-%index%" required>
                          <option value="" disabled selected>%chooseDayText%</option>
                          <option value="Mo">%mondayText%</option>
                          <option value="Di">%tuesdayText%</option>
                          <option value="Mi">Mittwoch</option>
                          <option value="Do">Donnerstag</option>
                          <option value="Fr">Freitag</option>
                          <option value="Sa">Samstag</option>
                          <option value="So">Sonntag</option>
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
                    <div class="course-item" data-key="%key%" style="border-left: 5px solid %borderColor%">
                        <div class="course-item-row course-item-main-info">
                            <div class="course-item-details">
                                <h3>%courseTitle%</h3>
                                <div class="event-info" data-event-key="%eventKey%">
                                    %eventTimeData%
                                    </div>
                            </div>
                            <div class="course-item-primary-actions">
                                <div class="event-note" id="event-note-container-%eventKey%">
                                    </div>
                                 <div class="event-color" id="event-color-container-%eventKey%">
                                    <label for="event-color-%eventKey%">Farbe:</label>
                                    <input type="color" class="color-picker" id="event-color-%eventKey%" value="%colorValue%">
                                </div>
                                <div class="course-actions">
                                    <button class="remove-event-button">Entfernen</button>
                                </div>
                            </div>
                        </div>
                        <div class="course-item-row event-links-section" id="event-links-section-%eventKey%">
                            <label class="links-label">Links:</label>
                            <div class="current-event-links" id="current-event-links-%eventKey%">
                                </div>
                            <div class="add-new-link-form-inline">
                                <input type="text" class="new-link-title-inline" placeholder="Link Titel">
                                <input type="url" class="new-link-url-inline" placeholder="Link URL">
                                <button type="button" class="add-link-inline-button" data-event-key="%eventKey%">Link hinzufügen</button>
                            </div>
                        </div>
                    </div>`
            },
            scheduleView: {
                // hier sind noch texte
                main: `
                  <h1>Stundenplan für %studentId%</h1>
                  <div class="container">
                    <div class="section">
                      <div class="week-schedule">
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
                        <div id="modal-other-apps"></div>
                      </div>
                    </div>
                  </div>
                `,
                dayColumn: `
                    <div class="day">
                      <h3>%day%</h3>
                      <div class="events-container"></div>
                    </div>
                `,

                eventItem: `
                    <div class="event" data-course-id="%courseId%" data-event-id="%eventId%" style="background-color: %color%;">
                      <div class="event-header">
                        <strong>%title%</strong>
                        %noteIcon%
                      </div>
                      <span>%time%</span><br>
                      <span>Raum: %room%</span><br>
                      <span>Dozent: %who%</span><br>
                      <span>Zeitraum: %period%</span>
                    </div>
                `,

                noteIcon: `
                    <span class="note-icon">📝
                        <span class="tooltip">%note%</span>
                    </span>
                `,
                noEvents: `<p>Keine Kurse an diesem Tag.</p>`
            },

        },
        onchange: event => console.log(event),
        },

    Instance: function () {
        let self = this;
        let studentId;
        let allCourses = [];
        let currentCourses = [];
        let isEditMode = false;
        let toggleButton;

        this.init = async () => {
            $ = Object.assign({}, this.ccm.helper, this.helper);
            $.use(this.ccm);
            if (this.user) this.user.onchange = this.start;
        }

        this.start = async () => {
            console.log("courseStore:", await self.courseStore.get());
            console.log("studentCourseStore:", await self.studentCourseStore.get());
            console.log("studentStore:", await self.studentStore.get());

            const mainTemplate = document.createElement('div');
            $.setContent(mainTemplate, $.html(self.html.mainTemplate, {
                previewListText: self.text.previewListText,
                onToggleButton: () => {
                    isEditMode = !isEditMode;
                    self.renderView();
                },
            }));
            $.setContent(self.element, mainTemplate);

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

            if (savedSchedule?.value?.courses) {
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

        this.getValue = () => {
            return currentCourses;
        }

        this.renderView = async () => {
            const toggleButton = self.element.querySelector('#toggle-view-button');
            // hier auch texte
            toggleButton.textContent = isEditMode ? 'Zur Stundenplanansicht' : 'Stundenplan Konfigurieren';

            if (isEditMode) {
                await self.renderEditView();
            } else {
                await self.renderScheduleView();
            }
        };

        this.renderEditView = async () => {
            const mainHtml = self.ccm.helper.html(self.html.editView.main, {
                timtableEditText: self.text.timtableEditText,
                addOwnCourseText: self.text.addOwnCourseText,
                addCourseText: self.text.addCourseText,
                courseNameText: self.text.courseNameText,
                cancelText: self.text.cancelText,
                addCourseDropdownText: self.text.addCourseDropdownText,
                courseSearchPlaceholderText: self.text.courseSearchPlaceholderText,
                allDaysText: self.text.allDaysText,
                mondayText: self.text.mondayText,
                tuesdayText: self.text.tuesdayText,
                wednesdayText: self.text.wednesdayText,
                thursdayText: self.text.thursdayText,
                fridayText: self.text.fridayText,
                saturdayText: self.text.saturdayText,
                sundayText: self.text.sundayText,
                selectedScheduleText: self.text.selectedScheduleText,
                // hier könnte man in events auslagern muss man aber auach nicht
                onAddCourseButton: () => {
                    eventsContainer.innerHTML = '';
                    const eventFormHtml = self.ccm.helper.html(self.html.editView.eventItem, {
                        index: 0
                    });
                    eventsContainer.appendChild(eventFormHtml);
                    courseFormContainer.style.display = 'block';
                    addCourseButton.style.display = 'none';
                    courseForm.querySelector('#course-title').focus();
                },
                onCancelButton: () => {
                    courseFormContainer.style.display = 'none';
                    addCourseButton.style.display = 'block';
                    courseForm.querySelector('#course-title').value = '';
                },
                onEventContainer: (e) => {
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
                },
                onCourseForm: async (event) => {
                    event.preventDefault();
                    try {
                        await addNewCourse(courseForm);
                        await self.renderEditView();
                    } catch (e) {
                        console.error("Fehler beim Hinzufügen eines Kurses: ", e);
                        alert(e.message);
                    }
                }

            });
            const container = self.element.querySelector('#main-content');
            container.innerHTML = '';
            container.appendChild(mainHtml);

            const courseFormContainer = container.querySelector('#course-form-container');
            const courseForm = container.querySelector('#course-form');
            const addCourseButton = container.querySelector('#add-course-button');
            const cancelButton = container.querySelector('#cancel-button');
            const eventsContainer = courseForm.querySelector('#events-container');

            let eventIndex = 0;

            // hier kann wahrscheinlch weg
            const addEventForm = (index) => {
                const eventForm = eventsContainer.querySelector(`.event-form[data-index="${index}"]`);
                if (!eventForm) {
                    const eventFormHtml = self.ccm.helper.html(self.html.editView.eventItem, {
                        index: index,
                        removeEventButtonStyle: index === 0 ? 'display: none;' : ''
                    });
                    eventsContainer.appendChild(eventFormHtml);
                }
            };
            await initSelectCoursesDropdown(container);

            currentCourses.forEach(course => {
                renderCourse(course, updateParentCheckboxes);
            });
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

            for (const studyName of Object.keys(studyGroups).sort()) {
                const studyHtml = $.html(self.html.editView.checkboxStudyName, {
                    studyName: studyName,
                });
                $.append(courseCheckboxList, studyHtml);

                const semesters = studyGroups[studyName];
                const semesterList = Object.keys(semesters).sort((a, b) => {
                    if (a === "N/A") return 1;
                    if (b === "N/A") return -1;
                    return parseInt(a) - parseInt(b);
                });

                for (const semester of semesterList) {
                    const semesterHtml = $.html(self.html.editView.checkboxSemester, {
                        semester: semester,
                    });

                    $.append(studyHtml.querySelector(".semesters"), semesterHtml);

                    const courses = semesters[semester];
                    for (const courseName of Object.keys(courses).sort()) {
                        const courseList = courses[courseName];
                        const courseHtml = $.html(self.html.editView.checkboxCourseItem, {
                            courseName: courseName,
                        });
                        $.append(semesterHtml.querySelector('.courses'), courseHtml);

                        for (const kurs of courseList) {
                            if (kurs?.value?.events) {
                                for (const event of kurs.value.events) {
                                    const eventInfo = `${event.type} (${event.day}, ${event.from} - ${event.until}, Raum: ${event.room}${event.who ? `, Dozent: ${event.who}` : ''}${event.group ? `, Gruppe: ${event.group}` : ''}, ${event.period_from} - ${event.period_until})`;
                                    const isChecked = currentCourses.some(c => c.value.events.some(e => e.key === event.key)); // Prüfe, ob Event ausgewählt ist

                                    const eventItemHtml = self.ccm.helper.html(self.html.editView.checkboxStudyEvent, {
                                        courseKey: kurs.key,
                                        eventKey: event.key,
                                        day: normalizeDay(event.day),
                                        eventDay: normalizeDay(event.day),
                                        isChecked: isChecked,
                                        eventInfo: eventInfo + (kurs.value.createdBy === "student" ? ' [eigene Veranstaltung]' : ''),
                                    });
                                    $.append(courseHtml.querySelector('.courses'), eventItemHtml);
                                }
                            }
                        }
                    }
                }
            }
            courseCheckboxList.querySelectorAll('.event-checkbox').forEach(checkbox => {
                updateParentCheckboxes(checkbox);
            });

            await initCheckboxListeners(container, courseCheckboxList);
            initDropdownButtonAndSearch(container, courseCheckboxList);
        };

        const updateParentCheckboxes = (eventCheckbox) => {

            const courseGroup = eventCheckbox.closest('.course-group');
            if (!courseGroup) return;
            const semesterGroup = courseGroup.closest('.semester-group');
            if (!semesterGroup) return;

            const courseCheckbox = courseGroup.querySelector('.course-checkbox');
            const allEventCheckboxes = courseGroup.querySelectorAll('.event-checkbox');

            const allEventsChecked = Array.from(allEventCheckboxes).every(cb => cb.checked);
            const someEventsChecked = Array.from(allEventCheckboxes).some(cb => cb.checked);

            courseCheckbox.checked = allEventsChecked;
            courseCheckbox.indeterminate = someEventsChecked && !allEventsChecked;

            const semesterCheckbox = semesterGroup.querySelector('.semester-checkbox');
            const allCourseCheckboxes = semesterGroup.querySelectorAll('.course-checkbox');

            const allCoursesChecked = Array.from(allCourseCheckboxes).every(cb => cb.checked && !cb.indeterminate);
            const someCoursesChecked = Array.from(allCourseCheckboxes).some(cb => cb.checked || cb.indeterminate);

            semesterCheckbox.checked = allCoursesChecked;
            semesterCheckbox.indeterminate = someCoursesChecked && !allCoursesChecked;
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
                this.onchange && this.onchange({event:"saveCourse", instance: self});
            } catch (e) {
                console.error("Fehler beim Speichern der Kurse:", e);
                alert("Fehler beim Speichern der Kurse. Bitte versuche es erneut.");
            }
        };


        const initCheckboxListeners = async (container, courseCheckboxList) => {
            const selectedScheduleContainer = container.querySelector('#selected-schedule');

            const handleCheckboxChange = async (checkbox) => {
                const courseKey = checkbox.dataset.courseKey;
                const eventKey = checkbox.dataset.eventKey;
                const isChecked = checkbox.checked;

                const courseFromAll = allCourses.find(c => c.key === courseKey);
                if (!courseFromAll) return;
                const eventFromAll = courseFromAll.value.events.find(e => e.key === eventKey);
                if (!eventFromAll) return;

                let courseInCurrent = currentCourses.find(c => c.key === courseKey);

                if (isChecked) {

                    if (!courseInCurrent) {
                        courseInCurrent = {
                            ...courseFromAll,
                            value: {
                                ...courseFromAll.value,
                                events: []
                            }
                        };
                        currentCourses.push(courseInCurrent);
                    }

                    if (!courseInCurrent.value.events.some(e => e.key === eventKey)) {
                        courseInCurrent.value.events.push({ ...eventFromAll });
                    }
                } else {

                    if (courseInCurrent) {

                        courseInCurrent.value.events = courseInCurrent.value.events.filter(e => e.key !== eventKey);

                        if (courseInCurrent.value.events.length === 0) {
                            currentCourses = currentCourses.filter(c => c.key !== courseKey);
                        }
                    }
                }
            };

            const redrawSelectedCourses = () => {
                selectedScheduleContainer.innerHTML = '';
                currentCourses.forEach(course => {

                    if (course.value.events.length > 0) {
                        renderCourse(course, updateParentCheckboxes);
                    }
                });
            };


            courseCheckboxList.addEventListener('change', async (e) => {
                const target = e.target;

                if (target.type !== 'checkbox') return;

                const isChecked = target.checked;
                let affectedEventCheckboxes = [];


                if (target.classList.contains('course-checkbox') || target.classList.contains('semester-checkbox')) {
                    const scope = target.closest('.course-group, .semester-group');
                    if (scope) {
                        affectedEventCheckboxes = Array.from(scope.querySelectorAll('.event-checkbox'));
                    }
                }
                else if (target.classList.contains('event-checkbox')) {
                    affectedEventCheckboxes.push(target);
                }


                if (affectedEventCheckboxes.length === 0) return;

                for (const checkbox of affectedEventCheckboxes) {
                    if (checkbox.checked !== isChecked) {
                        checkbox.checked = isChecked;

                        await handleCheckboxChange(checkbox);
                    }
                }

                redrawSelectedCourses();

                if (affectedEventCheckboxes.length > 0) {
                    updateParentCheckboxes(affectedEventCheckboxes[0]);
                }

                await saveSelectedCourses();
            });
        };

        const renderCourse = (course, updateParentCheckbox) => {
            const selectedScheduleContainer = self.element.querySelector('#selected-schedule');

            if (!course.value.events || !Array.isArray(course.value.events)) {
                console.warn(`Kurs ${course.value.course} hat keine gültigen Events.`, course);
                course.value.events = [];
            }

            course.value.events.forEach(event => {

                if (!event.links) {
                    event.links = [];
                }

                if (!event.color) {
                    event.color = '#cccccc';
                }

                const courseHtml = document.createElement('div');
                courseHtml.className = 'list-item';

                $.setContent(courseHtml, $.html(self.html.editView.courseItem, {
                    key: course.key,
                    courseTitle: course.value.course + " (" + event.type + ")" || "Unbekannter Kurs",
                    eventKey: event.key,
                    eventTimeData: `${event.day}, ${event.from} - ${event.until}, Raum: ${event.room}`,
                    borderColor: event.color,
                    colorValue: event.color
                }));

                $.append(selectedScheduleContainer, courseHtml);

                const colorPicker = courseHtml.querySelector(`#event-color-${event.key}`);
                colorPicker.addEventListener('input', async (e) => {
                    const newColor = e.target.value;
                    event.color = newColor;

                    const courseItemDiv = courseHtml.querySelector('.course-item');
                    if (courseItemDiv) courseItemDiv.style.borderLeft = `5px solid ${newColor}`;

                    await saveSelectedCourses();
                });


                const noteContainer = courseHtml.querySelector(`#event-note-container-${event.key}`);
                if (event.note && event.note.trim() !== "") {
                    noteContainer.innerHTML = `
                <textarea class="event-note-textarea" id="event-note-${event.key}" placeholder="Deine Notiz...">${event.note}</textarea>
                <button type="button" class="save-note-button small-button">Notiz speichern</button>
            `;
                    noteContainer.querySelector('.save-note-button').addEventListener('click', async () => {
                        event.note = noteContainer.querySelector('textarea').value.trim();
                        await saveSelectedCourses();
                        alert('Notiz gespeichert!');
                    });
                } else {
                    initAddNoteButton(noteContainer, event);
                }

                function initAddNoteButton(container, currentEvent) {
                    container.innerHTML = `<button class="add-note-button">Notiz hinzufügen</button>`;
                    const addNoteButton = container.querySelector('.add-note-button');
                    addNoteButton.addEventListener('click', () => {
                        container.innerHTML = `
                    <textarea class="event-note-textarea" id="event-note-${currentEvent.key}" placeholder="Deine Notiz..."></textarea>
                    <button type="button" class="save-note-button small-button">Notiz speichern</button>
                `;
                        const newTextarea = container.querySelector(`#event-note-${currentEvent.key}`);
                        const saveButton = container.querySelector('.save-note-button');
                        saveButton.addEventListener('click', async () => {
                            currentEvent.note = newTextarea.value.trim();
                            await saveSelectedCourses();
                            alert('Notiz gespeichert!');
                        });
                        newTextarea.focus();
                    });
                }

                const eventLinksSection = courseHtml.querySelector(`#event-links-section-${event.key}`);
                const currentLinksDiv = eventLinksSection.querySelector(`.current-event-links`);
                const addLinkInlineButton = eventLinksSection.querySelector('.add-link-inline-button');
                const newLinkTitleInput = eventLinksSection.querySelector('.new-link-title-inline');
                const newLinkUrlInput = eventLinksSection.querySelector('.new-link-url-inline');

                const refreshLinksDisplay = () => {
                    currentLinksDiv.innerHTML = '';
                    if (event.links && event.links.length > 0) {
                        event.links.forEach(link => {
                            const linkDisplayItem = document.createElement('div');
                            linkDisplayItem.classList.add('event-link-display-item');
                            const linkAnchor = document.createElement('a');
                            linkAnchor.href = link.url.match(/^https?:\/\//i) ? link.url : `https://${link.url}`;
                            linkAnchor.textContent = `${link.title || link.url}`;
                            linkAnchor.target = "_blank";
                            linkAnchor.rel = "noopener noreferrer";
                            const removeLinkBtn = document.createElement('button');
                            removeLinkBtn.textContent = 'Link entfernen';
                            removeLinkBtn.classList.add('remove-single-link-button', 'small-button');
                            removeLinkBtn.dataset.linkKey = link.key;
                            linkDisplayItem.appendChild(linkAnchor);
                            linkDisplayItem.appendChild(removeLinkBtn);
                            currentLinksDiv.appendChild(linkDisplayItem);
                        });
                    } else {
                        currentLinksDiv.innerHTML = '<p class="no-links-text">Keine Links für diese Veranstaltung vorhanden.</p>';
                    }
                };

                refreshLinksDisplay();

                addLinkInlineButton.addEventListener('click', async () => {
                    const title = newLinkTitleInput.value.trim();
                    let url = newLinkUrlInput.value.trim();
                    if (url) {
                        if (!url.match(/^https?:\/\//i)) {
                            url = 'https://' + url;
                        }
                        if (!event.links) event.links = [];
                        event.links.push({
                            key: self.ccm.helper.generateKey(),
                            title: title || url,
                            url: url
                        });
                        newLinkTitleInput.value = '';
                        newLinkUrlInput.value = '';
                        refreshLinksDisplay();
                        await saveSelectedCourses();
                    } else {
                        alert("Bitte geben Sie eine URL für den Link ein.");
                    }
                });

                currentLinksDiv.addEventListener('click', async (e) => {
                    if (e.target.classList.contains('remove-single-link-button')) {
                        const linkKeyToRemove = e.target.dataset.linkKey;
                        if (event.links) {
                            event.links = event.links.filter(link => link.key !== linkKeyToRemove);
                            refreshLinksDisplay();
                            await saveSelectedCourses();
                        }
                    }
                });

                courseHtml.querySelector('.remove-event-button').addEventListener('click', async () => {
                    const courseInCurrent = currentCourses.find(c => c.key === course.key);
                    if (courseInCurrent) {
                        courseInCurrent.value.events = courseInCurrent.value.events.filter(e => e.key !== event.key);
                        if (courseInCurrent.value.events.length === 0) {
                            currentCourses = currentCourses.filter(c => c.key !== course.key);
                        }
                        const itemToRemove = selectedScheduleContainer.querySelector(`.event-info[data-event-key="${event.key}"]`);
                        if(itemToRemove) itemToRemove.closest('.list-item').remove();

                        const courseCheckboxList = self.element.querySelector('#course-checkbox-list');
                        const checkbox = courseCheckboxList.querySelector(`.event-checkbox[data-event-key="${event.key}"]`);
                        if (checkbox) {
                            checkbox.checked = false;
                            if (typeof updateParentCheckboxes === 'function') {
                                updateParentCheckboxes(checkbox);
                            }
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
            const dayFilter = container.querySelector('#day-filter');

            dropdownButton.onclick = (event) => {
                event.stopPropagation();
                const isOpen = dropdownContent.style.display === 'block';
                dropdownContent.style.display = isOpen ? 'none' : 'block';
                dropdownButton.textContent = isOpen ? 'Kurs hinzufügen ▼' : 'Kurs hinzufügen ▲';
                if (!isOpen) searchInput.focus();
            };

            const filterCourses = () => {
                const searchTerm = searchInput.value.toLowerCase();
                const selectedDay = dayFilter.value;
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
                                const eventDay = eventItem.querySelector('.event-checkbox').dataset.eventDay;
                                const matchesText = (
                                    studyName.includes(searchTerm) ||
                                    semester.includes(searchTerm) ||
                                    courseName.includes(searchTerm) ||
                                    label.includes(searchTerm)
                                );
                                const matchesDay = !selectedDay || eventDay === selectedDay;
                                eventItem.style.display = matchesText && matchesDay ? 'flex' : 'none';
                                if (matchesText && matchesDay) hasVisibleEvent = true;
                            });
                            courseGroup.style.display = hasVisibleEvent ? 'block' : 'none';
                            if (hasVisibleEvent) hasVisibleCourse = true;
                        });
                        semesterGroup.style.display = hasVisibleCourse ? 'block' : 'none';
                        if (hasVisibleCourse) hasVisibleSemester = true;
                    });
                    studyGroup.style.display = hasVisibleSemester ? 'block' : 'none';
                });
            };

            searchInput.addEventListener('input', filterCourses);
            dayFilter.addEventListener('change', filterCourses);
        };
        // was hier mit
        const addNoteToCourse = async (courseKey, note) => {
            const course = currentCourses.find(c => c.key === courseKey);
            if (course) {
                course.note = note;
                await saveSelectedCourses();
            }
        };

        this.renderScheduleView = async () => {
            const scheduleViewElement = await renderSchedule();

            scheduleViewElement.addEventListener('click', async (e) => {

                const clickedEvent = e.target.closest('.event');
                const courseId = clickedEvent.getAttribute('data-course-id');

                if (clickedEvent) {
                    const eventId = clickedEvent.getAttribute('data-event-id');
                    await self.openModal(courseId, eventId);
                    console.log("Clicked element:", courseId);
                    return;
                }

                const clickedClose = e.target.closest('.close');
                if (clickedClose) {
                    self.closeModal();
                    return;
                }
                this.onchange && this.onchange({event: "schedule", instance: this.self, studentId: studentId, courseId: courseId,});
                console.log("Clicked close:", courseId);
            });

            const container = self.element.querySelector('#main-content');
            $.setContent(container, scheduleViewElement); // $.setContent leert und fügt hinzu in einem Schritt.
        };

        const renderSchedule = async () => {
            const schedule = {};
            const mainContainer = $.html(self.html.scheduleView.main, { studentId });
            const scheduleContainer = mainContainer.querySelector('.week-schedule');

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


            daysToDisplay.forEach(day => {
                const dayColumn = $.html(self.html.scheduleView.dayColumn, { day: day });
                const eventsContainer = dayColumn.querySelector('.events-container');

                if (schedule[day] && schedule[day].length > 0) {
                    const eventItems = schedule[day].map(event => {
                        const noteIconHtml = event.note.trim() !== ""
                            ? $.html(self.html.scheduleView.noteIcon, { note: event.note })
                            : '';

                        return $.html(self.html.scheduleView.eventItem, {
                            courseId: event.courseId,
                            eventId: event.eventId,
                            color: event.color,
                            title: event.title,
                            noteIcon: noteIconHtml,
                            time: event.time,
                            room: event.room,
                            who: event.who,
                            period: event.period
                        });
                    });

                    $.setContent(eventsContainer, eventItems);

                } else {

                    $.setContent(eventsContainer, $.html(self.html.scheduleView.noEvents));
                }

                scheduleContainer.appendChild(dayColumn);
            });


            return mainContainer;
        };

        this.openModal = async (courseId, eventId) => {
            try {
                console.log('--- openModal GESTARTET ---');
                console.log('courseId:', courseId, 'eventId:', eventId);
                const course = currentCourses.find(c => c.key === courseId);
                if (!course) {
                    console.error('ABBRUCH: Kurs konnte nicht gefunden werden.');
                    return;
                }
                const event = course.value.events.find(e => e.key === eventId);
                if (!event) {
                    console.error('ABBRUCH: Event konnte nicht im Kurs gefunden werden.');
                    return;
                }
                const modal = self.element.querySelector('#modal');
                if (!modal) {
                    console.error('ABBRUCH: Das Modal-Element mit der ID #modal wurde nicht im DOM gefunden.');
                    return;
                }
                const modalTitle = modal.querySelector("#modal-title");
                const modalLinks = modal.querySelector("#modal-links");
                const modalNote = modal.querySelector("#modal-note");

                modalTitle.innerText = `${course.value.course} (${event.type})${event.group ? ` [${event.group}]` : ''}`;
                modalLinks.innerHTML = '';
                if (event.links && event.links.length > 0) {
                    event.links.forEach(link => {
                        const linkContainer = $.html('div', { class: 'modal-link' });
                        const linkElement = $.html('a', {
                            href: link.url.match(/^https?:\/\//i) ? link.url : `https://${link.url}`,
                            target: '_blank',
                            rel: 'noopener noreferrer',
                            textContent: link.title || link.url
                        });
                        linkContainer.appendChild(linkElement);
                        modalLinks.appendChild(linkContainer);
                    });
                } else {
                    modalLinks.innerText = self.text.noLinksText;
                }
                modalNote.innerText = event.note && event.note.trim() !== "" ? event.note : self.text.noNotesText;

                modal.classList.add('is-open');
            } catch (error) {
                console.error('!!! FEHLER in openModal !!!:', error);
            }
        };
        this.closeModal = () => {
            const modal = self.element.querySelector('#modal');
            if (modal) {
                modal.classList.remove('is-open');
            } else {
                console.error("Modal element not found in closeModal!");
            }
        };


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
