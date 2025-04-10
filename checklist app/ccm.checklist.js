ccm.files["ccm.checklist.js"] = {
    name: "checklist",
    ccm: "../../libs/ccm/ccm.js",
    config: {
        store: ["ccm.store", { url: "https://ccm2.inf.h-brs.de", name: "tniede2s_mycollection" }],
        css: ["ccm.load", "./style.css"],
        helper: ["ccm.load", "../../libs/ccm/helper/helper-8.4.2.mjs"],
        html: {
            main: `
                <div class="checklists-container">
                    <h1>Meine Checklisten</h1>
                    <div class="checklist-list"></div>
                </div>
            `,
            checklist: `
                <div class="checklist-item" data-id="%id%">
                    <div class="checklist-header">
                        <h2>%title%</h2>
                        <button class="toggle-checklist">▼</button>
                    </div>
                    <div class="checklist-content">
                        <div class="progress-bar">
                            <div class="progress-fill"></div>
                        </div>
                        <div class="semester-list"></div>
                    </div>
                </div>
            `,
            semester: `
                <div class="semester-item" data-id="%id%">
                    <div class="semester-header">
                        <input type="checkbox" id="semester-%id%" class="semester-checkbox">
                        <label for="semester-%id%" class="semester-title">%title%</label>
                        <span class="semester-progress">0%</span>
                    </div>
                    <div class="course-list"></div>
                </div>
            `,
            course: `
                <div class="course-item">
                    <input type="checkbox" id="%id%" name="%name%" class="course-checkbox">
                    <label for="%id%" class="course-label">%label% <span class="course-details">(CP: %cp%, SWS: %sws%)</span></label>
                </div>
            `
        }
    },

    Instance: function () {
        let self = this;
        let checklistsData = {}; // Speichert die Daten aller Checklisten
        let checklistState = {}; // Speichert den Abhakstatus aller Checklisten

        this.start = async () => {
            // Haupt-HTML rendern
            this.element.innerHTML = '';
            this.element.appendChild(this.ccm.helper.html(this.html.main));

            const checklistList = this.element.querySelector('.checklist-list');

            // Beispiel-Daten für mehrere Checklisten (könnten aus dem Store geladen werden)
            const checklistKeys = ["Wirtschaftspsychologie2021", "Informatik2022"]; // Beispiel für mehrere Checklisten
            checklistsData = {};

            // Daten für jede Checkliste laden
            for (const key of checklistKeys) {
                const data = await self.store.get(key);
                checklistsData[key] = data && data.value ? data.value : {};
            }

            // Checklist-Status aus dem Store laden oder initialisieren
            const stateData = await self.store.get("checklist_state");
            checklistState = stateData && stateData.value ? stateData.value : {};

            // Initialisiere den Status für jede Checkliste
            Object.keys(checklistsData).forEach(checklistKey => {
                if (!checklistState[checklistKey]) {
                    checklistState[checklistKey] = {
                        semesters: {},
                        courses: {},
                        collapsed: false // Zustand für Einklappen/Ausklappen
                    };
                }

                const semesterData = checklistsData[checklistKey];
                Object.keys(semesterData).forEach(semesterKey => {
                    if (!checklistState[checklistKey].semesters[semesterKey]) {
                        checklistState[checklistKey].semesters[semesterKey] = false;
                    }
                    if (!checklistState[checklistKey].courses[semesterKey]) {
                        checklistState[checklistKey].courses[semesterKey] = {};
                    }
                    semesterData[semesterKey].forEach((course, index) => {
                        const courseId = `${semesterKey}_course_${index}`;
                        if (checklistState[checklistKey].courses[semesterKey][courseId] === undefined) {
                            checklistState[checklistKey].courses[semesterKey][courseId] = false;
                        }
                    });
                });
            });

            // Checklisten rendern
            Object.keys(checklistsData).forEach(checklistKey => {
                if (Object.keys(checklistsData[checklistKey]).length > 0) {
                    const checklistTitle = checklistKey.replace(/([A-Z])/g, ' $1').trim(); // Z. B. "Wirtschaftspsychologie2021" -> "Wirtschaftspsychologie 2021"
                    this.renderChecklist(checklistTitle, checklistKey, checklistsData[checklistKey], checklistList);
                }
            });

            // Checklist-Status speichern
            await self.store.set({
                key: 'checklist_state',
                value: checklistState
            });
        };

        // Gesamtfortschritt für eine Checkliste berechnen und anzeigen
        this.updateProgress = (checklistKey, checklistContent) => {
            let totalCourses = 0;
            let checkedCourses = 0;

            const semesterData = checklistsData[checklistKey];
            Object.keys(semesterData).forEach(semesterKey => {
                totalCourses += semesterData[semesterKey].length;
                checkedCourses += Object.values(checklistState[checklistKey].courses[semesterKey]).filter(checked => checked).length;
            });

            const progress = totalCourses > 0 ? (checkedCourses / totalCourses) * 100 : 0;
            const progressFill = checklistContent.querySelector('.progress-fill');
            progressFill.style.width = `${progress}%`;
        };

        // Fortschritt pro Semester berechnen und anzeigen
        this.updateSemesterProgress = (checklistKey, semesterId, courseList) => {
            const courses = Object.values(checklistState[checklistKey].courses[semesterId]);
            const total = courses.length;
            const checked = courses.filter(checked => checked).length;
            const progress = total > 0 ? (checked / total) * 100 : 0;

            const semesterProgress = courseList.parentElement.querySelector('.semester-progress');
            semesterProgress.textContent = `${Math.round(progress)}%`;
        };

        // Checkliste rendern
        this.renderChecklist = (title, checklistKey, semesterData, checklistList) => {
            const checklistHtml = this.ccm.helper.html(this.html.checklist, {
                id: checklistKey,
                title: title
            });

            const checklistContent = checklistHtml.querySelector('.checklist-content');
            const semesterList = checklistHtml.querySelector('.semester-list');
            const toggleButton = checklistHtml.querySelector('.toggle-checklist');

            // Einklappstatus setzen
            if (checklistState[checklistKey].collapsed) {
                checklistContent.style.display = 'none';
                toggleButton.textContent = '▶';
            }

            // Event-Listener für Einklappen/Ausklappen
            toggleButton.addEventListener('click', async () => {
                checklistState[checklistKey].collapsed = !checklistState[checklistKey].collapsed;
                checklistContent.style.display = checklistState[checklistKey].collapsed ? 'none' : 'block';
                toggleButton.textContent = checklistState[checklistKey].collapsed ? '▶' : '▼';

                // Store aktualisieren
                await self.store.set({
                    key: 'checklist_state',
                    value: checklistState
                });
            });

            // Semester rendern
            Object.keys(semesterData).forEach(semesterKey => {
                const semesterTitle = semesterKey.replace('semester_', '').replace('_', '. ') + ' Semester';
                this.renderSemester(checklistKey, semesterTitle, semesterKey, semesterData[semesterKey], semesterList, checklistContent);
            });

            // Initialen Fortschritt für die Checkliste berechnen
            this.updateProgress(checklistKey, checklistContent);

            checklistList.appendChild(checklistHtml);
        };

        // Semester rendern
        this.renderSemester = (checklistKey, title, semesterId, courses, semesterList, checklistContent) => {
            const semesterHtml = this.ccm.helper.html(this.html.semester, {
                id: semesterId,
                title: title
            });

            const semesterCheckbox = semesterHtml.querySelector('.semester-checkbox');
            const courseList = semesterHtml.querySelector('.course-list');

            // Setze den initialen Status der Semester-Checkbox
            semesterCheckbox.checked = checklistState[checklistKey].semesters[semesterId];

            // Event-Listener für die Semester-Checkbox
            semesterCheckbox.addEventListener('change', async () => {
                checklistState[checklistKey].semesters[semesterId] = semesterCheckbox.checked;

                // Wenn das Semester abgehakt wird, alle Kurse abhaken
                if (semesterCheckbox.checked) {
                    Object.keys(checklistState[checklistKey].courses[semesterId]).forEach(courseId => {
                        checklistState[checklistKey].courses[semesterId][courseId] = true;
                    });
                } else {
                    Object.keys(checklistState[checklistKey].courses[semesterId]).forEach(courseId => {
                        checklistState[checklistKey].courses[semesterId][courseId] = false;
                    });
                }

                // Store aktualisieren
                await self.store.set({
                    key: 'checklist_state',
                    value: checklistState
                });

                // UI aktualisieren
                courseList.innerHTML = '';
                courses.forEach((course, index) => {
                    this.renderCourse(checklistKey, course, `${semesterId}_course_${index}`, semesterId, courseList, checklistContent);
                });

                // Fortschritt aktualisieren
                this.updateSemesterProgress(checklistKey, semesterId, courseList);
                this.updateProgress(checklistKey, checklistContent);
            });

            // Kurse rendern
            courses.forEach((course, index) => {
                this.renderCourse(checklistKey, course, `${semesterId}_course_${index}`, semesterId, courseList, checklistContent);
            });

            // Initialen Fortschritt für das Semester berechnen
            this.updateSemesterProgress(checklistKey, semesterId, courseList);

            semesterList.appendChild(semesterHtml);
        };

        // Kurs rendern
        this.renderCourse = (checklistKey, course, courseId, semesterId, courseList, checklistContent) => {
            const label = course.category ? `${course.name} (${course.category})` : course.name;
            const courseHtml = this.ccm.helper.html(this.html.course, {
                id: courseId,
                name: `course_${courseId}`,
                label: label,
                cp: course.cp,
                sws: course.sws
            });

            const checkbox = courseHtml.querySelector('.course-checkbox');
            checkbox.checked = checklistState[checklistKey].courses[semesterId][courseId];

            // Event-Listener für die Kurs-Checkbox
            checkbox.addEventListener('change', async () => {
                checklistState[checklistKey].courses[semesterId][courseId] = checkbox.checked;

                // Prüfe, ob alle Kurse abgehakt sind, um das Semester abzuhaken
                const allCoursesChecked = Object.values(checklistState[checklistKey].courses[semesterId]).every(checked => checked);
                checklistState[checklistKey].semesters[semesterId] = allCoursesChecked;

                // Store aktualisieren
                await self.store.set({
                    key: 'checklist_state',
                    value: checklistState
                });

                // Semester-Checkbox aktualisieren
                const semesterCheckbox = courseList.parentElement.querySelector('.semester-checkbox');
                semesterCheckbox.checked = allCoursesChecked;

                // Fortschritt aktualisieren
                this.updateSemesterProgress(checklistKey, semesterId, courseList);
                this.updateProgress(checklistKey, checklistContent);
            });

            courseList.appendChild(courseHtml);
        };
    }
};
