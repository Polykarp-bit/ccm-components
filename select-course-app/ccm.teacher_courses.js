const teacher_courses = {
    name: "teacher_courses",
    ccm: "https://ccmjs.github.io/ccm/ccm.js",
    config: {
        data_source: ["ccm.store", {
            url: "https://your-server.com/api",
            store: "teacher_courses_data"
        }],
        css: ["ccm.load", "./teacher_courses.css"],
        components_available: [  // Verfügbare Komponenten zur Auswahl
            { name: "Quiz", id: "quiz_component" },
            { name: "Forum", id: "forum_component" },
            { name: "Materialien", id: "materials_component" },
            { name: "Abgaben", id: "submission_component" }
        ]
    },
    Instance: function () {
        let self = this;

        this.start = async () => {
            // Daten aus dem Store laden
            const courses = await self.data_source.get({ teacher_id: self.user_id });

            self.element.innerHTML = `
                <div class="teacher-courses">
                    <h2>Meine Kurse konfigurieren</h2>
                    <form id="course-config">
                        <select id="course-select">
                            <option value="">Kurs auswählen</option>
                            ${courses.map(course => `
                                <option value="${course.id}">${course.name}</option>
                            `).join('')}
                        </select>
                        <div id="components-selection"></div>
                        <button type="submit">Speichern</button>
                    </form>
                </div>
            `;

            const courseSelect = self.element.querySelector('#course-select');
            const componentsDiv = self.element.querySelector('#components-selection');

            courseSelect.addEventListener('change', async (e) => {
                const courseId = e.target.value;
                if (courseId) {
                    const courseData = await self.data_source.get(courseId);
                    componentsDiv.innerHTML = `
                        <h3>Komponenten für ${courseData.name}</h3>
                        ${self.components_available.map(comp => `
                            <label>
                                <input type="checkbox" 
                                       name="components" 
                                       value="${comp.id}"
                                       ${courseData.components?.includes(comp.id) ? 'checked' : ''}>
                                ${comp.name}
                            </label><br>
                        `).join('')}
                    `;
                }
            });

            self.element.querySelector('#course-config').addEventListener('submit', async (e) => {
                e.preventDefault();
                const selectedComponents = Array.from(
                    componentsDiv.querySelectorAll('input[name="components"]:checked')
                ).map(input => input.value);

                await self.data_source.set({
                    id: courseSelect.value,
                    components: selectedComponents
                });
                alert('Konfiguration gespeichert!');
            });
        };
    }
};
