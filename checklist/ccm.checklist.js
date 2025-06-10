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
        store: ["ccm.store", {url: "https://ccm2.inf.h-brs.de", name: "tniede2s_checklist_data"}],
        css: ["ccm.load", "./resources/style.css"],
        text: {
            previewListText: "Vorschau der Listee",
            listName: "Listen-Name (z.B. Projekt 2024)",
            firstItemName: "Erstes Listenobjekt (z.B. Aufgabe 1)",
            listCreateButtonText: "Liste erstellen",
            saveListText: "Liste speichern",
            myListText: "Meine Listen",
            cancelText: "Abbrechen",
            addListObjectText: "Listenobjekt hinzufügen",
            addText: "Hinzufügen",
            secondItemNameText: "Objekt-Name (z.B. Aufgabe 2)",
            addSubpointText: "Unterpunkt hinzufügen",
            deadlineText: "Fälligkeitsdatum",
            removeText: "Enfernen",
            subPointText: 'Unterpunkt-Name (z.B. Unteraufgabe)',
            editText: "Bearbeiten",
            deleteText: "Löschen",
            saveText: "Speichern",
            writeNoteText: "Notiz eingeben..."
        },
        helper: ["ccm.load", "https://ccmjs.github.io/akless-components/modules/versions/helper-7.2.0.mjs"],
        html: {
            main: `
                <div class="container">
                    <h1>%myListText%</h1>
                    <div class="create-list">
                        <input type="text" id="list-name" placeholder="%listName%">
                        <input type="text" id="first-item-name" placeholder="%firstItemNameText%">
                        <button id="start-create" onclick="%onStartCreateButton%">%listCreateButtonText%</button>
                    </div>
                    <div class="list-form" style="display: none;">
                        <div class="preview-section">
                            <h3>%previewListText%</h3>
                            <div id="preview-list"></div>
                        </div>
                        <button id="save-list" onclick="%onSaveListButton%">%saveListText%</button>
                        <button class="cancel-button" onclick="%onCancelListButton%">%cancelText%</button>
                    </div>
                    <div id="items"></div>
                </div>`,
            previewList: `
                <div class="item-header">
                    <h3>%listTitle%</h3>
                </div>
                <div class="item-content">
                    <div class="subitem-list"></div>
                    <button class="add-subitem" onclick="%onAddSubmitItem%">%addListObject%</button>
                    <div class="list-input">
                        <input type="text" class="list-item-name" placeholder="%secondItemName%">
                        <button class="confirm-subitem" onclick="%onConfirmSubitem%">%addText%</button>
                    </div>
                </div>`,
            renderpreviewList: `
               <div class='%isEndpoint%' id=%itemKey%>
                    <div class='%isEnpointHeader%'>
                        <div class='title-edit-wrapper'>
                            <button class='edit-item-name-btn' title='Namen bearbeiten' onclick=%editName%>&#9998;</button> <p class='%isEndpointTitle%'>%itemName%</p>
                            <div class='item-name-edit-form' style="display: none;"> <input type="text" class='item-name-input-field' /> <button class='save-item-name-btn' onclick=%saveItemName%>OK</button>
                                <button class='cancel-item-name-btn' onclick=%cancelNameButton%>X</button>
                            </div>
                        </div>
                    </div>
                    <div class="deadline-group"> <label for="%deadlineGroupId%">%deadlineText%</label>
                        <input type="date" id="%deadlineGroupId%" class="deadline-picker" value="%deadlinePickerValue%" onchange="%onDeadlineChange%" /> %progressSpanHTML%
                    </div>
                    <div class='action-button-group'>
                        <button class='add-subitem' onclick='%onAddSubitem%'>
                            %addSubpointText% </button>
                        <button class='remove-subitem' onclick='%onRemoveSubitem%'>%removeText%</button>
                    </div>
                    <div class='subitem-input'>
                        <input type='text' class='subitem-name' placeholder= "%subPointName%"/> <button class='confirm-subitem' onclick="%confirmSubitem%">Hinzufügen</button>
                    </div>
                    <div class="subitem-list-children"></div>
                </div>`,
            renderList: `
                <div class="item-header">
                    <h3>%listTitle%</h3>
                    <div class="progress-prozent"></div>
                        <div>
                            <button class="edit-list" onclick=%onEditButton%>%editText%</button>
                            <button class="delete-list" onclick=%onDeledeButton%>%deleteText%</button>
                        </div>
                    </div>
                    <button class="toggle-item" onclick=%onClickToggelButton%>▼</button>      
                    <div class="item-content">
                        <div class="progress-bar">
                            <div class="progress-fill"></div>
                        </div>
                    <div class="subitem-list"></div>
                </div>`,
            renderItem: `
                <div class="%isEndPoint%" id=%itemKey%>
                    <div class="%isEndPoint%--header">
                        <input type="checkbox" id="%itemKey%" class="%isEndPoint%--checkbox" checked="%checkboxChecked%" onchange="%onCheckboxChange%" >
                        <label for="%itemKey%" class="%isEndPoint%--title">%itemName%</label>
                        <input type="date" class="deadline-picker" value=%itemDeadline% onchange="%onDeadlinePicker%">
                            %subitemProgress%
                    </div>
    
                    <div class="note-container">
                    <p class="%subItemNodeClass%">%noteShow%</p>
                    <button class="edit-note-btn" title="%noteTitle%" onclick=%onEditeNode%>✎</button>
    
                    <div class="note-edit-form" style="display: none;">
                        <textarea class="note-input" rows="3" placeholder="%writeNoteText%">%itemNote%</textarea>
                        <button class="save-note-btn" onclick="%onSaveNoteButton%">%saveText%</button>
                        <button class="cancel-note-btn" onclick="%onCancelNoteBtn%">%cancelText%</button>
                    </div>
                    %subItemList%   
                </div>`,
        }
    },
    Instance: function () {
        let self = this;
        let my;

        this.init = async () => {
            try {
                my = await self.store.get("checklist_data") || {listsData: {}, listState: {}};
                my.listsData = my.listsData || {};
                my.listState = my.listState || {};
                my.tempList = null;
                my.currentItems = [];

                Object.keys(my.listsData).forEach(listKey => {
                    ensureNotesField(my.listsData[listKey]);

                    if (!my.listState[listKey]) {
                        console.log(`Initialisiere listState für ${listKey}`);
                        my.listState[listKey] = {items: {}, collapsed: false};
                        initializeState(listKey, my.listsData[listKey], my.listState[listKey]);
                    }
                });
                $ = Object.assign({}, this.ccm.helper, this.helper);
                $.use(this.ccm);

                console.log("Initialized store:", JSON.stringify(my, null, 2));
            } catch (e) {
                console.error("Failed to initialize store:", e);
                self.element.innerHTML = `<p>Error initializing store: ${e.message}</p>`;
            }
        };

        this.events = {
            onAddSubitem: (itemKey, event) => {
                if (event) event.stopPropagation();
                console.log("onAddSubitem called for itemKey:", itemKey);
                const currentItemRenderedRoot = self.element.querySelector(`#${itemKey}`);

                if (!currentItemRenderedRoot) {
                    console.error(`onAddSubitem: Element mit ID '${itemKey}' nicht gefunden!`);
                    return;
                }

                const subitemInputContainer = currentItemRenderedRoot.querySelector('.subitem-input');
                if (!subitemInputContainer) {
                    console.error(`onAddSubitem: '.subitem-input' nicht in Element mit ID '${itemKey}' gefunden.`);
                    return;
                }

                subitemInputContainer.classList.toggle('active');
                const subitemNameInputForNew = subitemInputContainer.querySelector('.subitem-name');
                if (subitemNameInputForNew) {
                    subitemNameInputForNew.focus();
                } else {
                    console.error(`onAddSubitem: '.subitem-name' Input nicht im subitemInputContainer für itemKey '${itemKey}' gefunden.`);
                }
            },
            onStartCreateButton: (createListForm, listForm, previewList) => {
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
                const firstItem = {key: firstItemKey, name: firstItemName, items: [], deadline: null};
                my.tempList.items.push(firstItem);
                my.currentItems.push(firstItem);

                renderPreview(my.tempList.key, my.tempList.items);

                listForm.style.display = 'block';
                createListForm.querySelector('#list-name').value = '';
                createListForm.querySelector('#first-item-name').value = '';
            },
            onSaveListButton: async (listForm, previewList, itemElement) => {
                if (!my.tempList || my.tempList.items.length === 0) {
                    alert('Die Liste muss mindestens ein Listenobjekt enthalten.');
                    return;
                }

                my.listsData[my.tempList.key] = my.tempList.items;
                if (!my.listState[my.tempList.key]) {
                    my.listState[my.tempList.key] = {items: {}, collapsed: false};
                }
                initializeState(my.tempList.key, my.tempList.items, my.listState[my.tempList.key]);

                self.store.set({key: "checklist_data", listsData: my.listsData, listState: my.listState})
                    .then(() => console.log('Daten erfolgreich gespeichert:', my))
                    .catch(e => {
                        console.error('Fehler beim Speichern:', e);
                        alert('Fehler beim Speichern der Liste. Bitte überprüfe die Konsole.');
                    });

                await renderLists(itemElement);

                listForm.style.display = 'none';
                previewList.innerHTML = '';
                my.tempList = null;
                my.currentItems = [];
            },
            onCancelListButton: (listForm, previewList) => {
                listForm.style.display = 'none';
                my.tempList = null;
                my.currentItems = [];
                previewList.innerHTML = '';
            },
            onAddSubmitItem: () => {
                const listInput = self.element.querySelector('.list-input');
                listInput.classList.toggle('active');
                const subitemNameInput = self.element.querySelector('.list-item-name');
                subitemNameInput.focus();
            },
            onConfirmSubitem: (listInput) => {
                const subitemNameInput = self.element.querySelector('.list-item-name');
                const subitemName = subitemNameInput.value.trim();
                if (!subitemName) {
                    alert('Bitte geben Sie einen Namen für das Listenobjekt ein.');
                    return;
                }
                const subitemKey = `item_${subitemName.replace(/[^a-zA-Z0-9äöüß]/g, '_').toLowerCase()}_${Date.now()}`;
                const newSubitem = {key: subitemKey, name: subitemName, items: [], deadline: null};

                my.tempList.items.push(newSubitem);
                my.currentItems.push(newSubitem);
                console.log('New item added:', newSubitem);
                console.log('Updated tempList:', JSON.stringify(my.tempList, null, 2));
                console.log('Updated currentItems:', JSON.stringify(my.currentItems, null, 2));

                renderPreview(my.tempList.key, my.tempList.items);
                subitemNameInput.value = '';
                listInput.classList.remove('active');
            },
            confirmSubitem: (itemKey, item, event) => {
                if (event) event.stopPropagation();
                const currentItemRenderedRoot = self.element.querySelector(`#${itemKey}`);

                if (!currentItemRenderedRoot) {
                    console.error(`confirmSubitem: Element mit ID '${itemKey}' nicht gefunden!`);
                    return;
                }

                const subitemInputContainer = currentItemRenderedRoot.querySelector('.subitem-input');
                if (!subitemInputContainer) {
                    console.error(`confirmSubitem: '.subitem-input' nicht in Element mit ID '${itemKey}' gefunden.`);
                    console.log("Inhalt von currentItemRenderedRoot (ID: " + itemKey + "):", currentItemRenderedRoot.innerHTML);
                    return;
                }

                const subitemNameInputForNew = subitemInputContainer.querySelector('.subitem-name');
                if (!subitemNameInputForNew) {
                    console.error(`confirmSubitem: '.subitem-name' Input nicht im subitemInputContainer für itemKey '${itemKey}' gefunden.`);
                    return;
                }

                const subitemName = subitemNameInputForNew.value.trim();
                if (!subitemName) {
                    alert('Bitte geben Sie einen Namen für den Unterpunkt ein.');
                    subitemNameInputForNew.focus();
                    return;
                }

                const newSubitemKey = `subitem_${subitemName.replace(/[^a-zA-Z0-9äöüß]/g, '_').toLowerCase()}_${Date.now()}`;
                const newSubitem = {key: newSubitemKey, name: subitemName, items: [], deadline: null, note: ""};

                if (!item.items) {
                    item.items = [];
                }
                item.items.push(newSubitem);

                renderPreview(my.tempList.key, my.tempList.items);
                subitemNameInputForNew.value = '';
                subitemInputContainer.classList.remove('active');
            },
            saveItemName: (event) => {
                event.stopPropagation();
                const newName = nameInput.value.trim();
                if (newName && newName !== item.name) {
                    if (updateItemNameInTempList(my.tempList.items, item.key, newName)) {
                        renderPreview(my.tempList.key, my.tempList.items);
                    } else {
                        console.error(`Konnte Item mit Key ${item.key} zum Umbenennen nicht in tempList finden.`);
                        // hier varaiablen die da sind
                        nameEditForm.style.display = 'none';
                        titleDisplay.style.display = '';
                        editNameIcon.style.display = '';
                    }
                } else if (!newName) {
                    alert('Der Item-Name darf nicht leer sein.');
                    nameInput.focus();
                } else {
                    nameEditForm.style.display = 'none';
                    titleDisplay.style.display = '';
                    editNameIcon.style.display = '';
                }
            },
            cancelNameButton: () => {
                // hier auch
                e.stopPropagation();
                nameEditForm.style.display = 'none';
                titleDisplay.style.display = '';
                editNameIcon.style.display = '';
            },
            onRemoveSubitem: (item, parentKey) => {
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
            },
            onDeadlineChange: (event, item) => {
                if (event) event.stopPropagation();
                const newDeadline = event.target.value || null;

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

                if (updateDeadlineRecursive(my.tempList.items, item.key, newDeadline)) {
                    renderPreview(my.tempList.key, my.tempList.items); // Re-render preview to reflect changes
                }
            }
        }

        this.start = async () => {
            try {
                const itemHtml = document.createElement('div');

                $.setContent(itemHtml, $.html(self.html.main, {
                    previewListText: self.text.previewListText,
                    firstItemNameText: self.text.firstItemName,
                    listName: self.text.listName,
                    listCreateButtonText: self.text.listCreateButtonText,
                    saveListText: self.text.saveListText,
                    myListText: self.text.myListText,
                    cancelText: self.text.cancelText,
                    onStartCreateButton: () => self.events.onStartCreateButton(createListForm, listForm, previewList),
                    onSaveListButton: () => self.events.onSaveListButton(listForm, previewList, itemElement),
                    onCancelListButton: () => self.events.onCancelListButton(listForm, previewList),
                }));
                $.append(self.element, itemHtml);

                const createListForm = self.element.querySelector('.create-list');
                const listForm = self.element.querySelector('.list-form');
                const previewList = self.element.querySelector('#preview-list');
                const itemElement = self.element.querySelector('#items');

                await renderLists(itemElement, previewList);
            } catch (e) {
                console.error("Error in start method:", e);
                self.element.innerHTML = `<p>Error: ${e.message}. Check console for details.</p>`;
            }
        };

        function ensureNotesField(items) {
            items.forEach(item => {
                if (!Object.prototype.hasOwnProperty.call(item, 'note')) {
                    item.note = "";
                }
                if (item.items && item.items.length > 0) {
                    ensureNotesField(item.items);
                }
            });
        }

        function formatDate(isoDate) {
            if (!isoDate) return '';
            const date = new Date(isoDate);
            return date.toLocaleDateString('de-DE', {day: '2-digit', month: '2-digit', year: 'numeric'});
        }

        function renderPreview(listKey, items) {
            const previewList = self.element.querySelector('#preview-list');
            previewList.innerHTML = '';
            const listTitle = listKey;
            const listHtml = document.createElement('div');
            listHtml.className = 'list-item';

            $.setContent(listHtml, $.html(self.html.previewList, {
                listTitle: listTitle,
                dataItemId: "1",
                addListObject: self.text.addListObjectText,
                addText: self.text.addText,
                secondItemName: self.text.secondItemNameText,
                onAddSubmitItem: () => self.events.onAddSubmitItem(),
                onConfirmSubitem: () => self.events.onConfirmSubitem(listInput),
            }));
            $.append(previewList, listHtml);

            const listInput = listHtml.querySelector('.list-input');

            items.forEach(item => {
                console.log('Rendering item in preview:', item);
                renderPreviewItem(item, listHtml.querySelector('.subitem-list'), '');
            });
        }

        function updateItemNameInTempList(itemsArray, targetItemKey, updatedName) {
            for (let i = 0; i < itemsArray.length; i++) {
                if (itemsArray[i].key === targetItemKey) {
                    itemsArray[i].name = updatedName;
                    return true;
                }
                if (itemsArray[i].items && itemsArray[i].items.length > 0) {
                    if (updateItemNameInTempList(itemsArray[i].items, targetItemKey, updatedName)) {
                        return true;
                    }
                }
            }
            return false;
        }
//todo
        function renderPreviewItem(item, parentElement, parentKey) {
            const itemKey = parentKey ? `${parentKey}_${item.key}` : item.key;
            const isEndPoint = item.items.length === 0;
            const subitemProgress = isEndPoint ? 0 : calculateSubitemProgress(my.tempList.key, itemKey, item.items, itemKey);
            const deadlineGroupId = `deadline_preview_${itemKey.replace(/\W/g, '_')}`;

            console.log('Rendering preview item (editable name):', {
                itemKey,
                isEndPoint,
                subitemProgress,
                item
            });

            const itemHtml = document.createElement('div');
            itemHtml.className = isEndPoint ? 'point-item' : 'subitem';
            itemHtml.dataset.id = itemKey;

            $.setContent(itemHtml, $.html(self.html.renderpreviewList, {
                itemKey: itemKey,
                isEndPointHeader: `${isEndPoint ? 'point' : 'subitem'}-header`,
                addSubpointText: self.text.addSubpointText,
                isEndPoint: isEndPoint ? 'point-item' : 'subitem',
                deadlineGroupId: deadlineGroupId,
                deadlineText: self.text.deadlineText,
                removeText: self.text.removeText,
                subPointName: self.text.subPointName,
                progressSpanHTML: !isEndPoint ? `<span class="subitem-progress">${Math.round(subitemProgress)}%</span>` : '',
                itemName: item.name,
                deadlinePickerValue: item.deadline || '',
                onAddSubitem: () => self.events.onAddSubitem(itemKey),
                confirmSubitem: () => self.events.confirmSubitem(itemKey, item),
                saveItemName: () => self.events.saveItemName(itemKey),
                cancelNameButton: () => self.events.cancelNameButton(itemKey),
                onRemoveSubitem: () => self.events.onRemoveSubitem(item, parentKey),
                onDeadlineChange: (event) => self.events.onDeadlineChange(event, item),
            }))

            $.append(parentElement, itemHtml)

            // Recursive Call for Sub-items
            if (!isEndPoint) {
                const subitemListDisplayContainer = itemHtml.querySelector('.subitem-list-children');
                if (subitemListDisplayContainer) {
                    console.log(`Item '${item.name}' (Key: ${itemKey}) hat ${item.items.length} Sub-Items. Rufe Rekursion auf.`);
                    item.items.forEach(subItem => {
                        console.log(`  -> Rekursiver Aufruf für Sub-Item:`, JSON.parse(JSON.stringify(subItem)), `ParentKey für Rekursion: ${itemKey}`);
                        renderPreviewItem(subItem, subitemListDisplayContainer, itemKey);
                    });
                }
            }
        }

        function initializeState(listKey, items, state = my.listState[listKey], parentKey = '') {
            if (!state) {
                state = {items: {}, collapsed: false};
                my.listState[listKey] = state;
            }
            items.forEach(item => {
                const itemKey = parentKey ? `${parentKey}_${item.key}` : item.key;
                state.items[itemKey] = state.items[itemKey] || {checked: false, collapsed: false};
                initializeState(listKey, item.items, state, itemKey);
            });
            console.log(`Initialized state for ${listKey}:`, JSON.stringify(state, null, 2));
        }
//todo
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
//todo
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

//todo
        async function renderLists(itemElement, previewList) {
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
                        my.listState[key] = {items: {}, collapsed: false};
                        initializeState(key, my.listsData[key], my.listState[key]);
                    }

                    const listTitle = key;
                    const listHtml = document.createElement('div');
                    listHtml.className = 'list-item';
                    listHtml.dataset.id = key;


                    $.setContent(listHtml, $.html(self.html.renderList, {
                        listTitle: listTitle,
                        deleteText: self.text.deleteText,
                        editText: self.text.editText,
                        onDeledeButton: () => {
                            delete my.listsData[key];
                            delete my.listState[key];
                            itemElement.removeChild(listHtml);
                            self.store.set({
                                key: "checklist_data",
                                listsData: my.listsData,
                                listState: my.listState
                            });
                        },
                        onClickToggelButton: () => {
                            my.listState[key].collapsed = !my.listState[key].collapsed;
                            itemContent.style.display = my.listState[key].collapsed ? 'none' : 'block';
                            toggleButton.textContent = my.listState[key].collapsed ? '▶' : '▼';
                            self.store.set({
                                key: "checklist_data",
                                listsData: my.listsData,
                                listState: my.listState
                            });
                        },

                        onEditButton: () => this.self.editList(key, previewList), // Hier wird die editList-Funktion aufgerufen

                    }));

                    this.editList = async (listKey, previewList) => {
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
                        const listForm = self.element.querySelector('.list-form');
                        listForm.style.display = 'block';
                    };


                    itemElement.appendChild(listHtml);

                    const itemContent = listHtml.querySelector('.item-content');
                    const subitemList = listHtml.querySelector('.subitem-list');
                    const toggleButton = listHtml.querySelector('.toggle-item');
                    const editButton = listHtml.querySelector('.edit-list');

                    if (my.listState[key].collapsed) {
                        itemContent.style.display = 'none';
                        toggleButton.textContent = '▶';
                    }

                    my.listsData[key].forEach(item => {
                        renderItem(key, item, subitemList, itemContent, '');
                    });

                    const progress = calculateProgress(key, my.listsData[key]);
                    listHtml.querySelector('.progress-fill').style.width = `${Math.round(progress)}%`;
                    const progressProzent = listHtml.querySelector('.progress-prozent');
                    progressProzent.innerText = `${Math.round(progress)}%`;
                    if (progress === 100) {
                        listHtml.classList.add('completed');
                    }
                }
            } catch (e) {
                console.error("Fehler beim Rendern der Listen:", e);
                itemElement.innerHTML = `<p>Error rendering lists: ${e.message}</p>`;
            }
        }
