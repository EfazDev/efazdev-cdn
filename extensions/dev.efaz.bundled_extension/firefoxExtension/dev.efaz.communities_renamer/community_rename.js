/* 

Efaz's Roblox Communities Renamer
By: EfazDev
Page: https://www.efaz.dev/roblox-communities-rename

inject.js:
    - Content script that replaces Charts with Discover/Games

*/

(function () { // Prevent changes made using the Inspect console.
    const storage = chrome.storage.sync;
    const storage_key = "dev.efaz.communities_renamer";
    function getChromeURL(resource) {
        try {
            // This is for Efaz's Roblox Extension support
            if (chrome.runtime.getManifest()["homepage_url"] == "https://www.efaz.dev/roblox-extension") {
                // This is run under bundled extension [{extension_name}/{resource}]
                return chrome.runtime.getURL("dev.efaz.communities_renamer" + "/" + resource);
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

    try {
        getSettings(storage_key, function (items) {
            let enabled = true;
            let settings = items[storage_key];
            if (typeof (settings["enabled"]) == "boolean") { enabled = settings["enabled"]; };
            if (enabled == true) {
                let tab = window.location;
                if (tab.href) {
                    const localeSets = {
                        "English": ["Communities", "Community", "communities", "community"],
                        "Español": ["Comunidades", "Comunidad", "comunidades", "comunidad"],
                        "Français": ["Communautés", "Communauté", "communautés", "communauté"],
                        "Deutsch": ["Communitys", "Community", "communitys", "community"],
                        "Italiano": ["games", "charts", "discover", "Charts"]
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
                            '.dynamic-overflow-container.text-nav',
                            '.web-blox-css-mui-184cbry',
                            '.groups-list-heading',
                            '.section-title.ng-binding.ng-scope.font-header-1',
                            '.btn-secondary-xs.btn-more.see-all-link-icon.ng-binding.ng-scope',
                            '.web-blox-css-tss-1283320-Button-textContainer',
                            '.summary-transaction-label',
                            '.amount',
                            '.modal-title',
                            '.modal-message',
                            '.section-content-off',
                            '.text-pastname',
                            '.roseal-menu-item > button',
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
                            '.text-label',
                            'h3',
                            '.text-pastname.ng-binding',
                            '#private-server-tooltip',
                            '.back-link',
                            '.font-body',
                            '.text-emphasis',
                            '.keyword-block-list-section-header > div',
                            '.text-content',
                            ".transaction-type-dropdown > div > .dropdown-menu > li > a",
                            ".btn-secondary-md.create-group-button.ng-binding",
                            ".small.text.create-group-text.ng-binding.ng-scope",
                            ".rbx-selection-label",
                            ".groups-list-search-input"
                        ];
                        let custom_renames = [
                            "title",
                            "a"
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
                            if (header.getAttribute("ng-renamed3") == "true") { return true; }
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
                                if (changed == true) { header[a] = val; }
                            }
                            if (k) {
                                m(k);
                            } else {
                                if (header.href && settings["replaceURLwithGroupsURL"] == true) {
                                    header.href = header.href.replace("communities", "groups");
                                }
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
                            if (header.matches("a")) {
                                if (header.getAttribute("ng-click") == "$ctrl.updateRole(role)" || header.getAttribute("ng-click") == "$ctrl.updateRoleFilter(role)") { return; }
                                if (settings["massEdit"] == true) {
                                    if (header.childNodes.length > 0) {
                                        loopThroughArray(header.childNodes, (_, v) => {
                                            addRename(v);
                                        });
                                    } else {
                                        addRename(header);
                                    }
                                }
                            } else if (window.location.pathname.includes("/communities") || window.location.pathname.includes("/groups")) {
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