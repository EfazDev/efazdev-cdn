/* 

Efaz's Roblox Extension
By: EfazDev

running_setting.js:
    - Handle setting configurations from mini extensions
    - Save data to Chrome Storage API

*/

var storage = chrome.storage.sync
var system_settings = {}
var changes_made = {}

async function loopThroughArrayAsync(array, callback) {
    if (typeof (array) == "object") {
        if (Array.isArray(array)) {
            for (let a = 0; a < array.length; a++) {
                await callback(a, array[a])
            }
        } else {
            let generated_keys = Object.keys(array);
            for (let a = 0; a < generated_keys.length; a++) {
                await callback(generated_keys[a], array[generated_keys[a]])
            }
        }
    }
}

function loopThroughArray(array, callback) {
    if (typeof (array) == "object") {
        if (Array.isArray(array)) {
            for (let a = 0; a < array.length; a++) {
                callback(a, array[a])
            }
        } else {
            let generated_keys = Object.keys(array);
            for (let a = 0; a < generated_keys.length; a++) {
                callback(generated_keys[a], array[key])
            }
        }
    }
}

async function getImageFromInput(input) {
    var files = input.files[0];
    if (files) {
        return new Promise((resolve, reject) => {
            var fileReader = new FileReader();
            fileReader.readAsDataURL(files);
            fileReader.onload = function (event) {
                const img = new Image();
                img.src = event.target.result;
                img.onload = function () {
                    const canvas = document.createElement("canvas");
                    const ctx = canvas.getContext("2d");
                    canvas.width = 300;
                    canvas.height = 300;
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                    resolve(canvas.toDataURL("image/jpeg", 0.8));
                };
                img.onerror = reject;
            };
        })
    } else {
        return new Promise((resolve, reject) => {
            resolve(null)
        })
    }
}

async function saveData() {
    storage.get([system_settings["name"]], async function (items) {
        if (!(items[system_settings["name"]])) {
            items[system_settings["name"]] = {}
        }
        await loopThroughArrayAsync(system_settings["settings"], async (key, val) => {
            if (val["type"] == "checkbox") {
                items[system_settings["name"]][key] = document.getElementById(key).checked
            } else if (val["type"] == "file") {
                try {
                    var res_file = await getImageFromInput(document.getElementById(key))
                    if (res_file) {
                        items[system_settings["name"]][key] = res_file
                        items[system_settings["name"]][key + "_filename"] = document.getElementById(key).files[0].name
                    } else if (document.getElementById(key).getAttribute("file_url")) {
                        items[system_settings["name"]][key] = document.getElementById(key).getAttribute("file_url")
                    } else {
                        items[system_settings["name"]][key] = null
                        items[system_settings["name"]][key + "_filename"] = null
                    }
                } catch (err) {
                    console.warn("Unable to save image!" + err.toString())
                }
            } else {
                items[system_settings["name"]][key] = document.getElementById(key).value
            }
        });
        await storage.set(items, () => {
            alert("Saved data!")
        });
        changes_made = {}
    });
}

