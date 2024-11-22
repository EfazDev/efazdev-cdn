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
                    "changeTitleHtml": true
                }
            }
            if (enabled == true) {
                var tab = window.location
                if (tab.href) {
                    if (tab.hostname == "www.roblox.com") {
                        function injectRename(settings) {
                            var newName = settings["newName"];
                            var newNameWithoutEndingS = settings["newName"].endsWith("s") ? settings["newName"].slice(0, -1) : settings["newName"];

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
                                if (!(header.innerText.includes(newName)) && header.innerText.includes("Communities")) {
                                    if (header.href && settings["replaceURLwithGroupsURL"] == true) {
                                        header.href = header.href.replace("communities", "groups")
                                    }
                                    header.innerText = newName
                                }
                            }

                            var sidebar_link_headers = document.getElementsByClassName("dynamic-overflow-container text-nav")
                            for (let i = 0; i < sidebar_link_headers.length; i++) {
                                var header = sidebar_link_headers[i]
                                if (!(header.innerText.includes(newName)) && header.innerText.includes("Communities")) {
                                    if (header.href && settings["replaceURLwithGroupsURL"] == true) {
                                        header.href = header.href.replace("communities", "groups")
                                    }
                                    header.innerText = newName
                                }
                            }

                            var search_headers = document.getElementsByClassName("section-title ng-binding ng-scope font-header-1")
                            for (let i = 0; i < search_headers.length; i++) {
                                var header = search_headers[i]
                                if (!(header.innerText.includes(newName)) && header.innerText.includes("Communities")) {
                                    if (header.href && settings["replaceURLwithGroupsURL"] == true) {
                                        header.href = header.href.replace("communities", "groups")
                                    }
                                    header.innerText = header.innerText.replace("Communities", newName)
                                }
                            }

                            var friends_headers = document.getElementsByClassName("ng-binding")
                            for (let i = 0; i < friends_headers.length; i++) {
                                var header = friends_headers[i]
                                if (!(header.innerText.includes(newName)) && header.innerText.includes("Communities")) {
                                    if (header.href && settings["replaceURLwithGroupsURL"] == true) {
                                        header.href = header.href.replace("communities", "groups")
                                    }
                                    header.innerText = header.innerText.replace("Communities", newName)
                                }
                            }

                            var my_communities_link = document.getElementsByClassName("btn-secondary-xs btn-more see-all-link-icon ng-binding ng-scope")
                            for (let i = 0; i < my_communities_link.length; i++) {
                                var header = my_communities_link[i]
                                if (!(header.innerText.includes(newName)) && header.innerText.includes("Communities")) {
                                    if (header.href && settings["replaceURLwithGroupsURL"] == true) {
                                        header.href = header.href.replace("communities", "groups")
                                    }
                                    header.innerText = header.innerText.replace("Communities", newName)
                                }
                            }

                            var create_community_button = document.getElementsByClassName("btn-secondary-md create-group-button ng-binding")
                            for (let i = 0; i < create_community_button.length; i++) {
                                var header = create_community_button[i]
                                if (!(header.innerText.includes(newNameWithoutEndingS)) && header.innerText.includes("Community")) {
                                    if (header.href && settings["replaceURLwithGroupsURL"] == true) {
                                        header.href = header.href.replace("communities", "groups")
                                    }
                                    header.innerText = header.innerText.replace("Community", newNameWithoutEndingS)
                                }
                            }

                            var shout_community_button = document.getElementsByClassName("btn-secondary-md group-form-button ng-binding")
                            for (let i = 0; i < shout_community_button.length; i++) {
                                var header = shout_community_button[i]
                                if (!(header.innerText.includes(newNameWithoutEndingS)) && header.innerText.includes("Community")) {
                                    if (header.href && settings["replaceURLwithGroupsURL"] == true) {
                                        header.href = header.href.replace("communities", "groups")
                                    }
                                    header.innerText = header.innerText.replace("Community", newNameWithoutEndingS)
                                }
                            }

                            var previous_names = document.getElementsByClassName("text-pastname ng-binding")
                            for (let i = 0; i < previous_names.length; i++) {
                                var header = previous_names[i]
                                if (!(header.innerText.includes(newNameWithoutEndingS)) && header.innerText.includes("Community")) {
                                    if (header.href && settings["replaceURLwithGroupsURL"] == true) {
                                        header.href = header.href.replace("communities", "groups")
                                    }
                                    header.innerText = header.innerText.replace("Community", newNameWithoutEndingS)
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
                                if (header.href && header.href.includes("/communities") && !(header.innerText.includes(newName))) {
                                    if (settings["replaceURLwithGroupsURL"] == true) {
                                        header.href = header.href.replace("/communities", "/groups")
                                    }
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
                                            if (!(child.innerText.includes(newName))) {
                                                child.innerText = `${newName}`
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

                            setTimeout(() => { injectRename(settings) }, 100)
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