/* 

Efaz's Roblox Verified Badge Add-on
By: EfazDev
Page: https://www.efaz.dev/roblox-foundation-color-accents

reset_cache.js:
    - Content script that handles extra buttons in the Settings page.

*/

(function () {
    window.addEventListener("load", () => {
        var r = document.getElementById("reset_group_cache")
        if (r) {
            r.addEventListener("click", () => {
                chrome.storage.local.set({ "group_ownership": {} }, () => {
                    alert("Successfully cleared all group cache!")
                });
            })
        }

        var r = document.getElementById("reset_user_cache")
        if (r) {
            r.addEventListener("click", () => {
                chrome.storage.local.set({ "user_verification": {} }, () => {
                    alert("Successfully cleared all user cache!")
                });
            })
        }

        var r = document.getElementById("custom_approved_badges_by_user")
        if (r) {
            r.addEventListener('click', async () => {
                try {
                    const [fileHandle] = await window.showOpenFilePicker();
                    if (fileHandle) {
                        const permission = await fileHandle.requestPermission();
                        if (permission === "granted") {
                            const file = await fileHandle.getFile();
                            let contents = await file.text();
                            contents = JSON.parse(contents);
                            if (typeof (contents) == "object") {
                                if (Array.isArray(contents) == false) {
                                    var content_keys = Object.keys(contents)
                                    var validated_keys = true
                                    for (a = 0; a < content_keys.length; a++) {
                                        var content_key = content_keys[a]
                                        var content_value = contents[content_key]
                                        if (typeof (content_value) == "object" && Array.isArray(content_value) == false) {
                                            if (!(content_value["id"].toString() == content_key)) {
                                                validated_keys = false
                                            }
                                        } else {
                                            validated_keys = false
                                        }
                                    }
                                    if (validated_keys == true) {
                                        chrome.storage.local.set({ "user_approved_json": contents }, () => {
                                            alert("Successfully fetched and saved approved user JSON!");
                                        });
                                    } else {
                                        alert("There was an issue trying to validate approved user JSON! Code: -3")
                                    }
                                } else {
                                    alert("There was an issue trying to validate approved user JSON! Code: -2")
                                }
                            } else {
                                alert("There was an issue trying to validate approved user JSON! Code: -1")
                            }
                        }
                    }
                } catch (error) {
                    if (!(error.toString() && /aborted/.test(error.toString()))) {
                        console.warn(error);
                        alert("There was an issue trying to save approved user JSON!")
                    }
                }
            });
        }
    })
})()