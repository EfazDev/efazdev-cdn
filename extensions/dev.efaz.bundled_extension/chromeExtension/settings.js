/* 

Efaz's Roblox Extension
By: EfazDev

settings.js:
    - Handle selecting between mini extensions

*/
var innerBody, innerHead

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

function loopThroughArray(array, callback) {
    if (typeof (array) == "object") {
        if (Array.isArray(array)) {
            for (let a = 0; a < array.length; a++) {
                var value = array[a]
                callback(a, value)
            }
        } else {
            var generated_keys = Object.keys(array);
            for (let a = 0; a < generated_keys.length; a++) {
                var key = generated_keys[a]
                var value = array[key]
                callback(key, value)
            }
        }
    }
}

function compareVersions(version1, version2) {
    if (!version1 || !version2) { return 0 };
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

async function loadChanges2() {
    let system_settings = await fetch(chrome.runtime.getURL("settings.json")).then((re) => { if (re.ok) { return re.json() } else { return {} } });
    let man_json = await fetch(chrome.runtime.getURL("manifest.json")).then((re) => { if (re.ok) { return re.json() } else { return {} } });
    const extensions = system_settings["extensions"]
    await loopThroughArrayAsync(extensions, async (_, exName) => {
        let manifest = await fetch(chrome.runtime.getURL(exName + "/org_manifest.json")).then((re) => { if (re.ok) { return re.json() } else { return {} } });
        let settings = await fetch(chrome.runtime.getURL(exName + "/settings.json")).then((re) => { if (re.ok) { return re.json() } else { return {} } });

        document.getElementById("extens_vers").innerHTML = `v${man_json["version"]}`
        document.getElementById("window_title").innerText = `Bundle Settings`

        if (document.getElementById(exName) == null) {
            var generated_html_element = `<label for="${exName}">${settings["bundledDisplayName"]} v${manifest["version"]}: <span class="gradient-border"><button type="submit" id="${exName}">Open Settings!</button></span>`
            var beforeElement = document.getElementById("reviewDetails")
            if (settings["hidden"] == true && !(window.location.href.includes("resize=true"))) {
                generated_html_element = `<label style="display: none;" for="${exName}">${settings["name"]} v${manifest["version"]}: <span class="gradient-border"><button type="submit" id="${exName}">Open Settings!</button></span>`
            } else {
                generated_html_element = `${generated_html_element}`
            }
            generated_html_element = `${generated_html_element}</label>`
            beforeElement.outerHTML = `${generated_html_element}${document.getElementById("reviewDetails").outerHTML}`
        }

        if (document.getElementById(exName)) {
            var button = document.getElementById(exName)
            button.addEventListener("click", async () => {
                let webpage = await fetch(chrome.runtime.getURL(exName + "/settings.html")).then((re) => { if (re.ok) { return re.text() } else { return null } });
                if (webpage) {
                    // Edit Webpage Contents
                    webpage = webpage
                        .replaceAll('<script src="settings.js"></script>', '<script class="reexecute" src="running_settings.js"></script>')
                        .replaceAll('<script src="setting_colors.js"></script>', '<script class="reexecute" src="' + exName + "/setting_colors.js" + '"></script>')
                        .replaceAll('<script src="reset_cache.js"></script>', '<script class="reexecute" src="' + exName + "/reset_cache.js" + '"></script>')
                        .replaceAll("</meta>", "")
                    webpage = webpage.replaceAll('<span class="gradient-border"><button type=\'submit\' id="submitbutton" class="center">Save Settings!</button></span><br><br>', '<span class="gradient-border"><button type=\'submit\' id="submitbutton" class="center">Save Settings!</button></span> <span class="gradient-border"><button type="submit" id="goBackToBundledPage">Return to Extensions page!</button></span><br><br>')
                    
                    // Run HTML
                    var newElement = new DOMParser().parseFromString(webpage, "text/html")
                    document.extensionName = exName
                    document.head.innerHTML = newElement.head.innerHTML
                    document.body.innerHTML = newElement.body.innerHTML

                    // Execute Runners
                    var classes = document.getElementsByClassName("reexecute")
                    var con_classes = Array.prototype.slice.call(classes)
                    var r = false
                    await loopThroughArrayAsync(con_classes, async (i, v) => {
                        var src = v.src
                        var s;
                        s = document.createElement('script');
                        s.type = 'text/javascript';
                        s.src = src;
                        s.onload = s.onreadystatechange = function () {
                            if (!r && (!this.readyState || this.readyState == 'complete')) {
                                r = true;
                                setTimeout(() => {window.dispatchEvent(new Event("load"));}, 200)
                            }
                        };
                        document.body.appendChild(s);
                        v.remove()
                    })

                    // Set Go Back Page
                    if (document.getElementById("goBackToBundledPage")) {
                        var button2 = document.getElementById("goBackToBundledPage")
                        button2.addEventListener("click", async () => {
                            var changes_are_made = false
                            await loopThroughArrayAsync(changes_made, (_, v) => { if (v == true) { changes_are_made = true } })
                            if ((changes_are_made == true && confirm("Are you sure you want to return back to the Extensions page without saving?")) || changes_are_made == false) {
                                document.body.innerHTML = innerBody
                                document.head.innerHTML = innerHead
                                setTimeout(() => {loadChanges2()}, 200)
                            }
                        })
                    }
                } else {
                    console.warn("Unable to fetch webpage!!");
                }
            })
        }
    })

    if (navigator.onLine == false) {
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
            document.getElementById("extens_vers").innerHTML = `${document.getElementById("extens_vers").innerHTML} | Unpacked`
        }

        document.getElementById("extensionLink").style = ""
    } else {
        document.getElementById("extensionLink").remove()
    }

    if (system_settings["scanForManifestUpdates"] == true) {
        if (navigator.onLine == true) {
            /* Update check */
            fetch(system_settings["onlineManifestFile"]).then(r => {
                if (r.ok) {
                    return r.json()
                }
            }).then(j => {
                if (j) {
                    if (system_settings["isVersionServer"] == true) {
                        var compared = compareVersions(man_json["version"], j[system_settings["name"]])
                        if (j[system_settings["name"]] == man_json["version"]) {
                            /* User is running the latest non-beta version. */
                            console.log("This user is currently at the latest version!")
                        } else if (compared == -1) {
                            /* User has an update available */
                            document.getElementById("extens_vers").innerHTML = `${document.getElementById("extens_vers").innerHTML} | <button id="openChromeExtensionSettings">Update Available to v${j[system_settings["name"]]}!</button>`
                            document.getElementById("openChromeExtensionSettings").addEventListener("click", () => {
                                if (system_settings["chromeWebstoreLinkEnabled"] == true && !(chrome.runtime.id == system_settings["uploadedChromeExtensionID"])) {
                                    chrome.tabs.create({ url: `https://chromewebstore.google.com/detail/extension/${system_settings["uploadedChromeExtensionID"]}` });
                                } else {
                                    chrome.tabs.create({ url: "chrome://extensions/" });
                                }
                            });
                            console.log(`New version found! v${man_json["version"]} > v${j[system_settings["name"]]}`)
                        } else {
                            /* User is running beta version of the extension */
                            document.getElementById("extens_vers").innerHTML = `v${man_json["version"]} Beta`
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
                            document.getElementById("extens_vers").innerHTML = `v${man_json["version"]} Beta`
                            console.log(`User is in beta version of the extension!`)
                        }
                    }
                }
            })
        }
    }
}

window.onload = function() {
    innerBody = document.body.innerHTML
    innerHead = document.head.innerHTML
    loadChanges2()
}