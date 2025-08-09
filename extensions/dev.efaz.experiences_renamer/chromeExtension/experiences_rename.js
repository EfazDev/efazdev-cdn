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
                    return chrome.runtime.getURL("{extension_name_this_is_replace_when_building_bundle_with_folder_name_if_youre_wondering}" + "/" + resource)
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
                            user_settings = { [storage_key]: user_settings[jso["old_name"]] }
                        }
                    }
                    if (!(user_settings[storage_key])) { user_settings[storage_key] = {} }
                    await loopThroughArrayAsync(jso["settings"], async (i, v) => {
                        if (typeof (user_settings[storage_key][i]) == "undefined") {
                            if (!(typeof (v["default"]) == "undefined")) {
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
                        let amountOfSecondsBeforeLoop = (typeof (settings["startTime"]) == "string" && Number(settings["startTime"])) ? Number(settings["startTime"]) : 75

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
                            '.dynamic-overflow-container.text-nav', 
                            '.web-blox-css-mui-184cbry', 
                            '.groups-list-heading', 
                            '.play-with-others-text', 
                            '.premium-game-link > .text-link', 
                            '.game-benefit-header.left-header > .font-title', 
                            '.section-title.ng-binding.ng-scope.font-header-1', 
                            '.btn-secondary-xs.btn-more.see-all-link-icon.ng-binding.ng-scope', 
                            '.web-blox-css-tss-1283320-Button-textContainer', 
                            '.summary-transaction-label', 
                            '.amount', 
                            '.dropdown-menu > li > a > span.navbar-list-option-suffix', 
                            '.popover-content > .dropdown-menu > li > a', 
                            '.modal-title', 
                            '.modal-message', 
                            '.section-content-off', 
                            '.text-pastname', 
                            '.roseal-menu-item > button', 
                            '.info-tooltip-container', 
                            '.games-info-tooltip', 
                            '#games-info-tooltip', 
                            '.item-description', 
                            '.btn-secondary-md.group-form-button.ng-binding', 
                            '.btn-toggle-label', 
                            '.text-description', 
                            '.input-field', 
                            '.text-label-large', 
                            '.text-caption-large', 
                            '.text-body-large', 
                            '.text-heading-large', 
                            '.text-label-small', 
                            '.text-caption-small', 
                            '.text-body-small', 
                            '.text-heading-small', 
                            '.web-blox-css-tss-jc8j2r-message > span', 
                            '.container-list.games-detail > h2', 
                            '.container-header', 
                            '.radio-buttons-group > h5', 
                            '.radio-buttons-group > .radio-button-description', 
                            '.section-content > .small', 
                            '.text-label', 
                            'h3', 
                            '.text-pastname.ng-binding', 
                            '#private-server-tooltip', 
                            '.back-link', 
                            '.font-body', 
                            '.text-emphasis', 
                            '.keyword-block-list-section-header > div', 
                            '.text-content'
                        ].join(", ")

                        /* Run Rename Loop */
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
                                if (val.includes(localeSet[0])) {
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
                            
                            let query_selectors = document.querySelectorAll(query_names)
                            for (let i = 0; i < query_selectors.length; i++) {
                                let header = query_selectors[i]
                                addRename(header)
                            }

                            let most_text_frames = document.querySelectorAll(".ng-binding")
                            for (let i = 0; i < most_text_frames.length; i++) {
                                let header = most_text_frames[i]
                                if (settings["massEdit"] == true) {
                                    addRename(header)
                                }
                            }

                            let selected_labels = document.querySelectorAll(".rbx-selection-label")
                            for (let i = 0; i < selected_labels.length; i++) {
                                let header = selected_labels[i]
                                if (header.getAttribute("ng-bind") == "role.name" || header.getAttribute("ng-bind") == "$ctrl.data.currentRoleName") { continue };
                                addRename(header)
                            }

                            let all_labels = document.querySelectorAll("label")
                            for (let i = 0; i < all_labels.length; i++) {
                                let header = all_labels[i]
                                if (settings["massEdit"] == true) {
                                    addRename(header)
                                }
                            }
                            if (clear_local_set == true) { localeSet = null; }
                            timeout(() => injectRename(), amountOfSecondsBeforeLoop)
                        }
                        injectRename()
                    } else if (tab.hostname == "create.roblox.com") {
                        /* Set Names */
                        let newName = settings["newName"];
                        let newNameWithoutEndingS = settings["newName"].replace(/ies$/, "y").replace(/s$/, "");
                        let amountOfSecondsBeforeLoop = (typeof (settings["startTime"]) == "string" && Number(settings["startTime"])) ? Number(settings["startTime"]) : 75
                        let co = 0;

                        /* Clean New Name to prevent crashes */
                        var div = document.createElement("div");
                        div.innerHTML = newName;
                        newName = div.textContent.replace(/<\/[^>]+(>|$)/g, "");

                        var div = document.createElement("div");
                        div.innerHTML = newNameWithoutEndingS;
                        newNameWithoutEndingS = div.textContent.replace(/<\/[^>]+(>|$)/g, "");

                        /* Set basic query names to find */
                        let query_names = [
                            ".web-blox-css-tss-1283320-Button-textContainer",
                            ".MuiChip-labelMedium",
                            ".web-blox-css-mui-dsncs0-Typography-button",
                            ".web-blox-css-mui-clml2g",
                            ".web-blox-css-mui-1yigbjg",
                            ".web-blox-css-mui-1xqo902",
                            ".web-blox-css-mui-lbf0y3",
                            ".web-blox-css-mui-e8q1iy",
                            ".web-blox-css-mui-1kqj7ax",
                            ".web-blox-css-mui-gea1as-Typography-body1",
                            ".web-blox-css-mui-15wphe8-Typography-body1",
                            ".web-blox-css-mui-1v9omcg-Typography-body1",
                            ".web-blox-css-mui-1rj7vct-Typography-caption",
                            ".web-blox-css-tss-5nnsl2-Typography-body1-Typography-colorSecondary-Typography-root-titleDescription"
                        ].join(", ")

                        /* Run rename loop */
                        let localeSet = null
                        function blacklisted(header, attribute) {
                            if (header.children && header.children.length > 0 && header.children[0].nodeName.toLowerCase() == "a" && header.children[0].textContent == header.textContent) { return true }
                            return false;
                        }
                        function addRename(header, k) {
                            function m(a) {
                                if (!header[a]) { return }
                                if (blacklisted(header, a)) { return }
                                let val = header[a]
                                if (val.includes(localeSet[0])) {
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
                            let meta_tag = document.querySelector("a > div > .web-blox-css-mui-9iedg7.MuiChip-label")
                            if (meta_tag) {
                                localeSet = localeSets[meta_tag.textContent]
                            } else {
                                localeSet = localeSets["English"]
                            }
                            let query_selectors = document.querySelectorAll(query_names)
                            for (let i = 0; i < query_selectors.length; i++) {
                                let header = query_selectors[i]
                                addRename(header)
                            }
                            let titles = document.querySelectorAll("title")
                            for (let i = 0; i < titles.length; i++) {
                                let header = titles[i]
                                addRename(header)
                            }
                            co += 1
                            if (co < 10) {
                                timeout(() => injectRename(), amountOfSecondsBeforeLoop * 3)
                            } else {
                                timeout(() => injectRename(), amountOfSecondsBeforeLoop)
                            }
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