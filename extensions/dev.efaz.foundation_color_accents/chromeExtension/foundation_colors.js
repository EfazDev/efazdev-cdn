/* 

Efaz's Roblox Foundation Color Accents
By: EfazDev
Page: https://www.efaz.dev/roblox-foundation-color-accents

inject.js:
    - Content script that recreates the Roblox CSS with an edited version

*/

(function () {
    const storage = chrome.storage.local;
    const storage_key = "dev.efaz.foundation_color_accents";
    function getChromeURL(resource) {
        try {
            // This is for Efaz's Roblox Extension support
            if (chrome.runtime.getManifest()["homepage_url"] == "https://www.efaz.dev/roblox-extension") {
                // This is run under bundled extension [{extension_name}/{resource}]
                return chrome.runtime.getURL("{extension_name_this_is_replace_when_building_bundle_with_folder_name_if_youre_wondering}" + "/" + resource);
            } else {
                return chrome.runtime.getURL(resource);
            }
        } catch (_) {
            // This is run under mini extension [{resource}]
            return chrome.runtime.getURL(resource);
        }
    }
    async function loopThroughArrayAsync(array, callback) {
        if (Array.isArray(array)) {
            for (let a = 0; a < array.length; a++) {
                await callback(a, array[a]);
            }
        } else if (array && typeof array === "object") {
            for (const a in array) {
                if (Object.hasOwn(array, a)) { await callback(a, array[a]); }
            }
        }
    }
    function loopThroughArray(array, callback) {
        if (Array.isArray(array)) {
            for (let a = 0; a < array.length; a++) {
                callback(a, array[a]);
            }
        } else if (array && typeof array === "object") {
            for (const a in array) {
                if (Object.hasOwn(array, a)) { callback(a, array[a]); }
            }
        }
    }
    function sheetToString(sheet) {
        try {
            return sheet.cssRules ? Array.from(sheet.cssRules).map(rule => rule.cssText || "").join("\n") : "";
        } catch (e) { return ""; }
    };
    function hexToRgb(hex) {
        let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
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
        return Math.max(0, Math.min(255, val));
    };
    function timeout(func, ms) { setTimeout(func, ms); }
    function getTran(id) {
        if (!(chrome.i18n.getMessage(storage_key.replaceAll(".", "_") + "_" + id) == "")) {
            return chrome.i18n.getMessage(storage_key.replaceAll(".", "_") + "_" + id);
        } else if (!(chrome.i18n.getMessage(id.replaceAll(".", "_")) == "")) {
            return chrome.i18n.getMessage(id.replaceAll(".", "_"));
        }
    }
    async function getSettings(storage_key, callback) {
        return await fetch(getChromeURL("settings.json")).then((res) => {
            if (res.ok) { return res.json(); }
        }).then(async (jso) => {
            if (jso) {
                let te = await storage.get(storage_key);
                let user_settings = {};
                if (te && te[storage_key]) {
                    user_settings = te;
                } else if (jso["old_name"]) {
                    let old = await storage.get(jso["old_name"]);
                    if (old) {
                        user_settings = old;
                        user_settings = { [storage_key]: user_settings[jso["old_name"]] };
                    }
                }
                if (!(user_settings[storage_key])) { user_settings[storage_key] = {}; }
                await loopThroughArrayAsync(jso["settings"], async (i, v) => {
                    if (typeof (user_settings[storage_key][i]) == "undefined") {
                        if (!(typeof (v["default"]) == "undefined")) {
                            if (!(getTran(i + "_default") == null)) {
                                user_settings[storage_key][i] = (getTran(i + "_default"));
                            } else {
                                user_settings[storage_key][i] = (v["default"]);
                            }
                        }
                    }
                });
                if (callback) { callback(user_settings); }
                return user_settings;
            }
        });
    }

    try {
        getSettings(storage_key, function (items) {
            let settings = items[storage_key];
            if (settings["enabled"] == true) {
                let tab = window.location;
                if (tab.href) {
                    if (tab.hostname == "www.roblox.com") {
                        let affect_bundles = ["StyleGuide", "Catalog", "Chat", "PlacesList", "ItemDetailsInfo", "UserSettings", "ItemPurchaseUpsell", "GameCarousel", "NotificationStream", "AccountSecurityPrompt", "FoundationCss"];
                        let converted_rgb = hexToRgb(settings["color"]);

                        async function applyCSS(header) {
                            if (header.nodeName.toLowerCase() == "style") {
                                if (!(header.getAttribute("foundationColor") == "true") && !(header.getAttribute("onerror"))) {
                                    let change_made = false;
                                    let converted_sheet = "";
                                    if (header.textContent == "") {
                                        converted_sheet = sheetToString(header.sheet);
                                    } else {
                                        converted_sheet = header.textContent;
                                    }
                                    header.sheet = new CSSStyleSheet();
                                    function applyBaseColoring() {
                                        converted_sheet = converted_sheet
                                            .replaceAll("51, 95, 255", `${converted_rgb["r"]}, ${converted_rgb["g"]}, ${converted_rgb["b"]}`)
                                            .replaceAll("51,95,255", `${converted_rgb["r"]}, ${converted_rgb["g"]}, ${converted_rgb["b"]}`)
                                            .replaceAll("82, 139, 255", `${formatRgbVal(converted_rgb["r"] + 30)}, ${formatRgbVal(converted_rgb["g"] + 30)}, ${formatRgbVal(converted_rgb["b"] + 30)}`)
                                            .replaceAll("82,139,255", `${formatRgbVal(converted_rgb["r"] + 30)}, ${formatRgbVal(converted_rgb["g"] + 30)}, ${formatRgbVal(converted_rgb["b"] + 30)}`)
                                            .replaceAll("20, 70, 255", `${formatRgbVal(converted_rgb["r"] - 20)}, ${formatRgbVal(converted_rgb["g"] - 20)}, ${formatRgbVal(converted_rgb["b"] - 20)}`)
                                            .replaceAll("20,70,255", `${formatRgbVal(converted_rgb["r"] - 20)}, ${formatRgbVal(converted_rgb["g"] - 20)}, ${formatRgbVal(converted_rgb["b"] - 20)}`)
                                            .replaceAll("#528BFF", rgbToHex(formatRgbVal(converted_rgb["r"] + 30), formatRgbVal(converted_rgb["g"] + 30), formatRgbVal(converted_rgb["b"] + 30)))
                                            .replaceAll("#335FFF", settings["color"])
                                            .replaceAll("#1446FF", rgbToHex(formatRgbVal(converted_rgb["r"] - 20), formatRgbVal(converted_rgb["g"] - 20), formatRgbVal(converted_rgb["b"] - 20)))
                                            .replaceAll("#3C64FA", rgbToHex(formatRgbVal(converted_rgb["r"] - 10), formatRgbVal(converted_rgb["g"] - 10), formatRgbVal(converted_rgb["b"] - 10)));
                                    }
                                    if (
                                        converted_sheet.includes("51, 95, 255") ||
                                        converted_sheet.includes("51,95,255") ||
                                        converted_sheet.includes("82, 139, 255") ||
                                        converted_sheet.includes("82,139,255") ||
                                        converted_sheet.includes("20, 70, 255") ||
                                        converted_sheet.includes("20,70,255") ||
                                        converted_sheet.includes("#528BFF") ||
                                        converted_sheet.includes("#335FFF") ||
                                        converted_sheet.includes("#1446FF") ||
                                        converted_sheet.includes("#3C64FA")
                                    ) {
                                        applyBaseColoring();
                                        change_made = true;
                                    }
                                    if (change_made == true) {
                                        header.textContent = converted_sheet + `
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
                                    header.setAttribute("foundationColor", "true");
                                }
                            } else {
                                if (!(header.getAttribute("foundationColor") == "true") && header.rel && header.rel == "stylesheet" && (affect_bundles.includes(header.getAttribute("data-bundlename"))) && header.href) {
                                    let fetchLink = header.href;
                                    header.setAttribute("data-bundlename", header.getAttribute("data-bundlename") + "_Accented");
                                    let roblox_css = await fetch(fetchLink);
                                    if (roblox_css.ok) {
                                        try {
                                            let roblox_css_res = await roblox_css.text();
                                            if (settings["enableImageBackground"] == true) {
                                                if (!(settings["projectedImage"] == "" || settings["projectedImage"] == "https://empty.efaz.dev" || settings["projectedImage"] == null)) {
                                                    if (settings["projectedImage"].startsWith("https://") || settings["projectedImage"].startsWith("data:")) { roblox_css_res = roblox_css_res.replaceAll("background-color:#335fff", "background:url(" + settings["projectedImage"] + ");background-size: 105% 100%;background-position: 50%"); }
                                                }
                                            }
                                            roblox_css_res = roblox_css_res.replaceAll("#335fff", settings["color"].toLowerCase());
                                            if (settings["overwriteSuccessColor"] == true) {
                                                roblox_css_res = roblox_css_res.replaceAll("#39c582", settings["color"].toLowerCase());
                                            }
                                            if (settings["applyToPrimaryBtn"] == true) {
                                                roblox_css_res = roblox_css_res
                                                    .replaceAll("background:#fff;", "background:" + settings["color"].toLowerCase() + ";")
                                                    .replaceAll("background-color:#fff;", "background-color:" + settings["color"].toLowerCase() + ";")
                                                    .replaceAll("border-color:#fff;", "border-color:" + settings["color"].toLowerCase() + ";")
                                                    .replaceAll("background-color:" + settings["color"].toLowerCase() + ";border-color:" + settings["color"].toLowerCase() + ";color:#272930", "background-color:" + settings["color"].toLowerCase() + ";border-color:" + settings["color"].toLowerCase() + ";color: #ffffff");
                                            }
                                            let d = document.createElement("style");
                                            d.setAttribute("rel", "stylesheet");
                                            d.setAttribute("onerror", "Roblox.BundleDetector &amp;&amp; Roblox.BundleDetector.reportBundleError(this)");
                                            d.setAttribute("data-bundlename", header.getAttribute("data-bundlename"));
                                            d.setAttribute("data-bundle-source", "Main");
                                            d.setAttribute("foundationColor", "true");
                                            d.setAttribute("org_href", header.href);
                                            d.textContent = roblox_css_res;
                                            header.href = "";
                                            header.append(d);
                                            header.setAttribute("foundationColor", "true");
                                        } catch (e) {
                                            console.warn('There was an issue to load the requested CSS and inject accent color! Error Message: ' + e.message);
                                        }
                                    } else {
                                        console.warn('There was an issue to load the requested CSS and inject accent color! Status Code: ' + res.status);
                                    }
                                }
                            }
                        }
                        async function injectCSS() {
                            // Stylized Elements
                            let query_names = "style, link";
                            let observer = new MutationObserver((mutations) => {
                                mutations.forEach(m => {
                                    m.addedNodes.forEach(node => {
                                        if (node.nodeType === Node.ELEMENT_NODE) {
                                            if (node.matches(query_names)) { applyCSS(node); }
                                            node.querySelectorAll(query_names).forEach(desc => applyCSS(desc));
                                        }
                                    });
                                    if (m.target instanceof Element && m.target.matches(query_names)) {
                                        applyCSS(m.target);
                                    } else if (m.target.nodeType === Node.TEXT_NODE) {
                                        let parent = m.target.parentElement;
                                        if (parent) {
                                            applyCSS(parent);
                                        }
                                    }
                                })
                            });
                            observer.observe(document.documentElement, {
                                childList: true,
                                subtree: true,
                                characterData: true
                            });

                            let all_styles = document.querySelectorAll("style, link");
                            await loopThroughArrayAsync(all_styles, async (_, header) => {
                                applyCSS(header);
                            });
                            all_styles = null;

                            if (!(document.getElementById("themeSet"))) {
                                let d = document.createElement("style");
                                d.setAttribute("id", "themeSet");
                                d.setAttribute("rel", "stylesheet");
                                d.textContent = ".dark-theme { --theme-buttons-confirm-background: {themeColor} !important;} .light-theme { --theme-buttons-confirm-background: {themeColor} !important;} .system-theme { --theme-buttons-confirm-background: {themeColor} !important;}".replaceAll("{themeColor}", settings["color"]);
                                document.head.append(d);
                            }
                        }
                        if (document.readyState === "loading") {
                            document.addEventListener("DOMContentLoaded", () => {
                                injectCSS();
                            });
                        } else { injectCSS() }
                    } else if (tab.hostname == "create.roblox.com" || tab.hostname == "authorize.roblox.com" || tab.hostname == "advertise.roblox.com") {
                        if (settings["overwriteCreateDashboard"] == true) {
                            let amountOfSecondsBeforeLoop = (typeof (settings["loopSeconds"]) == "string" && Number(settings["loopSeconds"])) ? Number(settings["loopSeconds"]) : 100;
                            let converted_rgb = hexToRgb(settings["color"]);
                            function applyBaseColoring(converted_sheet) {
                                let change_made = false;
                                if (
                                    converted_sheet.includes("51, 95, 255") ||
                                    converted_sheet.includes("51,95,255") ||
                                    converted_sheet.includes("82, 139, 255") ||
                                    converted_sheet.includes("82,139,255") ||
                                    converted_sheet.includes("20, 70, 255") ||
                                    converted_sheet.includes("20,70,255") ||
                                    converted_sheet.includes("112, 160, 255") ||
                                    converted_sheet.includes("112,160,255") ||
                                    converted_sheet.includes("0, 27, 122") ||
                                    converted_sheet.includes("0,27,122") ||
                                    converted_sheet.includes("60, 100, 250") ||
                                    converted_sheet.includes("60,100,250") ||
                                    converted_sheet.includes("0, 34, 255") ||
                                    converted_sheet.includes("0,34,255") ||
                                    converted_sheet.includes("58, 84, 255") ||
                                    converted_sheet.includes("58,84,255") ||
                                    converted_sheet.includes("115, 134, 255") ||
                                    converted_sheet.includes("115,134,255") ||
                                    converted_sheet.includes("173, 183, 255") ||
                                    converted_sheet.includes("173,183,255") ||
                                    converted_sheet.includes("85, 193, 255") ||
                                    converted_sheet.includes("85,193,255") ||
                                    converted_sheet.includes("43, 177, 255") ||
                                    converted_sheet.includes("43,177,255") ||
                                    converted_sheet.includes("#528BFF") ||
                                    converted_sheet.includes("#335FFF") ||
                                    converted_sheet.includes("#1446FF") ||
                                    converted_sheet.includes("#3C64FA")
                                ) {
                                    converted_sheet = converted_sheet
                                        .replaceAll("51, 95, 255", `${converted_rgb["r"]}, ${converted_rgb["g"]}, ${converted_rgb["b"]}`)
                                        .replaceAll("51,95,255", `${converted_rgb["r"]}, ${converted_rgb["g"]}, ${converted_rgb["b"]}`)
                                        .replaceAll("82, 139, 255", `${formatRgbVal(converted_rgb["r"] + 30)}, ${formatRgbVal(converted_rgb["g"] + 30)}, ${formatRgbVal(converted_rgb["b"] + 30)}`)
                                        .replaceAll("82,139,255", `${formatRgbVal(converted_rgb["r"] + 30)}, ${formatRgbVal(converted_rgb["g"] + 30)}, ${formatRgbVal(converted_rgb["b"] + 30)}`)
                                        .replaceAll("20, 70, 255", `${formatRgbVal(converted_rgb["r"] - 20)}, ${formatRgbVal(converted_rgb["g"] - 20)}, ${formatRgbVal(converted_rgb["b"] - 20)}`)
                                        .replaceAll("20,70,255", `${formatRgbVal(converted_rgb["r"] - 20)}, ${formatRgbVal(converted_rgb["g"] - 20)}, ${formatRgbVal(converted_rgb["b"] - 20)}`)
                                        .replaceAll("112, 160, 255", `${formatRgbVal(converted_rgb["r"] + 50)}, ${formatRgbVal(converted_rgb["g"] + 50)}, ${formatRgbVal(converted_rgb["b"] + 50)}`)
                                        .replaceAll("112,160,255", `${formatRgbVal(converted_rgb["r"] + 50)}, ${formatRgbVal(converted_rgb["g"] + 50)}, ${formatRgbVal(converted_rgb["b"] + 50)}`)
                                        .replaceAll("0, 27, 122", `${formatRgbVal(converted_rgb["r"] - 50)}, ${formatRgbVal(converted_rgb["g"] - 50)}, ${formatRgbVal(converted_rgb["b"] - 50)}`)
                                        .replaceAll("0,27,122", `${formatRgbVal(converted_rgb["r"] - 50)}, ${formatRgbVal(converted_rgb["g"] - 50)}, ${formatRgbVal(converted_rgb["b"] - 50)}`)
                                        .replaceAll("60, 100, 250", `${converted_rgb["r"]}, ${converted_rgb["g"]}, ${converted_rgb["b"]}`)
                                        .replaceAll("60,100,250", `${converted_rgb["r"]}, ${converted_rgb["g"]}, ${converted_rgb["b"]}`)
                                        .replaceAll("0, 34, 255", `${converted_rgb["r"] - 50}, ${converted_rgb["g"] - 50}, ${converted_rgb["b"] - 50}`)
                                        .replaceAll("0,34,255", `${converted_rgb["r"] - 50}, ${converted_rgb["g"] - 50}, ${converted_rgb["b"] - 50}`)
                                        .replaceAll("58, 84, 255", `${converted_rgb["r"] - 25}, ${converted_rgb["g"] - 25}, ${converted_rgb["b"] - 25}`)
                                        .replaceAll("58,84,255", `${converted_rgb["r"] - 25}, ${converted_rgb["g"] - 25}, ${converted_rgb["b"] - 25}`)
                                        .replaceAll("115, 134, 255", `${converted_rgb["r"] + 25}, ${converted_rgb["g"] + 25}, ${converted_rgb["b"] + 25}`)
                                        .replaceAll("115,134,255", `${converted_rgb["r"] + 25}, ${converted_rgb["g"] + 25}, ${converted_rgb["b"] + 25}`)
                                        .replaceAll("173, 183, 255", `${converted_rgb["r"] + 50}, ${converted_rgb["g"] + 50}, ${converted_rgb["b"] + 50}`)
                                        .replaceAll("173,183,255", `${converted_rgb["r"] + 50}, ${converted_rgb["g"] + 50}, ${converted_rgb["b"] + 50}`)
                                        .replaceAll("85, 193, 255", `${formatRgbVal(converted_rgb["r"] + 60)}, ${formatRgbVal(converted_rgb["g"] + 60)}, ${formatRgbVal(converted_rgb["b"] + 60)}`)
                                        .replaceAll("85,193,255", `${formatRgbVal(converted_rgb["r"] + 60)}, ${formatRgbVal(converted_rgb["g"] + 60)}, ${formatRgbVal(converted_rgb["b"] + 60)}`)
                                        .replaceAll("43, 177, 255", `${formatRgbVal(converted_rgb["r"] + 40)}, ${formatRgbVal(converted_rgb["g"] + 40)}, ${formatRgbVal(converted_rgb["b"] + 40)}`)
                                        .replaceAll("43,177,255", `${formatRgbVal(converted_rgb["r"] + 40)}, ${formatRgbVal(converted_rgb["g"] + 40)}, ${formatRgbVal(converted_rgb["b"] + 40)}`)
                                        .replaceAll("#528BFF", rgbToHex(formatRgbVal(converted_rgb["r"] + 30), formatRgbVal(converted_rgb["g"] + 30), formatRgbVal(converted_rgb["b"] + 30)))
                                        .replaceAll("#335FFF", settings["color"])
                                        .replaceAll("#335fff", settings["color"])
                                        .replaceAll("#1446FF", rgbToHex(formatRgbVal(converted_rgb["r"] - 20), formatRgbVal(converted_rgb["g"] - 20), formatRgbVal(converted_rgb["b"] - 20)))
                                        .replaceAll("#3C64FA", rgbToHex(formatRgbVal(converted_rgb["r"] - 10), formatRgbVal(converted_rgb["g"] - 10), formatRgbVal(converted_rgb["b"] - 10)));
                                    change_made = true;
                                }
                                return [change_made, converted_sheet];
                            }
                            function applyCSS(header) {
                                if (header.nodeName.toLowerCase() == "style") {
                                    let target_sheet = "";
                                    if (header.sheet) {
                                        target_sheet = sheetToString(header.sheet);
                                    } else {
                                        target_sheet = header.textContent;
                                    }
                                    let base_color_res = applyBaseColoring(target_sheet);
                                    let change_made = base_color_res[0];
                                    let converted_sheet = base_color_res[1];
                                    if (change_made == true) {
                                        header.textContent = converted_sheet;
                                    }
                                } else if (header.nodeName.toLowerCase() == "svg" || header.nodeName.toLowerCase() == "button") {
                                    let att_name = "fill";
                                    if (header.getAttribute(att_name) && !(header.getAttribute(att_name).includes(`${converted_rgb["r"]}, ${converted_rgb["g"]}, ${converted_rgb["b"]}`) || header.getAttribute(att_name).includes(settings["color"]))) {
                                        let target_sheet = header.getAttribute(att_name);
                                        let base_color_res = applyBaseColoring(target_sheet);
                                        let change_made = base_color_res[0];
                                        let converted_sheet = base_color_res[1];
                                        if (header.getAttribute("class") && header.getAttribute("class").includes("highcharts-point highcharts-color-0")) {
                                            converted_sheet = settings["color"];
                                            change_made = true;
                                        }
                                        if (change_made == true) {
                                            header.setAttribute(att_name, converted_sheet);
                                        }
                                    }

                                    function applyToAttribute(att_name) {
                                        if (header.getAttribute(att_name) && !(header.getAttribute(att_name).includes(`${converted_rgb["r"]}, ${converted_rgb["g"]}, ${converted_rgb["b"]}`) || header.getAttribute(att_name).includes(settings["color"]))) {
                                            let target_sheet = header.getAttribute(att_name);
                                            let base_color_res = applyBaseColoring(target_sheet);
                                            let change_made = base_color_res[0];
                                            let converted_sheet = base_color_res[1];
                                            if (change_made == true) {
                                                header.setAttribute(att_name, converted_sheet);
                                            }
                                        }
                                    }
                                    applyToAttribute("style");
                                    applyToAttribute("stroke");
                                } else if (settings["includeGraphInDashboard"] == true && (header.nodeName.toLowerCase() == "path" || header.nodeName.toLowerCase() == "span" || header.nodeName.toLowerCase() == "rect")) {
                                    let att_name = "fill";
                                    if (header.getAttribute(att_name) && !(header.getAttribute(att_name).includes(`${converted_rgb["r"]}, ${converted_rgb["g"]}, ${converted_rgb["b"]}`) || header.getAttribute(att_name).includes(settings["color"]))) {
                                        let target_sheet = header.getAttribute(att_name);
                                        let base_color_res = applyBaseColoring(target_sheet);
                                        let change_made = base_color_res[0];
                                        let converted_sheet = base_color_res[1];
                                        if (header.getAttribute("class") && header.getAttribute("class").includes("highcharts-point highcharts-color-0")) {
                                            converted_sheet = settings["color"];
                                            change_made = true;
                                        }
                                        if (change_made == true) {
                                            header.setAttribute(att_name, converted_sheet);
                                        }
                                    }

                                    function applyToAttribute(att_name) {
                                        if (header.getAttribute(att_name) && !(header.getAttribute(att_name).includes(`${converted_rgb["r"]}, ${converted_rgb["g"]}, ${converted_rgb["b"]}`) || header.getAttribute(att_name).includes(settings["color"]))) {
                                            let target_sheet = header.getAttribute(att_name);
                                            let base_color_res = applyBaseColoring(target_sheet);
                                            let change_made = base_color_res[0];
                                            let converted_sheet = base_color_res[1];
                                            if (change_made == true) {
                                                header.setAttribute(att_name, converted_sheet);
                                            }
                                        }
                                    }
                                    applyToAttribute("style");
                                    applyToAttribute("stroke");
                                }
                            }
                            async function injectCSS() {
                                var all_styles = document.querySelectorAll("style");
                                await loopThroughArrayAsync(all_styles, async (_, header) => {
                                    applyCSS(header);
                                });
                                all_styles = null;

                                var all_buttons = document.querySelectorAll("button");
                                var all_icons = document.querySelectorAll("svg");
                                all_buttons = [...all_buttons, ...all_icons];
                                await loopThroughArrayAsync(all_buttons, async (_, header) => {
                                    applyCSS(header);
                                });
                                all_buttons = null;
                                all_icons = null;

                                if (settings["includeGraphInDashboard"] == true) {
                                    var all_paths_svg = document.querySelectorAll("path");
                                    var all_span = document.querySelectorAll("span");
                                    var all_rect = document.querySelectorAll("rect");
                                    var new_combined_list = [...all_span, ...all_paths_svg, ...all_rect];
                                    await loopThroughArrayAsync(new_combined_list, async (_, header) => {
                                        applyCSS(header);
                                    });
                                    all_paths_svg = null;
                                    all_span = null;
                                    all_rect = null;
                                    new_combined_list = null;
                                }
                                timeout(() => { injectCSS(); }, amountOfSecondsBeforeLoop);
                            }
                            injectCSS();
                        }
                    }
                }
            }
        });
    } catch (err) {
        console.log("Failed to add font settings to this tab.");
    }
})();