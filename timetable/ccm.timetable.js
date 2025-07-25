/**
 * @overview ccm component for a timetable
 * @author Tobias Niederprüm <t.niederpruem@gmail.com>, 2025
 * @license The MIT License (MIT)
 */

ccm.files["ccm.timetable.js"] = {
    name: "timetable",
    ccm: "https://ccmjs.github.io/ccm/ccm.js",
    config: {
        // Enthält alle Kurse aus dem Curriculum
        courseStore: ["ccm.store", {url: "https://ccm2.inf.h-brs.de", name: "tniede2s_teacher_courses"}],
        // Enthält alle von Studierenden selbst erstellten Kurse
        studentCourseStore: ["ccm.store", {url: "https://ccm2.inf.h-brs.de", name: "tniede2s_student_courses"}],
        // Speichert die individuelle Stundenplan-Zusammenstellung für jeden Studierenden
        studentStore: ["ccm.store", {url: "https://ccm2.inf.h-brs.de", name: "tniede2s_student_schedules"}],
        css: ["ccm.load", "./resources/style.css"],
        text: {
            timeTableText: "Stundenplan",
            plsLoggin: "Bitte logge dich ein, um deinen Stundenplan zu sehen",
            timetableEditText: "Stundenplan bearbeiten",
            timeTableForText: "Stundenplan für ",
            addOwnCourseText: "Neuen Kurs anlegen",
            addCourseText: "Kurs hinzufügen",
            courseNameText: "Kursname *",
            coursePlaceholderText: "z.B. Einführung in die ...",
            cancelText: "Abbrechen",
            addCourseDropdownText: "Kurs aus Curriculum hinzufügen ▼",
            addCourseDropdownUpText: "Kurs aus Curriculum hinzufügen ▲",
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
            removeButtonText: "Veranstaltung entfernen",
            eventColorText: "Farbe:",
            noNotesText: "Keine Notiz vorhanden",
            noLinksText: "Keine Links vorhanden",
            semesterLabelText: "Semester ",
            linksLabelText: "Nützliche Links",
            linkTitleText: "Titel des Links",
            linkUrlText: "https://beispiel.de",
            addLinkInlineButtonText: "Link hinzufügen",
            noteLabelText: "Notiz",
            noteText: "Notiz",
            eventItemRoomText: "Raum: ",
            eventItemWhoText: "Dozent: ",
            eventItemPeriodText: "Zeitraum: ",
            toTimeText: "Zur Stundenplanansicht",
            timetableConfigureText: "Stundenplan konfigurieren",
            ownCourseText: "[eigene Veranstaltung]",
            noStudyText: "Ohne Studiengang",
            nAText: "N/A",
            errorCourseNameRequired: "Bitte gib einen Kursnamen ein.",
            errorAddCourseFailed: "Fehler beim Hinzufügen des Kurses. Bitte versuche es erneut.",
            errorSaveCoursesFailed: "Fehler beim Speichern der Kurse. Bitte versuche es erneut.",
            errorLoginRequired: "Bitte melde dich an, um fortzufahren.",
            errorLinkUrlRequired: "Bitte geben Sie eine URL für den Link ein.",
            removeLinkButtonText: "Link entfernen",
            unknownText: "Unbekannt",
            unknownCourseText: "Unbekannter Kurs",
            noCoursesOnDay: "Keine Kurse an diesem Tag.",
            iconExpand: "▶",
            iconCollapse: "▼",
            deletingError: "Der Kurs konnte nicht endgültig gelöscht werden."
        },
        user: ["ccm.instance", "https://ccmjs.github.io/akless-components/user/ccm.user.js"],
        helper: ["ccm.load", "https://ccmjs.github.io/akless-components/modules/versions/helper-8.4.2.min.mjs"],
        html: {
            userTemplate: `
                <div class="main">
                    <div id="user"></div>
                    <div id="content"></div>
                </div>
            `,
            mainTemplate: `
                <div id="main-template">
                    <div id="toggle-button">
                        <button id="toggle-view-button" onclick="%onToggleButton%">%timetableConfigureText%</button>
                    </div>
                    <div id="user"></div>
                    <div id="main-content">
                        <h1>%timeTableText%</h1>
                        <p>%plsLoggin%</p>
                    </div>
                </div>
            `,
            editView: {
                main: `
                    <h1>%timetableEditText%</h1>
                    <div id="schedule-container">
                        <div class="add-course-header">
                            <button id="course-dropdown-button" class="dropdown-button">%addCourseDropdownText%</button>
                            <button id="add-course-button" onclick="%onAddCourseButton%">%addOwnCourseText%</button>
                        </div>
                        <div id="course-form-container" style="display: none;">
                            <form id="course-form" onsubmit="%onCourseForm%">
                                <h2>%addCourseText%</h2>
                                <div class="form-group">
                                    <label for="course-title">%courseNameText%</label>
                                    <input type="text" id="course-title" name="course-title" placeholder="%coursePlaceholderText%" required>
                                </div>
                                <div id="events-container" ></div>
                                <button type="submit" id="submit-course-button">%addCourseText%</button>
                                <button type="button" id="cancel-button" onclick="%onCancelButton%">%cancelText%</button>
                            </form>
                        </div>
                        <div class="dropdown-container">
                            <div id="course-dropdown-content" class="dropdown-content">
                                <input type="text" id="course-search" placeholder="%courseSearchPlaceholderText%">
                                <select id="day-filter">
                                    <option value="">%allDaysText%</option>
                                    <option value="Montag">%mondayText%</option>
                                    <option value="Dienstag">%tuesdayText%</option>
                                    <option value="Mittwoch">%wednesdayText%</option>
                                    <option value="Donnerstag">%thursdayText%</option>
                                    <option value="Freitag">%fridayText%</option>
                                    <option value="Samstag">%saturdayText%</option>
                                    <option value="Sonntag">%sundayText%</option>
                                </select>
                                <div id="course-checkbox-list"></div>
                            </div>
                        </div>
                        <h2>%selectedScheduleText%</h2>
                        <div id="selected-schedule"></div>
                    </div>
                `,
                checkboxStudyName: `
                    <div class="study-group" data-study="%studyName%">
                        <div class="study-item">
                            <label>%studyName%</label>
                        </div>
                        <div class="semesters"></div>
                    </div>
                `,
                checkboxSemester: `
                    <div class="semester-group" data-semester="%semester%">
                        <div class="semester-item">
                            <input type="checkbox" class="semester-checkbox">
                            <label>%semesterLabel% %semester%</label>
                        </div>
                        <div class="courses"></div>
                    </div>
                `,
                checkboxCourseItem: `
                    <div class="course-group" data-course="%courseName%">
                        <div class="course-item">
                            <input type="checkbox" class="course-checkbox">
                            <label>%courseName%</label>
                        </div>
                        <div class="courses"></div>
                    </div>
                `,
                checkboxStudyEvent: `
                    <div class="event-item">
                        <input type="checkbox" class="event-checkbox" data-course-key="%courseKey%" data-event-key="%eventKey%" data-event-day="%day%" checked=%isChecked%>
                        <label>%eventInfo%</label>
                    </div>
                `,
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
                                <option value="Mi">%wednesdayText%</option>
                                <option value="Do">%thursdayText%</option>
                                <option value="Fr">%fridayText%</option>
                                <option value="Sa">%saturdayText%</option>
                                <option value="So">%sundayText%</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="event-from-%index%">%startTimeText%</label>
                            <input type="time" id="event-from-%index%" name="event-from-%index%" required>
                        </div>
                        <div class="form-group">
                            <label for="event-until-%index%">%endTimeText%</label>
                            <input type="time" id="event-until-%index%" name="event-until-%index%" required>
                        </div>
                        <div class="form-group">
                            <label for="event-room-%index%">%roomText%</label>
                            <input type="text" id="event-room-%index%" name="event-room-%index%" placeholder="%roomPlaceholderText%" required>
                        </div>
                        <div class="form-group">
                            <label for="event-period-from-%index%">%startDateText%</label>
                            <input type="date" id="event-period-from-%index%" name="event-period-from-%index%" placeholder="%startDatePlaceholderText%" required>
                        </div>
                        <div class="form-group">
                            <label for="event-period-until-%index%">%endDateText%</label>
                            <input type="date" id="event-period-until-%index%" name="event-period-until-%index%" placeholder="%endDatePlaceholderText%" required>
                        </div>
                        <div class="form-group">
                            <label for="event-who-%index%">%teacherText%</label>
                            <input type="text" id="event-who-%index%" name="event-who-%index%" placeholder="%teacherPlaceholderText%">
                        </div>
                        <div class="form-group">
                            <label for="event-group-%index%">%groupText%</label>
                            <input type="text" id="event-group-%index%" name="event-group-%index%" placeholder="%groupPlaceholderText%">
                        </div>
                    </div>
                `,
                courseItem: `
                    <div class="course-item" data-key="%key%" style="border-color: %borderColor%">
                        <div class="card-header" id="card-header-%eventKey%">
                            <div class="course-details">
                                <h3>%courseTitle%</h3>
                                <div class="event-info" data-event-key="%eventKey%">%eventTimeData%</div>
                                <div class="event-teacher-info">%eventTeacherInfo%</div>
                                <div class="event-period-info">%eventPeriodInfo%</div>

                            </div>
                            <div class="course-actions">
                                <div id="toggle-icon-%eventKey%" class="card-toggle-icon">%iconExpand%</div>
                                <div class="event-color-picker">
                                    <label for="event-color-%eventKey%">%eventColorText%</label>
                                    <input type="color" class="color-picker" id="event-color-%eventKey%" value="%colorValue%">
                                </div>
                                <button class="button button-danger remove-event-button">%removeButtonText%</button>
                            </div>
                        </div>
                        <div class="card-body" id="card-body-%eventKey%">
                            <div class="event-section" id="event-links-section-%eventKey%">
                                <label class="section-label">%linksLabelText%</label>
                                <form class="form-inline">
                                    <input type="text" class="new-link-title-inline" placeholder="%linkTitleText%">
                                    <input type="url" class="new-link-url-inline" placeholder="%linkUrlText%">
                                    <button type="button" class="button button-primary add-link-inline-button" data-event-key="%eventKey%" onclick="%onAddLink%">%addLinkInlineButtonText%</button>
                                </form>
                                <div class="current-event-links" id="current-event-links-%eventKey%"></div>
                            </div>
                            <div class="event-section" id="event-note-container-%eventKey%">
                                <label class="section-label" for="event-note-input-%eventKey%">%noteLabelText%</label>
                                <textarea class="event-note-input" id="event-note-input-%eventKey%" data-event-key="%eventKey%" placeholder="%noteText%" onchange="%onChangeNote%"></textarea>
                            </div>
                        </div>
                    </div>
                `,
                linkDisplayItem: `
                    <ul class="current-event-links">
                        <li class="event-link-display-item">
                            <a href="%linkUrl%" target="_blank" rel="noopener noreferrer">%linkTitle%</a>
                            <button type="button" class="remove-single-link-button small-button" data-link-key="%linkKey%" onclick="%onRemoveLinkButton%">%removeLinkButtonText%</button>
                        </li>
                    </ul>
                `,
                noLinksMessage: `
                    <p class="no-links-text">%noLinksText%</p>
                `
            },
            scheduleView: {
                main: `
                    <h1>%timeTableForText%</h1>
                    <div class="container">
                        <div class="section">
                            <div class="week-schedule"></div>
                        </div>
                        <div id="modal" class="modal">
                            <div class="modal-content">
                                <span class="close">×</span>
                                <h3 id="modal-title"></h3>
                                <h4>%linksLabelText%</h4>
                                <div id="modal-links">%noLinksText%</div>
                                <br>
                                <h4>%noteText%</h4>
                                <div id="modal-note">%noNotesText%</div>
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
                         <div class="event" data-course-id="%courseId%" data-event-id="%eventId%" style="--event-color: %color%; %outOfRangeStyle%">
                        <div class="event-header">
                            <strong>%title%</strong>
                            %noteIcon%
                        </div>
                        <span>%time%</span>
                        <span>%eventItemRoomText% %room%</span>
                        <span>%eventItemWhoText% %who%</span>
                        <span>%eventItemPeriodText% %period%</span>
                    </div>
                `,
                noteIcon: `
                    <span class="note-icon">📝
                        <span class="tooltip">%note%</span>
                    </span>
                `,
                linksSection: `
                    <div class="modal-link-item">
                        <a href="%url%" target="_blank" rel="noopener noreferrer">%linkName%</a>
                    </div>
                `,
                noEvents: `<p>%noCoursesOnDay%</p>`
            }
        },
        onchange: event => console.log(event)
    },
    Instance: function () {
        let self = this;
        let studentId;
        let allCourses = [];
        let currentCourses = [];
        let isEditMode = false;
        let $;

        // Liefert den Wochenbereich (Montag bis Sonntag) für die aktuelle Woche
        this.getWeekRange = () => {
            const now = new Date();
            const dayOfWeek = now.getDay();
            const diffToMonday = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
            const startOfWeek = new Date(now.setDate(diffToMonday));
            startOfWeek.setHours(0, 0, 0, 0);

            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6);
            endOfWeek.setHours(23, 59, 59, 999);

            return { start: startOfWeek, end: endOfWeek };
        };

        // Wandelt Kürzel oder Varianten eines Wochentags in den vollständigen deutschen Namen um
        this.normalizeDay = (day) => {
            const dayMap = {
                "mo": "Montag", "montag": "Montag",
                "di": "Dienstag", "dienstag": "Dienstag",
                "mi": "Mittwoch", "mittwoch": "Mittwoch",
                "do": "Donnerstag", "donnerstag": "Donnerstag",
                "fr": "Freitag", "freitag": "Freitag",
                "sa": "Samstag", "samstag": "Samstag",
                "so": "Sonntag", "sonntag": "Sonntag"
            };
            return dayMap[day.toLowerCase()] || self.text.unknownText;
        };

        // Konvertiert Uhrzeit (HH:MM) in Minuten für Sortierung und Vergleich
        this.timeToMinutes = (time) => {
            const [hours, minutes] = time.split(':').map(Number);
            return hours * 60 + minutes;
        };

        this.events = {
            onToggleButton: async () => {
                isEditMode = !isEditMode;
                await self.renderView();
            },
            onAddCourseButton: () => {
                const eventsContainer = self.element.querySelector('#events-container');
                const courseFormContainer = self.element.querySelector('#course-form-container');
                const addCourseButton = self.element.querySelector('#add-course-button');
                const courseForm = self.element.querySelector('#course-form');
                eventsContainer.innerHTML = '';
                const eventFormHtml = self.ccm.helper.html(self.html.editView.eventItem, {
                    index: 0,
                    typeText: self.text.typeText,
                    chooseTypeText: self.text.chooseTypeText,
                    lectureText: self.text.lectureText,
                    exerciseText: self.text.exerciseText,
                    seminarText: self.text.seminarText,
                    practicalText: self.text.practicalText,
                    sportCourseText: self.text.sportCourseText,
                    languageCourseText: self.text.languageCourseText,
                    tutorialText: self.text.tutorialText,
                    otherText: self.text.otherText,
                    dayText: self.text.dayText,
                    chooseDayText: self.text.chooseDayText,
                    mondayText: self.text.mondayText,
                    tuesdayText: self.text.tuesdayText,
                    wednesdayText: self.text.wednesdayText,
                    thursdayText: self.text.thursdayText,
                    fridayText: self.text.fridayText,
                    saturdayText: self.text.saturdayText,
                    sundayText: self.text.sundayText,
                    startTimeText: self.text.startTimeText,
                    endTimeText: self.text.endTimeText,
                    roomText: self.text.roomText,
                    roomPlaceholderText: self.text.roomPlaceholderText,
                    startDateText: self.text.startDateText,
                    startDatePlaceholderText: self.text.startDatePlaceholderText,
                    endDateText: self.text.endDateText,
                    endDatePlaceholderText: self.text.endDatePlaceholderText,
                    teacherText: self.text.teacherText,
                    teacherPlaceholderText: self.text.teacherPlaceholderText,
                    groupText: self.text.groupText,
                    groupPlaceholderText: self.text.groupPlaceholderText
                });
                $.append(eventsContainer, eventFormHtml);
                courseFormContainer.style.display = 'block';
                addCourseButton.style.display = 'none';
                courseForm.querySelector('#course-title').focus();
            },
            onCancelButton: () => {
                const courseFormContainer = self.element.querySelector('#course-form-container');
                const addCourseButton = self.element.querySelector('#add-course-button');
                const courseForm = self.element.querySelector('#course-form');
                courseFormContainer.style.display = 'none';
                addCourseButton.style.display = 'block';
                courseForm.querySelector('#course-title').value = '';
            },
            onCourseForm: async (event) => {
                event.preventDefault();
                try {
                    await self.addNewCourse(self.element.querySelector('#course-form'));
                    await self.renderEditView();
                } catch (e) {
                    console.error("Fehler beim Hinzufügen eines Kurses: ", e);
                    alert(e.message);
                }
            },
            onRemoveLinkButton: (eventKey, linkKey, currentLinksDiv) => {
                return async () => {
                    const course = currentCourses.find(c => c.value.events.some(e => e.key === eventKey));
                    const event = course?.value.events.find(e => e.key === eventKey);
                    if (event && event.links) {
                        event.links = event.links.filter(link => link.key !== linkKey);
                        self.refreshLinksDisplay(event, currentLinksDiv);
                        await self.saveSelectedCourses();
                    }
                };
            },
            onAddLink: async (domEvent) => {
                const button = domEvent.target;
                const eventKey = button.dataset.eventKey;

                const course = currentCourses.find(c => c.value.events.some(e => e.key === eventKey));
                const eventData = course?.value.events.find(e => e.key === eventKey);
                if (!eventData) return;

                const linksSection = button.closest(`#event-links-section-${eventKey}`);
                const titleInput = linksSection.querySelector('.new-link-title-inline');
                const urlInput = linksSection.querySelector('.new-link-url-inline');
                const linksDiv = linksSection.querySelector('.current-event-links');

                const title = titleInput.value.trim();
                let url = urlInput.value.trim();
                if (url) {
                    if (!url.match(/^https?:\/\//i)) {
                        url = 'https://' + url;
                    }
                    if (!eventData.links) eventData.links = [];
                    eventData.links.push({
                        key: self.ccm.helper.generateKey(),
                        title: title || url,
                        url: url
                    });
                    titleInput.value = '';
                    urlInput.value = '';
                    self.refreshLinksDisplay(eventData, linksDiv);
                    await self.saveSelectedCourses();
                } else {
                    alert(self.text.errorLinkUrlRequired);
                }
            },
            onChangeNote: async (domEvent) => {
                const noteInput = domEvent.target;
                const eventKey = noteInput.dataset.eventKey;
                const course = currentCourses.find(c => c.value.events.some(e => e.key === eventKey));
                const eventData = course?.value.events.find(e => e.key === eventKey);
                if (!eventData) return;

                eventData.note = noteInput.value.trim();
                await self.saveSelectedCourses();
            }
        };

        this.init = async () => {
            $ = Object.assign({}, this.ccm.helper, this.helper);
            $.use(this.ccm);
            if (this.user) this.user.onchange = this.start;
        };

        this.start = async () => {

            currentCourses = [];
            allCourses = [];
            $.setContent(this.element, $.html(this.html.userTemplate));

            if (this.user) {
                $.setContent(this.element.querySelector('#user'), this.user.root);
                this.user.start();
            }

            studentId = await this.user.getValue();
            if (!studentId) {
                alert(self.text.errorLoginRequired);
                return;
            }
            studentId = studentId.key;

            const mainHtml = self.ccm.helper.html(self.html.mainTemplate, {
                timetableConfigureText: self.text.timetableConfigureText,
                plsLoggin: self.text.plsLoggin,
                timeTableText: self.text.timeTableText,
                onToggleButton: self.events.onToggleButton
            });
            $.setContent(self.element.querySelector('#content'), mainHtml);

            let savedSchedule;
            try {
                savedSchedule = await self.studentStore.get(studentId);
                console.log("savedSchedule");
                console.log(savedSchedule);
                const teacherCourses = await self.courseStore.get();
                const ownStudentCourses = await self.studentCourseStore.get({ "value.who": studentId });

                console.log(savedSchedule);
                console.log(teacherCourses);
                console.log(ownStudentCourses);

                allCourses = [...teacherCourses, ...ownStudentCourses];
            } catch (e) {
                console.error("Fehler beim Laden der Kurse:", e);
                alert(self.text.errorSaveCoursesFailed);
                return;
            }

            if (savedSchedule?.value?.courses) {
                currentCourses = [];
                for (const savedCourse of savedSchedule.value.courses) {
                    const fullCourse = allCourses.find(c => c.key === savedCourse.key);
                    if (fullCourse && fullCourse.value && fullCourse.value.course) {
                        const courseEvents = fullCourse.value.events
                            .filter(event => savedCourse.events.some(se => se.key === event.key))
                            .map(event => ({
                                ...event,
                                color: savedCourse.events.find(se => se.key === event.key)?.color || "",
                                note: savedCourse.events.find(se => se.key === event.key)?.note || "",
                                links: savedCourse.events.find(se => se.key === event.key)?.links || []
                            }));
                        currentCourses.push({
                            key: fullCourse.key,
                            course: fullCourse.value.course,
                            value: {
                                course: fullCourse.value.course,
                                events: courseEvents,
                                course_of_study: fullCourse.value.course_of_study || []
                            }
                        });
                    }
                }
            } else {
                isEditMode = true;
            }

            await self.renderView();
        };

        this.getValue = () => {
            return currentCourses;
        };

        this.renderView = async () => {
            const toggleButton = self.element.querySelector('#toggle-view-button');
            toggleButton.textContent = isEditMode ? self.text.toTimeText : self.text.timetableConfigureText;

            if (isEditMode) {
                await self.renderEditView();
            } else {
                await self.renderScheduleView();
            }
        };

        this.renderEditView = async () => {
            const mainHtml = self.ccm.helper.html(self.html.editView.main, {
                timetableEditText: self.text.timetableEditText,
                addOwnCourseText: self.text.addOwnCourseText,
                addCourseText: self.text.addCourseText,
                courseNameText: self.text.courseNameText,
                coursePlaceholderText: self.text.coursePlaceholderText,
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
                startTimeText: self.text.startTimeText,
                endTimeText: self.text.endTimeText,
                roomText: self.text.roomText,
                onAddCourseButton: self.events.onAddCourseButton,
                onCancelButton: self.events.onCancelButton,
                onCourseForm: self.events.onCourseForm,
            });
            const container = self.element.querySelector('#main-content');
            $.setContent(container, mainHtml);

            await self.initSelectCoursesDropdown(container);

            currentCourses.forEach(course => {
                self.renderCourse(course);
            });
        };

        // Erstellt studentischen Kurs mit Eventdaten aus dem Formular und speichert ihn im Store
        this.addNewCourse = async (form) => {
            try {
                const courseName = form.querySelector('#course-title').value.trim();
                if (!courseName) {
                    throw new Error(self.text.errorCourseNameRequired);
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

                const courseData = {
                    course: courseName,
                    createdBy: "student",
                    who: studentId,
                    events: events,
                    course_of_study: []
                };

                const courseId = self.ccm.helper.generateKey();
                await self.studentCourseStore.set({ key: courseId, value: courseData });

                const newCourse = {
                    key: courseId,
                    value: courseData
                };

                const newCourseForDisplay = {
                    key: courseId,
                    course: courseName,
                    value: {
                        course: courseName,
                        events: events.map(event => ({
                            ...event,
                            color: "",
                            note: "",
                            links: []
                        })),
                        course_of_study: []
                    }
                };

                allCourses.push(newCourseForDisplay);
                currentCourses.push(newCourseForDisplay);

                await self.saveSelectedCourses();
                return newCourse;
            } catch (e) {
                console.error("Fehler beim Hinzufügen eines studentischen Kurses:", e);
                throw new Error(e.message || self.text.errorAddCourseFailed);
            }
        };

        // Lädt alle verfügbaren Kurse in einer strukturierten Ansicht (Studiengang → Semester → Kurs → Event)
        this.initSelectCoursesDropdown = async (container) => {
            const courseCheckboxList = container.querySelector('#course-checkbox-list');
            const studyGroups = {};
            allCourses.forEach(course => {
                if (course && course.value && course.value.course) {
                    const studies = course.value.course_of_study && course.value.course_of_study.length > 0
                        ? course.value.course_of_study
                        : [{courseOfStudy: self.text.noStudyText, semester: self.text.nAText}];

                    studies.forEach(study => {
                        const studyName = study.courseOfStudy || self.text.noStudyText;
                        const semester = study.semester || self.text.nAText;
                        if (!studyGroups[studyName]) studyGroups[studyName] = {};
                        if (!studyGroups[studyName][semester]) studyGroups[studyName][semester] = {};
                        if (!studyGroups[studyName][semester][course.value.course]) {
                            studyGroups[studyName][semester][course.value.course] = [];
                        }
                        studyGroups[studyName][semester][course.value.course].push(course);
                    });
                }
            });

            for (const studyName of Object.keys(studyGroups).sort()) {
                const studyHtml = $.html(self.html.editView.checkboxStudyName, {
                    studyName: studyName
                });
                $.append(courseCheckboxList, studyHtml);

                const semesters = studyGroups[studyName];
                const semesterList = Object.keys(semesters).sort((a, b) => {
                    if (a === self.text.nAText) return 1;
                    if (b === self.text.nAText) return -1;
                    return parseInt(a) - parseInt(b);
                });

                for (const semester of semesterList) {
                    const semesterHtml = $.html(self.html.editView.checkboxSemester, {
                        semesterLabel: self.text.semesterLabelText,
                        semester: semester
                    });
                    $.append(studyHtml.querySelector(".semesters"), semesterHtml);

                    const courses = semesters[semester];
                    for (const courseName of Object.keys(courses).sort()) {
                        const courseList = courses[courseName];
                        const courseHtml = $.html(self.html.editView.checkboxCourseItem, {
                            courseName: courseName
                        });
                        $.append(semesterHtml.querySelector('.courses'), courseHtml);

                        for (const courseItem of courseList) {
                            if (courseItem?.value?.events) {
                                for (const event of courseItem.value.events) {
                                    const isChecked = currentCourses.some(c => c.value.events.some(e => e.key === event.key));
                                    const eventInfo = `${event.type} (${event.day}, ${event.from} - ${event.until}, ${self.text.eventItemRoomText}${event.room}${event.who ? `, ${self.text.eventItemWhoText}${event.who}` : ''}${event.group ? `, ${self.text.groupText} ${event.group}` : ''}, ${event.period_from} - ${event.period_until})`;
                                    const eventItemHtml = self.ccm.helper.html(self.html.editView.checkboxStudyEvent, {
                                        courseKey: courseItem.key,
                                        eventKey: event.key,
                                        day: self.normalizeDay(event.day),
                                        eventDay: self.normalizeDay(event.day),
                                        isChecked: isChecked,
                                        eventInfo: eventInfo + (courseItem.value.createdBy === "student" ? ` ${self.text.ownCourseText}` : '')
                                    });
                                    $.append(courseHtml.querySelector('.courses'), eventItemHtml);
                                }
                            }
                        }
                    }
                }
            }
            courseCheckboxList.querySelectorAll('.event-checkbox').forEach(checkbox => {
                self.updateParentCheckboxes(checkbox);
            });

            await self.initCheckboxListeners(container, courseCheckboxList);
            self.initDropdownButtonAndSearch(container, courseCheckboxList);
        };

        this.updateParentCheckboxes = (eventCheckbox) => {
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

        // Speichert die aktuelle Kursauswahl des Nutzers dauerhaft im Store
        this.saveSelectedCourses = async () => {
            try {
                const scheduleData = {
                    key: studentId,
                    value: {
                        student_id: studentId,
                        courses: currentCourses
                            .filter(course => course && course.key)
                            .map(course => ({
                                key: course.key,
                                events: course.value.events
                                    .filter(event => event && event.key)
                                    .map(event => ({
                                        key: event.key,
                                        color: event.color || "",
                                        note: event.note || "",
                                        links: event.links || []
                                    }))
                            }))
                    }
                };
                await self.studentStore.set(scheduleData);
                this.onchange && this.onchange({ event: "saveCourse", instance: self });
            } catch (e) {
                console.error("Fehler beim Speichern der Kurse:", e);
                alert(self.text.errorSaveCoursesFailed);
            }
        };

        this.initCheckboxListeners = async (container, courseCheckboxList) => {
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
                        courseInCurrent.value.events.push({...eventFromAll});
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
                $.setContent(selectedScheduleContainer, '');
                currentCourses.forEach(course => {
                    if (course.value.events.length > 0) {
                        self.renderCourse(course);
                    }
                });
            };

            courseCheckboxList.addEventListener('change', async (e) => {
                const target = e.target;
                const isChecked = target.checked;

                if (target.type === 'checkbox') {
                    let affectedEvents = [];

                    if (target.classList.contains('event-checkbox')) {
                        affectedEvents.push(target);
                    }
                    else if (target.classList.contains('course-checkbox') || target.classList.contains('semester-checkbox')) {
                        const parentGroup = target.closest('.course-group') || target.closest('.semester-group');
                        affectedEvents = parentGroup.querySelectorAll('.event-checkbox');
                    }

                    for (const cb of affectedEvents) {
                        if (cb.checked !== isChecked) {
                            cb.checked = isChecked;
                        }
                        await handleCheckboxChange(cb);
                    }

                    redrawSelectedCourses();

                    if (affectedEvents.length > 0) {
                        affectedEvents.forEach((event) => {
                            self.updateParentCheckboxes(event)
                        });
                    }

                    await self.saveSelectedCourses();
                }
            });
        };

        this.refreshLinksDisplay = (event, currentLinksDiv) => {
            $.setContent(currentLinksDiv, '');
            if (event.links && event.links.length > 0) {
                event.links.forEach(link => {
                    const linkHtml = self.ccm.helper.html(self.html.editView.linkDisplayItem, {
                        linkKey: link.key,
                        linkTitle: link.title || link.url,
                        linkUrl: link.url.match(/^https?:\/\//i) ? link.url : `https://${link.url}`,
                        removeLinkButtonText: self.text.removeLinkButtonText,
                        onRemoveLinkButton: self.events.onRemoveLinkButton(event.key, link.key, currentLinksDiv)
                    });
                    $.append(currentLinksDiv, linkHtml);
                });
            } else {
                const noLinksHtml = self.ccm.helper.html(self.html.editView.noLinksMessage, {
                    noLinksText: self.text.noLinksText
                });
                $.setContent(currentLinksDiv, noLinksHtml);
            }
        };

        this.renderCourse = (course) => {
            const selectedScheduleContainer = self.element.querySelector('#selected-schedule');

            if (!course.value.events || !Array.isArray(course.value.events)) {
                console.warn(`Kurs ${course.value.course} hat keine gültigen Events.`, course);
                course.value.events = [];
            }

            course.value.events.forEach(event => {
                if (!event.links) event.links = [];
                if (!event.color) event.color = '#cccccc';

                const courseHtml = self.ccm.helper.html(self.html.editView.courseItem, {
                    key: course.key,
                    courseTitle: (course.value.course ? `${course.value.course} (${event.type})` : self.text.unknownCourseText),
                    eventKey: event.key,
                    eventTeacherInfo: event.who ? `${self.text.eventItemWhoText}${event.who}` : '',
                    eventPeriodInfo: (event.period_from && event.period_until) ? `${self.text.eventItemPeriodText}${event.period_from} - ${event.period_until}` : '',
                    eventTimeData: `${event.day}, ${event.from} - ${event.until}, ${self.text.eventItemRoomText}${event.room}`,
                    borderColor: event.color,
                    colorValue: event.color,
                    eventColorText: self.text.eventColorText,
                    removeButtonText: self.text.removeButtonText,
                    linksLabelText: self.text.linksLabelText,
                    linkTitleText: self.text.linkTitleText,
                    linkUrlText: self.text.linkUrlText,
                    addLinkInlineButtonText: self.text.addLinkInlineButtonText,
                    noteLabelText: self.text.noteLabelText,
                    noteText: self.text.noteLabelText,
                    onAddLink: self.events.onAddLink,
                    onChangeNote: self.events.onChangeNote
                });

                $.append(selectedScheduleContainer, courseHtml);

                const cardHeader = courseHtml.querySelector(`#card-header-${event.key}`);
                const cardBody = courseHtml.querySelector(`#card-body-${event.key}`);
                const toggleIcon = courseHtml.querySelector(`#toggle-icon-${event.key}`);

                cardBody.classList.add('collapsed');
                toggleIcon.textContent = self.text.iconExpand;

                cardHeader.addEventListener('click', (e) => {
                    if (e.target.closest('button, input')) {
                        return;
                    }

                    const isCollapsed = cardBody.classList.toggle('collapsed');
                    toggleIcon.textContent = isCollapsed ? self.text.iconExpand : self.text.iconCollapse;
                });

                const colorPicker = courseHtml.querySelector(`#event-color-${event.key}`);
                colorPicker.addEventListener('input', async (e) => {
                    const newColor = e.target.value;
                    event.color = newColor;
                    if (courseHtml) {
                        courseHtml.style.borderLeftColor = newColor;
                        courseHtml.style.borderTopColor = newColor;
                        courseHtml.style.borderRightColor = newColor;
                        courseHtml.style.borderBottomColor = newColor;
                    }
                    await self.saveSelectedCourses();
                });
                const noteInput = courseHtml.querySelector(`#event-note-input-${event.key}`);
                noteInput.value = event.note || '';

                const eventLinksSection = courseHtml.querySelector(`#event-links-section-${event.key}`);
                const currentLinksDiv = eventLinksSection.querySelector(`.current-event-links`);
                const newLinkTitleInput = eventLinksSection.querySelector('.new-link-title-inline');
                const newLinkUrlInput = eventLinksSection.querySelector('.new-link-url-inline');

                self.refreshLinksDisplay(event, currentLinksDiv);

                courseHtml.querySelector('.remove-event-button').addEventListener('click', async () => {
                    const courseInCurrent = currentCourses.find(c => c.key === course.key);
                    if (courseInCurrent) {
                        courseInCurrent.value.events = courseInCurrent.value.events.filter(e => e.key !== event.key);

                        if (courseInCurrent.value.events.length === 0) {
                            currentCourses = currentCourses.filter(c => c.key !== course.key);

                            const originalCourse = allCourses.find(c => c.key === course.key);
                            if (originalCourse && originalCourse.value.createdBy === 'student') {
                                try {
                                    await self.studentCourseStore.del(course.key);

                                    allCourses = allCourses.filter(c => c.key !== course.key);

                                    const courseGroupToRemove = self.element.querySelector(`.course-group[data-course="${originalCourse.value.course}"]`);
                                    if (courseGroupToRemove) courseGroupToRemove.remove();

                                } catch (e) {
                                    console.error("Fehler beim endgültigen Löschen des Kurses:", e);
                                    alert(self.text.deletingError);
                                }
                            }
                        }

                        courseHtml.remove();

                        const courseCheckboxList = self.element.querySelector('#course-checkbox-list');
                        const checkbox = courseCheckboxList.querySelector(`.event-checkbox[data-event-key="${event.key}"]`);
                        if (checkbox) {
                            checkbox.checked = false;
                            if (typeof self.updateParentCheckboxes === 'function') {
                                self.updateParentCheckboxes(checkbox);
                            }
                        }

                        await self.saveSelectedCourses();
                    }
                });
            });
        };

        // Zeigt oder versteckt Dropdown-Listen für Kursauswahl und implementiert Text- & Tages-Filterung
        this.initDropdownButtonAndSearch = (container, courseCheckboxList) => {
            const dropdownButton = container.querySelector('#course-dropdown-button');
            const dropdownContent = container.querySelector('#course-dropdown-content');
            const searchInput = container.querySelector('#course-search');
            const dayFilter = container.querySelector('#day-filter');

            dropdownButton.onclick = (event) => {
                event.stopPropagation();
                const isOpen = dropdownContent.style.display === 'block';
                dropdownContent.style.display = isOpen ? 'none' : 'block';
                dropdownButton.textContent = isOpen ? self.text.addCourseDropdownText : self.text.addCourseDropdownUpText;
                if (!isOpen) searchInput.focus();
            };

            // Wendet Filterkriterien (Suchtext, Wochentag) auf die Dropdown-Kursliste an
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

        // Lädt den Stundenplan (Wochenansicht) und bindet Modal-Eventhandler
        this.renderScheduleView = async () => {
            const scheduleViewElement = await self.renderSchedule();

            scheduleViewElement.addEventListener('click', async (e) => {
                const clickedEvent = e.target.closest('.event');
                if (clickedEvent) {
                    const courseId = clickedEvent.getAttribute('data-course-id');
                    this.onchange && this.onchange({
                        event: "schedule",
                        instance: this,
                        studentId: studentId,
                        courseId: courseId
                    });
                    const eventId = clickedEvent.getAttribute('data-event-id');
                    await self.openModal(courseId, eventId);
                    return;
                }

                const clickedClose = e.target.closest('.close');
                if (clickedClose) {
                    self.closeModal();
                    return;
                }
            });

            const container = self.element.querySelector('#main-content');
            $.setContent(container, scheduleViewElement);
        };


        // Erzeugt HTML für die Stundenplanansicht (Tagesspalten und Events)
        this.renderSchedule = async () => {
            const schedule = {};
            const mainContainer = $.html(self.html.scheduleView.main, {
                timeTableForText: self.text.timeTableForText + studentId,
                linksLabelText: self.text.linksLabelText,
                noLinksText: self.text.noLinksText,
                noNotesText: self.text.noNotesText,
                noteText: self.text.noteText
            });
            const scheduleContainer = mainContainer.querySelector('.week-schedule');

            if (currentCourses.length > 0) {
                currentCourses.forEach(course => {
                    if (course && course.value && course.value.events) {
                        course.value.events.forEach(event => {
                            const normalizedDay = self.normalizeDay(event.day || self.text.unknownText);
                            if (!schedule[normalizedDay]) schedule[normalizedDay] = [];
                            schedule[normalizedDay].push({
                                title: `${course.value.course} (${event.type})${event.group ? ` [${event.group}]` : ''}`,
                                time: `${event.from} - ${event.until}`,
                                room: event.room,
                                who: event.who || self.text.unknownText,
                                period: `${event.period_from} - ${event.period_until}`,
                                period_from: event.period_from,
                                period_until: event.period_until,
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
                schedule[day].sort((a, b) => self.timeToMinutes(a.time.split(' - ')[0]) - self.timeToMinutes(b.time.split(' - ')[0]));
            });

            const weekRange = self.getWeekRange();

            const dayOrder = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"];
            const alwaysShowDays = dayOrder.slice(0, 5);
            const optionalDays = dayOrder.slice(5).filter(day => schedule[day] && schedule[day].length > 0);
            const daysToDisplay = [...alwaysShowDays, ...optionalDays];

            daysToDisplay.forEach(day => {
                const dayColumn = $.html(self.html.scheduleView.dayColumn, {day: day});
                const eventsContainer = dayColumn.querySelector('.events-container');

                if (schedule[day] && schedule[day].length > 0) {
                    const eventItems = schedule[day].map(event => {

                        const [dayFrom, monthFrom, yearFrom] = event.period_from.split('.').map(Number);
                        const [dayUntil, monthUntil, yearUntil] = event.period_until.split('.').map(Number);
                        const eventStart = new Date(yearFrom, monthFrom - 1, dayFrom);
                        const eventEnd = new Date(yearUntil, monthUntil - 1, dayUntil);
                        // Überprüft, ob ein Event-Termin außerhalb des aktuellen Wochenbereichs liegt
                        const isOutOfRange = eventEnd < weekRange.start || eventStart > weekRange.end;
                        const outOfRangeStyle = isOutOfRange ? 'opacity: 0.2;' : '';

                        const noteIconHtml = event.note.trim() !== ""
                            ? $.html(self.html.scheduleView.noteIcon, {note: event.note}).outerHTML
                            : '';

                        return $.html(self.html.scheduleView.eventItem, {
                            courseId: event.courseId,
                            eventId: event.eventId,
                            color: event.color,
                            title: event.title,
                            noteIcon: noteIconHtml,
                            period: event.period,
                            time: event.time,
                            room: event.room,
                            who: event.who,
                            eventItemRoomText: self.text.eventItemRoomText,
                            eventItemWhoText: self.text.eventItemWhoText,
                            eventItemPeriodText: self.text.eventItemPeriodText,
                            outOfRangeStyle: outOfRangeStyle
                        });
                    });

                    $.setContent(eventsContainer, eventItems);
                } else {
                    $.setContent(eventsContainer, $.html(self.html.scheduleView.noEvents, { noCoursesOnDay: self.text.noCoursesOnDay }));
                }

                scheduleContainer.appendChild(dayColumn);
            });

            return mainContainer;
        };

        this.openModal = async (courseId, eventId) => {
            try {
                const course = currentCourses.find(c => c.key === courseId);
                const event = course.value.events.find(e => e.key === eventId);
                if (!event) {
                    console.error("FEHLER: Event konnte nicht im Kurs gefunden werden.");
                    return;
                }
                const modal = self.element.querySelector('#modal');
                if (!modal) {
                    console.error("FEHLER: Das Modal-Element wurde nicht im DOM gefunden.");
                    return;
                }
                const modalTitle = modal.querySelector("#modal-title");
                const modalLinks = modal.querySelector("#modal-links");
                const modalNote = modal.querySelector("#modal-note");

                modalTitle.innerText = `${course.value.course} (${event.type})${event.group ? ` [${event.group}]` : ''}`;
                $.setContent(modalLinks, '');
                if (event.links && event.links.length > 0) {
                    event.links.forEach(link => {
                        const linkElement = $.html(self.html.scheduleView.linksSection, {
                            linkName: link.title || link.url,
                            url: link.url.match(/^https?:\/\//i) ? link.url : `https://${link.url}`
                        });
                        $.append(modalLinks, linkElement);
                    });
                } else {
                    modalLinks.innerText = self.text.noLinksText;
                }
                modalNote.innerText = event.note && event.note.trim() !== "" ? event.note : self.text.noNotesText;

                modal.classList.add('is-open');
            } catch (error) {
                console.error('FEHLER in openModal:', error);
            }
        };

        this.closeModal = () => {
            const modal = self.element.querySelector('#modal');
            if (modal) {
                modal.classList.remove('is-open');
            } else {
                console.error("FEHLER: Das Modal-Element wurde nicht im DOM gefunden.");
            }
        };
    }
};