//todo
        function renderItem(listKey, item, parentElement, listContent, parentKey) {
            const itemKey = parentKey ? `${parentKey}_${item.key}` : item.key;
            const isEndPoint = item.items.length === 0;
            const subitemProgress = isEndPoint ? 0 : calculateSubitemProgress(listKey, itemKey, item.items, itemKey);

            if (!my.listState[listKey]) {
                console.log(`Initialisiere listState für ${listKey} in renderItem`);
                my.listState[listKey] = {items: {}, collapsed: false};
                initializeState(listKey, my.listsData[listKey], my.listState[listKey]);
            }
            if (!my.listState[listKey].items[itemKey]) {
                console.log(`Initialisiere itemState für ${itemKey} in ${listKey}`);
                my.listState[listKey].items[itemKey] = {checked: false, collapsed: false};
            }
            console.log('Rendering item:', {listKey, itemKey, isEndPoint, subitemProgress, item});
            const isEndpointSubitem = isEndPoint ? 'point-item' : 'subitem'


            const itemHtml = document.createElement('div');
            itemHtml.className = isEndPoint ? 'point-item' : 'subitem';
            itemHtml.dataset.id = itemKey;

            $.setContent(itemHtml, $.html(self.html.renderItem, {
                isEndPoint: isEndPoint ? 'point' : 'subitem',
                itemName: item.name,
                saveText: self.text.saveText,
                cancelText: self.text.cancelText,
                writeNoteText: self.text.writeNoteText,
                itemKey: itemKey,
                itemDeadline: item.deadline || '',
                itemDeadlineFaellig: item.deadline ? `Fällig: ${formatDate(item.deadline)}` : '',
                subitemProgress: !isEndPoint ? ('<span class="subitem-progress">' + Math.round(subitemProgress) + '</span>') : '',
                subItemNodeClass: item.node ? 'subitem-node' : 'subitem-note-placeholder',
                noteShow: item.note ? item.note : 'Noch keine Notiz vorhanden',
                noteTitle: item.note ? 'Notiz bearbeiten' : 'Notiz hinzufügen',
                itemNote: item.note || '',
                subItemList: !isEndPoint ? '<div class="subitem-list"></div>' : '',
                checkboxChecked: my.listState[listKey].items[itemKey]?.checked ? true : false,


                onEditeNode: (e) => {
                    e.stopPropagation();
                    const nodeContainer = itemHtml.querySelector('.note-container');
                    const nodeDisplay = nodeContainer.querySelector('.subitem-node');
                    const nodePlaceholder = nodeContainer.querySelector('.subitem-note-placeholder');
                    const editNodeBtn = nodeContainer.querySelector('.edit-note-btn');
                    const nodeEditForm = nodeContainer.querySelector('.note-edit-form');
                    const nodeInput = nodeEditForm.querySelector('.note-input');

                    if (nodeDisplay) nodeDisplay.style.display = 'none';
                    if (nodePlaceholder) nodePlaceholder.style.display = 'none';
                    editNodeBtn.style.display = 'none';
                    nodeEditForm.style.display = 'block';
                    nodeInput.focus();
                },
                onSaveNoteButton: (e) => {
                    e.stopPropagation();
                    const newNote = noteInput.value.trim();

                    function updateNote(items, targetKey, updatedNote) {
                        for (let current of items) {
                            if (current.key === targetKey) {
                                current.note = updatedNote;
                                return true;
                            }
                            if (current.items && updateNote(current.items, targetKey, updatedNote)) return true;
                        }
                        return false;
                    }

                    updateNote(my.listsData[listKey], item.key, newNote);

                    const noteContainer = noteEditForm.parentElement;
                    const currentNoteDisplay = noteContainer.querySelector('.subitem-note');
                    const currentNotePlaceholder = noteContainer.querySelector('.subitem-note-placeholder');

                    noteEditForm.style.display = 'none';
                    editNoteBtn.style.display = '';

                    if (newNote) {
                        if (currentNoteDisplay) {
                            currentNoteDisplay.textContent = newNote;
                            currentNoteDisplay.style.display = '';
                        } else if (currentNotePlaceholder) {
                            const newNoteDisplay = document.createElement('p');
                            newNoteDisplay.className = 'subitem-note';
                            newNoteDisplay.textContent = newNote;
                            noteContainer.insertBefore(newNoteDisplay, editNoteBtn);
                            currentNotePlaceholder.remove();
                        }
                    } else {
                        if (currentNoteDisplay) {

                            const newPlaceholder = document.createElement('p');
                            newPlaceholder.className = 'subitem-note-placeholder';
                            newPlaceholder.textContent = 'Notiz hinzufügen';
                            noteContainer.insertBefore(newPlaceholder, editNoteBtn);
                            currentNoteDisplay.remove();
                        } else if (currentNotePlaceholder) {
                            currentNotePlaceholder.style.display = '';
                        }
                    }
                    self.store.set({key: "checklist_data", listsData: my.listsData, listState: my.listState});
                },
                onCancelNoteBtn: (e) => {
                    e.stopPropagation();
                    noteEditForm.style.display = 'none';
                    editNoteBtn.style.display = '';
                    if (item.note) {
                        if (noteDisplay) noteDisplay.style.display = '';
                    } else {
                        if (notePlaceholder) notePlaceholder.style.display = '';
                    }
                },
                onDeadlinePicker: (e) => {
                    const newDeadline = e.target.value || null;

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
                    //const deadlineDisplay = itemHtml.querySelector('.deadline-display');
                    //deadlineDisplay.textContent = newDeadline ? `Fällig: ${formatDate(newDeadline)}` : '';
                    self.store.set({key: "checklist_data", listsData: my.listsData, listState: my.listState});
                },
                //hier auslagern
                onCheckboxChange: async (e) => {
                    my.listState[listKey].items[itemKey].checked = e.target.checked;
                    console.log(`Checkbox für ${itemKey} geändert. Neuer Zustand: ${my.listState[listKey].items[itemKey].checked}`);

                    if (!isEndPoint) {
                        updateSubitemPoints(listKey, item.items, itemKey, my.listState[listKey].items[itemKey].checked);
                        const subitemList = itemHtml.querySelector('.subitem-list');
                        subitemList.innerHTML = '';
                        item.items.forEach(subItem => {
                            renderItem(listKey, subItem, subitemList, listContent, itemKey);
                        });
                        const progressElement = itemHtml.querySelector('.subitem-progress');
                        if (progressElement) {
                            progressElement.textContent = `${Math.round(calculateSubitemProgress(listKey, itemKey, item.items, itemKey))}%`;
                        }
                    }

                    updateParentState(itemKey, listKey, listContent);

                    const progress = calculateProgress(listKey, my.listsData[listKey]);
                    const listItem = listContent.closest('.list-item');
                    const progressFill = listContent.querySelector('.progress-fill');
                    const progressProzent = listItem.querySelector('.progress-prozent');

                    if (progressFill && progressProzent) {
                        progressFill.style.width = `${Math.round(progress)}%`;
                        progressProzent.innerText = `${Math.round(progress)}%`;
                    } else {
                        console.warn('Progress elements not found:', {progressFill, progressProzent});
                    }

                    if (progress === 100) {
                        listItem.classList.add('completed');
                    } else {
                        listItem.classList.remove('completed');
                    }

                    await self.store.set({
                        key: "checklist_data",
                        listsData: my.listsData,
                        listState: my.listState
                    });
                }


            }));

            parentElement.appendChild(itemHtml);
            //          const saveNoteBtn = itemHtml.querySelector('.save-note-btn');
            //       const cancelNoteBtn = itemHtml.querySelector('.cancel-note-btn');
            //     const deadlinePicker = itemHtml.querySelector('.deadline-picker');
            const checkbox = itemHtml.querySelector(`.${isEndPoint ? 'point' : 'subitem'}--checkbox`);
            const subitemList = itemHtml.querySelector('.subitem-list');
            const editNoteBtn = itemHtml.querySelector('.edit-note-btn');
            const noteEditForm = itemHtml.querySelector('.note-edit-form');
            const noteInput = itemHtml.querySelector('.note-input');
            const noteDisplay = itemHtml.querySelector('.subitem-note');
            const notePlaceholder = itemHtml.querySelector('.subitem-note-placeholder');

            checkbox.checked = my.listState[listKey].items[itemKey]?.checked || false;

            /*
            editNoteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const noteContainer = editNoteBtn.parentElement;
                const currentNoteDisplay = noteContainer.querySelector('.subitem-note');
                const currentNotePlaceholder = noteContainer.querySelector('.subitem-note-placeholder');
                if (currentNoteDisplay) currentNoteDisplay.style.display = 'none';
                if (currentNotePlaceholder) currentNotePlaceholder.style.display = 'none';
                editNoteBtn.style.display = 'none';
                noteEditForm.style.display = 'block';
                noteInput.focus();
            });

            saveNoteBtn.addEventListener('click', async (e) => {
                e.stopPropagation();
                const newNote = noteInput.value.trim();

                function updateNote(items, targetKey, updatedNote) {
                    for (let current of items) {
                        if (current.key === targetKey) {
                            current.note = updatedNote;
                            return true;
                        }
                        if (current.items && updateNote(current.items, targetKey, updatedNote)) return true;
                    }
                    return false;
                }

                updateNote(my.listsData[listKey], item.key, newNote);

                const noteContainer = noteEditForm.parentElement;
                const currentNoteDisplay = noteContainer.querySelector('.subitem-note');
                const currentNotePlaceholder = noteContainer.querySelector('.subitem-note-placeholder');

                noteEditForm.style.display = 'none';
                editNoteBtn.style.display = '';

                if (newNote) {
                    if (currentNoteDisplay) {
                        currentNoteDisplay.textContent = newNote;
                        currentNoteDisplay.style.display = '';
                    } else if (currentNotePlaceholder) {
                        const newNoteDisplay = document.createElement('p');
                        newNoteDisplay.className = 'subitem-note';
                        newNoteDisplay.textContent = newNote;
                        noteContainer.insertBefore(newNoteDisplay, editNoteBtn);
                        currentNotePlaceholder.remove();
                    }
                } else {
                    if (currentNoteDisplay) {

                        const newPlaceholder = document.createElement('p');
                        newPlaceholder.className = 'subitem-note-placeholder';
                        newPlaceholder.textContent = 'Notiz hinzufügen';
                        noteContainer.insertBefore(newPlaceholder, editNoteBtn);
                        currentNoteDisplay.remove();
                    } else if (currentNotePlaceholder) {
                        currentNotePlaceholder.style.display = '';
                    }
                }
                await self.store.set({key: "checklist_data", listsData: my.listsData, listState: my.listState});
            });


            cancelNoteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                noteEditForm.style.display = 'none';
                editNoteBtn.style.display = '';
                if (item.note) {
                    if (noteDisplay) noteDisplay.style.display = '';
                } else {
                    if (notePlaceholder) notePlaceholder.style.display = '';
                }
            });


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
                await self.store.set({key: "checklist_data", listsData: my.listsData, listState: my.listState});
            });
            */

            function parentElementForId(rootElement, itemId) {
                return rootElement.querySelector(`[data-id="${itemId}"]`);
            }

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

            const updateParentState = (itemId, currentListKey, currentListContent) => {
                console.log("-------------")
                console.log(itemId)
                const parts = itemId.split('_');
                if (parts.length <= 3) return;
                //     console.log('Update parent state for', {itemId, currentListKey, currentListContent});
                parts.pop();
                parts.pop();
                parts.pop();

                const parentId = parts.join('_');
                console.log("parent id: " + parentId);
                console.log(currentListContent + " currentListKey: " + parentId);
                console.log(currentListContent);

                console.log("current content" + currentListContent)
                console.log("parentId" + parentId)
                const parentItemInState = my.listState[currentListKey].items[parentId];
                const parentElementInDOM = parentElementForId(currentListContent, parentId);//hir nullllll

                console.log('parent item in state:' + (parentItemInState));
                console.log('parent item in parentElementInDOM:' + (parentElementInDOM));
                if (parentItemInState && parentElementInDOM) {
                    const childItems = findChildItemsInData(my.listsData[currentListKey], parentId.split('_').pop(), parts.slice(0, -1).join('_'));

                    const allChildrenChecked = childItems.every(child => {
                        const childKeyInState = `${parentId}_${child.key}`;
                        return my.listState[currentListKey].items[childKeyInState]?.checked;
                    });
                    console.log('allChildrenChecked:' + (allChildrenChecked));

                    parentItemInState.checked = allChildrenChecked;
                    const parentCheckboxInDOM = parentElementInDOM.querySelector('.subitem--checkbox, .point--checkbox');
                    // console.log(parentCheckboxInDOM)
                    console.log("alle kinder" + parentCheckboxInDOM)

                    if (parentCheckboxInDOM) {
                        parentCheckboxInDOM.checked = allChildrenChecked;
                        console.log('parent checkbox in dom:' + (parentCheckboxInDOM));
                    }

                    const parentProgressElement = parentElementInDOM.querySelector('.subitem-progress');
                    if (parentProgressElement) {
                        const parentSubitemProgress = calculateSubitemProgress(currentListKey, parentId, childItems, parentId);
                        parentProgressElement.textContent = `${Math.round(parentSubitemProgress)}%`;
                    }

                    updateParentState(parentId, currentListKey, currentListContent);
                }
            };

            /*
            checkbox.addEventListener('change', async () => {
                my.listState[listKey].items[itemKey].checked = checkbox.checked;

                console.log(`Checkbox für ${itemKey} geändert. Neuer Zustand: ${my.listState[listKey].items[itemKey].checked}`);

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

                updateParentState(itemKey, listKey, listContent);

                const progress = calculateProgress(listKey, my.listsData[listKey]);
                const listItem = listContent.closest('.list-item');
                const progressFill = listContent.querySelector('.progress-fill');
                const progressProzent = listItem.querySelector('.progress-prozent');

                if (progressFill && progressProzent) {
                    progressFill.style.width = `${Math.round(progress)}%`;
                    progressProzent.innerText = `${Math.round(progress)}%`;
                } else {
                    console.warn('Progress elements not found:', {progressFill, progressProzent});
                }

                if (progress === 100) {
                    listItem.classList.add('completed');
                } else {
                    listItem.classList.remove('completed');
                }

                await self.store.set({key: "checklist_data", listsData: my.listsData, listState: my.listState});
            });
            */
            if (!isEndPoint) {
                item.items.forEach(subItem => {
                    renderItem(listKey, subItem, subitemList, listContent, itemKey);
                });
            }
        }

        function updateSubitemPoints(listKey, items, parentKey, checked) {
            items.forEach(item => {
                const itemKey = `${parentKey}_${item.key}`;
                if (my.listState[listKey].items[itemKey]) {
                    my.listState[listKey].items[itemKey].checked = checked;
                }
                updateSubitemPoints(listKey, item.items, itemKey, checked);
            });
        }

    }
};
