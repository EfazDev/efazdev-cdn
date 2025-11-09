/* 

Efaz's Roblox Connections Renamer
By: EfazDev
Page: https://www.efaz.dev/roblox-connections-rename

inject.js:
    - Content script that replaces Connections with Friends

*/

(function () { // Prevent changes made using the Inspect console.
    const storage = chrome.storage.sync;

    try {
        const storage_key = "dev.efaz.connections_renamer";
        function getChromeURL(resource) {
            try {
                // This is for Efaz's Roblox Extension support
                if (chrome.runtime.getManifest()["homepage_url"] == "https://www.efaz.dev/roblox-extension") {
                    // This is run under bundled extension [{extension_name}/{resource}]
                    return chrome.runtime.getURL("dev.efaz.connections_renamer" + "/" + resource);
                } else {
                    return chrome.runtime.getURL(resource);
                }
            } catch (_) {
                // This is run under mini extension [{resource}]
                return chrome.runtime.getURL(resource);
            }
        }
        async function loopThroughArrayAsync(array, callback) {
            if (Array.isArray(array)) {
                for (let a = 0; a < array.length; a++) {
                    await callback(a, array[a]);
                }
            } else if (array && typeof array === "object") {
                for (const a of Object.keys(array)) {
                    await callback(a, array[a]);
                }
            }
        }
        function loopThroughArray(array, callback) {
            if (Array.isArray(array)) {
                for (let a = 0; a < array.length; a++) {
                    callback(a, array[a]);
                }
            } else if (array && typeof array === "object") {
                for (const a of Object.keys(array)) {
                    callback(a, array[a]);
                }
            }
        }
        function getTran(id) {
            if (!(chrome.i18n.getMessage(storage_key.replaceAll(".", "_") + "_" + id) == "")) {
                return chrome.i18n.getMessage(storage_key.replaceAll(".", "_") + "_" + id);
            } else if (!(chrome.i18n.getMessage(id.replaceAll(".", "_")) == "")) {
                return chrome.i18n.getMessage(id.replaceAll(".", "_"));
            }
        }
        async function getSettings(storage_key, callback) {
            return await fetch(getChromeURL("settings.json")).then((res) => {
                if (res.ok) { return res.json(); }
            }).then(async (jso) => {
                if (jso) {
                    let te = await storage.get(storage_key);
                    let user_settings = {};
                    if (te && te[storage_key]) {
                        user_settings = te;
                    } else if (jso["old_name"]) {
                        let old = await storage.get(jso["old_name"]);
                        if (old) {
                            user_settings = old;
                            user_settings = { [storage_key]: user_settings[jso["old_name"]] };
                        }
                    }
                    if (!(user_settings[storage_key])) { user_settings[storage_key] = {}; }
                    await loopThroughArrayAsync(jso["settings"], async (i, v) => {
                        if (typeof (user_settings[storage_key][i]) == "undefined") {
                            if (!(typeof (v["default"]) == "undefined")) {
                                if (!(getTran(i + "_default") == null)) {
                                    user_settings[storage_key][i] = (getTran(i + "_default"));
                                } else {
                                    user_settings[storage_key][i] = (v["default"]);
                                }
                            }
                        }
                    });
                    if (callback) { callback(user_settings); }
                    return user_settings;
                }
            });
        }
        function timeout(func, ms) { setTimeout(func, ms); }
        getSettings(storage_key, function (items) {
            let enabled = true;
            let settings = items[storage_key];
            if (typeof (settings["enabled"]) == "boolean") { enabled = settings["enabled"]; };
            if (enabled == true) {
                let tab = window.location;
                if (tab.href) {
                    const localeSets = {
                        "English": ["Connections", "Connection", "Connect", "Connection", "Add ", "Un", "Remove "],
                        "Español": ["Conexiones", "Conexion", "Conectar", "conexión", "Añadir ", "Eliminar ", "Eliminar "],
                        "Français": ["Connexions", "Connexion", "Connexion", "connexion", "Ajouter une ", "Supprimer ", "Supprimer "],
                        "Deutsch": ["Connections", "Connection", "Connect", "Connection", "Connection hinzufügen", "Beenden ", "Connection entfernen"],
                        "Italiano": ["Contatti", "Contatto", "Collegati", "Contatto", "Aggiungi ", "Rimuovi ", "Rimuovi "],
                    };
                    if (tab.hostname == "www.roblox.com") {
                        /* Set Names */
                        let newName = settings["newName"];
                        let newNameWithoutEndingS = settings["newNameWithoutEndingS"];

                        /* Clean New Name to prevent crashes */
                        let filter_name = document.createElement("div");
                        filter_name.innerHTML = newName;
                        newName = filter_name.textContent.replace(/<\/[^>]+(>|$)/g, "");
                        filter_name = null;

                        let filter_name2 = document.createElement("div");
                        filter_name2.innerHTML = newNameWithoutEndingS;
                        newNameWithoutEndingS = filter_name2.textContent.replace(/<\/[^>]+(>|$)/g, "");
                        filter_name2 = null;

                        /* Set basic query names to find */
                        let query_names = [
                            '.font-header-2.dynamic-ellipsis-item',
                            ".section-title.ng-binding ng-scope.font-header-1",
                            '.web-blox-css-mui-184cbry',
                            '.play-with-others-text',
                            '.amount',
                            '.modal-title',
                            '.modal-message',
                            '.section-content-off',
                            '.text-pastname',
                            '.roseal-menu-item > button',
                            '.item-description',
                            '.btn-toggle-label',
                            '.text-description',
                            '.input-field',
                            '.text-label-large',
                            '.text-caption-large',
                            '.friends-filter-searchbar-input',
                            '.text-body-large',
                            '.text-heading-large',
                            '.text-label-small',
                            '.text-caption-small',
                            '.text-body-small',
                            '.text-heading-small',
                            '.mutual-friends-tooltip-label',
                            '.text-label',
                            '.section-content > .small',
                            'h3',
                            '.text-pastname.ng-binding',
                            '#private-server-tooltip',
                            '.back-link',
                            '.font-body',
                            '.friends-in-server-label',
                            '.rbx-selection-label',
                            '.text-emphasis',
                            '.create-friend-link-btn > button',
                            '.text-content',
                            'div.popover-content > div > li > button',
                            ".friends-title",
                            ".roseal-tooltip",
                            ".server-list-header",
                            "#friendsTooltip",
                            ".avatar-status-container > div.avatar-card-label",
                            ".people-list-header > h2",
                            ".profile-header-social-count-label",
                            "button.content-action-utility > .text-truncate-end",
                            "a.content-action-utility > .text-truncate-end",
                            "#friend-action"
                        ];
                        let custom_renames = [
                            ".web-blox-css-tss-1283320-Button-textContainer",
                            ".friends-carousel-tile-labels",
                            ".friends-subtitle",
                            ".friends-header > div > h2",
                            ".header-left > h2",
                            "a",
                            "title"
                        ];
                        if (settings["massEdit"] == true) { query_names.push(".ng-binding"); query_names.push("label"); };
                        query_names = query_names.join(", ");
                        custom_renames = custom_renames.join(", ");

                        /* Run rename loop */
                        let localeSet = null;
                        let observer = null;
                        let clear_local_set = false;
                        function blacklisted(header, attribute) {
                            const ngBind = header.getAttribute("ng-bind");
                            const ngBindHtml = header.getAttribute("ng-bind-html");
                            const ngIf = header.getAttribute("ng-if");
                            if (header.getAttribute("ng-renamed5") == "true") { return true; }
                            if (ngBind && (ngBind.includes("group.description") || ngBind === "$ctrl.data.currentRoleName" || ngBind === "role.name" || ngBind.includes("role.name") || ngBind.includes("currentRoleFilter") || ngBind.includes("post."))) { return true; }
                            if (ngBindHtml && (ngBindHtml === "piece.content" || ngBindHtml.includes("log") || ngBindHtml.includes("post.body") || ngBindHtml.includes("library.currentGroup"))) { return true; }
                            if (ngIf && ngIf.includes("chatUser.previewMessage")) { return true; }
                            return false;
                        }
                        function addRename(header, k) {
                            function m(a) {
                                if (!header[a]) { return; }
                                if (blacklisted(header, a)) { return; }
                                let val = header[a];
                                let changed = false;
                                if (val.includes(localeSet[0])) {
                                    val = val.replaceAll(localeSet[0], newName);
                                    changed = true;
                                }
                                if (val.includes(localeSet[0].toLowerCase())) {
                                    val = val.replaceAll(localeSet[0].toLowerCase(), newName.toLowerCase());
                                    changed = true;
                                }
                                if (val.includes(localeSet[1])) {
                                    val = val.replaceAll(localeSet[1], newNameWithoutEndingS);
                                    changed = true;
                                }
                                if (val.includes(localeSet[1].toLowerCase())) {
                                    val = val.replaceAll(localeSet[1].toLowerCase(), newNameWithoutEndingS.toLowerCase());
                                    changed = true;
                                }
                                if (val == localeSet[2]) {
                                    val = val.replaceAll(localeSet[2], newName);
                                    changed = true;
                                }
                                if (val == localeSet[2].toLowerCase()) {
                                    val = val.replaceAll(localeSet[2], newName.toLowerCase());
                                    changed = true;
                                }
                                if (val.includes(localeSet[2] + "ed")) {
                                    val = val.replaceAll(localeSet[2] + "ed", newNameWithoutEndingS + "ed");
                                    changed = true;
                                }
                                if (val.includes((localeSet[2] + "ed").toLowerCase())) {
                                    val = val.replaceAll((localeSet[2] + "ed").toLowerCase(), newName.toLowerCase() + "ed");
                                    changed = true;
                                }
                                if (val.includes(localeSet[3])) {
                                    val = val.replaceAll(localeSet[3], newNameWithoutEndingS.toLowerCase());
                                    changed = true;
                                }
                                if (changed == true) { header[a] = val; }
                            }
                            if (k) {
                                m(k);
                            } else {
                                m("innerHTML");
                                m("placeholder");
                                m("title");
                            }
                        }
                        function setLanguage() {
                            clear_local_set = false;
                            if (!(localeSet)) {
                                let meta_tag = document.querySelector('meta[name="locale-data"]');
                                if (meta_tag) { localeSet = localeSets[meta_tag.getAttribute("data-language-name")]; }
                                if (!(localeSet)) {
                                    localeSet = localeSets["English"];
                                    clear_local_set = true;
                                }
                                meta_tag = null;
                            }
                            return clear_local_set;
                        }
                        function handleCustomRename(header) {
                            if (header.matches(".web-blox-css-tss-1283320-Button-textContainer")) {
                                if (blacklisted(header)) { return; }
                                let innerHTML = header.innerHTML;
                                if (innerHTML.includes(localeSet[6] + localeSet[3]) && !(innerHTML.includes(newNameWithoutEndingS))) {
                                    header.innerHTML = innerHTML.replace(localeSet[6] + localeSet[3], localeSet[5] + newNameWithoutEndingS.toLowerCase());
                                } else if (innerHTML.includes(localeSet[1]) && !(innerHTML.includes(newNameWithoutEndingS))) {
                                    header.innerHTML = innerHTML.replace(localeSet[1], newNameWithoutEndingS);
                                } else if (innerHTML.includes(localeSet[1].toLowerCase()) && !(innerHTML.includes(newNameWithoutEndingS.toLowerCase()))) {
                                    header.innerHTML = innerHTML.replace(localeSet[1].toLowerCase(), newNameWithoutEndingS.toLowerCase());
                                } else if (innerHTML.includes(localeSet[3]) && !(innerHTML.includes(newNameWithoutEndingS.toLowerCase()))) {
                                    header.innerHTML = innerHTML.replace(localeSet[3], newNameWithoutEndingS.toLowerCase());
                                }
                            } else if (header.matches(".friends-subtitle, .header-left > h2, .friends-header > div > h2")) {
                                if (header.childNodes && header.childNodes[0]) {
                                    let child_node = header.childNodes[0];
                                    let txt_content = child_node.textContent;
                                    if (txt_content.includes(localeSet[0])) {
                                        child_node.textContent = child_node.textContent.replaceAll(localeSet[0], newName);
                                    } else if (txt_content.includes(localeSet[1])) {
                                        child_node.textContent = child_node.textContent.replaceAll(localeSet[1], newNameWithoutEndingS);
                                    }
                                } else {
                                    let txt_content = header.textContent;
                                    if (txt_content.includes(localeSet[0])) {
                                        header.textContent = txt_content.replaceAll(localeSet[0], newName);
                                    } else if (txt_content.includes(localeSet[1])) {
                                        header.textContent = txt_content.replaceAll(localeSet[1], newNameWithoutEndingS);
                                    }
                                }
                            } else if (header.matches(".friends-carousel-tile-labels")) {
                                let innerHTML = header.innerHTML;
                                if (header.nodeName == "DIV" && innerHTML.includes(localeSet[2])) {
                                    if (blacklisted(header)) { return; }
                                    if (!(innerHTML.includes(localeSet[4] + newName))) {
                                        header.innerHTML = innerHTML.replaceAll(localeSet[2], localeSet[4] + newName);
                                    }
                                    addRename(header);
                                }
                            } else if (header.matches("a")) {
                                if (settings["massEdit"] == true) {
                                    if (!(header.getAttribute("class") == "profile-header-social-count")) {
                                        if (header.childNodes.length > 0) {
                                            loopThroughArray(header.childNodes, (_, v) => {
                                                addRename(v);
                                            });
                                        } else {
                                            addRename(header);
                                        }
                                    } else {
                                        addRename(header, "title");
                                    }
                                }
                            } else if (window.location.pathname.includes("/connections") || window.location.pathname.includes("/friends")) {
                                if (header.matches("title") && settings["changeTitleHtml"] == true) {
                                    let val = header.textContent;
                                    if (val.includes(localeSet[0])) {
                                        header.textContent = val.replaceAll(localeSet[0], newName);
                                    }
                                }
                            }
                        }
                        function init() {
                            clear_local_set = setLanguage();
                            observer = new MutationObserver((mutations) => {
                                mutations.forEach(m => {
                                    m.addedNodes.forEach(node => {
                                        if (node.nodeType === Node.ELEMENT_NODE) {
                                            if (node.matches(query_names)) { addRename(node); }
                                            if (node.matches(custom_renames)) { handleCustomRename(node); }
                                            node.querySelectorAll(query_names).forEach(desc => { addRename(desc); });
                                            node.querySelectorAll(custom_renames).forEach(desc => { handleCustomRename(desc); });
                                        }
                                    });
                                    if (m.target instanceof Element) {
                                        if (m.target.matches(query_names)) {
                                            addRename(m.target);
                                        };
                                        if (m.target.matches(custom_renames)) {
                                            handleCustomRename(m.target);
                                        };
                                    } else if (m.target.nodeType === Node.TEXT_NODE) {
                                        let parent = m.target.parentElement;
                                        if (parent) {
                                            if (parent.matches(query_names)) { addRename(parent); }
                                            if (parent.matches(custom_renames)) { handleCustomRename(parent); }
                                        }
                                    }
                                });
                            });
                            observer.observe(document.documentElement, {
                                childList: true,
                                subtree: true,
                                characterData: true
                            });
                            let query_selectors = document.querySelectorAll(query_names);
                            for (let i = 0; i < query_selectors.length; i++) {
                                let header = query_selectors[i];
                                addRename(header);
                            }
                            let custom_renaming = document.querySelectorAll(custom_renames);
                            for (let i = 0; i < custom_renaming.length; i++) {
                                let header = custom_renaming[i];
                                handleCustomRename(header);
                            }
                            query_selectors = null;
                            custom_renaming = null;
                            if (clear_local_set == true) { localeSet = null; }
                        }
                        if (document.readyState === "loading") {
                            document.addEventListener("DOMContentLoaded", () => {
                                init();
                            });
                        } else { init(); }
                    }
                }
            }
        });
    } catch (err) {
        console.warn(`Failed to insert rename into this tab. Error Message: ${err.message}`);
    }
}());