ccm.files["ccm.schedule_manager.js"] = {
    name: "schedule_manager",
    ccm: "../../libs/ccm/ccm.js",
    config: {
        store: ["ccm.store", { url: "https://ccm2.inf.h-brs.de", name: "tniede2s_mycollection" }],
        css: ["ccm.load", "./style.css"],
        helper: ["ccm.load", "https://ccmjs.github.io/akless-components/modules/versions/helper-8.4.2.min.mjs"],
        html: {
            editView: {
                main: `
                    <div id="user"></div>        
                    <h1>%title%</h1>
                    <div id="schedule-container">
                        <h2>Füge einen Kurs hinzu</h2>
                        <div class="dropdown-group">
                            <div class="dropdown-item">
                                <label for="schedule-dropdown">Studiengang/Semester Hinzufügen:</label>
                                <select id="schedule-dropdown">
                                    <option value="">-- Stundenplan auswählen --</option>
                                </select>
                            </div>
                            <div class="dropdown-item">
                                <label for="add-course-dropdown">Einzelnen Kurs hinzufügen Abseits Des Regelsemesters:</label>
                                <select id="add-course-dropdown">
                                    <option value="">-- Kurs hinzufügen --</option>
                                </select>
                            </div>
                        </div>
                        <button id="save-button">Speichern</button>
                        <button id="clear-button">Stundenplan zurücksetzten</button>
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

        this.start = async () => {
            console.log("Starte schedule_manager...");

            const savedSchedule = await self.store.get(studentId);
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
            self.element.innerHTML = '';

            if (isEditMode) {
                await self.renderEditView();
            } else {
                await self.renderScheduleView();
            }

            const toggleButton = document.createElement('button');
            toggleButton.id = 'toggle-view-button';
            toggleButton.textContent = isEditMode ? 'Zur Stundenplanansicht' : 'Settings';
            toggleButton.style.position = 'absolute';
            toggleButton.style.top = '10px';
            toggleButton.style.right = '10px';
            toggleButton.addEventListener('click', async () => {
                isEditMode = !isEditMode;
                await self.renderView();
            });
            self.element.appendChild(toggleButton);
        };

        this.renderEditView = async () => {
            const mainHtml = self.ccm.helper.html(self.html.editView.main, {
                title: "Stundenplan bearbeiten"
            });
            self.element.appendChild(mainHtml);

            let alleKurse = await self.store.get({});
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

            const scheduleOptions = Object.keys(groupedCourses).map(courseName => {
                return `<option value="${courseName}">${courseName}</option>`;
            }).join('');

            const courseOptions = Array.isArray(alleKurse) ? Object.keys(groupedCourses).map(courseName => {
                const courses = groupedCourses[courseName];
                const courseItems = courses
                    .filter(kurs => kurs && kurs.value && kurs.value.activity)
                    .map(kurs => {
                        const label = `${kurs.value.activity} (Tag: ${kurs.value.day}, ${kurs.value.from} - ${kurs.value.until}, Raum: ${kurs.value.room})`;
                        return `<option value="${kurs.key}">${label}</option>`;
                    }).join('');
                return `<optgroup label="${courseName}">${courseItems}</optgroup>`;
            }).join('') : '';

            const clearButton = self.element.querySelector('#clear-button');
            clearButton.addEventListener('click', async () => {
                await self.store.set({ key: studentId, value: { student_id: studentId, courses: [] } });
                currentCourses = [];
                self.element.querySelector('#selected-schedule').innerHTML = '';
                alert("Stundenplan erfolgreich zurückgesetzt!");
            });

            const scheduleDropdown = self.element.querySelector('#schedule-dropdown');
            const addCourseDropdown = self.element.querySelector('#add-course-dropdown');
            scheduleDropdown.innerHTML = `<option value="">-- Stundenplan auswählen --</option>${scheduleOptions}`;
            addCourseDropdown.innerHTML = `<option value="">-- Kurs hinzufügen --</option>${courseOptions}`;

            const scheduleContainer = self.element.querySelector('#schedule-container');
            scheduleContainer.style.display = 'block';
            scheduleContainer.style.visibility = 'visible';

            const loadingSpinner = self.element.querySelector('.ccm_loading');
            if (loadingSpinner) loadingSpinner.style.display = 'none';

            const selectedScheduleContainer = self.element.querySelector('#selected-schedule');
            const saveButton = self.element.querySelector('#save-button');

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

                // Weblinks für den Kurs laden und anzeigen
                const linksList = courseHtml.querySelector('.links-list');
                if (kurs.value.materials && Array.isArray(kurs.value.materials)) {
                    const urlPattern = /^(https?:\/\/)?(www\.)?([^\s$.?#]+\.[^\s]{2,})$/i;
                    kurs.value.materials.forEach(material => {
                        // Fall 1: Neues Format (Objekt mit headline und url)
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
                        }
                        // Fall 2: Altes Format (nur URL als String)
                        else if (typeof material === 'string' && urlPattern.test(material)) {
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
                colorSelect.addEventListener('change', (e) => {
                    kurs.color = e.target.value;
                    courseHtml.style.backgroundColor = e.target.value || '';
                });

                courseHtml.querySelector('.remove-button').addEventListener('click', () => {
                    currentCourses = currentCourses.filter(k => k.key !== kurs.key);
                    selectedScheduleContainer.removeChild(courseHtml);
                });
            };

            let preSelectedSchedule = null;
            if (currentCourses.length > 0) {
                currentCourses = currentCourses.map(savedCourse => {
                    const fullCourse = alleKurse.find(k => k.key === savedCourse.key);
                    return fullCourse ? { ...fullCourse, color: savedCourse.color } : null;
                }).filter(course => course !== null);
                preSelectedSchedule = currentCourses[0]?.value?.course;
            }

            if (preSelectedSchedule && groupedCourses[preSelectedSchedule]) {
                scheduleDropdown.value = preSelectedSchedule;
                currentCourses.forEach(renderCourse);
            }

            scheduleDropdown.addEventListener('change', (e) => {
                const selectedSchedule = e.target.value;
                selectedScheduleContainer.innerHTML = '';
                currentCourses = selectedSchedule ? [...groupedCourses[selectedSchedule]] : [];
                currentCourses.forEach(renderCourse);
            });

            addCourseDropdown.addEventListener('change', (e) => {
                const selectedCourseKey = e.target.value;
                if (selectedCourseKey) {
                    const kurs = alleKurse.find(k => k.key === selectedCourseKey);
                    if (kurs && !currentCourses.some(k => k.key === kurs.key)) {
                        currentCourses.push(kurs);
                        renderCourse(kurs);
                    }
                    addCourseDropdown.value = '';
                }
            });

            saveButton.addEventListener('click', async () => {
                const scheduleData = {
                    key: studentId,
                    value: {
                        student_id: studentId,
                        courses: currentCourses.map(kurs => ({
                            key: kurs.key,
                            color: kurs.color || "",
                            course: kurs.value.course
                        }))
                    }
                };
                await self.store.set(scheduleData);
                alert("Stundenplan erfolgreich gespeichert!");
                isEditMode = false;
                await self.renderView();
            });
        };

        this.renderScheduleView = async () => {
            const userConfig = await self.store.get(studentId);

            const schedule = {};
            if (userConfig && userConfig.value && userConfig.value.courses) {
                const allCourses = await self.store.get({});
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

            // Hilfsfunktion, um eine Zeit (HH:MM) in Minuten umzuwandeln
            const timeToMinutes = (time) => {
                const [hours, minutes] = time.split(':').map(Number);
                return hours * 60 + minutes;
            };

            // Sortiere die Events für jeden Tag nach Startzeit
            Object.keys(schedule).forEach(day => {
                schedule[day].sort((a, b) => {
                    // Extrahiere die Startzeit aus dem time-Feld (z. B. "09:00 - 11:15" -> "09:00")
                    const startTimeA = a.time.split(' - ')[0];
                    const startTimeB = b.time.split(' - ')[0];
                    // Wandle die Startzeiten in Minuten um
                    const minutesA = timeToMinutes(startTimeA);
                    const minutesB = timeToMinutes(startTimeB);
                    // Sortiere aufsteigend nach Startzeit
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
            self.element.appendChild(mainHtml);

            self.element.querySelectorAll('.event').forEach(event => {
                event.addEventListener('click', async () => {
                    const courseId = event.getAttribute('data-course-id');
                    const modalApps = self.element.querySelector('#modal-apps');
                    modalApps.innerHTML = '<p>Lade Links...</p>';
                    await self.openModal(courseId, modalApps);
                });
            });

            self.element.querySelector('.close').addEventListener('click', self.closeModal);
            window.addEventListener('click', (event) => {
                if (event.target === self.element.querySelector('#modal')) self.closeModal();
            });
        };

        this.openModal = async (courseId, modalApps) => {
            const kurs = await this.store.get(courseId + "");
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
