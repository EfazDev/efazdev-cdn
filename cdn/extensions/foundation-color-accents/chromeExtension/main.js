/* 

Efaz's Roblox Foundation Color Accents
By: EfazDev
Page: https://www.efaz.dev/roblox-foundation-color-accents

main.js:
    - Content script that recreates the Roblox CSS with an edited version
    - Handle when the extension is installed, open thank_you.html

*/

(function () {
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

    chrome.tabs.onUpdated.addListener(function (tabId, details, tab) {
        try {
            const storage = chrome.storage.sync;
            const storage_key = "dev.efaz.roblox_foundation_color_accents"
            storage.get([storage_key], function (items) {
                if (!(items[storage_key])) {
                    items[storage_key] = { "enabled": true, "color": "#335FFF", "loopSeconds": "100", "overwriteSuccessColor": false, "applyToPrimaryBtn": false }
                }
                if (items[storage_key]["enabled"] == true) {
                    if (tab.url) {
                        if (tab.url.startsWith("https://www.roblox.com")) {
                            async function injectCSS(settings) {
                                var amountOfSecondsBeforeLoop = (typeof (settings["loopSeconds"]) == "string" && Number(settings["loopSeconds"])) ? Number(settings["loopSeconds"]) : 100
                                var all_links = document.getElementsByTagName("link")
    
                                async function loopThroughArrayAsync(array, callback) {
                                    var generated_keys = Object.keys(array);
                                    for (a = 0; a < generated_keys.length; a++) {
                                        var key = generated_keys[a];
                                        var value = array[key];
                                        await callback(key, value);
                                    };
                                };
                                async function convertLargeResponse(response) {
                                    const reader = response.body.getReader();
                                    let decoder = new TextDecoder();
                                    let result = "";
                                    while (true) {
                                        const { done, value } = await reader.read();
                                        if (done) break;
                                        result += decoder.decode(value, { stream: true });
                                    };
                                    return result;
                                };
    
                                all_links = Array.prototype.slice.call(all_links);
                                await loopThroughArrayAsync(all_links, async (_, header) => {
                                    var affect_bundles = ["StyleGuide", "Catalog", "Chat", "PlacesList", "ItemDetailsInfo", "UserSettings", "ItemPurchaseUpsell", "GameCarousel", "NotificationStream", "AccountSecurityPrompt"]
                                    if (header.rel && header.rel == "stylesheet" && (affect_bundles.includes(header.getAttribute("data-bundlename"))) && header.href) {
                                        var fetchLink = header.href
                                        header.setAttribute("data-bundlename", header.getAttribute("data-bundlename") + "_Accented")
                                        var roblox_css = await fetch(fetchLink)
                                        if (roblox_css.ok) {
                                            try {
                                                var roblox_css_res = await convertLargeResponse(roblox_css);
                                                roblox_css_res = roblox_css_res.replaceAll("#335fff", settings["color"].toLowerCase())
                                                if (settings["overwriteSuccessColor"] == true) {
                                                    roblox_css_res = roblox_css_res.replaceAll("#39c582", settings["color"].toLowerCase())
                                                }
                                                if (settings["applyToPrimaryBtn"] == true) {
                                                    roblox_css_res = roblox_css_res
                                                        .replaceAll("background:#fff;", "background:" + settings["color"].toLowerCase() + ";")
                                                        .replaceAll("background-color:#fff;", "background-color:" + settings["color"].toLowerCase() + ";")
                                                        .replaceAll("border-color:#fff;", "border-color:" + settings["color"].toLowerCase() + ";")
                                                        .replaceAll("background-color:" + settings["color"].toLowerCase() + ";border-color:" + settings["color"].toLowerCase() + ";color:#272930", "background-color:" + settings["color"].toLowerCase() + ";border-color:" + settings["color"].toLowerCase() + ";color: #ffffff")
                                                }
                                                var d = document.createElement("style")
                                                d.setAttribute("rel", "stylesheet")
                                                d.setAttribute("onerror", "Roblox.BundleDetector &amp;&amp; Roblox.BundleDetector.reportBundleError(this)")
                                                d.setAttribute("data-bundlename", header.getAttribute("data-bundlename"))
                                                d.setAttribute("data-bundle-source", "Main")
                                                d.setAttribute("org_href", header.href)
                                                d.innerHTML = roblox_css_res
                                                header.href = ""
                                                header.append(d)
                                            } catch (e) {
                                                console.warn('There was an issue to load the requested CSS and inject accent color! Error Message: ' + e.message)
                                            }
                                        } else {
                                            console.warn('There was an issue to load the requested CSS and inject accent color! Status Code: ' + res.status)
                                        }
                                    }
                                })
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
                            url: getChromeURL("thank_you.html")
                        })
                        await storage.set(items);
                    }
                } else {
                    items[name] = { "thanks": true }
                    chrome.tabs.create({
                        url: getChromeURL("thank_you.html")
                    })
                    await storage.set(items);
                }
            });
        })
    });
})()