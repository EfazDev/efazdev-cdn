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
                return chrome.runtime.getURL("dev.efaz.foundation_color_accents" + "/" + resource);
            } else {
                return chrome.runtime.getURL(resource);
            }
        } catch (_) {
            // This is run under mini extension [{resource}]
            return chrome.runtime.getURL(resource);
        }
    }
    async function loopThroughArrayAsync(array, callback) {
        if (!array || typeof array !== "object") return;
        let promises = [];
        if (Array.isArray(array)) {
            promises = array.map((value, index) => callback(index, value));
        } else {
            promises = Object.entries(array).map(([key, value]) => callback(key, value));
        }
        await Promise.allSettled(promises);
    }
    function sheetToString(sheet) {
        try {
            return sheet.cssRules ? Array.from(sheet.cssRules).map(rule => rule.cssText || "").join("\n") : "";
        } catch (e) { return ""; }
    };
    function sheetToStringSpecific(sheet, filter) {
        let cssString = "";
        try {
            const rules = sheet.cssRules;
            if (!rules) return "";
            for (let i = 0; i < rules.length; i++) {
                try {
                    const text = rules[i].cssText || "";
                    if (filter.some(color => text.includes(color))) {
                        cssString += text + "\n";
                    }
                } catch (e) { continue; }
            }
        } catch (e) { return ""; }
        return cssString.trim();
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
        const name = storage_key?.replaceAll(".", "_") || "";
        const nameScoped = chrome.i18n.getMessage(`${name}_${id}`);
        if (nameScoped) return nameScoped;
        return chrome.i18n.getMessage(id.replaceAll(".", "_"));
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
                                });
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
                        } else { injectCSS(); }
                    } else if (tab.hostname == "devforum.roblox.com") {
                        if (settings["overwriteDevForum"] == true) {
                            let amountOfSecondsBeforeLoop = (typeof (settings["loopSeconds"]) == "string" && Number(settings["loopSeconds"])) ? Number(settings["loopSeconds"]) : 100;
                            let converted_rgb = hexToRgb(settings["color"]);
                            function applyBaseColoring(converted_sheet) {
                                let change_made = false;
                                let new_sheet = `
                                * {
                                    --tertiary: #2bb1ff !important;
                                    --quaternary: #2bb1ff !important;
                                    --highlight: #2bb1ff !important;
                                    --tertiary-very-low: rgb(0, 47.0896226415, 74.5) !important;
                                    --tertiary-low: rgb(0, 65.9254716981, 104.3) !important;
                                    --tertiary-medium: rgb(0, 103.5971698113, 163.9) !important;
                                    --tertiary-high: rgb(0, 141.2688679245, 223.5 !important);
                                    --tertiary-hover: rgb(85.4, 192.6, 255) !important;
                                    --tertiary-50: rgb(0, 47.0896226415, 74.5) !important;
                                    --tertiary-100: rgb(0, 52.7403773585, 83.44) !important;
                                    --tertiary-200: rgb(0, 58.3911320755, 92.38) !important;
                                    --tertiary-300: rgb(0, 65.9254716981, 104.3) !important;
                                    --tertiary-400: rgb(0, 79.1105660377, 125.16) !important;
                                    --tertiary-500: rgb(0, 90.4120754717, 143.04) !important;
                                    --tertiary-600: rgb(0, 103.5971698113, 163.9) !important;
                                    --tertiary-700: rgb(0, 116.7822641509, 184.76) !important;
                                    --tertiary-800: rgb(0, 129.9673584906, 205.62) !important;
                                    --tertiary-900: rgb(0, 141.2688679245, 223.5) !important;
                                    --color-extended-blue-100: rgb(0, 52.7403773585, 83.44) !important;
                                    --color-extended-blue-1000: #002dd6 !important;
                                    --color-extended-blue-1100: #0027b8 !important;
                                    --color-extended-blue-1200: #029 !important;
                                    --color-extended-blue-1300: #001b7a !important;
                                    --color-extended-blue-1400: #00145c !important;
                                    --color-extended-blue-200: rgb(0, 58.3911320755, 92.38) !important;
                                    --color-extended-blue-300: rgb(0, 65.9254716981, 104.3) !important;
                                    --color-extended-blue-400: rgb(0, 79.1105660377, 125.16) !important;
                                    --color-extended-blue-500: rgb(0, 90.4120754717, 143.04) !important;
                                    --color-extended-blue-600: rgb(0, 103.5971698113, 163.9) !important;
                                    --color-extended-blue-700: rgb(0, 116.7822641509, 184.76) !important;
                                    --color-extended-blue-800: rgb(0, 129.9673584906, 205.62) !important;
                                    --color-extended-blue-900: rgb(0, 141.2688679245, 223.5) !important;
                                    --quaternary-low: rgb(0, 56.5075471698, 89.4) !important;
                                    --highlight-bg: rgb(0, 37.6716981132, 59.6) !important;
                                    --highlight-low: rgb(0, 37.6716981132, 59.6) !important;
                                    --highlight-medium: rgb(0, 84.7613207547, 134.1) !important;
                                    --highlight-high: rgb(13.2, 166.0358490566, 255) !important;
                                    --highlight-low-or-medium: rgb(0, 84.7613207547, 134.1) !important;
                                    --tertiary-or-tertiary-low: rgb(0, 65.9254716981, 104.3) !important;
                                    --tertiary-low-or-tertiary-high: rgb(0, 141.2688679245, 223.5) !important;
                                    --tertiary-med-or-tertiary: #2bb1ff !important;
                                }
                                `;
                                new_sheet = new_sheet
                                    .replaceAll("#2bb1ff", rgbToHex(formatRgbVal(converted_rgb["r"] + 20), formatRgbVal(converted_rgb["g"] + 20), formatRgbVal(converted_rgb["b"] + 20)))
                                    .replaceAll("#002dd6", rgbToHex(formatRgbVal(converted_rgb["r"] - 110), formatRgbVal(converted_rgb["g"] - 110), formatRgbVal(converted_rgb["b"] - 110)))
                                    .replaceAll("#0027b8", rgbToHex(formatRgbVal(converted_rgb["r"] - 130), formatRgbVal(converted_rgb["g"] - 130), formatRgbVal(converted_rgb["b"] - 130)))
                                    .replaceAll("#029", rgbToHex(formatRgbVal(converted_rgb["r"] - 150), formatRgbVal(converted_rgb["g"] - 150), formatRgbVal(converted_rgb["b"] - 150)))
                                    .replaceAll("#001b7a", rgbToHex(formatRgbVal(converted_rgb["r"] - 180), formatRgbVal(converted_rgb["g"] - 180), formatRgbVal(converted_rgb["b"] - 180)))
                                    .replaceAll("#00145c", rgbToHex(formatRgbVal(converted_rgb["r"] - 200), formatRgbVal(converted_rgb["g"] - 200), formatRgbVal(converted_rgb["b"] - 200)))
                                    .replaceAll("rgb(0, 141.2688679245, 223.5)", rgbToHex(formatRgbVal(converted_rgb["r"] - 20), formatRgbVal(converted_rgb["g"] - 20), formatRgbVal(converted_rgb["b"] - 20)))
                                    .replaceAll("rgb(0, 47.0896226415, 74.5)", rgbToHex(formatRgbVal(converted_rgb["r"] - 100), formatRgbVal(converted_rgb["g"] - 100), formatRgbVal(converted_rgb["b"] - 100)))
                                    .replaceAll("rgb(0, 65.9254716981, 104.3)", rgbToHex(formatRgbVal(converted_rgb["r"] - 80), formatRgbVal(converted_rgb["g"] - 80), formatRgbVal(converted_rgb["b"] - 80)))
                                    .replaceAll("rgb(0, 103.5971698113, 163.9)", rgbToHex(formatRgbVal(converted_rgb["r"] - 40), formatRgbVal(converted_rgb["g"] - 40), formatRgbVal(converted_rgb["b"] - 40)))
                                    .replaceAll("rgb(85.4, 192.6, 255)", rgbToHex(formatRgbVal(converted_rgb["r"] + 40), formatRgbVal(converted_rgb["g"] + 40), formatRgbVal(converted_rgb["b"] + 40)))
                                    .replaceAll("rgb(0, 52.7403773585, 83.44)", rgbToHex(formatRgbVal(converted_rgb["r"] - 90), formatRgbVal(converted_rgb["g"] - 90), formatRgbVal(converted_rgb["b"] - 90)))
                                    .replaceAll("rgb(0, 58.3911320755, 92.38)", rgbToHex(formatRgbVal(converted_rgb["r"] - 70), formatRgbVal(converted_rgb["g"] - 70), formatRgbVal(converted_rgb["b"] - 70)))
                                    .replaceAll("rgb(0, 79.1105660377, 125.16)", rgbToHex(formatRgbVal(converted_rgb["r"] - 50), formatRgbVal(converted_rgb["g"] - 50), formatRgbVal(converted_rgb["b"] - 50)))
                                    .replaceAll("rgb(0, 90.4120754717, 143.04)", rgbToHex(formatRgbVal(converted_rgb["r"] - 30), formatRgbVal(converted_rgb["g"] - 30), formatRgbVal(converted_rgb["b"] - 30)))
                                    .replaceAll("rgb(0, 116.7822641509, 184.76)", rgbToHex(formatRgbVal(converted_rgb["r"] - 20), formatRgbVal(converted_rgb["g"] - 20), formatRgbVal(converted_rgb["b"] - 20)))
                                    .replaceAll("rgb(0, 129.9673584906, 205.62)", rgbToHex(formatRgbVal(converted_rgb["r"] - 10), formatRgbVal(converted_rgb["g"] - 10), formatRgbVal(converted_rgb["b"] - 10)))
                                    .replaceAll("rgb(0, 56.5075471698, 89.4)", rgbToHex(formatRgbVal(converted_rgb["r"] - 50), formatRgbVal(converted_rgb["g"] - 50), formatRgbVal(converted_rgb["b"] - 50)))
                                    .replaceAll("rgb(0, 37.6716981132, 59.6)", rgbToHex(formatRgbVal(converted_rgb["r"] - 70), formatRgbVal(converted_rgb["g"] - 70), formatRgbVal(converted_rgb["b"] - 70)))
                                    .replaceAll("rgb(0, 84.7613207547, 134.1)", rgbToHex(formatRgbVal(converted_rgb["r"] - 30), formatRgbVal(converted_rgb["g"] - 30), formatRgbVal(converted_rgb["b"] - 30)))
                                    .replaceAll("rgb(13.2, 166.0358490566, 255)", rgbToHex(formatRgbVal(converted_rgb["r"] + 40), formatRgbVal(converted_rgb["g"] + 40), formatRgbVal(converted_rgb["b"] + 40)));
                                if (!document.getElementById("changeFoundationColorsDevForum")) {
                                    let new_element = document.createElement("style");
                                    new_element.setAttribute("id", "changeFoundationColorsDevForum");
                                    new_element.setAttribute("rel", "stylesheet");
                                    new_element.textContent = new_sheet;
                                    document.head.appendChild(new_element);
                                    change_made = true;
                                }
                                return [change_made, converted_sheet];
                            }
                            async function applyCSS(header) {
                                if (header.nodeName.toLowerCase() == "link") {
                                    if (!(header.getAttribute("foundationColor") == "true") && header.rel && header.rel == "stylesheet" && header.href && header.href.includes("color_definitions")) {
                                        let fetchLink = header.href;
                                        //let roblox_css = await fetch(fetchLink);
                                        if (true) {
                                            try {
                                                let roblox_css_res = "";
                                                let base_color_res = applyBaseColoring(roblox_css_res);
                                                roblox_css_res = base_color_res[1];
                                                let d = document.createElement("style");
                                                d.setAttribute("rel", "stylesheet");
                                                d.setAttribute("foundationColor", "true");
                                                d.setAttribute("org_href", header.href);
                                                d.textContent = roblox_css_res;
                                                header.append(d);
                                                header.setAttribute("foundationColor", "true");
                                            } catch (e) {
                                                console.warn('There was an issue to load the requested CSS and inject accent color! Error Message: ' + e.message);
                                            }
                                        } else {
                                            console.warn('There was an issue to load the requested CSS and inject accent color! Status Code: ' + roblox_css.status);
                                        }
                                    }
                                }
                            }
                            async function injectCSS() {
                                var all_links = document.querySelectorAll("link");
                                await loopThroughArrayAsync(all_links, async (_, header) => {
                                    applyCSS(header);
                                });
                                all_links = null;
                                timeout(() => { injectCSS(); }, amountOfSecondsBeforeLoop);
                            }
                            injectCSS();
                        }
                    } else if (tab.hostname == "create.roblox.com" || tab.hostname == "authorize.roblox.com" || tab.hostname == "advertise.roblox.com") {
                        if (settings["overwriteCreateDashboard"] == true) {
                            let amountOfSecondsBeforeLoop = (typeof (settings["loopSeconds"]) == "string" && Number(settings["loopSeconds"])) ? Number(settings["loopSeconds"]) : 100;
                            let converted_rgb = hexToRgb(settings["color"]);
                            const targetColors = [
                                "51, 95, 255",
                                "51,95,255",
                                "82, 139, 255",
                                "82,139,255",
                                "20, 70, 255",
                                "20,70,255",
                                "112, 160, 255",
                                "112,160,255",
                                "0, 27, 122",
                                "0,27,122",
                                "60, 100, 250",
                                "60,100,250",
                                "0, 34, 255",
                                "0,34,255",
                                "58, 84, 255",
                                "58,84,255",
                                "115, 134, 255",
                                "115,134,255",
                                "173, 183, 255",
                                "173,183,255",
                                "85, 193, 255",
                                "85,193,255",
                                "43, 177, 255",
                                "43,177,255",
                                "#528BFF",
                                "#335FFF",
                                "#1446FF",
                                "#3C64FA"
                            ];
                            function applyBaseColoring(converted_sheet) {
                                let change_made = false;
                                if (targetColors.some(color => converted_sheet.includes(color))) {
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
                                    converted_sheet = converted_sheet + `
                                    * {
                                        --color-extended-blue-100: rgb(0, 52.7403773585, 83.44) !important;
                                        --color-extended-blue-1000: #002dd6 !important;
                                        --color-extended-blue-1100: #0027b8 !important;
                                        --color-extended-blue-1200: #029 !important;
                                        --color-extended-blue-1300: #001b7a !important;
                                        --color-extended-blue-1400: #00145c !important;
                                        --color-extended-blue-200: rgb(0, 58.3911320755, 92.38) !important;
                                        --color-extended-blue-300: rgb(0, 65.9254716981, 104.3) !important;
                                        --color-extended-blue-400: rgb(0, 79.1105660377, 125.16) !important;
                                        --color-extended-blue-500: rgb(0, 90.4120754717, 143.04) !important;
                                        --color-extended-blue-600: rgb(0, 103.5971698113, 163.9) !important;
                                        --color-extended-blue-700: rgb(0, 116.7822641509, 184.76) !important;
                                        --color-extended-blue-800: rgb(0, 129.9673584906, 205.62) !important;
                                        --color-extended-blue-900: rgb(0, 141.2688679245, 223.5) !important;
                                    }
                                    `.replaceAll("#002dd6", rgbToHex(formatRgbVal(converted_rgb["r"] - 110), formatRgbVal(converted_rgb["g"] - 110), formatRgbVal(converted_rgb["b"] - 110)))
                                        .replaceAll("#0027b8", rgbToHex(formatRgbVal(converted_rgb["r"] - 130), formatRgbVal(converted_rgb["g"] - 130), formatRgbVal(converted_rgb["b"] - 130)))
                                        .replaceAll("#029", rgbToHex(formatRgbVal(converted_rgb["r"] - 150), formatRgbVal(converted_rgb["g"] - 150), formatRgbVal(converted_rgb["b"] - 150)))
                                        .replaceAll("#001b7a", rgbToHex(formatRgbVal(converted_rgb["r"] - 180), formatRgbVal(converted_rgb["g"] - 180), formatRgbVal(converted_rgb["b"] - 180)))
                                        .replaceAll("#00145c", rgbToHex(formatRgbVal(converted_rgb["r"] - 200), formatRgbVal(converted_rgb["g"] - 200), formatRgbVal(converted_rgb["b"] - 200)))
                                        .replaceAll("rgb(0, 52.7403773585, 83.44)", rgbToHex(formatRgbVal(converted_rgb["r"] - 90), formatRgbVal(converted_rgb["g"] - 90), formatRgbVal(converted_rgb["b"] - 90)))
                                        .replaceAll("rgb(0, 65.9254716981, 104.3)", rgbToHex(formatRgbVal(converted_rgb["r"] - 80), formatRgbVal(converted_rgb["g"] - 80), formatRgbVal(converted_rgb["b"] - 80)))
                                        .replaceAll("rgb(0, 58.3911320755, 92.38)", rgbToHex(formatRgbVal(converted_rgb["r"] - 70), formatRgbVal(converted_rgb["g"] - 70), formatRgbVal(converted_rgb["b"] - 70)))
                                        .replaceAll("rgb(0, 79.1105660377, 125.16)", rgbToHex(formatRgbVal(converted_rgb["r"] - 50), formatRgbVal(converted_rgb["g"] - 50), formatRgbVal(converted_rgb["b"] - 50)))
                                        .replaceAll("rgb(0, 90.4120754717, 143.04)", rgbToHex(formatRgbVal(converted_rgb["r"] - 30), formatRgbVal(converted_rgb["g"] - 30), formatRgbVal(converted_rgb["b"] - 30)))
                                        .replaceAll("rgb(0, 103.5971698113, 163.9)", rgbToHex(formatRgbVal(converted_rgb["r"] - 25), formatRgbVal(converted_rgb["g"] - 25), formatRgbVal(converted_rgb["b"] - 25)))
                                        .replaceAll("rgb(0, 116.7822641509, 184.76)", rgbToHex(formatRgbVal(converted_rgb["r"] - 20), formatRgbVal(converted_rgb["g"] - 20), formatRgbVal(converted_rgb["b"] - 20)))
                                        .replaceAll("rgb(0, 129.9673584906, 205.62)", rgbToHex(formatRgbVal(converted_rgb["r"] - 10), formatRgbVal(converted_rgb["g"] - 10), formatRgbVal(converted_rgb["b"] - 10)))
                                        .replaceAll("rgb(0, 141.2688679245, 223.5)", rgbToHex(formatRgbVal(converted_rgb["r"] + 10), formatRgbVal(converted_rgb["g"] + 10), formatRgbVal(converted_rgb["b"] + 10)));
                                    change_made = true;
                                }
                                return [change_made, converted_sheet];
                            }
                            function applyCSS(header) {
                                if (header.nodeName.toLowerCase() == "style") {
                                    if (header.getAttribute("processed2")) {
                                        return;
                                    }
                                    let target_sheet = "";
                                    if (header.sheet) {
                                        target_sheet = sheetToStringSpecific(header.sheet, targetColors);
                                    } else {
                                        return;
                                    }
                                    let base_color_res = applyBaseColoring(target_sheet);
                                    let change_made = base_color_res[0];
                                    let converted_sheet = base_color_res[1];
                                    let uniqueId = "theme-" + Math.random().toString(36).substring(2, 9);
                                    if (header.getAttribute("processed") && header.getAttribute("assigned")) {
                                        uniqueId = header.getAttribute("assigned");
                                    }
                                    if (change_made == true) {
                                        header.setAttribute("processed", "true");
                                        header.setAttribute("assigned", uniqueId);
                                        let override;
                                        if (document.getElementById("color-auth-" + uniqueId)) {
                                            override = document.getElementById("color-auth-" + uniqueId);
                                        } else {
                                            override = document.createElement("style");
                                        }
                                        override.setAttribute("processed2", "true");
                                        override.id = "color-auth-" + uniqueId;
                                        override.textContent = converted_sheet;
                                        if (header.parentNode) {
                                            header.parentNode.insertBefore(override, header.nextSibling);
                                        }
                                        if (header.sheet) { header.sheet.disabled = false; }
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
                            let query_names = "style, svg, button";
                            if (settings["includeGraphInDashboard"] == true) {
                                query_names = "style, svg, button, path, span, rect";
                            }
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
                                    }
                                });
                            });
                            observer.observe(document.documentElement, {
                                childList: true,
                                subtree: true,
                                characterData: true
                            });
                            async function injectCSS() {
                                var all_elements = document.querySelectorAll(query_names);
                                loopThroughArrayAsync([...all_elements], async (_, header) => {
                                    applyCSS(header);
                                });
                                all_elements = null;
                                watchForSilentCSSUpdates();
                            }
                            function watchForSilentCSSUpdates() {
                                let elements = document.getElementsByTagName("style");
                                for (let i = 0; i < elements.length; i++) {
                                    let header = elements[i];
                                    if (!(header.getAttribute("processed2")) && header.sheet && header.sheet.cssRules) {
                                        let currentLength = header.sheet.cssRules.length;
                                        let savedLength = parseInt(header.getAttribute("data-rule-count") || "0");
                                        if (currentLength !== savedLength) {
                                            header.setAttribute("data-rule-count", currentLength);
                                            applyCSS(header);
                                        }
                                    }
                                }
                                requestAnimationFrame(watchForSilentCSSUpdates);
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