function compareVersions(version1, version2) {
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

async function loadChanges() {
    fetch(chrome.runtime.getURL(document.extensionName + "/settings.json")).then(setting_res => {
        return setting_res.json()
    }).then(async (settings) => {
        system_settings = settings
        if (system_settings["typeOfStorage"]) {
            storage = chrome.storage[system_settings["typeOfStorage"]]
        }
        await storage.get(system_settings["name"]).then(async (items) => {
            if (Object.keys(system_settings["settings"]).length == 1) {
                document.getElementById("extensionSettings").remove()
            } else {
                await loopThroughArrayAsync(system_settings["settings"], async (key, val) => {
                    if (document.getElementById(key) == null) {
                        var gene_lis = ""
                        if (val["extraArguments"]) {
                            await loopThroughArrayAsync(val["extraArguments"], async (i, v) => {
                                gene_lis = `${gene_lis} ${i}="${v}"`
                            })
                        }
                        var generated_html_element = `<label for="${key}" id="${key}_label">${val["text"]}: <input type="${val["type"]}" id="${key}" name="${key}"${gene_lis}>`
                        var beforeElement = document.getElementById("reviewDetails")
                        if (val["hidden"] == true && !(window.location.href.includes("resize=true"))) {
                            generated_html_element = `<label style="display: none;" for="${key}" id="${key}_label">${val["text"]}: <input type="${val["type"]}" id="${key}" name="${key}"${gene_lis}>`
                        } else {
                            if (val["alternateFileInput"] == true && val["type"] == "file") {
                                generated_html_element = `<label for="${key}" id="${key}_label">${val["text"]}: <input type="${val["type"]}" style="display: none;" id="${key}" name="${key}"${gene_lis}><button id="${key}_triggerButton">No file selected</button>`
                            }
                            if (val["reset"] == true) {
                                generated_html_element = `${generated_html_element} <button id="reset_${key}">Reset!</button>`
                            } else {
                                generated_html_element = `${generated_html_element}`
                            }
                        }
                        generated_html_element = `${generated_html_element}<br></label>`
                        beforeElement.outerHTML = `${generated_html_element}${document.getElementById("reviewDetails").outerHTML}`
                    }
                    var selected = val["default"]
                    if (items[system_settings["name"]]) {
                        if (!(typeof (items[system_settings["name"]][key]) == "undefined")) {
                            selected = items[system_settings["name"]][key]
                        }
                    }
                    if (!(typeof (selected) == "undefined")) {
                        if (document.getElementById(key)) {
                            var main_selection = document.getElementById(key)
                            if (val["type"] == "checkbox") {
                                main_selection.checked = selected
                            } else if (val["type"] == "file") {
                                main_selection.setAttribute("file_url", selected)
                            } else {
                                main_selection.value = selected
                            }
                            main_selection.addEventListener("change", () => {
                                if ((val["type"] == "checkbox" && !(main_selection.checked == selected)) || (val["type"] == "file" && !(main_selection.getAttribute("file_url"))) || !(main_selection.value == selected)) {
                                    changes_made[key] = true
                                } else {
                                    changes_made[key] = false
                                }
                            })
                        }
                    }
                    var main_selection = document.getElementById(key)
                    if (val["neededSettings"]) {
                        loopThroughArrayAsync(val["neededSettings"], async (i, v) => {
                            let k = document.getElementById(v)
                            let can_hide = false;
                            if (k) {
                                let filled = false
                                if (system_settings["settings"][v]["type"] == "checkbox") {
                                    filled = k.checked
                                } else if (system_settings["settings"][v]["type"] == "file") {
                                    filled = k.getAttribute("file_url")
                                } else {
                                    filled = k.value
                                }
                                if (!(filled)) {
                                    can_hide = true
                                }
                            }
                            if (can_hide == true) {
                                if (!(val["neededSettings"].length == 0)) {
                                    document.getElementById(key + "_label").style = "display: none;"
                                }
                            }
                        })
                    }
                    main_selection.addEventListener("change", () => {
                        loopThroughArrayAsync(system_settings["settings"], async (i, v) => {
                            if (v && v["neededSettings"]) {
                                let q = document.getElementById(i + "_label");
                                if (q) {
                                    let can_hide = false;
                                    await loopThroughArrayAsync(v["neededSettings"], async (q, e) => {
                                        let k = document.getElementById(e)
                                        if (k) {
                                            let filled = false
                                            if (system_settings["settings"][e]["type"] == "checkbox") {
                                                filled = k.checked
                                            } else if (system_settings["settings"][e]["type"] == "file") {
                                                filled = k.getAttribute("file_url")
                                            } else {
                                                filled = k.value
                                            }
                                            if (!(filled)) {
                                                can_hide = true
                                            }
                                        }
                                    })
                                    if (can_hide == true) {
                                        q.style = "display: none;";
                                    } else {
                                        q.style = "";
                                    }
                                }
                            }
                        })
                    })
                    if (val["alternateFileInput"] == true && val["type"] == "file") {
                        if (document.getElementById(`${key}_triggerButton`)) {
                            let button = document.getElementById(`${key}_triggerButton`)
                            button.addEventListener("click", () => {
                                main_selection.click()
                            })
                            main_selection.addEventListener("change", () => {
                                if (main_selection.files.length > 0) {
                                    button.textContent = main_selection.files[0].name;
                                } else {
                                    if (items[system_settings["name"]][key + "_filename"]) {
                                        button.textContent = items[system_settings["name"]][key + "_filename"];
                                    } else {
                                        button.textContent = "No file selected";
                                    }
                                }
                            })
                            if (items[system_settings["name"]] && items[system_settings["name"]][key + "_filename"]) {
                                button.textContent = items[system_settings["name"]][key + "_filename"];
                            }
                        }
                    }
                    if (val["reset"] == true) {
                        if (document.getElementById(`reset_${key}`)) {
                            let button = document.getElementById(`reset_${key}`)
                            button.addEventListener("click", () => {
                                var main_selection = document.getElementById(key)
                                if (val["type"] == "checkbox") {
                                    main_selection.checked = val["default"]
                                } else if (val["type"] == "file") {
                                    if (!(items[system_settings["name"]])) { items[system_settings["name"]] = {} }
                                    items[system_settings["name"]][key + "_filename"] = null
                                    main_selection.value = val["default"]
                                    main_selection.setAttribute("file_url", val["default"])
                                    main_selection.dispatchEvent(new Event("change"))
                                } else {
                                    main_selection.value = val["default"]
                                }
                                if ((val["type"] == "checkbox" && !(main_selection.checked == selected)) || !(main_selection.value == selected)) {
                                    changes_made[key] = true
                                } else {
                                    changes_made[key] = false
                                }
                            })
                        }
                    }
                })
                changes_made = {}
            }
        });
        const submitButton = document.getElementById("submitbutton");
        submitButton.addEventListener("click", saveData);

        fetch(chrome.runtime.getURL(document.extensionName + "/org_manifest.json")).then(man_res => {
            return man_res.json()
        }).then(man_json => {
            /* Fulfill basic manifest details */
            var extension_name = man_json["name"]
            var extension_version = man_json["version"]
            var extension_icon = man_json["icons"]["32"]

            document.getElementById("extens_name").innerHTML = `Extension Name: ${extension_name} ${`<img src="${document.extensionName}/${extension_icon}" height="16" width="16" style="vertical-align: middle;">`}`
            document.getElementById("extens_vers").innerHTML = `v${extension_version}`
            document.getElementById("window_title").innerText = `${extension_name} Settings`

            if (window.location.href.includes("resize=true")) {
                /* User came from Thank you page */
                document.getElementById("css").innerHTML = `
                p, label, em {
                    font-size: medium;
                    text-align: center;
                    display: block;
                }
                h1 {
                    font-size: xx-large;
                    margin: 0;
                }
                h3 {
                    font-size: large;
                    margin: 6px;
                    text-align: center;
                }
                label {
                    font-size: 14px;
                }
                br {
                    line-height: 4px;
                }
                li {
                    display: inline-block;
                    height: 24px;
                    width: 24px;
                    padding: 10px;
                }
                .resize-img {
                    height: 24px;
                    width: 24px;
                }
                ul {
                    padding-left: 0;
                    display: flex !important;
                    justify-content: center;
                }
        
                button {
                    border: 1px solid white;
                    border-radius: 8px;
                    background-color: #00b1ff;
                    color: rgb(255, 255, 255);
                    font-family: mainfont;
                }
        
                input {
                    border: 1px solid white;
                    border-collapse: collapse;
                    text-align: center;
                    margin-left: auto;
                    border-radius: 8px;
                    background-color: #00b1ff;
                    color: rgb(255, 255, 255);
                    vertical-align: middle;
                    justify-content: center;
                    font-family: mainfont;
                    margin-right: auto;
                }
        
                a {
                    color: #4295f5;
                }
                `
            }

            if (navigator.onLine && window.location.href.includes("resize=true")) {
                /* User is online and came from Thank you page */
                const style = document.createElement("link")
                style.id = "resize-to-full-screen";
                style.rel = "stylesheet";
                style.type = "text/css";
                style.media = "all";
                style.href = "https://cdn.efaz.dev/cdn/styles/htmlUI.css"
                document.head.append(style)
            } else if (navigator.onLine == false && (window.location.href.includes("resize=true"))) {
                /* User is offline and came from Thank you page */
                document.getElementById("extens_vers").innerHTML = `${document.getElementById("extens_vers").innerHTML} | Network Offline`
                document.getElementById("css").innerHTML = `${document.getElementById("css").innerHTML}
        /* This stylesheet is exported for when your computer has no internet. */

        @media (prefers-color-scheme: light) {
            body {
                min-height: 100%;
                min-width: 100%;
                background: linear-gradient(60deg, #ff4b00 0%, #dbdb00 40%, #00ce00 60%, #00aad0 100%);
                background-repeat: repeat-y !important;
                background-blend-mode: normal !important;
                background-size: 100vw 100vh;
                min-height: 100vh;
                font-family: mainfont;
                background-repeat: no-repeat;
                background-attachment: fixed;
                color: white;
            }
        }

        @media (prefers-color-scheme: dark) {
            body {
                min-height: 100%;
                min-width: 100%;
                background: linear-gradient(60deg, #4e1700 0%, #4e4e00 40%, #004200 60%, #003d4b 100%);
                background-repeat: repeat-y !important;
                background-blend-mode: normal !important;
                background-size: 100vw 100vh;
                min-height: 100vh;
                font-family: mainfont;
                background-repeat: no-repeat;
                background-attachment: fixed;
                color: white;
            }
        }
        p,
        h1,
        h2,
        h3,
        label {
            text-align: center;
            margin: 0;
        }

        .center {
            display: block;
            margin-left: auto;
            margin-right: auto;
        }

        button {
            border: 1px solid white;
            border-collapse: collapse;
            text-align: center;
            margin-left: auto;
            border-radius: 8px;
            background-color: #00b1ff;
            color: rgb(255, 255, 255);
            vertical-align: middle;
            justify-content: center;
            font-family: arial;
            margin-right: auto;
        }
        html {
            width: 100%;
            height: 100%
        }
        div {
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            vertical-align: middle;
            position: fixed;
        
            margin: 0;
            position: absolute;
            top: 50%;
            left: 50%;
            -ms-transform: translate(-50%, -50%);
            transform: translate(-50%, -50%);
        }

        /* This stylesheet is exported for when your computer has no internet. */
                `
            } else if (navigator.onLine == false) {
                /* User is offline */
                document.getElementById("extens_vers").innerHTML = `${document.getElementById("extens_vers").innerHTML} | Network Offline`
                document.getElementById("css").innerHTML = `${document.getElementById("css").innerHTML}
                body {
                    font-family: arial !important;
                    color: white;
                    overflow: hidden;
                }
                `
            }

            if (system_settings["chromeWebstoreLinkEnabled"] == true) {
                if (chrome.runtime.id == system_settings["uploadedChromeExtensionID"]) {
                    /* User is using the Chrome Web Store */
                    document.getElementById("extensionLink").href = `https://chromewebstore.google.com/detail/extension/${chrome.runtime.id}`
                } else if (system_settings["uploadedChromeExtensionID"]) {
                    /* User used an extracted zip file of the extension instead of using the Chrome Web Store */
                    document.getElementById("extensionLink").href = `https://chromewebstore.google.com/detail/extension/${system_settings["uploadedChromeExtensionID"]}`
                    // document.getElementById("extens_vers").innerHTML = `${document.getElementById("extens_vers").innerHTML} | Unpacked`
                }

                document.getElementById("extensionLink").style = ""
            } else {
                document.getElementById("extensionLink").remove()
            }

            if (settings["scanForManifestUpdates"] == true) {
                if (navigator.onLine == true) {
                    /* Update check */
                    fetch(system_settings["onlineManifestFile"]).then(r => {
                        if (r.ok) {
                            return r.json()
                        }
                    }).then(j => {
                        if (j) {
                            if (settings["isVersionServer"] == true) {
                                var compared = compareVersions(man_json["version"], j[settings["name"]])
                                if (j[settings["name"]] == man_json["version"]) {
                                    /* User is running the latest non-beta version. */
                                    console.log("This user is currently at the latest version!")
                                } else if (compared == -1) {
                                    /* User has an update available */
                                    document.getElementById("extens_vers").innerHTML = `${document.getElementById("extens_vers").innerHTML} | <button id="openChromeExtensionSettings">Update Available to v${j[settings["name"]]}!</button>`
                                    document.getElementById("openChromeExtensionSettings").addEventListener("click", () => {
                                        if (system_settings["chromeWebstoreLinkEnabled"] == true && !(chrome.runtime.id == system_settings["uploadedChromeExtensionID"])) {
                                            chrome.tabs.create({ url: `https://chromewebstore.google.com/detail/extension/${system_settings["uploadedChromeExtensionID"]}` });
                                        } else {
                                            chrome.tabs.create({ url: "chrome://extensions/" });
                                        }
                                    });
                                    console.log(`New version found! v${man_json["version"]} > v${j[settings["name"]]}`)
                                } else {
                                    /* User is running beta version of the extension */
                                    document.getElementById("extens_vers").innerHTML = `v${extension_version} Beta`
                                    console.log(`User is in beta version of the extension!`)
                                }
                            } else {
                                var compared = compareVersions(man_json["version"], j["version"])
                                if (j["version"] == man_json["version"]) {
                                    /* User is running the latest non-beta version. */
                                    console.log("This user is currently at the latest version!")
                                } else if (compared == -1) {
                                    /* User has an update available */
                                    document.getElementById("extens_vers").innerHTML = `${document.getElementById("extens_vers").innerHTML} | <button id="openChromeExtensionSettings">Update Available to v${j["version"]}!</button>`
                                    document.getElementById("openChromeExtensionSettings").addEventListener("click", () => {
                                        if (system_settings["chromeWebstoreLinkEnabled"] == true && !(chrome.runtime.id == system_settings["uploadedChromeExtensionID"])) {
                                            chrome.tabs.create({ url: `https://chromewebstore.google.com/detail/extension/${system_settings["uploadedChromeExtensionID"]}` });
                                        } else {
                                            chrome.tabs.create({ url: "chrome://extensions/" });
                                        }
                                    });
                                    console.log(`New version found! v${man_json["version"]} > v${j["version"]}`)
                                } else {
                                    /* User is running beta version of the extension */
                                    document.getElementById("extens_vers").innerHTML = `v${extension_version} Beta`
                                    console.log(`User is in beta version of the extension!`)
                                }
                            }
                        }
                    })
                }
            }
        })
    })
}

window.onload = loadChanges