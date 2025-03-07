const select_courses_app = {
    name: "select_courses",
    ccm: "https://ccmjs.github.io/ccm/ccm.js",
    config: {
        data_source: ["ccm.store", {
            url: "https://your-server.com/api",
            store: "course_selection"
        }],
        css: ["ccm.load", "./select_courses.css"],
        onfinish: {
            courses: ["course_id"]
        }
    },
    Instance: function () {
        let self = this;

        this.start = async () => {
            const availableCourses = await self.data_source.get({ type: "all_courses" });
            const studentCourses = await self.data_source.get({ student_id: self.user_id });

            self.element.innerHTML = `
                <div class="course-selection">
                    <h2>Kursauswahl</h2>
                    <form id="course-selection-form">
                        ${availableCourses.map(course => `
                            <label>
                                <input type="checkbox" 
                                       name="courses" 
                                       value="${course.id}"
                                       ${studentCourses?.courses?.includes(course.id) ? 'checked' : ''}>
                                ${course.name} (${course.semester})
                            </label><br>
                        `).join('')}
                        <button type="submit">Speichern</button>
                    </form>
                </div>
            `;

            self.element.querySelector('#course-selection-form').addEventListener('submit', async (e) => {
                e.preventDefault();
                const selectedCourses = Array.from(
                    self.element.querySelectorAll('input[name="courses"]:checked')
                ).map(input => input.value);

                await self.data_source.set({
                    student_id: self.user_id,
                    courses: selectedCourses
                });

                if (self.onfinish) {
                    self.ccm.helper.onFinish(self, { courses: selectedCourses });
                }
            });
        };
    }
};
