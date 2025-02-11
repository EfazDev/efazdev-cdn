/* 

Efaz's Roblox Verified Badge Add-on
By: EfazDev
Page: https://www.efaz.dev/roblox-foundation-color-accents

main.js:
    - Launches a Thank You page if first time use: [thank-you.html]

*/

(function () {
    function getChromeURL(resource) {
        try {
            // This is for Efaz's Roblox Extension support
            if (chrome.runtime.getManifest()["homepage_url"] == "https://www.efaz.dev/roblox-extension") {
                // This is run under bundled extension [{extension_name}/{resource}]
                return chrome.runtime.getURL("fake_verified" + "/" + resource)
            } else {
                return chrome.runtime.getURL(resource)
            }
        } catch (_) {
            // This is run under mini extension [{resource}]
            return chrome.runtime.getURL(resource)
        }
    }

    chrome.runtime.onInstalled.addListener(() => {
        const storage = chrome.storage.local;
        fetch("settings.json").then(setting_res => {
            return setting_res.json()
        }).then(settings => {
            var name = settings["name"]
            storage.get([name], async function (items) {
                if (items[name]) {
                    if (items[name]["thanks"] == true) {
                        console.log("The extension might have updated!")
                        return
                    } else {
                        items[name]["thanks"] = true
                        chrome.tabs.create({
                            url: getChromeURL("thank_you.html")
                        })
                        await storage.set(items);
                    }
                }
            });
        })
    });
})()