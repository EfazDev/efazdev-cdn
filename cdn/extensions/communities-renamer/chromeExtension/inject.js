/* 

Efaz's Roblox Communities Renamer
By: EfazDev
Page: https://www.efaz.dev/roblox-communities-rename

inject.js:
    - Content script that replaces Charts with Discover/Games

*/

(function () { // Prevent changes made using the Inspect console.
    const storage = chrome.storage.sync;

    try {
        storage.get(["communities_renamer"], function (items) {
            var enabled = true;
            if (items["communities_renamer"]) {
                if (typeof (items["communities_renamer"]["enabled"]) == "boolean") { enabled = items["communities_renamer"]["enabled"] };
            } else {
                items["communities_renamer"] = {
                    "enabled": true,
                    "newName": "Groups",
                    "replaceURLwithGroupsURL": true,
                    "changeTitleHtml": true,
                    "loopSeconds": "100"
                }
            }
            if (enabled == true) {
                var tab = window.location
                if (tab.href) {
                    if (tab.hostname == "www.roblox.com") {
                        function injectRename(settings) {
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

                            var sidebar_headers = document.getElementsByClassName("font-header-2 dynamic-ellipsis-item")
                            for (let i = 0; i < sidebar_headers.length; i++) {
                                var header = sidebar_headers[i]
                                if (!(header.innerHTML.includes(newName)) && header.innerHTML.includes("Communities")) {
                                    if (header.href && settings["replaceURLwithGroupsURL"] == true) {
                                        header.href = header.href.replace("communities", "groups")
                                    }
                                    header.innerHTML = newName
                                }
                            }

                            var sidebar_link_headers = document.getElementsByClassName("dynamic-overflow-container text-nav")
                            for (let i = 0; i < sidebar_link_headers.length; i++) {
                                var header = sidebar_link_headers[i]
                                if (!(header.innerHTML.includes(newName)) && header.innerHTML.includes("Communities")) {
                                    if (header.href && settings["replaceURLwithGroupsURL"] == true) {
                                        header.href = header.href.replace("communities", "groups")
                                    }
                                    header.innerHTML = newName
                                }
                            }

                            var search_headers = document.getElementsByClassName("section-title ng-binding ng-scope font-header-1")
                            for (let i = 0; i < search_headers.length; i++) {
                                var header = search_headers[i]
                                if (!(header.innerHTML.includes(newName)) && header.innerHTML.includes("Communities")) {
                                    if (header.href && settings["replaceURLwithGroupsURL"] == true) {
                                        header.href = header.href.replace("communities", "groups")
                                    }
                                    header.innerHTML = header.innerHTML.replace("Communities", newName)
                                }
                            }

                            var friends_headers = document.getElementsByClassName("ng-binding")
                            for (let i = 0; i < friends_headers.length; i++) {
                                var header = friends_headers[i]
                                if (!(header.innerHTML.includes(newName)) && header.innerHTML.includes("Communities")) {
                                    if (header.href && settings["replaceURLwithGroupsURL"] == true) {
                                        header.href = header.href.replace("communities", "groups")
                                    }
                                    header.innerHTML = header.innerHTML.replace("Communities", newName)
                                }
                            }

                            var my_communities_link = document.getElementsByClassName("btn-secondary-xs btn-more see-all-link-icon ng-binding ng-scope")
                            for (let i = 0; i < my_communities_link.length; i++) {
                                var header = my_communities_link[i]
                                if (!(header.innerHTML.includes(newName)) && header.innerHTML.includes("Communities")) {
                                    if (header.href && settings["replaceURLwithGroupsURL"] == true) {
                                        header.href = header.href.replace("communities", "groups")
                                    }
                                    header.innerHTML = header.innerHTML.replace("Communities", newName)
                                }
                            }

                            var create_community_button = document.getElementsByClassName("btn-secondary-md create-group-button ng-binding")
                            for (let i = 0; i < create_community_button.length; i++) {
                                var header = create_community_button[i]
                                if (!(header.innerHTML.includes(newNameWithoutEndingS)) && header.innerHTML.includes("Community")) {
                                    if (header.href && settings["replaceURLwithGroupsURL"] == true) {
                                        header.href = header.href.replace("communities", "groups")
                                    }
                                    header.innerHTML = header.innerHTML.replace("Community", newNameWithoutEndingS)
                                }
                            }

                            var most_text_frames = document.getElementsByClassName("ng-binding")
                            for (let i = 0; i < most_text_frames.length; i++) {
                                var header = most_text_frames[i]
                                if (!(header.innerHTML.includes(newNameWithoutEndingS)) && header.innerHTML.includes("Community")) {
                                    if (header.href && settings["replaceURLwithGroupsURL"] == true) {
                                        header.href = header.href.replace("communities", "groups")
                                    }
                                    header.innerHTML = header.innerHTML.replace("Community", newNameWithoutEndingS)
                                }
                            }

                            var small_create_community_text = document.getElementsByClassName("small text create-group-text ng-binding ng-scope")
                            for (let i = 0; i < small_create_community_text.length; i++) {
                                var header = small_create_community_text[i]
                                if (!(header.innerHTML.includes(newName.toLowerCase())) && header.innerHTML.includes("communities")) {
                                    if (header.href && settings["replaceURLwithGroupsURL"] == true) {
                                        header.href = header.href.replace("communities", "groups")
                                    }
                                    header.innerHTML = header.innerHTML.replace("communities", newName.toLowerCase())
                                }
                            }

                            var transaction_page_summary = document.getElementsByClassName("summary-transaction-label")
                            for (let i = 0; i < transaction_page_summary.length; i++) {
                                var header = transaction_page_summary[i]
                                if (!(header.innerHTML.includes(newNameWithoutEndingS)) && header.innerHTML.includes("Community")) {
                                    if (header.href && settings["replaceURLwithGroupsURL"] == true) {
                                        header.href = header.href.replace("communities", "groups")
                                    }
                                    header.innerHTML = header.innerHTML.replace("Community", newNameWithoutEndingS)
                                }
                            }

                            var selected_labels = document.getElementsByClassName("rbx-selection-label")
                            for (let i = 0; i < selected_labels.length; i++) {
                                var header = selected_labels[i]
                                if (!(header.innerHTML.includes(newNameWithoutEndingS)) && header.innerHTML.includes("Community")) {
                                    if (header.href && settings["replaceURLwithGroupsURL"] == true) {
                                        header.href = header.href.replace("communities", "groups")
                                    }
                                    header.innerHTML = header.innerHTML.replace("Community", newNameWithoutEndingS)
                                }
                            }

                            var item_descriptions = document.getElementsByClassName("item-description")
                            for (let i = 0; i < item_descriptions.length; i++) {
                                var header = item_descriptions[i]
                                if (!(header.innerHTML.includes(newNameWithoutEndingS)) && header.innerHTML.includes("Community")) {
                                    if (header.href && settings["replaceURLwithGroupsURL"] == true) {
                                        header.href = header.href.replace("communities", "groups")
                                    }
                                    header.innerHTML = header.innerHTML.replace("Community", newNameWithoutEndingS)
                                }
                            }

                            var shout_community_button = document.getElementsByClassName("btn-secondary-md group-form-button ng-binding")
                            for (let i = 0; i < shout_community_button.length; i++) {
                                var header = shout_community_button[i]
                                if (!(header.innerHTML.includes(newNameWithoutEndingS)) && header.innerHTML.includes("Community")) {
                                    if (header.href && settings["replaceURLwithGroupsURL"] == true) {
                                        header.href = header.href.replace("communities", "groups")
                                    }
                                    header.innerHTML = header.innerHTML.replace("Community", newNameWithoutEndingS)
                                }
                            }

                            var previous_names = document.getElementsByClassName("text-pastname ng-binding")
                            for (let i = 0; i < previous_names.length; i++) {
                                var header = previous_names[i]
                                if (!(header.innerHTML.includes(newNameWithoutEndingS)) && header.innerHTML.includes("Community")) {
                                    if (header.href && settings["replaceURLwithGroupsURL"] == true) {
                                        header.href = header.href.replace("communities", "groups")
                                    }
                                    header.innerHTML = header.innerHTML.replace("Community", newNameWithoutEndingS)
                                }
                            }

                            var search_communities_link = document.getElementsByClassName("form-control input-field ng-pristine")
                            for (let i = 0; i < search_communities_link.length; i++) {
                                var header = search_communities_link[i]
                                if (!(header.placeholder.includes(newName)) && header.placeholder.includes("Communities")) {
                                    if (header.href && settings["replaceURLwithGroupsURL"] == true) {
                                        header.href = header.href.replace("communities", "groups")
                                    }
                                    header.placeholder = header.placeholder.replace("Communities", `${newName}`)
                                }
                            }

                            var all_links = document.getElementsByTagName("a")
                            for (let i = 0; i < all_links.length; i++) {
                                var header = all_links[i]
                                if (header.href && header.href.includes("/communities") && !(header.innerHTML.includes(newName))) {
                                    if (settings["replaceURLwithGroupsURL"] == true) {
                                        header.href = header.href.replace("/communities", "/groups")
                                    }
                                }
                                if (!(header.innerHTML.includes(newNameWithoutEndingS)) && header.innerHTML.includes("Community")) {
                                    header.innerHTML = header.innerHTML.replace("Community", newNameWithoutEndingS)
                                }
                            }

                            if (settings["replaceURLwithGroupsURL"] == true) {
                                if (window.location.pathname.includes("/communities")) {
                                    window.history.pushState({ id: "100" }, newName, window.location.href.replace("/communities", "/groups"));
                                }
                            }

                            if (window.location.pathname.includes("/communities") || window.location.pathname.includes("/groups")) {
                                var page_headers = document.getElementsByClassName("games-list-header")
                                for (let i = 0; i < page_headers.length; i++) {
                                    var header = page_headers[i]
                                    if (!(header.innerHTML.includes(newName))) {
                                        for (let e = 0; e < header.children.length; e++) {
                                            var child = header.children[e]
                                            if (!(child.innerHTML.includes(newName))) {
                                                child.innerHTML = `${newName}`
                                            }
                                        }
                                    }
                                }

                                if (settings["changeTitleHtml"] == true) {
                                    var titles = document.getElementsByTagName("title")
                                    for (let i = 0; i < titles.length; i++) {
                                        var header = titles[i]
                                        if (header.innerText.includes("Communities")) {
                                            header.innerText = header.innerText.replaceAll("Communities", newName)
                                        }
                                    }
                                }
                            }

                            setTimeout(() => { injectRename(settings) }, amountOfSecondsBeforeLoop)
                        }
                        injectRename(items["communities_renamer"])
                    }
                }
            }
        });
    } catch (err) {
        console.warn(`Failed to insert rename into this tab. Error Message: ${err.message}`)
    }
}())