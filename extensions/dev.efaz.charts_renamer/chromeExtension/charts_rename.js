/* 

Efaz's Roblox Charts/Discover Renamer
By: EfazDev
Page: https://www.efaz.dev/roblox-charts-discover-rename

inject.js:
    - Content script that replaces Charts with Discover/Games

*/

(function () { // Prevent changes made using the Inspect console.
    const storage = chrome.storage.sync;

    try {
        const storage_key = "dev.efaz.charts_renamer"
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
                        "English": ["games", "charts", "discover", "Charts"],
                        "Español": ["games", "charts", "discover", "Destacadas"],
                        "Français": ["games", "charts", "discover", "Charts"]
                    }
                    if (tab.hostname == "www.roblox.com") {
                        /* Set Names */
                        let newName = settings["newName"];
                        let amountOfSecondsBeforeLoop = (typeof(settings["startTime"]) == "string" && Number(settings["startTime"])) ? Number(settings["startTime"]) : 75
                        
                        /* Clean New Name to prevent crashes */
                        var div = document.createElement("div");
                        div.innerHTML = newName;
                        newName = div.textContent.replace(/<\/[^>]+(>|$)/g, "");

                         /* Set basic query names to find */
                        let query_names = [
                            ".btn-toggle-label",
                            ".text-description",
                            "h3"
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
                                if (val.includes(localeSet[3])) {
                                    val = val.replaceAll(localeSet[3], newName)
                                }
                                if (val.includes(localeSet[3].toLowerCase())) {
                                    val = val.replaceAll(localeSet[3].toLowerCase(), newName.toLowerCase())
                                }
                                if (header[a] != val) { header[a] = val }
                            }
                            if (k) {
                                m(k)
                            } else {
                                m("innerHTML")
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
                            let isGames = newName.toLowerCase() == localeSet[0];
                            let isCharts = newName.toLowerCase() == localeSet[1];

                            let topbar_headers = document.querySelectorAll(".font-header-2.nav-menu-title.text-header")
                            for (let i = 0; i < topbar_headers.length; i++) {
                                let header = topbar_headers[i]
                                let val = header.textContent
                                if (header.href && val.includes(localeSet[3]) && !(val.includes(newName))) {
                                    if (isGames == true) {
                                        header.href = header.href.replace("charts", "games")
                                        header.href = header.href.replace("discover", "games")
                                    } else {
                                        header.href = header.href.replace("charts", "discover")
                                        header.href = header.href.replace("games", "discover")
                                    }
                                    addRename(header)
                                }
                            }

                            let chart_links = document.querySelectorAll(".btn-secondary-xs.see-all-link-icon.btn-more")
                            for (let i = 0; i < chart_links.length; i++) {
                                let header = chart_links[i]
                                if (header.href && !(header.href.includes(newName))) {
                                    if (isGames == true) {
                                        if (header.href.includes("charts") || header.href.includes("discover")) {
                                            header.href = header.href.replace("charts", "games")
                                            header.href = header.href.replace("discover", "games")
                                        }
                                    } else {
                                        if (header.href.includes("charts") || header.href.includes("games")) {
                                            header.href = header.href.replace("charts", "discover")
                                            header.href = header.href.replace("games", "discover")
                                        }
                                    }
                                    addRename(header)
                                }
                            }

                            let query_selectors = document.querySelectorAll(query_names)
                            for (let i = 0; i < query_selectors.length; i++) {
                                let header = query_selectors[i]
                                addRename(header)
                            }

                            if (settings["replaceURLwithDiscoverURL"] == true) {
                                if (window.location.pathname.includes("/charts")) {
                                    if (isCharts == false) {
                                        if (isGames == true) {
                                            window.history.pushState({ id: "100" }, newName, window.location.href.replace("/charts#/", "/games#/"));
                                        } else {
                                            window.history.pushState({ id: "100" }, newName, window.location.href.replace("/charts#/", "/discover#/"));
                                        }
                                    }
                                }
                            }

                            if (window.location.pathname.includes("/discover") || window.location.pathname.includes("/charts") || window.location.pathname.includes("/games")) {
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