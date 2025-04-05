ccm.files["ccm.schedule_manager.js"] = {
    name: "schedule_manager",
    ccm: "../../libs/ccm/ccm.js",
    config: {
        studentStore: ["ccm.store", { url: "https://ccm2.inf.h-brs.de", name: "tniede2s_student_schedules" }],
        courseStore: ["ccm.store", { url: "https://ccm2.inf.h-brs.de", name: "tniede2s_teacher_courses" }],
        css: ["ccm.load", "./style.css"],
        helper: ["ccm.load", "https://ccmjs.github.io/akless-components/modules/versions/helper-8.4.2.min.mjs"],
        html: {
            editView: {
                main: `
                    <div id="user"></div>        
                    <h1>%title%</h1>
                    <div id="schedule-container">
                        <h2>Füge einen Kurs hinzu</h2>
                        <button id ="add-course-button">Neuen Kurs hinzufügen</button>
                        <div class="dropdown-container">
                            <button id="course-dropdown-button" class="dropdown-button">Kurs auswählen ▼</button>
                            <div id="course-dropdown-content" class="dropdown-content">
                                <input type="text" id="course-search" placeholder="Kurs suchen...">
                                <div id="course-checkbox-list"></div>
                            </div>
                        </div>
                        <h2>Ausgewählter Stundenplan</h2>
                        <div id="selected-schedule"></div>
                    </div>
                `,
                courseItem: `
                    <div class="course-item" data-key="%key%">
                        <h3>%activity%</h3>
                        <p>Tag: %day%, %from% - %until%, Raum: %room%</p>
                        <select class="color-select">
                            <option value="">-- Farbe auswählen --</option>
                            <option value="#ff9999">Hellrot</option>
                            <option value="#ff4d4d">Rot</option>
                            <option value="#ffcc99">Pfirsich</option>
                            <option value="#ff8c1a">Orange</option>
                            <option value="#ffff99">Hellgelb</option>
                            <option value="#ffeb3b">Gelb</option>
                            <option value="#b3ff99">Hellgrün</option>
                            <option value="#4caf50">Grün</option>
                            <option value="#99ccff">Hellblau</option>
                            <option value="#2196f3">Blau</option>
                            <option value="#cc99ff">Lavendel</option>
                            <option value="#9c27b0">Lila</option>
                            <option value="#ff99cc">Rosa</option>
                            <option value="#f06292">Pink</option>
                            <option value="#d3d3d3">Hellgrau</option>
                            <option value="#808080">Grau</option>
                        </select>
                        <button class="remove-button">Entfernen</button>
                        <div class="course-links">
                            <h4>Weblinks:</h4>
                            <ul class="links-list"></ul>
                        </div>
                    </div>
                `
            },
            scheduleView: {
                main: `
                    <div class="container">
                        <div class="section">
                            <h2>Stundenplan für %studentId%</h2>
                            <div class="week-schedule">
                                %scheduleContent%
                            </div>
                        </div>
                        <div id="modal" class="modal">
                            <div class="modal-content">
                                <span class="close">×</span>
                                <h3>Apps für ausgewählte Veranstaltung</h3>
                                <div id="modal-apps" class="modal-apps"></div>
                            </div>
                        </div>
                    </div>
                `
            }
        }
    },

    Instance: function () {
        let self = this;
        let currentCourses = [];
        let isEditMode = false;
        const studentId = "tmiede2s";
        let toggleButton;

        this.start = async () => {
            console.log("Starte schedule_manager...");

            toggleButton = document.createElement('button');
            toggleButton.id = 'toggle-view-button';
            toggleButton.style.position = 'absolute';
            toggleButton.style.top = '10px';
            toggleButton.style.right = '10px';
            toggleButton.addEventListener('click', async () => {
                isEditMode = !isEditMode;
                await self.renderView();
            });
            self.element.appendChild(toggleButton);

            const savedSchedule = await self.studentStore.get(studentId);
            console.log("Gespeicherte Konfiguration für", studentId, ":", savedSchedule);

            if (savedSchedule && savedSchedule.value && savedSchedule.value.courses) {
                currentCourses = savedSchedule.value.courses.map(course => ({
                    key: course.key,
                    color: course.color,
                    course: course.course
                }));
            } else {
                isEditMode = true;
            }

            await self.renderView();
        };

        this.renderView = async () => {
            const mainContent = self.element.querySelector('#main-content');
            if (mainContent) {
                mainContent.remove();
            }

            const contentDiv = document.createElement('div');
            contentDiv.id = 'main-content';
            self.element.insertBefore(contentDiv, toggleButton);

            toggleButton.textContent = isEditMode ? 'Zur Stundenplanansicht' : 'Settings';

            if (isEditMode) {
                await self.renderEditView(contentDiv);
            } else {
                await self.renderScheduleView(contentDiv);
            }
        };

        this.renderEditView = async (container) => {
            const mainHtml = self.ccm.helper.html(self.html.editView.main, {
                title: "Stundenplan bearbeiten"
            });
            container.appendChild(mainHtml);container.appendChild(mainHtml);

            const addCourseButton = document.createElement('button');
            addCourseButton.textContent = 'Neuen Kurs hinzufügen';
            container.appendChild(addCourseButton);

            const newCourseForm = document.createElement('form');
            newCourseForm.innerHTML = `
                <input type="text" id="new-course-name" placeholder="Kursname" required>
                <input type="text" id="new-course-day" placeholder="Tag" required>
                <input type="text" id="new-course-from" placeholder="Von" required>
                <input type="text" id="new-course-until" placeholder="Bis" required>
                <input type="text" id="new-course-room" placeholder="Raum" required>
                <button type="submit">Kurs hinzufügen</button>
            `;
            container.appendChild(newCourseForm);

            newCourseForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const newCourse = {
                    key: `course_${Date.now()}`,
                    value: {
                        course: document.getElementById('new-course-name').value,
                        day: document.getElementById('new-course-day').value,
                        from: document.getElementById('new-course-from').value,
                        until: document.getElementById('new-course-until').value,
                        room: document.getElementById('new-course-room').value,
                        activity: document.getElementById('new-course-name').value
                    }
                };
                await addCourse(newCourse);
                newCourseForm.reset();
            });

            let alleKurse = await self.courseStore.get({});
            console.log("Alle Kurse:", alleKurse);

            const groupedCourses = {};
            if (Array.isArray(alleKurse)) {
                alleKurse.forEach(kurs => {
                    if (kurs && kurs.value && kurs.value.course) {
                        const courseName = kurs.value.course;
                        if (!groupedCourses[courseName]) {
                            groupedCourses[courseName] = [];
                        }
                        groupedCourses[courseName].push(kurs);
                    }
                });
            }

            const courseCheckboxList = container.querySelector('#course-checkbox-list');
            const selectedScheduleContainer = container.querySelector('#selected-schedule');
            const scheduleContainer = container.querySelector('#schedule-container');
            const dropdownButton = container.querySelector('#course-dropdown-button');
            const dropdownContent = container.querySelector('#course-dropdown-content');
            const searchInput = container.querySelector('#course-search');

            if (scheduleContainer) {
                scheduleContainer.style.display = 'block';
                scheduleContainer.style.visibility = 'visible';
            }

            const saveCourses = async () => {
                console.log(currentCourses);
                const scheduleData = {
                    key: studentId,
                    value: {
                        student_id: studentId,
                        courses: currentCourses.map(kurs => ({
                            key: kurs.key,
                            color: kurs.color || "",
                            course: kurs.course || kurs.value.course
                        }))
                    }
                };
                await self.studentStore.set(scheduleData);
                console.log("Kurse automatisch gespeichert:", scheduleData);
            };

            const courseListHtml = Object.keys(groupedCourses).map(courseName => {
                const courses = groupedCourses[courseName];
                const subCoursesHtml = courses
                    .filter(kurs => kurs && kurs.value && kurs.value.activity)
                    .map(kurs => `
                <div class="subcourse-item">
                    <input type="checkbox" class="subcourse-checkbox" data-key="${kurs.key}" data-parent="${courseName}" ${currentCourses.some(c => c.key === kurs.key) ? 'checked' : ''}>
                    <label>${kurs.value.activity} (Tag: ${kurs.value.day}, ${kurs.value.from} - ${kurs.value.until}, Raum: ${kurs.value.room})</label>
                </div>
            `).join('');
                return `
            <div class="course-group">
                <div class="course-item">
                    <input type="checkbox" class="course-checkbox" data-course="${courseName}" ${currentCourses.some(c => c.course === courseName && groupedCourses[courseName].every(k => currentCourses.some(ck => ck.key === k.key))) ? 'checked' : ''}>
                    <label>${courseName}</label>
                </div>
                <div class="subcourses">
                    ${subCoursesHtml}
                </div>
            </div>
        `;
            }).join('');

            if (courseCheckboxList) {
                courseCheckboxList.innerHTML = courseListHtml;
            }

            if (dropdownButton && dropdownContent) {
                document.addEventListener('click', function(event) {
                    if (!dropdownContent.contains(event.target) && !dropdownButton.contains(event.target)) {
                        dropdownContent.style.display = 'none';
                        dropdownButton.textContent = 'Kurs auswählen ▼';
                    }
                });

                dropdownButton.onclick = function(event) {
                    event.stopPropagation();
                    const isOpen = dropdownContent.style.display === 'block';
                    dropdownContent.style.display = isOpen ? 'none' : 'block';
                    dropdownButton.textContent = isOpen ? 'Kurs auswählen ▼' : 'Kurs auswählen ▲';
                    if (!isOpen && searchInput) {
                        searchInput.focus();
                    }
                };
            }

            if (searchInput) {
                searchInput.addEventListener('input', () => {
                    const searchTerm = searchInput.value.toLowerCase();
                    const courseGroups = courseCheckboxList.querySelectorAll('.course-group');

                    courseGroups.forEach(group => {
                        const courseName = group.querySelector('.course-checkbox').dataset.course.toLowerCase();
                        const subCourses = group.querySelectorAll('.subcourse-item');
                        let hasVisibleSubCourse = false;

                        subCourses.forEach(subCourse => {
                            const label = subCourse.querySelector('label').textContent.toLowerCase();
                            if (courseName.includes(searchTerm) || label.includes(searchTerm)) {
                                subCourse.style.display = 'flex';
                                hasVisibleSubCourse = true;
                            } else {
                                subCourse.style.display = 'none';
                            }
                        });

                        group.style.display = hasVisibleSubCourse ? 'block' : 'none';
                    });
                });
            }

            const renderCourse = (kurs) => {
                const courseHtml = self.ccm.helper.html(self.html.editView.courseItem, {
                    key: kurs.key,
                    activity: kurs.value.activity || "Unbekannter Kurs",
                    day: kurs.value.day || "Unbekannt",
                    from: kurs.value.from || "Unbekannt",
                    until: kurs.value.until || "Unbekannt",
                    room: kurs.value.room || "Unbekannt"
                });
                selectedScheduleContainer.appendChild(courseHtml);

                const linksList = courseHtml.querySelector('.links-list');
                if (kurs.value.materials && Array.isArray(kurs.value.materials)) {
                    const urlPattern = /^(https?:\/\/)?(www\.)?([^\s$.?#]+\.[^\s]{2,})$/i;
                    kurs.value.materials.forEach(material => {
                        if (typeof material === 'object' && material.headline && material.url && urlPattern.test(material.url)) {
                            const li = document.createElement('li');
                            const headline = document.createElement('div');
                            headline.className = 'link-headline';
                            headline.textContent = material.headline;
                            const link = document.createElement('a');
                            link.href = material.url;
                            link.textContent = material.url;
                            link.target = "_blank";
                            link.rel = "noopener noreferrer";
                            li.appendChild(headline);
                            li.appendChild(link);
                            linksList.appendChild(li);
                        } else if (typeof material === 'string' && urlPattern.test(material)) {
                            const li = document.createElement('li');
                            const link = document.createElement('a');
                            const normalizedUrl = material.startsWith('http') ? material : `https://${material}`;
                            link.href = normalizedUrl;
                            link.textContent = normalizedUrl;
                            link.target = "_blank";
                            link.rel = "noopener noreferrer";
                            li.appendChild(link);
                            linksList.appendChild(li);
                        }
                    });
                }

                const colorSelect = courseHtml.querySelector('.color-select');
                if (kurs.color) {
                    colorSelect.value = kurs.color;
                    courseHtml.style.backgroundColor = kurs.color;
                }

                colorSelect.addEventListener('change', async (e) => {
                    kurs.color = e.target.value;
                    courseHtml.style.backgroundColor = e.target.value || '';
                    const courseInList = currentCourses.find(c => c.key === kurs.key);
                    if (courseInList) {
                        courseInList.color = kurs.color;
                        await saveCourses();
                    }
                });

                courseHtml.querySelector('.remove-button').addEventListener('click', async () => {
                    currentCourses = currentCourses.filter(k => k.key !== kurs.key);
                    selectedScheduleContainer.removeChild(courseHtml);
                    const checkbox = courseCheckboxList.querySelector(`.subcourse-checkbox[data-key="${kurs.key}"]`);
                    if (checkbox) checkbox.checked = false;
                    updateParentCheckbox(kurs.value.course);
                    await saveCourses();
                });
            };

            const updateParentCheckbox = (courseName) => {
                const parentCheckbox = courseCheckboxList.querySelector(`.course-checkbox[data-course="${courseName}"]`);
                const subCheckboxes = courseCheckboxList.querySelectorAll(`.subcourse-checkbox[data-parent="${courseName}"]`);
                if (!parentCheckbox) {
                    console.warn(`Kein parentCheckbox für Kurs "${courseName}" gefunden.`);
                    return;
                }
                const allChecked = Array.from(subCheckboxes).every(sub => sub.checked);
                const someChecked = Array.from(subCheckboxes).some(sub => sub.checked);
                parentCheckbox.checked = allChecked;
                parentCheckbox.indeterminate = someChecked && !allChecked;
            };

            currentCourses.forEach(course => {
                const fullCourse = alleKurse.find(k => k.key === course.key);
                if (fullCourse) {
                    fullCourse.color = course.color;
                    renderCourse(fullCourse);
                    const checkbox = courseCheckboxList.querySelector(`.subcourse-checkbox[data-key="${course.key}"]`);
                    if (checkbox) checkbox.checked = true;
                    updateParentCheckbox(fullCourse.value.course);
                } else {
                    console.warn(`Kurs mit key "${course.key}" nicht in courseStore gefunden.`);
                }
            });

            courseCheckboxList.querySelectorAll('.course-checkbox').forEach(checkbox => {
                checkbox.addEventListener('change', async (e) => {
                    const courseName = e.target.dataset.course;
                    const subCheckboxes = courseCheckboxList.querySelectorAll(`.subcourse-checkbox[data-parent="${courseName}"]`);
                    subCheckboxes.forEach(subCheckbox => {
                        subCheckbox.checked = e.target.checked;
                        const kursKey = subCheckbox.dataset.key;
                        const kurs = alleKurse.find(k => k.key === kursKey);
                        if (e.target.checked) {
                            if (!currentCourses.some(c => c.key === kursKey)) {
                                currentCourses.push(kurs);
                                renderCourse(kurs);
                            }
                        } else {
                            currentCourses = currentCourses.filter(c => c.key !== kursKey);
                            const courseElement = selectedScheduleContainer.querySelector(`.course-item[data-key="${kursKey}"]`);
                            if (courseElement) selectedScheduleContainer.removeChild(courseElement);
                        }
                    });
                    await saveCourses();
                });
            });

            courseCheckboxList.querySelectorAll('.subcourse-checkbox').forEach(checkbox => {
                checkbox.addEventListener('change', async (e) => {
                    const kursKey = e.target.dataset.key;
                    const kurs = alleKurse.find(k => k.key === kursKey);
                    if (e.target.checked) {
                        if (!currentCourses.some(c => c.key === kursKey)) {
                            currentCourses.push(kurs);
                            renderCourse(kurs);
                        }
                    } else {
                        currentCourses = currentCourses.filter(c => c.key !== kursKey);
                        const courseElement = selectedScheduleContainer.querySelector(`.course-item[data-key="${kursKey}"]`);
                        if (courseElement) selectedScheduleContainer.removeChild(courseElement);
                    }
                    updateParentCheckbox(kurs.value.course);
                    await saveCourses();
                });
            });
        };

        this.renderScheduleView = async (container) => {
            const userConfig = await self.studentStore.get(studentId);

            const schedule = {};
            if (userConfig && userConfig.value && userConfig.value.courses) {
                const allCourses = await self.courseStore.get({});
                userConfig.value.courses.forEach(course => {
                    const kurs = allCourses.find(k => k.key === course.key);
                    if (kurs && kurs.value) {
                        const day = kurs.value.day || "Unbekannt";
                        if (!schedule[day]) schedule[day] = [];
                        schedule[day].push({
                            title: kurs.value.activity,
                            time: `${kurs.value.from} - ${kurs.value.until}`,
                            room: kurs.value.room,
                            color: course.color || "#F0F0F0",
                            courseId: kurs.key
                        });
                    }
                });
            }

            const timeToMinutes = (time) => {
                const [hours, minutes] = time.split(':').map(Number);
                return hours * 60 + minutes;
            };

            Object.keys(schedule).forEach(day => {
                schedule[day].sort((a, b) => {
                    const startTimeA = a.time.split(' - ')[0];
                    const startTimeB = b.time.split(' - ')[0];
                    const minutesA = timeToMinutes(startTimeA);
                    const minutesB = timeToMinutes(startTimeB);
                    return minutesA - minutesB;
                });
            });

            const scheduleContent = Object.entries(schedule).map(([day, events]) => `
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
            `).join('') || '<p>Keine Kurse im Stundenplan.</p>';

            const mainHtml = self.ccm.helper.html(self.html.scheduleView.main, {
                studentId: studentId,
                scheduleContent: scheduleContent
            });
            container.appendChild(mainHtml);

            container.querySelectorAll('.event').forEach(event => {
                event.addEventListener('click', async () => {
                    const courseId = event.getAttribute('data-course-id');
                    const modalApps = container.querySelector('#modal-apps');
                    modalApps.innerHTML = '<p>Lade Links...</p>';
                    await self.openModal(courseId, modalApps);
                });
            });

            container.querySelector('.close').addEventListener('click', self.closeModal);
            window.addEventListener('click', (event) => {
                if (event.target === container.querySelector('#modal')) self.closeModal();
            });
        };

        this.openModal = async (courseId, modalApps) => {
            const kurs = await self.courseStore.get(courseId);
            if (!kurs || !kurs.value || !kurs.value.materials) {
                modalApps.innerHTML = '<p>Keine Links vorhanden.</p>';
                const modal = self.element.querySelector('#modal');
                modal.style.display = 'block';
                return;
            }

            const urlPattern = /^(https?:\/\/)?(www\.)?([^\s$.?#]+\.[^\s]{2,})$/i;
            const links = kurs.value.materials.filter(material => {
                if (typeof material === 'string') {
                    return urlPattern.test(material);
                } else if (typeof material === 'object' && material.url) {
                    return urlPattern.test(material.url);
                }
                return false;
            });

            if (links.length === 0) {
                modalApps.innerHTML = '<p>Keine Links vorhanden.</p>';
                const modal = self.element.querySelector('#modal');
                modal.style.display = 'block';
                return;
            }

            if (links.length === 1) {
                const link = typeof links[0] === 'string' ? links[0] : links[0].url;
                const normalizedLink = link.startsWith('http') ? link : `https://${link}`;
                window.open(normalizedLink, '_blank');
                return;
            }

            modalApps.innerHTML = links.map(material => {
                const headline = typeof material === 'object' && material.headline ? material.headline : 'Weblink';
                const url = typeof material === 'string' ? material : material.url;
                const normalizedUrl = url.startsWith('http') ? url : `https://${url}`;
                return `
                    <div class="modal-link">
                        <strong>${headline}</strong><br>
                        <a href="${normalizedUrl}" target="_blank" rel="noopener noreferrer">${normalizedUrl}</a>
                    </div>
                `;
            }).join('');

            const modal = self.element.querySelector('#modal');
            modal.style.display = 'block';
        };

        this.closeModal = () => {
            const modal = self.element.querySelector('#modal');
            if (modal) {
                modal.style.display = 'none';
            } else {
                console.error("Modal element not found in closeModal!");
            }
        };
    }
};
