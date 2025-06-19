/**
 * @overview ccm component for checklists
 * @author Tobias Niederprüm <t.niederpruem@gmail.com>, 2025
 * @license The MIT License (MIT)
 */

ccm.files["ccm.checklist.js"] = {
    name: "checklist",
    ccm: "https://ccmjs.github.io/ccm/ccm.js",
    config: {
        store: ["ccm.store", {url: "https://ccm2.inf.h-brs.de", name: "tniede2s_checklist_data"}],
        css: ["ccm.load", "./resources/style.css"],
        user: ["ccm.instance", "https://ccmjs.github.io/akless-components/user/ccm.user.js"],
        text: {
            listName: "Listen Name (z.B. Projekt 2024)",
            firstItemName: "Erstes Listenobjekt (z.B. Aufgabe 1)",
            listCreateButtonText: "Liste erstellen",
            saveListText: "Liste speichern",
            myListText: "Meine Listen",
            cancelText: "Abbrechen",
            addListObjectText: "+ Listenobjekt hinzufügen",
            addText: "Hinzufügen",
            secondItemNameText: "Objekt-Name (z.B. Aufgabe 2)",
            addSubpointText: "+",
            deadlineText: "Fälligkeitsdatum",
            removeText: "Enfernen",
            subPointText: 'Unterpunkt-Name (z.B. Unteraufgabe)',
            editText: "Bearbeiten",
            deleteText: "Löschen",
            saveText: "Speichern",
            writeNoteText: "Notiz eingeben...",
            editNoteText: "Notiz bearbeiten",
            addNoteText: "Notiz hinzufügen",
            errorLoginRequired: "Bitte melde dich an, um fortzufahren.",
        },
        helper: ["ccm.load", "https://ccmjs.github.io/akless-components/modules/versions/helper-7.2.0.mjs"],
        html: {
            main: `
                <div class="main">
                    <div id="user"></div>
                    <div id="content"></div>
                </div>
            `,
            mainContent: `
                <div class="container">
                    <h1>%myListText%</h1>
                    <div class="create-list">
                        <input type="text" id="list-name" placeholder="%listName%">
                        <input type="text" id="first-item-name" placeholder="%firstItemNameText%">
                        <button id="start-create" onclick="%onStartCreateButton%">%listCreateButtonText%</button>
                    </div>
                    <div id="items"></div>
                </div>`,
            renderList: `
  <div class="list-container" data-id="%listKey%">
    <div class="item-header">
        
        <div class="item-header-left">
            <div class="list-title-wrapper">
                <h3 class="list-title-heading">%listTitle%</h3>
                <div class="list-name-edit-form" style="display: none;">
                    <input type="text" class="list-name-input-field" value="%listTitle%">
                    <button class="save-list-name-btn" onclick="%onSaveListName%">%saveText%</button>
                    <button class="cancel-list-name-btn" onclick="%onCancelListName%">%cancelText%</button>
                </div>
            </div>
            <button class="edit-list-name-btn" title="%editText%" onclick="%onEditListName%">&#9998;</button>
            <div class="progress-prozent"></div>
        </div>

        <div class="item-header-right">
             <input type="date" class="deadline-picker" value="%listDeadline%" onchange="%onListDeadlineChange%">
             <button class="delete-list" title="%deleteText%" onclick="%onDeleteButton%">🗑</button>
        </div>
    </div>
        <button class="toggle-item" onclick="%onClickToggleButton%">▼</button>
        <div class="item-content">
            <div class="progress-bar">
                <div class="progress-fill"></div>
            </div>
        <div class="subitem-list">
        <div class='action-button-group'>
            <button class='add-subitem' onclick="%onAddSubitemToRoot%">
                %addSubpointText% </button> 
            </div>
            <div class='subitem-input' style="display: none">
                <input type='text' class='subitem-name' placeholder="%subPointName%"/> <button class='confirm-subitem' onclick="%confirmSubitem%">Hinzufügen</button>
            </div>
        </div>
    </div>
    </div>`,
            renderItem: `
                <div class="item-content">
                <div class="%isEndPoint%" id="%itemKey%">
                    <div class="%isEndPoint%--header">
                        <div class="item-main-content">
                        <input type="checkbox" id="%itemKey%" class="%isEndPoint%--checkbox" checked="%checkboxChecked%" onchange="%onCheckboxChange%">
                        
                        <div class="title-edit-wrapper">
                             <label for="checkbox-%itemKey%" class="%isEndPoint%-title">%itemName%</label>
                             <button class="edit-item-name-btn" title="%editItemNameText%" onclick="%editName%">&#9998;</button>

                             <div class="item-name-edit-form" style="display: none;">
                                 <input type="text" class="item-name-input-field" value="%itemName%">
                                 <button class="save-item-name-btn" onclick="%saveItemName%">%saveText%</button>
                                 <button class="cancel-item-name-btn" onclick="%cancelNameButton%">%cancelText%</button>
                             </div>
                        </div>
                        
                        <div class='action-button-group'>
                        <button class='add-subitem' onclick="%onAddSubitem%">
                            + </button> 
                        </div>
                        <div class='subitem-input' style="display: none">
                            <input type='text' class='subitem-name' placeholder="%subPointName%"/> <button class='confirm-subitem' onclick="%confirmSubitem%">Hinzufügen</button>
                        </div>
                        </div>
                        <div class="item-meta-actions">
                        <div class="note-container">
                            <button class="edit-note-btn" title="%noteTitle%" onclick="%onEditeNote%">🗒️</button>
                            <p class="%subItemNoteClass%">%noteShow%</p>
                            <div class="note-edit-form" style="display: none;">
                                <textarea class="note-input" rows="3" placeholder=" ">%itemNote%</textarea>
                                <button class="save-note-btn" onclick="%onSaveNoteButton%">%saveText%</button>
                                <button class="cancel-note-btn" onclick="%onCancelNoteBtn%">%cancelText%</button>
                            </div>
                        </div>
                        <input type="date" class="deadline-picker" value=%itemDeadline% onchange="%onDeadlinePicker%">
                        %subitemProgress%
                        <button class='remove-subitem' onclick="%onRemoveSubitem%">🗑</button>
                        </div>
                    </div>
                    %subItemList% 
                </div>
                </div>`,
        }
    },
    Instance: function () {
        let self = this;
        let my;
        let studentId;



        this.init = async () => {
            $ = Object.assign({}, this.ccm.helper, this.helper);
            $.use(this.ccm);
            if (this.user) this.user.onchange = this.start;
        };


        this.events = {
            onAddSubitem: (itemKey, event) => {
                if (event) event.stopPropagation();
                const currentItemRenderedRoot = self.element.querySelector(`[data-id="${itemKey}"]`);

                const subitemInputContainer = currentItemRenderedRoot.querySelector('.subitem-input');
                subitemInputContainer.style.display === 'none' ? subitemInputContainer.style.display = 'block' : subitemInputContainer.style.display = 'none';
                const subitemNameInputForNew = subitemInputContainer.querySelector('.subitem-name');
                if (subitemNameInputForNew) {
                    subitemNameInputForNew.focus();
                }
            },
            onAddSubitemToRoot: (itemKey, event) => {
                if (event) event.stopPropagation();
                const currentItemRenderedRoot = self.element.querySelector(`[data-id="${itemKey}"]`);

                console.log(currentItemRenderedRoot);
                const subitemInputContainer = currentItemRenderedRoot.querySelector('.subitem-input');
                subitemInputContainer.style.display === 'none' ? subitemInputContainer.style.display = 'block' : subitemInputContainer.style.display = 'none';
                const subitemNameInputForNew = subitemInputContainer.querySelector('.subitem-name');
                if (subitemNameInputForNew) {
                    subitemNameInputForNew.focus();
                }
            },
            onStartCreateButton: async (createListForm) => {
                const listNameInput = createListForm.querySelector('#list-name').value.trim();
                const firstItemName = createListForm.querySelector('#first-item-name').value.trim();

                if (!listNameInput || !firstItemName) {
                    alert('Bitte geben Sie einen Listennamen und ein erstes Listenobjekt ein.');
                    return;
                }

                if (!istEingabeGueltig(listNameInput) || !istEingabeGueltig(firstItemName)) {
                    return;
                }
                const listKey = $.generateKey();
                const firstItemKey = `item§§§${firstItemName.replace(/[^a-zA-Z0-9äöüß]/g, '§§§').toLowerCase()}§§§${Date.now()}`;
                const firstItem = { key: firstItemKey, name: firstItemName, items: [], deadline: null, note: "" };

                my.listsData[listKey] = {
                    name: listNameInput,
                    deadline: null,// Der für den Benutzer sichtbare Name
                    items: [firstItem]   // Das Array der Listen-Objekte
                };

                my.listState[listKey] = { items: {}, collapsed: false };
                initializeState(listKey, my.listsData[listKey].items, my.listState[listKey]);

                await self.store.set({ key: studentId, listsData: my.listsData, listState: my.listState });

                await renderLists();
                createListForm.querySelector('#list-name').value = '';
                createListForm.querySelector('#first-item-name').value = '';},
            confirmSubitem: async (itemKey, item, event) => {
                if (event) event.stopPropagation();

                const currentItemRenderedRoot = self.element.querySelector(`[data-id="${itemKey}"]`);

                if (!currentItemRenderedRoot) {
                    console.error(`confirmSubitem: Konnte das Elternelement mit data-id "${itemKey}" nicht finden.`);
                    return;
                }

                const subitemInputContainer = currentItemRenderedRoot.querySelector('.subitem-input');
                const subitemNameInputForNew = subitemInputContainer.querySelector('.subitem-name');
                const subitemName = subitemNameInputForNew.value.trim();

                if (!istEingabeGueltig(subitemName)) return;
                if (!subitemName) {
                    alert('Bitte geben Sie einen Namen für den Unterpunkt ein.');
                    subitemNameInputForNew.focus();
                    return;
                }

                const newSubitemKey = `subitem§§§${subitemName.replace(/[^a-zA-Z0-9äöüß]/g, '§§§').toLowerCase()}§§§${Date.now()}`;
                const newSubitem = { key: newSubitemKey, name: subitemName, items: [], deadline: null, note: "" };

                let parentItemList;

                if (my.listsData[itemKey] && my.listsData[itemKey].items) {
                    parentItemList = my.listsData[itemKey].items;
                }
                else if (item && item.items) {
                    parentItemList = item.items;
                } else {
                    console.error("Konnte die Liste der Unterpunkte nicht finden, um das neue Element hinzuzufügen.");
                    return;
                }

                parentItemList.push(newSubitem);

                await self.store.set({ key: studentId, listsData: my.listsData, listState: my.listState });
                await renderLists();

                subitemNameInputForNew.value = '';
                subitemInputContainer.style.display = 'none';
            },
            editName: (event) => {
                event.stopPropagation();
                const editButton = event.target;
                const wrapper = editButton.closest('.title-edit-wrapper');
                const label = wrapper.querySelector('label');
                const editForm = wrapper.querySelector('.item-name-edit-form');
                const input = editForm.querySelector('input');

                label.style.display = 'none';
                editButton.style.display = 'none';
                editForm.style.display = 'flex';
                input.focus();
                input.select();
            },
            // in deinem events-Objekt

            saveItemName: async (event, listKey, item) => {
                event.stopPropagation();
                const editForm = event.target.closest('.item-name-edit-form');
                const input = editForm.querySelector('.item-name-input-field');
                const newName = input.value.trim();

                if (!istEingabeGueltig(newName)) return;

                if (newName && newName !== item.name) {
                    // Benutze die zentrale, korrekte Hilfsfunktion
                    if (findAndOperateRecursive(my.listsData[listKey].items, item.key, (foundItem) => {
                        // Dies ist die einfache "Aktion": Ändere den Namen des gefundenen Elements.
                        foundItem.name = newName;
                    })) {
                        // Wenn die Aktion erfolgreich war, speichere und rendere neu.
                        await self.store.set({ key: studentId, listsData: my.listsData, listState: my.listState });
                        await renderLists();
                    }
                } else if (!newName) {
                    alert('Der Name darf nicht leer sein.');
                    input.focus();
                } else {
                    // Name ist unverändert, schließe einfach das Formular
                    self.events.cancelNameButton(event);
                }
            },
            cancelNameButton: (event) => {
                event.stopPropagation();
                const cancelButton = event.target;
                const editForm = cancelButton.closest('.item-name-edit-form');
                const wrapper = editForm.closest('.title-edit-wrapper');
                const label = wrapper.querySelector('label');
                const editButton = wrapper.querySelector('.edit-item-name-btn');

                editForm.style.display = 'none';
                label.style.display = '';
                editButton.style.display = '';
            },

            onRemoveSubitem: async (item, listKey) => {
                const listItems = my.listsData[listKey].items;

                if (listItems.length === 1 && listItems[0].key === item.key) {
                    alert('Die Liste muss mindestens ein Listenobjekt enthalten...');
                    return;
                }

                // Die Callback-Funktion nutzt hier alle 3 Parameter: item, parentArray und index
                if (findAndOperateRecursive(listItems, item.key, (foundItem, parentArray, index) => {
                    parentArray.splice(index, 1); // Element aus seinem Eltern-Array löschen
                })) {
                    await self.store.set({ key: studentId, listsData: my.listsData, listState: my.listState });
                    await renderLists();
                    console.log(`Item "${item.name}" wurde gelöscht.`);
                } else {
                    console.warn(`Item "${item.name}" konnte nicht zum Löschen gefunden werden.`);
                }
            },
            onDeleteButton: async (key, itemElement, listHtml) => {
                delete my.listsData[key];
                delete my.listState[key];
                itemElement.removeChild(listHtml);
                self.store.set({
                    key: studentId,
                    listsData: my.listsData,
                    listState: my.listState
                });
            },
            onClickToggleButton: async (key, itemContent, toggleButton) => {
                my.listState[key].collapsed = !my.listState[key].collapsed;
                itemContent.style.display = my.listState[key].collapsed ? 'none' : 'block';
                toggleButton.textContent = my.listState[key].collapsed ? '▶' : '▼';
                await self.store.set({
                    key: studentId,
                    listsData: my.listsData,
                    listState: my.listState
                });
            },

            // in deinem events-Objekt

            // in deinem events-Objekt

            onEditNote: (event, itemHtml, item, noteDisplay, notePlaceholder, editNoteBtn, noteEditForm, noteInput) => {
                event.stopPropagation();

                // Wir können die übergebenen Elemente direkt verwenden
                if (noteDisplay) noteDisplay.style.display = 'none';
                if (notePlaceholder) notePlaceholder.style.display = 'none';

                editNoteBtn.style.display = 'none';
                noteEditForm.style.display = 'block';
                noteInput.value = item.note || '';
                noteInput.focus();
            },

            onSaveNoteButton: async (event, item, itemHtml, noteInput, listKey, noteEditForm, editNoteBtn) => {
                event.stopPropagation();
                // noteInput und listKey sind jetzt die korrekten Variablen
                const newNote = noteInput.value.trim();

                if (findAndOperateRecursive(my.listsData[listKey].items, item.key, (foundItem) => {
                    foundItem.note = newNote;
                })) {
                    await self.store.set({key: studentId, listsData: my.listsData, listState: my.listState});
                    await renderLists();
                } else {
                    console.error("Konnte die Notiz zum Speichern nicht finden.", {listKey, itemKey: item.key});
                }
            },

            onCancelNoteBtn: (event, noteEditForm, editNoteBtn, noteDisplay, notePlaceholder, item) => {
                event.stopPropagation();

                noteEditForm.style.display = 'none';
                editNoteBtn.style.display = 'block';

                // Die Logik, um den alten Text wieder anzuzeigen
                if (item.note) {
                    if (noteDisplay) noteDisplay.style.display = 'block';
                } else {
                    if (notePlaceholder) notePlaceholder.style.display = 'block';
                }
            },
            onDeadlinePicker: async (event, item, listKey) => {
                event.stopPropagation();
                const newDeadline = event.target.value || null;

                if (findAndOperateRecursive(my.listsData[listKey].items, item.key, (foundItem) => {
                    foundItem.deadline = newDeadline;
                })) {
                    await self.store.set({key: studentId, listsData: my.listsData, listState: my.listState});
                    console.log(`Deadline für Item "${item.name}" auf ${newDeadline} gesetzt.`);
                } else {
                    console.error(`Konnte Item mit Schlüssel ${item.key} nicht finden, um Deadline zu aktualisieren.`);
                }
            },

            onCheckboxChange: async (event, item, listKey, itemKey, isEndPoint, itemHtml, listContent) => {
                my.listState[listKey].items[itemKey].checked = event.target.checked;
                console.log(`Checkbox für ${itemKey} geändert. Neuer Zustand: ${my.listState[listKey].items[itemKey].checked}`);

                if (!isEndPoint) {
                    updateSubitemPoints(listKey, item.items, itemKey, my.listState[listKey].items[itemKey].checked);
                    const subitemList = itemHtml.querySelector('.subitem-list');
                    subitemList.innerHTML = ''; // Leeren, um neu zu rendern
                    item.items.forEach(subItem => {
                        renderItem(listKey, subItem, subitemList, listContent, itemKey);
                    });
                    const progressElement = itemHtml.querySelector('.subitem-progress');
                    if (progressElement) {
                        progressElement.textContent = `${Math.round(calculateProgress(listKey, item.items, itemKey))}%`;
                    }
                }

                updateParentState(itemKey, listKey, listContent);

                // KORREKTUR: Hier wird das .items-Array an die Berechnungsfunktion übergeben.
                const progress = calculateProgress(listKey, my.listsData[listKey].items);

                // Der DOM-Teil muss sicherstellen, dass er das richtige Listenelement findet.
                // 'listContent' ist hier das '.item-content' DIV. Wir müssen zum übergeordneten '.list-item' gelangen.
                const listItem = listContent.closest('.list-container');

                if (listItem) {
                    const progressFill = listItem.querySelector('.progress-fill');
                    const progressProzent = listItem.querySelector('.progress-prozent');

                    if (progressFill && progressProzent) {
                        progressFill.style.width = `${Math.round(progress)}%`;
                        progressProzent.innerText = `${Math.round(progress)}%`;
                    } else {
                        console.warn('Progress elements not found in list item:', {progressFill, progressProzent});
                    }

                    if (progress === 100) {
                        listItem.classList.add('completed');
                    } else {
                        listItem.classList.remove('completed');
                    }
                } else {
                    console.warn("Konnte das übergeordnete '.list-container' Element nicht finden.");
                }


                await self.store.set({key: studentId, listsData: my.listsData, listState: my.listState});
            },
            editListName: (event) => {
                event.stopPropagation();
                const wrapper = event.target.closest('.item-header').querySelector('.list-title-wrapper');
                wrapper.querySelector('.list-title-heading').style.display = 'none';
                wrapper.querySelector('.list-name-edit-form').style.display = 'flex';
                // Den Bearbeiten-Button selbst auch ausblenden
                event.target.style.display = 'none';

                const input = wrapper.querySelector('.list-name-input-field');
                input.focus();
                input.select();
            },
            onListDeadlineChange: async (event, listKey) => {
                // 1. Hole den neuen Datumswert (z.B. "2025-06-20") oder null, wenn das Feld geleert wird.
                const newDeadline = event.target.value || null;

                // 2. Aktualisiere die Deadline direkt im Datenobjekt der Liste.
                my.listsData[listKey].deadline = newDeadline;

                // 3. Speichere den gesamten Zustand im Store.
                await self.store.set({ key: studentId, listsData: my.listsData, listState: my.listState });

                // Ein komplettes Neu-Rendern ist hier nicht nötig, da der <input>-Wert sich selbst aktualisiert.
                // Das spart Performance.
                console.log(`Deadline für Liste ${listKey} auf ${newDeadline} gesetzt.`);
            },
            cancelListName: (event) => {
                event.stopPropagation();
                const wrapper = event.target.closest('.item-header').querySelector('.list-title-wrapper');
                wrapper.querySelector('.list-name-edit-form').style.display = 'none';
                wrapper.querySelector('.list-title-heading').style.display = 'block';
                event.target.closest('.item-header').querySelector('.edit-list-name-btn').style.display = 'inline-block';
            },
            saveListName: async (event, listKey) => {
                event.stopPropagation();
                const wrapper = event.target.closest('.list-name-edit-form');
                const input = wrapper.querySelector('.list-name-input-field');
                const newName = input.value.trim();

                if (!newName) {
                    alert('Der Listenname darf nicht leer sein.');
                    return;
                }

                my.listsData[listKey].name = newName;

                await self.store.set({ key: studentId, listsData: my.listsData, listState: my.listState });

                await renderLists();
            }
        }

        this.start = async () => {
            try {
                console.log(await this.store.get());

                $.setContent(this.element, $.html(this.html.main));

                if (this.user) {
                    $.setContent(this.element.querySelector('#user'), this.user.root);
                    this.user.start();
                }

                studentId = await this.user.getValue();
                if (!studentId) {
                    alert(self.text.errorLoginRequired);
                    console.log("User is not logged in");
                    return;
                }
                studentId = studentId.key;

                my = await self.store.get(studentId) || {listsData: {}, listState: {}};
                my.listsData = my.listsData || {};
                my.listState = my.listState || {};

                /*
                my.tempList = null;
                my.currentItems = [];

                 */

                Object.keys(my.listsData).forEach(listKey => {
                    const list = my.listsData[listKey];
                    if (list && Array.isArray(list.items)) {
                        ensureNotesField(list.items);

                        if (!my.listState[listKey]) {
                            console.log(`Initialisiere listState für ${listKey}`);
                            my.listState[listKey] = { items: {}, collapsed: false };
                            initializeState(listKey, list.items, my.listState[listKey]);
                        }
                    }
                });

                console.log("Initialized store:", JSON.stringify(my, null, 2));

                const itemHtml = document.createElement('div');
                $.setContent(itemHtml, $.html(self.html.mainContent, {
                    firstItemNameText: self.text.firstItemName,
                    listName: self.text.listName,
                    listCreateButtonText: self.text.listCreateButtonText,
                    saveListText: self.text.saveListText,
                    myListText: self.text.myListText,
                    cancelText: self.text.cancelText,
                    onStartCreateButton: () => self.events.onStartCreateButton(createListForm, listForm, previewList, itemElement),
                }));
                $.setContent(self.element.querySelector('#content'), itemHtml);

                const createListForm = self.element.querySelector('.create-list');
                const listForm = self.element.querySelector('.list-form');
                const previewList = self.element.querySelector('#preview-list');
                const itemElement = self.element.querySelector('#items');

                await renderLists();
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

        function initializeState(listKey, items, state = my.listState[listKey], parentKey = '') {
            if (!state) {
                state = {items: {}, collapsed: false};
                my.listState[listKey] = state;
            }
            items.forEach(item => {
                const itemKey = parentKey ? `${parentKey}§§§${item.key}` : item.key;
                state.items[itemKey] = state.items[itemKey] || {checked: false, collapsed: false};
                initializeState(listKey, item.items, state, itemKey);
            });
            console.log(`Initialized state for ${listKey}:`, JSON.stringify(state, null, 2));
        }

        function countItemPoints(items, listKey, currentParentKey = '') {
            let totalPoints = 0;
            let checkedPoints = 0;

            items.forEach(item => {
                const itemKey = currentParentKey ? `${currentParentKey}§§§${item.key}` : item.key;
                if (item.items.length === 0) {
                    totalPoints++;
                    if (my.listState[listKey]?.items[itemKey]?.checked) {
                        checkedPoints++;
                    }
                } else {
                    const [subTotal, subChecked] = countItemPoints(item.items, listKey, itemKey);
                    totalPoints += subTotal;
                    checkedPoints += subChecked;
                }
            });

            return [totalPoints, checkedPoints];
        }

        function calculateProgress(listKey, items, parentKey = '') {
            const [totalPoints, checkedPoints] = countItemPoints(items, listKey, parentKey);
            return totalPoints > 0 ? (checkedPoints / totalPoints) * 100 : 0;
        }

        /*
        function calculateSubitemProgress(listKey, subitemKey, items, parentKey = '') {
            const [totalPoints, checkedPoints] = countItemPoints(items, listKey, parentKey);
            return totalPoints > 0 ? (checkedPoints / totalPoints) * 100 : 0;
        }
        */
        async function renderLists() {
            const itemElement = self.element.querySelector('#items');
            itemElement.innerHTML = '';

            console.log('Rendering lists with data:', JSON.stringify(my.listsData, null, 2));

            for (const key of Object.keys(my.listsData)) {

                const listData = my.listsData[key];

                if (!listData || !Array.isArray(listData.items)) {
                    console.warn(`Ungültige Datenstruktur für Liste ${key}, wird übersprungen.`);
                    continue;
                }

                const listTitle = listData.name;

                const listHtml = document.createElement('div');
                listHtml.className = 'list-item';
                listHtml.dataset.id = key;

                $.setContent(listHtml, $.html(self.html.renderList, {
                    listKey: key,
                    listTitle: listTitle,
                    saveText: self.text.saveText,
                    cancelText: self.text.cancelText,
                    deleteText: self.text.deleteText,
                    editText: self.text.editText,
                    addSubpointText: self.text.addSubpointText,
                    subPointName: self.text.subPointText,

                    onDeleteButton: () => self.events.onDeleteButton(key, itemElement, listHtml),
                    onClickToggleButton: () => self.events.onClickToggleButton(key, itemContent, toggleButton),
                    onAddSubitemToRoot: () => self.events.onAddSubitemToRoot(key),
                    confirmSubitem: () => self.events.confirmSubitem(key, null),

                    listDeadline: listData.deadline || '',
                    onListDeadlineChange: (event) => self.events.onListDeadlineChange(event, key), // Den neuen Event-Handler übergeben

                    onEditListName: (event) => self.events.editListName(event),
                    onSaveListName: (event) => self.events.saveListName(event, key), // Wichtig: Die UUID (key) übergeben!
                    onCancelListName: (event) => self.events.cancelListName(event)
                }));

                itemElement.appendChild(listHtml);

                const itemContent = listHtml.querySelector('.item-content');
                const subitemList = listHtml.querySelector('.subitem-list');
                const toggleButton = listHtml.querySelector('.toggle-item');

                if (my.listState[key] && my.listState[key].collapsed) {
                    itemContent.style.display = 'none';
                    toggleButton.textContent = '▶';
                }

                listData.items.forEach(item => {
                    renderItem(key, item, subitemList, itemContent, '');
                });

                const progress = calculateProgress(key, listData.items);
                const progressFill = listHtml.querySelector('.progress-fill');
                const progressProzent = listHtml.querySelector('.progress-prozent');

                if (progressFill) progressFill.style.width = `${Math.round(progress)}%`;
                if (progressProzent) progressProzent.innerText = `${Math.round(progress)}%`;

                if (progress === 100) {
                    listHtml.classList.add('completed');
                }
            }
        }

        function renderItem(listKey, item, parentElement, listContent, parentKey) {
            const itemKey = parentKey ? `${parentKey}§§§${item.key}` : item.key;
            const isEndPoint = item.items.length === 0;
            const subitemProgress = isEndPoint ? 0 : calculateProgress(listKey, item.items, itemKey);


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
                subitemProgress: !isEndPoint ? ('<span class="subitem-progress">' + Math.round(subitemProgress) + '</span>') : '',
                subItemNoteClass: item.note ? 'subitem-note' : 'subitem-note-placeholder',
                noteShow: item.note ? item.note : "",
                noteTitle: item.note ? self.text.editNoteText : self.text.addNoteText,
                itemNote: item.note || '',
                subItemList: !isEndPoint ? '<div class="subitem-list"></div>' : '',
                checkboxChecked: my.listState[listKey].items[itemKey]?.checked ? true : false,
                onEditeNote: (event) => self.events.onEditNote(event, itemHtml, item, noteDisplay, notePlaceholder, editNoteBtn, noteEditForm, noteInput),
                onSaveNoteButton: (event) => self.events.onSaveNoteButton(event, item, itemHtml, noteInput, listKey, noteEditForm, editNoteBtn),
                onCancelNoteBtn: (event) => self.events.onCancelNoteBtn(event, noteEditForm, editNoteBtn, noteDisplay, notePlaceholder, item),
                onDeadlinePicker: async (event) => await self.events.onDeadlinePicker(event, item, listKey),
                onCheckboxChange: (event) => self.events.onCheckboxChange(event, item, listKey, itemKey, isEndPoint, itemHtml, listContent),
                confirmSubitem: () => self.events.confirmSubitem(itemKey, item),
                onAddSubitem: () => self.events.onAddSubitem(itemKey),
                onRemoveSubitem: () => self.events.onRemoveSubitem(item, listKey),
                editName:         (event) => self.events.editName(event),
                saveItemName:     (event) => self.events.saveItemName(event, listKey, item),
                cancelNameButton: (event) => self.events.cancelNameButton(event),
            }));

            parentElement.appendChild(itemHtml);


            const nameEditForm = itemHtml.querySelector('.item-name-edit-form');
            const titleDisplay = itemHtml.querySelector(`.point-title, .subitem-title`);
            const editNameBtn = itemHtml.querySelector('.edit-item-name-btn');
            const nameInput = nameEditForm.querySelector('.item-name-input-field');
            console.log(titleDisplay);

            const checkbox = itemHtml.querySelector(`.${isEndPoint ? 'point' : 'subitem'}--checkbox`);
            const subitemList = itemHtml.querySelector('.subitem-list');
            const editNoteBtn = itemHtml.querySelector('.edit-note-btn');
            const noteEditForm = itemHtml.querySelector('.note-edit-form');
            const noteInput = itemHtml.querySelector('.note-input');
            const noteDisplay = itemHtml.querySelector('.subitem-note');
            const notePlaceholder = itemHtml.querySelector('.subitem-note-placeholder');

            checkbox.checked = my.listState[listKey].items[itemKey]?.checked || false

            if (!isEndPoint) {
                item.items.forEach(subItem => {
                    renderItem(listKey, subItem, subitemList, listContent, itemKey);
                });
            }
        }

        function findItemDataRecursive(items, targetKey) {
            // Gehe jedes Element im übergebenen Array durch
            for (const item of items) {
                // Prüft, ob das aktuelle Element das gesuchte ist
                if (item.key === targetKey) {
                    return item; // Volltreffer! Gib das Element zurück.
                }
                // Wenn nicht, und wenn das Element selbst Kinder hat...
                if (item.items && item.items.length > 0) {
                    // ...starte die Suche in den Kindern (Rekursion)
                    const found = findItemDataRecursive(item.items, targetKey);
                    // Wenn in den Kindern etwas gefunden wurde, gib es sofort nach oben weiter
                    if (found) {
                        return found;
                    }
                }
            }
            // Wenn die Schleife durchgelaufen ist und nichts gefunden wurde
            return null;
        }

        function findAndOperateRecursive(items, targetKey, callback) {
            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                if (item.key === targetKey) {
                    // Element gefunden! Führe die Aktion aus.
                    callback(item, items, i);
                    return true;
                }
                if (item.items && item.items.length > 0) {
                    // Suche in den Kindern weiter
                    if (findAndOperateRecursive(item.items, targetKey, callback)) {
                        return true;
                    }
                }
            }
            return false;
        }

        const updateParentState = (itemId, currentListKey, currentListContent) => {
            const parts = itemId.split('§§§');
            if (parts.length <= 3) return;

            const parentStateKey = parts.slice(0, -3).join('§§§');
            const parentDataKey = parts.slice(parts.length - 6, -3).join('§§§');

            const parentItemInState = my.listState[currentListKey].items[parentStateKey];
            // Wichtig: Wir suchen das Elternelement im gesamten Listeninhalt, nicht nur in einem Teilbaum.
            const parentElementInDOM = self.element.querySelector(`[data-id="${parentStateKey}"]`);

            if (parentItemInState && parentElementInDOM) {
                const parentDataNode = findItemDataRecursive(my.listsData[currentListKey].items, parentDataKey);

                if (!parentDataNode || !parentDataNode.items) {
                    console.error("Eltern-Datenknoten nicht gefunden oder hat keine Kinder", {parentDataKey});
                    return;
                }

                const childItems = parentDataNode.items;
                const allChildrenChecked = childItems.every(child => {
                    const childStateKey = `${parentStateKey}§§§${child.key}`;
                    return my.listState[currentListKey].items[childStateKey]?.checked;
                });

                // Zustand des Elternelements aktualisieren
                parentItemInState.checked = allChildrenChecked;

                // KORREKTUR: Der DOM-Selektor ist jetzt einfach und korrekt.
                // Er sucht nach der Checkbox mit der Klasse .subitem--checkbox innerhalb des Headers des Elternelements.
                const parentCheckboxInDOM = parentElementInDOM.querySelector(`.subitem--header .subitem--checkbox`);

                if (parentCheckboxInDOM) {
                    parentCheckboxInDOM.checked = allChildrenChecked;
                } else {
                    console.warn("Konnte die Checkbox des Elternelements im DOM nicht finden, um sie zu aktualisieren.", parentElementInDOM);
                }

                // Fortschritt des Elternelements aktualisieren
                const parentProgressElement = parentElementInDOM.querySelector('.subitem-progress');
                if (parentProgressElement) {
                    const parentSubitemProgress = calculateProgress(currentListKey, childItems, parentStateKey);
                    parentProgressElement.textContent = `${Math.round(parentSubitemProgress)}%`;
                }

                // Rekursiv für das nächste übergeordnete Element aufrufen
                updateParentState(parentStateKey, currentListKey, currentListContent);
            }
        };

        function updateSubitemPoints(listKey, items, parentKey, checked) {
            items.forEach(item => {
                const itemKey = `${parentKey}§§§${item.key}`;
                if (my.listState[listKey].items[itemKey]) {
                    my.listState[listKey].items[itemKey].checked = checked;
                }
                updateSubitemPoints(listKey, item.items, itemKey, checked);
            });
        }

        function istEingabeGueltig(inputText) {
            const forbiddenSequence = '§§§';
            if (inputText.includes(forbiddenSequence)) {
                alert(`Die Zeichenfolge "${forbiddenSequence}" ist im Namen nicht erlaubt.`);
                return false; // Eingabe ist ungültig
            }
            return true; // Eingabe ist gültig
        }

        function checkListNameExists(listName) {
            const exist = Object.keys(my.listsData).includes(listName)
            console.log(exist)
            if(exist) {
                alert(`Die Liste "${listName}" existiert bereits. Bitte wählen Sie einen anderen Namen.`);
            }
            return Object.keys(my.listsData).includes(listName);
        }

    }
};

