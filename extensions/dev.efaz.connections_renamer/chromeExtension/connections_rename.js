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
        const storage_key = "dev.efaz.connections_renamer"
        function getChromeURL(resource) {
            try {
                // This is for Efaz's Roblox Extension support
                if (chrome.runtime.getManifest()["homepage_url"] == "https://www.efaz.dev/roblox-extension") {
                    // This is run under bundled extension [{extension_name}/{resource}]
                    return chrome.runtime.getURL("{extension_name_this_is_replace_when_building_bundle_with_folder_name_if_youre_wondering}" + "/" + resource)
                } else {
                    return chrome.runtime.getURL(resource)
                }
            } catch (_) {
                // This is run under mini extension [{resource}]
                return chrome.runtime.getURL(resource)
            }
        }
        async function loopThroughArrayAsync(array, callback) {
            if (typeof (array) == "object") {
                if (Array.isArray(array)) {
                    for (let a = 0; a < array.length; a++) {
                        await callback(a, array[a])
                    }
                } else {
                    var generated_keys = Object.keys(array);
                    for (let a = 0; a < generated_keys.length; a++) {
                        await callback(generated_keys[a], array[generated_keys[a]])
                    }
                }
            }
        }
        function getTran(id) { 
            if (!(chrome.i18n.getMessage(storage_key.replaceAll(".", "_") + "_" + id) == "")) {
                return chrome.i18n.getMessage(storage_key.replaceAll(".", "_") + "_" + id)
            } else if (!(chrome.i18n.getMessage(id.replaceAll(".", "_")) == "")) {
                return chrome.i18n.getMessage(id.replaceAll(".", "_"))
            }
        }
        async function getSettings(storage_key, callback) {
            return await fetch(getChromeURL("settings.json")).then((res) => {
                if (res.ok) { return res.json(); }
            }).then(async (jso) => {
                if (jso) {
                    let te = await storage.get(storage_key);
                    let user_settings = {}
                    if (te && te[storage_key]) {
                        user_settings = te;
                    } else if (jso["old_name"]) {
                        let old = await storage.get(jso["old_name"]);
                        if (old) {
                            user_settings = old;
                            user_settings = {[storage_key]: user_settings[jso["old_name"]]}
                        }
                    }
                    if (!(user_settings[storage_key])) { user_settings[storage_key] = {} }
                    await loopThroughArrayAsync(jso["settings"], async (i, v) => {
                        if (typeof(user_settings[storage_key][i]) == "undefined") {
                            if (!(typeof(v["default"]) == "undefined")) {
                                if (!(getTran(i + "_default") == null)) {
                                    user_settings[storage_key][i] = (getTran(i + "_default"))
                                } else {
                                    user_settings[storage_key][i] = (v["default"])
                                }
                            }
                        }
                    })
                    if (callback) { callback(user_settings) }
                    return user_settings
                }
            })
        }
        function timeout(func, ms) { setTimeout(func, ms); }
        getSettings(storage_key, function (items) {
            let enabled = true;
            let settings = items[storage_key];
            if (typeof (settings["enabled"]) == "boolean") { enabled = settings["enabled"] };
            if (enabled == true) {
                let tab = window.location
                if (tab.href) {
                    const localeSets = {
                        "English": ["Connections", "Connection", "Connect", "Connection", "Add ", "Un", "Remove "],
                        "Español": ["Conexiones", "Conexion", "Conectar", "conexión", "Añadir ", "Eliminar ", "Eliminar "],
                        "Français": ["Connexions", "Connexion", "Connexion", "connexion", "Ajouter une ", "Supprimer ", "Supprimer "],
                    }
                    if (tab.hostname == "www.roblox.com") {
                        /* Set Names */
                        let newName = settings["newName"];
                        let newNameWithoutEndingS = settings["newName"].replace(/ies$/, "y").replace(/es$/, "").replace(/s$/, "");
                        let amountOfSecondsBeforeLoop = (typeof(settings["startTime"]) == "string" && Number(settings["startTime"])) ? Number(settings["startTime"]) : 75
                        
                        /* Clean New Name to prevent crashes */
                        var div = document.createElement("div");
                        div.innerHTML = newName;
                        newName = div.textContent.replace(/<\/[^>]+(>|$)/g, "");
                        
                        var div = document.createElement("div");
                        div.innerHTML = newNameWithoutEndingS;
                        newNameWithoutEndingS = div.textContent.replace(/<\/[^>]+(>|$)/g, "");

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
                            '.text-content',
                            'div.popover-content > div > li > button',
                            ".friends-title",
                            '.friends-subtitle',
                            ".roseal-tooltip",
                            ".server-list-header",
                            "#friendsTooltip",
                            ".people-list-header",
                            ".profile-header-social-count-label"
                        ].join(", ")
                        
                        /* Run rename loop */
                        let localeSet = null
                        function blacklisted(header, attribute) {
                            const ngBind = header.getAttribute("ng-bind");
                            const ngBindHtml = header.getAttribute("ng-bind-html");
                            const ngIf = header.getAttribute("ng-if");
                            if (ngBind && (ngBind.includes("group.description") || ngBind === "$ctrl.data.currentRoleName" || ngBind === "role.name" || ngBind.includes("role.name") || ngBind.includes("currentRoleFilter") || ngBind.includes("post."))) { return true; }
                            if (ngBindHtml && (ngBindHtml === "piece.content" || ngBindHtml.includes("log") || ngBindHtml.includes("post.body") || ngBindHtml.includes("library.currentGroup"))) { return true; }
                            if (ngIf && ngIf.includes("chatUser.previewMessage")) { return true; }
                            return false;
                        }
                        function addRename(header, k) {
                            function m(a) {
                                if (!header[a]) { return }
                                if (blacklisted(header, a)) { return }
                                let val = header[a]
                                if (val.includes(localeSet[0]) ) {
                                    val = val.replaceAll(localeSet[0], newName)
                                }
                                if (val.includes(localeSet[0].toLowerCase())) {
                                    val = val.replaceAll(localeSet[0].toLowerCase(), newName.toLowerCase())
                                }
                                if (val.includes(localeSet[1])) {
                                    val = val.replaceAll(localeSet[1], newNameWithoutEndingS)
                                }
                                if (val.includes(localeSet[1].toLowerCase())) {
                                    val = val.replaceAll(localeSet[1].toLowerCase(), newNameWithoutEndingS.toLowerCase())
                                }
                                if (val.includes(localeSet[2])) {
                                    val = val.replaceAll(localeSet[2], newName)
                                }
                                if (val.includes(localeSet[2].toLowerCase())) {
                                    val = val.replaceAll(localeSet[2].toLowerCase(), newName.toLowerCase())
                                }
                                if (val.includes(localeSet[3])) {
                                    val = val.replaceAll(localeSet[3], newNameWithoutEndingS.toLowerCase())
                                }
                                if (header[a] != val) { header[a] = val }
                            }
                            if (k) {
                                m(k)
                            } else {
                                m("innerHTML")
                                m("placeholder")
                                m("title")
                            }
                        }
                        function injectRename() {
                            let meta_tags = document.querySelectorAll("meta")
                            let clear_local_set = false;
                            for (let i = 0; i < meta_tags.length; i++) {
                                if (meta_tags[i].getAttribute("name") == "locale-data") {
                                    localeSet = localeSets[meta_tags[i].getAttribute("data-language-name")]
                                }
                            }
                            if (!(localeSet)) {
                                localeSet = localeSets["English"];
                                clear_local_set = true;
                            }

                            let buttons_text = document.querySelectorAll(".web-blox-css-tss-1283320-Button-textContainer")
                            for (let i = 0; i < buttons_text.length; i++) {
                                let header = buttons_text[i]
                                if (blacklisted(header)) { continue; } 
                                let innerHTML = header.innerHTML
                                if (innerHTML.includes(localeSet[6] + localeSet[3]) && !(innerHTML.includes(newNameWithoutEndingS))) {
                                    header.innerHTML = innerHTML.replace(localeSet[6] + localeSet[3], localeSet[5] + newNameWithoutEndingS.toLowerCase())
                                } else if (innerHTML.includes(localeSet[1]) && !(innerHTML.includes(newNameWithoutEndingS))) {
                                    header.innerHTML = innerHTML.replace(localeSet[1], newNameWithoutEndingS)
                                } else if (innerHTML.includes(localeSet[1].toLowerCase()) && !(innerHTML.includes(newNameWithoutEndingS.toLowerCase()))) {
                                    header.innerHTML = innerHTML.replace(localeSet[1].toLowerCase(), newNameWithoutEndingS.toLowerCase())
                                } else if (innerHTML.includes(localeSet[3]) && !(innerHTML.includes(newNameWithoutEndingS.toLowerCase()))) {
                                    header.innerHTML = innerHTML.replace(localeSet[3], newNameWithoutEndingS.toLowerCase())
                                }
                            }

                            let most_text_frames = document.querySelectorAll(".ng-binding")
                            for (let i = 0; i < most_text_frames.length; i++) {
                                let header = most_text_frames[i]
                                if (settings["massEdit"] == true) {
                                    addRename(header)
                                }
                            }

                            let friends_subtitle = document.querySelectorAll(".friends-subtitle")
                            for (let i = 0; i < friends_subtitle.length; i++) {
                                let header = friends_subtitle[i]
                                if (header.childNodes && header.childNodes[0] && header.childNodes[0].textContent.includes(localeSet[0]) && !(header.childNodes[0].textContent.includes(newName))) {
                                    header.childNodes[0].textContent = header.childNodes[0].textContent.replace(localeSet[0], newName)
                                }
                            }

                            let friend_list_titles = document.querySelectorAll(".friends-carousel-tile-labels")
                            for (let i = 0; i < friend_list_titles.length; i++) {
                                let header = friend_list_titles[i]
                                let innerHTML = header.innerHTML
                                if (header.nodeName == "DIV" && innerHTML.includes(localeSet[2])) {
                                    if (blacklisted(header)) { continue; } 
                                    if (!(innerHTML.includes(localeSet[4] + newName))) {
                                        header.innerHTML = innerHTML.replaceAll(localeSet[2], localeSet[4] + newName)
                                    }
                                    addRename(header)
                                }
                            }

                            let all_links = document.querySelectorAll("a")
                            for (let i = 0; i < all_links.length; i++) {
                                let header = all_links[i]
                                if (settings["massEdit"] == true) {
                                    if (!(header.className == "profile-header-social-count")) {
                                        if (header.childNodes.length > 0) {
                                            loopThroughArrayAsync(header.childNodes, (_, v) => {
                                                addRename(v)
                                            })
                                        } else {
                                            addRename(header)
                                        }
                                    } else {
                                        addRename(header, "title")
                                    }
                                }
                            }

                            let all_labels = document.querySelectorAll("label")
                            for (let i = 0; i < all_labels.length; i++) {
                                let header = all_labels[i]
                                if (settings["massEdit"] == true) {
                                    addRename(header)
                                }
                            }

                            let query_selectors = document.querySelectorAll(query_names)
                            for (let i = 0; i < query_selectors.length; i++) {
                                let header = query_selectors[i]
                                addRename(header)
                            }

                            if (window.location.pathname.includes("/connections") || window.location.pathname.includes("/friends")) {    
                                if (settings["changeTitleHtml"] == true) {
                                    let titles = document.querySelectorAll("title")
                                    for (let i = 0; i < titles.length; i++) {
                                        let header = titles[i]
                                        let val = header.textContent
                                        if (val.includes(localeSet[0])) {
                                            header.textContent = val.replaceAll(localeSet[0], newName)
                                        }
                                    }
                                }
                            }
                            if (clear_local_set == true) { localeSet = null; }
                            timeout(() => injectRename(), amountOfSecondsBeforeLoop)
                        }
                        injectRename()
                    }
                }
            }
        });
    } catch (err) {
        console.warn(`Failed to insert rename into this tab. Error Message: ${err.message}`)
    }
}())