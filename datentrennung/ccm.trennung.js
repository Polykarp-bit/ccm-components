ccm.files["ccm.trennung.js"] = {
    name: "trennung",
    ccm: "../../libs/ccm/ccm.js",
    config: {
        sourceStore: ["ccm.store", { url: "https://ccm2.inf.h-brs.de", name: "tniede2s_mycollection" }],
        teacherStore: ["ccm.store", { url: "https://ccm2.inf.h-brs.de", name: "tniede2s_teacher_courses" }],
        studentStore: ["ccm.store", { url: "https://ccm2.inf.h-brs.de", name: "tniede2s_student_schedules" }],
        html: {
            main: `
        <div id="migrator">
          <h1>Datenmigration</h1>
          <p id="status">Migration wird durchgeführt...</p>
          <div id="log"></div>
        </div>
      `
        }
    },

    Instance: function () {
        let self = this;

        this.start = async () => {
            // Haupt-HTML rendern
            this.element.innerHTML = '';
            this.element.appendChild(this.ccm.helper.html(this.html.main));

            const statusElement = this.element.querySelector('#status');
            const logElement = this.element.querySelector('#log');

            try {
                // Migration durchführen
                await this.migrateData();
                statusElement.textContent = "Migration abgeschlossen!";
            } catch (error) {
                statusElement.textContent = "Fehler bei der Migration!";
                logElement.innerHTML += `<p style="color: red;">Fehler: ${error.message}</p>`;
            }
        };

        this.migrateData = async () => {
            const logElement = this.element.querySelector('#log');

            // 1. Daten aus der Quell-Sammlung laden
            const allData = await self.sourceStore.get({});
            if (!Array.isArray(allData)) {
                throw new Error("Keine gültigen Daten in tniede2s_mycollection gefunden.");
            }

            logElement.innerHTML += `<p>Geladene Einträge: ${allData.length}</p>`;

            // 2. Arrays für die neuen Sammlungen
            const teacherCourses = [];
            const studentSchedules = [];
            const ignoredEntries = [];

            // 3. Funktionen zur Identifikation
            const isCourseEntry = (entry) => {
                const value = entry.value || {};
                return value.course || value.day || value.from || value.until || value.room || value.activity || value.who;
            };

            const isScheduleEntry = (entry) => {
                const value = entry.value || {};
                return value.student_id || (Array.isArray(value.courses) && value.courses.length > 0);
            };

            // 4. Daten aufteilen
            allData.forEach(entry => {
                if (isCourseEntry(entry)) {
                    teacherCourses.push(entry);
                } else if (isScheduleEntry(entry)) {
                    studentSchedules.push(entry);
                } else {
                    ignoredEntries.push(entry);
                }
            });

            logElement.innerHTML += `<p>Kursdaten: ${teacherCourses.length}</p>`;
            logElement.innerHTML += `<p>Stundenplandaten: ${studentSchedules.length}</p>`;
            logElement.innerHTML += `<p>Ignorierte Einträge: ${ignoredEntries.length}</p>`;

            // 5. Daten in die neuen Sammlungen schreiben
            for (const entry of teacherCourses) {
                await self.teacherStore.set(entry);
            }
            logElement.innerHTML += `<p>Kursdaten in tniede2s_teacher_courses geschrieben.</p>`;

            for (const entry of studentSchedules) {
                await self.studentStore.set(entry);
            }
            logElement.innerHTML += `<p>Stundenplandaten in tniede2s_student_schedules geschrieben.</p>`;

            // 6. Optional: Ignorierte Einträge loggen
            if (ignoredEntries.length > 0) {
                logElement.innerHTML += `<p>Ignorierte Einträge: ${JSON.stringify(ignoredEntries.map(e => e.key))}</p>`;
            }
        };
    }
};
