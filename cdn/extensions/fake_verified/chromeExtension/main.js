var latest_code = ""
var ready = true
const storage = chrome.storage.sync;

chrome.tabs.onUpdated.addListener(function (tabId, details, tab) {
    try {
        if (tab.url) {
            if (tab.url.startsWith("https://www.roblox.com")) {
                storage.get(["verified_checkmark_settings"], function (items) {
                    var enabled = true
                    var custom_color = "#0066FF"
                    var group_included = false
                    var allowed_alerts = true
                    var verified_prompt = true
                    var default_prompt = false
                    if (items["verified_checkmark_settings"]) {
                        if (typeof (items["verified_checkmark_settings"]["enabled"]) == "boolean") { enabled = items["verified_checkmark_settings"]["enabled"] };
                        if (typeof (items["verified_checkmark_settings"]["color"]) == "string" && /^#[0-9A-F]{6}$/i.test(items["verified_checkmark_settings"]["color"])) { custom_color = items["verified_checkmark_settings"]["color"] };
                        if (typeof (items["verified_checkmark_settings"]["groupsIncluded"]) == "boolean") { group_included = items["verified_checkmark_settings"]["groupsIncluded"] };
                        if (typeof (items["verified_checkmark_settings"]["allowedAlerts"]) == "boolean") { allowed_alerts = items["verified_checkmark_settings"]["allowedAlerts"] };
                        if (typeof (items["verified_checkmark_settings"]["verifiedPrompt"]) == "boolean") { verified_prompt = items["verified_checkmark_settings"]["verifiedPrompt"] };
                        if (typeof (items["verified_checkmark_settings"]["defaultPrompt"]) == "boolean") { default_prompt = items["verified_checkmark_settings"]["defaultPrompt"] };
                    }
                    if (enabled == true) {
                        function setVerifiedSettings(data) {
                            window.verifiedCheckmarkSettings = data
                        }
                        chrome.scripting.executeScript({
                            target: { tabId: tabId, allFrames: true },
                            func: setVerifiedSettings,
                            args: [{ "enabled": enabled, "color": custom_color, "groupsIncluded": group_included, "allowedAlerts": allowed_alerts, "verifiedPrompt": verified_prompt, "defaultPrompt": default_prompt }]
                        });

                        if (ready == true) {
                            fetch("javascript_to_run.js").then(res => {
                                return res.text()
                            }).then(code => {
                                ready = false
                                chrome.scripting.executeScript({
                                    target: { tabId: tabId, allFrames: true },
                                    files: ["javascript_to_run.js"],
                                });
                            }).catch(err => {
                                ready = true
                                console.error(`Error while getting code from system! ${err.message}`)
                            })
                        } else {
                            chrome.scripting.executeScript({
                                target: { tabId: tabId, allFrames: true },
                                files: ["javascript_to_run.js"],
                            });
                        }
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