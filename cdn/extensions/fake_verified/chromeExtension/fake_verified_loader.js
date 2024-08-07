var enabled = true;
var allow_messages = false;
var stored_user_data = null;
var stored_group_data = null;
var start_time = 75;
var stop_loop = false;

function load() {
    load2()
}

function load2() {
    setTimeout(function () {
        try { start() } catch (err) { console.warn(err) }
    }, start_time)
}

function start() {
    function logMessage(message) {
        if (allow_messages == true) { console.log(`Verified Badge Loader: ${message}`) }
    }

    function generateVerifiedIcon(closet, orgMargin, orgX, orgY, margin, sizeX, sizeY) {
        var res = closet
        if ((typeof (orgMargin) == "number") && (typeof (margin) == "number")) {
            res = res.replace(`margin-left: ${orgMargin}px;`, `margin-left: ${margin}px;`)
        }
        if ((typeof (orgX) == "number") && (typeof (sizeX) == "number")) {
            res = res.replace(`width: ${orgX}px;`, `width: ${sizeX}px;`)
        }
        if ((typeof (orgY) == "number") && (typeof (sizeY) == "number")) {
            res = res.replace(`height: ${orgY}px;`, `height: ${sizeY}px;`)
        }
        return res
    }

    function verifiedBadgePlacedAlready(html) {
        return (html.includes("data-rblx-badge-icon") || html.includes("secured-apples-verified-badge-button") || html.includes("Verified Badge Icon"))
    }

    if (enabled) {
        /* All of these HTML variables are extracted from the Roblox Website and modified to be functioned like the actual badge. */
        var profile_html = `<span role="button" tabindex="0" data-rblx-verified-badge-icon="" data-rblx-badge-icon="true" class="jss16"><img class="profile-verified-badge-icon" src="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28' fill='none'%3E%3Cg clip-path='url(%23clip0_8_46)'%3E%3Crect x='5.88818' width='22.89' height='22.89' transform='rotate(15 5.88818 0)' fill='%230066FF'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M20.543 8.7508L20.549 8.7568C21.15 9.3578 21.15 10.3318 20.549 10.9328L11.817 19.6648L7.45 15.2968C6.85 14.6958 6.85 13.7218 7.45 13.1218L7.457 13.1148C8.058 12.5138 9.031 12.5138 9.633 13.1148L11.817 15.2998L18.367 8.7508C18.968 8.1498 19.942 8.1498 20.543 8.7508Z' fill='white'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_8_46'%3E%3Crect width='28' height='28' fill='white'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E" title="[input_id]" alt="[input_id]"></span>`;
        var name_html = `<img class="verified-badge-icon-catalog-item-rendered" src="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28' fill='none'%3E%3Cg clip-path='url(%23clip0_8_46)'%3E%3Crect x='5.88818' width='22.89' height='22.89' transform='rotate(15 5.88818 0)' fill='%230066FF'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M20.543 8.7508L20.549 8.7568C21.15 9.3578 21.15 10.3318 20.549 10.9328L11.817 19.6648L7.45 15.2968C6.85 14.6958 6.85 13.7218 7.45 13.1218L7.457 13.1148C8.058 12.5138 9.031 12.5138 9.633 13.1148L11.817 15.2998L18.367 8.7508C18.968 8.1498 19.942 8.1498 20.543 8.7508Z' fill='white'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_8_46'%3E%3Crect width='28' height='28' fill='white'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E" title="Verified Badge Icon" alt="Verified Badge Icon">`;
        var name_html_larger = `<span role="button" tabindex="0" secured-apples-verified-badge-button="yessss" data-rblx-verified-badge-icon="" data-rblx-badge-icon="true" class="jss292"><img class="verified-badge-icon-group-shout-rendered" src="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28' fill='none'%3E%3Cg clip-path='url(%23clip0_8_46)'%3E%3Crect x='5.88818' width='22.89' height='22.89' transform='rotate(15 5.88818 0)' fill='%230066FF'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M20.543 8.7508L20.549 8.7568C21.15 9.3578 21.15 10.3318 20.549 10.9328L11.817 19.6648L7.45 15.2968C6.85 14.6958 6.85 13.7218 7.45 13.1218L7.457 13.1148C8.058 12.5138 9.031 12.5138 9.633 13.1148L11.817 15.2998L18.367 8.7508C18.968 8.1498 19.942 8.1498 20.543 8.7508Z' fill='white'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_8_46'%3E%3Crect width='28' height='28' fill='white'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E" title="Verified Badge Icon" alt="Verified Badge Icon"></span>`;
        var name_side_html = `<img src="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28' fill='none'%3E%3Cg clip-path='url(%23clip0_8_46)'%3E%3Crect x='5.88818' width='22.89' height='22.89' transform='rotate(15 5.88818 0)' fill='%230066FF'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M20.543 8.7508L20.549 8.7568C21.15 9.3578 21.15 10.3318 20.549 10.9328L11.817 19.6648L7.45 15.2968C6.85 14.6958 6.85 13.7218 7.45 13.1218L7.457 13.1148C8.058 12.5138 9.031 12.5138 9.633 13.1148L11.817 15.2998L18.367 8.7508C18.968 8.1498 19.942 8.1498 20.543 8.7508Z' fill='white'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_8_46'%3E%3Crect width='28' height='28' fill='white'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E" title="Verified Badge Icon" alt="Verified Badge Icon" style="margin-left: 2px;width: 12px;height: 12px; background: none !important;">`;
        var name_side_real_html = `<img src="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28' fill='none'%3E%3Cg clip-path='url(%23clip0_8_46)'%3E%3Crect x='5.88818' width='22.89' height='22.89' transform='rotate(15 5.88818 0)' fill='%230066FF'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M20.543 8.7508L20.549 8.7568C21.15 9.3578 21.15 10.3318 20.549 10.9328L11.817 19.6648L7.45 15.2968C6.85 14.6958 6.85 13.7218 7.45 13.1218L7.457 13.1148C8.058 12.5138 9.031 12.5138 9.633 13.1148L11.817 15.2998L18.367 8.7508C18.968 8.1498 19.942 8.1498 20.543 8.7508Z' fill='white'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_8_46'%3E%3Crect width='28' height='28' fill='white'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E" title="Verified Badge Icon" alt="Verified Badge Icon" style="margin-left: 2px;width: 18px;height: 18px; background: none !important;">`;
        var prompt_html = `<div role="dialog" id="fake_verified_badge"><div class="modal-backdrop in"></div><div role="dialog" tabindex="-1" class="in modal" style="display: block;"><div class="modal-window modal-sm modal-dialog"><div class="modal-content" role="document"><div class="modal-header"><button type="button" class="close" title="close" onclick="document.getElementById('fake_verified_badge').remove()"><span class="icon-close"></span></button><h4 class="modal-title">Verified Badge Add-on</h4></div><div class="modal-body"><div><div><span role="button" tabindex="0" data-rblx-verified-badge-icon="" data-rblx-badge-icon="true" class="hz-centered-badge-container"><img class=" jss272" src="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28' fill='none'%3E%3Cg clip-path='url(%23clip0_8_46)'%3E%3Crect x='5.88818' width='22.89' height='22.89' transform='rotate(15 5.88818 0)' fill='%23FF4B00'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M20.543 8.7508L20.549 8.7568C21.15 9.3578 21.15 10.3318 20.549 10.9328L11.817 19.6648L7.45 15.2968C6.85 14.6958 6.85 13.7218 7.45 13.1218L7.457 13.1148C8.058 12.5138 9.031 12.5138 9.633 13.1148L11.817 15.2998L18.367 8.7508C18.968 8.1498 19.942 8.1498 20.543 8.7508Z' fill='white'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_8_46'%3E%3Crect width='28' height='28' fill='white'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E" title="Verified Badge" alt="Verified Badge"></span></div><div>This badge identifies that the user is using Efaz's Roblox Verified Badge Add-on! Please know that that the verified badge is not real and is visually added.</div></div></div><div class="modal-footer"><div class="loading"></div><div class="modal-buttons"><button type="button" class="modal-button btn-primary-md btn-min-width" onclick="window.location.replace('https://en.help.roblox.com/hc/en-us/articles/7997207259156')">Learn More</button><button type="button" class="modal-button btn-control-md btn-min-width" onclick="document.getElementById('fake_verified_badge').remove()">Close</button></div></div></div></div></div></div>`;
        var game_html = `<span role="button" tabindex="0" secured-apples-verified-badge-button="yessss" data-rblx-verified-badge-icon="" data-rblx-badge-icon="true" class="jss4"><img class="verified-badge-icon-experience-creator" style="margin-left: 4px;width: 16px;height: 16px;" src="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28' fill='none'%3E%3Cg clip-path='url(%23clip0_8_46)'%3E%3Crect x='5.88818' width='22.89' height='22.89' transform='rotate(15 5.88818 0)' fill='%230066FF'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M20.543 8.7508L20.549 8.7568C21.15 9.3578 21.15 10.3318 20.549 10.9328L11.817 19.6648L7.45 15.2968C6.85 14.6958 6.85 13.7218 7.45 13.1218L7.457 13.1148C8.058 12.5138 9.031 12.5138 9.633 13.1148L11.817 15.2998L18.367 8.7508C18.968 8.1498 19.942 8.1498 20.543 8.7508Z' fill='white'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_8_46'%3E%3Crect width='28' height='28' fill='white'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E" title="Verified Badge Icon" alt="Verified Badge Icon"></span>`;
        var name_small_html = `<span><span role="button" tabindex="0" data-rblx-verified-badge-icon="" secured-apples-verified-badge-button="yessss" data-rblx-badge-icon="true" class="jss22"><img class="verified-badge-icon-member-card-rendered" src="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28' fill='none'%3E%3Cg clip-path='url(%23clip0_8_46)'%3E%3Crect x='5.88818' width='22.89' height='22.89' transform='rotate(15 5.88818 0)' fill='%230066FF'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M20.543 8.7508L20.549 8.7568C21.15 9.3578 21.15 10.3318 20.549 10.9328L11.817 19.6648L7.45 15.2968C6.85 14.6958 6.85 13.7218 7.45 13.1218L7.457 13.1148C8.058 12.5138 9.031 12.5138 9.633 13.1148L11.817 15.2998L18.367 8.7508C18.968 8.1498 19.942 8.1498 20.543 8.7508Z' fill='white'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_8_46'%3E%3Crect width='28' height='28' fill='white'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E" title="Verified Badge Icon" alt="Verified Badge Icon"></span></span>`;
        var group_name_verified_html = `<span role="button" tabindex="0" data-rblx-verified-badge-icon="" secured-apples-verified-badge-button="yessss" data-rblx-badge-icon="true" class="jss250"><img class="verified-badge-icon-group-name-rendered" src="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28' fill='none'%3E%3Cg clip-path='url(%23clip0_8_46)'%3E%3Crect x='5.88818' width='22.89' height='22.89' transform='rotate(15 5.88818 0)' fill='%230066FF'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M20.543 8.7508L20.549 8.7568C21.15 9.3578 21.15 10.3318 20.549 10.9328L11.817 19.6648L7.45 15.2968C6.85 14.6958 6.85 13.7218 7.45 13.1218L7.457 13.1148C8.058 12.5138 9.031 12.5138 9.633 13.1148L11.817 15.2998L18.367 8.7508C18.968 8.1498 19.942 8.1498 20.543 8.7508Z' fill='white'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_8_46'%3E%3Crect width='28' height='28' fill='white'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E" title="Verified Badge Icon" alt="Verified Badge Icon"></span>`;
        var group_owner_name_html = `<span><span role="button" tabindex="0" data-rblx-verified-badge-icon="" secured-apples-verified-badge-button="yessss" data-rblx-badge-icon="true" class="verified-badge-icon-group-owner-container"><img class="verified-badge-icon-group-owner-rendered" style="margin-left: 4px;" src="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28' fill='none'%3E%3Cg clip-path='url(%23clip0_8_46)'%3E%3Crect x='5.88818' width='22.89' height='22.89' transform='rotate(15 5.88818 0)' fill='%230066FF'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M20.543 8.7508L20.549 8.7568C21.15 9.3578 21.15 10.3318 20.549 10.9328L11.817 19.6648L7.45 15.2968C6.85 14.6958 6.85 13.7218 7.45 13.1218L7.457 13.1148C8.058 12.5138 9.031 12.5138 9.633 13.1148L11.817 15.2998L18.367 8.7508C18.968 8.1498 19.942 8.1498 20.543 8.7508Z' fill='white'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_8_46'%3E%3Crect width='28' height='28' fill='white'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E" title="Verified Badge Icon" alt="Verified Badge Icon"></span></span>`;
        var reseller_html = `<span><span role="button" tabindex="0" data-rblx-verified-badge-icon="" secured-apples-verified-badge-button="yessss" data-rblx-badge-icon="true" class="jss22"><img class="verified-badge-icon-item-resellers-rendered" src="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28' fill='none'%3E%3Cg clip-path='url(%23clip0_8_46)'%3E%3Crect x='5.88818' width='22.89' height='22.89' transform='rotate(15 5.88818 0)' fill='%230066FF'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M20.543 8.7508L20.549 8.7568C21.15 9.3578 21.15 10.3318 20.549 10.9328L11.817 19.6648L7.45 15.2968C6.85 14.6958 6.85 13.7218 7.45 13.1218L7.457 13.1148C8.058 12.5138 9.031 12.5138 9.633 13.1148L11.817 15.2998L18.367 8.7508C18.968 8.1498 19.942 8.1498 20.543 8.7508Z' fill='white'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_8_46'%3E%3Crect width='28' height='28' fill='white'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E" title="Verified Badge Icon" alt="Verified Badge Icon"></span></span>`;
        /* All of these HTML variables are extracted from the Roblox Website and modified to be functioned like the actual badge. */

        /* Apply color changes to HTML above */
        if (window.verifiedCheckmarkSettings) {
            var custom_checkmark_color = window.verifiedCheckmarkSettings["color"]
            if (custom_checkmark_color) {
                custom_checkmark_color = custom_checkmark_color.replace("#", "%23");
                profile_html = profile_html.replace("%230066FF", custom_checkmark_color);
                name_html = name_html.replace("%230066FF", custom_checkmark_color);
                name_html_larger = name_html_larger.replace("%230066FF", custom_checkmark_color);
                name_side_real_html = name_side_real_html.replace("%230066FF", custom_checkmark_color);
                name_side_html = name_side_html.replace("%230066FF", custom_checkmark_color);
                game_html = game_html.replace("%230066FF", custom_checkmark_color);
                name_small_html = name_small_html.replace("%230066FF", custom_checkmark_color);
                group_name_verified_html = group_name_verified_html.replace("%230066FF", custom_checkmark_color);
                group_owner_name_html = group_owner_name_html.replace("%230066FF", custom_checkmark_color);
                reseller_html = reseller_html.replace("%230066FF", custom_checkmark_color);
            }
        }
        /* Apply color changes to HTML above */

        async function getUserData() {
            if (stored_user_data) {
                return stored_user_data
            } else {
                return fetch("https://users.roblox.com/v1/users/authenticated", {
                    "headers": {
                        "accept": "application/json",
                        "accept-language": "en-US,en;q=0.9",
                        "cache-control": "no-cache",
                        "pragma": "no-cache"
                    },
                    "method": "GET",
                    "mode": "cors",
                    "credentials": "include"
                }).then(res => {
                    return res.json()
                }).then(json => {
                    stored_user_data = json
                    return json
                });
            }
        }
        getUserData()
            .then(res => {
                if (res) {
                    return res
                } else {
                    return {};
                }
            })
            .then(json => {
                if (json["id"]) {
                    var userId = json["id"];
                    var include_groups = false;
                    var group_scan = false;

                    if (window.verifiedCheckmarkSettings) {
                        if (window.verifiedCheckmarkSettings["groupsIncluded"] == true) {
                            include_groups = true;
                        }
                    }

                    async function approvedGroup(id, onlycached) {
                        if (typeof chrome !== 'undefined' && typeof chrome.storage !== 'undefined') {
                            try {
                                return chrome.storage.sync.get("group_ownership").then((allowed_groups) => {
                                    if (!(typeof (allowed_groups["group_ownership"]) == "object")) {
                                        allowed_groups["group_ownership"] = {}
                                    }

                                    if (typeof (allowed_groups["group_ownership"][id]) == "object") {
                                        return allowed_groups["group_ownership"][id]
                                    } else if (allowed_groups["group_ownership"][id] == false) {
                                        return { "accepted": false }
                                    } else {
                                        if (onlycached == true) {
                                            return { "accepted": false }
                                        } else {
                                            if (group_scan == true) {
                                                return { "accepted": false }
                                            }
                                            group_scan = true
                                            return fetch(`https://groups.roblox.com/v1/users/${userId}/groups/roles?includeLocked=true&includeNotificationPreferences=true`, { "mode": "cors", "credentials": "include" }).then(grou_res => {
                                                if (grou_res.ok) {
                                                    return grou_res.json();
                                                } else {
                                                    return null
                                                }
                                            }).then(grou_resjson => {
                                                if (grou_resjson) {
                                                    if (grou_resjson["data"]) {
                                                        grou_resjson["data"].forEach((grou_json) => {
                                                            grou_json = grou_json["group"]
                                                            if (grou_json["owner"]["userId"] == userId) {
                                                                grou_json["accepted"] = true
                                                                allowed_groups["group_ownership"][grou_json["id"]] = grou_json
                                                            } else {
                                                                allowed_groups["group_ownership"][grou_json["id"]] = false
                                                            }
                                                        })
                                                        if (allowed_groups["group_ownership"][id]) {
                                                            return chrome.storage.sync.set(allowed_groups).then(() => {
                                                                logMessage("Saved to chrome storage!")
                                                                group_scan = false
                                                                if (allowed_groups["group_ownership"][id] == false) {
                                                                    return { "accepted": false }
                                                                } else {
                                                                    return allowed_groups["group_ownership"][id]
                                                                }
                                                            })
                                                        } else {
                                                            return { "accepted": false }
                                                        }
                                                    } else {
                                                        return { "accepted": false }
                                                    }
                                                } else {
                                                    return { "accepted": false }
                                                }
                                            });
                                        }
                                    }
                                })
                            } catch (err) {
                                if (err.toString().includes("Extension context")) {
                                    return { "accepted": false }
                                } else {
                                    console.warn(`Error with getting approved group: ${err}`)
                                    return { "accepted": false }
                                }
                            }
                        } else {
                            if (!(typeof (stored_group_data["group_ownership"]) == "object")) {
                                stored_group_data["group_ownership"] = {}
                            }

                            if (typeof (stored_group_data["group_ownership"][id]) == "object") {
                                return stored_group_data["group_ownership"][id]
                            } else if (stored_group_data["group_ownership"][id] == false) {
                                return { "accepted": false }
                            } else {
                                if (onlycached == true) {
                                    return { "accepted": false }
                                } else {
                                    if (group_scan == true) {
                                        return { "accepted": false }
                                    }
                                    group_scan = true
                                    return fetch(`https://groups.roblox.com/v1/users/${userId}/groups/roles?includeLocked=true&includeNotificationPreferences=true`, { "mode": "cors", "credentials": "include" }).then(grou_res => {
                                        if (grou_res.ok) {
                                            return grou_res.json();
                                        } else {
                                            return null
                                        }
                                    }).then(grou_resjson => {
                                        if (grou_resjson) {
                                            if (grou_resjson["data"]) {
                                                grou_resjson["data"].forEach((grou_json) => {
                                                    grou_json = grou_json["group"]
                                                    if (grou_json["owner"]["userId"] == userId) {
                                                        grou_json["accepted"] = true
                                                        stored_group_data["group_ownership"][grou_json["id"]] = grou_json
                                                    } else {
                                                        stored_group_data["group_ownership"][grou_json["id"]] = false
                                                    }
                                                })
                                                if (stored_group_data["group_ownership"][id]) {
                                                    logMessage("Saved to local storage!")
                                                    group_scan = false
                                                    if (stored_group_data["group_ownership"][id] == false) {
                                                        return { "accepted": false }
                                                    } else {
                                                        return stored_group_data["group_ownership"][id]
                                                    }
                                                } else {
                                                    return { "accepted": false }
                                                }
                                            } else {
                                                return { "accepted": false }
                                            }
                                        } else {
                                            return { "accepted": false }
                                        }
                                    });
                                }
                            }
                        }
                    }

                    function promptMessage() {
                        if (window.verifiedCheckmarkSettings) {
                            var verified_prompt_enabled = window.verifiedCheckmarkSettings["verifiedPrompt"];
                            var use_roblox_prompt = false;
                            if (verified_prompt_enabled == true) {
                                if (use_roblox_prompt == true) {
                                    const placeholder = document.createRange().createContextualFragment(`<div>${prompt_html}</div>`);
                                    if (!(document.getElementById("fake_verified_badge"))) {
                                        document.body.appendChild(placeholder.children[0].children[0]);
                                    }
                                } else {
                                    const placeholder = document.createRange().createContextualFragment(`<div>${prompt_html}</div>`);
                                    if (!(document.getElementById("fake_verified_badge"))) {
                                        document.body.appendChild(placeholder.children[0].children[0]);
                                    }
                                }
                            }
                        }
                    }

                    function addPromptButtonInput() {
                        var list_item = document.getElementsByTagName("span");
                        list_item = Array.prototype.slice.call(list_item);

                        if (list_item.length > 0) {
                            list_item.forEach((verified_badge_contain) => {
                                if (verified_badge_contain.getAttribute("secured-apples-verified-badge-button")) {
                                    if (verified_badge_contain.getAttribute("secured-apples-verified-badge-button") == "yessss") {
                                        verified_badge_contain.setAttribute("secured-apples-verified-badge-button", "nooooo")
                                        verified_badge_contain.addEventListener("click", promptMessage);
                                    }
                                }
                            });
                        }
                    }

                    if (enabled == true) {
                        profile_html = profile_html.replace("[input_id]", userId).replace("[input_id]", userId).replace("[input_id]", userId).replace("[input_id]", userId);

                        if (window.location.pathname == `/users/${userId}/profile` || window.location.pathname == `/users/${userId}/profile/`) {
                            var main_headers = document.getElementsByClassName("header-title");
                            main_headers = Array.prototype.slice.call(main_headers);
                            if (main_headers.length > 0) {
                                var premium_logos = document.getElementsByClassName("premium-badge-right-aligned");
                                premium_logos = Array.prototype.slice.call(premium_logos);
                                if (premium_logos.length > 0) {
                                    premium_logos.forEach((premium) => {
                                        premium.remove();
                                    });
                                }
                                main_headers.forEach((main_header) => {
                                    if (verifiedBadgePlacedAlready(main_header.innerHTML)) {
                                        return;
                                    }
                                    main_header.innerHTML = main_header.innerHTML + profile_html;
                                });
                            }
                        }

                        var name_on_side = document.getElementsByClassName("font-header-2 dynamic-ellipsis-item");
                        name_on_side = Array.prototype.slice.call(name_on_side);
                        if (name_on_side.length > 0) {
                            name_on_side.forEach((main_name_on_side) => {
                                if (main_name_on_side.outerHTML.includes(json["displayName"])) {
                                    if (verifiedBadgePlacedAlready(main_name_on_side.outerHTML)) {
                                        return;
                                    }
                                    main_name_on_side.innerHTML = `${main_name_on_side.innerHTML} ${name_side_real_html}`;
                                }
                            });
                        }

                        var group_owners = document.getElementsByClassName("text-link ng-binding ng-scope");
                        group_owners = Array.prototype.slice.call(group_owners);
                        if (group_owners.length > 0) {
                            function applyCallback() {
                                var group_owners = document.getElementsByClassName("text-link ng-binding ng-scope");
                                group_owners = Array.prototype.slice.call(group_owners);
                                group_owners.forEach((group_owner_name) => {
                                    if (group_owner_name.outerHTML.includes(json["displayName"]) && group_owner_name.href == `https://www.roblox.com/users/${userId}/profile`) {
                                        if (!(verifiedBadgePlacedAlready(group_owner_name.parentElement.innerHTML))) {
                                            group_owner_name.outerHTML = `${group_owner_name.outerHTML}${group_owner_name_html}`;
                                        }

                                        if (window.verifiedCheckmarkSettings) {
                                            if (window.verifiedCheckmarkSettings["groupsIncluded"] == true) {
                                                var group_name = document.getElementsByClassName("group-name text-overflow ng-binding ng-scope");
                                                group_name = Array.prototype.slice.call(group_name);
                                                if (group_name.length > 0) {
                                                    group_name.forEach((main_name_on_group) => {
                                                        if (verifiedBadgePlacedAlready(main_name_on_group.innerHTML)) {
                                                            return
                                                        }
                                                        main_name_on_group.innerHTML = `${main_name_on_group.innerHTML} ${group_name_verified_html}`;
                                                    });
                                                }
                                            }
                                        }
                                    }
                                });

                                var group_payouts_auto = document.getElementsByClassName("avatar-card-name text-lead text-overflow ng-binding ng-scope");
                                group_payouts_auto = Array.prototype.slice.call(group_payouts_auto);
                                if (group_payouts_auto.length > 0) {
                                    group_payouts_auto.forEach((main_name_on_group) => {
                                        if (main_name_on_group.innerHTML.includes(json["displayName"]) && main_name_on_group.href.includes(`${userId}`)) {
                                            if (verifiedBadgePlacedAlready(main_name_on_group.parentElement.innerHTML)) {
                                                return
                                            }
                                            main_name_on_group.innerHTML = `${main_name_on_group.innerHTML} ${generateVerifiedIcon(name_side_html, 2, 12, 12, -1, 16, 16)}`;
                                        }
                                    });
                                }

                                var name_in_group = document.getElementsByClassName("text-overflow font-caption-header member-name ng-binding ng-scope");
                                name_in_group = Array.prototype.slice.call(name_in_group);
                                if (name_in_group.length > 0) {
                                    name_in_group.forEach((main_name_on_group) => {
                                        if (main_name_on_group.innerHTML.includes(json["displayName"])) {
                                            if (main_name_on_group.offsetParent.offsetParent.id == `member-${userId}`) {
                                                if (verifiedBadgePlacedAlready(main_name_on_group.innerHTML)) {
                                                    return;
                                                }
                                                main_name_on_group.innerHTML = `${main_name_on_group.innerHTML} ${generateVerifiedIcon(name_side_html, 2, 12, 12, 0, 16, 16)}`
                                            }
                                        }
                                    });
                                }

                                var group_shouts = document.getElementsByClassName("text-name name ng-binding ng-scope");
                                group_shouts = Array.prototype.slice.call(group_shouts);
                                if (group_shouts.length > 0) {
                                    var shout = group_shouts[0];
                                    if (shout.outerHTML.includes(json["displayName"]) && shout.href == `https://www.roblox.com/users/${userId}/profile`) {
                                        if (shout.parentElement.innerHTML.includes("data-rblx-verified-badge-icon")) {
                                            return
                                        }
                                        shout.outerHTML = `${shout.outerHTML} ${name_html_larger}`;
                                    }
                                }

                                if (window.verifiedCheckmarkSettings) {
                                    if (window.verifiedCheckmarkSettings["groupsIncluded"] == true) {
                                        var group_list_verified_logo = document.getElementsByTagName("groups-list-item");
                                        group_list_verified_logo = Array.prototype.slice.call(group_list_verified_logo);
                                        if (group_list_verified_logo.length > 0) {
                                            group_list_verified_logo.forEach((main_name_on_group) => {
                                                if (main_name_on_group.parentElement.getAttribute("ng-repeat")) {
                                                    if (main_name_on_group.parentElement.getAttribute("ng-repeat").includes("filter: { isOwner: true }")) {
                                                        if (main_name_on_group.children[0] && main_name_on_group.children[0].children[0] && main_name_on_group.children[0].children[0].children[1]) {
                                                            main_name_on_group = main_name_on_group.children[0].children[0].children[1];
                                                            if (verifiedBadgePlacedAlready(main_name_on_group.innerHTML)) {
                                                                return;
                                                            }
                                                            main_name_on_group.innerHTML = `${main_name_on_group.innerHTML} ${name_side_html}`;
                                                        }
                                                    }
                                                } else if (main_name_on_group.parentElement.className.includes("primary-group")) {
                                                    if (main_name_on_group.children[0] && main_name_on_group.children[0].children[0] && main_name_on_group.children[0].children[0].children[1]) {
                                                        main_name_on_group = main_name_on_group.children[0].children[0].children[1];
                                                        if (verifiedBadgePlacedAlready(main_name_on_group.innerHTML)) {
                                                            return;
                                                        }
                                                        main_name_on_group.innerHTML = `${main_name_on_group.innerHTML} ${name_side_html}`;
                                                    }
                                                }
                                            });
                                        }
                                    }
                                }

                                setTimeout(() => {
                                    var list_item = document.getElementsByClassName("group-comments vlist");
                                    list_item = Array.prototype.slice.call(list_item);
                                    if (list_item.length > 0) {
                                        var group_list_comments = list_item[0];
                                        applied_updating_v2 = true;
                                        var observer = new MutationObserver(() => {
                                            var group_wall = document.getElementsByClassName("text-name ng-binding ng-scope");
                                            group_wall = Array.prototype.slice.call(group_wall);
                                            if (group_wall.length > 0) {
                                                group_wall.forEach((main_name_on_group) => {
                                                    if (main_name_on_group.outerHTML.includes(json["displayName"]) && main_name_on_group.className == "text-name ng-binding ng-scope" && main_name_on_group.href == `https://www.roblox.com/users/${userId}/profile`) {
                                                        if (verifiedBadgePlacedAlready(main_name_on_group.innerHTML)) {
                                                            return;
                                                        }
                                                        main_name_on_group.innerHTML = `${main_name_on_group.innerHTML} ${generateVerifiedIcon(name_side_html, 2, 12, 12, 0, 16, 16)}`;
                                                    }
                                                });
                                            }
                                        });
                                        observer.observe(group_list_comments, { attributes: true, childList: true });
                                        logMessage("Installed observer: 3")
                                    }

                                    setTimeout(() => {
                                        var group_div = document.getElementsByClassName("ng-scope");
                                        group_div = Array.prototype.slice.call(group_div);
                                        if (group_div.length > 0) {
                                            group_div.forEach((user_container) => {
                                                if ((user_container.className == "ng-scope" || user_container.className == "btr-group-container ng-scope btr-hasGames btr-hasPayouts") && user_container.getAttribute("ng-if") == "!isLockedGroup() && !isGroupRestrictedByPolicy() && !layout.loadGroupMetadataError") {
                                                    var observer = new MutationObserver(applyCallback);
                                                    observer.observe(user_container, { attributes: true, childList: true });
                                                    logMessage("Installed observer: 1")
                                                }
                                            });
                                        }
                                    }, start_time);

                                    setTimeout(() => {
                                        var member_list = document.getElementsByClassName("hlist");
                                        member_list = Array.prototype.slice.call(member_list);
                                        if (member_list.length > 1) {
                                            var group_list_comments = member_list[1];
                                            applied_updating_v2 = true;
                                            var observer = new MutationObserver(applyCallback);
                                            observer.observe(group_list_comments, { attributes: true, childList: true });
                                            logMessage("Installed observer: 2")
                                        }
                                        addPromptButtonInput()
                                    }, start_time)
                                    addPromptButtonInput()
                                }, start_time);
                            }
                            var applied_updating = false;
                            var applied_updating_v2 = false;
                            group_owners.forEach((group_owner_name) => {
                                if (group_owner_name.innerHTML.includes(json["displayName"]) && group_owner_name.href == `https://www.roblox.com/users/${userId}/profile`) {
                                    if (!(verifiedBadgePlacedAlready(group_owner_name.parentElement.innerHTML))) {
                                        group_owner_name.outerHTML = `${group_owner_name.outerHTML}${group_owner_name_html}`;
                                    }

                                    if (window.verifiedCheckmarkSettings) {
                                        if (window.verifiedCheckmarkSettings["groupsIncluded"] == true) {
                                            var group_name = document.getElementsByClassName("group-name text-overflow ng-binding ng-scope");
                                            group_name = Array.prototype.slice.call(group_name);
                                            if (group_name.length > 0) {
                                                group_name.forEach((main_name_on_group) => {
                                                    if (verifiedBadgePlacedAlready(main_name_on_group.innerHTML)) {
                                                        return;
                                                    }
                                                    main_name_on_group.innerHTML = `${main_name_on_group.innerHTML}${group_name_verified_html}`;
                                                });
                                            }
                                        }
                                    }

                                    if (applied_updating == false) {
                                        var group_headers = document.getElementsByClassName("group-title");
                                        group_headers = Array.prototype.slice.call(group_headers);
                                        if (group_headers.length > 0) {
                                            var group_header = group_headers[1];
                                            applied_updating = true;
                                            var observer = new MutationObserver(applyCallback);
                                            observer.observe(group_header, { attributes: true, childList: true });
                                        }
                                    }
                                }
                            });

                            if (window.verifiedCheckmarkSettings) {
                                if (window.verifiedCheckmarkSettings["groupsIncluded"] == true) {
                                    var group_list_verified_logo = document.getElementsByTagName("groups-list-item");
                                    group_list_verified_logo = Array.prototype.slice.call(group_list_verified_logo);
                                    if (group_list_verified_logo.length > 0) {
                                        group_list_verified_logo.forEach((main_name_on_group) => {
                                            if (main_name_on_group.parentElement.getAttribute("ng-repeat")) {
                                                if (main_name_on_group.parentElement.getAttribute("ng-repeat").includes("filter: { isOwner: true }")) {
                                                    if (main_name_on_group.children[0] && main_name_on_group.children[0].children[0] && main_name_on_group.children[0].children[0].children[1]) {
                                                        main_name_on_group = main_name_on_group.children[0].children[0].children[1];
                                                        if (verifiedBadgePlacedAlready(main_name_on_group.innerHTML)) {
                                                            return;
                                                        }
                                                        main_name_on_group.innerHTML = `${main_name_on_group.innerHTML} ${name_side_html}`;
                                                    }
                                                }
                                            } else if (main_name_on_group.parentElement.className.includes("primary-group")) {
                                                if (main_name_on_group.children[0] && main_name_on_group.children[0].children[0] && main_name_on_group.children[0].children[0].children[1]) {
                                                    main_name_on_group = main_name_on_group.children[0].children[0].children[1];
                                                    if (verifiedBadgePlacedAlready(main_name_on_group.innerHTML)) {
                                                        return;
                                                    }
                                                    main_name_on_group.innerHTML = `${main_name_on_group.innerHTML} ${name_side_html}`;
                                                }
                                            }
                                        });
                                    }
                                }
                            }

                            var group_shouts = document.getElementsByClassName("text-name name ng-binding ng-scope");
                            group_shouts = Array.prototype.slice.call(group_shouts);
                            if (group_shouts.length > 0) {
                                var shout = group_shouts[0];
                                if (shout.outerHTML.includes(json["displayName"]) && shout.href == `https://www.roblox.com/users/${userId}/profile`) {
                                    if (verifiedBadgePlacedAlready(shout.parentElement.outerHTML)) {
                                        return;
                                    }
                                    shout.outerHTML = `${shout.outerHTML} ${name_html_larger}`;
                                }
                            }

                            var group_payouts_auto = document.getElementsByClassName("avatar-card-name text-lead text-overflow ng-binding ng-scope");
                            group_payouts_auto = Array.prototype.slice.call(group_payouts_auto);
                            if (group_payouts_auto.length > 0) {
                                group_payouts_auto.forEach((main_name_on_group) => {
                                    if (main_name_on_group.innerHTML.includes(json["displayName"]) && main_name_on_group.href.includes(`${userId}`)) {
                                        if (verifiedBadgePlacedAlready(main_name_on_group.parentElement.innerHTML)) {
                                            return
                                        }
                                        main_name_on_group.innerHTML = `${main_name_on_group.innerHTML} ${generateVerifiedIcon(name_side_html, 2, 12, 12, -1, 16, 16)}`;
                                    }
                                });
                            }

                            setTimeout(() => {
                                var name_in_group = document.getElementsByClassName("text-overflow font-caption-header member-name ng-binding ng-scope");
                                name_in_group = Array.prototype.slice.call(name_in_group);
                                if (name_in_group.length > 0) {
                                    name_in_group.forEach((main_name_on_group) => {
                                        if (main_name_on_group.innerHTML.includes(json["displayName"])) {
                                            if (main_name_on_group.offsetParent.offsetParent.id == `member-${userId}`) {
                                                if (verifiedBadgePlacedAlready(main_name_on_group.innerHTML)) {
                                                    return;
                                                }
                                                main_name_on_group.innerHTML = `${main_name_on_group.innerHTML} ${name_side_html}`;

                                            }
                                        }
                                    });
                                }
                            }, start_time)

                            var group_wall = document.getElementsByClassName("text-name ng-binding ng-scope");
                            group_wall = Array.prototype.slice.call(group_wall);
                            if (group_wall.length > 0) {
                                group_wall.forEach((main_name_on_group) => {
                                    if (main_name_on_group.outerHTML.includes(json["displayName"]) && main_name_on_group.className == "text-name ng-binding ng-scope" && main_name_on_group.href == `https://www.roblox.com/users/${userId}/profile`) {
                                        if (verifiedBadgePlacedAlready(main_name_on_group.parentElement.outerHTML)) {
                                            return;
                                        }
                                        main_name_on_group.outerHTML = `${main_name_on_group.outerHTML} ${generateVerifiedIcon(name_side_html, 2, 14, 14, 0, 16, 16)}`;
                                    }
                                });
                            }

                            setTimeout(() => {
                                var member_list = document.getElementsByClassName("hlist");
                                member_list = Array.prototype.slice.call(member_list);
                                if (member_list.length > 1) {
                                    var group_list_comments = member_list[1];
                                    applied_updating_v2 = true;
                                    var observer = new MutationObserver(applyCallback);
                                    observer.observe(group_list_comments, { attributes: true, childList: true });
                                    logMessage("Installed observer: hlist-v2")
                                }
                            }, start_time);

                            setTimeout(() => {
                                var list_item = document.getElementsByClassName("group-comments vlist");
                                list_item = Array.prototype.slice.call(list_item);
                                if (list_item.length > 0) {
                                    var group_list_comments = list_item[0];
                                    applied_updating_v2 = true;
                                    var observer = new MutationObserver(() => {
                                        var group_wall = document.getElementsByClassName("text-name ng-binding ng-scope");
                                        group_wall = Array.prototype.slice.call(group_wall);
                                        if (group_wall.length > 0) {
                                            group_wall.forEach((main_name_on_group) => {
                                                if (main_name_on_group.outerHTML.includes(json["displayName"]) && main_name_on_group.className == "text-name ng-binding ng-scope" && main_name_on_group.href == `https://www.roblox.com/users/${userId}/profile`) {
                                                    if (verifiedBadgePlacedAlready(main_name_on_group.innerHTML)) {
                                                        return;
                                                    }
                                                    main_name_on_group.innerHTML = `${main_name_on_group.innerHTML} ${generateVerifiedIcon(name_side_html, 2, 12, 12, 0, 16, 16)}`;
                                                }
                                            });
                                        }
                                    });
                                    observer.observe(group_list_comments, { attributes: true, childList: true });
                                    logMessage("Installed observer: text-name")
                                }

                                setTimeout(() => {
                                    var group_div = document.getElementsByClassName("ng-scope");
                                    group_div = Array.prototype.slice.call(group_div);
                                    if (group_div.length > 0) {
                                        group_div.forEach((user_container) => {
                                            if ((user_container.className == "ng-scope" || user_container.className == "btr-group-container ng-scope btr-hasGames btr-hasPayouts") && user_container.getAttribute("ng-if") == "!isLockedGroup() && !isGroupRestrictedByPolicy() && !layout.loadGroupMetadataError") {
                                                var observer = new MutationObserver(applyCallback);
                                                observer.observe(user_container, { attributes: true, childList: true });
                                            }
                                        });
                                    }
                                }, start_time);
                            }, start_time);

                            if (applied_updating_v2 == false) {
                                var list_item = document.getElementsByClassName("tab-content rbx-tab-content col-xs-12");
                                list_item = Array.prototype.slice.call(list_item);
                                if (list_item.length > 0) {
                                    var group_list_header = list_item[0];
                                    applied_updating_v2 = true;
                                    var observer = new MutationObserver(applyCallback);
                                    observer.observe(group_list_header, { attributes: true, childList: true });
                                }
                            }
                        }

                        var username_containers = document.getElementsByClassName("user-name-container");
                        username_containers = Array.prototype.slice.call(username_containers);
                        if (username_containers.length > 0) {
                            username_containers.forEach((user_container) => {
                                if (user_container.innerHTML.includes(json["displayName"])) {
                                    if (verifiedBadgePlacedAlready(user_container.innerHTML)) {
                                        return;
                                    }
                                    user_container.innerHTML = `${user_container.innerHTML} ${name_html}`;
                                }
                            });
                        }

                        function applyAutoChangeFunctionB() {
                            setTimeout(function () {
                                var username_containers_2 = document.getElementsByClassName("creator-name text-link");
                                username_containers_2 = Array.prototype.slice.call(username_containers_2);
                                if (username_containers_2.length > 0) {
                                    username_containers_2.forEach((user_container) => {
                                        if (user_container.outerHTML.includes(`@${json["name"]}`) && user_container.className == "creator-name text-link") {
                                            user_container.outerHTML = `${user_container.outerHTML} ${generateVerifiedIcon(name_side_html, 2, null, null, -1)}`;
                                        }
                                        if (include_groups == true) {
                                            if (user_container.className == "creator-name text-link") {
                                                if (user_container.href && user_container.href.includes("/groups/")) {
                                                    var group_id = user_container.href.match(/[0-9]+/)[0];
                                                    approvedGroup(group_id).then((info) => {
                                                        if (info["accepted"] == true) {
                                                            if (user_container.className == "creator-name text-link") {
                                                                if (user_container.outerHTML.includes(info["name"])) {
                                                                    if (verifiedBadgePlacedAlready(user_container.parentElement.outerHTML)) {
                                                                        return;
                                                                    }
                                                                    user_container.outerHTML = `${user_container.outerHTML} ${generateVerifiedIcon(name_side_html, 2, null, null, -1)}`;
                                                                }
                                                            }
                                                        }
                                                    })
                                                }
                                            }
                                        }
                                    });
                                }

                                var username_containers_7 = document.getElementsByClassName("avatar-name text-overflow ng-binding");
                                username_containers_7 = Array.prototype.slice.call(username_containers_7);
                                if (username_containers_7.length > 0) {
                                    username_containers_7.forEach((user_container) => {
                                        if (user_container.outerHTML.includes(`${json["displayName"]}`) && user_container.className == "avatar-name text-overflow ng-binding") {
                                            if (user_container.parentElement.parentElement.children[1].outerHTML.includes(`@${json["name"]}`)) {
                                                if (verifiedBadgePlacedAlready(user_container.parentElement.parentElement.parentElement.outerHTML)) {
                                                    return;
                                                }
                                                user_container.outerHTML = `${user_container.outerHTML} ${name_small_html}`;
                                            }
                                        }
                                    });
                                }

                                var username_containers_8 = document.getElementsByClassName("text-overflow avatar-name ng-binding ng-scope");
                                username_containers_8 = Array.prototype.slice.call(username_containers_8);
                                if (username_containers_8.length > 0) {
                                    username_containers_8.forEach((user_container) => {
                                        if (user_container.outerHTML.includes(`${json["displayName"]}`) && user_container.className == "text-overflow avatar-name ng-binding ng-scope") {
                                            var username_containers_9 = document.getElementsByClassName("text-overflow avatar-card-label ng-binding ng-scope");
                                            username_containers_9 = Array.prototype.slice.call(username_containers_9);
                                            if (username_containers_9.length > 0) {
                                                username_containers_9.forEach((user_container_2) => {
                                                    if (user_container.offsetParent == user_container_2.offsetParent) {
                                                        if (user_container_2.innerText == `@${json["name"]}`) {
                                                            if (verifiedBadgePlacedAlready(user_container.parentElement.outerHTML)) {
                                                                return;
                                                            }
                                                            user_container.outerHTML = `${user_container.outerHTML} ${name_side_html}`;
                                                        }
                                                    }
                                                });
                                            }
                                        }
                                    });
                                }

                                setTimeout(function () {
                                    var list_item = document.getElementsByClassName("search-result avatar-cards ng-scope");
                                    list_item = Array.prototype.slice.call(list_item);
                                    if (list_item.length > 0) {
                                        var catalog_list_header = list_item[0];
                                        var observer = new MutationObserver(applyAutoChangeFunctionB);
                                        observer.observe(catalog_list_header, { childList: true });
                                    }

                                    addPromptButtonInput()
                                }, start_time);
                                addPromptButtonInput()
                            }, start_time);
                        }

                        function applyAutoChangeFunctionC() {
                            setTimeout(function () {
                                var username_containers_7 = document.getElementsByClassName("avatar-name text-overflow ng-binding");
                                username_containers_7 = Array.prototype.slice.call(username_containers_7);
                                if (username_containers_7.length > 0) {
                                    username_containers_7.forEach((user_container) => {
                                        if (user_container.outerHTML.includes(`${json["displayName"]}`) && user_container.className == "avatar-name text-overflow ng-binding") {
                                            if (user_container.parentElement.parentElement.children[1].outerHTML.includes(`@${json["name"]}`)) {
                                                if (verifiedBadgePlacedAlready(user_container.parentElement.parentElement.parentElement.outerHTML)) {
                                                    return;
                                                }
                                                user_container.outerHTML = `${user_container.outerHTML} ${name_small_html}`;
                                            }
                                        }
                                    });
                                }

                                var list_item = document.getElementsByClassName("hlist avatar-cards");
                                list_item = Array.prototype.slice.call(list_item);
                                if (list_item.length > 0) {
                                    var catalog_list_header = list_item[0];
                                    var observer = new MutationObserver(applyAutoChangeFunctionB);
                                    observer.observe(catalog_list_header, { childList: true });
                                }

                                addPromptButtonInput()
                            }, start_time);
                        }

                        function applyAutoChangeFunctionD() { // Unused since inventory doesn't show verified badges.
                            setTimeout(function () {
                                var username_containers_9 = document.getElementsByClassName("creator-name text-overflow text-link ng-binding");
                                username_containers_9 = Array.prototype.slice.call(username_containers_9);
                                if (username_containers_9.length > 0) {
                                    username_containers_9.forEach((user_container) => {
                                        if (user_container.outerHTML.includes(`@${json["name"]}`) && user_container.className == "creator-name text-overflow text-link ng-binding") {
                                            if (verifiedBadgePlacedAlready(user_container.parentElement.outerHTML)) {
                                                return;
                                            }
                                            user_container.outerHTML = `${user_container.outerHTML} ${name_side_html}`;
                                        }
                                        if (include_groups == true) {
                                            if (user_container.className == "creator-name text-overflow text-link ng-binding") {
                                                if (user_container.href && user_container.href.includes("/groups/")) {
                                                    var group_id = user_container.href.match(/[0-9]+/)[0];
                                                    approvedGroup(group_id).then((info) => {
                                                        if (info["accepted"] == true) {
                                                            if (user_container.className == "creator-name text-overflow text-link ng-binding") {
                                                                if (user_container.outerHTML.includes(info["name"])) {
                                                                    if (verifiedBadgePlacedAlready(user_container.parentElement.outerHTML)) {
                                                                        return;
                                                                    }
                                                                    user_container.outerHTML = `${user_container.outerHTML} ${name_side_html}`;
                                                                }
                                                            }
                                                        }
                                                    })
                                                }
                                            }
                                        }
                                    });
                                }

                                var list_item = document.getElementById("assetsItems");
                                if (list_item) {
                                    var catalog_list_header = list_item;
                                    var observer = new MutationObserver(applyAutoChangeFunctionD);
                                    observer.observe(catalog_list_header, { childList: true });
                                }
                            }, start_time);
                        }

                        function applyAutoChangeFunctionE() {
                            setTimeout(function () {
                                var username_containers_10 = document.getElementsByClassName("text-name username ng-binding");
                                username_containers_10 = Array.prototype.slice.call(username_containers_10);
                                if (username_containers_10.length > 0) {
                                    username_containers_10.forEach((user_container) => {
                                        if (user_container.outerHTML.includes(`${json["name"]}`) && user_container.className == "text-name username ng-binding") {
                                            if (verifiedBadgePlacedAlready(user_container.parentElement.outerHTML)) {
                                                return;
                                            }
                                            user_container.outerHTML = `${user_container.outerHTML} ${reseller_html}`;
                                        }
                                    });
                                }

                                var list_item = document.getElementsByClassName("resellers");
                                list_item = Array.prototype.slice.call(list_item);
                                if (list_item.length > 0) {
                                    var catalog_list_header = list_item[0];
                                    var observer = new MutationObserver(applyAutoChangeFunctionE);
                                    observer.observe(catalog_list_header, { childList: true });
                                }
                            }, start_time);
                        }

                        function applyAutoChangeFunctionF() {
                            setTimeout(function () {
                                var username_containers_11 = document.getElementsByClassName("text-overflow avatar-name");
                                username_containers_11 = Array.prototype.slice.call(username_containers_11);
                                if (username_containers_11.length > 0) {
                                    username_containers_11.forEach((user_container) => {
                                        if (user_container.outerHTML.includes(`${json["displayName"]}`) && user_container.href.includes(userId) && user_container.className == "text-overflow avatar-name") {
                                            if (verifiedBadgePlacedAlready(user_container.parentElement.outerHTML)) {
                                                return;
                                            }
                                            user_container.outerHTML = `${user_container.outerHTML} ${game_html}`;
                                        }
                                    });
                                }

                                var list_item = document.getElementsByClassName("hlist avatar-cards");
                                list_item = Array.prototype.slice.call(list_item);
                                if (list_item.length > 0) {
                                    var catalog_list_header = list_item[0];
                                    var observer = new MutationObserver(applyAutoChangeFunctionF);
                                    observer.observe(catalog_list_header, { childList: true });
                                }
                            }, start_time);
                        }

                        function applyAutoChangeFunctionG() {
                            setTimeout(function () {
                                var username_containers_12 = document.getElementsByClassName("text-overflow game-card-name ng-binding");
                                username_containers_12 = Array.prototype.slice.call(username_containers_12);
                                if (username_containers_12.length > 0) {
                                    username_containers_12.forEach((user_container) => {
                                        if (include_groups == true) {
                                            if (user_container.className == "text-overflow game-card-name ng-binding") {
                                                if (user_container.parentElement.parentElement.href && user_container.parentElement.parentElement.href.includes("/groups/")) {
                                                    var group_id = user_container.parentElement.parentElement.href.match(/[0-9]+/)[0];
                                                    approvedGroup(group_id, true).then((info) => {
                                                        if (info["accepted"] == true) {
                                                            if (user_container.className == "text-overflow game-card-name ng-binding") {
                                                                if (user_container.outerHTML.includes(info["name"])) {
                                                                    if (!(user_container.parentElement)) {
                                                                        return;
                                                                    }
                                                                    if (verifiedBadgePlacedAlready(user_container.parentElement.outerHTML)) {
                                                                        return;
                                                                    }
                                                                    user_container.outerHTML = `${user_container.outerHTML} ${generateVerifiedIcon(name_side_html, 2, 12, 12, 4, 16, 16)}`;
                                                                }
                                                            }
                                                        }
                                                    })
                                                }
                                            }
                                        }
                                    });
                                }

                                var username_containers_13 = document.getElementsByClassName("ng-binding slide-item-name text-overflow groups font-title");
                                username_containers_13 = Array.prototype.slice.call(username_containers_13);
                                if (username_containers_13.length > 0) {
                                    username_containers_13.forEach((user_container) => {
                                        if (include_groups == true) {
                                            if (user_container.className == "ng-binding slide-item-name text-overflow groups font-title") {
                                                if (user_container.parentElement.href && user_container.parentElement.href.includes("/groups/")) {
                                                    var group_id = user_container.parentElement.href.match(/[0-9]+/)[0];
                                                    approvedGroup(group_id, true).then((info) => {
                                                        if (info["accepted"] == true) {
                                                            if (user_container.className == "ng-binding slide-item-name text-overflow groups font-title") {
                                                                if (user_container.innerHTML.includes(info["name"])) {
                                                                    if (verifiedBadgePlacedAlready(user_container.parentElement.outerHTML)) {
                                                                        return;
                                                                    }
                                                                    user_container.innerHTML = `${user_container.innerHTML} ${generateVerifiedIcon(name_side_html, 2, 12, 12, 0, 28, 28)}`;
                                                                }
                                                            }
                                                        }
                                                    })
                                                }
                                            }
                                        }
                                    });
                                }

                                var list_item = document.getElementsByTagName("groups-showcase-grid");
                                list_item = Array.prototype.slice.call(list_item);
                                if (list_item.length > 0) {
                                    var catalog_list_header = list_item[0];
                                    var observer = new MutationObserver(applyAutoChangeFunctionG);
                                    observer.observe(catalog_list_header, { childList: true });
                                }

                                var list_item = document.getElementById("groups-switcher");
                                if (list_item) {
                                    var catalog_list_header = list_item;
                                    var observer = new MutationObserver(applyAutoChangeFunctionG);
                                    observer.observe(catalog_list_header, { childList: true });
                                }
                            }, start_time);
                        }

                        var username_containers_2 = document.getElementsByClassName("creator-name text-link");
                        username_containers_2 = Array.prototype.slice.call(username_containers_2);
                        if (username_containers_2.length > 0) {
                            username_containers_2.forEach((user_container) => {
                                if (user_container.outerHTML.includes(`@${json["name"]}`) && user_container.className == "creator-name text-link") {
                                    if (verifiedBadgePlacedAlready(user_container.parentElement.outerHTML)) {
                                        return;
                                    }
                                    user_container.outerHTML = `${user_container.outerHTML} ${generateVerifiedIcon(name_side_html, 2, null, null, -1)}`;
                                }
                                if (include_groups == true) {
                                    if (user_container.className == "creator-name text-link") {
                                        if (user_container.href && user_container.href.includes("/groups/")) {
                                            var group_id = user_container.href.match(/[0-9]+/)[0];
                                            approvedGroup(group_id).then((info) => {
                                                if (info["accepted"] == true) {
                                                    if (user_container.className == "creator-name text-link") {
                                                        if (user_container.outerHTML.includes(info["name"])) {
                                                            if (verifiedBadgePlacedAlready(user_container.parentElement.outerHTML)) {
                                                                return;
                                                            }
                                                            user_container.outerHTML = `${user_container.outerHTML} ${generateVerifiedIcon(name_side_html, 2, null, null, -1)}`;
                                                        }
                                                    }
                                                }
                                            })
                                        }
                                    }
                                }
                            });
                        }

                        var username_containers_3 = document.getElementsByClassName("text-name text-overflow");
                        username_containers_3 = Array.prototype.slice.call(username_containers_3);
                        if (username_containers_3.length > 0) {
                            username_containers_3.forEach((user_container) => {
                                if (user_container.outerHTML.includes(`@${json["name"]}`) && user_container.className == "text-name text-overflow") {
                                    if (verifiedBadgePlacedAlready(user_container.parentElement.outerHTML)) {
                                        return;
                                    }
                                    user_container.outerHTML = `${user_container.outerHTML}${game_html}`;
                                } else if (include_groups == true) {
                                    if (user_container.href && user_container.href.includes("/groups/")) {
                                        var group_id = user_container.href.match(/[0-9]+/)[0];
                                        approvedGroup(group_id).then((info) => {
                                            if (info["accepted"] == true && user_container.className == "text-name text-overflow") {
                                                if (user_container.outerHTML.includes(info["name"])) {
                                                    if (verifiedBadgePlacedAlready(user_container.parentElement.outerHTML)) {
                                                        return;
                                                    }
                                                    user_container.outerHTML = `${user_container.outerHTML}${game_html}`;
                                                }
                                            }
                                        })
                                    }
                                }
                            });
                        }

                        var username_containers_4 = document.getElementsByClassName("text-name");
                        username_containers_4 = Array.prototype.slice.call(username_containers_4);
                        if (username_containers_4.length > 0) {
                            username_containers_4.forEach((user_container) => {
                                if (user_container.parentElement.outerHTML.includes(`@${json["name"]}`) && user_container.className == "text-name") {
                                    if (verifiedBadgePlacedAlready(user_container.parentElement.parentElement.outerHTML)) {
                                        return;
                                    }
                                    user_container.parentElement.outerHTML = `${user_container.parentElement.outerHTML}${generateVerifiedIcon(game_html, 4,null,null, 2,null,null)}`;
                                } else if (include_groups == true) {
                                    if (user_container.href && user_container.href.includes("/groups/")) {
                                        var group_id = user_container.href.match(/[0-9]+/)[0];
                                        approvedGroup(group_id).then((info) => {
                                            if (info["accepted"] == true && user_container.className == "text-name") {
                                                if (!(user_container.parentElement)) {
                                                    return;
                                                }
                                                if (!(user_container.parentElement.parentElement)) {
                                                    return;
                                                }
                                                if (user_container.parentElement.outerHTML.includes(info["name"])) {
                                                    if (verifiedBadgePlacedAlready(user_container.parentElement.parentElement.outerHTML)) {
                                                        return;
                                                    }
                                                    user_container.parentElement.outerHTML = `${user_container.parentElement.outerHTML}${generateVerifiedIcon(game_html, 4,null,null, 2,null,null)}`;
                                                }
                                            }
                                        })
                                    }
                                }
                            });
                        }

                        var username_containers_5 = document.getElementsByClassName("text-overflow age-bracket-label-username font-caption-header");
                        username_containers_5 = Array.prototype.slice.call(username_containers_5);
                        if (username_containers_5.length > 0) {
                            username_containers_5.forEach((user_container) => {
                                if (user_container.outerHTML.includes(`${json["displayName"]}`) && user_container.className == "text-overflow age-bracket-label-username font-caption-header") {
                                    if (verifiedBadgePlacedAlready(user_container.parentElement.outerHTML)) {
                                        return;
                                    }
                                    user_container.outerHTML = `${user_container.outerHTML} ${name_side_html.replace("margin-left: 2px;width: 12px;height: 12px; background: none !important;", "margin-right: 6px; margin-left: -2px; width: 14px; height: 14px; background: none !important;")}`;
                                }
                            });
                        }

                        var username_containers_6 = document.getElementsByClassName("text-name name ng-binding");
                        username_containers_6 = Array.prototype.slice.call(username_containers_6);
                        if (username_containers_6.length > 0) {
                            username_containers_6.forEach((user_container) => {
                                if (user_container.outerHTML.includes(`${json["displayName"]}`) && user_container.className == "text-name name ng-binding") {
                                    if (verifiedBadgePlacedAlready(user_container.parentElement.outerHTML)) {
                                        return;
                                    }
                                    user_container.outerHTML = `${user_container.outerHTML} ${generateVerifiedIcon(name_side_html, 2, 12, 12, 4, 16, 16)}`;
                                }
                            });
                        }

                        var username_containers_7 = document.getElementsByClassName("avatar-name text-overflow ng-binding");
                        username_containers_7 = Array.prototype.slice.call(username_containers_7);
                        if (username_containers_7.length > 0) {
                            username_containers_7.forEach((user_container) => {
                                if (user_container.outerHTML.includes(`${json["displayName"]}`) && user_container.className == "avatar-name text-overflow ng-binding") {
                                    if (user_container.parentElement.parentElement.children[1].outerHTML.includes(`@${json["name"]}`)) {
                                        if (verifiedBadgePlacedAlready(user_container.parentElement.parentElement.parentElement.outerHTML)) {
                                            return;
                                        }
                                        user_container.outerHTML = `${user_container.outerHTML} ${name_small_html}`;
                                    }
                                }
                            });
                        }

                        setTimeout(function () {
                            var username_containers_8 = document.getElementsByClassName("text-overflow avatar-name ng-binding ng-scope");
                            username_containers_8 = Array.prototype.slice.call(username_containers_8);
                            if (username_containers_8.length > 0) {
                                username_containers_8.forEach((user_container) => {
                                    if (user_container.outerHTML.includes(`${json["displayName"]}`) && user_container.className == "text-overflow avatar-name ng-binding ng-scope") {
                                        var username_containers_9 = document.getElementsByClassName("text-overflow avatar-card-label ng-binding ng-scope");
                                        username_containers_9 = Array.prototype.slice.call(username_containers_9);
                                        if (username_containers_9.length > 0) {
                                            username_containers_9.forEach((user_container_2) => {
                                                if (user_container.offsetParent == user_container_2.offsetParent) {
                                                    if (user_container_2.innerText == `@${json["name"]}`) {
                                                        if (verifiedBadgePlacedAlready(user_container.parentElement.outerHTML)) {
                                                            return;
                                                        }
                                                        user_container.outerHTML = `${user_container.outerHTML} ${game_html}`;
                                                    }
                                                }
                                            });
                                        }
                                    }
                                });
                            }
                        }, start_time);

                        setTimeout(function () {
                            var list_item = document.getElementsByClassName("search-result avatar-cards ng-scope");
                            list_item = Array.prototype.slice.call(list_item);
                            if (list_item.length > 0) {
                                var catalog_list_header = list_item[0];
                                var observer = new MutationObserver(applyAutoChangeFunctionB);
                                observer.observe(catalog_list_header, { childList: true });
                                logMessage("Installed observer: search-result")
                            }
                        }, start_time);

                        var list_item = document.getElementsByClassName("hlist item-cards-stackable ng-scope");
                        list_item = Array.prototype.slice.call(list_item);
                        if (list_item.length > 0) {
                            var catalog_list_header = list_item[0];
                            var observer = new MutationObserver(applyAutoChangeFunctionB);
                            observer.observe(catalog_list_header, { childList: true });
                            logMessage("Installed observer: item-cards-stackable")
                        }

                        var list_item = document.getElementsByClassName("tab-content configure-group-details");
                        list_item = Array.prototype.slice.call(list_item);
                        if (list_item.length > 0) {
                            var catalog_list_header = list_item[0];
                            var observer = new MutationObserver(applyAutoChangeFunctionC);
                            observer.observe(catalog_list_header, { childList: true });
                            logMessage("Installed observer: group-detail")
                        }

                        var list_item = document.getElementsByClassName("hlist avatar-cards");
                        list_item = Array.prototype.slice.call(list_item);
                        if (list_item.length > 0) {
                            var catalog_list_header = list_item[0];
                            var observer = new MutationObserver(applyAutoChangeFunctionB);
                            observer.observe(catalog_list_header, { childList: true });
                            logMessage("Installed observer: hlist-avatar")
                        }

                        setTimeout(function () {
                            var list_item = document.getElementsByClassName("content");
                            list_item = Array.prototype.slice.call(list_item);
                            if (list_item.length > 0) {
                                var catalog_list_header = list_item[0];
                                var observer = new MutationObserver(applyAutoChangeFunctionB);
                                observer.observe(catalog_list_header, { childList: true });
                                logMessage("Installed observer: content")
                            }
                        }, start_time);

                        setTimeout(function () {
                            var list_item = document.getElementsByClassName("resellers");
                            list_item = Array.prototype.slice.call(list_item);
                            if (list_item.length > 0) {
                                var catalog_list_header = list_item[0];
                                var observer = new MutationObserver(applyAutoChangeFunctionE);
                                observer.observe(catalog_list_header, { childList: true });
                                applyAutoChangeFunctionE()
                                logMessage("Installed observer: resellers")
                            }
                        }, start_time);
                        applyAutoChangeFunctionF()
                        applyAutoChangeFunctionG()

                        setTimeout(addPromptButtonInput, start_time)

                        window.set_verified = true
                    }
                    logMessage("Successfully loaded verified badge system!")
                    if (stop_loop == false) {
                        load2()
                    }
                } else {
                    if (allow_messages == true) alert("Fake Verified Badge couldn't be applied since we couldn't figure what your User ID is.");
                }
            }).catch(err => {
                console.error(err.message);
                if (allow_messages == true) alert("We couldn't apply the verified badge due to an error! Sorry!");
            })
    }
}

