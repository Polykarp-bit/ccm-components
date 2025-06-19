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
            previewListText: "Vorschau der Liste",
            listName: "Listen Name (z.B. Projekt 2024)",
            firstItemName: "Erstes Listenobjekt (z.B. Aufgabe 1)",
            listCreateButtonText: "Liste erstellen",
            saveListText: "Liste speichern",
            myListText: "Meine Listen",
            cancelText: "Abbrechen",
            addListObjectText: "+ Listenobjekt hinzufügen",
            addText: "Hinzufügen",
            secondItemNameText: "Objekt-Name (z.B. Aufgabe 2)",
            addSubpointText: "+ Unterpunkt hinzufügen",
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
                     <!-- <div class="list-form" style="display: none;">
                        <div class="preview-section">
                            <h3>%previewListText%</h3>
                            <div id="preview-list"></div>
                        </div>
                        <button id="save-list" onclick="%onSaveListButton%">%saveListText%</button>
                        <button class="cancel-button" onclick="%onCancelListButton%">%cancelText%</button>
                    </div>-->
                    <div id="items"></div>
                </div>`,
            // in config.html
            renderList: `
   <div class="list-container" data-id="%listKey%">
    <div class="item-header">
        <div class="list-title-wrapper">
            <h3 class="list-title-heading">%listTitle%</h3>

            <div class="list-name-edit-form" style="display: none;">
                <input type="text" class="list-name-input-field" value="%listTitle%">
                <button class="save-list-name-btn" onclick="%onSaveListName%">%saveText%</button>
                <button class="cancel-list-name-btn" onclick="%onCancelListName%">%cancelText%</button>
            </div>
        </div>

        <div class="progress-prozent"></div>
        <div class="item-header-right">
             <button class="edit-list-name-btn" title="%editText%" onclick="%onEditListName%">&#9998;</button>
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
                <div class="%isEndPoint%" id="%itemKey%">
                    <div class="%isEndPoint%--header">
                        <input type="checkbox" id="%itemKey%" class="%isEndPoint%--checkbox" checked="%checkboxChecked%" onchange="%onCheckboxChange%">
                        
                        <div class="title-edit-wrapper">
                             <button class="edit-item-name-btn" title="%editItemNameText%" onclick="%editName%">&#9998;</button>
                             <label for="checkbox-%itemKey%" class="%isEndPoint%-title">%itemName%</label>
                             <div class="item-name-edit-form" style="display: none;">
                                 <input type="text" class="item-name-input-field" value="%itemName%">
                                 <button class="save-item-name-btn" onclick="%saveItemName%">%saveText%</button>
                                 <button class="cancel-item-name-btn" onclick="%cancelNameButton%">%cancelText%</button>
                             </div>
                        </div>
                        
                        <div class='action-button-group'>
                        <button class='remove-subitem' onclick="%onRemoveSubitem%">%removeText%</button>
                        <button class='add-subitem' onclick="%onAddSubitem%">
                            %addSubpointText% </button> 
                        </div>
                        <div class='subitem-input' style="display: none">
                            <input type='text' class='subitem-name' placeholder="%subPointName%"/> <button class='confirm-subitem' onclick="%confirmSubitem%">Hinzufügen</button>
                        </div>
                    
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
                    </div>
                    %subItemList% 
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
                // KORREKTUR: Auch hier den Attribut-Selektor verwenden.
                const currentItemRenderedRoot = self.element.querySelector(`[data-id="${itemKey}"]`);

                // Der Rest der Funktion bleibt gleich
                const subitemInputContainer = currentItemRenderedRoot.querySelector('.subitem-input');
                subitemInputContainer.style.display === 'none' ? subitemInputContainer.style.display = 'block' : subitemInputContainer.style.display = 'none';
                const subitemNameInputForNew = subitemInputContainer.querySelector('.subitem-name');
                if (subitemNameInputForNew) {
                    subitemNameInputForNew.focus();
                }
            },
            onAddSubitemToRoot: (itemKey, event) => {
                if (event) event.stopPropagation();
                // KORREKTUR: Wir suchen nach dem data-id Attribut statt der ID.
                // Dieser Selektor funktioniert mit JEDEM String, auch mit UUIDs, die mit Zahlen beginnen.
                const currentItemRenderedRoot = self.element.querySelector(`[data-id="${itemKey}"]`);

                // Der Rest der Funktion bleibt gleich
                console.log(currentItemRenderedRoot); // Sollte jetzt das korrekte <div> finden
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

                // --- Validierung ---
                if (!listNameInput || !firstItemName) {
                    alert('Bitte geben Sie einen Listennamen und ein erstes Listenobjekt ein.');
                    return;
                }
                // Die Funktion istEingabeGueltig prüft auf '§§§'. Das ist für Item-Namen gut,
                // für den Listennamen hier aber nicht zwingend nötig, schadet aber auch nicht.
                if (!istEingabeGueltig(listNameInput) || !istEingabeGueltig(firstItemName)) {
                    return;
                }

                // --- Datenerstellung ---

                // 1. Erstellen Sie die eindeutige, technische ID für die Liste.
                const listKey = $.generateKey(); // z.B. "f4a5c6e7-1b2c-4d5e-8f6a-7b8c9d0e1f2a"

                // 2. Erstellen Sie das erste Item für die Liste.
                const firstItemKey = `item§§§${firstItemName.replace(/[^a-zA-Z0-9äöüß]/g, '§§§').toLowerCase()}§§§${Date.now()}`;
                const firstItem = { key: firstItemKey, name: firstItemName, items: [], deadline: null, note: "" };

                // 3. ERSTELLEN SIE DIE KORREKTE DATENSTRUKTUR!
                // Der Schlüssel ist die UUID. Der Wert ist ein Objekt mit 'name' und 'items'.
                my.listsData[listKey] = {
                    name: listNameInput, // Der für den Benutzer sichtbare Name
                    items: [firstItem]   // Das Array der Listen-Objekte
                };

                // 4. Initialisieren Sie den Zustand für die neue Liste unter derselben UUID.
                my.listState[listKey] = { items: {}, collapsed: false };
                // Wichtig: Geben Sie hier das items-Array an die Funktion weiter.
                initializeState(listKey, my.listsData[listKey].items, my.listState[listKey]);

                // 5. Speichern Sie das gesamte 'my'-Objekt im Store.
                await self.store.set({ key: studentId, listsData: my.listsData, listState: my.listState });

                // 6. Rendern Sie die Listen neu und setzen Sie die Formularfelder zurück.
                await renderLists();
                createListForm.querySelector('#list-name').value = '';
                createListForm.querySelector('#first-item-name').value = '';},
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

                await self.store.set({key: studentId, listsData: my.listsData, listState: my.listState})
                    .then(() => console.log('Daten erfolgreich gespeichert:', my))
                    .catch(e => {
                        console.error('Fehler beim Speichern:', e);
                        alert('Fehler beim Speichern der Liste. Bitte überprüfe die Konsole.');
                    });


                await renderLists();

                listForm.style.display = 'none';
                previewList.innerHTML = '';
                /*my.tempList = null;
                my.currentItems = [];*/
            },
            onCancelListButton: (listForm, previewList) => {
                listForm.style.display = 'none';
                my.tempList = null;
                my.currentItems = [];
                previewList.innerHTML = '';
            },
            confirmSubitem: async (itemKey, item, event) => {
                if (event) event.stopPropagation();

                // KORREKTUR: Den robusten Attribut-Selektor verwenden.
                const currentItemRenderedRoot = self.element.querySelector(`[data-id="${itemKey}"]`);

                // Eine kleine zusätzliche Sicherheitsprüfung, falls das Element nicht gefunden wird.
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

                // WICHTIG: Die Logik zum Hinzufügen muss die neue Datenstruktur berücksichtigen
                let parentItemList;

                // Fall 1: Wir fügen zur Hauptliste hinzu. 'item' ist hier das ganze `my.listsData`-Objekt.
                // 'itemKey' ist die UUID der Liste.
                if (my.listsData[itemKey] && my.listsData[itemKey].items) {
                    parentItemList = my.listsData[itemKey].items;
                }
                // Fall 2: Wir fügen zu einem Unterpunkt hinzu. 'item' ist das Eltern-Item-Objekt.
                else if (item && item.items) {
                    parentItemList = item.items;
                } else {
                    console.error("Konnte die Liste der Unterpunkte nicht finden, um das neue Element hinzuzufügen.");
                    return;
                }

                parentItemList.push(newSubitem);

                // Den Zustand für das neue Item initialisieren.
                // Wir brauchen den listKey (die UUID), der bei einem tiefen Unterpunkt nicht direkt verfügbar ist.
                // Am einfachsten ist es, die ganze Liste neu zu rendern, da initializeState und renderLists alles neu aufbauen.

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
            saveItemName: async (event, listKey, item) => {
                event.stopPropagation();
                const saveButton = event.target;
                const editForm = saveButton.closest('.item-name-edit-form');
                const input = editForm.querySelector('input');
                const newName = input.value.trim();

                if (!istEingabeGueltig(newName)) return;

                if (newName && newName !== item.name) {
                    const updateNameRecursive = (items, targetKey, name) => {
                        // Sicherheitscheck: Wenn `items` undefiniert ist, abbrechen.
                        if (!items) return false;
                        for (let i = 0; i < items.length; i++) {
                            if (items[i].key === targetKey) {
                                items[i].name = name;
                                return true;
                            }
                            // Stelle sicher, dass item[i].items existiert, bevor du es weitergibst
                            if (items[i].items && updateNameRecursive(items[i].items, targetKey, name)) {
                                return true;
                            }
                        }
                        return false;
                    };

                    if (updateNameRecursive(my.listsData[listKey], item.key, newName)) {
                        await self.store.set({ key: studentId, listsData: my.listsData, listState: my.listState });
                        await renderLists();
                    }
                } else if (!newName) {
                    alert('Der Name darf nicht leer sein.');
                    input.focus();
                } else {
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
                // Entscheiden, welche Datenquelle (gespeicherte Liste oder temporäre Vorschau) verwendet wird
                const isPreview = !listKey;

                // Wenn wir in einer gespeicherten Liste sind und auf my.tempList zugreifen, würde es crashen.
                // Daher prüfen wir zuerst, ob wir im Vorschaumodus sind.
                if (isPreview) {
                    // Logik für die Vorschau (my.tempList)
                    if (!my.tempList || my.tempList.items.length === 1) {
                        alert('Die Liste muss mindestens ein Listenobjekt enthalten.');
                        return;
                    }
                } else {
                    // Logik für gespeicherte Listen (my.listsData)
                    if (!my.listsData[listKey]) {
                        console.error(`Liste mit key ${listKey} nicht gefunden.`);
                        return;
                    }
                    if (my.listsData[listKey].length === 1 && my.listsData[listKey][0].key === item.key) {
                        alert('Die Liste muss mindestens ein Listenobjekt enthalten. Löschen Sie stattdessen die ganze Liste.');
                        return;
                    }
                }

                // Wähle die korrekte Datenquelle aus
                const dataSource = isPreview ? my.tempList.items : my.listsData[listKey];

                function removeItemRecursive(items, targetKey) {
                    for (let i = 0; i < items.length; i++) {
                        if (items[i].key === targetKey) {
                            items.splice(i, 1);
                            return true;
                        }
                        if (items[i].items && removeItemRecursive(items[i].items, targetKey)) {
                            return true;
                        }
                    }
                    return false;
                }

                if (removeItemRecursive(dataSource, item.key)) {
                    if (!isPreview) {
                        // Nur bei gespeicherten Listen den Store aktualisieren
                        await self.store.set({ key: studentId, listsData: my.listsData, listState: my.listState });
                    }
                    // Die gesamte Ansicht neu rendern, um die Änderungen zu übernehmen
                    await renderLists();
                }
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
            onSaveNoteButton: async (event, item, itemHtml, noteInput, listKey, noteEditForm, editNoteBtn) => {
                event.stopPropagation();
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
                        newPlaceholder.textContent = self.text.addNoteText;
                        noteContainer.insertBefore(newPlaceholder, editNoteBtn);
                        currentNoteDisplay.remove();
                    } else if (currentNotePlaceholder) {
                        currentNotePlaceholder.style.display = '';
                    }
                }
                await self.store.set({key: studentId, listsData: my.listsData, listState: my.listState});
            },
            onEditNote: (event, itemHtml, item, noteDisplay, notePlaceholder, editNoteBtn, noteEditForm, noteInput) => {
                event.stopPropagation();

                if (noteDisplay) noteDisplay.style.display = 'none';
                if (notePlaceholder) notePlaceholder.style.display = 'none';
                editNoteBtn.style.display = 'none';
                noteEditForm.style.display = 'block';
                noteInput.value = item.note ? item.note : '';
                noteInput.focus();
            },
            onCancelNoteBtn: (event, noteEditForm, editNoteBtn, noteDisplay, notePlaceholder, item) => {
                event.stopPropagation();
                noteEditForm.style.display = 'none';
                editNoteBtn.style.display = 'block';
                if (item.note) {
                    if (noteDisplay) noteDisplay.style.display = 'block';
                } else {
                    if (notePlaceholder) notePlaceholder.style.display = 'block';
                }
            },
            onDeadlinePicker: async (event, item, listKey) => {
                const newDeadline = event.target.value || null;

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
                await self.store.set({key: studentId, listsData: my.listsData, listState: my.listState});
            },
            onCheckboxChange: async (event, item, listKey, itemKey, isEndPoint, itemHtml, listContent) => {
                my.listState[listKey].items[itemKey].checked = event.target.checked;
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

            /**
             * Bricht die Bearbeitung ab und stellt die normale Ansicht wieder her.
             */
            cancelListName: (event) => {
                event.stopPropagation();
                const wrapper = event.target.closest('.item-header').querySelector('.list-title-wrapper');
                wrapper.querySelector('.list-name-edit-form').style.display = 'none';
                wrapper.querySelector('.list-title-heading').style.display = 'block';
                // Den Bearbeiten-Button wieder einblenden
                event.target.closest('.item-header').querySelector('.edit-list-name-btn').style.display = 'inline-block';
            },

            /**
             * Speichert den neuen Namen der Liste.
             * @param {Event} event - Das Klick-Event.
             * @param {string} listKey - Die UUID der zu bearbeitenden Liste.
             */
            saveListName: async (event, listKey) => {
                event.stopPropagation();
                const wrapper = event.target.closest('.list-name-edit-form');
                const input = wrapper.querySelector('.list-name-input-field');
                const newName = input.value.trim();

                // Validierung
                if (!newName) {
                    alert('Der Listenname darf nicht leer sein.');
                    return;
                }

                // --- DIE NEUE, EINFACHE LOGIK ---
                // Ändere einfach das 'name'-Attribut des Listenobjekts. Der Key bleibt unberührt.
                my.listsData[listKey].name = newName;

                // Speichere die geänderten Daten im Store.
                await self.store.set({ key: studentId, listsData: my.listsData, listState: my.listState });

                // Rendere die gesamte Ansicht neu, um den neuen Namen anzuzeigen.
                await renderLists();
            }
        }

        this.start = async () => {
            try {
                console.log(await this.store.get());
                //await this.store.del("tniede2s")


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

                //console.log(await this.store.set());
                //await self.store.set({key: studentId, listsData: {}, listState: {}});
                //console.log(await this.store.get(studentId));


                my = await self.store.get(studentId) || {listsData: {}, listState: {}};
                my.listsData = my.listsData || {};
                my.listState = my.listState || {};
                my.tempList = null;
                my.currentItems = [];

                Object.keys(my.listsData).forEach(listKey => {
                    const list = my.listsData[listKey];
                    // Stellen Sie sicher, dass es ein gültiges Listenobjekt mit einem items-Array ist
                    if (list && Array.isArray(list.items)) {
                        // KORREKTER AUFRUF:
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
                    previewListText: self.text.previewListText,
                    firstItemNameText: self.text.firstItemName,
                    listName: self.text.listName,
                    listCreateButtonText: self.text.listCreateButtonText,
                    saveListText: self.text.saveListText,
                    myListText: self.text.myListText,
                    cancelText: self.text.cancelText,
                    onStartCreateButton: () => self.events.onStartCreateButton(createListForm, listForm, previewList, itemElement),
                    onSaveListButton: () => self.events.onSaveListButton(listForm, previewList, itemElement),
                    onCancelListButton: () => self.events.onCancelListButton(listForm, previewList),
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

        function calculateSubitemProgress(listKey, subitemKey, items, parentKey = '') {
            const [totalPoints, checkedPoints] = countItemPoints(items, listKey, parentKey);
            return totalPoints > 0 ? (checkedPoints / totalPoints) * 100 : 0;
        }

        // KORRIGIERTE VERSION von renderLists

        async function renderLists() {
            const itemElement = self.element.querySelector('#items');
            itemElement.innerHTML = '';

            console.log('Rendering lists with data:', JSON.stringify(my.listsData, null, 2));

            // KORREKTUR: Die Schleife wird angepasst, um mit der { name, items } Struktur zu arbeiten.
            for (const key of Object.keys(my.listsData)) {

                // 1. Das Listen-Objekt holen
                const listData = my.listsData[key];

                // 2. Prüfen, ob es ein gültiges Objekt mit einem 'items'-Array ist.
                if (!listData || !Array.isArray(listData.items)) {
                    console.warn(`Ungültige Datenstruktur für Liste ${key}, wird übersprungen.`);
                    continue; // Überspringe, wenn die Daten nicht passen
                }

                // 3. Den korrekten Anzeigenamen aus listData.name holen
                const listTitle = listData.name;

                const listHtml = document.createElement('div');
                listHtml.className = 'list-item';
                listHtml.dataset.id = key;

                // ... in der renderLists-Funktion, innerhalb der for-Schleife
                $.setContent(listHtml, $.html(self.html.renderList, {
                    listKey: key, // Die UUID für das data-id Attribut
                    listTitle: listTitle,
                    saveText: self.text.saveText,
                    cancelText: self.text.cancelText,
                    deleteText: self.text.deleteText,
                    editText: self.text.editText,
                    addSubpointText: self.text.addSubpointText,
                    subPointName: self.text.subPointText,

                    // Bestehende Events
                    onDeleteButton: () => self.events.onDeleteButton(key, itemElement, listHtml),
                    onClickToggleButton: () => self.events.onClickToggleButton(key, itemContent, toggleButton),
                    onAddSubitemToRoot: () => self.events.onAddSubitemToRoot(key),
                    confirmSubitem: () => self.events.confirmSubitem(key, null),

                    // --- NEUE EVENTS FÜR DIE NAMENSBEARBEITUNG ---
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

                // 4. Durch das korrekte 'items'-Array iterieren
                listData.items.forEach(item => {
                    renderItem(key, item, subitemList, itemContent, '');
                });

                // 5. Die Progress-Berechnung muss ebenfalls das korrekte Array verwenden
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

        function parentElementForId(rootElement, itemId) {
            return rootElement.querySelector(`[data-id="${itemId}"]`);
        }

        function findChildItemsInData(items, targetKeyPart, currentParentKey) {
            for (const item of items) {
                const fullKey = currentParentKey ? `${currentParentKey}§§§${item.key}` : item.key;
                const keyPart = fullKey.split('§§§').pop();
                if (keyPart === targetKeyPart) {
                    return item.items;
                }
                const found = findChildItemsInData(item.items, targetKeyPart, fullKey);
                if (found && found.length > 0) return found;
            }
            return [];
        }

        const updateParentState = (itemId, currentListKey, currentListContent) => {
            const parts = itemId.split('§§§');
            if (parts.length <= 3) return;
            console.log('Update parent state for', {itemId, currentListKey, currentListContent});
            parts.pop();
            parts.pop();
            parts.pop();

            const parentId = parts.join('§§§');
            const parentItemInState = my.listState[currentListKey].items[parentId];
            const parentElementInDOM = parentElementForId(currentListContent, parentId);

            if (parentItemInState && parentElementInDOM) {
                const childItems = findChildItemsInData(my.listsData[currentListKey], parentId.split('§§§').pop(), parts.slice(0, -1).join('§§§'));

                const allChildrenChecked = childItems.every(child => {
                    const childKeyInState = `${parentId}§§§${child.key}`;
                    return my.listState[currentListKey].items[childKeyInState]?.checked;
                });
                console.log('allChildrenChecked:' + (allChildrenChecked));

                parentItemInState.checked = allChildrenChecked;
                const parentCheckboxInDOM = parentElementInDOM.querySelector('.subitem--checkbox, .point--checkbox');

                if (parentCheckboxInDOM) {
                    parentCheckboxInDOM.checked = allChildrenChecked;
                }

                const parentProgressElement = parentElementInDOM.querySelector('.subitem-progress');
                if (parentProgressElement) {
                    const parentSubitemProgress = calculateSubitemProgress(currentListKey, parentId, childItems, parentId);
                    parentProgressElement.textContent = `${Math.round(parentSubitemProgress)}%`;
                }

                updateParentState(parentId, currentListKey, currentListContent);
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

