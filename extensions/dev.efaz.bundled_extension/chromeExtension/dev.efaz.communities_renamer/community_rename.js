/* 

Efaz's Roblox Communities Renamer
By: EfazDev
Page: https://www.efaz.dev/roblox-communities-rename

inject.js:
    - Content script that replaces Charts with Discover/Games

*/

(function () { // Prevent changes made using the Inspect console.
    const storage = chrome.storage.sync;
    const storage_key = "dev.efaz.communities_renamer"
    function getChromeURL(resource) {
        try {
            // This is for Efaz's Roblox Extension support
            if (chrome.runtime.getManifest()["homepage_url"] == "https://www.efaz.dev/roblox-extension") {
                // This is run under bundled extension [{extension_name}/{resource}]
                return chrome.runtime.getURL("dev.efaz.communities_renamer" + "/" + resource)
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
                                if (!(typeof(v["default"]) == "undefined")) {user_settings[storage_key][i] = v["default"]}
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
                                if (!(typeof(v["default"]) == "undefined")) {user_settings[storage_key][i] = v["default"]}
                            }
                        })
                        return user_settings
                    })
                }
            })
        }
    }
    function timeout(func, ms) { setTimeout(func, ms); }

    try {
        getSettings(storage_key, function (items) {
            var enabled = true;
            if (items[storage_key]) {
                if (typeof (items[storage_key]["enabled"]) == "boolean") { enabled = items[storage_key]["enabled"] };
            } else {
                items[storage_key] = {
                    "enabled": true,
                    "newName": "Groups",
                    "replaceURLwithGroupsURL": true,
                    "changeTitleHtml": true,
                    "loopSeconds": "100",
                    "massEdit": true
                }
            }
            var settings = items[storage_key];
            if (enabled == true) {
                var tab = window.location
                if (tab.href) {
                    if (tab.hostname == "www.roblox.com") {
                        var newName = settings["newName"];
                        var newNameWithoutEndingS = settings["newName"].endsWith("s") ? settings["newName"].slice(0, -1) : settings["newName"];
                        var amountOfSecondsBeforeLoop = (typeof(settings["loopSeconds"]) == "string" && Number(settings["loopSeconds"])) ? Number(settings["loopSeconds"]) : 100

                        /* Clean New Name to prevent crashes */
                        var div = document.createElement("div");
                        div.innerHTML = newName;
                        newName = div.innerText.replace(/<\/[^>]+(>|$)/g, "");

                        var div = document.createElement("div");
                        div.innerHTML = newNameWithoutEndingS;
                        newNameWithoutEndingS = div.innerText.replace(/<\/[^>]+(>|$)/g, "");
                        /* Clean New Name to prevent crashes */
                        function injectRename() {
                            var sidebar_headers = document.querySelectorAll(".font-header-2.dynamic-ellipsis-item")
                            for (let i = 0; i < sidebar_headers.length; i++) {
                                var header = sidebar_headers[i]
                                if (/Communities/.test(header.innerHTML) && !(header.innerHTML.includes(newName))) {
                                    if (header.href && settings["replaceURLwithGroupsURL"] == true) {
                                        header.href = header.href.replace("communities", "groups")
                                    }
                                    header.innerHTML = newName
                                }
                            }

                            var sidebar_link_headers = document.querySelectorAll(".dynamic-overflow-container.text-nav")
                            for (let i = 0; i < sidebar_link_headers.length; i++) {
                                var header = sidebar_link_headers[i]
                                if (/Communities/.test(header.innerHTML) && !(header.innerHTML.includes(newName))) {
                                    if (header.href && settings["replaceURLwithGroupsURL"] == true) {
                                        header.href = header.href.replace("communities", "groups")
                                    }
                                    header.innerHTML = newName
                                }
                            }

                            var group_webblox_dropdown = document.querySelectorAll(".web-blox-css-mui-184cbry")
                            for (let i = 0; i < group_webblox_dropdown.length; i++) {
                                var header = group_webblox_dropdown[i]
                                if (/Community/.test(header.innerHTML) && !(header.innerHTML.includes(newNameWithoutEndingS))) {
                                    if (header.href && settings["replaceURLwithGroupsURL"] == true) {
                                        header.href = header.href.replace("communities", "groups")
                                    }
                                    header.innerHTML = header.innerHTML.replace("Community", newNameWithoutEndingS)
                                }
                            }

                            var group_header_name = document.querySelectorAll(".groups-list-heading")
                            for (let i = 0; i < group_header_name.length; i++) {
                                var header = group_header_name[i]
                                if (/Communities/.test(header.innerHTML) && !(header.innerHTML.includes(newName))) {
                                    header.innerHTML = header.innerHTML.replace("Communities", newName)
                                }
                            }

                            var search_headers = document.querySelectorAll(".section-title.ng-binding ng-scope.font-header-1")
                            for (let i = 0; i < search_headers.length; i++) {
                                var header = search_headers[i]
                                if (/Communities/.test(header.innerHTML) && !(header.innerHTML.includes(newName))) {
                                    if (header.href && settings["replaceURLwithGroupsURL"] == true) {
                                        header.href = header.href.replace("communities", "groups")
                                    }
                                    header.innerHTML = header.innerHTML.replace("Communities", newName)
                                }
                            }

                            var friends_headers = document.querySelectorAll(".ng-binding")
                            for (let i = 0; i < friends_headers.length; i++) {
                                var header = friends_headers[i]
                                if (/Communities/.test(header.innerHTML) && !(header.innerHTML.includes(newName))) {
                                    if (header.href && settings["replaceURLwithGroupsURL"] == true) {
                                        header.href = header.href.replace("communities", "groups")
                                    }
                                    header.innerHTML = header.innerHTML.replace("Communities", newName)
                                }
                            }

                            var my_communities_link = document.querySelectorAll(".btn-secondary-xs.btn-more.see-all-link-icon.ng-binding.ng-scope")
                            for (let i = 0; i < my_communities_link.length; i++) {
                                var header = my_communities_link[i]
                                if (/Communities/.test(header.innerHTML) && !(header.innerHTML.includes(newName))) {
                                    if (header.href && settings["replaceURLwithGroupsURL"] == true) {
                                        header.href = header.href.replace("communities", "groups")
                                    }
                                    header.innerHTML = header.innerHTML.replace("Communities", newName)
                                }
                            }

                            var create_community_button = document.querySelectorAll(".btn-secondary-md.create-group-button.ng-binding")
                            for (let i = 0; i < create_community_button.length; i++) {
                                var header = create_community_button[i]
                                if (/Community/.test(header.innerHTML) && !(header.innerHTML.includes(newNameWithoutEndingS))) {
                                    if (header.href && settings["replaceURLwithGroupsURL"] == true) {
                                        header.href = header.href.replace("communities", "groups")
                                    }
                                    header.innerHTML = header.innerHTML.replace("Community", newNameWithoutEndingS)
                                }
                            }

                            var most_text_frames = document.querySelectorAll(".ng-binding")
                            for (let i = 0; i < most_text_frames.length; i++) {
                                var header = most_text_frames[i]
                                if (/Community/.test(header.innerHTML) && !(header.innerHTML.includes(newNameWithoutEndingS))) {
                                    if (header.href && settings["replaceURLwithGroupsURL"] == true) {
                                        header.href = header.href.replace("communities", "groups")
                                    }
                                    if (settings["massEdit"] == true) {
                                        header.innerHTML = header.innerHTML.replace("Community", newNameWithoutEndingS)
                                    }
                                }
                            }

                            var small_create_community_text = document.querySelectorAll(".small.text.create-group-text.ng-binding.ng-scope")
                            for (let i = 0; i < small_create_community_text.length; i++) {
                                var header = small_create_community_text[i]
                                if (/communities/.test(header.innerHTML) && !(header.innerHTML.includes(newName.toLowerCase()))) {
                                    if (header.href && settings["replaceURLwithGroupsURL"] == true) {
                                        header.href = header.href.replace("communities", "groups")
                                    }
                                    header.innerHTML = header.innerHTML.replace("communities", newName.toLowerCase())
                                }
                            }

                            var transaction_page_summary = document.querySelectorAll(".summary-transaction-label")
                            for (let i = 0; i < transaction_page_summary.length; i++) {
                                var header = transaction_page_summary[i]
                                if (/Community/.test(header.innerHTML) && !(header.innerHTML.includes(newNameWithoutEndingS))) {
                                    if (header.href && settings["replaceURLwithGroupsURL"] == true) {
                                        header.href = header.href.replace("communities", "groups")
                                    }
                                    header.innerHTML = header.innerHTML.replace("Community", newNameWithoutEndingS)
                                }
                            }

                            var amount_text_summary = document.querySelectorAll(".amount")
                            for (let i = 0; i < amount_text_summary.length; i++) {
                                var header = amount_text_summary[i]
                                if (/Community/.test(header.innerHTML) && !(header.innerHTML.includes(newNameWithoutEndingS))) {
                                    if (header.href && settings["replaceURLwithGroupsURL"] == true) {
                                        header.href = header.href.replace("communities", "groups")
                                    }
                                    header.innerHTML = header.innerHTML.replace("Community", newNameWithoutEndingS)
                                }
                            }

                            var selected_labels = document.querySelectorAll(".rbx-selection-label")
                            for (let i = 0; i < selected_labels.length; i++) {
                                var header = selected_labels[i]
                                if (/Community/.test(header.innerHTML) && !(header.innerHTML.includes(newNameWithoutEndingS))) {
                                    if (header.href && settings["replaceURLwithGroupsURL"] == true) {
                                        header.href = header.href.replace("communities", "groups")
                                    }
                                    header.innerHTML = header.innerHTML.replace("Community", newNameWithoutEndingS)
                                }
                            }

                            var item_descriptions = document.querySelectorAll(".item-description")
                            for (let i = 0; i < item_descriptions.length; i++) {
                                var header = item_descriptions[i]
                                if (/Community/.test(header.innerHTML) && !(header.innerHTML.includes(newNameWithoutEndingS))) {
                                    if (header.href && settings["replaceURLwithGroupsURL"] == true) {
                                        header.href = header.href.replace("communities", "groups")
                                    }
                                    header.innerHTML = header.innerHTML.replace("Community", newNameWithoutEndingS)
                                }
                            }

                            var shout_community_button = document.querySelectorAll(".btn-secondary-md.group-form-button.ng-binding")
                            for (let i = 0; i < shout_community_button.length; i++) {
                                var header = shout_community_button[i]
                                if (/Community/.test(header.innerHTML) && !(header.innerHTML.includes(newNameWithoutEndingS))) {
                                    if (header.href && settings["replaceURLwithGroupsURL"] == true) {
                                        header.href = header.href.replace("communities", "groups")
                                    }
                                    header.innerHTML = header.innerHTML.replace("Community", newNameWithoutEndingS)
                                }
                            }

                            var previous_names = document.querySelectorAll(".text-pastname.ng-binding")
                            for (let i = 0; i < previous_names.length; i++) {
                                var header = previous_names[i]
                                if (/Community/.test(header.innerHTML) && !(header.innerHTML.includes(newNameWithoutEndingS))) {
                                    if (header.href && settings["replaceURLwithGroupsURL"] == true) {
                                        header.href = header.href.replace("communities", "groups")
                                    }
                                    header.innerHTML = header.innerHTML.replace("Community", newNameWithoutEndingS)
                                }
                            }

                            var search_communities_link = document.querySelectorAll(".groups-list-search-input")
                            for (let i = 0; i < search_communities_link.length; i++) {
                                var header = search_communities_link[i]
                                if (/Communities/.test(header.placeholder) && !(header.placeholder.includes(newName))) {
                                    if (header.href && settings["replaceURLwithGroupsURL"] == true) {
                                        header.href = header.href.replace("communities", "groups")
                                    }
                                    header.placeholder = header.placeholder.replace("Communities", `${newName}`)
                                }
                            }

                            var back_links = document.querySelectorAll(".back-link")
                            for (let i = 0; i < back_links.length; i++) {
                                var header = back_links[i]
                                if ((/Community/.test(header.innerHTML) || /Communities/.test(header.innerHTML))) {
                                    header.innerHTML = header.innerHTML.replace("Community", newNameWithoutEndingS).replace("Communities", newName)
                                }
                            }

                            var font_bodies = document.querySelectorAll(".font-body")
                            for (let i = 0; i < font_bodies.length; i++) {
                                var header = font_bodies[i]
                                if ((/Community/.test(header.innerHTML) || /Communities/.test(header.innerHTML)) && !(header.innerHTML.includes(newNameWithoutEndingS))) {
                                    header.innerHTML = header.innerHTML.replace("Community", newNameWithoutEndingS).replace("Communities", newName)
                                }
                            }

                            var emphasises = document.querySelectorAll(".text-emphasis")
                            for (let i = 0; i < emphasises.length; i++) {
                                var header = emphasises[i]
                                if ((/Community/.test(header.innerHTML) || /Communities/.test(header.innerHTML)) && !(header.innerHTML.includes(newNameWithoutEndingS))) {
                                    header.innerHTML = header.innerHTML.replace("Community", newNameWithoutEndingS).replace("Communities", newName)
                                }
                            }

                            var text_contents = document.querySelectorAll(".text-content")
                            for (let i = 0; i < text_contents.length; i++) {
                                var header = text_contents[i]
                                if ((/Community/.test(header.innerHTML) || /Communities/.test(header.innerHTML)) && !(header.innerHTML.includes(newNameWithoutEndingS))) {
                                    header.innerHTML = header.innerHTML.replace("Community", newNameWithoutEndingS).replace("Communities", newName)
                                }
                            }

                            var all_links = document.querySelectorAll("a")
                            for (let i = 0; i < all_links.length; i++) {
                                var header = all_links[i]
                                if (header.href && /\/communities/.test(header.href) && !(header.innerHTML.includes(newName))) {
                                    if (settings["replaceURLwithGroupsURL"] == true) {
                                        header.href = header.href.replace("/communities", "/groups")
                                    }
                                }
                                if (settings["massEdit"] == true) {
                                    if (/Community/.test(header.innerHTML) && !(header.innerHTML.includes(newNameWithoutEndingS))) {
                                        header.innerHTML = header.innerHTML.replace("Community", newNameWithoutEndingS)
                                    }
                                }
                            }

                            var all_labels = document.querySelectorAll("label")
                            for (let i = 0; i < all_labels.length; i++) {
                                var header = all_labels[i]
                                if (settings["massEdit"] == true) {
                                    if ((/Community/.test(header.innerHTML) || /Communities/.test(header.innerHTML)) && !(header.innerHTML.includes(newNameWithoutEndingS))) {
                                        header.innerHTML = header.innerHTML.replace("Community", newNameWithoutEndingS).replace("Communities", newName)
                                    }
                                }
                            }

                            if (settings["replaceURLwithGroupsURL"] == true) {
                                if (/\/communities/.test(window.location.pathname) && !(/\/configure/.test(window.location.href))) {
                                    window.history.pushState({ id: "100" }, newName, window.location.href.replace("/communities", "/groups"));
                                }
                            }

                            if (/\/communities/.test(window.location.pathname) || /\/groups/.test(window.location.pathname)) {    
                                if (settings["changeTitleHtml"] == true) {
                                    var titles = document.querySelectorAll("title")
                                    for (let i = 0; i < titles.length; i++) {
                                        var header = titles[i]
                                        if (/Communities/.test(header.innerText)) {
                                            header.innerText = header.innerText.replaceAll("Communities", newName)
                                        }
                                    }
                                }
                            }
                            timeout(() => { injectRename() }, amountOfSecondsBeforeLoop)
                        }
                        injectRename()
                    }
                }
            }
        });
    } catch (err) {
        console.warn(`Failed to insert rename into this tab. Error Message: ${err.message}`)
    }
}())