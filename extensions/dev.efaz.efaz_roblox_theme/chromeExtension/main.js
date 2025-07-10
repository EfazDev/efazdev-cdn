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