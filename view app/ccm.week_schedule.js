ccm.files["ccm.week_schedule.js"] = {
    name: "week_schedule",
    ccm: "https://ccmjs.github.io/ccm/ccm.js",
    config: {
        store: ["ccm.store", { url: "https://ccm2.inf.h-brs.de", name: "tniede2s_mycollection" }],
        css: ["ccm.load", "./style.css"],
        user: ["ccm.start", "https://ccmjs.github.io/akless-components/user/versions/ccm.user-9.7.2.js"], // Für dynamisches Kürzel
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
            await self.user.login();
            const studentId = self.user.getValue().username || "tmiede2s"; // Fallback auf "tmiede2s"

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
                            color: course.color || defaultColors["default"] // Nutzerfarbe oder Fallback
                        });
                    }
                });
            } else {
                console.log("Keine gespeicherte Konfiguration gefunden, verwende leeren Stundenplan.");
            }

            // Rendere den Stundenplan
            self.element.innerHTML = `
                <div class="container">
                    <!-- Stundenplan -->
                    <div class="section">
                        <h2>Stundenplan für ${studentId}</h2>
                        <div class="week-schedule">
                            ${Object.entries(schedule).map(([day, events]) => `
                                <div class="day">
                                    <h3>${day}</h3>
                                    ${events.map(event => `
                                        <div class="event" style="background-color: ${event.color};">
                                            <strong>${event.title}</strong><br>
                                            <span>${event.time}</span><br>
                                            <span>Raum: ${event.room}</span>
                                        </div>
                                    `).join('')}
                                </div>
                            `).join('') || '<p>Keine Kurse im Stundenplan.</p>'}
                        </div>
                    </div>
                </div>
            `;
        };
    }
};
