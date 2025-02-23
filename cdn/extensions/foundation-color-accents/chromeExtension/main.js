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
                var defaultData = { "enabled": true, "color": "#56ac72", "loopSeconds": "100", "overwriteSuccessColor": false, "applyToPrimaryBtn": false, "overwriteCreateDashboard": false, "includeGraphInDashboard": false }
                if (!(items[storage_key])) {
                    items[storage_key] = defaultData
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

                                // Normal Elements
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

                                // WebBlox Elements
                                function sheetToString(sheet) {
                                    function stringifyRule(rule) {
                                        return rule.cssText || ''
                                    }
                                    var text = sheet.cssRules
                                        ? Array.from(sheet.cssRules)
                                            .map(rule => stringifyRule(rule))
                                            .join('\n')
                                        : ''
                                    return text;
                                };
                                function hexToRgb(hex) {
                                    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                                    return result ? {
                                        r: parseInt(result[1], 16),
                                        g: parseInt(result[2], 16),
                                        b: parseInt(result[3], 16)
                                    } : null;
                                };
                                function rgbToHex(r, g, b) {
                                    return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1);
                                };
                                function formatRgbVal(val) {
                                    if (val < 0) {
                                        return 0;
                                    } else if (val > 255) {
                                        return 255;
                                    } else {
                                        return val;
                                    }
                                };

                                var converted_rgb = hexToRgb(settings["color"]);
                                var all_styles = document.getElementsByTagName("style");
                                all_styles = Array.prototype.slice.call(all_styles);
                                await loopThroughArrayAsync(all_styles, async (_, header) => {
                                    var change_made = false;
                                    var converted_sheet = "";
                                    if (header.innerHTML == "") {
                                        converted_sheet = sheetToString(header.sheet);
                                    } else {
                                        converted_sheet = header.innerHTML;
                                    }
                                    header.sheet = new CSSStyleSheet()
                                    if (converted_sheet.includes("51, 95, 255") || converted_sheet.includes("51,95,255")) {
                                        converted_sheet = converted_sheet
                                            .replaceAll("51, 95, 255", `${converted_rgb["r"]}, ${converted_rgb["g"]}, ${converted_rgb["b"]}`)
                                            .replaceAll("51,95,255", `${converted_rgb["r"]}, ${converted_rgb["g"]}, ${converted_rgb["b"]}`);
                                        change_made = true;
                                    }
                                    if (converted_sheet.includes("82, 139, 255") || converted_sheet.includes("82,139,255")) {
                                        converted_sheet = converted_sheet
                                            .replaceAll("82, 139, 255", `${formatRgbVal(converted_rgb["r"] + 30)}, ${formatRgbVal(converted_rgb["g"] + 30)}, ${formatRgbVal(converted_rgb["b"] + 30)}`)
                                            .replaceAll("82,139,255", `${formatRgbVal(converted_rgb["r"] + 30)}, ${formatRgbVal(converted_rgb["g"] + 30)}, ${formatRgbVal(converted_rgb["b"] + 30)}`);
                                        change_made = true;
                                    }
                                    if (converted_sheet.includes("20, 70, 255") || converted_sheet.includes("20,70,255")) {
                                        converted_sheet = converted_sheet
                                            .replaceAll("20, 70, 255", `${formatRgbVal(converted_rgb["r"] - 20)}, ${formatRgbVal(converted_rgb["g"] - 20)}, ${formatRgbVal(converted_rgb["b"] - 20)}`)
                                            .replaceAll("20,70,255", `${formatRgbVal(converted_rgb["r"] - 20)}, ${formatRgbVal(converted_rgb["g"] - 20)}, ${formatRgbVal(converted_rgb["b"] - 20)}`);
                                        change_made = true;
                                    }
                                    if (converted_sheet.includes("#528BFF")) {
                                        converted_sheet = converted_sheet.replaceAll("#528BFF", rgbToHex(formatRgbVal(converted_rgb["r"] + 30), formatRgbVal(converted_rgb["g"] + 30), formatRgbVal(converted_rgb["b"] + 30)));
                                        change_made = true;
                                    }
                                    if (converted_sheet.includes("#335FFF")) {
                                        converted_sheet = converted_sheet.replaceAll("#335FFF", settings["color"]);
                                        change_made = true;
                                    }
                                    if (converted_sheet.includes("#1446FF")) {
                                        converted_sheet = converted_sheet.replaceAll("#1446FF", rgbToHex(formatRgbVal(converted_rgb["r"] - 20), formatRgbVal(converted_rgb["g"] - 20), formatRgbVal(converted_rgb["b"] - 20)));
                                        change_made = true;
                                    }
                                    if (converted_sheet.includes("#3C64FA")) {
                                        converted_sheet = converted_sheet.replaceAll("#3C64FA", rgbToHex(formatRgbVal(converted_rgb["r"] - 10), formatRgbVal(converted_rgb["g"] - 10), formatRgbVal(converted_rgb["b"] - 10)));
                                        change_made = true;
                                    }
                                    if (change_made == true) {
                                        header.innerHTML = converted_sheet + `
                                        .web-blox-css-tss-lo77dr-Button-contained {
                                            box-shadow: none;
                                            color: rgb(255, 255, 255);
                                            background-color: ${rgbToHex(formatRgbVal(converted_rgb["r"] - 10), formatRgbVal(converted_rgb["g"] - 10), formatRgbVal(converted_rgb["b"] - 10))} !important;
                                        }
                                        .web-blox-css-tss-lo77dr-Button-contained:hover {
                                            background-color: ${rgbToHex(formatRgbVal(converted_rgb["r"] - 30), formatRgbVal(converted_rgb["g"] - 30), formatRgbVal(converted_rgb["b"] - 30))} !important;
                                        }
                                        `;
                                    }
                                });
                                setTimeout(() => { injectCSS(settings) }, amountOfSecondsBeforeLoop)
                            }
                            chrome.scripting.executeScript({
                                target: { tabId: tabId, allFrames: true },
                                func: injectCSS,
                                args: [items[storage_key]]
                            })
                        } else if (tab.url.startsWith("https://create.roblox.com")) {
                            if (items[storage_key]["overwriteCreateDashboard"] == true) {
                                async function injectCSS(settings) {
                                    var amountOfSecondsBeforeLoop = (typeof (settings["loopSeconds"]) == "string" && Number(settings["loopSeconds"])) ? Number(settings["loopSeconds"]) : 100;

                                    async function loopThroughArrayAsync(array, callback) {
                                        var generated_keys = Object.keys(array);
                                        for (a = 0; a < generated_keys.length; a++) {
                                            var key = generated_keys[a];
                                            var value = array[key];
                                            await callback(key, value);
                                        };
                                    };
                                    function loopThroughArray(array, callback) {
                                        var generated_keys = Object.keys(array);
                                        for (a = 0; a < generated_keys.length; a++) {
                                            var key = generated_keys[a];
                                            var value = array[key];
                                            callback(key, value);
                                        };
                                    };
                                    function sheetToString(sheet) {
                                        function stringifyRule(rule) {
                                            return rule.cssText || ''
                                        }
                                        var text = sheet.cssRules
                                            ? Array.from(sheet.cssRules)
                                                .map(rule => stringifyRule(rule))
                                                .join('\n')
                                            : ''
                                        return text;
                                    };
                                    function hexToRgb(hex) {
                                        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                                        return result ? {
                                            r: parseInt(result[1], 16),
                                            g: parseInt(result[2], 16),
                                            b: parseInt(result[3], 16)
                                        } : null;
                                    };
                                    function rgbToHex(r, g, b) {
                                        return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1);
                                    };
                                    function formatRgbVal(val) {
                                        if (val < 0) {
                                            return 0;
                                        } else if (val > 255) {
                                            return 255;
                                        } else {
                                            return val;
                                        }
                                    };

                                    var converted_rgb = hexToRgb(settings["color"]);
                                    var all_styles = document.getElementsByTagName("style");
                                    all_styles = Array.prototype.slice.call(all_styles);
                                    await loopThroughArrayAsync(all_styles, async (_, header) => {
                                        var change_made = false;
                                        var converted_sheet = "";
                                        if (header.sheet) {
                                            converted_sheet = sheetToString(header.sheet);
                                        } else if (header.innerHTML) {
                                            converted_sheet = header.innerHTML;
                                        }
                                        if (converted_sheet.includes("51, 95, 255") || converted_sheet.includes("51,95,255")) {
                                            converted_sheet = converted_sheet
                                                .replaceAll("51, 95, 255", `${converted_rgb["r"]}, ${converted_rgb["g"]}, ${converted_rgb["b"]}`)
                                                .replaceAll("51,95,255", `${converted_rgb["r"]}, ${converted_rgb["g"]}, ${converted_rgb["b"]}`);
                                            change_made = true;
                                        }
                                        if (converted_sheet.includes("82, 139, 255") || converted_sheet.includes("82,139,255")) {
                                            converted_sheet = converted_sheet
                                                .replaceAll("82, 139, 255", `${formatRgbVal(converted_rgb["r"] + 30)}, ${formatRgbVal(converted_rgb["g"] + 30)}, ${formatRgbVal(converted_rgb["b"] + 30)}`)
                                                .replaceAll("82,139,255", `${formatRgbVal(converted_rgb["r"] + 30)}, ${formatRgbVal(converted_rgb["g"] + 30)}, ${formatRgbVal(converted_rgb["b"] + 30)}`);
                                            change_made = true;
                                        }
                                        if (converted_sheet.includes("20, 70, 255") || converted_sheet.includes("20,70,255")) {
                                            converted_sheet = converted_sheet
                                                .replaceAll("20, 70, 255", `${formatRgbVal(converted_rgb["r"] - 20)}, ${formatRgbVal(converted_rgb["g"] - 20)}, ${formatRgbVal(converted_rgb["b"] - 20)}`)
                                                .replaceAll("20,70,255", `${formatRgbVal(converted_rgb["r"] - 20)}, ${formatRgbVal(converted_rgb["g"] - 20)}, ${formatRgbVal(converted_rgb["b"] - 20)}`);
                                            change_made = true;
                                        }
                                        if (converted_sheet.includes("#528BFF")) {
                                            converted_sheet = converted_sheet.replaceAll("#528BFF", rgbToHex(formatRgbVal(converted_rgb["r"] + 30), formatRgbVal(converted_rgb["g"] + 30), formatRgbVal(converted_rgb["b"] + 30)));
                                            change_made = true;
                                        }
                                        if (converted_sheet.includes("#335FFF")) {
                                            converted_sheet = converted_sheet.replaceAll("#335FFF", settings["color"]);
                                            change_made = true;
                                        }
                                        if (converted_sheet.includes("#1446FF")) {
                                            converted_sheet = converted_sheet.replaceAll("#1446FF", rgbToHex(formatRgbVal(converted_rgb["r"] - 20), formatRgbVal(converted_rgb["g"] - 20), formatRgbVal(converted_rgb["b"] - 20)));
                                            change_made = true;
                                        }
                                        if (converted_sheet.includes("#3C64FA")) {
                                            converted_sheet = converted_sheet.replaceAll("#3C64FA", rgbToHex(formatRgbVal(converted_rgb["r"] - 10), formatRgbVal(converted_rgb["g"] - 10), formatRgbVal(converted_rgb["b"] - 10)));
                                            change_made = true;
                                        }
                                        if (change_made == true) {
                                            header.innerHTML = converted_sheet;
                                        }
                                    });

                                    var all_buttons = document.getElementsByTagName("button");
                                    var all_icons = document.getElementsByTagName("svg");
                                    all_buttons = Array.prototype.slice.call(all_buttons).concat(Array.prototype.slice.call(all_icons));
                                    await loopThroughArrayAsync(all_buttons, async (_, header) => {
                                        var att_name = "fill"
                                        if (header.getAttribute(att_name) && !(header.getAttribute(att_name).includes(`${converted_rgb["r"]}, ${converted_rgb["g"]}, ${converted_rgb["b"]}`) || header.getAttribute(att_name).includes(settings["color"]))) {
                                            var converted_sheet = header.getAttribute(att_name);
                                            var change_made = false;
                                            if (converted_sheet.includes("51, 95, 255") || converted_sheet.includes("51,95,255")) {
                                                converted_sheet = converted_sheet
                                                    .replaceAll("51, 95, 255", `${converted_rgb["r"]}, ${converted_rgb["g"]}, ${converted_rgb["b"]}`)
                                                    .replaceAll("51,95,255", `${converted_rgb["r"]}, ${converted_rgb["g"]}, ${converted_rgb["b"]}`);
                                                change_made = true;
                                            }
                                            if (converted_sheet.includes("60, 100, 250") || converted_sheet.includes("60,100,250")) {
                                                converted_sheet = converted_sheet
                                                    .replaceAll("60, 100, 250", `${formatRgbVal(converted_rgb["r"] + 30)}, ${formatRgbVal(converted_rgb["g"] + 30)}, ${formatRgbVal(converted_rgb["b"] + 30)}`)
                                                    .replaceAll("60,100,250", `${formatRgbVal(converted_rgb["r"] + 30)}, ${formatRgbVal(converted_rgb["g"] + 30)}, ${formatRgbVal(converted_rgb["b"] + 30)}`);
                                                change_made = true;
                                            }
                                            if (converted_sheet.includes("20, 70, 255") || converted_sheet.includes("20,70,255")) {
                                                converted_sheet = converted_sheet
                                                    .replaceAll("20, 70, 255", `${formatRgbVal(converted_rgb["r"] - 20)}, ${formatRgbVal(converted_rgb["g"] - 20)}, ${formatRgbVal(converted_rgb["b"] - 20)}`)
                                                    .replaceAll("20,70,255", `${formatRgbVal(converted_rgb["r"] - 20)}, ${formatRgbVal(converted_rgb["g"] - 20)}, ${formatRgbVal(converted_rgb["b"] - 20)}`);
                                                change_made = true;
                                            }
                                            if (converted_sheet.includes("#335FFF")) {
                                                converted_sheet = converted_sheet.replaceAll("#335FFF", settings["color"]);
                                                change_made = true;
                                            }
                                            if (converted_sheet.includes("#3C64FA")) {
                                                converted_sheet = converted_sheet.replaceAll("#3C64FA", rgbToHex(formatRgbVal(converted_rgb["r"] - 10), formatRgbVal(converted_rgb["g"] - 10), formatRgbVal(converted_rgb["b"] - 10)));
                                                change_made = true;
                                            }
                                            if (header.className.animVal.includes("highcharts-point highcharts-color-0")) {
                                                converted_sheet = settings["color"];
                                                change_made = true;
                                            }
                                            if (change_made == true) {
                                                header.setAttribute(att_name, converted_sheet)
                                            }
                                        }

                                        att_name = "style"
                                        if (header.getAttribute(att_name) && !(header.getAttribute(att_name).includes(`${converted_rgb["r"]}, ${converted_rgb["g"]}, ${converted_rgb["b"]}`) || header.getAttribute(att_name).includes(settings["color"]))) {
                                            var converted_sheet = header.getAttribute(att_name);
                                            var change_made = false;
                                            if (converted_sheet.includes("51, 95, 255") || converted_sheet.includes("51,95,255")) {
                                                converted_sheet = converted_sheet
                                                    .replaceAll("51, 95, 255", `${converted_rgb["r"]}, ${converted_rgb["g"]}, ${converted_rgb["b"]}`)
                                                    .replaceAll("51,95,255", `${converted_rgb["r"]}, ${converted_rgb["g"]}, ${converted_rgb["b"]}`);
                                                change_made = true;
                                            }
                                            if (converted_sheet.includes("60, 100, 250") || converted_sheet.includes("60,100,250")) {
                                                converted_sheet = converted_sheet
                                                    .replaceAll("60, 100, 250", `${formatRgbVal(converted_rgb["r"] + 30)}, ${formatRgbVal(converted_rgb["g"] + 30)}, ${formatRgbVal(converted_rgb["b"] + 30)}`)
                                                    .replaceAll("60,100,250", `${formatRgbVal(converted_rgb["r"] + 30)}, ${formatRgbVal(converted_rgb["g"] + 30)}, ${formatRgbVal(converted_rgb["b"] + 30)}`);
                                                change_made = true;
                                            }
                                            if (converted_sheet.includes("20, 70, 255") || converted_sheet.includes("20,70,255")) {
                                                converted_sheet = converted_sheet
                                                    .replaceAll("20, 70, 255", `${formatRgbVal(converted_rgb["r"] - 20)}, ${formatRgbVal(converted_rgb["g"] - 20)}, ${formatRgbVal(converted_rgb["b"] - 20)}`)
                                                    .replaceAll("20,70,255", `${formatRgbVal(converted_rgb["r"] - 20)}, ${formatRgbVal(converted_rgb["g"] - 20)}, ${formatRgbVal(converted_rgb["b"] - 20)}`);
                                                change_made = true;
                                            }
                                            if (converted_sheet.includes("#335FFF")) {
                                                converted_sheet = converted_sheet.replaceAll("#335FFF", settings["color"]);
                                                change_made = true;
                                            }
                                            if (converted_sheet.includes("#3C64FA")) {
                                                converted_sheet = converted_sheet.replaceAll("#3C64FA", rgbToHex(formatRgbVal(converted_rgb["r"] - 10), formatRgbVal(converted_rgb["g"] - 10), formatRgbVal(converted_rgb["b"] - 10)));
                                                change_made = true;
                                            }
                                            if (change_made == true) {
                                                header.setAttribute(att_name, converted_sheet)
                                            }
                                        }

                                        att_name = "stroke"
                                        if (header.getAttribute(att_name) && !(header.getAttribute(att_name).includes(`${converted_rgb["r"]}, ${converted_rgb["g"]}, ${converted_rgb["b"]}`) || header.getAttribute(att_name).includes(settings["color"]))) {
                                            var converted_sheet = header.getAttribute(att_name);
                                            var change_made = false;
                                            if (converted_sheet.includes("51, 95, 255") || converted_sheet.includes("51,95,255")) {
                                                converted_sheet = converted_sheet
                                                    .replaceAll("51, 95, 255", `${converted_rgb["r"]}, ${converted_rgb["g"]}, ${converted_rgb["b"]}`)
                                                    .replaceAll("51,95,255", `${converted_rgb["r"]}, ${converted_rgb["g"]}, ${converted_rgb["b"]}`);
                                                change_made = true;
                                            }
                                            if (converted_sheet.includes("60, 100, 250") || converted_sheet.includes("60,100,250")) {
                                                converted_sheet = converted_sheet
                                                    .replaceAll("60, 100, 250", `${formatRgbVal(converted_rgb["r"] + 30)}, ${formatRgbVal(converted_rgb["g"] + 30)}, ${formatRgbVal(converted_rgb["b"] + 30)}`)
                                                    .replaceAll("60,100,250", `${formatRgbVal(converted_rgb["r"] + 30)}, ${formatRgbVal(converted_rgb["g"] + 30)}, ${formatRgbVal(converted_rgb["b"] + 30)}`);
                                                change_made = true;
                                            }
                                            if (converted_sheet.includes("20, 70, 255") || converted_sheet.includes("20,70,255")) {
                                                converted_sheet = converted_sheet
                                                    .replaceAll("20, 70, 255", `${formatRgbVal(converted_rgb["r"] - 20)}, ${formatRgbVal(converted_rgb["g"] - 20)}, ${formatRgbVal(converted_rgb["b"] - 20)}`)
                                                    .replaceAll("20,70,255", `${formatRgbVal(converted_rgb["r"] - 20)}, ${formatRgbVal(converted_rgb["g"] - 20)}, ${formatRgbVal(converted_rgb["b"] - 20)}`);
                                                change_made = true;
                                            }
                                            if (converted_sheet.includes("#335FFF")) {
                                                converted_sheet = converted_sheet.replaceAll("#335FFF", settings["color"]);
                                                change_made = true;
                                            }
                                            if (converted_sheet.includes("#3C64FA")) {
                                                converted_sheet = converted_sheet.replaceAll("#3C64FA", rgbToHex(formatRgbVal(converted_rgb["r"] - 10), formatRgbVal(converted_rgb["g"] - 10), formatRgbVal(converted_rgb["b"] - 10)));
                                                change_made = true;
                                            }
                                            if (change_made == true) {
                                                header.setAttribute(att_name, converted_sheet)
                                            }
                                        }
                                    });

                                    if (settings["includeGraphInDashboard"] == true) {
                                        var all_paths_svg = document.getElementsByTagName("path");
                                        var new_combined_list = Array.prototype.slice.call(all_icons).concat(Array.prototype.slice.call(all_paths_svg));
                                        await loopThroughArrayAsync(new_combined_list, async (_, header) => {
                                            var att_name = "fill"
                                            if (header.getAttribute(att_name) && !(header.getAttribute(att_name).includes(`${converted_rgb["r"]}, ${converted_rgb["g"]}, ${converted_rgb["b"]}`) || header.getAttribute(att_name).includes(settings["color"]))) {
                                                var converted_sheet = header.getAttribute(att_name);
                                                var change_made = false;
                                                if (converted_sheet.includes("51, 95, 255") || converted_sheet.includes("51,95,255")) {
                                                    converted_sheet = converted_sheet
                                                        .replaceAll("51, 95, 255", `${converted_rgb["r"]}, ${converted_rgb["g"]}, ${converted_rgb["b"]}`)
                                                        .replaceAll("51,95,255", `${converted_rgb["r"]}, ${converted_rgb["g"]}, ${converted_rgb["b"]}`);
                                                    change_made = true;
                                                }
                                                if (converted_sheet.includes("60, 100, 250") || converted_sheet.includes("60,100,250")) {
                                                    converted_sheet = converted_sheet
                                                        .replaceAll("60, 100, 250", `${formatRgbVal(converted_rgb["r"] + 30)}, ${formatRgbVal(converted_rgb["g"] + 30)}, ${formatRgbVal(converted_rgb["b"] + 30)}`)
                                                        .replaceAll("60,100,250", `${formatRgbVal(converted_rgb["r"] + 30)}, ${formatRgbVal(converted_rgb["g"] + 30)}, ${formatRgbVal(converted_rgb["b"] + 30)}`);
                                                    change_made = true;
                                                }
                                                if (converted_sheet.includes("20, 70, 255") || converted_sheet.includes("20,70,255")) {
                                                    converted_sheet = converted_sheet
                                                        .replaceAll("20, 70, 255", `${formatRgbVal(converted_rgb["r"] - 20)}, ${formatRgbVal(converted_rgb["g"] - 20)}, ${formatRgbVal(converted_rgb["b"] - 20)}`)
                                                        .replaceAll("20,70,255", `${formatRgbVal(converted_rgb["r"] - 20)}, ${formatRgbVal(converted_rgb["g"] - 20)}, ${formatRgbVal(converted_rgb["b"] - 20)}`);
                                                    change_made = true;
                                                }
                                                if (converted_sheet.includes("#335FFF")) {
                                                    converted_sheet = converted_sheet.replaceAll("#335FFF", settings["color"]);
                                                    change_made = true;
                                                }
                                                if (converted_sheet.includes("#3C64FA")) {
                                                    converted_sheet = converted_sheet.replaceAll("#3C64FA", rgbToHex(formatRgbVal(converted_rgb["r"] - 10), formatRgbVal(converted_rgb["g"] - 10), formatRgbVal(converted_rgb["b"] - 10)));
                                                    change_made = true;
                                                }
                                                if (header.className.animVal.includes("highcharts-point highcharts-color-0")) {
                                                    converted_sheet = settings["color"];
                                                    change_made = true;
                                                }
                                                if (change_made == true) {
                                                    header.setAttribute(att_name, converted_sheet)
                                                }
                                            }

                                            att_name = "style"
                                            if (header.getAttribute(att_name) && !(header.getAttribute(att_name).includes(`${converted_rgb["r"]}, ${converted_rgb["g"]}, ${converted_rgb["b"]}`) || header.getAttribute(att_name).includes(settings["color"]))) {
                                                var converted_sheet = header.getAttribute(att_name);
                                                var change_made = false;
                                                if (converted_sheet.includes("51, 95, 255") || converted_sheet.includes("51,95,255")) {
                                                    converted_sheet = converted_sheet
                                                        .replaceAll("51, 95, 255", `${converted_rgb["r"]}, ${converted_rgb["g"]}, ${converted_rgb["b"]}`)
                                                        .replaceAll("51,95,255", `${converted_rgb["r"]}, ${converted_rgb["g"]}, ${converted_rgb["b"]}`);
                                                    change_made = true;
                                                }
                                                if (converted_sheet.includes("60, 100, 250") || converted_sheet.includes("60,100,250")) {
                                                    converted_sheet = converted_sheet
                                                        .replaceAll("60, 100, 250", `${formatRgbVal(converted_rgb["r"] + 30)}, ${formatRgbVal(converted_rgb["g"] + 30)}, ${formatRgbVal(converted_rgb["b"] + 30)}`)
                                                        .replaceAll("60,100,250", `${formatRgbVal(converted_rgb["r"] + 30)}, ${formatRgbVal(converted_rgb["g"] + 30)}, ${formatRgbVal(converted_rgb["b"] + 30)}`);
                                                    change_made = true;
                                                }
                                                if (converted_sheet.includes("20, 70, 255") || converted_sheet.includes("20,70,255")) {
                                                    converted_sheet = converted_sheet
                                                        .replaceAll("20, 70, 255", `${formatRgbVal(converted_rgb["r"] - 20)}, ${formatRgbVal(converted_rgb["g"] - 20)}, ${formatRgbVal(converted_rgb["b"] - 20)}`)
                                                        .replaceAll("20,70,255", `${formatRgbVal(converted_rgb["r"] - 20)}, ${formatRgbVal(converted_rgb["g"] - 20)}, ${formatRgbVal(converted_rgb["b"] - 20)}`);
                                                    change_made = true;
                                                }
                                                if (converted_sheet.includes("#335FFF")) {
                                                    converted_sheet = converted_sheet.replaceAll("#335FFF", settings["color"]);
                                                    change_made = true;
                                                }
                                                if (converted_sheet.includes("#3C64FA")) {
                                                    converted_sheet = converted_sheet.replaceAll("#3C64FA", rgbToHex(formatRgbVal(converted_rgb["r"] - 10), formatRgbVal(converted_rgb["g"] - 10), formatRgbVal(converted_rgb["b"] - 10)));
                                                    change_made = true;
                                                }
                                                if (change_made == true) {
                                                    header.setAttribute(att_name, converted_sheet)
                                                }
                                            }

                                            att_name = "stroke"
                                            if (header.getAttribute(att_name) && !(header.getAttribute(att_name).includes(`${converted_rgb["r"]}, ${converted_rgb["g"]}, ${converted_rgb["b"]}`) || header.getAttribute(att_name).includes(settings["color"]))) {
                                                var converted_sheet = header.getAttribute(att_name);
                                                var change_made = false;
                                                if (converted_sheet.includes("51, 95, 255") || converted_sheet.includes("51,95,255")) {
                                                    converted_sheet = converted_sheet
                                                        .replaceAll("51, 95, 255", `${converted_rgb["r"]}, ${converted_rgb["g"]}, ${converted_rgb["b"]}`)
                                                        .replaceAll("51,95,255", `${converted_rgb["r"]}, ${converted_rgb["g"]}, ${converted_rgb["b"]}`);
                                                    change_made = true;
                                                }
                                                if (converted_sheet.includes("60, 100, 250") || converted_sheet.includes("60,100,250")) {
                                                    converted_sheet = converted_sheet
                                                        .replaceAll("60, 100, 250", `${formatRgbVal(converted_rgb["r"] + 30)}, ${formatRgbVal(converted_rgb["g"] + 30)}, ${formatRgbVal(converted_rgb["b"] + 30)}`)
                                                        .replaceAll("60,100,250", `${formatRgbVal(converted_rgb["r"] + 30)}, ${formatRgbVal(converted_rgb["g"] + 30)}, ${formatRgbVal(converted_rgb["b"] + 30)}`);
                                                    change_made = true;
                                                }
                                                if (converted_sheet.includes("20, 70, 255") || converted_sheet.includes("20,70,255")) {
                                                    converted_sheet = converted_sheet
                                                        .replaceAll("20, 70, 255", `${formatRgbVal(converted_rgb["r"] - 20)}, ${formatRgbVal(converted_rgb["g"] - 20)}, ${formatRgbVal(converted_rgb["b"] - 20)}`)
                                                        .replaceAll("20,70,255", `${formatRgbVal(converted_rgb["r"] - 20)}, ${formatRgbVal(converted_rgb["g"] - 20)}, ${formatRgbVal(converted_rgb["b"] - 20)}`);
                                                    change_made = true;
                                                }
                                                if (converted_sheet.includes("#335FFF")) {
                                                    converted_sheet = converted_sheet.replaceAll("#335FFF", settings["color"]);
                                                    change_made = true;
                                                }
                                                if (converted_sheet.includes("#3C64FA")) {
                                                    converted_sheet = converted_sheet.replaceAll("#3C64FA", rgbToHex(formatRgbVal(converted_rgb["r"] - 10), formatRgbVal(converted_rgb["g"] - 10), formatRgbVal(converted_rgb["b"] - 10)));
                                                    change_made = true;
                                                }
                                                if (change_made == true) {
                                                    header.setAttribute(att_name, converted_sheet)
                                                }
                                            }
                                        });
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