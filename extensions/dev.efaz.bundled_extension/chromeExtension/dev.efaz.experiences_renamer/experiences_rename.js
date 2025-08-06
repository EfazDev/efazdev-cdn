/* 

Efaz's Roblox Experiences Renamer
By: EfazDev
Page: https://www.efaz.dev/roblox-experiences-rename

inject.js:
    - Content script that replaces Experiences with Games

*/

(function () { // Prevent changes made using the Inspect console.
    const storage = chrome.storage.sync;

    try {
        const storage_key = "dev.efaz.experiences_renamer"
        function getChromeURL(resource) {
            try {
                // This is for Efaz's Roblox Extension support
                if (chrome.runtime.getManifest()["homepage_url"] == "https://www.efaz.dev/roblox-extension") {
                    // This is run under bundled extension [{extension_name}/{resource}]
                    return chrome.runtime.getURL("dev.efaz.experiences_renamer" + "/" + resource)
                } else {
                    return chrome.runtime.getURL(resource)
                }
            } catch (_) {
                // This is run under mini extension [{resource}]
                return chrome.runtime.getURL(resource)
            }
        }
        function getTran(id) { 
            if (!(chrome.i18n.getMessage(storage_key.replaceAll(".", "_") + "_" + id) == "")) {
                return chrome.i18n.getMessage(storage_key.replaceAll(".", "_") + "_" + id)
            } else if (!(chrome.i18n.getMessage(id.replaceAll(".", "_")) == "")) {
                return chrome.i18n.getMessage(id.replaceAll(".", "_"))
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
                        "English": ["Experiences", "Experience"],
                        "Español": ["Experiencias", "Experiencia"],
                        "Français": ["Expériences", "Expérience"]
                    }
                    if (tab.hostname == "www.roblox.com") {
                        /* Set Names */
                        let newName = settings["newName"];
                        let newNameWithoutEndingS = settings["newName"].replace(/ies$/, "y").replace(/s$/, "");
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

                            function addRename(header, k) {
                                function m(a) {
                                    if (!header[a]) { return }
                                    if (blacklisted(header, a)) { return }
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

                            let play_with_other_text = document.querySelectorAll(".play-with-others-text")
                            for (let i = 0; i < play_with_other_text.length; i++) {
                                let header = play_with_other_text[i]
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

                            let most_text_frames = document.querySelectorAll(".ng-binding")
                            for (let i = 0; i < most_text_frames.length; i++) {
                                let header = most_text_frames[i]
                                if (settings["massEdit"] == true) {
                                    addRename(header)
                                }
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

                            let dropdown_menu = document.querySelectorAll(".dropdown-menu > li > a > span.navbar-list-option-suffix")
                            for (let i = 0; i < dropdown_menu.length; i++) {
                                let header = dropdown_menu[i]
                                addRename(header)
                            }

                            let dropdown_menu_2 = document.querySelectorAll(".popover-content > .dropdown-menu > li > a")
                            for (let i = 0; i < dropdown_menu_2.length; i++) {
                                let header = dropdown_menu_2[i]
                                addRename(header)
                            }

                            let more_tooltip = document.querySelectorAll(".info-tooltip-container, .games-info-tooltip, #games-info-tooltip")
                            for (let i = 0; i < more_tooltip.length; i++) {
                                let header = more_tooltip[i]
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

                            let download_rbx_message = document.querySelectorAll(".web-blox-css-tss-jc8j2r-message > span")
                            for (let i = 0; i < download_rbx_message.length; i++) {
                                let header = download_rbx_message[i]
                                addRename(header)
                            }

                            let game_list_containers = document.querySelectorAll(".container-list.games-detail > h2")
                            for (let i = 0; i < game_list_containers.length; i++) {
                                let header = game_list_containers[i]
                                addRename(header)
                            }

                            let container_headers = document.querySelectorAll(".container-header")
                            for (let i = 0; i < container_headers.length; i++) {
                                let header = container_headers[i]
                                addRename(header)
                            }

                            let radio_button_h5 = document.querySelectorAll(".radio-buttons-group > h5")
                            for (let i = 0; i < radio_button_h5.length; i++) {
                                let header = radio_button_h5[i]
                                addRename(header)
                            }

                            let radio_button_description = document.querySelectorAll(".radio-buttons-group > .radio-button-description")
                            for (let i = 0; i < radio_button_description.length; i++) {
                                let header = radio_button_description[i]
                                addRename(header)
                            }

                            let section_content = document.querySelectorAll(".section-content > .small")
                            for (let i = 0; i < section_content.length; i++) {
                                let header = section_content[i]
                                addRename(header)
                            }

                            let text_labels = document.querySelectorAll(".text-label")
                            for (let i = 0; i < text_labels.length; i++) {
                                let header = text_labels[i]
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

                            let all_labels = document.querySelectorAll("label")
                            for (let i = 0; i < all_labels.length; i++) {
                                let header = all_labels[i]
                                if (settings["massEdit"] == true) {
                                    addRename(header)
                                }
                            }
                            timeout(() => injectRename(), amountOfSecondsBeforeLoop)
                        }
                        injectRename()
                    } else if (tab.hostname == "create.roblox.com") {
                        /* Set Names */
                        let newName = settings["newName"];
                        let newNameWithoutEndingS = settings["newName"].replace(/ies$/, "y").replace(/s$/, "");
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
                            let meta_tag = document.querySelector("a > div > .web-blox-css-mui-9iedg7.MuiChip-label")
                            let localeSet = null
                            if (meta_tag) {
                                localeSet = localeSets[meta_tag.textContent]
                            }
                            if (!(localeSet)) {
                                localeSet = localeSets["English"]
                            }

                            function blacklisted(header, attribute) {
                                return false;
                            }

                            function addRename(header, k) {
                                function m(a) {
                                    if (!header[a]) { return }
                                    if (blacklisted(header, a)) { return }
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
                            let btn_text_container_1 = document.querySelectorAll(".web-blox-css-tss-1283320-Button-textContainer")
                            for (let i = 0; i < btn_text_container_1.length; i++) {
                                let header = btn_text_container_1[i]
                                addRename(header)
                            }
                            let medium_labels = document.querySelectorAll(".MuiChip-labelMedium")
                            for (let i = 0; i < medium_labels.length; i++) {
                                let header = medium_labels[i]
                                addRename(header)
                            }
                            let btn_text_container_2 = document.querySelectorAll(".web-blox-css-mui-dsncs0-Typography-button")
                            for (let i = 0; i < btn_text_container_2.length; i++) {
                                let header = btn_text_container_2[i]
                                addRename(header)
                            }
                            let medium_labels_2 = document.querySelectorAll(".web-blox-css-mui-clml2g")
                            for (let i = 0; i < medium_labels_2.length; i++) {
                                let header = medium_labels_2[i]
                                addRename(header)
                            }
                            let medium_labels_3 = document.querySelectorAll(".web-blox-css-mui-1yigbjg")
                            for (let i = 0; i < medium_labels_3.length; i++) {
                                let header = medium_labels_3[i]
                                addRename(header)
                            }
                            let medium_labels_4 = document.querySelectorAll(".web-blox-css-mui-1xqo902")
                            for (let i = 0; i < medium_labels_4.length; i++) {
                                let header = medium_labels_4[i]
                                addRename(header)
                            }
                            let basic_labels_1 = document.querySelectorAll(".web-blox-css-mui-lbf0y3")
                            for (let i = 0; i < basic_labels_1.length; i++) {
                                let header = basic_labels_1[i]
                                addRename(header)
                            }
                            let body_1 = document.querySelectorAll(".web-blox-css-mui-gea1as-Typography-body1")
                            for (let i = 0; i < body_1.length; i++) {
                                let header = body_1[i]
                                addRename(header)
                            }
                            let body_2 = document.querySelectorAll(".web-blox-css-mui-15wphe8-Typography-body1")
                            for (let i = 0; i < body_2.length; i++) {
                                let header = body_2[i]
                                addRename(header)
                            }
                            let body_3 = document.querySelectorAll(".web-blox-css-mui-1v9omcg-Typography-body1")
                            for (let i = 0; i < body_3.length; i++) {
                                let header = body_3[i]
                                addRename(header)
                            }
                            let title_description = document.querySelectorAll(".web-blox-css-tss-5nnsl2-Typography-body1-Typography-colorSecondary-Typography-root-titleDescription")
                            for (let i = 0; i < title_description.length; i++) {
                                let header = title_description[i]
                                addRename(header)
                            }
                            let titles = document.querySelectorAll("title")
                            for (let i = 0; i < titles.length; i++) {
                                let header = titles[i]
                                addRename(header)
                            }
                            timeout(() => injectRename(), amountOfSecondsBeforeLoop)
                        }
                        if (settings["includeCreatorDashboard"] == true) {
                            injectRename()
                        }
                    }
                }
            }
        });
    } catch (err) {
        console.warn(`Failed to insert rename into this tab. Error Message: ${err.message}`)
    }
}())