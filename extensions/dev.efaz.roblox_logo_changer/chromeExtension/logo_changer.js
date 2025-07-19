/* 

Efaz's Roblox Logo Changer
By: EfazDev
Page: https://www.efaz.dev/roblox-logo-changer

inject.js:
    - Content script that edits the Roblox logo on the website.

*/

(function () {
    const storage = chrome.storage.local;
    const storage_key = "dev.efaz.roblox_logo_changer"
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
                            if (typeof(user_settings[storage_key][i]) == "undefined") {
                                if (!(typeof(v["default"]) == "undefined")) {user_settings[storage_key][i] = v["default"]}
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
                            if (typeof(user_settings[storage_key][i]) == "undefined") {
                                if (!(typeof(v["default"]) == "undefined")) {user_settings[storage_key][i] = v["default"]}
                            }
                        })
                        return user_settings
                    })
                }
            })
        }
    }
    function timeout(func, ms) { setTimeout(func, ms); }

    try {
        getSettings(storage_key, function (items) {
            var defaultData = { 
                "enabled": true, 
                "loopSeconds": "100", 
                "projectedImage": null 
            }
            if (!(items[storage_key])) {
                items[storage_key] = defaultData
            }
            var settings = items[storage_key];
            if (settings["enabled"] == true) {
                var tab = window.location
                if (tab.href) {
                    var urlObj = window.location
                    if (urlObj.hostname == "www.roblox.com") {
                        let amountOfSecondsBeforeLoop = (typeof (settings["loopSeconds"]) == "string" && Number(settings["loopSeconds"])) ? Number(settings["loopSeconds"]) : 100
                        let rbx_icon_sector = ".app-icon-mac { background-image: url(rbx_icon) !important; } .app-icon-windows { background-image: url(rbx_icon) !important; } .app-icon-ios { background-image: url(rbx_icon) !important; } .app-icon-android { background-image: url(rbx_icon) !important; }";
                        let rbx_studio_icon_sector = ".studio-icon-mac { background-image: url(rbx_studio_icon) !important; } .studio-icon-windows { background-image: url(rbx_studio_icon) !important; }";
                        let rbx_top_left_icon_sector = ".icon-logo-r { background-image: url(top_left_icon) !important; } .game-social-links>.btn-secondary-lg .icon-social-media-roblox { background-position: 0 0px !important; background-image: url(top_left_icon); }";
                        let rbx_top_left_name_sector = ".icon-logo { background-image: url(top_left_name) !important; background-size: cover !important; } .icon-default-logo { background-image: url(top_left_name) !important; height:70px !important; }";
                        async function injectCSS() {
                            if (settings["projectedImage"] && settings["projectedImage"].startsWith("data")) {
                                let all_links = Array.from(document.querySelectorAll("link"));
                                await loopThroughArrayAsync(all_links, async (_, header) => {
                                    if (header.rel && header.rel == "icon" && header.href && !(header.href == settings["projectedImage"])) {
                                        header.setAttribute("href", settings["projectedImage"])
                                    }
                                })
                            }
                            if (settings["rbxIcon"] && settings["rbxIcon"].startsWith("data")) {
                                if (!(document.getElementById("rbx_icon"))) {
                                    var d = document.createElement("style")
                                    d.setAttribute("id", "rbx_icon")
                                    d.setAttribute("rel", "stylesheet")
                                    d.textContent = rbx_icon_sector.replaceAll("rbx_icon", settings["rbxIcon"])
                                    document.head.append(d)
                                }
                            }
                            if (settings["rbxStudioIcon"] && settings["rbxStudioIcon"].startsWith("data")) {
                                if (!(document.getElementById("rbx_studio_icon"))) {
                                    var d = document.createElement("style")
                                    d.setAttribute("id", "rbx_studio_icon")
                                    d.setAttribute("rel", "stylesheet")
                                    d.textContent = rbx_studio_icon_sector.replaceAll("rbx_studio_icon", settings["rbxStudioIcon"])
                                    document.head.append(d)
                                }
                            }
                            if (settings["topLeftLogo"] && settings["topLeftLogo"].startsWith("data")) {
                                if (!(document.getElementById("top_left_icon"))) {
                                    var d = document.createElement("style")
                                    d.setAttribute("id", "top_left_icon")
                                    d.setAttribute("rel", "stylesheet")
                                    d.textContent = rbx_top_left_icon_sector.replaceAll("top_left_icon", settings["topLeftLogo"])
                                    document.head.append(d)
                                }
                            }
                            if (settings["topLeftName"] && settings["topLeftName"].startsWith("data")) {
                                if (!(document.getElementById("top_left_name"))) {
                                    var d = document.createElement("style")
                                    d.setAttribute("id", "top_left_name")
                                    d.setAttribute("rel", "stylesheet")
                                    d.textContent = rbx_top_left_name_sector.replaceAll("top_left_name", settings["topLeftName"])
                                    document.head.append(d)
                                }
                            }
                            timeout(() => { injectCSS() }, amountOfSecondsBeforeLoop)
                        }
                        injectCSS()
                    } else if (urlObj.hostname == "create.roblox.com") {
                        let amountOfSecondsBeforeLoop = (typeof (settings["loopSeconds"]) == "string" && Number(settings["loopSeconds"])) ? Number(settings["loopSeconds"]) : 100
                        async function injectCSS() {
                            if (settings["projectedImage2"] && settings["projectedImage2"].startsWith("data")) {
                                var all_links = Array.from(document.querySelectorAll("link"));
                                await loopThroughArrayAsync(all_links, async (_, header) => {
                                    if (header.rel && header.rel == "icon" && header.href && !(header.href == settings["projectedImage2"])) {
                                        header.setAttribute("href", settings["projectedImage2"])
                                    }
                                })
                                var creator_hub_icon = document.querySelectorAll(".web-blox-css-tss-nvpyzg-logo")
                                for (let i = 0; i < creator_hub_icon.length; i++) {
                                    var header = creator_hub_icon[i]
                                    if (header.tagName.toLowerCase() == "svg") {
                                        header.outerHTML = '<img class="' + header.classList.toString() + '" width="' + header.getAttribute("width") + '" height="' + header.getAttribute("height") + '" src="' + settings["projectedImage2"] + '">'
                                    }
                                }
                            }
                            if (settings["rbxStudioIcon"] && settings["rbxStudioIcon"].startsWith("data")) {
                                var all_icons = Array.from(document.querySelectorAll(".web-blox-css-tss-1hgd7ws-studioIcon"))
                                await loopThroughArrayAsync(all_icons, async (_, header) => {
                                    if (header.getAttribute("width") == "64") {
                                        header.setAttribute("src", settings["rbxStudioIcon"])
                                    }
                                })
                            }
                            timeout(() => { injectCSS() }, amountOfSecondsBeforeLoop)
                        }
                        injectCSS()
                    } else if (urlObj.hostname == "devforum.roblox.com") {
                        let amountOfSecondsBeforeLoop = (typeof (settings["loopSeconds"]) == "string" && Number(settings["loopSeconds"])) ? Number(settings["loopSeconds"]) : 100
                        async function injectCSS() {
                            if (settings["projectedImage3"] && settings["projectedImage3"].startsWith("data")) {
                                var all_links = Array.from(document.querySelectorAll("link"))
                                await loopThroughArrayAsync(all_links, async (_, header) => {
                                    if (header.rel && header.rel == "icon" && header.href && !(header.href == settings["projectedImage3"])) {
                                        header.setAttribute("href", settings["projectedImage3"])
                                    }
                                })
                            }
                            if (settings["projectedImage2"] && settings["projectedImage2"].startsWith("data")) {
                                var creator_hub_icon = document.querySelectorAll(".css-nvpyzg-logo")
                                for (let i = 0; i < creator_hub_icon.length; i++) {
                                    var header = creator_hub_icon[i]
                                    if (header.tagName.toLowerCase() == "svg") {
                                        header.outerHTML = '<img class="' + header.classList.toString() + '" width="' + header.getAttribute("width") + '" height="' + header.getAttribute("height") + '" src="' + settings["projectedImage2"] + '">'
                                    }
                                }
                            }
                            timeout(() => { injectCSS() }, amountOfSecondsBeforeLoop)
                        }
                        injectCSS()
                    } else if (/.roblox.com/.test(urlObj.hostname)) {
                        let amountOfSecondsBeforeLoop = (typeof (settings["loopSeconds"]) == "string" && Number(settings["loopSeconds"])) ? Number(settings["loopSeconds"]) : 100
                        async function injectCSS() {
                            if (settings["projectedImage4"] && settings["projectedImage4"].startsWith("data")) {
                                var all_links = Array.from(document.querySelectorAll("link"))
                                await loopThroughArrayAsync(all_links, async (_, header) => {
                                    if (header.rel && header.rel == "icon" && header.href && !(header.href == settings["projectedImage4"])) {
                                        header.setAttribute("href", settings["projectedImage4"])
                                    }
                                })
                            }
                            if (settings["projectedImage2"] && settings["projectedImage2"].startsWith("data")) {
                                var creator_hub_icon = document.querySelectorAll(".css-nvpyzg-logo")
                                for (let i = 0; i < creator_hub_icon.length; i++) {
                                    var header = creator_hub_icon[i]
                                    if (header.tagName.toLowerCase() == "svg") {
                                        header.outerHTML = '<img class="' + header.className + '" width="' + header.getAttribute("width") + '" height="' + header.getAttribute("height") + '" src="' + settings["projectedImage2"] + '">'
                                    }
                                }
                                var creator_hub_icon2 = document.querySelectorAll(".web-blox-css-mui-v3z1wi img")
                                for (let i = 0; i < creator_hub_icon2.length; i++) {
                                    var header = creator_hub_icon2[i]
                                    if (header.tagName.toLowerCase() == "img" && /roblox_icon/.test(header.src)) {
                                        header.src = settings["projectedImage2"]
                                    }
                                }
                            }
                            timeout(() => { injectCSS() }, amountOfSecondsBeforeLoop)
                        }
                        injectCSS()
                    }
                }
            }
        });
    } catch (err) {
        console.log("Failed to add font settings to this tab.")
    }
})()