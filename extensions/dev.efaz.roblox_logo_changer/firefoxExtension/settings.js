/* 

Efaz's Extension Settings Handler
By: EfazDev

settings.js:
    - Handle setting configurations in settings.html
    - Save data to Chrome Storage API

*/

let storage = chrome.storage.sync;
let system_settings = {};

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

function loopThroughArray(array, callback) {
    if (Array.isArray(array)) {
        for (let a = 0; a < array.length; a++) {
            callback(a, array[a]);
        }
    } else if (array && typeof array === "object") {
        for (const a of Object.keys(array)) {
            callback(a, array[a]);
        }
    }
}

async function getImageFromInput(input) {
    const file = input.files[0];
    if (!file) return null;

    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");
                const aspectRatio = img.width / img.height;
                const maxRes = system_settings.customExportPhotoRes || 300;
                let targetWidth = maxRes;
                let targetHeight = maxRes / aspectRatio;
                if (targetHeight > maxRes) {
                    targetHeight = maxRes;
                    targetWidth = maxRes * aspectRatio;
                }
                canvas.width = targetWidth;
                canvas.height = targetHeight;
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                const fileType = system_settings.customExportFileType || "image/jpeg";
                resolve(canvas.toDataURL(fileType, 0.8));
            };
            img.onerror = reject;
            img.src = event.target.result;
        };
        fileReader.onerror = reject;
        fileReader.readAsDataURL(file);
    });
}

async function saveData() {
    storage.get([system_settings.name], async (items) => {
        const config = items[system_settings.name] || {};
        for (const [key, val] of Object.entries(system_settings.settings)) {
            const el = document.getElementById(key);
            if (!el) continue;
            if (val.type === "checkbox") {
                config[key] = el.checked;
            } else if (val.type === "file") {
                try {
                    const res_file = await getImageFromInput(el);
                    if (res_file) {
                        config[key] = res_file;
                        config[`${key}_filename`] = el.files[0].name;
                    } else if (el.getAttribute("file_url")) {
                        config[key] = el.getAttribute("file_url");
                    } else {
                        config[`${key}_filename`] = null;
                    }
                } catch (err) {
                    console.warn("Unable to save image!", err);
                }
            } else {
                config[key] = el.value;
            }
        }
        items[system_settings.name] = config;
        storage.set(items, () => alert(chrome.i18n.getMessage("settingsSavedData")));
    });
}

function compareVersions(v1, v2) {
    if (!v1 || !v2) return 0;
    const parts1 = v1.split(".").map(Number);
    const parts2 = v2.split(".").map(Number);
    const maxLength = Math.max(parts1.length, parts2.length);
    for (let i = 0; i < maxLength; i++) {
        const num1 = parts1[i] || 0;
        const num2 = parts2[i] || 0;
        if (num1 > num2) return 1;
        if (num1 < num2) return -1;
    }
    return 0;
}

function getTran(id) {
    const name = system_settings.name?.replaceAll(".", "_") || "";
    const nameScoped = chrome.i18n.getMessage(`${name}_${id}`);
    if (nameScoped) return nameScoped;
    return chrome.i18n.getMessage(id.replaceAll(".", "_"));
}

async function localizeAll(data) {
    const replacer = (_, v1) => v1 ? chrome.i18n.getMessage(v1) : "";
    if (data) {
        if (Array.isArray(data)) {
            return data.map(v => typeof v === "string" ? v.replace(/__MSG_(\w+)__/g, replacer) : v);
        }
        return data;
    }
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
    let node;
    while ((node = walker.nextNode())) {
        const text = node.nodeValue;
        if (text && text.includes("__MSG_")) {
            node.nodeValue = text.replace(/__MSG_(\w+)__/g, replacer);
        }
    }
}

