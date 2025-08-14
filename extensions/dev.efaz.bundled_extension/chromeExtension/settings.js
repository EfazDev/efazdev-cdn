/* 

Efaz's Roblox Extension
By: EfazDev

settings.js:
    - Handle selecting between mini extensions

*/
var innerBody, innerHead;

async function loopThroughArrayAsync(array, callback) {
    if (typeof (array) == "object") {
        if (Array.isArray(array)) {
            for (let a = 0; a < array.length; a++) {
                var value = array[a];
                await callback(a, value);
            }
        } else {
            var generated_keys = Object.keys(array);
            for (let a = 0; a < generated_keys.length; a++) {
                var key = generated_keys[a];
                var value = array[key];
                await callback(key, value);
            }
        }
    }
}

function loopThroughArray(array, callback) {
    if (typeof (array) == "object") {
        if (Array.isArray(array)) {
            for (let a = 0; a < array.length; a++) {
                var value = array[a];
                callback(a, value);
            }
        } else {
            var generated_keys = Object.keys(array);
            for (let a = 0; a < generated_keys.length; a++) {
                var key = generated_keys[a];
                var value = array[key];
                callback(key, value);
            }
        }
    }
}

function compareVersions(version1, version2) {
    if (!version1 || !version2) { return 0; };
    const parts1 = version1.split('.').map(Number);
    const parts2 = version2.split('.').map(Number);

    const maxLength = Math.max(parts1.length, parts2.length);

    for (let i = 0; i < maxLength; i++) {
        const num1 = parts1[i] || 0;
        const num2 = parts2[i] || 0;

        if (num1 > num2) {
            return 1;
        } else if (num1 < num2) {
            return -1;
        }
    }

    return 0;
}

async function localizeAll(s) {
    if (s) {
        await loopThroughArrayAsync(s, (i, v) => {
            if (typeof (v) == "string") {
                var q = v.replace(/__MSG_(\w+)__/g, function (match, v1) {
                    return v1 ? chrome.i18n.getMessage(v1) : "";
                });
                if (v != q) { s[i] = q; }
            }
        });
        return s;
    } else {
        let objs = Array.from(document.getElementsByTagName("html"));
        loopThroughArray(objs, (_, obj) => {
            var valStrH = obj.innerHTML.toString();
            var valNewH = valStrH.replace(/__MSG_(\w+)__/g, function (match, v1) {
                return v1 ? chrome.i18n.getMessage(v1) : "";
            });
            if (valNewH != valStrH) { obj.innerHTML = valNewH; }
        });
    }
}

