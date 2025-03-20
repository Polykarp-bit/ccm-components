ccm.files["ccm.week_schedule.js"] = {
    name: "week_schedule",
    ccm: "../../libs/ccm/ccm.js",
    config: {
        store: ["ccm.store", { url: "https://ccm2.inf.h-brs.de", name: "tniede2s_mycollection" }],
        css: ["ccm.load", "./style.css"],
        helper: ["ccm.load", "../../libs/ccm/helper/helper-8.4.2.mjs"],
        schedule: {}, // Stundenplan-Daten (wird dynamisch gefüllt)
        links: [],    // Links und Ressourcen
        study_plans: [
            // Studienverlaufspläne können hier bleiben, falls benötigt
        ],
    },
    Instance: function () {
        let self = this;

        this.start = async () => {
            // Benutzer einloggen und Kürzel abrufen

            const studentId = "tmiede2s"; // Fallback auf "tmiede2s"

            // Gespeicherte Nutzerkonfiguration abrufen
            const userConfig = await self.store.get(studentId);
            console.log("Geladene Nutzerkonfiguration:", userConfig);

            // Standardfarben für Veranstaltungstypen (als Fallback)
            const defaultColors = {
                "Vorlesung": "#FFCC99",  // Hellorange für Vorlesungen
                "Übung": "#99CCFF",      // Hellblau für Übungen
                "Seminar": "#CCFFCC",    // Hellgrün für Seminare
                "Workshop": "#FF99CC",   // Hellrosa für Workshops
                "Deadline": "#FF6666",   // Rot für Deadlines
                "default": "#F0F0F0"     // Standardfarbe für andere Typen
            };

            // Stundenplan nach Tagen strukturieren
            const schedule = {};

            if (userConfig && userConfig.value && userConfig.value.courses) {
                const allCourses = await self.store.get({}); // Alle Kurse aus der Datenbank laden
                console.log("Alle Kurse:", allCourses);
                userConfig.value.courses.forEach(course => {
                    const kurs = allCourses.find(k => k.key === course.key);
                    if (kurs && kurs.value) {
                        const day = kurs.value.day || "Unbekannt";
                        if (!schedule[day]) {
                            schedule[day] = [];
                        }
                        schedule[day].push({
                            title: kurs.value.activity,
                            time: `${kurs.value.from} - ${kurs.value.until}`,
                            room: kurs.value.room,
                            color: course.color || defaultColors["default"], // Nutzerfarbe oder Fallback
                            courseId: kurs.key // Füge courseId hinzu, um Materialien zu laden
                        });
                    }
                });
            } else {
                console.log("Keine gespeicherte Konfiguration gefunden, verwende leeren Stundenplan.");
            }

            // Rendere den Stundenplan
            self.element.innerHTML = `
                <div class="container">
                    <div class="section">
                        <h2>Stundenplan für ${studentId}</h2>
                        <div class="week-schedule">
                            ${Object.entries(schedule).map(([day, events]) => `
                                <div class="day">
                                    <h3>${day}</h3>
                                    ${events.map(event => `
                                        <div class="event" data-course-id="${event.courseId}" style="background-color: ${event.color};">
                                            <strong>${event.title}</strong><br>
                                            <span>${event.time}</span><br>
                                            <span>Raum: ${event.room}</span>
                                        </div>
                                    `).join('')}
                                </div>
                            `).join('') || '<p>Keine Kurse im Stundenplan.</p>'}
                        </div>
                    </div>
                    <!-- Modal für Apps -->
                    <div id="modal" class="modal">
                        <div class="modal-content">
                            <span class="close">×</span>
                            <h3>Apps für ausgewählte Veranstaltung</h3>
                            <div id="modal-apps" class="modal-apps"></div>
                        </div>
                    </div>
                </div>
            `;

            // Event-Listener für das Öffnen des Modals
            const events = self.element.querySelectorAll('.event');
            events.forEach(event => {
                event.addEventListener('click', async () => {
                    const courseId = event.getAttribute('data-course-id');
                    const modalApps = self.element.querySelector('#modal-apps');
                    modalApps.innerHTML = '<p>Lade Apps...</p>'; // Lade-Indikator
                    await self.openModal(courseId, modalApps);
                });
            });

            // Event-Listener für das Schließen des Modals
            self.element.querySelector('.close').addEventListener('click', () => {
                self.closeModal();
            });

            // Schließe das Modal beim Klick außerhalb
            window.addEventListener('click', (event) => {
                const modal = self.element.querySelector('#modal');
                if (event.target === modal) {
                    self.closeModal();
                }
            });
        };

        // Funktion zum Öffnen des Modals und Laden der Apps
        this.openModal = async (courseId, modalApps) => {
            const modal = self.element.querySelector('#modal');
            modal.style.display = 'block';

            // Lade Materialien (Apps) für die ausgewählte Veranstaltung
            const course = await self.store.get(courseId + "");
            if (course && course.value && course.value.materials) {
                modalApps.innerHTML = ''; // Bereinige den Inhalt
                const appsList = document.createElement('div');
                appsList.className = 'apps-list';
                course.value.materials.forEach(material => {
                    self.renderAppInModal(material, appsList);
                });
                modalApps.appendChild(appsList);
            } else {
                modalApps.innerHTML = '<p>Keine Apps verfügbar.</p>';
            }
        };

        // Funktion zum Schließen des Modals
        this.closeModal = () => {
            const modal = self.element.querySelector('#modal');
            modal.style.display = 'none';
        };

        // Funktion zum Rendern einer App im Modal
        this.renderAppInModal = async (material, appsList) => {
            if(material==="wiete")return;
            if(material==="<script src='https://ccmjs.github.io/akless-components/live_poll/ccm.live_poll.min.js'></script><ccm-live_poll src='[\"ccm.get\",{\"name\":\"dms2-configs\",\"url\":\"https://ccm2.inf.h-brs.de\"},[\"live_poll\",\"1646415522026X8637938007495256\"]]'></ccm-live_poll>")return;
            console.log("Lade App für Material:", material);
            const decomposedMaterial = this.helper.decomposeEmbedCode(material);
            const container = document.createElement('div');
            container.className = 'app-container';

            await this.ccm.start(decomposedMaterial.component, {
                root: container,
                ...decomposedMaterial.config
            });

            appsList.appendChild(container);
        };
    }
};
