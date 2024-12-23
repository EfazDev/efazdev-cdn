/* 

Efaz's Builder Font Remover
By: EfazDev
Page: https://www.efaz.dev/remove-builder-font

inject.js:
    - Content script that injects a stylesheet to remove the builder font

*/

(function () { // Prevent changes made using the Inspect console.
    const storage = chrome.storage.sync;
    var stored_css = ""
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
                return made_css
            }
        } else {
            return made_css
        }
    }

    function sheetToString(sheet) {
        function stringifyRule(rule) {
            return rule.cssText || ''
        }
        var text = sheet.cssRules
            ? Array.from(sheet.cssRules)
                .map(rule => stringifyRule(rule))
                .join('\n')
            : ''
        return text;
    }

    try {
        var storage_key = "dev.efaz.remove_builder_font"
        storage.get([storage_key], function (items) {
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
                if (typeof (items[storage_key]["resourcesUrl"]) == "string") { if (items[storage_key]["resourcesUrl"] == "https://cdn.efaz.dev/cdn/extensions/remove-builder-font/resources/" || items[storage_key]["resourcesUrl"] == "https://cdn2.efaz.dev/cdn/remove-builder-font/") { items[storage_key]["resourcesUrl"] = trusted_source; storage.set(items); } trusted_source = items[storage_key]["resourcesUrl"] };
            }
            if (enabled == true) {
                var tab = window.location
                if (tab.href) {
                    var urlObj = window.location
                    if (urlObj.hostname == "www.roblox.com") {
                        function injectCSS(css) {
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
                            overwriteResourcesUrl(stored_css, trusted_source, 1, oldFontOnOtherSub).then(a => {
                                injectCSS(a)
                            })
                        } else {
                            if (remoteStyles == true) {
                                fetch("https://cdn.efaz.dev/cdn/extensions/remove-builder-font/chromeExtension/change_font.css").then(res => { return res.text() }).then(fetched => {
                                    stored_css = fetched
                                    overwriteResourcesUrl(fetched, trusted_source, 1, oldFontOnOtherSub).then(a => {
                                        injectCSS(a)
                                    })
                                })
                            } else {
                                fetch(chrome.runtime.getURL("change_font.css")).then(res => { return res.text() }).then(fetched => {
                                    stored_css = fetched
                                    overwriteResourcesUrl(fetched, trusted_source, 1, oldFontOnOtherSub).then(a => {
                                        injectCSS(a)
                                    })
                                })
                            }
                        }
                    } else if (urlObj.hostname == "devforum.roblox.com") {
                        if (devForum == true) {
                            function injectCSS(css, tries) {
                                if (css) {
                                    var new_tries = 0
                                    if (tries) {
                                        new_tries = tries
                                    }
                                    var roblox_provided_stylesheets = document.getElementsByTagName("discourse-assets-stylesheets")
                                    var found = false
                                    if (roblox_provided_stylesheets.length > 0) {
                                        roblox_provided_stylesheets = Array.prototype.slice.call(roblox_provided_stylesheets)[0];
                                        if (roblox_provided_stylesheets.children.length > 0) {
                                            var roblox_provided_stylesheets_children = Array.prototype.slice.call(roblox_provided_stylesheets.children);
                                            roblox_provided_stylesheets_children.forEach((selector) => {
                                                if (selector && selector.getAttribute("data-theme-id") == "3") {
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
                                                setTimeout(() => { injectCSS(css, new_tries + 1) }, 100)
                                            }
                                        } else {
                                            setTimeout(() => { injectCSS(css, new_tries + 1) }, 100)
                                        }
                                    } else {
                                        setTimeout(() => { injectCSS(css, new_tries + 1) }, 100)
                                    }
                                }
                            }
                            if (stored_devforum_css) {
                                overwriteResourcesUrl(stored_devforum_css, trusted_source, 2, oldFontOnOtherSub).then(a => {
                                    injectCSS(a)
                                })
                            } else {
                                if (remoteStyles == true) {
                                    fetch("https://cdn.efaz.dev/cdn/extensions/remove-builder-font/chromeExtension/devforum_font.css").then(res => { return res.text() }).then(fetched => {
                                        stored_devforum_css = fetched
                                        overwriteResourcesUrl(fetched, trusted_source, 2, oldFontOnOtherSub).then(a => {
                                            injectCSS(a)
                                        })
                                    })
                                } else {
                                    fetch(chrome.runtime.getURL("devforum_font.css")).then(res => { return res.text() }).then(fetched => {
                                        stored_devforum_css = fetched
                                        overwriteResourcesUrl(fetched, trusted_source, 2, oldFontOnOtherSub).then(a => {
                                            injectCSS(a)
                                        })
                                    })
                                }
                            }
                        }
                    } else if (urlObj.hostname == "create.roblox.com") {
                        if (overwriteCreateDashboard == true) {
                            function injectCSS(css, tries) {
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
                                        } else {
                                            setTimeout(() => { injectCSS(css, new_tries + 1) }, 100)
                                        }
                                    } else {
                                        var selectors = document.head.getElementsByTagName("style")
                                        var found = false
                                        for (q = 0; q < selectors.length; q++) {
                                            var selector = selectors[q]
                                            var sheet_text = sheetToString(selector.sheet)
                                            if (selector.getAttribute("data-emotion") == "web-blox-css-mui-global" && sheet_text.includes("@font-face")) {
                                                if (!(selector.innerHTML.includes("Efaz's Builder Font Remover"))) {
                                                    if (selector.innerHTML == "") {
                                                        selector.innerHTML = `${sheet_text} \n\n${css}`
                                                        found = true
                                                    } else if (selector.innerHTML.includes("/fonts/builder-sans/")) {
                                                        selector.innerHTML = `${sheet_text} \n\n${css}`
                                                        found = true
                                                    }
                                                }
                                            }
                                        }
                                        if (found == false) {
                                            setTimeout(() => { injectCSS(css, new_tries + 1) }, 100)
                                        }
                                    }
                                }
                            }
                            if (stored_creator_dashboard_css) {
                                overwriteResourcesUrl(stored_creator_dashboard_css, trusted_source, 3, oldFontOnOtherSub).then(a => {
                                    injectCSS(a)
                                })
                            } else {
                                if (remoteStyles == true) {
                                    fetch("https://cdn.efaz.dev/cdn/extensions/remove-builder-font/chromeExtension/creator_dashboard.css").then(res => { return res.text() }).then(fetched => {
                                        stored_creator_dashboard_css = fetched
                                        overwriteResourcesUrl(fetched, trusted_source, 3, oldFontOnOtherSub).then(a => {
                                            injectCSS(a)
                                        })
                                    })
                                } else {
                                    fetch(chrome.runtime.getURL("creator_dashboard.css")).then(res => { return res.text() }).then(fetched => {
                                        stored_creator_dashboard_css = fetched
                                        overwriteResourcesUrl(fetched, trusted_source, 3, oldFontOnOtherSub).then(a => {
                                            injectCSS(a)
                                        })
                                    })
                                }
                            }
                        }
                    } else if (urlObj.hostname.includes(".roblox.com")) {
                        if (otherSub == true && !(urlObj.hostname.includes("create.roblox.com"))) {
                            function injectCSS(css, tries) {
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
                                            setTimeout(() => { injectCSS(css, new_tries + 1) }, 100)
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
                                            setTimeout(() => { injectCSS(css, new_tries + 1) }, 100)
                                        }
                                    }
                                }
                            }
                            if (stored_creator_dashboard_css) {
                                overwriteResourcesUrl(stored_creator_dashboard_css, trusted_source, 4, oldFontOnOtherSub).then(a => {
                                    injectCSS(a)
                                })
                            } else {
                                if (remoteStyles == true) {
                                    fetch("https://cdn.efaz.dev/cdn/extensions/remove-builder-font/chromeExtension/global_font.css").then(res => { return res.text() }).then(fetched => {
                                        stored_creator_dashboard_css = fetched
                                        overwriteResourcesUrl(fetched, trusted_source, 4, oldFontOnOtherSub).then(a => {
                                            injectCSS(a)
                                        })
                                    })
                                } else {
                                    fetch(chrome.runtime.getURL("global_font.css")).then(res => { return res.text() }).then(fetched => {
                                        stored_creator_dashboard_css = fetched
                                        overwriteResourcesUrl(fetched, trusted_source, 4, oldFontOnOtherSub).then(a => {
                                            injectCSS(a)
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
}())