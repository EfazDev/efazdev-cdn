/* 

Efaz's Roblox Theme
By: EfazDev

inject.js:
    - Edit Roblox webpage to use theme.css
    - Use an animated theme for RoPro users

*/

(function () {
    var stored_css = ""
    function getChromeURL(resource) {
        try {
            // This is for Efaz's Roblox Extension support
            if (chrome.runtime.getManifest()["homepage_url"] == "https://www.efaz.dev/roblox-extension") {
                // This is run under bundled extension [{extension_name}/{resource}]
                return chrome.runtime.getURL("{extension_name_this_is_replace_when_building_bundle_with_folder_name_if_youre_wondering}" + "/" + resource)
            } else {
                return chrome.runtime.getURL(resource)
            }
        } catch (_) {
            // This is run under mini extension [{resource}]
            return chrome.runtime.getURL(resource)
        }
    }

    try {
        const storage = chrome.storage.sync;
        const storage_key = "dev.efaz.efaz_roblox_theme"
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
                                fetch(getChromeURL("theme.css")).then(res => { return res.text() }).then(fetched => {
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
})()