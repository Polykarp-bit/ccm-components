/**
 * @overview ccm component for checklists
 * @author Tobias Niederprüm <t.niederpruem@gmail.com>, 2025
 * @license The MIT License (MIT)
 */

ccm.files["ccm.checklist.js"] = {
    name: "checklist",
    //ccm: "../../libs/ccm/ccm.js",
    ccm: "https://ccmjs.github.io/ccm/ccm.js",
    config: {
        store: ["ccm.store", { url: "https://ccm2.inf.h-brs.de", name: "tniede2s_checklist_data" }],
        css: ["ccm.load", "./resources/style.css"],
        html: {
            main: `
                <div class="container">
                    <h1>Meine Listen</h1>
                    <div class="create-list">
                        <input type="text" id="list-name" placeholder="Listen-Name (z.B. Projekt 2024)">
                        <input type="text" id="first-item-name" placeholder="Erstes Listenobjekt (z.B. Aufgabe 1)">
                        <button id="start-create">Liste erstellen</button>
                    </div>
                    <div class="list-form" style="display: none;">
                        <div class="preview-section">
                            <h3>Vorschau der Liste</h3>
                            <div id="preview-list"></div>
                        </div>
                        <button id="save-list">Liste speichern</button>
                        <button class="cancel-button">Abbrechen</button>
                    </div>
                    <div id="items"></div>
                </div>
    `
        }
    },
    Instance: function () {
        let self = this;
        let my;

        this.init = async () => {
            try {
                my = await self.store.get("checklist_data") || { listsData: {}, listState: {} };
                my.listsData = my.listsData || {};
                my.listState = my.listState || {};
                my.tempList = null;
                my.currentItems = [];

                // Initialisiere listState für alle bestehenden Listen
                Object.keys(my.listsData).forEach(listKey => {
                    if (!my.listState[listKey]) {
                        console.log(`Initialisiere listState für ${listKey}`);
                        my.listState[listKey] = { items: {}, collapsed: false };
                        initializeState(listKey, my.listsData[listKey], my.listState[listKey]);
                    }
                });

                console.log("Initialized store:", JSON.stringify(my, null, 2));
            } catch (e) {
                console.error("Failed to initialize store:", e);
                self.element.innerHTML = `<p>Error initializing store: ${e.message}</p>`;
            }
        };

        this.start = async () => {
            try {
                if (typeof self.store.get !== 'function' || typeof self.store.set !== 'function') {
                    throw new Error("Store methods are not available. Check CCM configuration or server access.");
                }

                // Render main HTML
                self.element.innerHTML = '';
                self.element.appendChild(self.ccm.helper.html(self.html.main));

                // DOM elements
                const createListForm = self.element.querySelector('.create-list');
                const listForm = self.element.querySelector('.list-form');
                const startCreateButton = createListForm.querySelector('#start-create');
                const saveListButton = listForm.querySelector('#save-list');
                const cancelButton = listForm.querySelector('.cancel-button');
                const previewList = self.element.querySelector('#preview-list');
                const itemElement = self.element.querySelector('#items');

                // Date formatting
                function formatDate(isoDate) {
                    if (!isoDate) return '';
                    const date = new Date(isoDate);
                    return date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
                }

                // Event listener for showing the form
                startCreateButton.addEventListener('click', () => {
                    const listName = createListForm.querySelector('#list-name').value.trim();
                    const firstItemName = createListForm.querySelector('#first-item-name').value.trim();
                    if (!listName || !firstItemName) {
                        alert('Bitte geben Sie einen Listennamen und ein erstes Listenobjekt ein.');
                        return;
                    }
                    my.tempList = {
                        key: listName.replace(/\s+/g, ''),
                        items: []
                    };
                    my.currentItems = [];
                    previewList.innerHTML = '';

                    const firstItemKey = `item_${firstItemName.replace(/[^a-zA-Z0-9äöüß]/g, '_').toLowerCase()}_${Date.now()}`;
                    const firstItem = { key: firstItemKey, name: firstItemName, items: [], deadline: null };
                    my.tempList.items.push(firstItem);
                    my.currentItems.push(firstItem);

                    renderPreview(my.tempList.key, my.tempList.items);

                    listForm.style.display = 'block';
                    createListForm.querySelector('#list-name').value = '';
                    createListForm.querySelector('#first-item-name').value = '';
                });

                // Event listener for canceling the form
                cancelButton.addEventListener('click', () => {
                    listForm.style.display = 'none';
                    my.tempList = null;
                    my.currentItems = [];
                    previewList.innerHTML = '';
                });

                // Event listener for saving the list
                saveListButton.addEventListener('click', async () => {
                    if (!my.tempList || my.tempList.items.length === 0) {
                        alert('Die Liste muss mindestens ein Listenobjekt enthalten.');
                        return;
                    }

                    my.listsData[my.tempList.key] = my.tempList.items;
                    if (!my.listState[my.tempList.key]) {
                        my.listState[my.tempList.key] = { items: {}, collapsed: false };
                    }
                    initializeState(my.tempList.key, my.tempList.items, my.listState[my.tempList.key]);

                    try {
                        await self.store.set({ key: "checklist_data", listsData: my.listsData, listState: my.listState });
                        console.log('Daten erfolgreich gespeichert:', await self.store.get("checklist_data"));
                    } catch (e) {
                        console.error('Fehler beim Speichern:', e);
                        alert('Fehler beim Speichern der Liste. Bitte überprüfe die Konsole.');
                        return;
                    }

                    await renderLists(itemElement);

                    listForm.style.display = 'none';
                    previewList.innerHTML = '';
                    my.tempList = null;
                    my.currentItems = [];
                });

                // Render preview
                function renderPreview(listKey, items) {
                    console.log('renderPreview called with:', { listKey, items: JSON.stringify(items, null, 2) });
                    previewList.innerHTML = ''; // Löscht die vorherige Vorschau
                    //const listTitle = listKey.replace(/([A-Z])/g, ' $1').trim();
                    const listTitle = listKey;
                    const listHtml = document.createElement('div');
                    listHtml.className = 'list-item';
                    listHtml.innerHTML = `
        <div class="item-header">
            <h3>${listTitle}</h3>
        </div>
        <div class="item-content">
            <div class="subitem-list"></div>
            <button class="add-subitem">Listenobjekt hinzufügen</button>
            <div class="list-input">
                <input type="text" class="subitem-name" placeholder="Objekt-Name (z.B. Aufgabe 2)">
                <button class="confirm-subitem">Hinzufügen</button>
            </div>
        </div>
    `;
                    previewList.appendChild(listHtml);
                    console.log('listHtml appended to previewList:', listHtml);

                    const subitemList = listHtml.querySelector('.subitem-list');
                    const addSubitemButton = listHtml.querySelector('.add-subitem');
                    const listInput = listHtml.querySelector('.list-input');
                    const subitemNameInput = listHtml.querySelector('.subitem-name');
                    const confirmSubitemButton = listHtml.querySelector('.confirm-subitem');

                    addSubitemButton.addEventListener('click', () => {
                        listInput.classList.toggle('active');
                        subitemNameInput.focus();
                    });

                    confirmSubitemButton.addEventListener('click', () => {
                        const subitemName = subitemNameInput.value.trim();
                        if (!subitemName) {
                            alert('Bitte geben Sie einen Namen für das Listenobjekt ein.');
                            return;
                        }
                        const subitemKey = `item_${subitemName.replace(/[^a-zA-Z0-9äöüß]/g, '_').toLowerCase()}_${Date.now()}`;
                        const newSubitem = { key: subitemKey, name: subitemName, items: [], deadline: null };

                        my.tempList.items.push(newSubitem);
                        my.currentItems.push(newSubitem);
                        console.log('New item added:', newSubitem);
                        console.log('Updated tempList:', JSON.stringify(my.tempList, null, 2));
                        console.log('Updated currentItems:', JSON.stringify(my.currentItems, null, 2));

                        renderPreview(my.tempList.key, my.tempList.items);
                        subitemNameInput.value = '';
                        listInput.classList.remove('active');
                    });

                    items.forEach(item => {
                        console.log('Rendering item in preview:', item);
                        renderPreviewItem(item, subitemList, '');
                    });
                }

                function updateItemNameInTempList(itemsArray, targetItemKey, updatedName) {
                    for (let i = 0; i < itemsArray.length; i++) {
                        if (itemsArray[i].key === targetItemKey) {
                            itemsArray[i].name = updatedName;
                            return true; // Erfolg
                        }
                        if (itemsArray[i].items && itemsArray[i].items.length > 0) {
                            if (updateItemNameInTempList(itemsArray[i].items, targetItemKey, updatedName)) {
                                return true; // Erfolg in Unterebene
                            }
                        }
                    }
                    return false; // Nicht gefunden
                }


                // Render preview item
                function renderPreviewItem(item, parentElement, parentKey) {
                    const itemKey = parentKey ? `${parentKey}_${item.key}` : item.key;
                    const isEndPoint = item.items.length === 0;
                    const subitemProgress = isEndPoint ? 0 : calculateSubitemProgress(my.tempList.key, itemKey, item.items, itemKey); // Annahme: calculateSubitemProgress existiert und funktioniert

                    console.log('Rendering preview item (editable name):', { itemKey, isEndPoint, subitemProgress, item });

                    const itemHtml = document.createElement('div');
                    itemHtml.className = isEndPoint ? 'point-item' : 'subitem';
                    itemHtml.dataset.id = itemKey;

                    const headerDiv = document.createElement('div');
                    headerDiv.className = `${isEndPoint ? 'point' : 'subitem'}-header`;

                    // --- Start: Titel und Namensbearbeitung ---
                    const titleEditWrapper = document.createElement('div');
                    titleEditWrapper.className = 'title-edit-wrapper'; // Für CSS

                    const editNameIcon = document.createElement('button');
                    editNameIcon.innerHTML = '&#9998;'; // Stift-Symbol
                    editNameIcon.className = 'edit-item-name-btn';
                    editNameIcon.title = 'Namen bearbeiten';
                    titleEditWrapper.appendChild(editNameIcon);

                    const titleDisplay = document.createElement('p');
                    titleDisplay.className = `${isEndPoint ? 'point' : 'subitem'}-title`;
                    titleDisplay.textContent = item.name;
                    titleEditWrapper.appendChild(titleDisplay);



                    const nameEditForm = document.createElement('div');
                    nameEditForm.className = 'item-name-edit-form';
                    nameEditForm.style.display = 'none'; // Initial versteckt

                    const nameInput = document.createElement('input');
                    nameInput.type = 'text';
                    nameInput.className = 'item-name-input-field';

                    const saveNameButton = document.createElement('button');
                    saveNameButton.textContent = 'OK';
                    saveNameButton.className = 'save-item-name-btn';

                    const cancelNameButton = document.createElement('button');
                    cancelNameButton.textContent = 'X';
                    cancelNameButton.className = 'cancel-item-name-btn';

                    nameEditForm.appendChild(nameInput);
                    nameEditForm.appendChild(saveNameButton);
                    nameEditForm.appendChild(cancelNameButton);
                    titleEditWrapper.appendChild(nameEditForm);
                    headerDiv.appendChild(titleEditWrapper);

                    editNameIcon.addEventListener('click', (e) => {
                        e.stopPropagation(); // Verhindert ggf. andere Klick-Events auf dem Header
                        titleDisplay.style.display = 'none';
                        editNameIcon.style.display = 'none';
                        nameEditForm.style.display = 'flex';
                        nameInput.value = item.name;
                        nameInput.focus();
                    });

                    cancelNameButton.addEventListener('click', (e) => {
                        e.stopPropagation();
                        nameEditForm.style.display = 'none';
                        titleDisplay.style.display = ''; // Zurück zum Standard-Display (block/inline)
                        editNameIcon.style.display = ''; // Zurück zum Standard-Display
                    });

                    saveNameButton.addEventListener('click', (e) => {
                        e.stopPropagation();
                        const newName = nameInput.value.trim();
                        if (newName && newName !== item.name) {
                            if (updateItemNameInTempList(my.tempList.items, item.key, newName)) {
                                renderPreview(my.tempList.key, my.tempList.items); // Gesamte Vorschau neu rendern
                            } else {
                                console.error(`Konnte Item mit Key ${item.key} zum Umbenennen nicht in tempList finden.`);
                                // UI trotzdem zurücksetzen
                                nameEditForm.style.display = 'none';
                                titleDisplay.style.display = '';
                                editNameIcon.style.display = '';
                            }
                        } else if (!newName) {
                            alert('Der Item-Name darf nicht leer sein.');
                            nameInput.focus();
                        } else { // Nichts geändert
                            nameEditForm.style.display = 'none';
                            titleDisplay.style.display = '';
                            editNameIcon.style.display = '';
                        }
                    });
                    // --- Ende: Titel und Namensbearbeitung ---

                    // Deadline-Gruppe
                    const deadlineGroupId = `deadline_preview_${itemKey.replace(/\W/g, '_')}`; // ID-sicher machen
                    const deadlineGroup = document.createElement('div');
                    deadlineGroup.className = 'deadline-group';
                    deadlineGroup.innerHTML = `
                        <label for="${deadlineGroupId}">Deadline</label>
                        <input type="date" id="${deadlineGroupId}" class="deadline-picker" value="${item.deadline || ''}">
                    `;
                    headerDiv.appendChild(deadlineGroup);
                    const deadlinePickerElement = deadlineGroup.querySelector(`#${deadlineGroupId}`);

                    // Fortschrittsanzeige (falls kein Endpunkt)
                    if (!isEndPoint) {
                        const progressSpan = document.createElement('span');
                        progressSpan.className = 'subitem-progress';
                        progressSpan.textContent = `${Math.round(subitemProgress)}%`;
                        headerDiv.appendChild(progressSpan);
                    }

                    // action-button-group (für "Unterpunkt hinzufügen")
                    const actionButtonsDiv = document.createElement('div');
                    actionButtonsDiv.className = 'action-button-group';
                    const addSubitemButtonElement = document.createElement('button');
                    addSubitemButtonElement.className = 'add-subitem';
                    addSubitemButtonElement.textContent = 'Unterpunkt hinzufügen';
                    actionButtonsDiv.appendChild(addSubitemButtonElement);
                    headerDiv.appendChild(actionButtonsDiv);

                    // Separater "Entfernen"-Button (gemäß Ihrer vorherigen Struktur)
                    const removeSubitemButtonElement = document.createElement('button');
                    removeSubitemButtonElement.className = 'remove-subitem';
                    removeSubitemButtonElement.textContent = 'Entfernen';
                    headerDiv.appendChild(removeSubitemButtonElement);

                    itemHtml.appendChild(headerDiv);

                    // Formular zum Hinzufügen neuer Unterpunkte
                    const subitemInputContainer = document.createElement('div');
                    subitemInputContainer.className = 'subitem-input'; // Ihre bestehende Klasse
                    const subitemNameInputForNew = document.createElement('input');
                    subitemNameInputForNew.type = 'text';
                    subitemNameInputForNew.className = 'subitem-name'; // Ihre bestehende Klasse
                    subitemNameInputForNew.placeholder = 'Unterpunkt-Name (z.B. Unteraufgabe)';
                    const confirmNewSubitemButtonElement = document.createElement('button');
                    confirmNewSubitemButtonElement.className = 'confirm-subitem'; // Ihre bestehende Klasse
                    confirmNewSubitemButtonElement.textContent = 'Hinzufügen';
                    subitemInputContainer.appendChild(subitemNameInputForNew);
                    subitemInputContainer.appendChild(confirmNewSubitemButtonElement);
                    itemHtml.appendChild(subitemInputContainer);

                    // Container für die Liste der Unterpunkte
                    let subitemListDisplayContainer = null;
                    if (!isEndPoint) {
                        subitemListDisplayContainer = document.createElement('div');
                        subitemListDisplayContainer.className = 'subitem-list';
                        itemHtml.appendChild(subitemListDisplayContainer);
                    }

                    parentElement.appendChild(itemHtml);

                    // Event-Listener für Deadline, Hinzufügen, Entfernen
                    deadlinePickerElement.addEventListener('change', () => {
                        const newDeadline = deadlinePickerElement.value || null;
                        function updateDeadlineRecursive(items, targetKey, deadlineValue) {
                            for (let current of items) {
                                if (current.key === targetKey) {
                                    current.deadline = deadlineValue;
                                    return true;
                                }
                                if (current.items && updateDeadlineRecursive(current.items, targetKey, deadlineValue)) return true;
                            }
                            return false;
                        }
                        updateDeadlineRecursive(my.tempList.items, item.key, newDeadline);
                        // Die alte `deadlineDisplay.textContent` Zeile war schon auskommentiert und wird nicht mehr benötigt.
                        renderPreview(my.tempList.key, my.tempList.items); // Neu rendern
                    });

                    addSubitemButtonElement.addEventListener('click', () => {
                        subitemInputContainer.classList.toggle('active');
                        subitemNameInputForNew.focus();
                    });

                    confirmNewSubitemButtonElement.addEventListener('click', () => {
                        const subitemName = subitemNameInputForNew.value.trim();
                        if (!subitemName) {
                            alert('Bitte geben Sie einen Namen für den Unterpunkt ein.');
                            return;
                        }
                        const newSubitemKey = `item_${subitemName.replace(/[^a-zA-Z0-9äöüß]/g, '_').toLowerCase()}_${Date.now()}`;
                        const newSubitemData = { key: newSubitemKey, name: subitemName, items: [], deadline: null };

                        function findParentAndAddRecursive(items, parentItemKey, childToAdd) {
                            for (let current of items) {
                                if (current.key === parentItemKey) {
                                    current.items.push(childToAdd);
                                    return true;
                                }
                                if (current.items && findParentAndAddRecursive(current.items, parentItemKey, childToAdd)) return true;
                            }
                            return false;
                        }
                        findParentAndAddRecursive(my.tempList.items, item.key, newSubitemData);

                        if (my.currentItems && Array.isArray(my.currentItems)) { // Sicherstellen, dass my.currentItems existiert
                            my.currentItems.push(newSubitemData);
                        }

                        renderPreview(my.tempList.key, my.tempList.items);
                        subitemNameInputForNew.value = '';
                        subitemInputContainer.classList.remove('active');
                    });

                    removeSubitemButtonElement.addEventListener('click', () => {
                        if (my.tempList.items.length === 1 && item.items.length === 0 && !parentKey) {
                            alert('Die Liste muss mindestens ein Listenobjekt enthalten.');
                            return;
                        }
                        function removeItemRecursive(items, targetKey) {
                            for (let i = 0; i < items.length; i++) {
                                if (items[i].key === targetKey) {
                                    items.splice(i, 1);
                                    return true;
                                }
                                if (items[i].items && removeItemRecursive(items[i].items, targetKey)) return true;
                            }
                            return false;
                        }
                        removeItemRecursive(my.tempList.items, item.key);

                        // my.currentItems aktualisieren (Ihre bestehende Logik, leicht angepasst)
                        if (my.currentItems && Array.isArray(my.currentItems)) {
                            function collectAllItemKeys(itemsArr, keysSet = new Set()) {
                                itemsArr.forEach(it => {
                                    keysSet.add(it.key);
                                    if (it.items) collectAllItemKeys(it.items, keysSet);
                                });
                                return keysSet;
                            }
                            const keysInTempList = collectAllItemKeys(my.tempList.items);
                            my.currentItems = my.currentItems.filter(ci => keysInTempList.has(ci.key));
                        }
                        renderPreview(my.tempList.key, my.tempList.items);
                    });

                    // Rekursiver Aufruf für Unterpunkte
                    if (!isEndPoint && subitemListDisplayContainer) {
                        item.items.forEach(subItem => {
                            renderPreviewItem(subItem, subitemListDisplayContainer, itemKey);
                        });
                    }
                }
                // Edit list
                this.editList = async (listKey) => {
                    my.tempList = {
                        key: listKey,
                        items: JSON.parse(JSON.stringify(my.listsData[listKey]))
                    };
                    my.currentItems = [];
                    previewList.innerHTML = '';

                    function populateCurrentItems(items) {
                        items.forEach(item => {
                            my.currentItems.push(item);
                            populateCurrentItems(item.items);
                        });
                    }
                    populateCurrentItems(my.tempList.items);

                    renderPreview(my.tempList.key, my.tempList.items);
                    listForm.style.display = 'block';
                };

                // Initialize state
                function initializeState(listKey, items, state = my.listState[listKey], parentKey = '') {
                    if (!state) {
                        state = { items: {}, collapsed: false };
                        my.listState[listKey] = state;
                    }
                    items.forEach(item => {
                        const itemKey = parentKey ? `${parentKey}_${item.key}` : item.key;
                        state.items[itemKey] = state.items[itemKey] || { checked: false, collapsed: false };
                        initializeState(listKey, item.items, state, itemKey);
                    });
                    console.log(`Initialized state for ${listKey}:`, JSON.stringify(state, null, 2));
                }

                // Calculate progress
                function calculateProgress(listKey, items, parentKey = '') {
                    let totalPoints = 0;
                    let checkedPoints = 0;

                    function countPoints(items, currentParentKey = '') {
                        items.forEach(item => {
                            const itemKey = currentParentKey ? `${currentParentKey}_${item.key}` : item.key;
                            if (item.items.length === 0) {
                                totalPoints++;
                                if (my.listState[listKey]?.items[itemKey]?.checked) {
                                    checkedPoints++;
                                }
                            } else {
                                countPoints(item.items, itemKey);
                            }
                        });
                    }

                    countPoints(items, parentKey);
                    return totalPoints > 0 ? (checkedPoints / totalPoints) * 100 : 0;
                }

                // Calculate subitem progress
                function calculateSubitemProgress(listKey, subitemKey, items, parentKey = '') {
                    let totalPoints = 0;
                    let checkedPoints = 0;

                    function countPoints(items, currentParentKey = '') {
                        items.forEach(item => {
                            const itemKey = currentParentKey ? `${currentParentKey}_${item.key}` : item.key;
                            if (item.items.length === 0) {
                                totalPoints++;
                                if (my.listState[listKey]?.items[itemKey]?.checked) {
                                    checkedPoints++;
                                }
                            } else {
                                countPoints(item.items, itemKey);
                            }
                        });
                    }

                    countPoints(items, parentKey);
                    const progress = totalPoints > 0 ? (checkedPoints / totalPoints) * 100 : 0;
                    return isNaN(progress) ? 0 : progress;
                }

                // Render lists
                async function renderLists(itemElement) {
                    try {
                        itemElement.innerHTML = '';
                        console.log('Rendering lists with data:', JSON.stringify(my.listsData, null, 2));

                        for (const key of Object.keys(my.listsData)) {
                            if (!my.listsData[key] || !Array.isArray(my.listsData[key])) {
                                console.warn(`Ungültige Daten für Liste ${key}, überspringe...`);
                                continue;
                            }
                            if (!my.listState[key]) {
                                console.log(`Initialisiere listState für ${key} in renderLists`);
                                my.listState[key] = { items: {}, collapsed: false };
                                initializeState(key, my.listsData[key], my.listState[key]);
                            }

                            //const listTitle = key.replace(/([A-Z])/g, ' $1').trim();
                            const listTitle = key
                            const listHtml = document.createElement('div');
                            listHtml.className = 'list-item';
                            listHtml.dataset.id = key;
                            listHtml.innerHTML = `
                                <div class="item-header">
                                    <h3>${listTitle}</h3>
                                    <div class="progress-prozent"></div>
                                    <div>
                                        <button class="edit-list">Bearbeiten</button>
                                        <button class="toggle-item">▼</button>
                                    </div>
                                </div>
                                <button class="delete-list">Löschen</button>
                                <div class="item-content">
                                    <div class="progress-bar">
                                        <div class="progress-fill"></div>
                                    </div>
                                    <div class="subitem-list"></div>
                                </div>
                            `;
                            itemElement.appendChild(listHtml);

                            const itemContent = listHtml.querySelector('.item-content');
                            const subitemList = listHtml.querySelector('.subitem-list');
                            const toggleButton = listHtml.querySelector('.toggle-item');
                            const editButton = listHtml.querySelector('.edit-list');
                            const deleteButton = listHtml.querySelector('.delete-list');

                            deleteButton.addEventListener('click', () => {
                                delete my.listsData[key];
                                delete my.listState[key];
                                itemElement.removeChild(listHtml);
                                self.store.set({ key: "checklist_data", listsData: my.listsData, listState: my.listState });
                            })

                            if (my.listState[key].collapsed) {
                                itemContent.style.display = 'none';
                                toggleButton.textContent = '▶';
                            }

                            toggleButton.addEventListener('click', async () => {
                                my.listState[key].collapsed = !my.listState[key].collapsed;
                                itemContent.style.display = my.listState[key].collapsed ? 'none' : 'block';
                                toggleButton.textContent = my.listState[key].collapsed ? '▶' : '▼';
                                await self.store.set({ key: "checklist_data", listsData: my.listsData, listState: my.listState });
                            });

                            editButton.addEventListener('click', () => self.editList(key));

                            my.listsData[key].forEach(item => {
                                renderItem(key, item, subitemList, itemContent, '');
                            });

                            const progress = calculateProgress(key, my.listsData[key]);
                            listHtml.querySelector('.progress-fill').style.width = `${Math.round(progress)}%`;
                            const progressProzent = listHtml.querySelector('.progress-prozent');
                            progressProzent.innerText =  `${Math.round(progress)}%`;
                            if (progress === 100) {
                                listHtml.classList.add('completed');
                            }
                        }
                    } catch (e) {
                        console.error("Fehler beim Rendern der Listen:", e);
                        itemElement.innerHTML = `<p>Error rendering lists: ${e.message}</p>`;
                    }
                }

                // Render item
                function renderItem(listKey, item, parentElement, listContent, parentKey) {
                    const itemKey = parentKey ? `${parentKey}_${item.key}` : item.key;
                    const isEndPoint = item.items.length === 0;
                    const subitemProgress = isEndPoint ? 0 : calculateSubitemProgress(listKey, itemKey, item.items, itemKey);

                    if (!my.listState[listKey]) {
                        console.log(`Initialisiere listState für ${listKey} in renderItem`);
                        my.listState[listKey] = { items: {}, collapsed: false };
                        initializeState(listKey, my.listsData[listKey], my.listState[listKey]);
                    }
                    if (!my.listState[listKey].items[itemKey]) {
                        console.log(`Initialisiere itemState für ${itemKey} in ${listKey}`);
                        my.listState[listKey].items[itemKey] = { checked: false, collapsed: false };
                    }

                    console.log('Rendering item:', { listKey, itemKey, isEndPoint, subitemProgress, item });

                    const itemHtml = document.createElement('div');
                    itemHtml.className = isEndPoint ? 'point-item' : 'subitem';
                    itemHtml.dataset.id = itemKey;
                    itemHtml.innerHTML = `
                        <div class="${isEndPoint ? 'point' : 'subitem'}-header">
                            <input type="checkbox" id="${itemKey}" class="${isEndPoint ? 'point' : 'subitem'}-checkbox">
                            <label for="${itemKey}" class="${isEndPoint ? 'point' : 'subitem'}-title">${item.name}</label>
                            <input type="date" class="deadline-picker" value="${item.deadline || ''}">


                            <!--<span class="deadline-display">${item.deadline ? `Fällig: ${formatDate(item.deadline)}` : ''}</span>-->
                            ${!isEndPoint ? `<span class="subitem-progress">${Math.round(subitemProgress)}%</span>` : ''}
                        </div>
                        ${!isEndPoint ? '<div class="subitem-list"></div>' : ''}
                    `;
                    parentElement.appendChild(itemHtml);

                    const checkbox = itemHtml.querySelector(`.${isEndPoint ? 'point' : 'subitem'}-checkbox`);
                    const subitemList = itemHtml.querySelector('.subitem-list');
                    const deadlinePicker = itemHtml.querySelector('.deadline-picker');
                    const deadlineDisplay = itemHtml.querySelector('.deadline-display');
                    checkbox.checked = my.listState[listKey].items[itemKey]?.checked || false;

                    deadlinePicker.addEventListener('change', async () => {
                        const newDeadline = deadlinePicker.value || null;
                        function updateDeadline(items) {
                            for (const currentItem of items) {
                                if (currentItem.key === item.key) {
                                    currentItem.deadline = newDeadline;
                                    return true;
                                }
                                if (updateDeadline(currentItem.items)) return true;
                            }
                            return false;
                        }
                        updateDeadline(my.listsData[listKey]);
                        deadlineDisplay.textContent = newDeadline ? `Fällig: ${formatDate(newDeadline)}` : '';
                        await self.store.set({ key: "checklist_data", listsData: my.listsData, listState: my.listState });
                    });

                    // Hilfsfunktion, um das DOM-Element anhand der ID zu finden
                    function parentElementForId(rootElement, itemId) {
                        return rootElement.querySelector(`.subitem[data-id="${itemId}"]`);
                    }

                    // Hilfsfunktion, um die direkten Kindelemente eines Elements in den Daten zu finden
                    function findChildItemsInData(items, targetKeyPart, currentParentKey) {
                        for (const item of items) {
                            const fullKey = currentParentKey ? `${currentParentKey}_${item.key}` : item.key;
                            const keyPart = fullKey.split('_').pop();
                            if (keyPart === targetKeyPart) {
                                return item.items;
                            }
                            const found = findChildItemsInData(item.items, targetKeyPart, fullKey);
                            if (found && found.length > 0) return found;
                        }
                        return [];
                    }

                    // Funktion, um den Status des übergeordneten Elements rekursiv zu aktualisieren
                    const updateParentState = (itemId, currentListKey, currentListContent) => {
                        const parts = itemId.split('_');
                        if (parts.length <= 3) return; // Oberste Ebene erreicht

                        parts.pop(); // Entfernt den Zeitstempel
                        parts.pop(); // Entfernt den Namen
                        parts.pop(); // Entfernt das "item" Präfix
                        const parentId = parts.join('_');
                        console.log("parent id: " + parentId);

                        const parentItemInState = my.listState[currentListKey].items[parentId];
                        const parentElementInDOM = parentElementForId(currentListContent, parentId);

                        if (parentItemInState && parentElementInDOM) {
                            const childItems = findChildItemsInData(my.listsData[currentListKey], parentId.split('_').pop(), parts.slice(0, -1).join('_'));

                            const allChildrenChecked = childItems.every(child => {
                                const childKeyInState = `${parentId}_${child.key}`;
                                return my.listState[currentListKey].items[childKeyInState]?.checked;
                            });

                            parentItemInState.checked = allChildrenChecked;
                            const parentCheckboxInDOM = parentElementInDOM.querySelector('.subitem-checkbox');

                            if (parentCheckboxInDOM) {
                                parentCheckboxInDOM.checked = allChildrenChecked;
                            }

                            // Aktualisiere die Fortschrittsanzeige des übergeordneten Elements
                            const parentProgressElement = parentElementInDOM.querySelector('.subitem-progress');
                            if (parentProgressElement) {
                                const parentSubitemProgress = calculateSubitemProgress(currentListKey, parentId, childItems, parentId);
                                parentProgressElement.textContent = `${Math.round(parentSubitemProgress)}%`;
                            }

                            updateParentState(parentId, currentListKey, currentListContent); // Rekursiv nach oben gehen
                        }
                    };

                  /*  checkbox.addEventListener('change', async () => {
                        my.listState[listKey].items[itemKey].checked = checkbox.checked;

                        console.log(`--- Checkbox Change in renderItem ---`);
                        console.log(`List Key: ${listKey}`);
                        console.log(`Item Key (für Status): ${itemKey}`);
                        console.log(`Item Name: ${item.name}`);
                        console.log(`Checkbox ist jetzt: ${checkbox.checked}`);
                        console.log(`Status in my.listState:`, my.listState[listKey].items[itemKey]);
                        console.log(`Gesamter listState für diese Liste (${listKey}):`, JSON.parse(JSON.stringify(my.listState[listKey]))); // Kopie für bessere Lesbarkeit
                        // DEBUGGING ENDE HIER ---------------------------------------

                        console.log(`Checkbox für ${itemKey} geändert. Neuer Zustand: ${my.listState[listKey].items[itemKey].checked}`);


                        console.log(`Checkbox für ${itemKey} geändert. Neuer Zustand: ${my.listState[listKey].items[itemKey].checked}`);

                        // If this is a parent item (not an endpoint), propagate the checked state to all subitems
                        if (!isEndPoint) {
                            updateSubitemPoints(listKey, item.items, itemKey, checkbox.checked);
                            subitemList.innerHTML = '';
                            item.items.forEach(subItem => {
                                renderItem(listKey, subItem, subitemList, listContent, itemKey);
                            });
                            const subitemProgress = calculateSubitemProgress(listKey, itemKey, item.items, itemKey);
                            const progressElement = itemHtml.querySelector('.subitem-progress');
                            if (progressElement) {
                                progressElement.textContent = `${Math.round(subitemProgress)}%`;
                            }
                        }

                        // Update parent checkboxes
                        updateParentState(itemKey, listKey, listContent);

                        // Update progress bar for the entire list
                        const progress = calculateProgress(listKey, my.listsData[listKey]);
                        listContent.querySelector('.progress-fill').style.width = `${progress}%`;
                        const progressProzent = listContent.previousElementSibling.querySelector('.progress-prozent');
                        console.log(progress);
                        if(progressProzent){
                            progressProzent.innerText = `${Math.round(progress)}%`;
                        }

                        const listItem = listContent.closest('.list-item');
                        if (progress === 100) {
                            listItem.classList.add('completed');
                        } else {
                            listItem.classList.remove('completed');
                        }

                        // Persist state to store
                        await self.store.set({ key: "checklist_data", listsData: my.listsData, listState: my.listState });
                    }); */

                    checkbox.addEventListener('change', async () => {
                        my.listState[listKey].items[itemKey].checked = checkbox.checked;

                        console.log(`Checkbox für ${itemKey} geändert. Neuer Zustand: ${my.listState[listKey].items[itemKey].checked}`);

                        // If this is a parent item (not an endpoint), propagate the checked state to all subitems
                        if (!isEndPoint) {
                            updateSubitemPoints(listKey, item.items, itemKey, checkbox.checked);
                            subitemList.innerHTML = '';
                            item.items.forEach(subItem => {
                                renderItem(listKey, subItem, subitemList, listContent, itemKey);
                            });
                            const subitemProgress = calculateSubitemProgress(listKey, itemKey, item.items, itemKey);
                            const progressElement = itemHtml.querySelector('.subitem-progress');
                            if (progressElement) {
                                progressElement.textContent = `${Math.round(subitemProgress)}%`;
                            }
                        }

                        // Update parent checkboxes and their progress
                        updateParentState(itemKey, listKey, listContent);

                        // Update progress bar and percentage for the entire list
                        const progress = calculateProgress(listKey, my.listsData[listKey]);
                        const listItem = listContent.closest('.list-item');
                        const progressFill = listContent.querySelector('.progress-fill');
                        const progressProzent = listItem.querySelector('.progress-prozent');

                        if (progressFill && progressProzent) {
                            progressFill.style.width = `${Math.round(progress)}%`;
                            progressProzent.innerText = `${Math.round(progress)}%`;
                        } else {
                            console.warn('Progress elements not found:', { progressFill, progressProzent });
                        }

                        // Update completed state
                        if (progress === 100) {
                            listItem.classList.add('completed');
                        } else {
                            listItem.classList.remove('completed');
                        }

                        // Persist state to store
                        await self.store.set({ key: "checklist_data", listsData: my.listsData, listState: my.listState });
                    });

                    if (!isEndPoint) {
                        item.items.forEach(subItem => {
                            renderItem(listKey, subItem, subitemList, listContent, itemKey);
                        });
                    }
                }
                // Update subitem points
                function updateSubitemPoints(listKey, items, parentKey, checked) {
                    items.forEach(item => {
                        const itemKey = `${parentKey}_${item.key}`;
                        if (my.listState[listKey].items[itemKey]) {
                            my.listState[listKey].items[itemKey].checked = checked;
                        }
                        updateSubitemPoints(listKey, item.items, itemKey, checked);
                    });
                }

                // Find items by key
                function findItems(items, targetKey) {
                    for (const item of items) {
                        if (item.key === targetKey) return [item];
                        const found = findItems(item.items, targetKey);
                        if (found.length > 0) return found;
                    }
                    return [];
                }

                // Initial render of lists
                await renderLists(itemElement);
            } catch (e) {
                console.error("Error in start method:", e);
                self.element.innerHTML = `<p>Error: ${e.message}. Check console for details.</p>`;
            }
        };
    }
};