async function loadChanges2() {
    await localizeAll();
    let system_settings = await fetch(chrome.runtime.getURL("settings.json")).then((re) => { if (re.ok) { return re.json(); } else { return {}; } });
    let man_json = await fetch(chrome.runtime.getURL("manifest.json")).then((re) => { if (re.ok) { return re.json(); } else { return {}; } });
    function getTran(id) {
        if (!(chrome.i18n.getMessage(system_settings["name"].replaceAll(".", "_") + "_" + id) == "")) {
            return chrome.i18n.getMessage(system_settings["name"].replaceAll(".", "_") + "_" + id);
        } else if (!(chrome.i18n.getMessage(id.replaceAll(".", "_")) == "")) {
            return chrome.i18n.getMessage(id.replaceAll(".", "_"));
        }
    }
    const extensions = system_settings["extensions"];
    await loopThroughArrayAsync(extensions, async (_, exName) => {
        let manifest = await fetch(chrome.runtime.getURL(exName + "/org_manifest.json")).then((re) => { if (re.ok) { return re.json(); } else { return {}; } }).then((re) => { return localizeAll(re); });
        let settings = await fetch(chrome.runtime.getURL(exName + "/settings.json")).then((re) => { if (re.ok) { return re.json(); } else { return {}; } });

        document.getElementById("extens_vers").innerText = `v${man_json["version"]}`;
        document.getElementById("window_title").innerText = getTran("settingsBundleSettings");

        if (document.getElementById(exName) == null) {
            var generated_html_element = `<label for="${exName}">${getTran(exName + "_bundleName")} v${manifest["version"]}: <span class="gradient-border"><button type="submit" id="${exName}">${getTran("settingsOpenSettings")}</button></span>`;
            var beforeElement = document.getElementById("reviewDetails");
            if (settings["hidden"] == true && !(window.location.href.includes("resize=true"))) {
                generated_html_element = `<label style="display: none;" for="${exName}">${settings["name"]} v${manifest["version"]}: <span class="gradient-border"><button type="submit" id="${exName}">${getTran("settingsOpenSettings")}</button></span>`;
            } else {
                generated_html_element = `${generated_html_element}`;
            }
            generated_html_element = `${generated_html_element}</label>`;
            beforeElement.outerHTML = `${generated_html_element}${document.getElementById("reviewDetails").outerHTML}`;
        }

        if (document.getElementById(exName)) {
            var button = document.getElementById(exName);
            button.addEventListener("click", async () => {
                let webpage = await fetch(chrome.runtime.getURL(exName + "/settings.html")).then((re) => { if (re.ok) { return re.text(); } else { return null; } });
                if (webpage) {
                    // Edit Webpage Contents
                    webpage = webpage
                        .replaceAll('<script src="settings.js"></script>', '<script class="reexecute" src="running_settings.js"></script>')
                        .replaceAll('<script src="setting_colors.js"></script>', '<script class="reexecute" src="' + exName + "/setting_colors.js" + '"></script>')
                        .replaceAll('<script src="reset_cache.js"></script>', '<script class="reexecute" src="' + exName + "/reset_cache.js" + '"></script>')
                        .replaceAll("</meta>", "");
                    webpage = webpage.replaceAll('<span class="gradient-border"><button type=\'submit\' id="submitbutton" class="center">__MSG_settingsSaveBtn__</button></span><br><br>', '<span class="gradient-border"><button type=\'submit\' id="submitbutton" class="center">__MSG_settingsSaveBtn__</button></span> <span class="gradient-border"><button type="submit" id="goBackToBundledPage">__MSG_settingsGoBackBtn__</button></span><br><br>');

                    // Run HTML
                    var newElement = new DOMParser().parseFromString(webpage, "text/html");
                    document.extensionName = exName;
                    document.head.innerHTML = newElement.head.innerHTML;
                    document.body.innerHTML = newElement.body.innerHTML;
                    await localizeAll();

                    // Execute Runners
                    var classes = document.getElementsByClassName("reexecute");
                    var con_classes = Array.prototype.slice.call(classes);
                    var r = false;
                    await loopThroughArrayAsync(con_classes, async (i, v) => {
                        var src = v.src;
                        var s;
                        s = document.createElement('script');
                        s.type = 'text/javascript';
                        s.src = src;
                        s.onload = s.onreadystatechange = function () {
                            if (!r && (!this.readyState || this.readyState == 'complete')) {
                                r = true;
                                setTimeout(() => { window.dispatchEvent(new Event("load")); }, 200);
                            }
                        };
                        document.body.appendChild(s);
                        v.remove();
                    });

                    // Set Go Back Page
                    if (document.getElementById("goBackToBundledPage")) {
                        var button2 = document.getElementById("goBackToBundledPage");
                        button2.addEventListener("click", async () => {
                            var changes_are_made = false;
                            await loopThroughArrayAsync(changes_made, (_, v) => { if (v == true) { changes_are_made = true; } });
                            if ((changes_are_made == true && confirm(getTran("settingsGoBackConfirmation"))) || changes_are_made == false) {
                                document.body.innerHTML = innerBody;
                                document.head.innerHTML = innerHead;
                                await localizeAll();
                                setTimeout(() => { loadChanges2(); }, 200);
                            }
                        });
                    }
                } else {
                    console.warn("Unable to fetch webpage!!");
                }
            });
        }
    });

    if (navigator.onLine == false) {
        /* User is offline */
        document.getElementById("extens_vers").innerText = `${document.getElementById("extens_vers").innerText} | ${getTran("settingsNetworkOffline")}`;
        document.getElementById("css").innerText = `${document.getElementById("css").innerText}
        body {
            font-family: arial !important;
            color: white;
            overflow: hidden;
            background-color: #000000;
        }
        `;
    }

    if (system_settings["browserMode"] == "chrome") {
        if (system_settings["chromeWebstoreLinkEnabled"] == true) {
            if (chrome.runtime.id == system_settings["uploadedChromeExtensionID"]) {
                /* User is using the Chrome Web Store */
                document.getElementById("extensionLink").href = `https://chromewebstore.google.com/detail/extension/${chrome.runtime.id}`;
            } else if (system_settings["uploadedChromeExtensionID"]) {
                /* User used an extracted zip file of the extension instead of using the Chrome Web Store */
                document.getElementById("extensionLink").href = `https://chromewebstore.google.com/detail/extension/${system_settings["uploadedChromeExtensionID"]}`;
                document.getElementById("extens_vers").innerText = `${document.getElementById("extens_vers").innerText} | ${getTran("settingsUnpacked")}`;
            }
            document.getElementById("extensionLink").style = "";
        } else {
            document.getElementById("extensionLink").remove();
        }
    } else if (system_settings["browserMode"] == "firefox") {
        if (system_settings["firefoxWebstoreLinkEnabled"] == true) {
            if (chrome.runtime.id == system_settings["uploadedFirefoxExtensionID"]) {
                /* User is using the Firefox Add-on Store */
                document.getElementById("extensionLink").href = `https://addons.mozilla.org/en-US/firefox/addon/${chrome.runtime.id}`;
            } else if (system_settings["uploadedChromeExtensionID"]) {
                /* User used an extracted zip file of the extension instead of using the Firefox Add-on Store */
                document.getElementById("extensionLink").href = `https://addons.mozilla.org/en-US/firefox/addon/${system_settings["uploadedFirefoxExtensionID"]}`;
                document.getElementById("extens_vers").innerText = `${document.getElementById("extens_vers").innerText} | ${getTran("settingsUnpacked")}`;
            }
            document.getElementById("extensionLink").children[0].src = "https://cdn.efaz.dev/png/firefox_addons.png";
            document.getElementById("extensionLink").children[0].title = getTran("firefoxAddons");
            document.getElementById("extensionLink").style = "";
        } else {
            document.getElementById("extensionLink").remove();
        }
    }

    if (system_settings["scanForManifestUpdates"] == true) {
        if (navigator.onLine == true) {
            /* Update check */
            fetch(system_settings["onlineManifestFile"]).then(r => {
                if (r.ok) {
                    return r.json();
                }
            }).then(j => {
                if (j) {
                    if (system_settings["isVersionServer"] == true) {
                        var compared = compareVersions(man_json["version"], j[system_settings["name"]]);
                        if (j[system_settings["name"]] == man_json["version"]) {
                            /* User is running the latest non-beta version. */
                            console.log("This user is currently at the latest version!");
                        } else if (compared == -1) {
                            /* User has an update available */
                            document.getElementById("extens_vers").innerHTML = `${document.getElementById("extens_vers").innerHTML} | <button id="openChromeExtensionSettings">${getTran("settingsUpdateAvailable")} v${j[system_settings["name"]]}!</button>`;
                            document.getElementById("openChromeExtensionSettings").addEventListener("click", () => {
                                if (system_settings["browserMode"] == "chrome") {
                                    if (system_settings["chromeWebstoreLinkEnabled"] == true && !(chrome.runtime.id == system_settings["uploadedChromeExtensionID"])) {
                                        chrome.tabs.create({ url: `https://chromewebstore.google.com/detail/extension/${system_settings["uploadedChromeExtensionID"]}` });
                                    } else {
                                        chrome.tabs.create({ url: "chrome://extensions/" });
                                    }
                                } else if (system_settings["browserMode"] == "firefox") {
                                    if (system_settings["firefoxWebstoreLinkEnabled"] == true && !(chrome.runtime.id == system_settings["uploadedFirefoxExtensionID"])) {
                                        chrome.tabs.create({ url: `https://addons.mozilla.org/en-US/firefox/addon/${system_settings["uploadedFirefoxExtensionID"]}` });
                                    } else {
                                        chrome.tabs.create({ url: "about:debugging#/runtime/this-firefox" });
                                    }
                                }
                            });
                            console.log(`New version found! v${man_json["version"]} > v${j[system_settings["name"]]}`);
                        } else {
                            /* User is running beta version of the extension */
                            document.getElementById("extens_vers").innerText = `v${man_json["version"]} ${getTran("settingsBeta")}`;
                            console.log(`User is in beta version of the extension!`);
                        }
                    } else {
                        var compared = compareVersions(man_json["version"], j["version"]);
                        if (j["version"] == man_json["version"]) {
                            /* User is running the latest non-beta version. */
                            console.log("This user is currently at the latest version!");
                        } else if (compared == -1) {
                            /* User has an update available */
                            document.getElementById("extens_vers").innerText = `${document.getElementById("extens_vers").innerText} | <button id="openChromeExtensionSettings">${getTran("settingsUpdateAvailable")} v${j["version"]}!</button>`;
                            document.getElementById("openChromeExtensionSettings").addEventListener("click", () => {
                                if (system_settings["browserMode"] == "chrome") {
                                    if (system_settings["chromeWebstoreLinkEnabled"] == true && !(chrome.runtime.id == system_settings["uploadedChromeExtensionID"])) {
                                        chrome.tabs.create({ url: `https://chromewebstore.google.com/detail/extension/${system_settings["uploadedChromeExtensionID"]}` });
                                    } else {
                                        chrome.tabs.create({ url: "chrome://extensions/" });
                                    }
                                } else if (system_settings["browserMode"] == "firefox") {
                                    if (system_settings["firefoxWebstoreLinkEnabled"] == true && !(chrome.runtime.id == system_settings["uploadedFirefoxExtensionID"])) {
                                        chrome.tabs.create({ url: `https://addons.mozilla.org/en-US/firefox/addon/${system_settings["uploadedFirefoxExtensionID"]}` });
                                    } else {
                                        chrome.tabs.create({ url: "about:debugging#/runtime/this-firefox" });
                                    }
                                }
                            });
                            console.log(`New version found! v${man_json["version"]} > v${j["version"]}`);
                        } else {
                            /* User is running beta version of the extension */
                            document.getElementById("extens_vers").innerText = `v${man_json["version"]} ${getTran("settingsBeta")}`;
                            console.log(`User is in beta version of the extension!`);
                        }
                    }
                }
            });
        }
    }
}

window.onload = function () {
    innerBody = document.body.innerHTML;
    innerHead = document.head.innerHTML;
    loadChanges2();
};