async function loadChanges() {
    await localizeAll();
    try {
        const setting_res = await fetch("settings.json");
        system_settings = await setting_res.json();
    } catch (e) {
        console.error("Failed to load settings.json", e);
        return;
    }
    if (system_settings.typeOfStorage) {
        storage = chrome.storage[system_settings.typeOfStorage];
    }
    storage.get([system_settings["name"]], function (items) {
        const storedConfig = items[system_settings.name] || {};
        const settingsKeys = Object.entries(system_settings.settings);
        if (settingsKeys.length === 1 && document.getElementById("extensionSettings")) {
            document.getElementById("extensionSettings").remove();
        } else {
            const beforeElement = document.getElementById("reviewDetails");
            for (const [key, val] of settingsKeys) {
                if (!document.getElementById(key)) {
                    let extraArgs = val.extraArguments 
                        ? Object.entries(val.extraArguments).map(([i, v]) => ` ${i}="${v}"`).join('') 
                        : "";
                    let html = "";
                    const isHidden = val.hidden === true && !window.location.href.includes("resize=true");
                    const displayStyle = isHidden ? 'style="display: none;"' : '';
                    html += `<label ${displayStyle} for="${key}" id="${key}_label">${getTran(key + "_mes")}: `;
                    if (!isHidden && val.alternateFileInput && val.type === "file") {
                        html += `<input type="${val.type}" style="display: none;" id="${key}" name="${key}"${extraArgs}>`;
                        html += `<button id="${key}_triggerButton">${getTran("settingsNoFileSelected")}</button>`;
                    } else {
                        html += `<input type="${val.type}" id="${key}" name="${key}"${extraArgs}>`;
                    }
                    if (!isHidden && val.reset) {
                        html += ` <button id="reset_${key}">${getTran("settingsReset")}</button>`;
                    }
                    html += `</label><br>`;
                    if (beforeElement) beforeElement.insertAdjacentHTML('beforebegin', html);
                }
                const main_selection = document.getElementById(key);
                if (!main_selection) continue;
                let selected = storedConfig[key] ?? getTran(key + "_default") ?? val.default;
                if (val.type === "checkbox") {
                    main_selection.checked = selected;
                } else if (val.type === "file") {
                    main_selection.setAttribute("file_url", selected);
                } else {
                    main_selection.value = selected;
                }
                main_selection.addEventListener("change", () => {
                    for (const [depKey, depVal] of Object.entries(system_settings.settings)) {
                        if (depVal?.neededSettings) {
                            const label = document.getElementById(`${depKey}_label`);
                            if (!label) continue;
                            const shouldHide = depVal.neededSettings.some(neededKey => {
                                const k = document.getElementById(neededKey);
                                if (!k) return false;
                                const type = system_settings.settings[neededKey].type;
                                const isFilled = type === "checkbox" ? k.checked : type === "file" ? k.getAttribute("file_url") : k.value;
                                return !isFilled;
                            });
                            label.style.display = shouldHide ? "none" : "";
                        }
                    }
                });
                if (val.alternateFileInput && val.type === "file") {
                    const button = document.getElementById(`${key}_triggerButton`);
                    if (button) {
                        button.addEventListener("click", () => main_selection.click());
                        main_selection.addEventListener("change", () => {
                            button.textContent = main_selection.files.length > 0 ? main_selection.files[0].name : getTran("settingsNoFileSelected");
                        });
                        if (storedConfig[`${key}_filename`]) {
                            button.textContent = storedConfig[`${key}_filename`];
                        }
                    }
                }
                if (val.reset) {
                    const resetBtn = document.getElementById(`reset_${key}`);
                    if (resetBtn) {
                        resetBtn.addEventListener("click", () => {
                            if (val.type === "checkbox") {
                                main_selection.checked = val.default;
                            } else if (val.type === "file") {
                                storedConfig[`${key}_filename`] = null;
                                main_selection.value = val.default;
                                main_selection.setAttribute("file_url", val.default);
                                main_selection.dispatchEvent(new Event("change"));
                            } else {
                                main_selection.value = getTran(key + "_default") ?? val.default;
                            }
                        });
                    }
                }
            }
            if (settingsKeys.length > 0) {
                document.getElementById(settingsKeys[0][0])?.dispatchEvent(new Event("change"));
            }
        }
    });
    document.getElementById("submitbutton")?.addEventListener("click", saveData);

    /* Fulfill basic manifest details */
    const man_json = chrome.runtime.getManifest();
    const extension_name = chrome.i18n.getMessage("name") || man_json.name;
    const extension_version = man_json.version;
    const extension_icon = man_json.icons?.["32"] || "";
    localizeAll(man_json);

    const extensNameEl = document.getElementById("extens_name");
    if (extensNameEl) extensNameEl.innerHTML = `${getTran("settingsExName")} ${extension_name} <img src="${extension_icon}" height="16" width="16" style="vertical-align: middle;">`;
    const extensVersEl = document.getElementById("extens_vers");
    if (extensVersEl) extensVersEl.innerText = `v${extension_version}`;
    const windowTitleEl = document.getElementById("window_title");
    if (windowTitleEl) windowTitleEl.innerText = `${extension_name} ${getTran("settings")}`;

    if (!navigator.onLine) {
        if (extensVersEl) extensVersEl.innerText += ` | ${getTran("settingsNetworkOffline")}`;
        const cssEl = document.getElementById("css");
        if (cssEl) {
            cssEl.innerText += `\nbody { font-family: arial !important; color: white; overflow: hidden; background-color: #000000; }`;
        }
    }

    const extLinkEl = document.getElementById("extensionLink");
    if (extLinkEl) {
        const isChrome = system_settings.browserMode === "chrome";
        const isFirefox = system_settings.browserMode === "firefox";
        if (isChrome && system_settings.chromeWebstoreLinkEnabled) {
            const idToUse = (chrome.runtime.id === system_settings.uploadedChromeExtensionID) ? chrome.runtime.id : system_settings.uploadedChromeExtensionID;
            extLinkEl.href = `https://chromewebstore.google.com/detail/extension/${idToUse}`;
            extLinkEl.style.display = "";
            if (idToUse !== chrome.runtime.id && extensVersEl) extensVersEl.innerText += ` | ${getTran("settingsUnpacked")}`;
        } else if (isFirefox && system_settings.firefoxWebstoreLinkEnabled) {
            const idToUse = (chrome.runtime.id === system_settings.uploadedFirefoxExtensionID) ? chrome.runtime.id : system_settings.uploadedFirefoxExtensionID;
            extLinkEl.href = `https://addons.mozilla.org/en-US/firefox/addon/${idToUse}`;
            extLinkEl.children[0].src = "https://cdn.efaz.dev/png/firefox_addons.png";
            extLinkEl.children[0].title = getTran("firefoxAddons");
            extLinkEl.style.display = "";
            if (idToUse !== chrome.runtime.id && extensVersEl) extensVersEl.innerText += ` | ${getTran("settingsUnpacked")}`;
        } else {
            extLinkEl.remove();
        }
    }

    if (system_settings.scanForManifestUpdates && navigator.onLine) {
        try {
            const r = await fetch(system_settings.onlineManifestFile);
            if (r.ok) {
                const j = await r.json();
                const targetVersion = system_settings.isVersionServer ? j[system_settings.name] : j.version;
                const compared = compareVersions(extension_version, targetVersion);
                if (compared === -1 && extensVersEl) {
                    extensVersEl.innerHTML += ` | <button id="openChromeExtensionSettings">${getTran("settingsUpdateAvailable")} v${targetVersion}!</button>`;
                    document.getElementById("openChromeExtensionSettings").addEventListener("click", () => {
                        const mode = system_settings.browserMode;
                        if (mode === "chrome") {
                            const url = (system_settings.chromeWebstoreLinkEnabled && chrome.runtime.id !== system_settings.uploadedChromeExtensionID) ? `https://chromewebstore.google.com/detail/extension/${system_settings.uploadedChromeExtensionID}` : "chrome://extensions/";
                            chrome.tabs.create({ url });
                        } else if (mode === "firefox") {
                            const url = (system_settings.firefoxWebstoreLinkEnabled && chrome.runtime.id !== system_settings.uploadedFirefoxExtensionID) ? `https://addons.mozilla.org/en-US/firefox/addon/${system_settings.uploadedFirefoxExtensionID}` : "about:debugging#/runtime/this-firefox";
                            chrome.tabs.create({ url });
                        }
                    });
                } else if (compared === 1 && extensVersEl) {
                    extensVersEl.innerText += ` ${getTran("settingsBeta")}`;
                }
            }
        } catch (e) {
            console.warn("Update check failed", e);
        }
    }
}

window.onload = loadChanges;