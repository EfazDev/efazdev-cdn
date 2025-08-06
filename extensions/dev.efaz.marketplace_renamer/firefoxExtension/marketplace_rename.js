/* 

Efaz's Roblox Marketplace Renamer
By: EfazDev
Page: https://www.efaz.dev/roblox-marketplace-rename

inject.js:
    - Content script that replaces Marketplace with Catalog

*/

(function () { // Prevent changes made using the Inspect console.
    const storage = chrome.storage.sync;

    try {
        const storage_key = "dev.efaz.marketplace_renamer"
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
                        "English": ["Marketplace"],
                        "Español": ["Mercado"],
                        "Français": ["Marketplace"]
                    }
                    if (tab.hostname == "www.roblox.com") {
                        /* Set Names */
                        let newName = settings["newName"];
                        let amountOfSecondsBeforeLoop = (typeof(settings["startTime"]) == "string" && Number(settings["startTime"])) ? Number(settings["startTime"]) : 75
                        
                        /* Clean New Name to prevent crashes */
                        var div = document.createElement("div");
                        div.innerHTML = newName;
                        newName = div.textContent.replace(/<\/[^>]+(>|$)/g, "");
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
                                }
                                if (k) {
                                    m(k)
                                } else {
                                    m("innerHTML")
                                    m("title")
                                }
                            }

                            let topbar_headers = document.querySelectorAll(".font-header-2.nav-menu-title.text-header")
                            for (let i = 0; i < topbar_headers.length; i++) {
                                let header = topbar_headers[i]
                                if (header.href && header.textContent.includes(localeSet[0])) {
                                    addRename(header)
                                }
                            }

                            let chart_links = document.querySelectorAll(".btn-secondary-xs.see-all-link-icon.btn-more")
                            for (let i = 0; i < chart_links.length; i++) {
                                let header = chart_links[i]
                                if (header.href) {
                                    addRename(header)
                                }
                            }

                            let button_toggle_label = document.querySelectorAll(".btn-toggle-label")
                            for (let i = 0; i < button_toggle_label.length; i++) {
                                let header = button_toggle_label[i]
                                addRename(header)
                            }

                            let headers = document.querySelectorAll(".heading > a")
                            for (let i = 0; i < headers.length; i++) {
                                let header = headers[i]
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

                            let navigation_bars = document.querySelectorAll(".navbar-list-option-suffix")
                            for (let i = 0; i < navigation_bars.length; i++) {
                                let header = navigation_bars[i]
                                addRename(header)
                            }

                            if (window.location.pathname.includes("/catalog")) {
                                let page_headers = document.querySelectorAll(".games-list-header")
                                for (let i = 0; i < page_headers.length; i++) {
                                    let header = page_headers[i]
                                    if (!(header.innerHTML.includes(newName))) {
                                        for (let e = 0; e < header.children.length; e++) {
                                            let child = header.children[e]
                                            addRename(child)
                                        }
                                    }
                                }

                                if (settings["changeTitleHtml"] == true) {
                                    let titles = document.querySelectorAll("title")
                                    for (let i = 0; i < titles.length; i++) {
                                        let header = titles[i]
                                        addRename(header)
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