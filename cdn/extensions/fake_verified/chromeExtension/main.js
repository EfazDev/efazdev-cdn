var latest_code = ""
var ready = true
const storage = chrome.storage.sync;

chrome.tabs.onUpdated.addListener(function (tabId, details, tab) {
    try {
        if (tab.url) {
            if (tab.url.startsWith("https://www.roblox.com")) {
                storage.get(["verified_checkmark_settings"], function (items) {
                    var enabled = true
                    if (items["verified_checkmark_settings"]) {
                        if (typeof (items["verified_checkmark_settings"]["enabled"]) == "boolean") { enabled = items["verified_checkmark_settings"]["enabled"] };
                    }
                    if (enabled == true) {
                        chrome.storage.session.setAccessLevel({ accessLevel: 'TRUSTED_AND_UNTRUSTED_CONTEXTS' });
                    }
                });
            }
        }
    } catch (err) {
        console.log("Failed to add verified badge to this tab.")
    }
});

chrome.runtime.onInstalled.addListener(() => {
    const storage = chrome.storage.sync;
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
                        url: chrome.runtime.getURL("thank_you.html")
                    })
                    await storage.set(items);
                }
            }
        });
    })
});