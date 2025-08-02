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
                    return chrome.runtime.getURL("dev.efaz.connections_renamer" + "/" + resource)
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
            return fetch(getChromeURL("settings.json")).then((res) => {
                if (res.ok) { return res.json(); }
            }).then(jso => {
                if (jso) {
                    return storage.get(storage_key).then(async (user_settings) => {
                        if (!user_settings) { user_settings = {} }
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
                    })
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
                        /* Clean New Name to prevent crashes */
                        function injectRename() {
                            /* Get Set Roblox Language */
                            let meta_tags = document.querySelectorAll("meta")
                            let localeSet = null
                            for (let i = 0; i < meta_tags.length; i++) {
                                if (meta_tags[i].getAttribute("name") == "locale-data") {
                                    localeSet = localeSets[meta_tags[i].getAttribute("data-language-name")]
                                }
                            }
                            if (!(localeSet)) {
                                localeSet = localeSets["English"]
                            }

                            function blacklisted(header, attribute) {
                                if ((header.getAttribute("ng-bind") && header.getAttribute("ng-bind").includes("group.description"))) { return true; }
                                if (header.getAttribute("ng-bind") == "$ctrl.data.currentRoleName" || header.getAttribute("ng-bind") == "role.name" || (header.getAttribute("ng-bind") && header.getAttribute("ng-bind").includes("role.name")) || (header.getAttribute("ng-bind") && header.getAttribute("ng-bind").includes("currentRoleFilter"))) { return true; }
                                if (header.getAttribute("ng-bind-html") == "piece.content" || (header.getAttribute("ng-if") && header.getAttribute("ng-if").includes("chatUser.previewMessage"))) { return true; }
                                if ((header.getAttribute("ng-bind-html") && header.getAttribute("ng-bind-html").includes("log"))) { return true; }
                                if ((header.getAttribute("ng-bind-html") && header.getAttribute("ng-bind-html").includes("post.body")) || (header.getAttribute("ng-bind-html") && header.getAttribute("ng-bind-html").includes("library.currentGroup")) || (header.getAttribute("ng-bind") && header.getAttribute("ng-bind").includes("post."))) { return true; }
                                return false;
                            }

                            function addRename(header) {
                                function m(a) {
                                    if (!header[a]) { return }
                                    if (blacklisted(header, a)) { return }
                                    if (header[a].includes(localeSet[0]) ) {
                                        header[a] = header[a].replaceAll(localeSet[0], newName)
                                    }
                                    if (header[a].includes(localeSet[0].toLowerCase())) {
                                        header[a] = header[a].replaceAll(localeSet[0].toLowerCase(), newName.toLowerCase())
                                    }
                                    if (header[a].includes(localeSet[1])) {
                                        header[a] = header[a].replaceAll(localeSet[1], newNameWithoutEndingS)
                                    }
                                    if (header[a].includes(localeSet[1].toLowerCase())) {
                                        header[a] = header[a].replaceAll(localeSet[1].toLowerCase(), newNameWithoutEndingS.toLowerCase())
                                    }
                                    if (header[a].includes(localeSet[2])) {
                                        header[a] = header[a].replaceAll(localeSet[2], newName)
                                    }
                                    if (header[a].includes(localeSet[2].toLowerCase())) {
                                        header[a] = header[a].replaceAll(localeSet[2].toLowerCase(), newName.toLowerCase())
                                    }
                                    if (header[a].includes(localeSet[3])) {
                                        header[a] = header[a].replaceAll(localeSet[3], newNameWithoutEndingS.toLowerCase())
                                    }
                                }
                                m("innerHTML")
                                m("placeholder")
                            }

                            let sidebar_headers = document.querySelectorAll(".font-header-2.dynamic-ellipsis-item")
                            for (let i = 0; i < sidebar_headers.length; i++) {
                                let header = sidebar_headers[i]
                                addRename(header)
                            }

                            let group_webblox_dropdown = document.querySelectorAll(".web-blox-css-mui-184cbry")
                            for (let i = 0; i < group_webblox_dropdown.length; i++) {
                                let header = group_webblox_dropdown[i]
                                addRename(header)
                            }

                            let title_page_text = document.querySelectorAll(".friends-title")
                            for (let i = 0; i < title_page_text.length; i++) {
                                let header = title_page_text[i]
                                addRename(header)
                            }

                            let buttons_text = document.querySelectorAll(".web-blox-css-tss-1283320-Button-textContainer")
                            for (let i = 0; i < buttons_text.length; i++) {
                                let header = buttons_text[i]
                                if (blacklisted(header)) { continue; } 
                                if (header.innerHTML.includes(localeSet[6] + localeSet[3]) && !(header.innerHTML.includes(newNameWithoutEndingS))) {
                                    header.innerHTML = header.innerHTML.replace(localeSet[6] + localeSet[3], localeSet[5] + newNameWithoutEndingS.toLowerCase())
                                } else if (header.innerHTML.includes(localeSet[1]) && !(header.innerHTML.includes(newNameWithoutEndingS))) {
                                    header.innerHTML = header.innerHTML.replace(localeSet[1], newNameWithoutEndingS)
                                } else if (header.innerHTML.includes(localeSet[1].toLowerCase()) && !(header.innerHTML.includes(newNameWithoutEndingS.toLowerCase()))) {
                                    header.innerHTML = header.innerHTML.replace(localeSet[1].toLowerCase(), newNameWithoutEndingS.toLowerCase())
                                } else if (header.innerHTML.includes(localeSet[3]) && !(header.innerHTML.includes(newNameWithoutEndingS.toLowerCase()))) {
                                    header.innerHTML = header.innerHTML.replace(localeSet[3], newNameWithoutEndingS.toLowerCase())
                                }
                            }

                            let search_headers = document.querySelectorAll(".section-title.ng-binding ng-scope.font-header-1")
                            for (let i = 0; i < search_headers.length; i++) {
                                let header = search_headers[i]
                                addRename(header)
                            }

                            let friends_search_link = document.querySelectorAll(".friends-filter-searchbar-input")
                            for (let i = 0; i < friends_search_link.length; i++) {
                                let header = friends_search_link[i]
                                addRename(header)
                            }

                            let most_text_frames = document.querySelectorAll(".ng-binding")
                            for (let i = 0; i < most_text_frames.length; i++) {
                                let header = most_text_frames[i]
                                if (settings["massEdit"] == true) {
                                    addRename(header)
                                }
                            }

                            let amount_text_summary = document.querySelectorAll(".amount")
                            for (let i = 0; i < amount_text_summary.length; i++) {
                                let header = amount_text_summary[i]
                                addRename(header)
                            }

                            let selected_labels = document.querySelectorAll(".rbx-selection-label")
                            for (let i = 0; i < selected_labels.length; i++) {
                                let header = selected_labels[i]
                                addRename(header)
                            }

                            let item_descriptions = document.querySelectorAll(".item-description")
                            for (let i = 0; i < item_descriptions.length; i++) {
                                let header = item_descriptions[i]
                                addRename(header)
                            }

                            let friends_subtitle = document.querySelectorAll(".friends-subtitle")
                            for (let i = 0; i < friends_subtitle.length; i++) {
                                let header = friends_subtitle[i]
                                if (header.childNodes && header.childNodes[0] && header.childNodes[0].textContent.includes(localeSet[0]) && !(header.childNodes[0].textContent.includes(newName))) {
                                    header.childNodes[0].textContent = header.childNodes[0].textContent.replace(localeSet[0], newName)
                                }
                            }

                            let previous_names = document.querySelectorAll(".text-pastname.ng-binding")
                            for (let i = 0; i < previous_names.length; i++) {
                                let header = previous_names[i]
                                addRename(header)
                            }

                            let back_links = document.querySelectorAll(".back-link")
                            for (let i = 0; i < back_links.length; i++) {
                                let header = back_links[i]
                                addRename(header)
                            }

                            let input_fields = document.querySelectorAll(".input-field")
                            for (let i = 0; i < input_fields.length; i++) {
                                let header = input_fields[i]
                                addRename(header)
                            }

                            let large_text_fields = document.querySelectorAll(".text-label-large, .text-caption-large, .text-body-large, .text-heading-large")
                            for (let i = 0; i < large_text_fields.length; i++) {
                                let header = large_text_fields[i]
                                addRename(header)
                            }

                            let small_text_fields = document.querySelectorAll(".text-label-small, .text-caption-small, .text-body-small, .text-heading-small")
                            for (let i = 0; i < small_text_fields.length; i++) {
                                let header = small_text_fields[i]
                                addRename(header)
                            }

                            let play_with_other_text = document.querySelectorAll(".play-with-others-text")
                            for (let i = 0; i < play_with_other_text.length; i++) {
                                let header = play_with_other_text[i]
                                addRename(header)
                            }

                            let friends_in_server = document.querySelectorAll(".friends-in-server-label")
                            for (let i = 0; i < friends_in_server.length; i++) {
                                let header = friends_in_server[i]
                                addRename(header)
                            }

                            let popover_buttons = document.querySelectorAll("div.popover-content > div > li > button")
                            for (let i = 0; i < popover_buttons.length; i++) {
                                let header = popover_buttons[i]
                                addRename(header)
                            }

                            let friend_subtitles = document.querySelectorAll(".friends-subtitle")
                            for (let i = 0; i < friend_subtitles.length; i++) {
                                let header = friend_subtitles[i]
                                addRename(header)
                            }

                            let friend_search_bar = document.querySelectorAll(".friends-filter-searchbar-input")
                            for (let i = 0; i < friend_search_bar.length; i++) {
                                let header = friend_search_bar[i]
                                addRename(header)
                            }

                            let create_connection_btn = document.querySelectorAll(".tooltip-container.create-friend-link-btn > button")
                            for (let i = 0; i < create_connection_btn.length; i++) {
                                let header = create_connection_btn[i]
                                addRename(header)
                            }

                            let roseal_tooltips = document.querySelectorAll(".roseal-tooltip")
                            for (let i = 0; i < roseal_tooltips.length; i++) {
                                let header = roseal_tooltips[i]
                                addRename(header)
                            }

                            let button_toggle_label = document.querySelectorAll(".btn-toggle-label")
                            for (let i = 0; i < button_toggle_label.length; i++) {
                                let header = button_toggle_label[i]
                                addRename(header)
                            }

                            let text_descriptions = document.querySelectorAll(".text-description")
                            for (let i = 0; i < text_descriptions.length; i++) {
                                let header = text_descriptions[i]
                                addRename(header)
                            }

                            let h3_texts = document.querySelectorAll("h3")
                            for (let i = 0; i < h3_texts.length; i++) {
                                let header = h3_texts[i]
                                addRename(header)
                            }

                            let server_list_headers = document.querySelectorAll(".server-list-header")
                            for (let i = 0; i < server_list_headers.length; i++) {
                                let header = server_list_headers[i]
                                addRename(header)
                            }

                            let font_bodies = document.querySelectorAll(".font-body")
                            for (let i = 0; i < font_bodies.length; i++) {
                                let header = font_bodies[i]
                                addRename(header)
                            }

                            let emphasises = document.querySelectorAll(".text-emphasis")
                            for (let i = 0; i < emphasises.length; i++) {
                                let header = emphasises[i]
                                addRename(header)
                            }

                            let text_contents = document.querySelectorAll(".text-content")
                            for (let i = 0; i < text_contents.length; i++) {
                                let header = text_contents[i]
                                addRename(header)
                            }

                            let friend_tooltips = document.querySelectorAll("#friendsTooltip")
                            for (let i = 0; i < friend_tooltips.length; i++) {
                                let header = friend_tooltips[i]
                                addRename(header)
                            }

                            let player_list_headers = document.querySelectorAll(".people-list-header")
                            for (let i = 0; i < player_list_headers.length; i++) {
                                let header = player_list_headers[i]
                                addRename(header)
                            }

                            let friend_list_titles = document.querySelectorAll(".friends-carousel-tile-labels")
                            for (let i = 0; i < friend_list_titles.length; i++) {
                                let header = friend_list_titles[i]
                                if (header.nodeName == "DIV" && header.innerHTML.includes(localeSet[2])) {
                                    if (blacklisted(header)) { continue; } 
                                    if (!(header.innerHTML.includes(localeSet[4] + newName))) {
                                        header.innerHTML = header.innerHTML.replaceAll(localeSet[2], localeSet[4] + newName)
                                    }
                                    addRename(header)
                                }
                            }

                            let all_links = document.querySelectorAll("a")
                            for (let i = 0; i < all_links.length; i++) {
                                let header = all_links[i]
                                if (settings["massEdit"] == true) {
                                    if (!(header.className == "profile-header-social-count")) {
                                        addRename(header)
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

                            let all_profile_headers = document.querySelectorAll(".profile-header-social-count-label")
                            for (let i = 0; i < all_profile_headers.length; i++) {
                                let header = all_profile_headers[i]
                                addRename(header)
                            }

                            if (window.location.pathname.includes("/connections") || window.location.pathname.includes("/friends")) {    
                                if (settings["changeTitleHtml"] == true) {
                                    let titles = document.querySelectorAll("title")
                                    for (let i = 0; i < titles.length; i++) {
                                        let header = titles[i]
                                        if (header.textContent.includes(localeSet[0])) {
                                            header.textContent = header.textContent.replaceAll(localeSet[0], newName)
                                        }
                                    }
                                }
                            }
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