function loader() { // Script Loader
    if (typeof chrome !== 'undefined' && typeof chrome.storage !== 'undefined') { // Chrome Extension >= v1.4.0
        chrome.storage.sync.get(["verified_checkmark_settings"], function (items) {
            if (items["verified_checkmark_settings"] && items["verified_checkmark_settings"]["color"]) {
                window.verifiedCheckmarkSettings = items["verified_checkmark_settings"]
            } else {
                window.verifiedCheckmarkSettings = {
                    "allowAlertMessages": false,
                    "color": "#0066ff",
                    "enabled": true,
                    "groupsIncluded": true,
                    "startTime": "75",
                    "thanks": true,
                    "verifiedPrompt": true,
                }
            }
            if (typeof (window.verifiedCheckmarkSettings["enabled"]) == "boolean") {
                enabled = window.verifiedCheckmarkSettings["enabled"];
            }
            if (typeof (window.verifiedCheckmarkSettings["allowedAlerts"]) == "boolean") {
                allow_messages = window.verifiedCheckmarkSettings["allowedAlerts"];
            }
            if (typeof (window.verifiedCheckmarkSettings["startTime"]) == "string") {
                if (Number(window.verifiedCheckmarkSettings["startTime"])) {
                    start_time = Number(window.verifiedCheckmarkSettings["startTime"]);
                }
            }
            window.addEventListener("DOMContentLoaded", load)
            console.log("Starting Verified Badge Loader: Settings Configuration v3")
            setTimeout(() => { stop_loop = true; }, 30000)
        })
    } else if (window.verifiedCheckmarkSettings) { // Chrome Extension < v1.4.0
        if (typeof (window.verifiedCheckmarkSettings["enabled"]) == "boolean") {
            enabled = window.verifiedCheckmarkSettings["enabled"];
        }
        if (typeof (window.verifiedCheckmarkSettings["allowedAlerts"]) == "boolean") {
            allow_messages = window.verifiedCheckmarkSettings["allowedAlerts"];
        }
        if (typeof (window.verifiedCheckmarkSettings["startTime"]) == "string") {
            if (Number(window.verifiedCheckmarkSettings["startTime"])) {
                start_time = Number(window.verifiedCheckmarkSettings["startTime"]);
            }
        }
        window.addEventListener("DOMContentLoaded", load)
        console.log("Starting Verified Badge Loader: Settings Configuration v2")
        setTimeout(() => { stop_loop = true; }, 30000)
    } else {  // Javascript URL / Chrome Console
        window.verifiedCheckmarkSettings = {
            "allowAlertMessages": false,
            "color": "#0066ff",
            "enabled": true,
            "groupsIncluded": true,
            "startTime": "75",
            "thanks": true,
            "verifiedPrompt": true,
        }
        if (typeof (window.verifiedCheckmarkSettings["allowedAlerts"]) == "boolean") {
            allow_messages = window.verifiedCheckmarkSettings["allowedAlerts"];
        }
        if (typeof (window.verifiedCheckmarkSettings["startTime"]) == "string") {
            if (Number(window.verifiedCheckmarkSettings["startTime"])) {
                start_time = Number(window.verifiedCheckmarkSettings["startTime"]);
            }
        }
        setTimeout(() => {load()}, start_time)
        console.log("Starting Verified Badge Loader: Settings Configuration v1")
        setTimeout(() => { stop_loop = true; }, 30000)
    }
}

loader() // Start Loader