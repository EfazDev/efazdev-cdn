/* 

Efaz's Roblox Theme
By: EfazDev

inject.js:
    - Edit Roblox webpage to use theme.css
    - Use an animated theme for RoPro users
    - Launches a Thank You page if first time use: [thank-you.html]

*/

(function () {
    const storage = chrome.storage.sync;
    const storage_key = "dev.efaz.efaz_roblox_theme"
    var stored_css = "";
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

    chrome.tabs.onUpdated.addListener(function (tabId, details, tab) {
        try {
            getSettings(storage_key, function (items) {
                var enabled = true;
                var remoteStyles = false;

                if (items[storage_key]) {
                    if (typeof (items[storage_key]["enabled"]) == "boolean") { enabled = items[storage_key]["enabled"] };
                    if (typeof (items[storage_key]["remoteStyles"]) == "boolean") { remoteStyles = items[storage_key]["remoteStyles"] };
                }
                if (enabled == true) {
                    if (tab.url) {
                        if (tab.url.startsWith("https://www.roblox.com")) {
                            if (remoteStyles == true) {
                                function injectCSS() {
                                    if (document.getElementById("efaz-roblox-theme") == null) {
                                        const style = document.createElement("link")
                                        style.id = "efaz-roblox-theme";
                                        style.rel = "stylesheet";
                                        style.type = "text/css";
                                        style.media = "all";
                                        style.href = "https://cdn.efaz.dev/extensions/dev.efaz.efaz_roblox_theme/chromeExtension/theme.css"
                                        document.head.append(style)
                                    }

                                    if (document.getElementById("roproThemeFrame")) {
                                        var iframe = document.getElementById("roproThemeFrame")
                                        if (!(iframe.src == "https://cdn2.efaz.dev/cdn/test/replacedReproBackground")) {
                                            iframe.src = "https://cdn2.efaz.dev/cdn/test/replacedReproBackground"
                                        }
                                    }
                                }
                                chrome.scripting.executeScript({
                                    target: { tabId: tabId, allFrames: true },
                                    func: injectCSS
                                })
                            } else {
                                function injectCSS(css) {
                                    if (document.getElementById("efaz-roblox-theme") == null) {
                                        if (css) {
                                            const style = document.createElement("style")
                                            style.id = "efaz-roblox-theme";
                                            style.media = "all";
                                            style.innerHTML = css
                                            document.head.append(style)
                                        }
                                    }

                                    if (document.getElementById("roproThemeFrame")) {
                                        var iframe = document.getElementById("roproThemeFrame")
                                        if (!(iframe.src == "https://cdn2.efaz.dev/cdn/test/replacedReproBackground")) {
                                            iframe.src = "https://cdn2.efaz.dev/cdn/test/replacedReproBackground"
                                        }
                                    }
                                }
                                if (stored_css) {
                                    chrome.scripting.executeScript({
                                        target: { tabId: tabId, allFrames: true },
                                        func: injectCSS,
                                        args: [stored_css]
                                    })
                                } else {
                                    fetch(getChromeURL("theme.css")).then(res => { return res.text() }).then(fetched => {
                                        stored_css = fetched
                                        chrome.scripting.executeScript({
                                            target: { tabId: tabId, allFrames: true },
                                            func: injectCSS,
                                            args: [fetched]
                                        })
                                    })
                                }
                            }
                        }
                    }
                }
            });
        } catch (err) {
            console.log("Failed to add font settings to this tab.")
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
                    items[name] = {"thanks": true}
                    chrome.tabs.create({
                        url: getChromeURL("thank_you.html")
                    })
                    await chrome.storage.local.set(items);
                }
            });
        })
    });
})()