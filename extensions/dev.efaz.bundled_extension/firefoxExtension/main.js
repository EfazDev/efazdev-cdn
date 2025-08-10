/* 

Efaz's Extension Settings Handler
By: EfazDev

main.js:
    - Handle when the extension is installed, open thank_you.html

*/

(function () {
    const ruleId = 1;
    chrome.runtime.onInstalled.addListener(() => {
        fetch("settings.json").then(setting_res => {
            return setting_res.json();
        }).then(settings => {
            var name = settings["name"];
            chrome.storage.local.get([name], async function (items) {
                if (items[name]) {
                    if (items[name]["thanks"] == true) {
                        console.log("The extension might have updated!");
                        return;
                    } else {
                        items[name]["thanks"] = true;
                        browser.tabs.create({
                            url: chrome.runtime.getURL("thank_you.html")
                        });
                        await chrome.storage.local.set(items);
                    }
                } else {
                    items[name] = { "thanks": true };
                    browser.tabs.create({
                        url: chrome.runtime.getURL("thank_you.html")
                    });
                    await chrome.storage.local.set(items);
                }
            });
        });
    });
    chrome.action.onClicked.addListener(() => {
        browser.tabs.create({
            url: chrome.runtime.getURL("settings.html")
        });
    });
    browser.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: [ruleId],
        addRules: [{
            id: ruleId,
            priority: 1,
            action: {
                type: "modifyHeaders",
                responseHeaders: [{
                    header: "Content-Security-Policy",
                    operation: "remove"
                }, {
                    header: "X-Content-Security-Policy",
                    operation: "remove"
                }]
            },
            condition: {
                urlFilter: "*://*.roblox.com/*",
                resourceTypes: ["main_frame", "sub_frame", "script", "stylesheet", "image", "xmlhttprequest", "other"]
            }
        }]
    }).catch(error => {
        console.error("Error adding declarativeNetRequest rule:", error);
    });
})();