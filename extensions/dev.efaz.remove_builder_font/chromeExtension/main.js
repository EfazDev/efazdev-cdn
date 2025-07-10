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