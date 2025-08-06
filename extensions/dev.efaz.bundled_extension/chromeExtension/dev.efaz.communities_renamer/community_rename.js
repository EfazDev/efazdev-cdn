/* 

Efaz's Roblox Communities Renamer
By: EfazDev
Page: https://www.efaz.dev/roblox-communities-rename

inject.js:
    - Content script that replaces Charts with Discover/Games

*/

(function () { // Prevent changes made using the Inspect console.
    const storage = chrome.storage.sync;
    const storage_key = "dev.efaz.communities_renamer"
    function getChromeURL(resource) {
        try {
            // This is for Efaz's Roblox Extension support
            if (chrome.runtime.getManifest()["homepage_url"] == "https://www.efaz.dev/roblox-extension") {
                // This is run under bundled extension [{extension_name}/{resource}]
                return chrome.runtime.getURL("dev.efaz.communities_renamer" + "/" + resource)
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

    try {
        getSettings(storage_key, function (items) {
            let enabled = true;
            let settings = items[storage_key];
            if (typeof (settings["enabled"]) == "boolean") { enabled = settings["enabled"] };
            if (enabled == true) {
                let tab = window.location
                if (tab.href) {
                    const localeSets = {
                        "English": ["Communities", "Community", "communities", "community"],
                        "Español": ["Comunidades", "Comunidad", "comunidades", "comunidad"],
                        "Français": ["Communautés", "Communauté", "communautés", "communauté"],
                    }
                    if (tab.hostname == "www.roblox.com") {
                        /* Set Names */
                        let newName = settings["newName"];
                        let newNameWithoutEndingS = settings["newName"].replace(/ies$/, "y").replace(/es$/, "").replace(/s$/, "");
                        let amountOfSecondsBeforeLoop = (typeof(settings["loopSeconds"]) == "string" && Number(settings["loopSeconds"])) ? Number(settings["loopSeconds"]) : 100

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

                            function addRename(header, k) {
                                function m(a) {
                                    if (!header[a]) { return }
                                    if (blacklisted(header, a)) { return }
                                    if (header.href && settings["replaceURLwithGroupsURL"] == true) {
                                        header.href = header.href.replace("communities", "groups")
                                    }
                                    if (header[a].includes(localeSet[0])) {
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
                                }
                                if (k) {
                                    m(k)
                                } else {
                                    m("innerHTML")
                                    m("placeholder")
                                    m("title")
                                }
                            }

                            let sidebar_headers = document.querySelectorAll(".font-header-2.dynamic-ellipsis-item")
                            for (let i = 0; i < sidebar_headers.length; i++) {
                                let header = sidebar_headers[i]
                                addRename(header)
                            }

                            let sidebar_link_headers = document.querySelectorAll(".dynamic-overflow-container.text-nav")
                            for (let i = 0; i < sidebar_link_headers.length; i++) {
                                let header = sidebar_link_headers[i]
                                addRename(header)
                            }

                            let group_webblox_dropdown = document.querySelectorAll(".web-blox-css-mui-184cbry")
                            for (let i = 0; i < group_webblox_dropdown.length; i++) {
                                let header = group_webblox_dropdown[i]
                                addRename(header)
                            }

                            let group_header_name = document.querySelectorAll(".groups-list-heading")
                            for (let i = 0; i < group_header_name.length; i++) {
                                let header = group_header_name[i]
                                addRename(header)
                            }

                            let search_headers = document.querySelectorAll(".section-title.ng-binding.ng-scope.font-header-1")
                            for (let i = 0; i < search_headers.length; i++) {
                                let header = search_headers[i]
                                addRename(header)
                            }

                            let my_communities_link = document.querySelectorAll(".btn-secondary-xs.btn-more.see-all-link-icon.ng-binding.ng-scope")
                            for (let i = 0; i < my_communities_link.length; i++) {
                                let header = my_communities_link[i]
                                addRename(header)
                            }

                            let join_communities_btn = document.querySelectorAll(".web-blox-css-tss-1283320-Button-textContainer")
                            for (let i = 0; i < join_communities_btn.length; i++) {
                                let header = join_communities_btn[i]
                                addRename(header)
                            }

                            let create_community_button = document.querySelectorAll(".btn-secondary-md.create-group-button.ng-binding")
                            for (let i = 0; i < create_community_button.length; i++) {
                                let header = create_community_button[i]
                                addRename(header)
                            }

                            let most_text_frames = document.querySelectorAll(".ng-binding")
                            for (let i = 0; i < most_text_frames.length; i++) {
                                let header = most_text_frames[i]
                                if (settings["massEdit"] == true) {
                                    addRename(header)
                                }
                            }

                            let small_create_community_text = document.querySelectorAll(".small.text.create-group-text.ng-binding.ng-scope")
                            for (let i = 0; i < small_create_community_text.length; i++) {
                                let header = small_create_community_text[i]
                                addRename(header)
                            }

                            let transaction_page_summary = document.querySelectorAll(".summary-transaction-label")
                            for (let i = 0; i < transaction_page_summary.length; i++) {
                                let header = transaction_page_summary[i]
                                addRename(header)
                            }

                            let amount_text_summary = document.querySelectorAll(".amount")
                            for (let i = 0; i < amount_text_summary.length; i++) {
                                let header = amount_text_summary[i]
                                addRename(header)
                            }

                            let selected_labels = document.querySelectorAll(".rbx-selection-label")
                            for (let i = 0; i < selected_labels.length; i++) {
                                let header = selected_labels[i]
                                if (header.getAttribute("ng-bind") == "role.name" || header.getAttribute("ng-bind") == "$ctrl.data.currentRoleName") { continue };
                                addRename(header)
                            }

                            let item_descriptions = document.querySelectorAll(".item-description")
                            for (let i = 0; i < item_descriptions.length; i++) {
                                let header = item_descriptions[i]
                                addRename(header)
                            }

                            let shout_community_button = document.querySelectorAll(".btn-secondary-md.group-form-button.ng-binding")
                            for (let i = 0; i < shout_community_button.length; i++) {
                                let header = shout_community_button[i]
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

                            let h3_texts = document.querySelectorAll("h3")
                            for (let i = 0; i < h3_texts.length; i++) {
                                let header = h3_texts[i]
                                addRename(header)
                            }

                            let previous_names = document.querySelectorAll(".text-pastname.ng-binding")
                            for (let i = 0; i < previous_names.length; i++) {
                                let header = previous_names[i]
                                addRename(header)
                            }

                            let search_communities_link = document.querySelectorAll(".groups-list-search-input")
                            for (let i = 0; i < search_communities_link.length; i++) {
                                let header = search_communities_link[i]
                                addRename(header)
                            }

                            let private_server_tooltip = document.querySelectorAll("#private-server-tooltip")
                            for (let i = 0; i < private_server_tooltip.length; i++) {
                                let header = private_server_tooltip[i]
                                addRename(header)
                            }

                            let back_links = document.querySelectorAll(".back-link")
                            for (let i = 0; i < back_links.length; i++) {
                                let header = back_links[i]
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

                            let block_words_descriptions = document.querySelectorAll(".keyword-block-list-section-header > div")
                            for (let i = 0; i < block_words_descriptions.length; i++) {
                                let header = block_words_descriptions[i]
                                addRename(header)
                            }

                            let text_contents = document.querySelectorAll(".text-content")
                            for (let i = 0; i < text_contents.length; i++) {
                                let header = text_contents[i]
                                addRename(header)
                            }

                            let all_links = document.querySelectorAll("a")
                            for (let i = 0; i < all_links.length; i++) {
                                let header = all_links[i]
                                if (header.href && header.href.includes("/communities") && !(header.innerHTML.includes(newName))) {
                                    if (settings["replaceURLwithGroupsURL"] == true) {
                                        header.href = header.href.replace("/communities", "/groups")
                                    }
                                }
                                if (header.getAttribute("ng-click") == "$ctrl.updateRole(role)" || header.getAttribute("ng-click") == "$ctrl.updateRoleFilter(role)") { continue; }
                                if (settings["massEdit"] == true) {
                                    if (header.childNodes.length > 0) {
                                        loopThroughArrayAsync(Array.from(header.childNodes), (_, v) => {
                                            addRename(v)
                                        })
                                    } else {
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

                            if (settings["replaceURLwithGroupsURL"] == true) {
                                if (window.location.pathname.includes("/communities") && !(window.location.href.includes("/configure"))) {
                                    window.history.pushState({ id: "100" }, newName, window.location.href.replace("/communities", "/groups"));
                                }
                            }

                            if (window.location.pathname.includes("/communities") || window.location.pathname.includes("/groups")) {    
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
                            timeout(() => { injectRename() }, amountOfSecondsBeforeLoop)
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