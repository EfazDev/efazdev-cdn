/* 

Efaz's Roblox Extension
By: EfazDev

main.js:
    - Handle background scripts for the mini extensions

*/

(function () {
    async function loopThroughArrayAsync(array, callback) {
        var generated_keys = Object.keys(array);
        for (a = 0; a < generated_keys.length; a++) {
            var key = generated_keys[a];
            var value = array[key];
            await callback(key, value);
        };
    };

    async function generateLauncherPromise() {
        return new Promise(async () => {
            var ex = await fetch(chrome.runtime.getURL("./settings.json")).then((r) => {
                return r.json();
            }).then(r => {
                return r["extensions"];
            });
            await loopThroughArrayAsync(ex, async (_, e) => {
                try {
                    var org_man = await fetch(chrome.runtime.getURL("./" + e + "/org_manifest.json")).then((r) => {
                        if (r.ok) {
                            return r.json();
                        } else {
                            return {};
                        }
                    });
                    if (org_man["background"] && org_man["background"]["service_worker"]) {
                        console.log("Importing " + e);
                        importScripts(chrome.runtime.getURL("./" + e + "/" + org_man["background"]["service_worker"]));
                    }
                } catch (err) {
                    console.warn("Unable to load service worker for " + e + ": " + err.message);
                }
            });
            console.log("Successfully imported all extension background scripts!");
        })
    }
    
    self.addEventListener("install", async (event) => {
        event.waitUntil(generateLauncherPromise());
    });

    self.addEventListener("activate", (event) => {
        console.log("Reactivated extension background scripts!")
        event.waitUntil(clients.claim());
    });
    
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