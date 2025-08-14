/* 

Efaz's Builder Font Remover
By: EfazDev
Page: https://www.efaz.dev/remove-builder-font

inject.js:
    - Content script that injects a stylesheet to remove the builder font

*/

(function () { // Prevent changes made using the Inspect console.
    const storage = chrome.storage.sync;
    const storage_key = "dev.efaz.remove_builder_font";
    var stored_css = "";
    var stored_css2 = "";
    var stored_creator_dashboard_css = "";
    var stored_devforum_css = "";
    var based_font_locations = {
        "Light": {
            "woff": "https://css.rbxcdn.com/5c779fadf28d7893108d5b896e092e0d-GothamSSm-Light.woff",
            "woff2": "https://css.rbxcdn.com/38e00f7de6f417aa3a458560a15e2b8a-GothamSSm-Light.woff2"
        },
        "Book": {
            "woff": "https://css.rbxcdn.com/713e0b3a604ff4e44f55f9d1c100e8b5-GothamSSm-Book.woff",
            "woff2": "https://css.rbxcdn.com/6eafc48312528e2515d622428b6b95cc-GothamSSm-Book.woff2"
        },
        "Medium": {
            "woff": "https://css.rbxcdn.com/2ed7693f8cf4d79466dd604c35502f76-GothamSSm-Medium.woff",
            "woff2": "https://css.rbxcdn.com/66d562e3299ee732a53db150038c026e-GothamSSm-Medium.woff2"
        },
        "Bold": {
            "woff": "https://css.rbxcdn.com/fe0e9885efc341b17f7e600781493f69-GothamSSm-Bold.woff",
            "woff2": "https://css.rbxcdn.com/3c102ace52ea35b16da4383819acfa38-GothamSSm-Bold.woff2"
        },
        "Black": {
            "woff": "https://css.rbxcdn.com/3ac436cddb043616a4059aa6fe3b0c0a-GothamSSm-Black.woff",
            "woff2": "https://css.rbxcdn.com/0acd8ff34f3a5c177d02e9011ee74eb3-GothamSSm-Black.woff2"
        },
        "Mono": {
            "woff": "https://fonts.roblox.com/firamono/FiraMono-Regular.woff",
            "woff2": "https://fonts.roblox.com/firamono/FiraMono-Regular.woff2"
        }
    };

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
    function generateFontLocationsSheet(json, defaultJSON, typeJSON) {
        try {
            var font_locations = JSON.parse(JSON.stringify(based_font_locations));
            if (json[typeJSON]) {
                font_locations["Black"]["woff"] = json[typeJSON]["Black"]["woff"];
                font_locations["Black"]["woff2"] = json[typeJSON]["Black"]["woff2"];

                font_locations["Light"]["woff"] = json[typeJSON]["Light"]["woff"];
                font_locations["Light"]["woff2"] = json[typeJSON]["Light"]["woff2"];

                font_locations["Book"]["woff"] = json[typeJSON]["Book"]["woff"];
                font_locations["Book"]["woff2"] = json[typeJSON]["Book"]["woff2"];

                font_locations["Medium"]["woff"] = json[typeJSON]["Medium"]["woff"];
                font_locations["Medium"]["woff2"] = json[typeJSON]["Medium"]["woff2"];

                font_locations["Bold"]["woff"] = json[typeJSON]["Bold"]["woff"];
                font_locations["Bold"]["woff2"] = json[typeJSON]["Bold"]["woff2"];

                font_locations["Mono"]["woff"] = json[typeJSON]["Mono"]["woff"];
                font_locations["Mono"]["woff2"] = json[typeJSON]["Mono"]["woff2"];
            }
            return font_locations;
        } catch (err) {
            console.warn("There was an error while parsing your custom font locations JSON.");
            return defaultJSON;
        }
    }
    function timeout(func, ms) { setTimeout(func, ms); }
    function getTran(id) {
        if (!(chrome.i18n.getMessage(storage_key.replaceAll(".", "_") + "_" + id) == "")) {
            return chrome.i18n.getMessage(storage_key.replaceAll(".", "_") + "_" + id);
        } else if (!(chrome.i18n.getMessage(id.replaceAll(".", "_")) == "")) {
            return chrome.i18n.getMessage(id.replaceAll(".", "_"));
        }
    }
    async function overwriteResourcesUrl(made_css, source, subdomain_type, old_font_on_sub) {
        if (!(source == "https://oldfont.efaz.dev/")) {
            var font_locations = JSON.parse(JSON.stringify(based_font_locations));
            var custom_sheet = JSON.parse(JSON.stringify(based_font_locations));
            var typeString = "Main";

            if (subdomain_type == 1) {
                typeString = "Main";
            } else if (subdomain_type == 2) {
                typeString = "DevForum";
            } else if (subdomain_type == 3) {
                typeString = "CreatorDashboard";
            } else {
                typeString = "OtherSub";
            }

            if (source.endsWith(".json")) {
                /* Dynamic Font Location Replacement (multiple host/directory support) */

                return fetch(source).then((re) => {
                    if (re.ok) {
                        return re.json().then(j => {
                            custom_sheet = generateFontLocationsSheet(j, font_locations, typeString);

                            made_css = made_css.replaceAll(font_locations["Black"]["woff"], custom_sheet["Black"]["woff"]);
                            made_css = made_css.replaceAll(font_locations["Black"]["woff2"], custom_sheet["Black"]["woff2"]);

                            made_css = made_css.replaceAll(font_locations["Light"]["woff"], custom_sheet["Light"]["woff"]);
                            made_css = made_css.replaceAll(font_locations["Light"]["woff2"], custom_sheet["Light"]["woff2"]);

                            made_css = made_css.replaceAll(font_locations["Book"]["woff"], custom_sheet["Book"]["woff"]);
                            made_css = made_css.replaceAll(font_locations["Book"]["woff2"], custom_sheet["Book"]["woff2"]);

                            made_css = made_css.replaceAll(font_locations["Medium"]["woff"], custom_sheet["Medium"]["woff"]);
                            made_css = made_css.replaceAll(font_locations["Medium"]["woff2"], custom_sheet["Medium"]["woff2"]);

                            made_css = made_css.replaceAll(font_locations["Bold"]["woff"], custom_sheet["Bold"]["woff"]);
                            made_css = made_css.replaceAll(font_locations["Bold"]["woff2"], custom_sheet["Bold"]["woff2"]);

                            made_css = made_css.replaceAll(font_locations["Mono"]["woff"], custom_sheet["Mono"]["woff"]);
                            made_css = made_css.replaceAll(font_locations["Mono"]["woff2"], custom_sheet["Mono"]["woff2"]);
                            return made_css;
                        }).catch(e => {
                            console.warn(`Invalid custom font sheet response. Err: ${e}`);
                            return made_css;
                        });
                    } else {
                        console.warn("Invalid custom font sheet response.");
                        return made_css;
                    }
                }).catch(e => {
                    console.warn(`Invalid custom font sheet response. Err: ${e}`);
                    return made_css;
                });
            } else {
                /* Legacy Font Location Replacement (directory only) */

                if (!(source.endsWith("/"))) {
                    source = `${source}/`;
                }

                if (subdomain_type == 3 || subdomain_type == 4) {
                    if (old_font_on_sub == true) {
                        return made_css;
                    }
                }

                made_css = made_css.replaceAll(font_locations["Black"]["woff"], `${source}Black.woff`);
                made_css = made_css.replaceAll(font_locations["Black"]["woff2"], `${source}Black.woff2`);

                made_css = made_css.replaceAll(font_locations["Light"]["woff"], `${source}Light.woff`);
                made_css = made_css.replaceAll(font_locations["Light"]["woff2"], `${source}Light.woff2`);

                made_css = made_css.replaceAll(font_locations["Book"]["woff"], `${source}Book.woff`);
                made_css = made_css.replaceAll(font_locations["Book"]["woff2"], `${source}Book.woff2`);

                made_css = made_css.replaceAll(font_locations["Medium"]["woff"], `${source}Medium.woff`);
                made_css = made_css.replaceAll(font_locations["Medium"]["woff2"], `${source}Medium.woff2`);

                made_css = made_css.replaceAll(font_locations["Bold"]["woff"], `${source}Bold.woff`);
                made_css = made_css.replaceAll(font_locations["Bold"]["woff2"], `${source}Bold.woff2`);

                made_css = made_css.replaceAll(font_locations["Mono"]["woff"], `${source}Mono.woff`);
                made_css = made_css.replaceAll(font_locations["Mono"]["woff2"], `${source}Mono.woff2`);
                return made_css;
            }
        } else {
            return made_css;
        }
    }
    function sheetToString(sheet) {
        try {
            return sheet.cssRules ? Array.from(sheet.cssRules).map(rule => rule.cssText || "").join("\n") : "";
        } catch (e) { return ""; }
    }
    async function loopThroughArrayAsync(array, callback) {
        if (Array.isArray(array)) {
            for (let a = 0; a < array.length; a++) {
                await callback(a, array[a]);
            }
        } else if (array && typeof array === "object") {
            for (const a in array) {
                if (Object.hasOwn(array, a)) { await callback(a, array[a]); }
            }
        }
    }
    function loopThroughArray(array, callback) {
        if (Array.isArray(array)) {
            for (let a = 0; a < array.length; a++) {
                callback(a, array[a]);
            }
        } else if (array && typeof array === "object") {
            for (const a in array) {
                if (Object.hasOwn(array, a)) { callback(a, array[a]); }
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

    try {
        getSettings(storage_key, function (items) {
            let enabled = true;
            let remoteStyles = false;
            let overwriteCreateDashboard = true;
            let devForum = true;
            let otherSub = true;
            let oldFontOnOtherSub = true;
            let trusted_source = "https://oldfont.efaz.dev/"; /* This is customizable by the user, but they would have to find a fitting url and make sure it's trusted. */
            let settings = items[storage_key];
            if (typeof (settings["enabled"]) == "boolean") { enabled = settings["enabled"]; };
            if (typeof (settings["remoteStyles"]) == "boolean") { remoteStyles = settings["remoteStyles"]; };
            if (typeof (settings["overwriteCreateDashboard"]) == "boolean") { overwriteCreateDashboard = settings["overwriteCreateDashboard"]; };
            if (typeof (settings["overwriteDevForum"]) == "boolean") { devForum = settings["overwriteDevForum"]; };
            if (typeof (settings["overwriteOtherSubdomains"]) == "boolean") { otherSub = settings["overwriteOtherSubdomains"]; };
            if (typeof (settings["onlyUseOldFontOnMainWebsite"]) == "boolean") { oldFontOnOtherSub = settings["onlyUseOldFontOnMainWebsite"]; };
            if (typeof (settings["resourcesUrl"]) == "string") { if (settings["resourcesUrl"] == "https://cdn.efaz.dev/extensions/remove-builder-font/resources/" || settings["resourcesUrl"] == "https://cdn2.efaz.dev/cdn/remove-builder-font/") { settings["resourcesUrl"] = trusted_source; storage.set(items); } trusted_source = settings["resourcesUrl"]; };
            if (enabled == true) {
                let tab = window.location;
                if (tab.href) {
                    if (tab.hostname == "www.roblox.com") {
                        async function injectCSS(css) {
                            if (css && !(document.getElementById("remove-builder-font"))) {
                                const style = document.createElement("style");
                                style.id = "remove-builder-font";
                                style.media = "all";
                                style.textContent = css;
                                document.head.append(style);
                            }
                        }

                        // This is for new WebBlox objects that were added in 2025.
                        async function applyCSS(selector, css) {
                            if (selector.nodeName.toLowerCase() == "style") {
                                let selector_val = selector.textContent;
                                if (!(selector_val.includes("Efaz's Builder Font Remover")) && (selector.getAttribute("data-emotion") == "web-blox-css-mui-global" || selector.getAttribute("data-emotion") == "web-blox-css-mui")) {
                                    let sheet_text = sheetToString(selector.sheet);
                                    if (sheet_text.includes("@font-face")) {
                                        if (selector_val == "") {
                                            selector.textContent = `${sheet_text.replaceAll("Builder Sans", "BuilderRemove").replaceAll("Builder Mono", "BuilderMono")} \n\n${css}`;
                                        } else if (selector_val.includes("/fonts/builder-sans/")) {
                                            selector.textContent = `${sheet_text.replaceAll("Builder Sans", "BuilderRemove").replaceAll("Builder Mono", "BuilderMono")} \n\n${css}`;
                                        }
                                    }
                                } else if (selector.getAttribute("data-emotion") == "web-blox-css-tss" || selector.getAttribute("data-emotion") == "web-blox-css-mui") {
                                    if (!(selector.getAttribute("scanned-builder-font-remove") == "true")) {
                                        let sheet_text = sheetToString(selector.sheet);
                                        if (sheet_text != "") { selector.textContent = selector_val + sheet_text; selector_val = selector.textContent; }
                                        selector.setAttribute("scanned-builder-font-remove", "true");
                                    }
                                    if (!(selector_val.includes("Efaz's Builder Font Remover")) && selector_val.includes("Builder Sans")) {
                                        selector.textContent = `${selector_val.replaceAll("Builder Sans", "BuilderRemove").replaceAll("Builder Mono", "BuilderMono")} \n\n${css}`;
                                    }
                                }
                            } else if (selector.nodeName.toLowerCase() == "link" && selector.rel && selector.rel == "stylesheet" && selector.getAttribute("data-bundlename") == "Builder" && selector.href) {
                                selector.remove();
                            }
                        }
                        async function injectCSS2(css) {
                            if (css) {
                                if (!(document.getElementById("remove-builder-font-2"))) {
                                    const style = document.createElement("style");
                                    style.id = "remove-builder-font-2";
                                    style.media = "all";
                                    style.textContent = css;
                                    document.head.append(style);
                                }

                                let query_names = "style, link"
                                let observer = new MutationObserver((mutations) => {
                                    mutations.forEach(m => {
                                        m.addedNodes.forEach(node => {
                                            if (node.nodeType === Node.ELEMENT_NODE) {
                                                if (node.matches(query_names)) { applyCSS(node, css); }
                                                node.querySelectorAll(query_names).forEach(desc => applyCSS(desc, css));
                                            }
                                        });
                                        if (m.target instanceof Element && m.target.matches(query_names)) {
                                            applyCSS(m.target, css);
                                        }
                                    })
                                });
                                observer.observe(document.documentElement, {
                                    childList: true,
                                    subtree: true,
                                    characterData: true
                                });

                                let all_styles = document.querySelectorAll("style, link");
                                await loopThroughArrayAsync(all_styles, async (_, header) => {
                                    applyCSS(header, css)
                                });
                                all_styles = null;
                            }
                        }
                        function init() {
                            if (stored_css) {
                                overwriteResourcesUrl(stored_css, trusted_source, 1, oldFontOnOtherSub).then(a => {
                                    injectCSS(a);
                                });
                            } else {
                                if (remoteStyles == true) {
                                    fetch("https://cdn.efaz.dev/extensions/dev.efaz.remove_builder_font/chromeExtension/change_font.css").then(res => { return res.text(); }).then(fetched => {
                                        stored_css = fetched;
                                        overwriteResourcesUrl(fetched, trusted_source, 1, oldFontOnOtherSub).then(a => {
                                            injectCSS(a);
                                        });
                                    });
                                } else {
                                    fetch(getChromeURL("change_font.css")).then(res => { return res.text(); }).then(fetched => {
                                        stored_css = fetched;
                                        overwriteResourcesUrl(fetched, trusted_source, 1, oldFontOnOtherSub).then(a => {
                                            injectCSS(a);
                                        });
                                    });
                                }
                            }
                            if (stored_css2) {
                                overwriteResourcesUrl(stored_css2, trusted_source, 1, oldFontOnOtherSub).then(a => {
                                    injectCSS2(a);
                                });
                            } else {
                                if (remoteStyles == true) {
                                    fetch("https://cdn.efaz.dev/extensions/dev.efaz.remove_builder_font/chromeExtension/change_font2.css").then(res => { return res.text(); }).then(fetched => {
                                        stored_css2 = fetched;
                                        overwriteResourcesUrl(fetched, trusted_source, 1, oldFontOnOtherSub).then(a => {
                                            injectCSS2(a);
                                        });
                                    });
                                } else {
                                    fetch(getChromeURL("change_font2.css")).then(res => { return res.text(); }).then(fetched => {
                                        stored_css2 = fetched;
                                        overwriteResourcesUrl(fetched, trusted_source, 1, oldFontOnOtherSub).then(a => {
                                            injectCSS2(a);
                                        });
                                    });
                                }
                            }
                        }
                        if (document.readyState === "loading") {
                            document.addEventListener("DOMContentLoaded", () => {
                                init();
                            });
                        } else { init() }
                    } else if (tab.hostname == "devforum.roblox.com") {
                        if (devForum == true) {
                            async function injectCSS(css, tries) {
                                if (css) {
                                    let new_tries = 0;
                                    if (tries) { new_tries = tries; }
                                    let roblox_provided_stylesheets = document.querySelectorAll("discourse-assets-stylesheets");
                                    let found = false;
                                    if (roblox_provided_stylesheets.length > 0) {
                                        roblox_provided_stylesheets = roblox_provided_stylesheets[0];
                                        if (roblox_provided_stylesheets.children.length > 0) {
                                            let roblox_provided_stylesheets_children = roblox_provided_stylesheets.children;
                                            await loopThroughArrayAsync(roblox_provided_stylesheets_children, async (_, selector) => {
                                                if (selector && (selector.getAttribute("data-theme-name") == "light" || selector.getAttribute("data-theme-name") == "dark" || selector.getAttribute("data-theme-name") == "roblox dark" || selector.getAttribute("data-theme-name") == "grey amber")) {
                                                    selector.remove();
                                                    if (css) {
                                                        const style = document.createElement("style");
                                                        style.id = "remove-builder-font";
                                                        style.media = "all";
                                                        style.textContent = css;
                                                        document.head.append(style);
                                                    }
                                                    found = true;
                                                }
                                            });
                                            if (found == false) {
                                                timeout(() => { injectCSS(css, new_tries + 1); }, settings["startTime"]);
                                            }
                                        } else {
                                            timeout(() => { injectCSS(css, new_tries + 1); }, settings["startTime"]);
                                        }
                                    } else {
                                        timeout(() => { injectCSS(css, new_tries + 1); }, settings["startTime"]);
                                    }
                                    roblox_provided_stylesheets = null;
                                }
                            }
                            function init() {
                                if (stored_devforum_css) {
                                    overwriteResourcesUrl(stored_devforum_css, trusted_source, 2, oldFontOnOtherSub).then(a => {
                                        injectCSS(a, 0);
                                    });
                                } else {
                                    if (remoteStyles == true) {
                                        fetch("https://cdn.efaz.dev/extensions/dev.efaz.remove_builder_font/chromeExtension/devforum_font.css").then(res => { return res.text(); }).then(fetched => {
                                            stored_devforum_css = fetched;
                                            overwriteResourcesUrl(fetched, trusted_source, 2, oldFontOnOtherSub).then(a => {
                                                injectCSS(a, 0);
                                            });
                                        });
                                    } else {
                                        fetch(getChromeURL("devforum_font.css")).then(res => { return res.text(); }).then(fetched => {
                                            stored_devforum_css = fetched;
                                            overwriteResourcesUrl(fetched, trusted_source, 2, oldFontOnOtherSub).then(a => {
                                                injectCSS(a, 0);
                                            });
                                        });
                                    }
                                }
                            }
                            if (document.readyState === "loading") {
                                document.addEventListener("DOMContentLoaded", () => {
                                    init();
                                });
                            } else { init() }
                        }
                    } else if (tab.hostname == "create.roblox.com") {
                        if (overwriteCreateDashboard == true) {
                            async function applyCSS(selector, css) {
                                let sheet_text = sheetToString(selector.sheet);
                                if (selector.getAttribute("data-emotion") == "web-blox-css-mui-global" && sheet_text.includes("@font-face")) {
                                    let selector_val = selector.textContent;
                                    if (!(selector_val.includes("Efaz's Builder Font Remover"))) {
                                        if (selector_val == "") {
                                            selector.textContent = `${sheet_text} \n\n${css}`;
                                        } else if (selector_val.includes("/fonts/builder-sans/")) {
                                            selector.textContent = `${sheet_text} \n\n${css}`;
                                        }
                                    }
                                }
                            }
                            async function injectCSS(css) {
                                if (css) {
                                    let query_names = "style"
                                    let observer = new MutationObserver((mutations) => {
                                        mutations.forEach(m => {
                                            m.addedNodes.forEach(node => {
                                                if (node.nodeType === Node.ELEMENT_NODE) {
                                                    if (node.matches(query_names)) { applyCSS(node, css); }
                                                    node.querySelectorAll(query_names).forEach(desc => applyCSS(desc, css));
                                                }
                                            });
                                            if (m.target instanceof Element && m.target.matches(query_names)) {
                                                applyCSS(m.target, css);
                                            }
                                        })
                                    });
                                    observer.observe(document.documentElement, {
                                        childList: true,
                                        subtree: true,
                                        characterData: true
                                    });
                                    
                                    let selectors = document.querySelectorAll("style");
                                    await loopThroughArrayAsync(selectors, async (_, header) => {
                                        applyCSS(header);
                                    });
                                    selectors = null;
                                }
                            }
                            function init() {
                                if (stored_creator_dashboard_css) {
                                    overwriteResourcesUrl(stored_creator_dashboard_css, trusted_source, 3, oldFontOnOtherSub).then(a => {
                                        injectCSS(a);
                                    });
                                } else {
                                    if (remoteStyles == true) {
                                        fetch("https://cdn.efaz.dev/extensions/dev.efaz.remove_builder_font/chromeExtension/creator_dashboard.css").then(res => { return res.text(); }).then(fetched => {
                                            stored_creator_dashboard_css = fetched;
                                            overwriteResourcesUrl(fetched, trusted_source, 3, oldFontOnOtherSub).then(a => {
                                                injectCSS(a);
                                            });
                                        });
                                    } else {
                                        fetch(getChromeURL("creator_dashboard.css")).then(res => { return res.text(); }).then(fetched => {
                                            stored_creator_dashboard_css = fetched;
                                            overwriteResourcesUrl(fetched, trusted_source, 3, oldFontOnOtherSub).then(a => {
                                                injectCSS(a);
                                            });
                                        });
                                    }
                                }
                            }
                            if (document.readyState === "loading") {
                                document.addEventListener("DOMContentLoaded", () => {
                                    init();
                                });
                            } else { init() }
                        }
                    } else if (tab.hostname.endsWith(".roblox.com")) {
                        if (otherSub == true) {
                            async function applyCSS(selector, css) {
                                if ((selector.getAttribute("data-emotion") == "web-blox-css-mui-global" || selector.getAttribute("data-emotion") == "css-global") && sheetToString(selector.sheet).includes("@font-face")) {
                                    let selector_val = selector.textContent;
                                    if (selector_val == "") {
                                        selector.textContent = css;
                                    } else if (selector_val.includes("@font-face") && selector_val.includes("BuilderSans")) {
                                        selector.textContent = `${selector_val} \n\n${css}`;
                                    }
                                }
                            }
                            async function injectCSS(css) {
                                if (css) {
                                    let query_names = "style"
                                    let observer = new MutationObserver((mutations) => {
                                        mutations.forEach(m => {
                                            m.addedNodes.forEach(node => {
                                                if (node.nodeType === Node.ELEMENT_NODE) {
                                                    if (node.matches(query_names)) { applyCSS(node, css); }
                                                    node.querySelectorAll(query_names).forEach(desc => applyCSS(desc, css));
                                                }
                                            });
                                            if (m.target instanceof Element && m.target.matches(query_names)) {
                                                applyCSS(m.target, css);
                                            }
                                        })
                                    });
                                    observer.observe(document.documentElement, {
                                        childList: true,
                                        subtree: true,
                                        characterData: true
                                    });

                                    let selectors = document.querySelectorAll("style");
                                    await loopThroughArrayAsync(selectors, async (_, header) => {
                                        applyCSS(header);
                                    });
                                    selectors = null;
                                }
                            }
                            function init() {
                                if (stored_creator_dashboard_css) {
                                    overwriteResourcesUrl(stored_creator_dashboard_css, trusted_source, 4, oldFontOnOtherSub).then(a => {
                                        injectCSS(a);
                                    });
                                } else {
                                    if (remoteStyles == true) {
                                        fetch("https://cdn.efaz.dev/extensions/dev.efaz.remove_builder_font/chromeExtension/global_font.css").then(res => { return res.text(); }).then(fetched => {
                                            stored_creator_dashboard_css = fetched;
                                            overwriteResourcesUrl(fetched, trusted_source, 4, oldFontOnOtherSub).then(a => {
                                                injectCSS(a);
                                            });
                                        });
                                    } else {
                                        fetch(getChromeURL("global_font.css")).then(res => { return res.text(); }).then(fetched => {
                                            stored_creator_dashboard_css = fetched;
                                            overwriteResourcesUrl(fetched, trusted_source, 4, oldFontOnOtherSub).then(a => {
                                                injectCSS(a);
                                            });
                                        });
                                    }
                                }
                            }
                            if (document.readyState === "loading") {
                                document.addEventListener("DOMContentLoaded", () => {
                                    init();
                                });
                            } else { init() }
                        }
                    }
                }
            }
        });
    } catch (err) {
        console.warn(`Failed to insert font styles into this tab. Error Message: ${err.message}`);
    }
}());