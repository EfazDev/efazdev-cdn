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
        const storage_key = "dev.efaz.charts_renamer";
        function getChromeURL(resource) {
            try {
                // This is for Efaz's Roblox Extension support
                if (chrome.runtime.getManifest()["homepage_url"] == "https://www.efaz.dev/roblox-extension") {
                    // This is run under bundled extension [{extension_name}/{resource}]
                    return chrome.runtime.getURL("{extension_name_this_is_replace_when_building_bundle_with_folder_name_if_youre_wondering}" + "/" + resource);
                } else {
                    return chrome.runtime.getURL(resource);
                }
            } catch (_) {
                // This is run under mini extension [{resource}]
                return chrome.runtime.getURL(resource);
            }
        }
        function getTran(id) {
            if (!(chrome.i18n.getMessage(storage_key.replaceAll(".", "_") + "_" + id) == "")) {
                return chrome.i18n.getMessage(storage_key.replaceAll(".", "_") + "_" + id);
            } else if (!(chrome.i18n.getMessage(id.replaceAll(".", "_")) == "")) {
                return chrome.i18n.getMessage(id.replaceAll(".", "_"));
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
                        "English (United States)": ["games", "charts", "discover", "Charts"],
                        "English (United Kingdom)": ["games", "charts", "discover", "Charts"],
                        "Español (España)": ["games", "charts", "discover", "Destacadas"],
                        "Español (México)*": ["games", "charts", "discover", "Destacadas"],
                        "Français (France)": ["games", "charts", "discover", "Charts"],
                        "Deutsch": ["games", "charts", "discover", "Charts"],
                        "Italiano": ["games", "charts", "discover", "Charts"]
                    };
                    if (tab.hostname == "www.roblox.com") {
                        /* Set Names */
                        let newName = settings["newName"];

                        /* Clean New Name to prevent crashes */
                        let filter_name = document.createElement("div");
                        filter_name.innerHTML = newName;
                        newName = filter_name.textContent.replace(/<\/[^>]+(>|$)/g, "");
                        filter_name = null;

                        /* Set basic query names to find */
                        let query_names = [
                            ".btn-toggle-label",
                            ".text-description",
                            "h3"
                        ];
                        let custom_renames = [
                            ".font-header-2.nav-menu-title.text-header",
                            ".btn-secondary-xs.see-all-link-icon.btn-more",
                            ".games-list-header",
                            "title"
                        ];
                        query_names = query_names.join(", ");
                        custom_renames = custom_renames.join(", ");

                        /* Run rename loop */
                        let localeSet = null;
                        let observer = null;
                        let isGames = false;
                        let isCharts = false;
                        let clear_local_set = false;
                        function blacklisted(header, attribute) {
                            const ngBind = header.getAttribute("ng-bind");
                            const ngBindHtml = header.getAttribute("ng-bind-html");
                            const ngIf = header.getAttribute("ng-if");
                            if (header.getAttribute("ng-renamed2") == "true") { return true; }
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
                                if (val.includes(localeSet[3])) {
                                    val = val.replaceAll(localeSet[3], newName);
                                    changed = true;
                                }
                                if (val.includes(localeSet[3].toLowerCase())) {
                                    val = val.replaceAll(localeSet[3].toLowerCase(), newName.toLowerCase());
                                    changed = true;
                                }
                                if (changed == true) { header[a] = val; }
                            }
                            if (k) {
                                m(k);
                            } else {
                                m("innerHTML");
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
                            isGames = newName.toLowerCase() == localeSet[0];
                            isCharts = newName.toLowerCase() == localeSet[1];
                            return clear_local_set;
                        }
                        function injectRename() {
                            let clear_local_set = setLanguage();
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
                            if (clear_local_set == true) { localeSet = null; }
                        }
                        function handleCustomRename(header) {
                            if (header.matches(".font-header-2.nav-menu-title.text-header")) {
                                let val = header.textContent;
                                if (header.href && val.includes(localeSet[3]) && !(val.includes(newName))) {
                                    if (isGames == true) {
                                        header.href = header.href.replace("charts", "games");
                                        header.href = header.href.replace("discover", "games");
                                    } else {
                                        header.href = header.href.replace("charts", "discover");
                                        header.href = header.href.replace("games", "discover");
                                    }
                                    addRename(header);
                                }
                            } else if (header.matches(".btn-secondary-xs.see-all-link-icon.btn-more")) {
                                if (header.href && !(header.href.includes(newName))) {
                                    if (isGames == true) {
                                        if (header.href.includes("charts") || header.href.includes("discover")) {
                                            header.href = header.href.replace("charts", "games");
                                            header.href = header.href.replace("discover", "games");
                                        }
                                    } else {
                                        if (header.href.includes("charts") || header.href.includes("games")) {
                                            header.href = header.href.replace("charts", "discover");
                                            header.href = header.href.replace("games", "discover");
                                        }
                                    }
                                    addRename(header);
                                }
                            } else if (window.location.pathname.includes("/discover") || window.location.pathname.includes("/charts") || window.location.pathname.includes("/games")) {
                                if (header.matches(".games-list-header")) {
                                    if (!(header.innerHTML.includes(newName))) {
                                        for (let e = 0; e < header.children.length; e++) {
                                            let child = header.children[e];
                                            addRename(child);
                                        }
                                    }
                                } else if (header.matches("title") && settings["changeTitleHtml"] == true) {
                                    addRename(header);
                                }
                            }
                        }
                        function startRenameLoop() {
                            renameLoopId = setTimeout(() => {
                                injectRename();
                                startRenameLoop();
                            }, 3000);
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
                            startRenameLoop();
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