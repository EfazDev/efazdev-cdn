var stored_css = ""

try {
    const storage = chrome.storage.sync;
    var storage_key = "dev.efaz.efaz_roblox_theme"
    storage.get([storage_key], function (items) {
        var enabled = true;
        var remoteStyles = false;

        if (items[storage_key]) {
            if (typeof (items[storage_key]["enabled"]) == "boolean") { enabled = items[storage_key]["enabled"] };
            if (typeof (items[storage_key]["remoteStyles"]) == "boolean") { remoteStyles = items[storage_key]["remoteStyles"] };
        }
        if (enabled == true) {
            var tab = window.location
            if (tab.href) {
                var urlObj = window.location
                if (urlObj.hostname == "www.roblox.com") {
                    if (remoteStyles == true) {
                        function injectCSS() {
                            if (document.getElementById("efaz-roblox-theme") == null) {
                                const style = document.createElement("link")
                                style.id = "efaz-roblox-theme";
                                style.rel = "stylesheet";
                                style.type = "text/css";
                                style.media = "all";
                                style.href = "https://cdn.efaz.dev/cdn/extensions/efaz-roblox-theme/chromeExtension/theme.css"
                                document.head.append(style)
                            }

                            if (document.getElementById("roproThemeFrame")) {
                                var iframe = document.getElementById("roproThemeFrame")
                                if (!(iframe.src == "https://cdn2.efaz.dev/cdn/test/replacedReproBackground")) {
                                    iframe.src = "https://cdn2.efaz.dev/cdn/test/replacedReproBackground"
                                }
                            }
                        }
                        injectCSS()
                    } else {
                        function injectCSS(css) {
                            if (document.getElementById("efaz-roblox-theme") == null) {
                                if (css) {
                                    const style = document.createElement("style")
                                    style.id = "efaz-roblox-theme";
                                    style.media = "all";
                                    style.innerHTML = css
                                    document.head.append(style)
                                }
                            }

                            if (document.getElementById("roproThemeFrame")) {
                                var iframe = document.getElementById("roproThemeFrame")
                                if (!(iframe.src == "https://cdn2.efaz.dev/cdn/test/replacedReproBackground")) {
                                    iframe.src = "https://cdn2.efaz.dev/cdn/test/replacedReproBackground"
                                }
                            }
                        }
                        if (stored_css) {
                            injectCSS(stored_css)
                        } else {
                            fetch(chrome.runtime.getURL("theme.css")).then(res => { return res.text() }).then(fetched => {
                                stored_css = fetched
                                injectCSS(fetched)
                            })
                        }
                    }
                }
            }
        }
    });
} catch (err) {
    console.log("Failed to add font settings to this tab.")
}