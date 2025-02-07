var stored_css = "";

chrome.tabs.onUpdated.addListener(function (tabId, details, tab) {
    try {
        const storage = chrome.storage.sync;
        var storage_key = "dev.efaz.roblox_foundation_color_accents"
        storage.get([storage_key], function (items) {
            if (!(items[storage_key])) {
                items[storage_key] = {"enabled": true, "color": "#335FFF", "loopSeconds": "100"}
            }
            if (items[storage_key]["enabled"] == true) {
                if (tab.url) {
                    if (tab.url.startsWith("https://www.roblox.com")) {
                        async function injectCSS(settings) {
                            var amountOfSecondsBeforeLoop = (typeof (settings["loopSeconds"]) == "string" && Number(settings["loopSeconds"])) ? Number(settings["loopSeconds"]) : 100
                            var all_links = document.getElementsByTagName("link")
                            for (let i = 0; i < all_links.length; i++) {
                                var header = all_links[i]
                                if (header.rel && header.rel == "stylesheet" && (header.getAttribute("data-bundlename") == "StyleGuide") && header.href) {
                                    var fetchLink = header.href
                                    header.setAttribute("data-bundlename", "StyleGuide_Accented")
                                    await fetch(fetchLink).then((res) => {
                                        if (res.ok) {
                                            return res.text();
                                        } else {
                                            console.warn('There was an issue to load the requested CSS and inject accent color! Status Code: ' + res.status)
                                            return null;
                                        }
                                    }).then((stylesheet) => {
                                        if (stylesheet) {
                                            stylesheet = stylesheet.replaceAll("#335fff", settings["color"].toLowerCase())
                                            var d = document.createElement("div")
                                            d.innerHTML = '<style rel="stylesheet" onerror="Roblox.BundleDetector &amp;&amp; Roblox.BundleDetector.reportBundleError(this)" data-bundlename="StyleGuide_Accented" data-bundle-source="Main">' + stylesheet + '</style>'
                                            d.href = ""
                                            header.append(d.children[0])
                                        }
                                    }).catch((err) => {
                                        console.warn('There was an issue to load the requested CSS and inject accent color! Error: ' + err.message)
                                    })
                                }
                            }
                            setTimeout(() => { injectCSS(settings) }, amountOfSecondsBeforeLoop)
                        }
                        chrome.scripting.executeScript({
                            target: { tabId: tabId, allFrames: true },
                            func: injectCSS,
                            args: [items[storage_key]]
                        })
                    }
                }
            }
        });
    } catch (err) {
        console.log("Failed to add font settings to this tab.")
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