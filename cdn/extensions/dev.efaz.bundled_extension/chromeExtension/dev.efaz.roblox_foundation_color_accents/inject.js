/* 

Efaz's Roblox Foundation Color Accents
By: EfazDev
Page: https://www.efaz.dev/roblox-foundation-color-accents

inject.js:
    - Content script that recreates the Roblox CSS with an edited version

*/

(function () {
    const storage = chrome.storage.local;
    const storage_key = "dev.efaz.roblox_foundation_color_accents"
    function getChromeURL(resource) {
        try {
            // This is for Efaz's Roblox Extension support
            if (chrome.runtime.getManifest()["homepage_url"] == "https://www.efaz.dev/roblox-extension") {
                // This is run under bundled extension [{extension_name}/{resource}]
                return chrome.runtime.getURL("dev.efaz.roblox_foundation_color_accents" + "/" + resource)
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

    try {
        getSettings(storage_key, function (items) {
            var defaultData = { "enabled": true, "color": "#56ac72", "loopSeconds": "100", "overwriteSuccessColor": false, "applyToPrimaryBtn": false, "overwriteCreateDashboard": false, "includeGraphInDashboard": false }
            if (!(items[storage_key])) {
                items[storage_key] = defaultData
            }
            if (items[storage_key]["enabled"] == true) {
                var tab = window.location
                if (tab.href) {
                    var urlObj = window.location
                    if (urlObj.hostname == "www.roblox.com") {
                        async function injectCSS(settings) {
                            var amountOfSecondsBeforeLoop = (typeof (settings["loopSeconds"]) == "string" && Number(settings["loopSeconds"])) ? Number(settings["loopSeconds"]) : 100
                            var all_links = document.getElementsByTagName("link")

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
                                            if (settings["enableImageBackground"] == true) {
                                                if (!(settings["projectedImage"] == "" || settings["projectedImage"] == "https://empty.efaz.dev" || settings["projectedImage"] == null)) {
                                                    if (settings["projectedImage"].startsWith("https://") || settings["projectedImage"].startsWith("data:")) { roblox_css_res = roblox_css_res.replaceAll("background-color:#335fff", "background:url(" + settings["projectedImage"] + ");background-size: 105% 100%;background-position: 50%") }
                                                }
                                            }
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
                        injectCSS(items[storage_key])
                    } else if (urlObj.hostname == "create.roblox.com" || urlObj.hostname == "authorize.roblox.com" || urlObj.hostname == "advertise.roblox.com") {
                        if (items[storage_key]["overwriteCreateDashboard"] == true) {
                            async function injectCSS(settings) {
                                var amountOfSecondsBeforeLoop = (typeof (settings["loopSeconds"]) == "string" && Number(settings["loopSeconds"])) ? Number(settings["loopSeconds"]) : 100;

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
                                function applyBaseColoring(converted_sheet) {
                                    var change_made = false
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
                                    if (converted_sheet.includes("112, 160, 255") || converted_sheet.includes("112,160,255")) {
                                        converted_sheet = converted_sheet
                                            .replaceAll("112, 160, 255", `${formatRgbVal(converted_rgb["r"] + 50)}, ${formatRgbVal(converted_rgb["g"] + 50)}, ${formatRgbVal(converted_rgb["b"] + 50)}`)
                                            .replaceAll("112,160,255", `${formatRgbVal(converted_rgb["r"] + 50)}, ${formatRgbVal(converted_rgb["g"] + 50)}, ${formatRgbVal(converted_rgb["b"] + 50)}`);
                                        change_made = true;
                                    }
                                    if (converted_sheet.includes("0, 27, 122") || converted_sheet.includes("0,27,122")) {
                                        converted_sheet = converted_sheet
                                            .replaceAll("0, 27, 122", `${formatRgbVal(converted_rgb["r"] - 50)}, ${formatRgbVal(converted_rgb["g"] - 50)}, ${formatRgbVal(converted_rgb["b"] - 50)}`)
                                            .replaceAll("0,27,122", `${formatRgbVal(converted_rgb["r"] - 50)}, ${formatRgbVal(converted_rgb["g"] - 50)}, ${formatRgbVal(converted_rgb["b"] - 50)}`);
                                        change_made = true;
                                    }
                                    if (converted_sheet.includes("60, 100, 250") || converted_sheet.includes("60,100,250")) {
                                        converted_sheet = converted_sheet
                                            .replaceAll("60, 100, 250", `${converted_rgb["r"]}, ${converted_rgb["g"]}, ${converted_rgb["b"]}`)
                                            .replaceAll("60,100,250", `${converted_rgb["r"]}, ${converted_rgb["g"]}, ${converted_rgb["b"]}`);
                                        change_made = true;
                                    }
                                    if (converted_sheet.includes("0, 34, 255") || converted_sheet.includes("0,34,255")) {
                                        converted_sheet = converted_sheet
                                            .replaceAll("0, 34, 255", `${converted_rgb["r"]-50}, ${converted_rgb["g"]-50}, ${converted_rgb["b"]-50}`)
                                            .replaceAll("0,34,255", `${converted_rgb["r"]-50}, ${converted_rgb["g"]-50}, ${converted_rgb["b"]-50}`);
                                        change_made = true;
                                    }
                                    if (converted_sheet.includes("58, 84, 255") || converted_sheet.includes("58,84,255")) {
                                        converted_sheet = converted_sheet
                                            .replaceAll("58, 84, 255", `${converted_rgb["r"]-25}, ${converted_rgb["g"]-25}, ${converted_rgb["b"]-25}`)
                                            .replaceAll("58,84,255", `${converted_rgb["r"]-25}, ${converted_rgb["g"]-25}, ${converted_rgb["b"]-25}`);
                                        change_made = true;
                                    }
                                    if (converted_sheet.includes("115, 134, 255") || converted_sheet.includes("115,134,255")) {
                                        converted_sheet = converted_sheet
                                            .replaceAll("115, 134, 255", `${converted_rgb["r"]+25}, ${converted_rgb["g"]+25}, ${converted_rgb["b"]+25}`)
                                            .replaceAll("115,134,255", `${converted_rgb["r"]+25}, ${converted_rgb["g"]+25}, ${converted_rgb["b"]+25}`);
                                        change_made = true;
                                    }
                                    if (converted_sheet.includes("173, 183, 255") || converted_sheet.includes("173,183,255")) {
                                        converted_sheet = converted_sheet
                                            .replaceAll("173, 183, 255", `${converted_rgb["r"]+50}, ${converted_rgb["g"]+50}, ${converted_rgb["b"]+50}`)
                                            .replaceAll("173,183,255", `${converted_rgb["r"]+50}, ${converted_rgb["g"]+50}, ${converted_rgb["b"]+50}`);
                                        change_made = true;
                                    }
                                    if (converted_sheet.includes("85, 193, 255") || converted_sheet.includes("85,193,255")) {
                                        converted_sheet = converted_sheet
                                            .replaceAll("85, 193, 255", `${formatRgbVal(converted_rgb["r"] + 60)}, ${formatRgbVal(converted_rgb["g"] + 60)}, ${formatRgbVal(converted_rgb["b"] + 60)}`)
                                            .replaceAll("85,193,255", `${formatRgbVal(converted_rgb["r"] + 60)}, ${formatRgbVal(converted_rgb["g"] + 60)}, ${formatRgbVal(converted_rgb["b"] + 60)}`);
                                        change_made = true;
                                    }
                                    if (converted_sheet.includes("43, 177, 255") || converted_sheet.includes("43,177,255")) {
                                        converted_sheet = converted_sheet
                                            .replaceAll("43, 177, 255", `${formatRgbVal(converted_rgb["r"] + 40)}, ${formatRgbVal(converted_rgb["g"] + 40)}, ${formatRgbVal(converted_rgb["b"] + 40)}`)
                                            .replaceAll("43,177,255", `${formatRgbVal(converted_rgb["r"] + 40)}, ${formatRgbVal(converted_rgb["g"] + 40)}, ${formatRgbVal(converted_rgb["b"] + 40)}`);
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
                                    return [change_made, converted_sheet]
                                }

                                var converted_rgb = hexToRgb(settings["color"]);
                                var all_styles = document.getElementsByTagName("style");
                                all_styles = Array.prototype.slice.call(all_styles);
                                await loopThroughArrayAsync(all_styles, async (_, header) => {
                                    var target_sheet = "";
                                    if (header.sheet) {
                                        target_sheet = sheetToString(header.sheet);
                                    } else if (header.innerHTML) {
                                        target_sheet = header.innerHTML;
                                    }
                                    var base_color_res = applyBaseColoring(target_sheet)
                                    var change_made = base_color_res[0] 
                                    var converted_sheet = base_color_res[1]
                                    if (change_made == true) {header.innerHTML = converted_sheet}
                                });

                                var all_buttons = document.getElementsByTagName("button");
                                var all_icons = document.getElementsByTagName("svg");
                                all_buttons = Array.prototype.slice.call(all_buttons).concat(Array.prototype.slice.call(all_icons));
                                await loopThroughArrayAsync(all_buttons, async (_, header) => {
                                    var att_name = "fill"
                                    if (header.getAttribute(att_name) && !(header.getAttribute(att_name).includes(`${converted_rgb["r"]}, ${converted_rgb["g"]}, ${converted_rgb["b"]}`) || header.getAttribute(att_name).includes(settings["color"]))) {
                                        var target_sheet = header.getAttribute(att_name);
                                        var base_color_res = applyBaseColoring(target_sheet)
                                        var change_made = base_color_res[0] 
                                        var converted_sheet = base_color_res[1]
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
                                        var target_sheet = header.getAttribute(att_name);
                                        var base_color_res = applyBaseColoring(target_sheet)
                                        var change_made = base_color_res[0] 
                                        var converted_sheet = base_color_res[1]
                                        if (change_made == true) {
                                            header.setAttribute(att_name, converted_sheet)
                                        }
                                    }

                                    att_name = "stroke"
                                    if (header.getAttribute(att_name) && !(header.getAttribute(att_name).includes(`${converted_rgb["r"]}, ${converted_rgb["g"]}, ${converted_rgb["b"]}`) || header.getAttribute(att_name).includes(settings["color"]))) {
                                        var target_sheet = header.getAttribute(att_name);
                                        var base_color_res = applyBaseColoring(target_sheet)
                                        var change_made = base_color_res[0] 
                                        var converted_sheet = base_color_res[1]
                                        if (change_made == true) {
                                            header.setAttribute(att_name, converted_sheet)
                                        }
                                    }
                                });

                                if (settings["includeGraphInDashboard"] == true) {
                                    var all_paths_svg = document.getElementsByTagName("path");
                                    var all_span = document.getElementsByTagName("span");
                                    var all_rect = document.getElementsByTagName("rect");
                                    var new_combined_list = Array.prototype.slice.call(all_span).concat(Array.prototype.slice.call(all_paths_svg)).concat(Array.prototype.slice.call(all_rect));
                                    await loopThroughArrayAsync(new_combined_list, async (_, header) => {
                                        var att_name = "fill"
                                        if (header.getAttribute(att_name) && !(header.getAttribute(att_name).includes(`${converted_rgb["r"]}, ${converted_rgb["g"]}, ${converted_rgb["b"]}`) || header.getAttribute(att_name).includes(settings["color"]))) {
                                            var target_sheet = header.getAttribute(att_name);
                                            var base_color_res = applyBaseColoring(target_sheet)
                                            var change_made = base_color_res[0] 
                                            var converted_sheet = base_color_res[1]
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
                                            var target_sheet = header.getAttribute(att_name);
                                            var base_color_res = applyBaseColoring(target_sheet)
                                            var change_made = base_color_res[0] 
                                            var converted_sheet = base_color_res[1]
                                            if (change_made == true) {
                                                header.setAttribute(att_name, converted_sheet)
                                            }
                                        }

                                        att_name = "stroke"
                                        if (header.getAttribute(att_name) && !(header.getAttribute(att_name).includes(`${converted_rgb["r"]}, ${converted_rgb["g"]}, ${converted_rgb["b"]}`) || header.getAttribute(att_name).includes(settings["color"]))) {
                                            var target_sheet = header.getAttribute(att_name);
                                            var base_color_res = applyBaseColoring(target_sheet)
                                            var change_made = base_color_res[0] 
                                            var converted_sheet = base_color_res[1]
                                            if (change_made == true) {
                                                header.setAttribute(att_name, converted_sheet)
                                            }
                                        }
                                    });
                                }
                                setTimeout(() => { injectCSS(settings) }, amountOfSecondsBeforeLoop)
                            }
                            injectCSS(items[storage_key])
                        }
                    }
                }
            }
        });
    } catch (err) {
        console.log("Failed to add font settings to this tab.")
    }
})()