/* 

Efaz's Builder Font Remover
By: EfazDev
Page: https://www.efaz.dev/remove-builder-font

main.js:
    - Backup script incase of an error or timeout inside inject.js
    - Launches a Thank You page if first time use: [thank-you.html]

*/

(function () { // Prevent changes made using the Inspect console.
    const storage = chrome.storage.sync;
    const storage_key = "dev.efaz.remove_builder_font"
    var stored_css = ""
    var stored_css2 = ""
    var stored_creator_dashboard_css = ""
    var stored_devforum_css = ""

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
    }

    var font_sub_locations = {
        "Light": {
            "woff": "https://fonts.roblox.com/gotham/GothamSSm-Light.woff",
            "woff2": "https://fonts.roblox.com/gotham/GothamSSm-Light.woff2"
        },
        "Book": {
            "woff": "https://fonts.roblox.com/gotham/GothamSSm-Book.woff",
            "woff2": "https://fonts.roblox.com/gotham/GothamSSm-Book.woff2"
        },
        "Medium": {
            "woff": "https://fonts.roblox.com/gotham/GothamSSm-Medium.woff",
            "woff2": "https://fonts.roblox.com/gotham/GothamSSm-Medium.woff2"
        },
        "Bold": {
            "woff": "https://fonts.roblox.com/gotham/GothamSSm-Bold.woff",
            "woff2": "https://fonts.roblox.com/gotham/GothamSSm-Bold.woff2"
        },
        "Black": {
            "woff": "https://fonts.roblox.com/gotham/GothamSSm-Black.woff",
            "woff2": "https://fonts.roblox.com/gotham/GothamSSm-Black.woff2"
        },
        "Mono": {
            "woff": "https://fonts.roblox.com/firamono/FiraMono-Regular.woff",
            "woff2": "https://fonts.roblox.com/firamono/FiraMono-Regular.woff2"
        }
    }

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

    function generateFontLocationsSheet(json, defaultJSON, typeJSON) {
        try {
            var font_locations = JSON.parse(JSON.stringify(based_font_locations));
            if (json[typeJSON]) {
                font_locations["Black"]["woff"] = json[typeJSON]["Black"]["woff"]
                font_locations["Black"]["woff2"] = json[typeJSON]["Black"]["woff2"]

                font_locations["Light"]["woff"] = json[typeJSON]["Light"]["woff"]
                font_locations["Light"]["woff2"] = json[typeJSON]["Light"]["woff2"]

                font_locations["Book"]["woff"] = json[typeJSON]["Book"]["woff"]
                font_locations["Book"]["woff2"] = json[typeJSON]["Book"]["woff2"]

                font_locations["Medium"]["woff"] = json[typeJSON]["Medium"]["woff"]
                font_locations["Medium"]["woff2"] = json[typeJSON]["Medium"]["woff2"]

                font_locations["Bold"]["woff"] = json[typeJSON]["Bold"]["woff"]
                font_locations["Bold"]["woff2"] = json[typeJSON]["Bold"]["woff2"]

                font_locations["Mono"]["woff"] = json[typeJSON]["Mono"]["woff"]
                font_locations["Mono"]["woff2"] = json[typeJSON]["Mono"]["woff2"]
            }
            return font_locations
        } catch (err) {
            console.warn("There was an error while parsing your custom font locations JSON.")
            return defaultJSON
        }
    }

    async function overwriteResourcesUrl(made_css, source, subdomain_type, old_font_on_sub) {
        if (!(source == "https://oldfont.efaz.dev/")) {
            var font_locations = JSON.parse(JSON.stringify(based_font_locations));

            var using_custom_sheet = false
            var custom_sheet = JSON.parse(JSON.stringify(based_font_locations));
            var typeString = "Main"

            if (subdomain_type == 1) {
                typeString = "Main"
            } else if (subdomain_type == 2) {
                typeString = "DevForum"
            } else if (subdomain_type == 3) {
                typeString = "CreatorDashboard"
            } else {
                typeString = "OtherSub"
            }

            if (source.endsWith(".json")) {
                /* Dynamic Font Location Replacement (multiple host/directory support) */

                return fetch(source).then((re) => {
                    if (re.ok) {
                        return re.json().then(j => {
                            custom_sheet = generateFontLocationsSheet(j, font_locations, typeString)

                            /* If stylesheet uses css subdomain */
                            made_css = made_css.replaceAll(font_locations["Black"]["woff"], custom_sheet["Black"]["woff"])
                            made_css = made_css.replaceAll(font_locations["Black"]["woff2"], custom_sheet["Black"]["woff2"])

                            made_css = made_css.replaceAll(font_locations["Light"]["woff"], custom_sheet["Light"]["woff"])
                            made_css = made_css.replaceAll(font_locations["Light"]["woff2"], custom_sheet["Light"]["woff2"])

                            made_css = made_css.replaceAll(font_locations["Book"]["woff"], custom_sheet["Book"]["woff"])
                            made_css = made_css.replaceAll(font_locations["Book"]["woff2"], custom_sheet["Book"]["woff2"])

                            made_css = made_css.replaceAll(font_locations["Medium"]["woff"], custom_sheet["Medium"]["woff"])
                            made_css = made_css.replaceAll(font_locations["Medium"]["woff2"], custom_sheet["Medium"]["woff2"])

                            made_css = made_css.replaceAll(font_locations["Bold"]["woff"], custom_sheet["Bold"]["woff"])
                            made_css = made_css.replaceAll(font_locations["Bold"]["woff2"], custom_sheet["Bold"]["woff2"])

                            made_css = made_css.replaceAll(font_locations["Mono"]["woff"], custom_sheet["Mono"]["woff"])
                            made_css = made_css.replaceAll(font_locations["Mono"]["woff2"], custom_sheet["Mono"]["woff2"])
                            /* If stylesheet uses css subdomain */

                            /* If stylesheet uses fonts subdomain */
                            made_css = made_css.replaceAll(font_sub_locations["Black"]["woff"], custom_sheet["Black"]["woff"])
                            made_css = made_css.replaceAll(font_sub_locations["Black"]["woff2"], custom_sheet["Black"]["woff2"])

                            made_css = made_css.replaceAll(font_sub_locations["Light"]["woff"], custom_sheet["Light"]["woff"])
                            made_css = made_css.replaceAll(font_sub_locations["Light"]["woff2"], custom_sheet["Light"]["woff2"])

                            made_css = made_css.replaceAll(font_sub_locations["Book"]["woff"], custom_sheet["Book"]["woff"])
                            made_css = made_css.replaceAll(font_sub_locations["Book"]["woff2"], custom_sheet["Book"]["woff2"])

                            made_css = made_css.replaceAll(font_sub_locations["Medium"]["woff"], custom_sheet["Medium"]["woff"])
                            made_css = made_css.replaceAll(font_sub_locations["Medium"]["woff2"], custom_sheet["Medium"]["woff2"])

                            made_css = made_css.replaceAll(font_sub_locations["Bold"]["woff"], custom_sheet["Bold"]["woff"])
                            made_css = made_css.replaceAll(font_sub_locations["Bold"]["woff2"], custom_sheet["Bold"]["woff2"])

                            made_css = made_css.replaceAll(font_sub_locations["Mono"]["woff"], custom_sheet["Mono"]["woff"])
                            made_css = made_css.replaceAll(font_sub_locations["Mono"]["woff2"], custom_sheet["Mono"]["woff2"])
                            /* If stylesheet uses fonts subdomain */

                            return made_css
                        }).catch(e => {
                            console.warn(`Invalid custom font sheet response. Err: ${e}`)
                            return made_css
                        })
                    } else {
                        console.warn("Invalid custom font sheet response.")
                        return made_css
                    }
                }).catch(e => {
                    console.warn(`Invalid custom font sheet response. Err: ${e}`)
                    return made_css
                })
            } else {
                /* Legacy Font Location Replacement (directory only) */

                if (!(source.endsWith("/"))) {
                    source = `${source}/`
                }

                if (subdomain_type == 3 || subdomain_type == 4) {
                    if (old_font_on_sub == true) {
                        return made_css;
                    }
                }
                /* If stylesheet uses css subdomain */
                made_css = made_css.replaceAll(font_locations["Black"]["woff"], `${source}Black.woff`)
                made_css = made_css.replaceAll(font_locations["Black"]["woff2"], `${source}Black.woff2`)

                made_css = made_css.replaceAll(font_locations["Light"]["woff"], `${source}Light.woff`)
                made_css = made_css.replaceAll(font_locations["Light"]["woff2"], `${source}Light.woff2`)

                made_css = made_css.replaceAll(font_locations["Book"]["woff"], `${source}Book.woff`)
                made_css = made_css.replaceAll(font_locations["Book"]["woff2"], `${source}Book.woff2`)

                made_css = made_css.replaceAll(font_locations["Medium"]["woff"], `${source}Medium.woff`)
                made_css = made_css.replaceAll(font_locations["Medium"]["woff2"], `${source}Medium.woff2`)

                made_css = made_css.replaceAll(font_locations["Bold"]["woff"], `${source}Bold.woff`)
                made_css = made_css.replaceAll(font_locations["Bold"]["woff2"], `${source}Bold.woff2`)

                made_css = made_css.replaceAll(font_locations["Mono"]["woff"], `${source}Mono.woff`)
                made_css = made_css.replaceAll(font_locations["Mono"]["woff2"], `${source}Mono.woff2`)
                /* If stylesheet uses css subdomain */

                /* If stylesheet uses fonts subdomain */
                made_css = made_css.replaceAll(font_sub_locations["Black"]["woff"], `${source}Black.woff`)
                made_css = made_css.replaceAll(font_sub_locations["Black"]["woff2"], `${source}Black.woff2`)

                made_css = made_css.replaceAll(font_sub_locations["Light"]["woff"], `${source}Light.woff`)
                made_css = made_css.replaceAll(font_sub_locations["Light"]["woff2"], `${source}Light.woff2`)

                made_css = made_css.replaceAll(font_sub_locations["Book"]["woff"], `${source}Book.woff`)
                made_css = made_css.replaceAll(font_sub_locations["Book"]["woff2"], `${source}Book.woff2`)

                made_css = made_css.replaceAll(font_sub_locations["Medium"]["woff"], `${source}Medium.woff`)
                made_css = made_css.replaceAll(font_sub_locations["Medium"]["woff2"], `${source}Medium.woff2`)

                made_css = made_css.replaceAll(font_sub_locations["Bold"]["woff"], `${source}Bold.woff`)
                made_css = made_css.replaceAll(font_sub_locations["Bold"]["woff2"], `${source}Bold.woff2`)

                made_css = made_css.replaceAll(font_sub_locations["Mono"]["woff"], `${source}Mono.woff`)
                made_css = made_css.replaceAll(font_sub_locations["Mono"]["woff2"], `${source}Mono.woff2`)
                /* If stylesheet uses fonts subdomain */
                return made_css
            }
        } else {
            return made_css
        }
    }

    async function loopThroughArrayAsync(array, callback) {
        if (typeof (array) == "object") {
            if (Array.isArray(array)) {
                for (let a = 0; a < array.length; a++) {
                    var value = array[a]
                    await callback(a, value)
                }
            } else {
                var generated_keys = Object.keys(array);
                for (let a = 0; a < generated_keys.length; a++) {
                    var key = generated_keys[a]
                    var value = array[key]
                    await callback(key, value)
                }
            }
        }
    }

    async function getSettings(storage_key, callback) {
        if (callback) {
            fetch(getChromeURL("settings.json")).then((res) => {
                if (res.ok) {
                    return res.json();
                }
            }).then(jso => {
                if (jso) {
                    return storage.get(storage_key).then(async (user_settings) => {
                        if (!user_settings) {
                            user_settings = {}
                        }
                        if (!(user_settings[storage_key])) {
                            user_settings[storage_key] = {}
                        }
                        await loopThroughArrayAsync(jso["settings"], async (i, v) => {
                            if (typeof (user_settings[storage_key][i]) == "undefined") {
                                if (!(typeof(v["default"]) == "undefined")) { user_settings[storage_key][i] = v["default"] }
                            }
                        })
                        callback(user_settings)
                    })
                }
            })
        } else {
            return fetch(getChromeURL("settings.json")).then((res) => {
                if (res.ok) {
                    return res.json();
                }
            }).then(jso => {
                if (jso) {
                    return storage.get(storage_key).then(async (user_settings) => {
                        if (!user_settings) {
                            user_settings = {}
                        }
                        if (!(user_settings[storage_key])) {
                            user_settings[storage_key] = {}
                        }
                        await loopThroughArrayAsync(jso["settings"], async (i, v) => {
                            if (typeof (user_settings[storage_key][i]) == "undefined") {
                                if (!(typeof(v["default"]) == "undefined")) { user_settings[storage_key][i] = v["default"] }
                            }
                        })
                        return user_settings
                    })
                }
            })
        }
    }

    chrome.tabs.onUpdated.addListener(function (tabId, details, tab) {
        try {
            getSettings(storage_key, function (items) {
                var enabled = true;
                var remoteStyles = false;
                var overwriteCreateDashboard = true;
                var devForum = true;
                var otherSub = true;
                var oldFontOnOtherSub = true;
                var trusted_source = "https://oldfont.efaz.dev/"; /* This is customizable by the user, but they would have to find a fitting url and make sure it's trusted. */

                if (items[storage_key]) {
                    if (typeof (items[storage_key]["enabled"]) == "boolean") { enabled = items[storage_key]["enabled"] };
                    if (typeof (items[storage_key]["remoteStyles"]) == "boolean") { remoteStyles = items[storage_key]["remoteStyles"] };
                    if (typeof (items[storage_key]["overwriteCreateDashboard"]) == "boolean") { overwriteCreateDashboard = items[storage_key]["overwriteCreateDashboard"] };
                    if (typeof (items[storage_key]["overwriteDevForum"]) == "boolean") { devForum = items[storage_key]["overwriteDevForum"] };
                    if (typeof (items[storage_key]["overwriteOtherSubdomains"]) == "boolean") { otherSub = items[storage_key]["overwriteOtherSubdomains"] };
                    if (typeof (items[storage_key]["onlyUseOldFontOnMainWebsite"]) == "boolean") { oldFontOnOtherSub = items[storage_key]["onlyUseOldFontOnMainWebsite"] };
                    if (typeof (items[storage_key]["resourcesUrl"]) == "string") { if (items[storage_key]["resourcesUrl"] == "https://cdn.efaz.dev/extensions/remove-builder-font/resources/" || items[storage_key]["resourcesUrl"] == "https://cdn2.efaz.dev/cdn/remove-builder-font/") { items[storage_key]["resourcesUrl"] = trusted_source; storage.set(items); } trusted_source = items[storage_key]["resourcesUrl"] };
                }
                if (enabled == true) {
                    if (tab.url || tab.pendingUrl) {
                        var urlObj = new URL(tab.url || tab.pendingUrl)
                        if (urlObj.hostname == "www.roblox.com") {
                            async function injectCSS(css, settings) {
                                if (document.getElementById("remove-builder-font") == null) {
                                    if (css) {
                                        const style = document.createElement("style")
                                        style.id = "remove-builder-font";
                                        style.media = "all";
                                        style.innerHTML = css
                                        document.head.append(style)
                                    }
                                }
                            }
                            if (stored_css) {
                                overwriteResourcesUrl(stored_css, trusted_source, 1, oldFontOnOtherSub).then(generated_css => {
                                    chrome.scripting.executeScript({
                                        target: { tabId: tabId, allFrames: true },
                                        func: injectCSS,
                                        args: [generated_css, items[storage_key]]
                                    })
                                })
                            } else {
                                if (remoteStyles == true) {
                                    fetch("https://cdn.efaz.dev/extensions/dev.efaz.remove_builder_font/chromeExtension/change_font.css").then(res => { return res.text() }).then(fetched => {
                                        stored_css = fetched
                                        overwriteResourcesUrl(fetched, trusted_source, 1, oldFontOnOtherSub).then(generated_css => {
                                            chrome.scripting.executeScript({
                                                target: { tabId: tabId, allFrames: true },
                                                func: injectCSS,
                                                args: [generated_css, items[storage_key]]
                                            })
                                        })
                                    })
                                } else {
                                    fetch(getChromeURL("change_font.css")).then(res => { return res.text() }).then(fetched => {
                                        stored_css = fetched
                                        overwriteResourcesUrl(fetched, trusted_source, 1, oldFontOnOtherSub).then(generated_css => {
                                            chrome.scripting.executeScript({
                                                target: { tabId: tabId, allFrames: true },
                                                func: injectCSS,
                                                args: [generated_css, items[storage_key]]
                                            })
                                        })
                                    })
                                }
                            }

                            // This is for new WebBlox objects that were added in 2025.
                            async function injectCSS2(css, settings) {
                                if (css) {
                                    async function loopThroughArrayAsync(array, callback) {
                                        var generated_keys = Object.keys(array);
                                        for (a = 0; a < generated_keys.length; a++) {
                                            var key = generated_keys[a];
                                            var value = array[key];
                                            await callback(key, value);
                                        };
                                    };

                                    var selectors = document.getElementsByTagName("style")
                                    selectors = Array.prototype.slice.call(selectors);
                                    await loopThroughArrayAsync(selectors, async (_, selector) => {
                                        var sheet_text = sheetToString(selector.sheet)
                                        if ((selector.getAttribute("data-emotion") == "web-blox-css-mui-global" || selector.getAttribute("data-emotion") == "web-blox-css-mui") && sheet_text.includes("@font-face")) {
                                            if (!(selector.innerHTML.includes("Efaz's Builder Font Remover"))) {
                                                if (selector.innerHTML == "") {
                                                    selector.innerHTML = `${sheet_text.replaceAll("Builder Sans", "BuilderRemove").replaceAll("Builder Mono", "BuilderMono")} \n\n${css}`
                                                } else if (selector.innerHTML.includes("/fonts/builder-sans/")) {
                                                    selector.innerHTML = `${sheet_text.replaceAll("Builder Sans", "BuilderRemove").replaceAll("Builder Mono", "BuilderMono")} \n\n${css}`
                                                }
                                            }
                                        } else if (selector.getAttribute("data-emotion") == "web-blox-css-tss" || selector.getAttribute("data-emotion") == "web-blox-css-mui") {
                                            if (sheet_text != "" && selector.getAttribute("applied_font") == "true") { selector.innerHTML = selector.innerHTML + sheet_text; selector.setAttribute("applied_font", "true") }
                                            if (selector.innerHTML.includes("Builder Sans") && !(selector.innerHTML.includes("Efaz's Builder Font Remover"))) {
                                                selector.innerHTML = `${selector.innerHTML.replaceAll("Builder Sans", "BuilderRemove").replaceAll("Builder Mono", "BuilderMono")} \n\n${css}`
                                            }
                                        }
                                    })

                                    if (document.getElementById("remove-builder-font-2") == null) {
                                        if (css) {
                                            const style = document.createElement("style")
                                            style.id = "remove-builder-font-2";
                                            style.media = "all";
                                            style.innerHTML = css
                                            document.head.append(style)
                                        }
                                    }

                                    var all_links = document.getElementsByTagName("link")
                                    all_links = Array.prototype.slice.call(all_links);
                                    loopThroughArrayAsync(all_links, async (_, header) => {
                                        var affect_bundles = ["Builder"]
                                        if (header.rel && header.rel == "stylesheet" && (affect_bundles.includes(header.getAttribute("data-bundlename"))) && header.href) {
                                            header.remove()
                                        }
                                    })

                                    setTimeout(() => { injectCSS2(css, settings) }, settings["startTime"])
                                }
                            }
                            if (stored_css2) {
                                overwriteResourcesUrl(stored_css2, trusted_source, 1, oldFontOnOtherSub).then(generated_css => {
                                    chrome.scripting.executeScript({
                                        target: { tabId: tabId, allFrames: true },
                                        func: injectCSS2,
                                        args: [generated_css, items[storage_key]]
                                    })
                                })
                            } else {
                                if (remoteStyles == true) {
                                    fetch("https://cdn.efaz.dev/extensions/dev.efaz.remove_builder_font/chromeExtension/change_font2.css").then(res => { return res.text() }).then(fetched => {
                                        stored_css2 = fetched
                                        overwriteResourcesUrl(fetched, trusted_source, 1, oldFontOnOtherSub).then(generated_css => {
                                            chrome.scripting.executeScript({
                                                target: { tabId: tabId, allFrames: true },
                                                func: injectCSS2,
                                                args: [generated_css, items[storage_key]]
                                            })
                                        })
                                    })
                                } else {
                                    fetch(getChromeURL("change_font2.css")).then(res => { return res.text() }).then(fetched => {
                                        stored_css2 = fetched
                                        overwriteResourcesUrl(fetched, trusted_source, 1, oldFontOnOtherSub).then(generated_css => {
                                            chrome.scripting.executeScript({
                                                target: { tabId: tabId, allFrames: true },
                                                func: injectCSS2,
                                                args: [generated_css, items[storage_key]]
                                            })
                                        })
                                    })
                                }
                            }
                        } else if (urlObj.hostname == "devforum.roblox.com") {
                            if (devForum == true) {
                                async function injectCSS(css, tries, settings) {
                                    if (css) {
                                        var new_tries = 0
                                        if (tries) {
                                            new_tries = tries
                                        }
                                        async function loopThroughArrayAsync(array, callback) {
                                            if (typeof (array) == "object") {
                                                if (Array.isArray(array)) {
                                                    for (let a = 0; a < array.length; a++) {
                                                        var value = array[a]
                                                        await callback(a, value)
                                                    }
                                                } else {
                                                    var generated_keys = Object.keys(array);
                                                    for (let a = 0; a < generated_keys.length; a++) {
                                                        var key = generated_keys[a]
                                                        var value = array[key]
                                                        await callback(key, value)
                                                    }
                                                }
                                            }
                                        }
                                        var roblox_provided_stylesheets = document.getElementsByTagName("discourse-assets-stylesheets")
                                        var found = false
                                        if (roblox_provided_stylesheets.length > 0) {
                                            roblox_provided_stylesheets = Array.prototype.slice.call(roblox_provided_stylesheets)[0];
                                            if (roblox_provided_stylesheets.children.length > 0) {
                                                var roblox_provided_stylesheets_children = Array.prototype.slice.call(roblox_provided_stylesheets.children);
                                                loopThroughArrayAsync(roblox_provided_stylesheets_children, async (_, selector) => {
                                                    if (selector && (selector.getAttribute("data-theme-name") == "light" || selector.getAttribute("data-theme-name") == "dark" || selector.getAttribute("data-theme-name") == "roblox dark" || selector.getAttribute("data-theme-name") == "grey amber")) {
                                                        selector.remove()
                                                        if (css) {
                                                            const style = document.createElement("style")
                                                            style.id = "remove-builder-font";
                                                            style.media = "all";
                                                            style.innerHTML = css
                                                            document.head.append(style)
                                                        }
                                                        found = true
                                                    }
                                                })
                                                if (found == false) {
                                                    setTimeout(() => { injectCSS(css, new_tries + 1, settings) }, settings["startTime"])
                                                }
                                            } else {
                                                setTimeout(() => { injectCSS(css, new_tries + 1, settings) }, settings["startTime"])
                                            }
                                        } else {
                                            setTimeout(() => { injectCSS(css, new_tries + 1, settings) }, settings["startTime"])
                                        }
                                    }
                                }
                                if (stored_devforum_css) {
                                    overwriteResourcesUrl(stored_devforum_css, trusted_source, 2, oldFontOnOtherSub).then(generated_css => {
                                        chrome.scripting.executeScript({
                                            target: { tabId: tabId, allFrames: true },
                                            func: injectCSS,
                                            args: [generated_css, 0, items[storage_key]]
                                        })
                                    })
                                } else {
                                    if (remoteStyles == true) {
                                        fetch("https://cdn.efaz.dev/extensions/dev.efaz.remove_builder_font/chromeExtension/devforum_font.css").then(res => { return res.text() }).then(fetched => {
                                            stored_devforum_css = fetched
                                            overwriteResourcesUrl(fetched, trusted_source, 2, oldFontOnOtherSub).then(generated_css => {
                                                chrome.scripting.executeScript({
                                                    target: { tabId: tabId, allFrames: true },
                                                    func: injectCSS,
                                                    args: [generated_css, 0, items[storage_key]]
                                                })
                                            })
                                        })
                                    } else {
                                        fetch(getChromeURL("devforum_font.css")).then(res => { return res.text() }).then(fetched => {
                                            stored_devforum_css = fetched
                                            overwriteResourcesUrl(fetched, trusted_source, 2, oldFontOnOtherSub).then(generated_css => {
                                                chrome.scripting.executeScript({
                                                    target: { tabId: tabId, allFrames: true },
                                                    func: injectCSS,
                                                    args: [generated_css, 0, items[storage_key]]
                                                })
                                            })
                                        })
                                    }
                                }
                            }
                        } else if (urlObj.hostname == "create.roblox.com") {
                            if (overwriteCreateDashboard == true) {
                                async function injectCSS(css, tries, settings) {
                                    if (css) {
                                        var new_tries = 0
                                        if (tries) {
                                            new_tries = tries
                                        }
                                        if (document.querySelector("head > style:nth-child(1)")) {
                                            var selector = document.querySelector("head > style:nth-child(1)");
                                            var sheet_text = sheetToString(selector.sheet)
                                            if (sheet_text.includes("@font-face")) {
                                                if (!(selector.innerHTML.includes("Efaz's Builder Font Remover"))) {
                                                    if (selector.innerHTML == "") {
                                                        selector.innerHTML = `${sheet_text} \n\n${css}`
                                                    } else if (selector.innerHTML.includes("/fonts/builder-sans/")) {
                                                        selector.innerHTML = `${sheet_text} \n\n${css}`
                                                    }
                                                }
                                            }
                                        } else {
                                            var selectors = document.head.getElementsByTagName("style")
                                            for (q = 0; q < selectors.length; q++) {
                                                let selector = selectors[q]
                                                let sheet_text = sheetToString(selector.sheet)
                                                if (selector.getAttribute("data-emotion") == "web-blox-css-mui-global" && sheet_text.includes("@font-face")) {
                                                    if (!(selector.innerHTML.includes("Efaz's Builder Font Remover"))) {
                                                        if (selector.innerHTML == "") {
                                                            selector.innerHTML = `${sheet_text} \n\n${css}`
                                                        } else if (selector.innerHTML.includes("/fonts/builder-sans/")) {
                                                            selector.innerHTML = `${sheet_text} \n\n${css}`
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                        setTimeout(() => { injectCSS(css, new_tries + 1, settings) }, settings["startTime"])
                                    }
                                }
                                if (stored_creator_dashboard_css) {
                                    overwriteResourcesUrl(stored_creator_dashboard_css, trusted_source, 3, oldFontOnOtherSub).then(generated_css => {
                                        chrome.scripting.executeScript({
                                            target: { tabId: tabId, allFrames: true },
                                            func: injectCSS,
                                            args: [generated_css, 0, items[storage_key]]
                                        })
                                    })
                                } else {
                                    if (remoteStyles == true) {
                                        fetch("https://cdn.efaz.dev/extensions/dev.efaz.remove_builder_font/chromeExtension/creator_dashboard.css").then(res => { return res.text() }).then(fetched => {
                                            stored_creator_dashboard_css = fetched
                                            overwriteResourcesUrl(fetched, trusted_source, 3, oldFontOnOtherSub).then(generated_css => {
                                                chrome.scripting.executeScript({
                                                    target: { tabId: tabId, allFrames: true },
                                                    func: injectCSS,
                                                    args: [generated_css, 0, items[storage_key]]
                                                })
                                            })
                                        })
                                    } else {
                                        fetch(getChromeURL("creator_dashboard.css")).then(res => { return res.text() }).then(fetched => {
                                            stored_creator_dashboard_css = fetched
                                            overwriteResourcesUrl(fetched, trusted_source, 3, oldFontOnOtherSub).then(generated_css => {
                                                chrome.scripting.executeScript({
                                                    target: { tabId: tabId, allFrames: true },
                                                    func: injectCSS,
                                                    args: [generated_css, 0, items[storage_key]]
                                                })
                                            })
                                        })
                                    }
                                }
                            }
                        } else if (urlObj.hostname.includes(".roblox.com")) {
                            if (otherSub == true && !(urlObj.hostname.includes("create.roblox.com"))) {
                                async function injectCSS(css, tries, settings) {
                                    if (css) {
                                        var new_tries = 0
                                        if (tries) {
                                            new_tries = tries
                                        }

                                        if (document.querySelector("head > style:nth-child(1)")) {
                                            var selector = document.querySelector("head > style:nth-child(1)");
                                            if (sheetToString(selector.sheet).includes("@font-face")) {
                                                if (selector.innerHTML == "") {
                                                    selector.innerHTML = css
                                                }
                                            } else {
                                                setTimeout(() => { injectCSS(css, new_tries + 1) }, settings["startTime"])
                                            }
                                        } else {
                                            var selectors = document.head.getElementsByTagName("style")
                                            var found = false
                                            for (q = 0; q < selectors.length; q++) {
                                                var selector = selectors[q]
                                                if (selector.getAttribute("data-emotion") == "web-blox-css-mui-global" && sheetToString(selector.sheet).includes("@font-face")) {
                                                    if (selector.innerHTML == "") {
                                                        selector.innerHTML = css
                                                        found = true
                                                    }
                                                }
                                            }
                                            if (found == false) {
                                                setTimeout(() => { injectCSS(css, new_tries + 1, settings) }, settings["startTime"])
                                            }
                                        }
                                    }
                                }
                                if (stored_creator_dashboard_css) {
                                    overwriteResourcesUrl(stored_creator_dashboard_css, trusted_source, 4, oldFontOnOtherSub).then(generated_css => {
                                        chrome.scripting.executeScript({
                                            target: { tabId: tabId, allFrames: true },
                                            func: injectCSS,
                                            args: [generated_css, 0, items[storage_key]]
                                        })
                                    })
                                } else {
                                    if (remoteStyles == true) {
                                        fetch("https://cdn.efaz.dev/extensions/dev.efaz.remove_builder_font/chromeExtension/global_font.css").then(res => { return res.text() }).then(fetched => {
                                            stored_creator_dashboard_css = fetched
                                            overwriteResourcesUrl(fetched, trusted_source, 4, oldFontOnOtherSub).then(generated_css => {
                                                chrome.scripting.executeScript({
                                                    target: { tabId: tabId, allFrames: true },
                                                    func: injectCSS,
                                                    args: [generated_css, 0, items[storage_key]]
                                                })
                                            })
                                        })
                                    } else {
                                        fetch(getChromeURL("global_font.css")).then(res => { return res.text() }).then(fetched => {
                                            stored_creator_dashboard_css = fetched
                                            overwriteResourcesUrl(fetched, trusted_source, 4, oldFontOnOtherSub).then(generated_css => {
                                                chrome.scripting.executeScript({
                                                    target: { tabId: tabId, allFrames: true },
                                                    func: injectCSS,
                                                    args: [generated_css, 0, items[storage_key]]
                                                })
                                            })
                                        })
                                    }
                                }
                            }
                        }
                    }
                }
            });
        } catch (err) {
            console.warn(`Failed to insert font styles into this tab. Error Message: ${err.message}`)
        }
    });

    chrome.runtime.onInstalled.addListener(() => {
        fetch("settings.json").then(setting_res => {
            return setting_res.json();
        }).then(settings => {
            var name = settings["name"];
            chrome.storage.local.get([name], async function (items) {
                if (items[name]) {
                    if (items[name]["thanks"] == true) {
                        console.log("The extension might have updated!")
                        return
                    } else {
                        items[name]["thanks"] = true
                        chrome.tabs.create({
                            url: getChromeURL("thank_you.html")
                        })
                        await chrome.storage.local.set(items);
                    }
                } else {
                    items[name] = { "thanks": true }
                    chrome.tabs.create({
                        url: getChromeURL("thank_you.html")
                    })
                    await chrome.storage.local.set(items);
                }
            });
        })
    });
}())