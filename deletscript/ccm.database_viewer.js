ccm.files["ccm.database_viewer.js"] = {
    name: "database_viewer",
    ccm: "../../libs/ccm/ccm.js",
    config: {
        store: ["ccm.store", { url: "https://ccm2.inf.h-brs.de", name: "tniede2s_mycollection" }],
        css: ["ccm.load", "./style.css"],
        helper: ["ccm.load", "https://ccmjs.github.io/akless-components/modules/versions/helper-8.4.2.min.mjs"],
        html: {
            main: `
                <div class="database-viewer">
                    <h1>Datenbank Inhalte</h1>
                    <div id="entries-container"></div>
                </div>
            `,
            entry: `
                <div class="entry-item" data-key="%key%">
                    <div class="entry-content">
                        <h3>Schlüssel: %key%</h3>
                        <pre contenteditable="true" class="editable-content">%content%</pre>
                    </div>
                    <div class="entry-actions">
                        <button class="save-btn">Speichern</button>
                        <button class="delete-btn">Löschen</button>
                    </div>
                </div>
            `
        }
    },

    Instance: function () {
        let self = this;

        this.start = async () => {
            const mainHtml = self.ccm.helper.html(self.html.main);
            self.element.appendChild(mainHtml);

            const entriesContainer = self.element.querySelector('#entries-container');
            await this.loadEntries(entriesContainer);
        };

        this.loadEntries = async (container) => {
            const entries = await self.store.get({});
            console.log("Geladene Einträge:", entries);

            if (!Array.isArray(entries) || entries.length === 0) {
                container.innerHTML = '<p>Keine Einträge in der Datenbank gefunden.</p>';
                return;
            }

            console.log(`Anzahl geladener Einträge: ${entries.length}`);
            let renderedCount = 0;

            entries.forEach(entry => {
                try {
                    this.renderEntry(entry, container);
                    renderedCount++;
                } catch (error) {
                    console.error(`Fehler beim Rendern von Eintrag:`, entry, error);
                }
            });

            console.log(`Anzahl gerenderter Einträge: ${renderedCount}`);
            if (renderedCount === 0) {
                container.innerHTML = '<p>Keine Einträge konnten gerendert werden. Überprüfe die Konsole für Details.</p>';
            }
        };

        this.renderEntry = (entry, container) => {
            let contentString;
            try {
                contentString = JSON.stringify(entry, (key, value) => {
                    // Vermeide zirkuläre Referenzen
                    if (typeof value === 'object' && value !== null) {
                        const seen = new WeakSet();
                        return JSON.parse(JSON.stringify(value, (k, v) => {
                            if (typeof v === 'object' && v !== null) {
                                if (seen.has(v)) return '[Zirkuläre Referenz]';
                                seen.add(v);
                            }
                            return v;
                        }));
                    }
                    return value;
                }, 2);
            } catch (error) {
                console.error(`Fehler beim Parsen von Eintrag ${entry.key || 'Unbekannt'}:`, error);
                contentString = `Fehler beim Anzeigen des Inhalts: ${error.message}\nRohdaten: ${JSON.stringify(Object.keys(entry))}`;
            }

            const entryHtml = self.ccm.helper.html(self.html.entry, {
                key: entry.key || "Unbekannt",
                content: contentString
            });

            const editableContent = entryHtml.querySelector('.editable-content');
            const saveButton = entryHtml.querySelector('.save-btn');
            const deleteButton = entryHtml.querySelector('.delete-btn');

            // Speichern-Button
            saveButton.addEventListener('click', async () => {
                try {
                    const updatedContent = editableContent.textContent.trim();
                    const updatedEntry = JSON.parse(updatedContent);
                    if (!updatedEntry.key && entry.key) {
                        alert("Der Schlüssel (key) darf nicht entfernt werden!");
                        return;
                    }
                    await self.store.set(updatedEntry);
                    console.log(`Eintrag mit Schlüssel "${updatedEntry.key || 'Unbekannt'}" wurde aktualisiert.`);
                    alert("Eintrag erfolgreich gespeichert!");
                } catch (error) {
                    console.error(`Fehler beim Speichern von Eintrag ${entry.key || 'Unbekannt'}:`, error);
                    alert("Fehler beim Speichern: Ungültiges JSON oder Serverproblem.");
                }
            });

            // Löschen-Button
            deleteButton.addEventListener('click', async () => {
                if (confirm(`Möchtest du den Eintrag mit Schlüssel "${entry.key || 'Unbekannt'}" wirklich löschen?`)) {
                    await this.deleteEntry(entry.key, entryHtml);
                }
            });

            container.appendChild(entryHtml);
        };

        this.deleteEntry = async (key, entryElement) => {
            try {
                if (key) {
                    await self.store.del(key);
                    console.log(`Eintrag mit Schlüssel "${key}" wurde gelöscht.`);
                } else {
                    console.warn("Kein Schlüssel vorhanden, kann nicht aus der Datenbank gelöscht werden.");
                }
                entryElement.remove();

                const remainingEntries = await self.store.get({});
                if (!remainingEntries || remainingEntries.length === 0) {
                    self.element.querySelector('#entries-container').innerHTML = '<p>Keine Einträge in der Datenbank gefunden.</p>';
                }
            } catch (error) {
                console.error(`Fehler beim Löschen des Eintrags "${key}":`, error);
                alert("Fehler beim Löschen des Eintrags. Bitte versuche es erneut.");
            }
        };
    }
};
