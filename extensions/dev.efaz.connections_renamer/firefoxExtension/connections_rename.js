/* 

Efaz's Roblox Connections Renamer
By: EfazDev
Page: https://www.efaz.dev/roblox-connections-rename

inject.js:
    - Content script that replaces Connections with Friends

*/

(function () { // Prevent changes made using the Inspect console.
    const storage = chrome.storage.sync;

    try {
        const storage_key = "dev.efaz.connections_renamer"
        function getChromeURL(resource) {
            try {
                // This is for Efaz's Roblox Extension support
                if (chrome.runtime.getManifest()["homepage_url"] == "https://www.efaz.dev/roblox-extension") {
                    // This is run under bundled extension [{extension_name}/{resource}]
                    return chrome.runtime.getURL("{extension_name_this_is_replace_when_building_bundle_with_folder_name_if_youre_wondering}" + "/" + resource)
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
                        await callback(a, array[a])
                    }
                } else {
                    var generated_keys = Object.keys(array);
                    for (let a = 0; a < generated_keys.length; a++) {
                        await callback(generated_keys[a], array[generated_keys[a]])
                    }
                }
            }
        }
        async function getSettings(storage_key, callback) {
            return fetch(getChromeURL("settings.json")).then((res) => {
                if (res.ok) { return res.json(); }
            }).then(jso => {
                if (jso) {
                    return storage.get(storage_key).then(async (user_settings) => {
                        if (!user_settings) { user_settings = {} }
                        if (!(user_settings[storage_key])) { user_settings[storage_key] = {} }
                        await loopThroughArrayAsync(jso["settings"], async (i, v) => {
                            if (typeof(user_settings[storage_key][i]) == "undefined") {
                                if (!(typeof(v["default"]) == "undefined")) {user_settings[storage_key][i] = v["default"]}
                            }
                        })
                        if (callback) { callback(user_settings) }
                        return user_settings
                    })
                }
            })
        }
        function timeout(func, ms) { setTimeout(func, ms); }
        getSettings(storage_key, function (items) {
            let enabled = true;
            let settings = items[storage_key];
            if (typeof (settings["enabled"]) == "boolean") { enabled = settings["enabled"] };
            if (enabled == true) {
                let tab = window.location
                if (tab.href) {
                    if (tab.hostname == "www.roblox.com") {
                        let newName = settings["newName"];
                        let newNameWithoutEndingS = settings["newName"].endsWith("s") ? settings["newName"].slice(0, -1) : settings["newName"];
                        let amountOfSecondsBeforeLoop = (typeof(settings["startTime"]) == "string" && Number(settings["startTime"])) ? Number(settings["startTime"]) : 75
                        /* Clean New Name to prevent crashes */
                        var div = document.createElement("div");
                        div.innerHTML = newName;
                        newName = div.textContent.replace(/<\/[^>]+(>|$)/g, "");
                        
                        var div = document.createElement("div");
                        div.innerHTML = newNameWithoutEndingS;
                        newNameWithoutEndingS = div.textContent.replace(/<\/[^>]+(>|$)/g, "");
                        /* Clean New Name to prevent crashes */
                        function injectRename() {
                            let sidebar_headers = document.querySelectorAll(".font-header-2.dynamic-ellipsis-item")
                            for (let i = 0; i < sidebar_headers.length; i++) {
                                let header = sidebar_headers[i]
                                if (header.innerHTML.includes("Connect") && !(header.innerHTML.includes(newName))) {
                                    header.innerHTML = newName
                                }
                            }

                            let group_webblox_dropdown = document.querySelectorAll(".web-blox-css-mui-184cbry")
                            for (let i = 0; i < group_webblox_dropdown.length; i++) {
                                let header = group_webblox_dropdown[i]
                                if (header.innerHTML.includes("Connection") && !(header.innerHTML.includes(newNameWithoutEndingS))) {
                                    header.innerHTML = header.innerHTML.replace("Connection", newNameWithoutEndingS)
                                }
                            }

                            let title_page_text = document.querySelectorAll(".friends-title")
                            for (let i = 0; i < title_page_text.length; i++) {
                                let header = title_page_text[i]
                                if (header.innerHTML.includes("Connections") && !(header.innerHTML.includes(newName))) {
                                    header.innerHTML = header.innerHTML.replace("Connections", newName)
                                }
                            }

                            let buttons_text = document.querySelectorAll(".web-blox-css-tss-1283320-Button-textContainer")
                            for (let i = 0; i < buttons_text.length; i++) {
                                let header = buttons_text[i]
                                if (header.innerHTML.includes("Remove Connection") && !(header.innerHTML.includes(newNameWithoutEndingS))) {
                                    header.innerHTML = header.innerHTML.replace("Remove Connection", "Un" + newNameWithoutEndingS.toLowerCase())
                                } else if (header.innerHTML.includes("Connection") && !(header.innerHTML.includes(newNameWithoutEndingS))) {
                                    header.innerHTML = header.innerHTML.replace("Connection", newNameWithoutEndingS)
                                }
                            }

                            let search_headers = document.querySelectorAll(".section-title.ng-binding ng-scope.font-header-1")
                            for (let i = 0; i < search_headers.length; i++) {
                                let header = search_headers[i]
                                if (header.innerHTML.includes("Connections") && !(header.innerHTML.includes(newName))) {
                                    header.innerHTML = header.innerHTML.replace("Connections", newName)
                                }
                            }

                            let friends_search_link = document.querySelectorAll(".friends-filter-searchbar-input")
                            for (let i = 0; i < friends_search_link.length; i++) {
                                let header = friends_search_link[i]
                                if (header.placeholder.includes("Connections") && !(header.placeholder.includes(newName))) {
                                    header.placeholder = header.placeholder.replace("Connections", `${newName}`)
                                }
                            }

                            let friends_headers = document.querySelectorAll(".ng-binding")
                            for (let i = 0; i < friends_headers.length; i++) {
                                let header = friends_headers[i]
                                if (header.innerHTML.includes("Connections") && !(header.innerHTML.includes(newName))) {
                                    header.innerHTML = header.innerHTML.replace("Connections", newName)
                                }
                            }

                            let most_text_frames = document.querySelectorAll(".ng-binding")
                            for (let i = 0; i < most_text_frames.length; i++) {
                                let header = most_text_frames[i]
                                if (header.innerHTML.includes("Connection") && !(header.innerHTML.includes(newNameWithoutEndingS))) {
                                    if (settings["massEdit"] == true) {
                                        header.innerHTML = header.innerHTML.replace("Connection", newNameWithoutEndingS)
                                    }
                                }
                            }

                            let amount_text_summary = document.querySelectorAll(".amount")
                            for (let i = 0; i < amount_text_summary.length; i++) {
                                let header = amount_text_summary[i]
                                if (header.innerHTML.includes("Connection") && !(header.innerHTML.includes(newNameWithoutEndingS))) {
                                    header.innerHTML = header.innerHTML.replace("Connection", newNameWithoutEndingS)
                                }
                            }

                            let selected_labels = document.querySelectorAll(".rbx-selection-label")
                            for (let i = 0; i < selected_labels.length; i++) {
                                let header = selected_labels[i]
                                if (header.innerHTML.includes("Connection") && !(header.innerHTML.includes(newNameWithoutEndingS))) {
                                    header.innerHTML = header.innerHTML.replace("Connection", newNameWithoutEndingS)
                                }
                            }

                            let item_descriptions = document.querySelectorAll(".item-description")
                            for (let i = 0; i < item_descriptions.length; i++) {
                                let header = item_descriptions[i]
                                if (header.innerHTML.includes("Connection") && !(header.innerHTML.includes(newNameWithoutEndingS))) {
                                    header.innerHTML = header.innerHTML.replace("Connection", newNameWithoutEndingS)
                                }
                            }

                            let friends_subtitle = document.querySelectorAll(".friends-subtitle")
                            for (let i = 0; i < friends_subtitle.length; i++) {
                                let header = friends_subtitle[i]
                                if (header.childNodes && header.childNodes[0] && header.childNodes[0].textContent.includes("Connections") && !(header.childNodes[0].textContent.includes(newName))) {
                                    header.childNodes[0].textContent = header.childNodes[0].textContent.replace("Connections", newName)
                                }
                            }

                            let previous_names = document.querySelectorAll(".text-pastname.ng-binding")
                            for (let i = 0; i < previous_names.length; i++) {
                                let header = previous_names[i]
                                if (header.innerHTML.includes("Connection") && !(header.innerHTML.includes(newNameWithoutEndingS))) {
                                    header.innerHTML = header.innerHTML.replace("Connection", newNameWithoutEndingS)
                                }
                            }

                            let back_links = document.querySelectorAll(".back-link")
                            for (let i = 0; i < back_links.length; i++) {
                                let header = back_links[i]
                                if ((header.innerHTML.includes("Connection") || header.innerHTML.includes("Connections"))) {
                                    header.innerHTML = header.innerHTML.replace("Connections", newName)
                                }
                            }

                            let font_bodies = document.querySelectorAll(".font-body")
                            for (let i = 0; i < font_bodies.length; i++) {
                                let header = font_bodies[i]
                                if ((header.innerHTML.includes("Connection") || header.innerHTML.includes("Connections")) && !(header.innerHTML.includes(newNameWithoutEndingS))) {
                                    header.innerHTML = header.innerHTML.replace("Connection", newNameWithoutEndingS)
                                }
                            }

                            let emphasises = document.querySelectorAll(".text-emphasis")
                            for (let i = 0; i < emphasises.length; i++) {
                                let header = emphasises[i]
                                if ((header.innerHTML.includes("Connection") || header.innerHTML.includes("Connections")) && !(header.innerHTML.includes(newNameWithoutEndingS))) {
                                    header.innerHTML = header.innerHTML.replace("Connection", newNameWithoutEndingS)
                                }
                            }

                            let text_contents = document.querySelectorAll(".text-content")
                            for (let i = 0; i < text_contents.length; i++) {
                                let header = text_contents[i]
                                if ((header.innerHTML.includes("Connection") || header.innerHTML.includes("Connections")) && !(header.innerHTML.includes(newNameWithoutEndingS))) {
                                    header.innerHTML = header.innerHTML.replace("Connection", newNameWithoutEndingS)
                                }
                            }

                            let friend_tooltips = document.querySelectorAll("#friendsTooltip")
                            for (let i = 0; i < friend_tooltips.length; i++) {
                                let header = friend_tooltips[i]
                                if ((header.innerHTML.includes("Connection") || header.innerHTML.includes("Connections")) && !(header.innerHTML.includes(newNameWithoutEndingS))) {
                                    header.innerHTML = header.innerHTML.replace("Connection", newNameWithoutEndingS)
                                }
                            }

                            let player_list_headers = document.querySelectorAll(".people-list-header")
                            for (let i = 0; i < player_list_headers.length; i++) {
                                let header = player_list_headers[i]
                                if ((header.innerHTML.includes("Connection") || header.innerHTML.includes("Connections")) && !(header.innerHTML.includes(newNameWithoutEndingS))) {
                                    header.innerHTML = header.innerHTML.replace("Connection", newNameWithoutEndingS)
                                }
                            }

                            let friend_list_titles = document.querySelectorAll(".friends-carousel-tile-labels")
                            for (let i = 0; i < friend_list_titles.length; i++) {
                                let header = friend_list_titles[i]
                                if (header.nodeName == "DIV" && header.innerHTML.includes("Connect") && !(header.innerHTML.includes(newName))) {
                                    if (!(header.innerHTML.includes("Add"))) {
                                        header.innerHTML = header.innerHTML.replace("Connect", "Add Connect")
                                    }
                                    header.innerHTML = header.innerHTML.replace("Connect", newName)
                                }
                            }

                            let all_links = document.querySelectorAll("a")
                            for (let i = 0; i < all_links.length; i++) {
                                let header = all_links[i]
                                if (settings["massEdit"] == true) {
                                    if (!(header.className == "profile-header-social-count") && header.innerHTML.includes("Connection") && !(header.innerHTML.includes(newNameWithoutEndingS))) {
                                        header.innerHTML = header.innerHTML.replace("Connection", newNameWithoutEndingS)
                                    }
                                }
                            }

                            let all_labels = document.querySelectorAll("label")
                            for (let i = 0; i < all_labels.length; i++) {
                                let header = all_labels[i]
                                if (settings["massEdit"] == true) {
                                    if ((header.innerHTML.includes("Connection") || header.innerHTML.includes("Connections")) && !(header.innerHTML.includes(newNameWithoutEndingS))) {
                                        header.innerHTML = header.innerHTML.replace("Connection", newNameWithoutEndingS)
                                    }
                                }
                            }

                            let all_profile_headers = document.querySelectorAll(".profile-header-social-count-label")
                            for (let i = 0; i < all_profile_headers.length; i++) {
                                let header = all_profile_headers[i]
                                if ((header.innerHTML.includes("Connection") || header.innerHTML.includes("Connections")) && !(header.innerHTML.includes(newNameWithoutEndingS))) {
                                    header.innerHTML = header.innerHTML.replace("Connection", newNameWithoutEndingS)
                                }
                            }

                            if (window.location.pathname.includes("/connections") || window.location.pathname.includes("/friends")) {    
                                if (settings["changeTitleHtml"] == true) {
                                    let titles = document.querySelectorAll("title")
                                    for (let i = 0; i < titles.length; i++) {
                                        let header = titles[i]
                                        if (header.textContent.includes("Connections")) {
                                            header.textContent = header.textContent.replaceAll("Connections", newName)
                                        }
                                    }
                                }
                            }
                            timeout(() => injectRename(), amountOfSecondsBeforeLoop)
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