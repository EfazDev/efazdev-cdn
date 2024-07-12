/* 

Efaz's Roblox Charts Renamer
By: EfazDev
Page: https://www.efaz.dev/charts-rename-remover

inject.js:
    - Content script that injects a stylesheet to remove the builder font

*/

(function () { // Prevent changes made using the Inspect console.
    const storage = chrome.storage.sync;

    try {
        storage.get(["chartsRename"], function (items) {
            var enabled = true;
            var renameText = "Discover";
            var replaceURLwithDiscoverURL = true;
            var changeTitleHtml = true;

            if (items["chartsRename"]) {
                if (typeof (items["chartsRename"]["enabled"]) == "boolean") { enabled = items["chartsRename"]["enabled"] };
                if (typeof (items["chartsRename"]["newName"]) == "string") { renameText = items["chartsRename"]["newName"] };
                if (typeof (items["chartsRename"]["replaceURLwithDiscoverURL"]) == "boolean") { replaceURLwithDiscoverURL = items["chartsRename"]["replaceURLwithDiscoverURL"] };
                if (typeof (items["chartsRename"]["changeTitleHtml"]) == "boolean") { changeTitleHtml = items["chartsRename"]["changeTitleHtml"] };
            }
            if (enabled == true) {
                var tab = window.location
                if (tab.href) {
                    if (tab.hostname == "www.roblox.com") {
                        function injectRename(renameTextt, settings) {
                            var topbar_headers = document.getElementsByClassName("font-header-2 nav-menu-title text-header charts-rename-exp-treatment")
                            for (let i = 0; i < topbar_headers.length; i++) {
                                var header = topbar_headers[i]
                                if (!(header.innerText.includes(renameTextt))) {
                                    header.href = "/discover"
                                    header.innerText = renameTextt
                                }
                            }

                            if (settings["replaceURLwithDiscoverURL"] == true) {
                                if (window.location.pathname == "/charts") {
                                    window.history.pushState({ id: "100" }, renameTextt, `/discover#/`);
                                }
                            }

                            if (window.location.pathname == `/discover` || window.location.pathname == `/charts`) {
                                var page_headers = document.getElementsByClassName("games-list-header")
                                for (let i = 0; i < page_headers.length; i++) {
                                    var header = page_headers[i]
                                    if (!(header.innerHTML.includes(renameTextt))) {
                                        header.innerHTML = `<h1>${renameTextt}</h1>`
                                    }
                                }
                                if (settings["changeTitleHtml"]) {
                                var titles = document.getElementsByTagName("title")
                                for (let i = 0; i < titles.length; i++) {
                                    var header = titles[i]
                                    if (!(header.innerHTML.includes(renameTextt))) {
                                        header.innerHTML = header.innerHTML.replaceAll("Charts", renameTextt)
                                    }
                                }}
                            }

                            setTimeout(() => { injectRename(renameTextt, settings) }, 20)
                        }
                        injectRename(renameText, items["chartsRename"])
                    }
                }
            }
        });
    } catch (err) {
        console.warn(`Failed to insert rename into this tab. Error Message: ${err.message}`)
    }
}())