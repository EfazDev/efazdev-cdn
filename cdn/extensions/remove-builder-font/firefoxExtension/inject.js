/* 

Efaz's Builder Font Remover
By: EfazDev
Page: https://www.efaz.dev/remove-builder-font

inject.js:
    - Content script that injects a stylesheet to remove the builder font

*/

(function () { // Prevent changes made using the Inspect console.
    const storage = browser.storage.local;
    var stored_css = ""
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
            } else {
                typeString = "Unusable"
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
        storage.get(["removeBuilderFont"], function (items) {
            var enabled = true;
            var remoteStyles = false;
            var devForum = true;
            var oldFontOnOtherSub = true;
            var trusted_source = "https://oldfont.efaz.dev/"; /* This is customizable by the user, but they would have to find a fitting url and make sure it's trusted. */

            if (!(items)) {
                items = {}
            }
            if (items) {
                if (items["removeBuilderFont"]) {
                    if (typeof (items["removeBuilderFont"]["enabled"]) == "boolean") { enabled = items["removeBuilderFont"]["enabled"] };
                    if (typeof (items["removeBuilderFont"]["remoteStyles"]) == "boolean") { remoteStyles = items["removeBuilderFont"]["remoteStyles"] };
                    if (typeof (items["removeBuilderFont"]["overwriteDevForum"]) == "boolean") { devForum = items["removeBuilderFont"]["overwriteDevForum"] };
                    if (typeof (items["removeBuilderFont"]["onlyUseOldFontOnMainWebsite"]) == "boolean") { oldFontOnOtherSub = items["removeBuilderFont"]["onlyUseOldFontOnMainWebsite"] };
                    if (typeof (items["removeBuilderFont"]["resourcesUrl"]) == "string") { if (items["removeBuilderFont"]["resourcesUrl"] == "https://cdn.efaz.dev/cdn/extensions/remove-builder-font/resources/" || items["removeBuilderFont"]["resourcesUrl"] == "https://cdn2.efaz.dev/cdn/remove-builder-font/") { items["removeBuilderFont"]["resourcesUrl"] = trusted_source; storage.set(items); } trusted_source = items["removeBuilderFont"]["resourcesUrl"] };
                }
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
                                fetch("https://cdn.efaz.dev/cdn/extensions/remove-builder-font/firefoxExtension/change_font.css").then(res => { return res.text() }).then(fetched => {
                                    stored_css = fetched
                                    overwriteResourcesUrl(fetched, trusted_source, 1, oldFontOnOtherSub).then(a => {
                                        injectCSS(a)
                                    })
                                })
                            } else {
                                fetch(browser.runtime.getURL("change_font.css")).then(res => { return res.text() }).then(fetched => {
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
                                    if (document.querySelector("body > discourse-assets > discourse-assets-stylesheets > link:nth-child(30)")) {
                                        var selector = document.querySelector("body > discourse-assets > discourse-assets-stylesheets > link:nth-child(30)");
                                        if (selector.href.includes("devforum.roblox.com")) {
                                            selector.remove()
                                            if (css) {
                                                const style = document.createElement("style")
                                                style.id = "remove-builder-font";
                                                style.media = "all";
                                                style.innerHTML = css
                                                document.head.append(style)
                                            }
                                        } else {
                                            setTimeout(() => { injectCSS(css, new_tries + 1) }, 100)
                                        }
                                    } else {
                                        var observer = new MutationObserver(function (m) {
                                            if (document.querySelector("body > discourse-assets > discourse-assets-stylesheets > link:nth-child(30)")) {
                                                injectCSS(css, new_tries + 1)
                                            }
                                        });
                                        observer.observe(document.head, { childList: true });
                                    }
                                }
                            }
                            if (stored_devforum_css) {
                                overwriteResourcesUrl(stored_devforum_css, trusted_source, 2, oldFontOnOtherSub).then(a => {
                                    injectCSS(a)
                                })
                            } else {
                                if (remoteStyles == true) {
                                    fetch("https://cdn.efaz.dev/cdn/extensions/remove-builder-font/firefoxExtension/devforum_font.css").then(res => { return res.text() }).then(fetched => {
                                        stored_devforum_css = fetched
                                        overwriteResourcesUrl(fetched, trusted_source, 2, oldFontOnOtherSub).then(a => {
                                            injectCSS(a)
                                        })
                                    })
                                } else {
                                    fetch(browser.runtime.getURL("devforum_font.css")).then(res => { return res.text() }).then(fetched => {
                                        stored_devforum_css = fetched
                                        overwriteResourcesUrl(fetched, trusted_source, 2, oldFontOnOtherSub).then(a => {
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