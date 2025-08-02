/* 

Efaz's Roblox Theme
By: EfazDev

inject.js:
    - Edit Roblox webpage to use theme.css
    - Use an animated theme for RoPro users

*/

(function () {
    const storage = chrome.storage.sync;
    const storage_key = "dev.efaz.efaz_roblox_theme"
    var stored_css = ""
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

    function getTran(id) { 
        if (!(chrome.i18n.getMessage(storage_key.replaceAll(".", "_") + "_" + id) == "")) {
            return chrome.i18n.getMessage(storage_key.replaceAll(".", "_") + "_" + id)
        } else if (!(chrome.i18n.getMessage(id.replaceAll(".", "_")) == "")) {
            return chrome.i18n.getMessage(id.replaceAll(".", "_"))
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

    try {
        getSettings(storage_key, function (items) {
            let enabled = true;
            let remoteStyles = false;
            let settings = items[storage_key];
            if (typeof (settings["enabled"]) == "boolean") { enabled = settings["enabled"] };
            if (typeof (settings["remoteStyles"]) == "boolean") { remoteStyles = settings["remoteStyles"] };
            if (enabled == true) {
                let tab = window.location
                if (tab.href) {
                    if (tab.hostname == "www.roblox.com") {
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
                                    if (!(iframe.src == "https://cdn2.efaz.dev/cdn/ropro-theme-set/replacedReproBackground")) {
                                        iframe.src = "https://cdn2.efaz.dev/cdn/ropro-theme-set/replacedReproBackground"
                                    }
                                }
                            }
                            injectCSS()
                        } else {
                            function injectCSS(css) {
                                if (document.getElementById("efaz-roblox-theme") == null) {
                                    if (css) {
                                        const style = document.createElement("style")
                                        style.id = "efaz-roblox-theme";
                                        style.media = "all";
                                        style.textContent = css
                                        document.head.append(style)
                                    }
                                }

                                if (document.getElementById("roproThemeFrame")) {
                                    var iframe = document.getElementById("roproThemeFrame")
                                    if (!(iframe.src == "https://cdn2.efaz.dev/cdn/ropro-theme-set/replacedReproBackground")) {
                                        iframe.src = "https://cdn2.efaz.dev/cdn/ropro-theme-set/replacedReproBackground"
                                    }
                                }
                            }
                            if (stored_css) {
                                injectCSS(stored_css)
                            } else {
                                fetch(getChromeURL("theme.css")).then(res => { return res.text() }).then(fetched => {
                                    stored_css = fetched
                                    injectCSS(fetched)
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
})()