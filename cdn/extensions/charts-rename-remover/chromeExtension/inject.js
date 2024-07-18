/* 

Efaz's Roblox Charts Renamer
By: EfazDev
Page: https://www.efaz.dev/charts-rename-remover

inject.js:
    - Content script that replaces Charts with Discover/Games

*/

(function () { // Prevent changes made using the Inspect console.
    const storage = chrome.storage.sync;

    try {
        storage.get(["chartsRename"], function (items) {
            var enabled = true;
            if (items["chartsRename"]) {
                if (typeof (items["chartsRename"]["enabled"]) == "boolean") { enabled = items["chartsRename"]["enabled"] };
            }
            if (enabled == true) {
                var tab = window.location
                if (tab.href) {
                    if (tab.hostname == "www.roblox.com") {
                        function injectRename(settings) {
                            var newName = settings["newName"];
                            var isGames = newName.toLowerCase() == "games";
                            var isCharts = newName.toLowerCase() == "charts";

                            var topbar_headers = document.getElementsByClassName("font-header-2 nav-menu-title text-header charts-rename-exp-treatment")
                            for (let i = 0; i < topbar_headers.length; i++) {
                                var header = topbar_headers[i]
                                if (!(header.innerText.includes(newName))) {
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
                                if (!(header.innerText.includes(newName))) {
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
                                        header.innerHTML = `<h1>${newName}</h1>`
                                    }
                                }

                                if (settings["changeTitleHtml"] == true) {
                                    var titles = document.getElementsByTagName("title")
                                    for (let i = 0; i < titles.length; i++) {
                                        var header = titles[i]
                                        if (!(header.innerHTML.includes(newName))) {
                                            header.innerHTML = header.innerHTML.replaceAll("Charts", newName)
                                        }
                                    }
                                }
                            }

                            setTimeout(() => { injectRename(settings) }, 10)
                        }
                        injectRename(items["chartsRename"])
                    }
                }
            }
        });
    } catch (err) {
        console.warn(`Failed to insert rename into this tab. Error Message: ${err.message}`)
    }
}())