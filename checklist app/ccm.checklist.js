ccm.files["ccm.checklist.js"] = {
    name: "checklist",
    ccm: "../../libs/ccm/ccm.js",
    config: {
        store: ["ccm.store", { url: "https://ccm2.inf.h-brs.de", name: "tniede2s_checklist_data" }],
        css: ["ccm.load", "./style.css"],
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
                        <div class="item-section">
                            <h3>Hinzugefügte Listenobjekte</h3>
                            <ul id="item-list"></ul>
                        </div>
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
                const itemList = listForm.querySelector('#item-list');
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
                    itemList.innerHTML = '';
                    previewList.innerHTML = '';

                    const firstItemKey = `item_${firstItemName.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}_${Date.now()}`;
                    const firstItem = { key: firstItemKey, name: firstItemName, items: [], deadline: null };
                    my.tempList.items.push(firstItem);
                    my.currentItems.push(firstItem);

                    const li = document.createElement('li');
                    li.textContent = firstItemName;
                    itemList.appendChild(li);

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
                    itemList.innerHTML = '';
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
                    itemList.innerHTML = '';
                    previewList.innerHTML = '';
                    my.tempList = null;
                    my.currentItems = [];
                });

                // Render preview
                function renderPreview(listKey, items) {
                    previewList.innerHTML = '';
                    const listTitle = listKey.replace(/([A-Z])/g, ' $1').trim();
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
                        const subitemKey = `item_${subitemName.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}_${Date.now()}`;
                        const newSubitem = { key: subitemKey, name: subitemName, items: [], deadline: null };

                        my.tempList.items.push(newSubitem);
                        my.currentItems.push(newSubitem);
                        const li = document.createElement('li');
                        li.textContent = subitemName;
                        itemList.appendChild(li);

                        renderPreview(my.tempList.key, my.tempList.items);
                        subitemNameInput.value = '';
                        listInput.classList.remove('active');
                    });

                    items.forEach(item => {
                        renderPreviewItem(item, subitemList, '');
                    });
                }

                // Render preview item
                function renderPreviewItem(item, parentElement, parentKey) {
                    const itemKey = parentKey ? `${parentKey}_${item.key}` : item.key;
                    const isEndPoint = item.items.length === 0;
                    const subitemProgress = isEndPoint ? 0 : calculateSubitemProgress(my.tempList.key, itemKey, item.items, itemKey);

                    console.log('Rendering preview item:', { itemKey, isEndPoint, subitemProgress, item });

                    const itemHtml = document.createElement('div');
                    itemHtml.className = isEndPoint ? 'point-item' : 'subitem';
                    itemHtml.dataset.id = itemKey;
                    itemHtml.innerHTML = `
                        <div class="${isEndPoint ? 'point' : 'subitem'}-header">
                            <label class="${isEndPoint ? 'point' : 'subitem'}-title">${item.name}</label>
                            <input type="date" class="deadline-picker" value="${item.deadline || ''}">
                            <span class="deadline-display">${item.deadline ? `Fällig: ${formatDate(item.deadline)}` : ''}</span>
                            ${!isEndPoint ? `<span class="subitem-progress">${Math.round(subitemProgress)}%</span>` : ''}
                            <button class="add-subitem">Unterpunkt hinzufügen</button>
                            <button class="remove-subitem">Entfernen</button>
                        </div>
                        <div class="subitem-input">
                            <input type="text" class="subitem-name" placeholder="Unterpunkt-Name (z.B. Unteraufgabe)">
                            <button class="confirm-subitem">Hinzufügen</button>
                        </div>
                        ${!isEndPoint ? '<div class="subitem-list"></div>' : ''}
                    `;
                    parentElement.appendChild(itemHtml);

                    const subitemList = itemHtml.querySelector('.subitem-list');
                    const addSubitemButton = itemHtml.querySelector('.add-subitem');
                    const removeSubitemButton = itemHtml.querySelector('.remove-subitem');
                    const subitemInput = itemHtml.querySelector('.subitem-input');
                    const subitemNameInput = itemHtml.querySelector('.subitem-name');
                    const confirmSubitemButton = itemHtml.querySelector('.confirm-subitem');
                    const deadlinePicker = itemHtml.querySelector('.deadline-picker');
                    const deadlineDisplay = itemHtml.querySelector('.deadline-display');

                    deadlinePicker.addEventListener('change', () => {
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
                        updateDeadline(my.tempList.items);
                        deadlineDisplay.textContent = newDeadline ? `Fällig: ${formatDate(newDeadline)}` : '';
                        renderPreview(my.tempList.key, my.tempList.items);
                    });

                    addSubitemButton.addEventListener('click', () => {
                        subitemInput.classList.toggle('active');
                        subitemNameInput.focus();
                    });

                    confirmSubitemButton.addEventListener('click', () => {
                        const subitemName = subitemNameInput.value.trim();
                        if (!subitemName) {
                            alert('Bitte geben Sie einen Namen für den Unterpunkt ein.');
                            return;
                        }
                        const subitemKey = `item_${subitemName.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}_${Date.now()}`;
                        const newSubitem = { key: subitemKey, name: subitemName, items: [], deadline: null };

                        function findParent(items) {
                            for (const currentItem of items) {
                                if (currentItem.key === item.key) {
                                    currentItem.items.push(newSubitem);
                                    return true;
                                }
                                if (findParent(currentItem.items)) return true;
                            }
                            return false;
                        }
                        findParent(my.tempList.items);

                        my.currentItems.push(newSubitem);
                        const li = document.createElement('li');
                        li.textContent = `${parentKey ? '  ' : ''}${subitemName}`;
                        itemList.appendChild(li);

                        renderPreview(my.tempList.key, my.tempList.items);
                        subitemNameInput.value = '';
                        subitemInput.classList.remove('active');
                    });

                    removeSubitemButton.addEventListener('click', () => {
                        if (my.tempList.items.length === 1 && item.items.length === 0 && !parentKey) {
                            alert('Die Liste muss mindestens ein Listenobjekt enthalten.');
                            return;
                        }

                        function removeItem(items, targetKey) {
                            for (let i = 0; i < items.length; i++) {
                                if (items[i].key === targetKey) {
                                    items.splice(i, 1);
                                    return true;
                                }
                                if (removeItem(items[i].items, targetKey)) return true;
                            }
                            return false;
                        }
                        removeItem(my.tempList.items, item.key);

                        function collectKeys(items, keys = []) {
                            items.forEach(it => {
                                keys.push(parentKey ? `${parentKey}_${it.key}` : it.key);
                                collectKeys(it.items, keys);
                            });
                            return keys;
                        }
                        const keysToRemove = collectKeys([item], parentKey ? [parentKey] : []);
                        my.currentItems = my.currentItems.filter(it => !keysToRemove.includes(parentKey ? `${parentKey}_${it.key}` : it.key));

                        itemList.innerHTML = '';
                        my.currentItems.forEach(it => {
                            const li = document.createElement('li');
                            li.textContent = it.name;
                            itemList.appendChild(li);
                        });
                        renderPreview(my.tempList.key, my.tempList.items);
                    });

                    if (!isEndPoint) {
                        item.items.forEach(subItem => {
                            renderPreviewItem(subItem, subitemList, itemKey);
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
                    itemList.innerHTML = '';
                    previewList.innerHTML = '';

                    function populateCurrentItems(items) {
                        items.forEach(item => {
                            my.currentItems.push(item);
                            populateCurrentItems(item.items);
                        });
                    }
                    populateCurrentItems(my.tempList.items);

                    my.currentItems.forEach(item => {
                        const li = document.createElement('li');
                        li.textContent = item.name;
                        itemList.appendChild(li);
                    });

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

                            const listTitle = key.replace(/([A-Z])/g, ' $1').trim();
                            const listHtml = document.createElement('div');
                            listHtml.className = 'list-item';
                            listHtml.dataset.id = key;
                            listHtml.innerHTML = `
                                <div class="item-header">
                                    <h3>${listTitle}</h3>
                                    <div>
                                        <button class="edit-list">Bearbeiten</button>
                                        <button class="toggle-item">▼</button>
                                    </div>
                                </div>
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
                            listHtml.querySelector('.progress-fill').style.width = `${progress}%`;
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
                            <span class="deadline-display">${item.deadline ? `Fällig: ${formatDate(item.deadline)}` : ''}</span>
                            ${!isEndPoint ? `<span class="subitem-progress">${Math.round(subitemProgress)}%</span>` : ''}
                        </div>
                        ${!isEndPoint ? '<div class="subitem-list"></div>' : ''}
                    `;
                    parentElement.appendChild(itemHtml);

                    const checkbox = itemHtml.querySelector(`.${isEndPoint ? 'point' : 'subitem'}-checkbox`);
                    const subitemList = itemHtml.querySelector('.subitem-list');
                    const deadlinePicker = itemHtml.querySelector('.deadline-picker');
                    const deadlineDisplay = itemHtml.querySelector('.deadline-display');
                    checkbox.checked = my.listState[listKey].items[itemKey] ? my.listState[listKey].items[itemKey].checked : false;

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

                    checkbox.addEventListener('change', async () => {
                        my.listState[listKey].items[itemKey].checked = checkbox.checked;
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
                        const progress = calculateProgress(listKey, my.listsData[listKey]);
                        listContent.querySelector('.progress-fill').style.width = `${progress}%`;
                        const listItem = listContent.closest('.list-item');
                        if (progress === 100) {
                            listItem.classList.add('completed');
                        } else {
                            listItem.classList.remove('completed');
                        }

                        let currentElement = itemHtml.parentElement;
                        let currentKey = itemKey;
                        while (currentElement.classList.contains('subitem-list') && currentElement.parentElement.classList.contains('subitem')) {
                            currentElement = currentElement.parentElement;
                            const subitemKey = currentElement.dataset.id;
                            const subitemItems = findItems(my.listsData[listKey], subitemKey.split('_').pop());
                            const subitemProgress = calculateSubitemProgress(listKey, subitemKey, subitemItems, subitemKey);
                            const progressElement = currentElement.querySelector('.subitem-progress');
                            if (progressElement) {
                                progressElement.textContent = `${Math.round(subitemProgress)}%`;
                            }
                            const allChecked = subitemItems.every(subItem => my.listState[listKey].items[`${subitemKey}_${subItem.key}`].checked);
                            my.listState[listKey].items[subitemKey].checked = allChecked;
                            const subitemCheckbox = currentElement.querySelector('.subitem-checkbox');
                            if (subitemCheckbox) {
                                subitemCheckbox.checked = allChecked;
                            }
                        }

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
