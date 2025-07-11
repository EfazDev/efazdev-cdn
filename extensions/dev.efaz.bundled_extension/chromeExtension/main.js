/* 

Efaz's Roblox Extension
By: EfazDev

main.js:
    - Handle install pages

*/

(function () {    
    chrome.runtime.onInstalled.addListener(() => {
        const storage = chrome.storage.local;
        fetch("settings.json").then(setting_res => {
            return setting_res.json();
        }).then(settings => {
            var name = settings["name"];
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
                } else {
                    items[name] = {"thanks": true}
                    chrome.tabs.create({
                        url: chrome.runtime.getURL("thank_you.html")
                    })
                    await storage.set(items);
                }
            });
        })
    });
})()