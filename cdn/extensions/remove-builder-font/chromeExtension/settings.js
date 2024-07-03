/* 

Efaz's Builder Font Remover
By: EfazDev
Page: https://www.efaz.dev/remove-builder-font

settings.js:
    - Handle setting configurations in settings.html
    - Save data to Chrome Storage API

*/

const storage = chrome.storage.sync
var system_settings = {}

async function loopThroughArrayAsync(array, callback) {
    var generated_keys = Object.keys(array);
    for (a = 0; a < generated_keys.length; a++) {
        var key = generated_keys[a]
        var value = array[key]
        await callback(key, value)
    }
}

function loopThroughArray(array, callback) {
    var generated_keys = Object.keys(array);
    for (a = 0; a < generated_keys.length; a++) {
        var key = generated_keys[a]
        var value = array[key]
        callback(key, value)
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
            } else {
                items[system_settings["name"]][key] = document.getElementById(key).value
            }
        });
        await storage.set(items, () => {
            alert("Saved data!")
        });
    });
}

async function loadChanges() {
    fetch("settings.json").then(setting_res => {
        return setting_res.json()
    }).then(settings => {
        system_settings = settings
        storage.get([system_settings["name"]], function (items) {
            if (Object.keys(system_settings["settings"]).length == 1) {
                document.getElementById("extensionSettings").remove()
            } else {
                loopThroughArray(system_settings["settings"], (key, val) => {
                    if (document.getElementById(key) == null) {
                        var generated_html_element = `<label for="${key}">${val["text"]}: <input type="${val["type"]}" id="${key}" name="${key}"></label>`
                        var beforeElement = document.getElementById("reviewDetails")
                        if (val["hidden"] == true && !(window.location.href.includes("resize=true"))) {
                            generated_html_element = `<label style="display: none;" for="${key}">${val["text"]}: <input type="${val["type"]}" id="${key}" name="${key}"></label>`
                        } else {
                            if (val["reset"] == true) {
                                generated_html_element = `${generated_html_element} <button id="reset_${key}">Reset!</button>`
                            }
                            generated_html_element = `${generated_html_element}<br>`
                        }
                        beforeElement.outerHTML = `${generated_html_element}${document.getElementById("reviewDetails").outerHTML}`
                    }
                    var selected = val["default"]
                    if (items[system_settings["name"]]) {
                        if (!(typeof(items[system_settings["name"]][key]) == "undefined")) {
                            selected = items[system_settings["name"]][key]
                        }
                    }
                    if (!(typeof (selected) == "undefined")) {
                        if (document.getElementById(key)) {
                            var main_selection = document.getElementById(key)
                            if (val["type"] == "checkbox") {
                                main_selection.checked = selected
                            } else {
                                main_selection.value = selected
                            }
                        }
                    }
                    if (val["reset"] == true) {
                        if (document.getElementById(`reset_${key}`)) {
                            var button = document.getElementById(`reset_${key}`)
                            button.addEventListener("click", () => {
                                var main_selection = document.getElementById(key)
                                if (val["type"] == "checkbox") {
                                    main_selection.checked = val["default"]
                                } else {
                                    main_selection.value = val["default"]
                                }
                            })
                        }
                    }
                })
            }
        });
        const submitButton = document.getElementById("submitbutton");
        submitButton.addEventListener("click", saveData);

        fetch("manifest.json").then(man_res => {
            return man_res.json()
        }).then(man_json => {
            var extension_name = man_json["name"]
            var extension_version = man_json["version"]
            var extension_icon = man_json["icons"]["128"]

            document.getElementById("extens_name").innerHTML = `Extension Name: ${extension_name} ${`<img src="${extension_icon}" height="16" width="16" style="vertical-align: middle;">`}`
            document.getElementById("extens_vers").innerHTML = `v${extension_version}`
            document.getElementById("window_title").innerText = `${extension_name} Settings`

            if (window.location.href.includes("resize=true")) {
                document.getElementById("css").innerHTML = `
                p, label, em {
                    font-size: medium;
                    text-align: center;
                    display: block;
                }
                h1 {
                    font-size: xx-large;
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
                const style = document.createElement("link")
                style.id = "resize-to-full-screen";
                style.rel = "stylesheet";
                style.type = "text/css";
                style.media = "all";
                style.href = "https://cdn.efaz.dev/cdn/styles/htmlUI.css"
                document.head.append(style)
            } else if (navigator.onLine == false && (window.location.href.includes("resize=true"))) {
                document.getElementById("extens_vers").innerHTML = `${document.getElementById("extens_vers").innerHTML} | Network Offline`
                document.getElementById("css").innerHTML = `${document.getElementById("css").innerHTML}
        /* This stylesheet is exported for when your computer has no internet. */

        body {
            background-position: center;
            background-repeat: no-repeat;
            background-size: cover;
            background: linear-gradient(225deg, rgba(255, 75, 0, 1) 0%, rgb(207, 207, 0) 60%, rgb(19, 193, 0) 100%);
            font-family: arial !important;
            color: white;
            overflow: hidden;
        }
        p,
        h1,
        h2,
        label {
            text-align: center;
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
                document.getElementById("extens_vers").innerHTML = `${document.getElementById("extens_vers").innerHTML} | Network Offline`
                document.getElementById("css").innerHTML = `${document.getElementById("css").innerHTML}
                body {
                    font-family: arial !important;
                    color: white;
                    overflow: hidden;
                }
                `
            }

            if (system_settings["chromeWebstoreLinkEnabled"]) {
                document.getElementById("extensionLink").href = `https://chromewebstore.google.com/detail/extension/${chrome.runtime.id}`
                document.getElementById("extensionLink").style = ""
            } else {
                document.getElementById("extensionLink").remove()
            }
        })
    })
}

window.onload = loadChanges