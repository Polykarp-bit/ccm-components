ccm.files["ccm.week_schedule.js"] = {
    name: "week_schedule",
    ccm: "https://ccmjs.github.io/ccm/ccm.js",
    config: {
        schedule: {}, // Stundenplan-Daten
        links: [],     // Links und Ressourcen
        study_plans: [
            // Studienverlaufspläne (wie zuvor)
        ],
        css: ["ccm.load", "./style.css"],
    },
    Instance: function () {
        let self = this;

        this.start = async () => {
            // Standardfarben für Veranstaltungstypen
            const defaultColors = {
                "Vorlesung": "#FFCC99",  // Hellorange für Vorlesungen
                "Übung": "#99CCFF",      // Hellblau für Übungen
                "Seminar": "#CCFFCC",    // Hellgrün für Seminare
                "Workshop": "#FF99CC",   // Hellrosa für Workshops
                "Deadline": "#FF6666",   // Rot für Deadlines
                "default": "#F0F0F0"     // Standardfarbe für andere Typen
            };

            // Farben aus dem Local Storage laden (falls vorhanden)
            let eventColors = JSON.parse(localStorage.getItem("eventColors")) || defaultColors;

            // Rendere den Stundenplan
            self.element.innerHTML = `
        <div class="container">
          <!-- Stundenplan -->
          <div class="section">
            <h2>Stundenplan</h2>
            <div class="week-schedule">
              ${Object.entries(self.schedule).map(([day, events]) => `
                <div class="day">
                  <h3>${day}</h3>
                  ${events.map(event => {
                const type = event.type || "default";
                const color = eventColors[type] || eventColors["default"];
                return `
                        <div class="event" style="background-color: ${color};">
                          <strong>${event.title}</strong><br>
                          <span>${event.time}</span>
                        </div>
                      `;
            }).join('')}
                </div>
              `).join('')}
            </div>
          </div>

        

      `;


            // Funktion zum Rendern des Studienverlaufsplans
            function renderStudyPlan(plan) {
                const content = `
                  <h3>${plan.studiengang} (${plan.abschluss})</h3>
                  <p>Regelstudienzeit: ${plan.regelstudienzeit} Semester</p>
                  <div class="semester-list">
                    ${plan.semester.map(semester => `
                      <div class="semester">
                        <h4>Semester ${semester.semester_nummer}</h4>
                        <ul>
                          ${semester.module.map(module => `
                            <li>
                              <strong>${module.modulname}</strong><br>
                              CP: ${module.cp}, Prüfungsform: ${module.pruefungsform}
                            </li>
                          `).join('')}
                        </ul>
                      </div>
                    `).join('')}
                  </div>
                `;
                self.element.querySelector('#study-plan-content').innerHTML = content;
            }
        };
    }
};
