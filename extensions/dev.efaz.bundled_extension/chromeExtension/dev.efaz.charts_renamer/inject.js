/* 

Efaz's Roblox Charts/Discover Renamer
By: EfazDev
Page: https://www.efaz.dev/roblox-charts-discover-rename

inject.js:
    - Content script that replaces Charts with Discover/Games

*/

(function () { // Prevent changes made using the Inspect console.
    const storage = chrome.storage.sync;

    try {
        const storage_key = "dev.efaz.charts_renamer"
        function getChromeURL(resource) {
            try {
                // This is for Efaz's Roblox Extension support
                if (chrome.runtime.getManifest()["homepage_url"] == "https://www.efaz.dev/roblox-extension") {
                    // This is run under bundled extension [{extension_name}/{resource}]
                    return chrome.runtime.getURL("dev.efaz.charts_renamer" + "/" + resource)
                } else {
                    return chrome.runtime.getURL(resource)
                }
            } catch (_) {
                // This is run under mini extension [{resource}]
                return chrome.runtime.getURL(resource)
            }
        }

        async function loopThroughArrayAsync(array, callback) {
            if (typeof (array) == "object") {
                if (Array.isArray(array)) {
                    for (let a = 0; a < array.length; a++) {
                        var value = array[a]
                        await callback(a, value)
                    }
                } else {
                    var generated_keys = Object.keys(array);
                    for (let a = 0; a < generated_keys.length; a++) {
                        var key = generated_keys[a]
                        var value = array[key]
                        await callback(key, value)
                    }
                }
            }
        }

        async function getSettings(storage_key, callback) {
            if (callback) {
                fetch(getChromeURL("settings.json")).then((res) => {
                    if (res.ok) {
                        return res.json();
                    }
                }).then(jso => {
                    if (jso) {
                        return storage.get(storage_key).then(async (user_settings) => {
                            if (!user_settings) {
                                user_settings = {}
                            }
                            if (!(user_settings[storage_key])) {
                                user_settings[storage_key] = {}
                            }
                            await loopThroughArrayAsync(jso["settings"], async (i, v) => {
                                if (typeof(user_settings[storage_key][i]) == "undefined") {
                                    if (v["default"]) {user_settings[storage_key][i] = v["default"]}
                                }
                            })
                            callback(user_settings)
                        })
                    }
                })
            } else {
                return fetch(getChromeURL("settings.json")).then((res) => {
                    if (res.ok) {
                        return res.json();
                    }
                }).then(jso => {
                    if (jso) {
                        return storage.get(storage_key).then(async (user_settings) => {
                            if (!user_settings) {
                                user_settings = {}
                            }
                            if (!(user_settings[storage_key])) {
                                user_settings[storage_key] = {}
                            }
                            await loopThroughArrayAsync(jso["settings"], async (i, v) => {
                                if (typeof(user_settings[storage_key][i]) == "undefined") {
                                    if (v["default"]) {user_settings[storage_key][i] = v["default"]}
                                }
                            })
                            return user_settings
                        })
                    }
                })
            }
        }
        getSettings(storage_key, function (items) {
            var enabled = true;
            if (items[storage_key]) {
                if (typeof (items[storage_key]["enabled"]) == "boolean") { enabled = items[storage_key]["enabled"] };
            } else {
                items[storage_key] = {
                    "enabled": true,
                    "newName": "Discover",
                    "replaceURLwithDiscoverURL": true,
                    "changeTitleHtml": true,
                    "startTime": "75"
                }
            }
            if (enabled == true) {
                var tab = window.location
                if (tab.href) {
                    if (tab.hostname == "www.roblox.com") {
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
                        injectRename(items[storage_key])
                    }
                }
            }
        });
    } catch (err) {
        console.warn(`Failed to insert rename into this tab. Error Message: ${err.message}`)
    }
}())