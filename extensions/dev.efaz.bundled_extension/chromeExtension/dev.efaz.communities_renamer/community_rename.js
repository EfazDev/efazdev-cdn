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

    try {
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
                        let amountOfSecondsBeforeLoop = (typeof(settings["loopSeconds"]) == "string" && Number(settings["loopSeconds"])) ? Number(settings["loopSeconds"]) : 100

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
                                if (header.innerHTML.includes("Communities") && !(header.innerHTML.includes(newName))) {
                                    if (header.href && settings["replaceURLwithGroupsURL"] == true) {
                                        header.href = header.href.replace("communities", "groups")
                                    }
                                    header.innerHTML = newName
                                }
                            }

                            let sidebar_link_headers = document.querySelectorAll(".dynamic-overflow-container.text-nav")
                            for (let i = 0; i < sidebar_link_headers.length; i++) {
                                let header = sidebar_link_headers[i]
                                if (header.innerHTML.includes("Communities") && !(header.innerHTML.includes(newName))) {
                                    if (header.href && settings["replaceURLwithGroupsURL"] == true) {
                                        header.href = header.href.replace("communities", "groups")
                                    }
                                    header.innerHTML = newName
                                }
                            }

                            let group_webblox_dropdown = document.querySelectorAll(".web-blox-css-mui-184cbry")
                            for (let i = 0; i < group_webblox_dropdown.length; i++) {
                                let header = group_webblox_dropdown[i]
                                if (header.innerHTML.includes("Community") && !(header.innerHTML.includes(newNameWithoutEndingS))) {
                                    if (header.href && settings["replaceURLwithGroupsURL"] == true) {
                                        header.href = header.href.replace("communities", "groups")
                                    }
                                    header.innerHTML = header.innerHTML.replace("Community", newNameWithoutEndingS)
                                }
                            }

                            let group_header_name = document.querySelectorAll(".groups-list-heading")
                            for (let i = 0; i < group_header_name.length; i++) {
                                let header = group_header_name[i]
                                if (header.innerHTML.includes("Communities") && !(header.innerHTML.includes(newName))) {
                                    header.innerHTML = header.innerHTML.replace("Communities", newName)
                                }
                            }

                            let search_headers = document.querySelectorAll(".section-title.ng-binding ng-scope.font-header-1")
                            for (let i = 0; i < search_headers.length; i++) {
                                let header = search_headers[i]
                                if (header.innerHTML.includes("Communities") && !(header.innerHTML.includes(newName))) {
                                    if (header.href && settings["replaceURLwithGroupsURL"] == true) {
                                        header.href = header.href.replace("communities", "groups")
                                    }
                                    header.innerHTML = header.innerHTML.replace("Communities", newName)
                                }
                            }

                            let friends_headers = document.querySelectorAll(".ng-binding")
                            for (let i = 0; i < friends_headers.length; i++) {
                                let header = friends_headers[i]
                                if (header.innerHTML.includes("Communities") && !(header.innerHTML.includes(newName))) {
                                    if (header.href && settings["replaceURLwithGroupsURL"] == true) {
                                        header.href = header.href.replace("communities", "groups")
                                    }
                                    header.innerHTML = header.innerHTML.replace("Communities", newName)
                                }
                            }

                            let my_communities_link = document.querySelectorAll(".btn-secondary-xs.btn-more.see-all-link-icon.ng-binding.ng-scope")
                            for (let i = 0; i < my_communities_link.length; i++) {
                                let header = my_communities_link[i]
                                if (header.innerHTML.includes("Communities") && !(header.innerHTML.includes(newName))) {
                                    if (header.href && settings["replaceURLwithGroupsURL"] == true) {
                                        header.href = header.href.replace("communities", "groups")
                                    }
                                    header.innerHTML = header.innerHTML.replace("Communities", newName)
                                }
                            }

                            let create_community_button = document.querySelectorAll(".btn-secondary-md.create-group-button.ng-binding")
                            for (let i = 0; i < create_community_button.length; i++) {
                                let header = create_community_button[i]
                                if (header.innerHTML.includes("Community") && !(header.innerHTML.includes(newNameWithoutEndingS))) {
                                    if (header.href && settings["replaceURLwithGroupsURL"] == true) {
                                        header.href = header.href.replace("communities", "groups")
                                    }
                                    header.innerHTML = header.innerHTML.replace("Community", newNameWithoutEndingS)
                                }
                            }

                            let most_text_frames = document.querySelectorAll(".ng-binding")
                            for (let i = 0; i < most_text_frames.length; i++) {
                                let header = most_text_frames[i]
                                if (header.getAttribute("ng-bind") == "role.name" || header.getAttribute("ng-bind") == "$ctrl.data.currentRoleName") { continue };
                                if (header.innerHTML.includes("Community") && !(header.innerHTML.includes(newNameWithoutEndingS))) {
                                    if (header.href && settings["replaceURLwithGroupsURL"] == true) {
                                        header.href = header.href.replace("communities", "groups")
                                    }
                                    if (settings["massEdit"] == true) {
                                        header.innerHTML = header.innerHTML.replace("Community", newNameWithoutEndingS)
                                    }
                                }
                            }

                            let small_create_community_text = document.querySelectorAll(".small.text.create-group-text.ng-binding.ng-scope")
                            for (let i = 0; i < small_create_community_text.length; i++) {
                                let header = small_create_community_text[i]
                                if (header.innerHTML.includes("Communities") && !(header.innerHTML.includes(newName.toLowerCase()))) {
                                    if (header.href && settings["replaceURLwithGroupsURL"] == true) {
                                        header.href = header.href.replace("communities", "groups")
                                    }
                                    header.innerHTML = header.innerHTML.replace("communities", newName.toLowerCase())
                                }
                            }

                            let transaction_page_summary = document.querySelectorAll(".summary-transaction-label")
                            for (let i = 0; i < transaction_page_summary.length; i++) {
                                let header = transaction_page_summary[i]
                                if (header.innerHTML.includes("Community") && !(header.innerHTML.includes(newNameWithoutEndingS))) {
                                    if (header.href && settings["replaceURLwithGroupsURL"] == true) {
                                        header.href = header.href.replace("communities", "groups")
                                    }
                                    header.innerHTML = header.innerHTML.replace("Community", newNameWithoutEndingS)
                                }
                            }

                            let amount_text_summary = document.querySelectorAll(".amount")
                            for (let i = 0; i < amount_text_summary.length; i++) {
                                let header = amount_text_summary[i]
                                if (header.innerHTML.includes("Community") && !(header.innerHTML.includes(newNameWithoutEndingS))) {
                                    if (header.href && settings["replaceURLwithGroupsURL"] == true) {
                                        header.href = header.href.replace("communities", "groups")
                                    }
                                    header.innerHTML = header.innerHTML.replace("Community", newNameWithoutEndingS)
                                }
                            }

                            let selected_labels = document.querySelectorAll(".rbx-selection-label")
                            for (let i = 0; i < selected_labels.length; i++) {
                                let header = selected_labels[i]
                                if (header.getAttribute("ng-bind") == "role.name" || header.getAttribute("ng-bind") == "$ctrl.data.currentRoleName") { continue };
                                if (header.innerHTML.includes("Community") && !(header.innerHTML.includes(newNameWithoutEndingS))) {
                                    if (header.href && settings["replaceURLwithGroupsURL"] == true) {
                                        header.href = header.href.replace("communities", "groups")
                                    }
                                    header.innerHTML = header.innerHTML.replace("Community", newNameWithoutEndingS)
                                }
                            }

                            let item_descriptions = document.querySelectorAll(".item-description")
                            for (let i = 0; i < item_descriptions.length; i++) {
                                let header = item_descriptions[i]
                                if (header.innerHTML.includes("Community") && !(header.innerHTML.includes(newNameWithoutEndingS))) {
                                    if (header.href && settings["replaceURLwithGroupsURL"] == true) {
                                        header.href = header.href.replace("communities", "groups")
                                    }
                                    header.innerHTML = header.innerHTML.replace("Community", newNameWithoutEndingS)
                                }
                            }

                            let shout_community_button = document.querySelectorAll(".btn-secondary-md.group-form-button.ng-binding")
                            for (let i = 0; i < shout_community_button.length; i++) {
                                let header = shout_community_button[i]
                                if (header.innerHTML.includes("Community") && !(header.innerHTML.includes(newNameWithoutEndingS))) {
                                    if (header.href && settings["replaceURLwithGroupsURL"] == true) {
                                        header.href = header.href.replace("communities", "groups")
                                    }
                                    header.innerHTML = header.innerHTML.replace("Community", newNameWithoutEndingS)
                                }
                            }

                            let previous_names = document.querySelectorAll(".text-pastname.ng-binding")
                            for (let i = 0; i < previous_names.length; i++) {
                                let header = previous_names[i]
                                if (header.innerHTML.includes("Community") && !(header.innerHTML.includes(newNameWithoutEndingS))) {
                                    if (header.href && settings["replaceURLwithGroupsURL"] == true) {
                                        header.href = header.href.replace("communities", "groups")
                                    }
                                    header.innerHTML = header.innerHTML.replace("Community", newNameWithoutEndingS)
                                }
                            }

                            let search_communities_link = document.querySelectorAll(".groups-list-search-input")
                            for (let i = 0; i < search_communities_link.length; i++) {
                                let header = search_communities_link[i]
                                if (header.placeholder.includes("Communities") && !(header.placeholder.includes(newName))) {
                                    if (header.href && settings["replaceURLwithGroupsURL"] == true) {
                                        header.href = header.href.replace("communities", "groups")
                                    }
                                    header.placeholder = header.placeholder.replace("Communities", `${newName}`)
                                }
                            }

                            let back_links = document.querySelectorAll(".back-link")
                            for (let i = 0; i < back_links.length; i++) {
                                let header = back_links[i]
                                if ((header.innerHTML.includes("Community") || header.innerHTML.includes("Communities"))) {
                                    header.innerHTML = header.innerHTML.replace("Community", newNameWithoutEndingS).replace("Communities", newName)
                                }
                            }

                            let font_bodies = document.querySelectorAll(".font-body")
                            for (let i = 0; i < font_bodies.length; i++) {
                                let header = font_bodies[i]
                                if ((header.innerHTML.includes("Community") || header.innerHTML.includes("Communities")) && !(header.innerHTML.includes(newNameWithoutEndingS))) {
                                    header.innerHTML = header.innerHTML.replace("Community", newNameWithoutEndingS).replace("Communities", newName)
                                }
                            }

                            let emphasises = document.querySelectorAll(".text-emphasis")
                            for (let i = 0; i < emphasises.length; i++) {
                                let header = emphasises[i]
                                if ((header.innerHTML.includes("Community") || header.innerHTML.includes("Communities")) && !(header.innerHTML.includes(newNameWithoutEndingS))) {
                                    header.innerHTML = header.innerHTML.replace("Community", newNameWithoutEndingS).replace("Communities", newName)
                                }
                            }

                            let text_contents = document.querySelectorAll(".text-content")
                            for (let i = 0; i < text_contents.length; i++) {
                                let header = text_contents[i]
                                if ((header.innerHTML.includes("Community") || header.innerHTML.includes("Communities")) && !(header.innerHTML.includes(newNameWithoutEndingS))) {
                                    header.innerHTML = header.innerHTML.replace("Community", newNameWithoutEndingS).replace("Communities", newName)
                                }
                            }

                            let all_links = document.querySelectorAll("a")
                            for (let i = 0; i < all_links.length; i++) {
                                let header = all_links[i]
                                if (header.href && header.href.includes("/communities") && !(header.innerHTML.includes(newName))) {
                                    if (settings["replaceURLwithGroupsURL"] == true) {
                                        header.href = header.href.replace("/communities", "/groups")
                                    }
                                }
                                if (header.getAttribute("ng-click") == "$ctrl.updateRole(role)") { continue; }
                                if (settings["massEdit"] == true) {
                                    if (header.innerHTML.includes("Community") && !(header.innerHTML.includes(newNameWithoutEndingS))) {
                                        header.innerHTML = header.innerHTML.replace("Community", newNameWithoutEndingS)
                                    }
                                }
                            }

                            let all_labels = document.querySelectorAll("label")
                            for (let i = 0; i < all_labels.length; i++) {
                                let header = all_labels[i]
                                if (settings["massEdit"] == true) {
                                    if ((header.innerHTML.includes("Community") || header.innerHTML.includes("Communities")) && !(header.innerHTML.includes(newNameWithoutEndingS))) {
                                        header.innerHTML = header.innerHTML.replace("Community", newNameWithoutEndingS).replace("Communities", newName)
                                    }
                                }
                            }

                            if (settings["replaceURLwithGroupsURL"] == true) {
                                if (window.location.pathname.includes("/communities") && !(window.location.href.includes("/configure"))) {
                                    window.history.pushState({ id: "100" }, newName, window.location.href.replace("/communities", "/groups"));
                                }
                            }

                            if (window.location.pathname.includes("/communities") || window.location.pathname.includes("/groups")) {    
                                if (settings["changeTitleHtml"] == true) {
                                    let titles = document.querySelectorAll("title")
                                    for (let i = 0; i < titles.length; i++) {
                                        let header = titles[i]
                                        if (header.textContent.includes("Communities")) {
                                            header.textContent = header.textContent.replaceAll("Communities", newName)
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