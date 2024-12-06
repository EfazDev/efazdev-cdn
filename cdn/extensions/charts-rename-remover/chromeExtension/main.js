/* 

Efaz's Roblox Charts/Discover Renamer
By: EfazDev
Page: https://www.efaz.dev/roblox-charts-discover-rename

main.js:
    - Backup script incase of an error or timeout inside inject.js
    - Launches a Thank You page if first time use: [thank-you.html]

*/

(function () { // Prevent changes made using the Inspect console.
    const storage = chrome.storage.sync;
    chrome.tabs.onUpdated.addListener(function (tabId, details, tab) {
        try {
            storage.get(["chartsRename"], function (items) {
                var enabled = true;
                if (items["chartsRename"]) {
                    if (typeof (items["chartsRename"]["enabled"]) == "boolean") { enabled = items["chartsRename"]["enabled"] };
                } else {
                    items["chartsRename"] = {
                        "enabled": true,
                        "newName": "Discover",
                        "replaceURLwithDiscoverURL": true,
                        "changeTitleHtml": true,
                        "startTime": "75"
                    }
                }
                if (enabled == true) {
                    if (tab.url) {
                        if (tab.url.startsWith("https://www.roblox.com")) {
                            function injectRename(settings) {
                                var newName = settings["newName"];
                                var isGames = newName.toLowerCase() == "games";
                                var isCharts = newName.toLowerCase() == "charts";
                                var amountOfSecondsBeforeLoop = (typeof(settings["startTime"]) == "string" && Number(settings["startTime"])) ? Number(settings["startTime"]) : 75

                                /* Clean New Name to prevent crashes */
                                var div = document.createElement("div");
                                div.innerHTML = newName;
                                newName = div.innerText.replace(/<\/[^>]+(>|$)/g, "");
                                /* Clean New Name to prevent crashes */

                                var topbar_headers = document.getElementsByClassName("font-header-2 nav-menu-title text-header charts-rename-exp-treatment")
                                for (let i = 0; i < topbar_headers.length; i++) {
                                    var header = topbar_headers[i]
                                    if (header.href && !(header.innerText.includes(newName))) {
                                        if (isGames == true) {
                                            header.href = header.href.replace("charts", "games")
                                            header.href = header.href.replace("discover", "games")
                                        } else {
                                            header.href = header.href.replace("charts", "discover")
                                            header.href = header.href.replace("games", "discover")
                                        }
                                        header.innerText = newName
                                    }
                                }

                                var chart_links = document.getElementsByClassName("btn-secondary-xs see-all-link-icon btn-more")
                                for (let i = 0; i < chart_links.length; i++) {
                                    var header = chart_links[i]
                                    if (header.href && !(header.innerText.includes(newName))) {
                                        if (isGames == true) {
                                            header.href = header.href.replace("charts", "games")
                                            header.href = header.href.replace("discover", "games")
                                        } else {
                                            header.href = header.href.replace("charts", "discover")
                                            header.href = header.href.replace("games", "discover")
                                        }
                                    }
                                }

                                if (settings["replaceURLwithDiscoverURL"] == true) {
                                    if (window.location.pathname == "/charts") {
                                        if (isCharts == false) {
                                            if (isGames == true) {
                                                window.history.pushState({ id: "100" }, newName, window.location.href.replace("/charts#/", "/games#/"));
                                            } else {
                                                window.history.pushState({ id: "100" }, newName, window.location.href.replace("/charts#/", "/discover#/"));
                                            }
                                        }
                                    }
                                }

                                if (window.location.pathname == `/discover` || window.location.pathname == `/charts` || window.location.pathname == `/games`) {
                                    var page_headers = document.getElementsByClassName("games-list-header")
                                    for (let i = 0; i < page_headers.length; i++) {
                                        var header = page_headers[i]
                                        if (!(header.innerHTML.includes(newName))) {
                                            for (let e = 0; e < header.children.length; e++) {
                                                var child = header.children[e]
                                                if (!(child.innerText.includes(newName))) {
                                                    child.innerText = `${newName}`
                                                }
                                            }
                                        }
                                    }

                                    if (settings["changeTitleHtml"] == true) {
                                        var titles = document.getElementsByTagName("title")
                                        for (let i = 0; i < titles.length; i++) {
                                            var header = titles[i]
                                            if (!(header.innerText.includes(newName))) {
                                                header.innerText = header.innerText.replaceAll("Charts", newName)
                                            }
                                        }
                                    }
                                }

                                setTimeout(() => { injectRename(settings) }, amountOfSecondsBeforeLoop)
                            }
                            chrome.scripting.executeScript({
                                target: { tabId: tabId, allFrames: true },
                                func: injectRename,
                                args: [items["chartsRename"]]
                            })
                        }
                    }
                }
            });
        } catch (err) {
            console.warn(`Failed to insert font styles into this tab. Error Message: ${err.message}`)
        }
    });

    chrome.runtime.onInstalled.addListener(() => {
        console.log("Chrome detects extension refresh.")
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
                        console.log("The extension has detected a new user!")
                        items[name]["thanks"] = true
                        chrome.tabs.create({
                            url: chrome.runtime.getURL("thank_you.html")
                        })
                        await storage.set(items);
                    }
                }
            });
        })
    })
}())