/* 

Efaz's Example Extension
By: EfazDev
Website: https://www.efaz.dev/

inject.js:
    - Content script that does whatever the extension is tasked to do.

*/

(function () {
    const storage = chrome.storage.local;
    const storage_key = "dev.efaz.example_extension"
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

    function timeout(func, ms) { setTimeout(func, ms); }

    async function getSettings(storage_key, callback) {
        return fetch(getChromeURL("settings.json")).then((res) => {
            if (res.ok) { return res.json(); }
        }).then(jso => {
            if (jso) {
                return storage.get(storage_key).then(async (user_settings) => {
                    if (!user_settings) { user_settings = {} }
                    if (!(user_settings[storage_key])) { user_settings[storage_key] = {} }
                    await loopThroughArrayAsync(jso["settings"], async (i, v) => {
                        if (typeof(user_settings[storage_key][i]) == "undefined") {
                            if (!(typeof(v["default"]) == "undefined")) {user_settings[storage_key][i] = v["default"]}
                        }
                    })
                    if (callback) { callback(user_settings) }
                    return user_settings
                })
            }
        })
    }

    try {
        getSettings(storage_key, function (items) {
            let settings = items[storage_key];
            if (settings["enabled"] == true) {
                let tab = window.location
                if (tab.href) {
                    if (tab.hostname == "www.roblox.com") {
                        async function injectCSS() {
                            // var amountOfSecondsBeforeLoop = (typeof (settings["loopSeconds"]) == "string" && Number(settings["loopSeconds"])) ? Number(settings["loopSeconds"]) : 100
                            console.log("Example Extension Right Here!")
                            // timeout(() => { injectCSS(settings) }, amountOfSecondsBeforeLoop)
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