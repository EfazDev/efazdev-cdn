/* 

Efaz's Extension Settings Handler
By: EfazDev

main.js:
    - Handle when the extension is installed, open thank_you.html

*/

(function () {
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
                        chrome.tabs.create({
                            url: chrome.runtime.getURL("thank_you.html")
                        });
                        await chrome.storage.local.set(items);
                    }
                } else {
                    items[name] = { "thanks": true };
                    chrome.tabs.create({
                        url: chrome.runtime.getURL("thank_you.html")
                    });
                    await chrome.storage.local.set(items);
                }
            });
        });
    });
})();