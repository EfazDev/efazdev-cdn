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
                chrome.storage.local.set({ "group_ownership_v2": {} }, () => {
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
                                            renderApprovedList();
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
                    if (!(error.toString() && error.toString().includes("aborted"))) {
                        console.warn(error);
                        alert("There was an issue trying to save approved user JSON!")
                    }
                }
            });
        }

        const approvedListContain = document.getElementById("approved_user_list");
        const addUsrBtn = document.getElementById("add_user_btn");
        const clearAllUsrBtn = document.getElementById("clear_all_users_btn");
        const userInputField = document.getElementById("approved_user_id");
        const userColorField = document.getElementById("approved_user_color");
        function renderApprovedList() {
            chrome.storage.local.get(["user_approved_json"], (result) => {
                let approvedData = result.user_approved_json || {};
                if (approvedListContain) {
                    approvedListContain.innerHTML = ""; 
                    for (let k in approvedData) {
                        let user = approvedData[k];
                        let listItem = document.createElement("div");
                        listItem.style.display = "flex";
                        listItem.style.justifyContent = "space-between";
                        listItem.style.alignItems = "center";
                        listItem.style.margin = "0 0 10px 0";
                        listItem.style.paddingBottom = "10px";
                        listItem.style.borderBottom = "1px solid rgba(255,255,255,0.1)";
                        listItem.style.width = "100%";
                        let textContainer = document.createElement("div");
                        textContainer.style.margin = "0";
                        textContainer.innerHTML = `
                            <span style="color: ${user.hexColor}; font-weight: bold; font-size: 15px;">${user.displayName}</span> 
                            <span style="font-size: 12px; opacity: 0.8;">(@${user.name} - ID: ${user.id})</span>
                            <br><span style="font-size: 12px;">Groups Cached: ${user.approve_groups ? user.approve_groups.length : 0}</span>
                        `;
                        let btnWrapper = document.createElement("span");
                        btnWrapper.className = "gradient-border";
                        let removeBtn = document.createElement("button");
                        removeBtn.textContent = "Remove";
                        removeBtn.addEventListener("click", () => {
                            delete approvedData[k];
                            chrome.storage.local.set({ "user_approved_json": approvedData }, () => {
                                renderApprovedList(); 
                            });
                        });
                        btnWrapper.appendChild(removeBtn);
                        listItem.appendChild(textContainer);
                        listItem.appendChild(btnWrapper);
                        approvedListContain.appendChild(listItem);
                    }
                }
            });
        }
        if (approvedListContain) renderApprovedList();
        if (addUsrBtn && userInputField) {
            addUsrBtn.addEventListener("click", async () => {
                let newId = userInputField.value.trim();
                let hexColor = userColorField.value; 
                if (newId !== "" && !isNaN(newId)) {
                    addUsrBtn.disabled = true;
                    addUsrBtn.textContent = "Fetching Data..";
                    try {
                        let startTime = performance.now();
                        let userRes = await fetch(`https://users.roblox.com/v1/users/${newId}`);
                        if (!userRes.ok) throw new Error("Invalid User ID");
                        let userData = await userRes.json();
                        let groupsRes = await fetch(`https://groups.roblox.com/v1/users/${newId}/groups/roles`);
                        let groupsData = await groupsRes.json();
                        let approve_groups = [];
                        if (groupsData && groupsData.data) {
                            for (let g of groupsData.data) {
                                if (g.group && g.group.owner && g.group.owner.userId === userData.id) {
                                    let groupInfo = { ...g.group };
                                    groupInfo.owner = {
                                        hasVerifiedBadge: false,
                                        userId: userData.id,
                                        username: userData.name,
                                        displayName: userData.displayName
                                    };
                                    if (groupInfo.description === undefined) groupInfo.description = "";
                                    if (groupInfo.publicEntryAllowed === undefined) groupInfo.publicEntryAllowed = true;
                                    if (groupInfo.hasSocialModules === undefined) groupInfo.hasSocialModules = true;
                                    if (groupInfo.isBuildersClubOnly === undefined) groupInfo.isBuildersClubOnly = false;
                                    approve_groups.push(groupInfo);
                                }
                            }
                        }
                        let endTime = performance.now();
                        let builtUserCache = {
                            name: userData.name,
                            id: userData.id,
                            displayName: userData.displayName,
                            hexColor: hexColor,
                            approve_groups: approve_groups,
                            scan_timestamp: Math.floor(Date.now() / 1000),
                            scan_duration: parseFloat(((endTime - startTime) / 1000).toFixed(2))
                        };
                        chrome.storage.local.get(["user_approved_json"], (result) => {
                            let approvedData = result.user_approved_json || {};
                            approvedData[newId] = builtUserCache; 
                            chrome.storage.local.set({ "user_approved_json": approvedData }, () => {
                                userInputField.value = ""; 
                                renderApprovedList(); 
                            });
                        });
                    } catch (error) {
                        console.error(error);
                        alert("Failed to fetch user data! Please ensure the Roblox User ID is valid.");
                    } finally {
                        addUsrBtn.disabled = false;
                        addUsrBtn.textContent = "Add User";
                    }
                } else {
                    alert("Please enter a valid numeric Roblox User ID!");
                }
            });
        }
        if (clearAllUsrBtn) {
            clearAllUsrBtn.addEventListener("click", () => {
                if (confirm("Are you sure you want to clear all approved users? This cannot be undone.")) {
                    chrome.storage.local.set({ "user_approved_json": {} }, () => {
                        renderApprovedList();
                    });
                }
            });
        }
    })
})()