ccm.files["ccm.checklist.js"] = {
    name: "checklist",
    ccm: "../../libs/ccm/ccm.js",
    config: {
        store: ["ccm.store", { url: "https://ccm2.inf.h-brs.de", name: "tniede2s_mycollection" }],
        css: ["ccm.load", "./style.css"],
        helper: ["ccm.load", "../../libs/ccm/helper/helper-8.4.2.mjs"],
        html: {
            main: `
                <div class="checklist-container">
                    <h1>Wirtschaftspsychologie 2021 - Checkliste</h1>
                    <div class="semester-list"></div>
                </div>
            `,
            semester: `
                <div class="semester-item" data-id="%id%">
                    <div class="semester-header">
                        <input type="checkbox" id="semester-%id%" class="semester-checkbox">
                        <label for="semester-%id%">%title%</label>
                    </div>
                    <div class="course-list"></div>
                </div>
            `,
            course: `
                <div class="course-item">
                    <input type="checkbox" id="%id%" name="%name%" class="course-checkbox">
                    <label for="%id%">%label% (CP: %cp%, SWS: %sws%)</label>
                </div>
            `
        }
    },

    Instance: function () {
        let self = this;
        let semesterData = {}; // Speichert die Semester und ihre Kurse
        let checklistState = {}; // Speichert den Abhakstatus

        this.start = async () => {
            // Haupt-HTML rendern
            this.element.innerHTML = '';
            this.element.appendChild(this.ccm.helper.html(this.html.main));

            const semesterList = this.element.querySelector('.semester-list');

            // Daten aus dem Store laden
            const data = await self.store.get("Wirtschaftspsychologie2021");
            semesterData = data && data.value ? data.value : {};

            if (Object.keys(semesterData).length === 0) {
                semesterList.innerHTML = '<p>Keine Daten für Wirtschaftspsychologie 2021 gefunden.</p>';
                return;
            }

            // Checklist-Status aus dem Store laden oder initialisieren
            const stateData = await self.store.get("checklist_state");
            checklistState = stateData && stateData.value ? stateData.value : {
                semesters: {},
                courses: {}
            };

            // Initialisiere den Status, falls noch nicht vorhanden
            Object.keys(semesterData).forEach(semesterKey => {
                if (!checklistState.semesters[semesterKey]) {
                    checklistState.semesters[semesterKey] = false;
                }
                if (!checklistState.courses[semesterKey]) {
                    checklistState.courses[semesterKey] = {};
                }
                semesterData[semesterKey].forEach((course, index) => {
                    const courseId = `${semesterKey}_course_${index}`;
                    if (checklistState.courses[semesterKey][courseId] === undefined) {
                        checklistState.courses[semesterKey][courseId] = false;
                    }
                });
            });

            // Semester rendern
            Object.keys(semesterData).forEach(semesterKey => {
                const semesterTitle = semesterKey.replace('semester_', '').replace('_', '. ') + ' Semester';
                this.renderSemester(semesterTitle, semesterKey, semesterData[semesterKey], semesterList);
            });

            // Checklist-Status speichern
            await self.store.set({
                key: 'checklist_state',
                value: checklistState
            });
        };

        // Semester rendern
        this.renderSemester = (title, semesterId, courses, semesterList) => {
            const semesterHtml = this.ccm.helper.html(this.html.semester, {
                id: semesterId,
                title: title
            });

            const semesterCheckbox = semesterHtml.querySelector('.semester-checkbox');
            const courseList = semesterHtml.querySelector('.course-list');

            // Setze den initialen Status der Semester-Checkbox
            semesterCheckbox.checked = checklistState.semesters[semesterId];

            // Event-Listener für die Semester-Checkbox
            semesterCheckbox.addEventListener('change', async () => {
                checklistState.semesters[semesterId] = semesterCheckbox.checked;

                // Wenn das Semester abgehakt wird, alle Kurse abhaken
                if (semesterCheckbox.checked) {
                    Object.keys(checklistState.courses[semesterId]).forEach(courseId => {
                        checklistState.courses[semesterId][courseId] = true;
                    });
                } else {
                    Object.keys(checklistState.courses[semesterId]).forEach(courseId => {
                        checklistState.courses[semesterId][courseId] = false;
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
                    this.renderCourse(course, `${semesterId}_course_${index}`, semesterId, courseList);
                });
            });

            // Kurse rendern
            courses.forEach((course, index) => {
                this.renderCourse(course, `${semesterId}_course_${index}`, semesterId, courseList);
            });

            semesterList.appendChild(semesterHtml);
        };

        // Kurs rendern
        this.renderCourse = (course, courseId, semesterId, courseList) => {
            const label = course.category ? `${course.name} (${course.category})` : course.name;
            const courseHtml = this.ccm.helper.html(this.html.course, {
                id: courseId,
                name: `course_${courseId}`,
                label: label,
                cp: course.cp,
                sws: course.sws
            });

            const checkbox = courseHtml.querySelector('.course-checkbox');
            checkbox.checked = checklistState.courses[semesterId][courseId];

            // Event-Listener für die Kurs-Checkbox
            checkbox.addEventListener('change', async () => {
                checklistState.courses[semesterId][courseId] = checkbox.checked;

                // Prüfe, ob alle Kurse abgehakt sind, um das Semester abzuhaken
                const allCoursesChecked = Object.values(checklistState.courses[semesterId]).every(checked => checked);
                checklistState.semesters[semesterId] = allCoursesChecked;

                // Store aktualisieren
                await self.store.set({
                    key: 'checklist_state',
                    value: checklistState
                });

                // Semester-Checkbox aktualisieren
                const semesterCheckbox = courseList.parentElement.querySelector('.semester-checkbox');
                semesterCheckbox.checked = allCoursesChecked;
            });

            courseList.appendChild(courseHtml);
        };
    }
};
