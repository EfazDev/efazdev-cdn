var enabled = true;
var allow_messages = false;
var stored_group_data = {};
var temp_stored_user_data = {};
var cached_html_text = {};
var start_time = 125;
var approved_efazdev_users = {};
var approved_by_user_users = {};
var group_scan = false;

function warn(mes) { console.warn(`Verified Badge Loader: ${mes}`) }
function timeout(func, ms) { setTimeout(func, ms); }
function start() {
    function logMessage(message) {
        if (allow_messages == true) { console.log(`Verified Badge Loader: ${message}`) }
    }

    function generateVerifiedIcon(closet, orgMargin, orgX, orgY, margin, sizeX, sizeY) {
        let res = closet
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

    function applyChangesToHTML(json, user_checkmark_color) {
        /* All of these HTML variables are extracted from the Roblox Website and modified to be functioned like the actual badge. */
        let profile_html = `<span efaz-verified-badge-addon="true" role="button" tabindex="0" data-rblx-verified-badge-icon="" data-rblx-badge-icon="true" class="jss16"><img class="profile-verified-badge-icon" src="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28' fill='none'%3E%3Cg clip-path='url(%23clip0_8_46)'%3E%3Crect x='5.88818' width='22.89' height='22.89' transform='rotate(15 5.88818 0)' fill='%230066FF'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M20.543 8.7508L20.549 8.7568C21.15 9.3578 21.15 10.3318 20.549 10.9328L11.817 19.6648L7.45 15.2968C6.85 14.6958 6.85 13.7218 7.45 13.1218L7.457 13.1148C8.058 12.5138 9.031 12.5138 9.633 13.1148L11.817 15.2998L18.367 8.7508C18.968 8.1498 19.942 8.1498 20.543 8.7508Z' fill='white'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_8_46'%3E%3Crect width='28' height='28' fill='white'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E" title="[input_id]" alt="[input_id]"></span>`;
        let profile2_html = `<span efaz-verified-badge-addon="true" role="button" tabindex="0" data-rblx-verified-badge-icon="" data-rblx-badge-icon="true" class="jss4"><img class="profile-verified-badge-icon" src="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28' fill='none'%3E%3Cg clip-path='url(%23clip0_8_46)'%3E%3Crect x='5.88818' width='22.89' height='22.89' transform='rotate(15 5.88818 0)' fill='%230066FF'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M20.543 8.7508L20.549 8.7568C21.15 9.3578 21.15 10.3318 20.549 10.9328L11.817 19.6648L7.45 15.2968C6.85 14.6958 6.85 13.7218 7.45 13.1218L7.457 13.1148C8.058 12.5138 9.031 12.5138 9.633 13.1148L11.817 15.2998L18.367 8.7508C18.968 8.1498 19.942 8.1498 20.543 8.7508Z' fill='white'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_8_46'%3E%3Crect width='28' height='28' fill='white'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E" title="[input_id]" alt="[input_id]"></span>`
        let name_html = `<img efaz-verified-badge-addon="true" class="verified-badge-icon-catalog-item-rendered" src="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28' fill='none'%3E%3Cg clip-path='url(%23clip0_8_46)'%3E%3Crect x='5.88818' width='22.89' height='22.89' transform='rotate(15 5.88818 0)' fill='%230066FF'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M20.543 8.7508L20.549 8.7568C21.15 9.3578 21.15 10.3318 20.549 10.9328L11.817 19.6648L7.45 15.2968C6.85 14.6958 6.85 13.7218 7.45 13.1218L7.457 13.1148C8.058 12.5138 9.031 12.5138 9.633 13.1148L11.817 15.2998L18.367 8.7508C18.968 8.1498 19.942 8.1498 20.543 8.7508Z' fill='white'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_8_46'%3E%3Crect width='28' height='28' fill='white'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E" title="Verified Badge Icon" alt="Verified Badge Icon">`;
        let name_html_larger = `<span efaz-verified-badge-addon="true" role="button" tabindex="0" replicate-badge-addon-prompt="${json["id"]}_true" data-rblx-verified-badge-icon="" data-rblx-badge-icon="true" class="jss292"><img class="verified-badge-icon-group-shout-rendered" src="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28' fill='none'%3E%3Cg clip-path='url(%23clip0_8_46)'%3E%3Crect x='5.88818' width='22.89' height='22.89' transform='rotate(15 5.88818 0)' fill='%230066FF'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M20.543 8.7508L20.549 8.7568C21.15 9.3578 21.15 10.3318 20.549 10.9328L11.817 19.6648L7.45 15.2968C6.85 14.6958 6.85 13.7218 7.45 13.1218L7.457 13.1148C8.058 12.5138 9.031 12.5138 9.633 13.1148L11.817 15.2998L18.367 8.7508C18.968 8.1498 19.942 8.1498 20.543 8.7508Z' fill='white'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_8_46'%3E%3Crect width='28' height='28' fill='white'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E" title="Verified Badge Icon" alt="Verified Badge Icon"></span>`;
        let name_side_html = `<img efaz-verified-badge-addon="true" src="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28' fill='none'%3E%3Cg clip-path='url(%23clip0_8_46)'%3E%3Crect x='5.88818' width='22.89' height='22.89' transform='rotate(15 5.88818 0)' fill='%230066FF'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M20.543 8.7508L20.549 8.7568C21.15 9.3578 21.15 10.3318 20.549 10.9328L11.817 19.6648L7.45 15.2968C6.85 14.6958 6.85 13.7218 7.45 13.1218L7.457 13.1148C8.058 12.5138 9.031 12.5138 9.633 13.1148L11.817 15.2998L18.367 8.7508C18.968 8.1498 19.942 8.1498 20.543 8.7508Z' fill='white'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_8_46'%3E%3Crect width='28' height='28' fill='white'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E" title="Verified Badge Icon" alt="Verified Badge Icon" style="margin-left: 2px;width: 12px;height: 12px; background: none !important;">`;
        let name_side_real_html = `<img efaz-verified-badge-addon="true" src="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28' fill='none'%3E%3Cg clip-path='url(%23clip0_8_46)'%3E%3Crect x='5.88818' width='22.89' height='22.89' transform='rotate(15 5.88818 0)' fill='%230066FF'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M20.543 8.7508L20.549 8.7568C21.15 9.3578 21.15 10.3318 20.549 10.9328L11.817 19.6648L7.45 15.2968C6.85 14.6958 6.85 13.7218 7.45 13.1218L7.457 13.1148C8.058 12.5138 9.031 12.5138 9.633 13.1148L11.817 15.2998L18.367 8.7508C18.968 8.1498 19.942 8.1498 20.543 8.7508Z' fill='white'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_8_46'%3E%3Crect width='28' height='28' fill='white'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E" title="Verified Badge Icon" alt="Verified Badge Icon" style="margin-left: 2px;width: 18px;height: 18px; background: none !important;">`;
        let prompt_html = `<div efaz-verified-badge-addon="true" role="dialog" id="fake_verified_badge"><div class="modal-backdrop in"></div><div role="dialog" tabindex="-1" class="in modal" style="display: block;"><div class="modal-window modal-sm modal-dialog"><div class="modal-content" role="document"><div class="modal-header"><button type="button" class="close" title="close" onclick="document.getElementById('fake_verified_badge').remove()"><span class="icon-close"></span></button><h4 class="modal-title">Verified Badge Add-on</h4></div><div class="modal-body"><div><div><span role="button" tabindex="0" data-rblx-verified-badge-icon="" data-rblx-badge-icon="true" class="hz-centered-badge-container"><img class=" jss272" src="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28' fill='none'%3E%3Cg clip-path='url(%23clip0_8_46)'%3E%3Crect x='5.88818' width='22.89' height='22.89' transform='rotate(15 5.88818 0)' fill='%23FF4B00'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M20.543 8.7508L20.549 8.7568C21.15 9.3578 21.15 10.3318 20.549 10.9328L11.817 19.6648L7.45 15.2968C6.85 14.6958 6.85 13.7218 7.45 13.1218L7.457 13.1148C8.058 12.5138 9.031 12.5138 9.633 13.1148L11.817 15.2998L18.367 8.7508C18.968 8.1498 19.942 8.1498 20.543 8.7508Z' fill='white'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_8_46'%3E%3Crect width='28' height='28' fill='white'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E" title="Verified Badge" alt="Verified Badge"></span></div><div>This badge identifies that the user is using Efaz's Roblox Verified Badge Add-on! Please know that that the verified badge is not real and is visually added.</div></div></div><div class="modal-footer"><div class="loading"></div><div class="modal-buttons"><button type="button" class="modal-button btn-primary-md btn-min-width" onclick="window.location.replace('https://en.help.roblox.com/hc/en-us/articles/7997207259156')">Learn More</button><button type="button" class="modal-button btn-control-md btn-min-width" onclick="document.getElementById('fake_verified_badge').remove()">Close</button></div></div></div></div></div></div>`;
        let efaz_approved_prompt_html = `<div efaz-verified-badge-addon="true" role="dialog" id="fake_verified_badge"><div class="modal-backdrop in"></div><div role="dialog" tabindex="-1" class="in modal" style="display: block;"><div class="modal-window modal-sm modal-dialog"><div class="modal-content" role="document"><div class="modal-header"><button type="button" class="close" title="close" onclick="document.getElementById('fake_verified_badge').remove()"><span class="icon-close"></span></button><h4 class="modal-title">Verified Badge Add-on</h4></div><div class="modal-body"><div><div><span role="button" tabindex="0" data-rblx-verified-badge-icon="" data-rblx-badge-icon="true" class="hz-centered-badge-container"><img class=" jss272" src="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28' fill='none'%3E%3Cg clip-path='url(%23clip0_8_46)'%3E%3Crect x='5.88818' width='22.89' height='22.89' transform='rotate(15 5.88818 0)' fill='%23FF4B00'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M20.543 8.7508L20.549 8.7568C21.15 9.3578 21.15 10.3318 20.549 10.9328L11.817 19.6648L7.45 15.2968C6.85 14.6958 6.85 13.7218 7.45 13.1218L7.457 13.1148C8.058 12.5138 9.031 12.5138 9.633 13.1148L11.817 15.2998L18.367 8.7508C18.968 8.1498 19.942 8.1498 20.543 8.7508Z' fill='white'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_8_46'%3E%3Crect width='28' height='28' fill='white'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E" title="Verified Badge" alt="Verified Badge"></span></div><div>This badge identifies that the user was verified by Efaz for their authenticity! Please know that that the verified badge was not given by Roblox, was maybe not asked for their approval, and is visually added.</div></div></div><div class="modal-footer"><div class="loading"></div><div class="modal-buttons"><button type="button" class="modal-button btn-primary-md btn-min-width" onclick="window.location.replace('https://en.help.roblox.com/hc/en-us/articles/7997207259156')">Learn More</button><button type="button" class="modal-button btn-control-md btn-min-width" onclick="document.getElementById('fake_verified_badge').remove()">Close</button></div></div></div></div></div></div>`;
        let user_approved_prompt_html = `<div efaz-verified-badge-addon="true" role="dialog" id="fake_verified_badge"><div class="modal-backdrop in"></div><div role="dialog" tabindex="-1" class="in modal" style="display: block;"><div class="modal-window modal-sm modal-dialog"><div class="modal-content" role="document"><div class="modal-header"><button type="button" class="close" title="close" onclick="document.getElementById('fake_verified_badge').remove()"><span class="icon-close"></span></button><h4 class="modal-title">Verified Badge Add-on</h4></div><div class="modal-body"><div><div><span role="button" tabindex="0" data-rblx-verified-badge-icon="" data-rblx-badge-icon="true" class="hz-centered-badge-container"><img class=" jss272" src="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28' fill='none'%3E%3Cg clip-path='url(%23clip0_8_46)'%3E%3Crect x='5.88818' width='22.89' height='22.89' transform='rotate(15 5.88818 0)' fill='%230066FF'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M20.543 8.7508L20.549 8.7568C21.15 9.3578 21.15 10.3318 20.549 10.9328L11.817 19.6648L7.45 15.2968C6.85 14.6958 6.85 13.7218 7.45 13.1218L7.457 13.1148C8.058 12.5138 9.031 12.5138 9.633 13.1148L11.817 15.2998L18.367 8.7508C18.968 8.1498 19.942 8.1498 20.543 8.7508Z' fill='white'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_8_46'%3E%3Crect width='28' height='28' fill='white'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E" title="Verified Badge" alt="Verified Badge"></span></div><div>This badge identifies that this user was trusted under the approval JSON selected by you! Please know that that the verified badge was not given by Roblox and is visually added.</div></div></div><div class="modal-footer"><div class="loading"></div><div class="modal-buttons"><button type="button" class="modal-button btn-primary-md btn-min-width" onclick="window.location.replace('https://en.help.roblox.com/hc/en-us/articles/7997207259156')">Learn More</button><button type="button" class="modal-button btn-control-md btn-min-width" onclick="document.getElementById('fake_verified_badge').remove()">Close</button></div></div></div></div></div></div>`;
        let game_html = `<span efaz-verified-badge-addon="true" role="button" tabindex="0" replicate-badge-addon-prompt="${json["id"]}_true" data-rblx-verified-badge-icon="" data-rblx-badge-icon="true" class="jss4"><img class="verified-badge-icon-experience-creator" style="margin-left: 4px;width: 16px;height: 16px;" src="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28' fill='none'%3E%3Cg clip-path='url(%23clip0_8_46)'%3E%3Crect x='5.88818' width='22.89' height='22.89' transform='rotate(15 5.88818 0)' fill='%230066FF'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M20.543 8.7508L20.549 8.7568C21.15 9.3578 21.15 10.3318 20.549 10.9328L11.817 19.6648L7.45 15.2968C6.85 14.6958 6.85 13.7218 7.45 13.1218L7.457 13.1148C8.058 12.5138 9.031 12.5138 9.633 13.1148L11.817 15.2998L18.367 8.7508C18.968 8.1498 19.942 8.1498 20.543 8.7508Z' fill='white'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_8_46'%3E%3Crect width='28' height='28' fill='white'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E" title="Verified Badge Icon" alt="Verified Badge Icon"></span>`;
        let name_small_html = `<span><span efaz-verified-badge-addon="true" role="button" tabindex="0" data-rblx-verified-badge-icon="" replicate-badge-addon-prompt="${json["id"]}_true" data-rblx-badge-icon="true" class="jss22"><img class="verified-badge-icon-member-card-rendered" src="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28' fill='none'%3E%3Cg clip-path='url(%23clip0_8_46)'%3E%3Crect x='5.88818' width='22.89' height='22.89' transform='rotate(15 5.88818 0)' fill='%230066FF'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M20.543 8.7508L20.549 8.7568C21.15 9.3578 21.15 10.3318 20.549 10.9328L11.817 19.6648L7.45 15.2968C6.85 14.6958 6.85 13.7218 7.45 13.1218L7.457 13.1148C8.058 12.5138 9.031 12.5138 9.633 13.1148L11.817 15.2998L18.367 8.7508C18.968 8.1498 19.942 8.1498 20.543 8.7508Z' fill='white'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_8_46'%3E%3Crect width='28' height='28' fill='white'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E" title="Verified Badge Icon" alt="Verified Badge Icon"></span></span>`;
        let group_name_verified_html = `<span efaz-verified-badge-addon="true" role="button" tabindex="0" data-rblx-verified-badge-icon="" replicate-badge-addon-prompt="${json["id"]}_true" data-rblx-badge-icon="true" class="jss250"><img class="verified-badge-icon-group-name-rendered" src="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28' fill='none'%3E%3Cg clip-path='url(%23clip0_8_46)'%3E%3Crect x='5.88818' width='22.89' height='22.89' transform='rotate(15 5.88818 0)' fill='%230066FF'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M20.543 8.7508L20.549 8.7568C21.15 9.3578 21.15 10.3318 20.549 10.9328L11.817 19.6648L7.45 15.2968C6.85 14.6958 6.85 13.7218 7.45 13.1218L7.457 13.1148C8.058 12.5138 9.031 12.5138 9.633 13.1148L11.817 15.2998L18.367 8.7508C18.968 8.1498 19.942 8.1498 20.543 8.7508Z' fill='white'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_8_46'%3E%3Crect width='28' height='28' fill='white'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E" title="Verified Badge Icon" alt="Verified Badge Icon"></span>`;
        let group_owner_name_html = `<span><span efaz-verified-badge-addon="true" role="button" tabindex="0" data-rblx-verified-badge-icon="" replicate-badge-addon-prompt="${json["id"]}_true" data-rblx-badge-icon="true" class="verified-badge-icon-group-owner-container"><img class="verified-badge-icon-group-owner-rendered" style="margin-left: 4px; width: 16px; height: 16px;" src="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28' fill='none'%3E%3Cg clip-path='url(%23clip0_8_46)'%3E%3Crect x='5.88818' width='22.89' height='22.89' transform='rotate(15 5.88818 0)' fill='%230066FF'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M20.543 8.7508L20.549 8.7568C21.15 9.3578 21.15 10.3318 20.549 10.9328L11.817 19.6648L7.45 15.2968C6.85 14.6958 6.85 13.7218 7.45 13.1218L7.457 13.1148C8.058 12.5138 9.031 12.5138 9.633 13.1148L11.817 15.2998L18.367 8.7508C18.968 8.1498 19.942 8.1498 20.543 8.7508Z' fill='white'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_8_46'%3E%3Crect width='28' height='28' fill='white'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E" title="Verified Badge Icon" alt="Verified Badge Icon"></span></span>`;
        let reseller_html = `<span><span efaz-verified-badge-addon="true" role="button" tabindex="0" data-rblx-verified-badge-icon="" replicate-badge-addon-prompt="${json["id"]}_true" data-rblx-badge-icon="true" class="jss22"><img class="verified-badge-icon-item-resellers-rendered" src="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28' fill='none'%3E%3Cg clip-path='url(%23clip0_8_46)'%3E%3Crect x='5.88818' width='22.89' height='22.89' transform='rotate(15 5.88818 0)' fill='%230066FF'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M20.543 8.7508L20.549 8.7568C21.15 9.3578 21.15 10.3318 20.549 10.9328L11.817 19.6648L7.45 15.2968C6.85 14.6958 6.85 13.7218 7.45 13.1218L7.457 13.1148C8.058 12.5138 9.031 12.5138 9.633 13.1148L11.817 15.2998L18.367 8.7508C18.968 8.1498 19.942 8.1498 20.543 8.7508Z' fill='white'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_8_46'%3E%3Crect width='28' height='28' fill='white'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E" title="Verified Badge Icon" alt="Verified Badge Icon"></span></span>`;
        let friends_scroll_html = `<div class="friend-tile-verified-badge"><div class="friend-tile-spacer"></div><span role="button" tabindex="0" efaz-verified-badge-addon="true" data-rblx-verified-badge-icon="" data-rblx-badge-icon="true" class="verified-badge jss40" style="margin-top: -2px;"><img class=" jss38" src="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28' fill='none'%3E%3Cg clip-path='url(%23clip0_8_46)'%3E%3Crect x='5.88818' width='22.89' height='22.89' transform='rotate(15 5.88818 0)' fill='%230066FF'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M20.543 8.7508L20.549 8.7568C21.15 9.3578 21.15 10.3318 20.549 10.9328L11.817 19.6648L7.45 15.2968C6.85 14.6958 6.85 13.7218 7.45 13.1218L7.457 13.1148C8.058 12.5138 9.031 12.5138 9.633 13.1148L11.817 15.2998L18.367 8.7508C18.968 8.1498 19.942 8.1498 20.543 8.7508Z' fill='white'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_8_46'%3E%3Crect width='28' height='28' fill='white'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E" title="Verified Badge Icon" alt="Verified Badge Icon"></span></div>`;
        /* All of these HTML variables are extracted from the Roblox Website and modified to be functioned like the actual badge. */

        /* Apply color changes to HTML above */
        var hex_color = user_checkmark_color
        if (!(user_checkmark_color == "%230066ff" || user_checkmark_color == "%230066FF")) {  // User's selected color
            profile_html = profile_html.replace("%230066FF", user_checkmark_color);
            profile2_html = profile2_html.replace("%230066FF", user_checkmark_color);
            name_html = name_html.replace("%230066FF", user_checkmark_color);
            name_html_larger = name_html_larger.replace("%230066FF", user_checkmark_color);
            name_side_real_html = name_side_real_html.replace("%230066FF", user_checkmark_color);
            name_side_html = name_side_html.replace("%230066FF", user_checkmark_color);
            game_html = game_html.replace("%230066FF", user_checkmark_color);
            name_small_html = name_small_html.replace("%230066FF", user_checkmark_color);
            group_name_verified_html = group_name_verified_html.replace("%230066FF", user_checkmark_color);
            group_owner_name_html = group_owner_name_html.replace("%230066FF", user_checkmark_color);
            reseller_html = reseller_html.replace("%230066FF", user_checkmark_color);
            friends_scroll_html = friends_scroll_html.replace("%230066FF", user_checkmark_color);
        } else if (approved_efazdev_users[json["id"]] && approved_efazdev_users[json["id"]]["hexColor"]) { // If the main user has selected the default, has EfazDev Approved Users enabled, and there's a color attached to the approved user.
            hex_color = approved_efazdev_users[json["id"]]["hexColor"]
            hex_color = hex_color.replace("#", "%23");

            profile_html = profile_html.replace("%230066FF", hex_color);
            profile2_html = profile2_html.replace("%230066FF", hex_color);
            name_html = name_html.replace("%230066FF", hex_color);
            name_html_larger = name_html_larger.replace("%230066FF", hex_color);
            name_side_real_html = name_side_real_html.replace("%230066FF", hex_color);
            name_side_html = name_side_html.replace("%230066FF", hex_color);
            game_html = game_html.replace("%230066FF", hex_color);
            name_small_html = name_small_html.replace("%230066FF", hex_color);
            group_name_verified_html = group_name_verified_html.replace("%230066FF", hex_color);
            group_owner_name_html = group_owner_name_html.replace("%230066FF", hex_color);
            reseller_html = reseller_html.replace("%230066FF", hex_color);
            efaz_approved_prompt_html = efaz_approved_prompt_html.replace("%23FF4B00", hex_color);
            friends_scroll_html = friends_scroll_html.replace("%230066FF", hex_color);
        } else if (approved_by_user_users[json["id"]] && approved_by_user_users[json["id"]]["hexColor"]) { // If the main user has selected the default, has EfazDev Approved Users enabled, and there's a color attached to the approved user.
            hex_color = approved_by_user_users[json["id"]]["hexColor"]
            hex_color = hex_color.replace("#", "%23");

            profile_html = profile_html.replace("%230066FF", hex_color);
            profile2_html = profile2_html.replace("%230066FF", hex_color);
            name_html = name_html.replace("%230066FF", hex_color);
            name_html_larger = name_html_larger.replace("%230066FF", hex_color);
            name_side_real_html = name_side_real_html.replace("%230066FF", hex_color);
            name_side_html = name_side_html.replace("%230066FF", hex_color);
            game_html = game_html.replace("%230066FF", hex_color);
            name_small_html = name_small_html.replace("%230066FF", hex_color);
            group_name_verified_html = group_name_verified_html.replace("%230066FF", hex_color);
            group_owner_name_html = group_owner_name_html.replace("%230066FF", hex_color);
            reseller_html = reseller_html.replace("%230066FF", hex_color);
            efaz_approved_prompt_html = efaz_approved_prompt_html.replace("%23FF4B00", hex_color);
            friends_scroll_html = friends_scroll_html.replace("%230066FF", hex_color);
        }
        /* Apply color changes to HTML above */
        if (!(cached_html_text[json["id"]])) {
            cached_html_text[json["id"]] = [
                hex_color,
                profile_html,
                profile2_html, 
                name_html, 
                name_html_larger, 
                name_side_real_html, 
                name_side_html, 
                game_html, 
                name_small_html, 
                group_name_verified_html, 
                group_owner_name_html, 
                reseller_html, 
                efaz_approved_prompt_html,
                prompt_html,
                user_approved_prompt_html,
                friends_scroll_html
            ]
        }
        return cached_html_text[json["id"]]
    }

    function verifiedBadgePlacedAlready(html) {
        return (/data-rblx-badge-icon/.test(html) || /replicate-badge-addon-prompt/.test(html) || /Verified Badge Icon/.test(html))
    }

    if (enabled) {
        let user_checkmark_color = "%230066FF"
        let broken_context = false;
        let cached_group_list = null;
        if (window.verifiedCheckmarkSettings) {
            let custom_checkmark_color = window.verifiedCheckmarkSettings["color"]
            if (custom_checkmark_color) {
                user_checkmark_color = custom_checkmark_color.replace("#", "%23");
            }
        }
        function getIfLinkIsGroup(link) { return (/\/groups\//.test(link) || /\/communities\//.test(link)) }
        function getIfLinkIsUserProfile(link) { return (/\/users\//.test(link) && /\/profile/.test(link)) }
        function getIfLinkIsUser(link, userId) { return (getIfLinkIsUserProfile(link) && link.includes(("/" + userId + "/profile"))) }
        function generateInstantPromise(value) {
            return new Promise((resolve, reject) => {
                resolve(value)
            });
        }
        async function getUserData(id, isMain) {
            if (typeof chrome !== 'undefined' && typeof chrome.storage !== 'undefined') {
                if (broken_context == true) {
                    return generateInstantPromise(null)
                } else {
                    return chrome.storage.local.get("user_verification").then((stored_user_data) => {
                        if (!(typeof (stored_user_data["user_verification"]) == "object")) {
                            stored_user_data["user_verification"] = {}
                        }

                        if (stored_user_data["user_verification"][id.toString()]) {
                            return stored_user_data["user_verification"][id.toString()]
                        } else if (temp_stored_user_data[id.toString()]) {
                            return temp_stored_user_data[id.toString()]
                        } else if (approved_efazdev_users[id.toString()]) {
                            return approved_efazdev_users[id.toString()]
                        } else if (approved_by_user_users[id.toString()]) {
                            return approved_by_user_users[id.toString()]
                        } else {
                            if (id == "*" || isMain == true) {
                                return fetch("https://users.roblox.com/v1/users/authenticated", {
                                    "headers": {
                                        "accept": "application/json",
                                        "cache-control": "no-cache",
                                        "pragma": "no-cache"
                                    },
                                    "method": "GET",
                                    "mode": "cors",
                                    "credentials": "include"
                                }).then(res => {
                                    if (res.ok) {
                                        return res.json()
                                    } else {
                                        logMessage("User is not logged in!")
                                        return null
                                    }
                                }).then(json => {
                                    if (json) {
                                        temp_stored_user_data["*"] = json
                                        stored_user_data["user_verification"][json["id"].toString()] = json
                                        return chrome.storage.local.set(stored_user_data).then(() => {
                                            return json
                                        })
                                    } else {
                                        return null
                                    }
                                }).catch(err => {
                                    logMessage(err.message)
                                    return null
                                });
                            } else {
                                if (stored_user_data["user_verification"][id.toString()]) {
                                    return stored_user_data["user_verification"][id.toString()]
                                } else {
                                    logMessage("Something went wrong.")
                                    return null
                                }
                            }
                        }
                    }).catch(err => {
                        if (/Extension context/.test(err.toString())) {
                            broken_context = true
                            return null
                        } else {
                            warn(`Error with getting approved users: ${err}`)
                            return null
                        }
                    });
                }
            } else {
                if (temp_stored_user_data[id.toString()]) {
                    return generateInstantPromise(temp_stored_user_data[id.toString()])
                } else {
                    if (approved_efazdev_users[id.toString()]) {
                        return generateInstantPromise(approved_efazdev_users[id.toString()])
                    } else if (approved_by_user_users[id.toString()]) {
                        return generateInstantPromise(approved_by_user_users[id.toString()])
                    } else if (temp_stored_user_data[id.toString()]) {
                        return generateInstantPromise(temp_stored_user_data[id.toString()])
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
                            if (res.ok) {
                                return res.json()
                            } else {
                                logMessage("User is not logged in!")
                                return null
                            }
                        }).then(json => {
                            if (json) {
                                if (id == "*") {
                                    temp_stored_user_data["*"] = json
                                    temp_stored_user_data[json["id"].toString()] = json
                                    return json
                                } else {
                                    return json
                                }
                            } else {
                                return null
                            }
                        }).catch(err => {
                            logMessage(err.message)
                            return null
                        });
                    }
                }
            }
        }
        function scanUser(id, isMain) {
            try {
                getUserData(id, isMain)
                    .then((res) => {
                        if (res) {
                            return res
                        } else {
                            return {};
                        }
                    })
                    .then((json) => {
                        if (json && json["id"]) {
                            let fetched_html_elements = applyChangesToHTML(json, user_checkmark_color)
                            let hex_color = fetched_html_elements[0] 
                            let profile_html = fetched_html_elements[1] 
                            let profile2_html = fetched_html_elements[2] 
                            let name_html = fetched_html_elements[3] 
                            let name_html_larger = fetched_html_elements[4] 
                            let name_side_real_html = fetched_html_elements[5] 
                            let name_side_html = fetched_html_elements[6] 
                            let game_html = fetched_html_elements[7] 
                            let name_small_html = fetched_html_elements[8] 
                            let group_name_verified_html = fetched_html_elements[9] 
                            let group_owner_name_html = fetched_html_elements[10] 
                            let reseller_html = fetched_html_elements[11] 
                            let efaz_approved_prompt_html = fetched_html_elements[12]
                            let prompt_html = fetched_html_elements[13]
                            let user_approved_prompt_html = fetched_html_elements[14]
                            let friends_scroll_html = fetched_html_elements[15] 

                            let include_groups = false;
                            let userId = json["id"];
                            let username = json["name"];
                            let displayName = json["displayName"];

                            if (window.verifiedCheckmarkSettings) {
                                if (window.verifiedCheckmarkSettings["groupsIncluded"] == true) {
                                    include_groups = true;
                                }
                            }

                            async function approvedGroup(id, onlycached) {
                                if (broken_context == true) {
                                    return { "accepted": false }
                                }
                                if (typeof chrome !== 'undefined' && typeof chrome.storage !== 'undefined') {
                                    try {
                                        function ee(allowed_groups) {
                                            if (!(typeof (allowed_groups["group_ownership"]) == "object")) {
                                                allowed_groups["group_ownership"] = {}
                                            }

                                            let group_keys = Object.keys(allowed_groups["group_ownership"])
                                            let changes_made = false
                                            group_keys.forEach((key) => {
                                                if (allowed_groups["group_ownership"][key] && allowed_groups["group_ownership"][key]["owner"] == userId && allowed_groups["group_ownership"][key]["accepted"] == false) {
                                                    allowed_groups["group_ownership"][key]["accepted"] = true
                                                    changes_made = true
                                                }
                                            })
                                            if (changes_made == true) {
                                                chrome.storage.local.set(allowed_groups).then(() => {
                                                    logMessage("Saved to chrome storage!")
                                                    group_scan = false
                                                    if (allowed_groups["group_ownership"][id] == false) {
                                                        return { "accepted": false }
                                                    } else {
                                                        return allowed_groups["group_ownership"][id]
                                                    }
                                                })
                                            }

                                            if (typeof (allowed_groups["group_ownership"][id]) == "object") {
                                                if (approved_efazdev_users[allowed_groups["group_ownership"][id]["owner"]] && (!(allowed_groups["group_ownership"][id]["owner"] == userId))) {
                                                    return { "accepted": false }
                                                } else if (approved_by_user_users[allowed_groups["group_ownership"][id]["owner"]] && (!(allowed_groups["group_ownership"][id]["owner"] == userId))) {
                                                    return { "accepted": false }
                                                } else {
                                                    return allowed_groups["group_ownership"][id]
                                                }
                                            } else if (allowed_groups["group_ownership"][id] == false) {
                                                return { "accepted": false }
                                            } else if (allowed_groups["group_ownership"] && ((!(allowed_groups["group_ownership"][id])) && allowed_groups["group_ownership"][`scan_${userId}`] == true)) {
                                                return { "accepted": false }
                                            } else {
                                                if (onlycached == true) {
                                                    return { "accepted": false }
                                                } else {
                                                    if (group_scan == true) {
                                                        return { "accepted": false }
                                                    } else {
                                                        group_scan = true
                                                        if (stored_group_data["temp_group_info"]) {
                                                            if (typeof (allowed_groups["group_ownership"][id]) == "object") {
                                                                if (approved_efazdev_users[allowed_groups["group_ownership"][id]["owner"]] && (!(allowed_groups["group_ownership"][id]["owner"] == userId))) {
                                                                    return { "accepted": false }
                                                                } else if (approved_by_user_users[allowed_groups["group_ownership"][id]["owner"]] && (!(allowed_groups["group_ownership"][id]["owner"] == userId))) {
                                                                    return { "accepted": false }
                                                                } else {
                                                                    return allowed_groups["group_ownership"][id]
                                                                }
                                                            } else if (allowed_groups["group_ownership"][id] == false) {
                                                                return { "accepted": false }
                                                            } else if (allowed_groups["group_ownership"] && ((!(allowed_groups["group_ownership"][id])) && allowed_groups["group_ownership"][`scan_${userId}`] == true)) {
                                                                return { "accepted": false }
                                                            } else {
                                                                return { "accepted": false }
                                                            }
                                                        } else {
                                                            return fetch(`https://groups.roblox.com/v1/users/${userId}/groups/roles?includeLocked=true&includeNotificationPreferences=true`, { "mode": "cors", "credentials": "include" }).then(grou_res => {
                                                                if (grou_res.ok) {
                                                                    return grou_res.json();
                                                                } else {
                                                                    return null
                                                                }
                                                            }).then(grou_resjson => {
                                                                if (grou_resjson) {
                                                                    if (grou_resjson["data"]) {
                                                                        stored_group_data["temp_group_info"] = {}
                                                                        allowed_groups["group_ownership"][`scan_${userId}`] = true
                                                                        grou_resjson["data"].forEach((grou_json) => {
                                                                            grou_json = grou_json["group"]
                                                                            if (grou_json["owner"] && grou_json["owner"]["userId"] == userId) {
                                                                                grou_json["accepted"] = true;
                                                                                allowed_groups["group_ownership"][grou_json["id"]] = {
                                                                                    "accepted": grou_json["accepted"],
                                                                                    "name": grou_json["name"],
                                                                                    "id": grou_json["id"],
                                                                                    "owner": grou_json["owner"]["userId"],
                                                                                }
                                                                            } else {
                                                                                if (grou_json["owner"]) {
                                                                                    grou_json["accepted"] = false;
                                                                                    allowed_groups["group_ownership"][grou_json["id"]] = {
                                                                                        "accepted": grou_json["accepted"],
                                                                                        "name": grou_json["name"],
                                                                                        "id": grou_json["id"],
                                                                                        "owner": grou_json["owner"]["userId"],
                                                                                    }
                                                                                }
                                                                            }
                                                                            stored_group_data["temp_group_info"][grou_json["id"]] = allowed_groups["group_ownership"][grou_json["id"]]
                                                                        })

                                                                        if (!(allowed_groups["group_ownership"][id])) {
                                                                            let user_approved_keys = Object.keys(approved_by_user_users)
                                                                            if (user_approved_keys) {
                                                                                user_approved_keys.forEach((ke) => {
                                                                                    let info = approved_by_user_users[ke]
                                                                                    if (info["approve_groups"]) {
                                                                                        if (info["approve_groups"].includes(id)) {
                                                                                            allowed_groups["group_ownership"][id] = {
                                                                                                "accepted": true,
                                                                                                "id": id,
                                                                                                "owner": info["id"],
                                                                                                "name": info["approve_groups"][id]["name"],
                                                                                            }
                                                                                            stored_group_data["temp_group_info"][id] = allowed_groups["group_ownership"][id]
                                                                                        }
                                                                                    }
                                                                                })
                                                                            }

                                                                            let efazdev_approved_keys = Object.keys(approved_efazdev_users)
                                                                            if (efazdev_approved_keys) {
                                                                                efazdev_approved_keys.forEach((ke) => {
                                                                                    let info = approved_efazdev_users[ke]
                                                                                    if (info["approve_groups"]) {
                                                                                        if (info["approve_groups"].includes(id)) {
                                                                                            allowed_groups["group_ownership"][id] = {
                                                                                                "accepted": true,
                                                                                                "id": id,
                                                                                                "owner": info["id"],
                                                                                                "name": info["approve_groups"][id]["name"],
                                                                                            }
                                                                                            stored_group_data["temp_group_info"][id] = allowed_groups["group_ownership"][id]
                                                                                        }
                                                                                    }
                                                                                })
                                                                            }
                                                                        }

                                                                        return chrome.storage.local.set(allowed_groups).then(() => {
                                                                            logMessage("Saved to chrome storage!")
                                                                            group_scan = false
                                                                            if (allowed_groups["group_ownership"][id] == false) {
                                                                                return { "accepted": false }
                                                                            } else if (allowed_groups["group_ownership"][id]) {
                                                                                return allowed_groups["group_ownership"][id]
                                                                            } else {
                                                                                return { "accepted": false }
                                                                            }
                                                                        })
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
                                        }
                                        if (cached_group_list) {
                                            return ee(cached_group_list)
                                        } else {
                                            cached_group_list = {};
                                            return chrome.storage.local.get("group_ownership").then((allowed_groups) => {
                                                cached_group_list = allowed_groups;
                                                return ee(cached_group_list)
                                            }).catch(err => {
                                                cached_group_list = null;
                                            })
                                        }
                                    } catch (err) {
                                        if (/Extension context/.test(err.toString())) {
                                            broken_context = true;
                                            return { "accepted": false }
                                        } else {
                                            warn(`Error with getting approved group: ${err}`);
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
                                            } else {
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
                                                                if (grou_json["owner"] == userId) {
                                                                    grou_json["accepted"] = true
                                                                    stored_group_data["group_ownership"][grou_json["id"]] = grou_json
                                                                } else {
                                                                    stored_group_data["group_ownership"][grou_json["id"]] = false
                                                                }
                                                            })

                                                            if (!(stored_group_data["group_ownership"][id])) {
                                                                let user_approved_keys = Object.keys(approved_by_user_users)
                                                                if (user_approved_keys) {
                                                                    user_approved_keys.forEach((ke) => {
                                                                        let info = approved_by_user_users[ke]
                                                                        if (info["approve_groups"]) {
                                                                            if (info["approve_groups"].includes(id)) {
                                                                                stored_group_data["group_ownership"][id] = {
                                                                                    "accepted": true,
                                                                                    "id": id,
                                                                                    "owner": info["id"],
                                                                                    "name": info["approve_groups"][id]["name"],
                                                                                }
                                                                                stored_group_data["temp_group_info"][id] = stored_group_data["group_ownership"][id]
                                                                            }
                                                                        }
                                                                    })
                                                                }

                                                                let efazdev_approved_keys = Object.keys(approved_efazdev_users)
                                                                if (efazdev_approved_keys) {
                                                                    efazdev_approved_keys.forEach((ke) => {
                                                                        let info = approved_efazdev_users[ke]
                                                                        if (info["approve_groups"]) {
                                                                            if (info["approve_groups"].includes(id)) {
                                                                                stored_group_data["group_ownership"][id] = {
                                                                                    "accepted": true,
                                                                                    "id": id,
                                                                                    "owner": info["id"],
                                                                                    "name": info["approve_groups"][id]["name"],
                                                                                }
                                                                                stored_group_data["temp_group_info"][id] = stored_group_data["group_ownership"][id]
                                                                            }
                                                                        }
                                                                    })
                                                                }
                                                            }

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
                            }

                            function promptMessage() {
                                if (window.verifiedCheckmarkSettings) {
                                    let verified_prompt_enabled = window.verifiedCheckmarkSettings["verifiedPrompt"];
                                    if (verified_prompt_enabled == true) {
                                        if (approved_efazdev_users[userId.toString()]) {
                                            const placeholder = document.createRange().createContextualFragment(`<div>${efaz_approved_prompt_html}</div>`);
                                            if (!(document.getElementById("fake_verified_badge"))) {
                                                document.body.appendChild(placeholder.children[0].children[0]);
                                            }
                                        } else if (approved_by_user_users[userId.toString()]) {
                                            const placeholder = document.createRange().createContextualFragment(`<div>${user_approved_prompt_html}</div>`);
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

                            function generateDOMElement(html) {
                                let div = document.createElement("div");
                                div.innerHTML = html.trim();
                                return div.firstChild;
                            }

                            function addPromptButtonInput() {
                                let list_item = Array.from(document.querySelectorAll("span"));
                                if (list_item.length > 0) {
                                    list_item.forEach((verified_badge_contain) => {
                                        if (verified_badge_contain.getAttribute("replicate-badge-addon-prompt")) {
                                            if (verified_badge_contain.getAttribute("replicate-badge-addon-prompt") == `${userId}_true`) {
                                                verified_badge_contain.setAttribute("replicate-badge-addon-prompt", "false")
                                                verified_badge_contain.addEventListener("click", promptMessage);
                                            }
                                        }
                                    });
                                }
                            }

                            if (enabled == true) {
                                profile_html = profile_html.replaceAll("[input_id]", userId);
                                profile2_html = profile2_html.replaceAll("[input_id]", userId);

                                if (getIfLinkIsUserProfile(window.location.pathname) && getIfLinkIsUser(window.location.pathname, userId.toString())) {
                                    let main_headers = Array.from(document.querySelectorAll(".profile-name.text-overflow"));
                                    if (main_headers.length > 0) {
                                        main_headers.forEach((main_header) => {
                                            if (main_header.offsetParent && main_header.offsetParent.className == "header-title") {
                                                if (verifiedBadgePlacedAlready(main_header.offsetParent.innerHTML)) {
                                                    return;
                                                }
                                                if (main_header.offsetParent.innerHTML.includes(displayName)) {
                                                    main_header.offsetParent.appendChild(generateDOMElement(profile_html))
                                                }
                                            } else if (main_header.parentElement && main_header.parentElement.className == "header-title") {
                                                if (verifiedBadgePlacedAlready(main_header.parentElement.innerHTML)) {
                                                    return;
                                                }
                                                if (main_header.parentElement.innerHTML.includes(displayName)) {
                                                    main_header.parentElement.appendChild(generateDOMElement(profile_html))
                                                }
                                            } else if (main_header.parentElement && main_header.parentElement.parentElement && main_header.parentElement.parentElement.className == "header-title") {
                                                if (verifiedBadgePlacedAlready(main_header.parentElement.parentElement.innerHTML)) {
                                                    return;
                                                }
                                                if (main_header.parentElement.parentElement.innerHTML.includes(displayName)) {
                                                    main_header.parentElement.parentElement.appendChild(generateDOMElement(profile_html))
                                                }
                                            }
                                        });
                                    }

                                    let main_headers2 = Array.from(document.querySelectorAll(".profile-header-title-container"));
                                    if (main_headers2.length > 0) {
                                        main_headers2.forEach((main_header) => {
                                            if (verifiedBadgePlacedAlready(main_header.innerHTML)) {
                                                return;
                                            }
                                            if (main_header.innerHTML.includes(displayName)) {
                                                main_header.appendChild(generateDOMElement(profile2_html))
                                            }
                                        });
                                    }

                                    let premium_logos = Array.from(document.querySelectorAll(".premium-badge-right-aligned"));
                                    if (premium_logos.length > 0) {
                                        premium_logos.forEach((premium) => {
                                            if (premium && premium.className == "premium-badge-right-aligned") {
                                                premium.remove();
                                            }
                                        });
                                    }

                                    let premium_logos2 = Array.from(document.querySelectorAll(".profile-header-premium-badge"));
                                    if (premium_logos2.length > 0) {
                                        premium_logos2.forEach((premium) => {
                                            if (premium) {
                                                premium.remove();
                                            }
                                        });
                                    }
                                }

                                let name_on_side = Array.from(document.querySelectorAll(".font-header-2.dynamic-ellipsis-item"));
                                if (name_on_side.length > 0) {
                                    name_on_side.forEach((main_name_on_side) => {
                                        if (main_name_on_side.outerHTML.includes(displayName) && main_name_on_side.parentElement && main_name_on_side.parentElement.href) {
                                            if (getIfLinkIsUserProfile(main_name_on_side.parentElement.href) && getIfLinkIsUser(main_name_on_side.parentElement.href, userId.toString())) {
                                                if (verifiedBadgePlacedAlready(main_name_on_side.outerHTML)) {
                                                    return;
                                                }
                                                main_name_on_side.innerHTML = `${main_name_on_side.innerHTML} ${name_side_real_html}`;
                                            }
                                        }
                                    });
                                }

                                let username_containers = Array.from(document.querySelectorAll(".user-name-container"));
                                if (username_containers.length > 0) {
                                    username_containers.forEach((user_container) => {
                                        if (user_container.innerHTML.includes(displayName)) {
                                            if (verifiedBadgePlacedAlready(user_container.innerHTML)) {
                                                return;
                                            }
                                            user_container.innerHTML = `${user_container.innerHTML} ${name_html}`;
                                        }
                                    });
                                }

                                function applyAutoChangeFunctionA() { // Roblox Groups Main Handler
                                    if (getIfLinkIsGroup(window.location.pathname)) {
                                        function attachExtra() {
                                            let group_guilded_posts = Array.from(document.querySelectorAll(".text-name.name"));
                                            if (group_guilded_posts.length > 0) {
                                                group_guilded_posts.forEach((shout) => {
                                                    if (shout.className == "text-name name" && shout.innerHTML.includes(displayName) && getIfLinkIsUserProfile(shout.href) && getIfLinkIsUser(shout.href, userId.toString())) {
                                                        if (verifiedBadgePlacedAlready(shout.parentElement.outerHTML)) {
                                                            return;
                                                        }
                                                        shout.outerHTML = `${shout.outerHTML} ${generateVerifiedIcon(name_side_html, 2, 12, 12, 6, 16, 16)}`;
                                                    }
                                                })
                                            }

                                            let name_in_group = Array.from(document.querySelectorAll(".list-item.member.ng-scope"));
                                            if (name_in_group.length > 0) {
                                                name_in_group.forEach((main_name_on_group) => {
                                                    if (main_name_on_group && main_name_on_group.children[0] && main_name_on_group.children[0].children[0] && getIfLinkIsUserProfile(main_name_on_group.children[0].children[0].href) && getIfLinkIsUser(main_name_on_group.children[0].children[0].href, userId.toString())) {
                                                        if (main_name_on_group.children[0] && main_name_on_group.children[0].children[2] && main_name_on_group.children[0].children[2].children[0] && main_name_on_group.children[0].children[2].children[0].children[0]) {
                                                            if (verifiedBadgePlacedAlready(main_name_on_group.children[0].children[2].children[0].innerHTML)) {
                                                                return;
                                                            }
                                                            main_name_on_group.children[0].children[2].children[0].children[0].innerHTML = `${main_name_on_group.children[0].children[2].children[0].children[0].innerHTML} ${generateVerifiedIcon(name_side_html, 2, 12, 12, 0, 16, 16)}`
                                                        }
                                                    }
                                                });
                                            }

                                            let group_wall = Array.from(document.querySelectorAll(".text-label-medium.content-emphasis.ng-binding.ng-scope"));
                                            if (group_wall.length > 0) {
                                                group_wall.forEach((main_name_on_group) => {
                                                    if (main_name_on_group.outerHTML.includes(displayName) && main_name_on_group.className == "text-label-medium content-emphasis ng-binding ng-scope" && getIfLinkIsUserProfile(main_name_on_group.href) && getIfLinkIsUser(main_name_on_group.href, userId.toString())) {
                                                        if (verifiedBadgePlacedAlready(main_name_on_group.innerHTML)) {
                                                            return;
                                                        }
                                                        main_name_on_group.innerHTML = `${main_name_on_group.innerHTML} ${generateVerifiedIcon(name_side_html, 2, 12, 12, 0, 16, 16)}`;
                                                    }
                                                });
                                            }

                                            let group_payouts_auto = Array.from(document.querySelectorAll(".avatar-card-name.text-lead.text-overflow.ng-binding.ng-scope"));
                                            if (group_payouts_auto.length > 0) {
                                                group_payouts_auto.forEach((main_name_on_group) => {
                                                    if (main_name_on_group.innerHTML.includes(displayName) && getIfLinkIsUserProfile(main_name_on_group.href) && getIfLinkIsUser(main_name_on_group.href, userId.toString())) {
                                                        if (verifiedBadgePlacedAlready(main_name_on_group.parentElement.innerHTML)) {
                                                            return
                                                        }
                                                        main_name_on_group.innerHTML = `${main_name_on_group.innerHTML} ${generateVerifiedIcon(name_side_html, 2, 12, 12, -1, 16, 16)}`;
                                                    }
                                                });
                                            }
                                        }
                                        function refresh() {
                                            let identified_id = window.location.pathname.match(/[0-9]+/);
                                            if (identified_id && identified_id[0]) {
                                                let group_owners = Array.from(document.querySelectorAll(".MuiLink-underlineHover.web-blox-css-mui-94v26k"));
                                                if (group_owners.length > 0) {
                                                    if (window.verifiedCheckmarkSettings) {
                                                        if (window.verifiedCheckmarkSettings["groupsIncluded"] == true) {
                                                            let group_list_verified_logo = Array.from(document.querySelectorAll(".groups-list-item"));
                                                            if (group_list_verified_logo.length > 0) {
                                                                group_list_verified_logo.forEach((main_name_on_group) => {
                                                                    if (main_name_on_group.children[1] && main_name_on_group.children[1].children[0] && main_name_on_group.children[1].children[0].children[0] && main_name_on_group.children[1].children[0].children[0].children[0]) {
                                                                        if (main_name_on_group.href) {
                                                                            let group_id = main_name_on_group.href.match(/[0-9]+/)[0];
                                                                            if (group_id) {
                                                                                approvedGroup(group_id).then((info) => {
                                                                                    if (info["accepted"] == true) {
                                                                                        main_name_on_group = main_name_on_group.children[1].children[0].children[0].children[0];
                                                                                        if (verifiedBadgePlacedAlready(main_name_on_group.innerHTML)) {
                                                                                            return;
                                                                                        }
                                                                                        main_name_on_group.innerHTML = `${main_name_on_group.innerHTML} ${generateVerifiedIcon(name_side_html, 2, 12, 12, 2, 16, 16)}`;
                                                                                    }
                                                                                })
                                                                            }
                                                                        }
                                                                    }
                                                                });
                                                            }

                                                            approvedGroup(identified_id[0]).then(info => {
                                                                if (info["accepted"] == true) {
                                                                    group_owners.forEach((group_owner_name) => {
                                                                        if (group_owner_name.innerHTML.includes(displayName) && getIfLinkIsUserProfile(group_owner_name.href) && getIfLinkIsUser(group_owner_name.href, userId.toString())) {
                                                                            if (!(group_owner_name.parentElement)) {
                                                                                return;
                                                                            }

                                                                            if (!(verifiedBadgePlacedAlready(group_owner_name.parentElement.innerHTML))) {
                                                                                group_owner_name.outerHTML = `${group_owner_name.outerHTML}${group_owner_name_html}`;
                                                                            }

                                                                            if (window.verifiedCheckmarkSettings) {
                                                                                if (window.verifiedCheckmarkSettings["groupsIncluded"] == true) {
                                                                                    let group_name = Array.from(document.querySelectorAll(".profile-header-details-community-name.text-heading-large"));
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
                                                                        }
                                                                    });
                                                                }
                                                            })
                                                        }
                                                    }
                                                }
                                            }
                                            attachExtra()
                                        }
                                        refresh()
                                    }
                                }
                                function applyAutoChangeFunctionB() { // Creator Name
                                    let username_containers_2 = Array.from(document.querySelectorAll(".creator-name.text-link"));
                                    if (username_containers_2.length > 0) {
                                        username_containers_2.forEach((user_container) => {
                                            if (user_container.outerHTML.includes(`@${username}`) && user_container.className == "creator-name text-link") {
                                                if (!(user_container.parentElement)) {
                                                    return;
                                                }
                                                if (verifiedBadgePlacedAlready(user_container.parentElement.outerHTML)) {
                                                    return;
                                                }
                                                user_container.outerHTML = `${user_container.outerHTML} ${generateVerifiedIcon(name_side_html, 2, null, null, -1)}`;
                                            }
                                        });
                                        username_containers_2.forEach((user_container) => {
                                            if (include_groups == true) {
                                                if (user_container.className == "creator-name text-link") {
                                                    if (user_container.href && getIfLinkIsGroup(user_container.href)) {
                                                        let group_id = user_container.href.match(/[0-9]+/)[0];
                                                        approvedGroup(group_id).then((info) => {
                                                            if (info["accepted"] == true) {
                                                                if (user_container.className == "creator-name text-link") {
                                                                    if (user_container.outerHTML.includes(info["name"])) {
                                                                        if (!(user_container.parentElement)) {
                                                                            return;
                                                                        }
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

                                    let username_containers_7 = Array.from(document.querySelectorAll(".avatar-name.text-overflow.ng-binding"));
                                    if (username_containers_7.length > 0) {
                                        username_containers_7.forEach((user_container) => {
                                            if (user_container.outerHTML.includes(`${displayName}`) && user_container.className == "avatar-name text-overflow ng-binding") {
                                                if (user_container.parentElement.parentElement.children[1].outerHTML.includes(`@${username}`)) {
                                                    if (!(user_container.parentElement)) {
                                                        return;
                                                    }
                                                    if (!(user_container.parentElement.parentElement)) {
                                                        return;
                                                    }
                                                    if (!(user_container.parentElement.parentElement.parentElement)) {
                                                        return;
                                                    }
                                                    if (verifiedBadgePlacedAlready(user_container.parentElement.parentElement.parentElement.outerHTML)) {
                                                        return;
                                                    }
                                                    user_container.outerHTML = `${user_container.outerHTML} ${name_small_html}`;
                                                }
                                            }
                                        });
                                    }

                                    let username_containers_8 = Array.from(document.querySelectorAll(".text-overflow.avatar-name.ng-binding.ng-scope"));
                                    if (username_containers_8.length > 0) {
                                        username_containers_8.forEach((user_container) => {
                                            if (user_container.outerHTML.includes(`${displayName}`) && user_container.className == "text-overflow avatar-name ng-binding ng-scope") {
                                                let username_containers_9 = Array.from(document.querySelectorAll(".text-overflow.avatar-card-label.ng-binding.ng-scope"));
                                                if (username_containers_9.length > 0) {
                                                    username_containers_9.forEach((user_container_2) => {
                                                        if (user_container.offsetParent == user_container_2.offsetParent) {
                                                            if (user_container_2.textContent == `@${username}`) {
                                                                if (!(user_container.parentElement)) {
                                                                    return;
                                                                }
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

                                    addPromptButtonInput()
                                }
                                function applyAutoChangeFunctionC() { // Roblox Avatar Cards
                                    let username_containers_7 = Array.from(document.querySelectorAll(".avatar-name.text-overflow.ng-binding"));
                                    if (username_containers_7.length > 0) {
                                        username_containers_7.forEach((user_container) => {
                                            if (user_container.outerHTML.includes(`${displayName}`) && user_container.className == "avatar-name text-overflow ng-binding") {
                                                if (user_container.parentElement.parentElement.children[1].outerHTML.includes(`@${username}`)) {
                                                    if (!(user_container.parentElement)) {
                                                        return;
                                                    }
                                                    if (!(user_container.parentElement.parentElement)) {
                                                        return;
                                                    }
                                                    if (!(user_container.parentElement.parentElement.parentElement)) {
                                                        return;
                                                    }
                                                    if (verifiedBadgePlacedAlready(user_container.parentElement.parentElement.parentElement.outerHTML)) {
                                                        return;
                                                    }
                                                    user_container.outerHTML = `${user_container.outerHTML} ${name_small_html}`;
                                                }
                                            }
                                        });
                                    }

                                    addPromptButtonInput()
                                }
                                function applyAutoChangeFunctionD() { // Unused since inventory doesn't show verified badges.
                                    let username_containers_9 = Array.from(document.querySelectorAll(".creator-name.text-overflow.text-link.ng-binding"));
                                    if (username_containers_9.length > 0) {
                                        username_containers_9.forEach((user_container) => {
                                            if (user_container.outerHTML.includes(`@${username}`) && user_container.className == "creator-name text-overflow text-link ng-binding") {
                                                if (!(user_container.parentElement)) {
                                                    return;
                                                }
                                                if (verifiedBadgePlacedAlready(user_container.parentElement.outerHTML)) {
                                                    return;
                                                }
                                                user_container.outerHTML = `${user_container.outerHTML} ${name_side_html}`;
                                            }
                                        });
                                        username_containers_9.forEach((user_container) => {
                                            if (include_groups == true) {
                                                if (user_container.className == "creator-name text-overflow text-link ng-binding") {
                                                    if (user_container.href && getIfLinkIsGroup(user_container.href)) {
                                                        let group_id = user_container.href.match(/[0-9]+/)[0];
                                                        approvedGroup(group_id).then((info) => {
                                                            if (info["accepted"] == true) {
                                                                if (user_container.className == "creator-name text-overflow text-link ng-binding") {
                                                                    if (user_container.outerHTML.includes(info["name"])) {
                                                                        if (!(user_container.parentElement)) {
                                                                            return;
                                                                        }
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
                                        })
                                    }
                                }
                                function applyAutoChangeFunctionE() { // Resellers
                                    let username_containers_10 = Array.from(document.querySelectorAll(".text-name.username.ng-binding"));
                                    if (username_containers_10.length > 0) {
                                        username_containers_10.forEach((user_container) => {
                                            if (user_container.outerHTML.includes(`${username}`) && user_container.className == "text-name username ng-binding") {
                                                if (!(user_container.parentElement)) {
                                                    return;
                                                }
                                                if (verifiedBadgePlacedAlready(user_container.parentElement.outerHTML)) {
                                                    return;
                                                }
                                                user_container.outerHTML = `${user_container.outerHTML} ${reseller_html}`;
                                            }
                                        });
                                    }
                                }
                                function applyAutoChangeFunctionF() { // More Avatar Cards
                                    let username_containers_11 = Array.from(document.querySelectorAll(".text-overflow.avatar-name"));
                                    if (username_containers_11.length > 0) {
                                        username_containers_11.forEach((user_container) => {
                                            if (user_container && user_container.outerHTML.includes(`${displayName}`) && getIfLinkIsUserProfile(user_container.href) && getIfLinkIsUser(user_container.href, userId.toString()) && user_container.className == "text-overflow avatar-name") {
                                                if (!(user_container.parentElement)) {
                                                    return;
                                                }
                                                if (verifiedBadgePlacedAlready(user_container.parentElement.outerHTML)) {
                                                    return;
                                                }
                                                user_container.outerHTML = `${user_container.outerHTML} ${game_html}`;
                                            }
                                        });
                                    }
                                }
                                function applyAutoChangeFunctionG() { // Game Cards
                                    let username_containers_12 = Array.from(document.querySelectorAll(".text-overflow.game-card-name.ng-binding"));
                                    if (username_containers_12.length > 0) {
                                        username_containers_12.forEach((user_container) => {
                                            if (include_groups == true) {
                                                if (user_container.className == "text-overflow game-card-name ng-binding") {
                                                    if (user_container.parentElement.parentElement.href && getIfLinkIsGroup(user_container.parentElement.parentElement.href)) {
                                                        let group_id = user_container.parentElement.parentElement.href.match(/[0-9]+/)[0];
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

                                    let username_containers_13 = Array.from(document.querySelectorAll(".ng-binding.slide-item-name.text-overflow.groups.font-title"));
                                    if (username_containers_13.length > 0) {
                                        username_containers_13.forEach((user_container) => {
                                            if (include_groups == true) {
                                                if (user_container.className == "ng-binding slide-item-name text-overflow groups font-title") {
                                                    if (user_container.parentElement.href && getIfLinkIsGroup(user_container.parentElement.href)) {
                                                        let group_id = user_container.parentElement.href.match(/[0-9]+/)[0];
                                                        approvedGroup(group_id, true).then((info) => {
                                                            if (info["accepted"] == true) {
                                                                if (user_container.className == "ng-binding slide-item-name text-overflow groups font-title") {
                                                                    if (user_container.innerHTML.includes(info["name"])) {
                                                                        if (!(user_container.parentElement)) {
                                                                            return;
                                                                        }
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
                                }
                                function applyAutoChangeFunctionH() { // Messages
                                    let username_containers_12 = Array.from(document.querySelectorAll(".paired-name.message-summary-username.positionAboveLink.font-header-2.ng-scope"));
                                    if (username_containers_12.length > 0) {
                                        username_containers_12.forEach((user_container) => {
                                            if (user_container.children[0] && user_container.className == "paired-name message-summary-username positionAboveLink font-header-2 ng-scope") {
                                                if (verifiedBadgePlacedAlready(user_container.children[0].outerHTML)) {
                                                    return;
                                                }
                                                if (user_container.innerHTML.includes(`@${username}`)) {
                                                    user_container.children[0].innerHTML = `${user_container.children[0].innerHTML}${game_html}`;
                                                }
                                            }
                                        });
                                    }

                                    let username_containers_13 = Array.from(document.querySelectorAll(".paired-name.text-name.username-container.font-header-2"));
                                    if (username_containers_13.length > 0) {
                                        username_containers_13.forEach((user_container) => {
                                            if (user_container.children[0] && user_container.className == "paired-name text-name username-container font-header-2") {
                                                if (verifiedBadgePlacedAlready(user_container.children[0].outerHTML)) {
                                                    return;
                                                }
                                                if (user_container.innerHTML.includes(`@${username}`)) {
                                                    user_container.children[0].innerHTML = `${user_container.children[0].innerHTML}${game_html}`;
                                                }
                                            }
                                        });
                                    }
                                }
                                function applyAutoChangeFunctionI() { // More Names
                                    let username_containers_4 = Array.from(document.querySelectorAll(".text-name"));
                                    if (username_containers_4.length > 0) {
                                        username_containers_4.forEach((user_container) => {
                                            if (!(user_container.parentElement)) {
                                                return;
                                            }
                                            if (user_container.parentElement.outerHTML.includes(`${username}`) && user_container.parentElement.outerHTML.includes(userId) && user_container.className == "text-name") {
                                                if (verifiedBadgePlacedAlready(user_container.parentElement.parentElement.outerHTML)) {
                                                    return;
                                                }
                                                user_container.parentElement.outerHTML = `${user_container.parentElement.outerHTML}${generateVerifiedIcon(game_html, 4, null, null, 2, null, null)}`;
                                            } else if (include_groups == true) {
                                                if (user_container.href && getIfLinkIsGroup(user_container.href)) {
                                                    let group_id = user_container.href.match(/[0-9]+/)[0];
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
                                                                user_container.parentElement.outerHTML = `${user_container.parentElement.outerHTML}${generateVerifiedIcon(game_html, 4, null, null, 2, null, null)}`;
                                                            }
                                                        }
                                                    })
                                                }
                                            }
                                        });
                                    }

                                    let username_containers_5 = Array.from(document.querySelectorAll(".rbx-private-owner"));
                                    if (username_containers_5.length > 0) {
                                        username_containers_5.forEach((user_container) => {
                                            if (!(user_container.children && user_container.children[1])) {
                                                return;
                                            }
                                            if (!(user_container.children[1].children[0])) {
                                                return;
                                            }
                                            if (!(user_container.children[1].children[0].children[1])) {
                                                return;
                                            }
                                            if (user_container.children[1].href && getIfLinkIsUserProfile(user_container.children[1].href) && getIfLinkIsUser(user_container.children[1].href, userId.toString()) && user_container.className == "rbx-private-owner") {
                                                if (verifiedBadgePlacedAlready(user_container.children[1].children[0].children[1].innerHTML)) {
                                                    return;
                                                }
                                                user_container.children[1].children[0].children[1].innerHTML = generateVerifiedIcon(game_html, 4, null, null, 1, null, null);
                                            }
                                        });
                                    }
                                }

                                let username_containers_2 = Array.from(document.querySelectorAll(".creator-name.text-link"));
                                if (username_containers_2.length > 0) {
                                    username_containers_2.forEach((user_container) => {
                                        if (user_container.outerHTML.includes(`@${username}`) && user_container.className == "creator-name text-link") {
                                            if (!(user_container.parentElement)) {
                                                return;
                                            }
                                            if (verifiedBadgePlacedAlready(user_container.parentElement.outerHTML)) {
                                                return;
                                            }
                                            user_container.outerHTML = `${user_container.outerHTML} ${generateVerifiedIcon(name_side_html, 2, null, null, -1)}`;
                                        }
                                        if (include_groups == true) {
                                            if (user_container.className == "creator-name text-link") {
                                                if (user_container.href && getIfLinkIsGroup(user_container.href)) {
                                                    let group_id = user_container.href.match(/[0-9]+/)[0];
                                                    approvedGroup(group_id).then((info) => {
                                                        if (info["accepted"] == true) {
                                                            if (user_container.className == "creator-name text-link") {
                                                                if (user_container.outerHTML.includes(info["name"])) {
                                                                    if (!(user_container.parentElement)) {
                                                                        return;
                                                                    }
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

                                let username_containers_3 = Array.from(document.querySelectorAll(".text-name.text-overflow"));
                                if (username_containers_3.length > 0) {
                                    username_containers_3.forEach((user_container) => {
                                        if (user_container.outerHTML.includes(`@${username}`) && user_container.className == "text-name text-overflow") {
                                            if (!(user_container.parentElement)) {
                                                return;
                                            }
                                            if (verifiedBadgePlacedAlready(user_container.parentElement.outerHTML)) {
                                                return;
                                            }
                                            user_container.outerHTML = `${user_container.outerHTML}${game_html}`;
                                        } else if (include_groups == true) {
                                            if (user_container.href && getIfLinkIsGroup(user_container.href)) {
                                                let group_id = user_container.href.match(/[0-9]+/)[0];
                                                approvedGroup(group_id).then((info) => {
                                                    if (info["accepted"] == true && user_container.className == "text-name text-overflow") {
                                                        if (user_container.outerHTML.includes(info["name"])) {
                                                            if (!(user_container.parentElement)) {
                                                                return;
                                                            }
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

                                let username_containers_4 = Array.from(document.querySelectorAll(".text-name"));
                                if (username_containers_4.length > 0) {
                                    username_containers_4.forEach((user_container) => {
                                        if (!(user_container.parentElement)) {
                                            return;
                                        }
                                        if (user_container.parentElement.outerHTML.includes(`${username}`) && user_container.parentElement.outerHTML.includes(userId) && user_container.className == "text-name") {
                                            if (verifiedBadgePlacedAlready(user_container.parentElement.parentElement.outerHTML)) {
                                                return;
                                            }
                                            user_container.parentElement.outerHTML = `${user_container.parentElement.outerHTML}${generateVerifiedIcon(game_html, 4, null, null, 2, null, null)}`;
                                        } else if (include_groups == true) {
                                            if (user_container.href && getIfLinkIsGroup(user_container.href)) {
                                                let group_id = user_container.href.match(/[0-9]+/)[0];
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
                                                            user_container.parentElement.outerHTML = `${user_container.parentElement.outerHTML}${generateVerifiedIcon(game_html, 4, null, null, 2, null, null)}`;
                                                        }
                                                    }
                                                })
                                            }
                                        }
                                    });
                                }

                                let username_containers_5 = Array.from(document.querySelectorAll(".text-overflow.age-bracket-label-username.font-caption-header"));
                                if (username_containers_5.length > 0) {
                                    username_containers_5.forEach((user_container) => {
                                        if (user_container.outerHTML.includes(`${displayName}`) && user_container.className == "text-overflow age-bracket-label-username font-caption-header") {
                                            if (!(user_container.parentElement)) {
                                                return;
                                            }
                                            if (verifiedBadgePlacedAlready(user_container.parentElement.outerHTML)) {
                                                return;
                                            }
                                            user_container.outerHTML = `${user_container.outerHTML} ${name_side_html.replace("margin-left: 2px;width: 12px;height: 12px; background: none !important;", "margin-right: 6px; margin-left: -2px; width: 14px; height: 14px; background: none !important;")}`;
                                        }
                                    });
                                }

                                let username_containers_6 = Array.from(document.querySelectorAll(".text-name.name.ng-binding"));
                                if (username_containers_6.length > 0) {
                                    username_containers_6.forEach((user_container) => {
                                        if (user_container.outerHTML.includes(`${displayName}`) && user_container.className == "text-name name ng-binding") {
                                            if (!(user_container.parentElement)) {
                                                return;
                                            }
                                            if (verifiedBadgePlacedAlready(user_container.parentElement.outerHTML)) {
                                                return;
                                            }
                                            user_container.outerHTML = `${user_container.outerHTML} ${generateVerifiedIcon(name_side_html, 2, 12, 12, 4, 16, 16)}`;
                                        }
                                    });
                                }

                                let username_containers_7 = Array.from(document.querySelectorAll(".avatar-name.text-overflow.ng-binding"));
                                if (username_containers_7.length > 0) {
                                    username_containers_7.forEach((user_container) => {
                                        if (user_container.outerHTML.includes(`${displayName}`) && user_container.className == "avatar-name text-overflow ng-binding") {
                                            if (user_container.parentElement.parentElement.children[1].outerHTML.includes(`@${username}`)) {
                                                if (!(user_container.parentElement)) {
                                                    return;
                                                }
                                                if (!(user_container.parentElement.parentElement)) {
                                                    return;
                                                }
                                                if (verifiedBadgePlacedAlready(user_container.parentElement.parentElement.parentElement.outerHTML)) {
                                                    return;
                                                }
                                                user_container.outerHTML = `${user_container.outerHTML} ${name_small_html}`;
                                            }
                                        }
                                    });
                                }

                                setTimeout(function () {
                                    let username_containers_8 = Array.from(document.querySelectorAll(".text-overflow.avatar-name.ng-binding.ng-scope"));
                                    if (username_containers_8.length > 0) {
                                        username_containers_8.forEach((user_container) => {
                                            if (user_container.outerHTML.includes(`${displayName}`) && user_container.className == "text-overflow avatar-name ng-binding ng-scope") {
                                                let username_containers_9 = Array.from(document.querySelectorAll(".text-overflow.avatar-card-label.ng-binding.ng-scope"));
                                                if (username_containers_9.length > 0) {
                                                    username_containers_9.forEach((user_container_2) => {
                                                        if (user_container.offsetParent == user_container_2.offsetParent) {
                                                            if (user_container_2.textContent == `@${username}`) {
                                                                if (!(user_container.parentElement)) {
                                                                    return;
                                                                }
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

                                    let friends_username_containers = Array.from(document.querySelectorAll(".text-link.friend-link.ng-isolate-scope"));
                                    if (friends_username_containers.length > 0) {
                                        friends_username_containers.forEach((user_container) => {
                                            if (user_container.href && user_container.className == "text-link friend-link ng-isolate-scope") {
                                                let userIdd = user_container.href.match(/[0-9]+/)[0];
                                                if (userId == userIdd) {
                                                    if (user_container.innerHTML.includes(`class="hide"`) && user_container.innerHTML.includes(displayName)) {
                                                        if (user_container.children[1]) {
                                                            if (!(user_checkmark_color == "%230066ff" || user_checkmark_color == "%230066FF")) {  // User's selected color
                                                                user_container.children[1].innerHTML = user_container.children[1].innerHTML.replaceAll(`class="hide"`, "").replaceAll(`%230066FF`, user_checkmark_color)
                                                            } else if (approved_efazdev_users[userId] && approved_efazdev_users[userId]["hexColor"]) { // If the main user has selected the default, has EfazDev Approved Users enabled, and there's a color attached to the approved user.
                                                                let hex_color = approved_efazdev_users[userId]["hexColor"]
                                                                hex_color = hex_color.replace("#", "%23");
                                                                user_container.children[1].innerHTML = user_container.children[1].innerHTML.replaceAll(`class="hide"`, "").replaceAll(`%230066FF`, hex_color)
                                                            } else if (approved_by_user_users[userId] && approved_by_user_users[userId]["hexColor"]) { // If the main user has selected the default, has EfazDev Approved Users enabled, and there's a color attached to the approved user.
                                                                let hex_color = approved_by_user_users[userId]["hexColor"]
                                                                hex_color = hex_color.replace("#", "%23");
                                                                user_container.children[1].innerHTML = user_container.children[1].innerHTML.replaceAll(`class="hide"`, "").replaceAll(`%230066FF`, hex_color)
                                                            } else {
                                                                user_container.children[1].innerHTML = user_container.children[1].innerHTML.replaceAll(`class="hide"`, "")
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        });
                                    }

                                    let friends_scroll_containers = Array.from(document.querySelectorAll(".friends-carousel-tile-labels"));
                                    if (friends_scroll_containers.length > 0) {
                                        friends_scroll_containers.forEach((user_container) => {
                                            if (user_container.href && user_container.className == "friends-carousel-tile-labels") {
                                                let userIdd = user_container.href.match(/[0-9]+/)[0];
                                                if (userId == userIdd) {
                                                    if (user_container.children[0] && user_container.children[0].children[0]) {
                                                        if (verifiedBadgePlacedAlready(user_container.children[0].children[0].outerHTML)) {
                                                            return;
                                                        }
                                                        user_container.children[0].children[0].innerHTML = `${user_container.children[0].children[0].innerHTML} ${generateVerifiedIcon(friends_scroll_html, null, 28, 28, null, 16, 16).replace(`width='28'`, `width='16'`).replace(`height='28'`, `height='16'`)}`;
                                                    }
                                                }
                                            }
                                        });
                                    }
                                }, start_time);

                                /* Start all automatic changes and observers */
                                applyAutoChangeFunctionA();
                                applyAutoChangeFunctionB();
                                applyAutoChangeFunctionC();
                                applyAutoChangeFunctionE();
                                applyAutoChangeFunctionF();
                                applyAutoChangeFunctionG();
                                applyAutoChangeFunctionH();
                                applyAutoChangeFunctionI();
                                /* Start all automatic changes and observers */

                                /* Loop entire function again */
                                setTimeout(function () {
                                    addPromptButtonInput()
                                    scanUser(id, isMain)
                                }, start_time)
                                /* Loop entire function again */
                            }
                        }
                    }).catch(err => {
                        if (/Extension context/.test(err.toString())) {
                            broken_context = true
                            return { "accepted": false }
                        } else {
                            warn(err);
                            if (allow_messages == true) {
                                alert("We couldn't apply the verified badge due to an error! Sorry!");
                            } else {
                                timeout(() => {
                                    scanUser(id, isMain)
                                }, start_time)
                            }
                        }
                    })
            } catch (err) {
                warn(err);
                if (allow_messages == true) alert("We couldn't apply the verified badge due to an error! Sorry!");
            }
        }
        getUserData("*", true).then(json => {
            if (json && json["id"]) {
                scanUser(json["id"], true)
            }
        }).catch(err => {
            warn(err);
            if (allow_messages == true) alert("We couldn't apply the verified badge due to an error! Sorry!");
        })
        setTimeout(function () {
            if (typeof chrome !== 'undefined' && typeof chrome.storage !== 'undefined') {
                if (window.verifiedCheckmarkSettings["verifiedBadgeBetweenAccounts"] == true) {
                    getUserData("*", true).then(json => {
                        if (json && json["id"]) {
                            chrome.storage.local.get("user_verification").then((stored_user_data) => {
                                if (stored_user_data["user_verification"]) {
                                    let ids = Object.keys(stored_user_data["user_verification"])
                                    ids.forEach((user_id) => {
                                        if (!(user_id == json["id"])) {
                                            scanUser(user_id, false)
                                        }
                                    })
                                }
                            })
                        }
                    }).catch(err => {
                        warn(err);
                        if (allow_messages == true) alert("We couldn't apply the verified badge due to an error! Sorry!");
                    })
                }
                if (window.verifiedCheckmarkSettings["useCustomApprovedBadgesByUser"] == true) {
                    getUserData("*", true).then(json => {
                        if (json && json["id"]) {
                            chrome.storage.local.get("user_verification").then((stored_user_data) => {
                                if (stored_user_data["user_verification"]) {
                                    let ids = Object.keys(approved_by_user_users)
                                    ids.forEach((user_id) => {
                                        let approved_user_info = approved_by_user_users[user_id]
                                        if (!(approved_user_info["id"] == json["id"].toString())) {
                                            scanUser(approved_user_info["id"], false)
                                        }
                                    })
                                }
                            })
                        }
                    }).catch(err => {
                        warn(err);
                        if (allow_messages == true) alert("We couldn't apply the verified badge due to an error! Sorry!");
                    })
                }
                if (window.verifiedCheckmarkSettings["allowEfazDevApprovedBadges"] == true) {
                    getUserData("*", true).then(json => {
                        if (json && json["id"]) {
                            chrome.storage.local.get("user_verification").then((stored_user_data) => {
                                if (stored_user_data["user_verification"]) {
                                    let ids = Object.keys(approved_efazdev_users)
                                    ids.forEach((user_id) => {
                                        let approved_user_info = approved_efazdev_users[user_id]
                                        if (!(approved_user_info["id"] == json["id"].toString())) {
                                            scanUser(approved_user_info["id"], false)
                                        }
                                    })
                                }
                            })
                        }
                    }).catch(err => {
                        warn(err);
                        if (allow_messages == true) alert("We couldn't apply the verified badge due to an error! Sorry!");
                    })
                }
            }
        }, start_time * 5)
    }
}
async function loader() { // Script Loader
    if (!(window.location.hostname == "www.roblox.com")) {
        // warn("The host of this script being ran on is not www.roblox.com.")
        return;
    }
    if (typeof chrome !== 'undefined' && typeof chrome.storage !== 'undefined') { // Chrome Extension >= v1.4.0
        const storage_key = "dev.efaz.verified_badge_add_on"
        chrome.storage.local.get([storage_key], async function (items) {
            if (items[storage_key] && items[storage_key]["color"]) {
                window.verifiedCheckmarkSettings = items[storage_key]
            } else {
                window.verifiedCheckmarkSettings = {
                    "allowAlertMessages": false,
                    "color": "#0066ff",
                    "enabled": true,
                    "groupsIncluded": true,
                    "startTime": "125",
                    "thanks": true,
                    "verifiedPrompt": true,
                    "verifiedBadgeBetweenAccounts": true,
                    "allowEfazDevApprovedBadges": false,
                    "useCustomApprovedBadgesByUser": false
                }
            }
            if (typeof (window.verifiedCheckmarkSettings["enabled"]) == "boolean") {
                enabled = window.verifiedCheckmarkSettings["enabled"];
            }
            if (typeof (window.verifiedCheckmarkSettings["allowAlertMessages"]) == "boolean") {
                allow_messages = window.verifiedCheckmarkSettings["allowAlertMessages"];
            }
            if (typeof (window.verifiedCheckmarkSettings["startTime"]) == "string") {
                if (Number(window.verifiedCheckmarkSettings["startTime"])) {
                    start_time = Number(window.verifiedCheckmarkSettings["startTime"]);
                }
            }
            if (window.verifiedCheckmarkSettings["allowEfazDevApprovedBadges"] == true) {
                try {
                    let appr_json = await fetch("https://cdn.efaz.dev/extensions/dev.efaz.verified_badge_add_on/resources/approved_users.json").then(appr_res => {
                        if (appr_res.ok) {
                            return appr_res.json()
                        } else {
                            return {}
                        }
                    }).catch((err) => {
                        warn(err)
                        return {}
                    })
                    approved_efazdev_users = appr_json;
                } catch (err) {
                    warn(err)
                    approved_efazdev_users = {}
                }
            }
            if (window.verifiedCheckmarkSettings["useCustomApprovedBadgesByUser"] == true) {
                try {
                    let appr_json = await chrome.storage.local.get("user_approved_json").then(async (app_json_items) => {
                        if (app_json_items && app_json_items["user_approved_json"]) {
                            if (typeof (app_json_items["user_approved_json"]) == "object") {
                                return app_json_items["user_approved_json"]
                            } else {
                                warn("Invalid JSON data.");
                                return {}
                            }
                        } else {
                            return {}
                        }
                    });
                    approved_by_user_users = appr_json;
                } catch (err) {
                    warn(err)
                    approved_by_user_users = {}
                }
            }
            if (document.readyState === "complete") {
                timeout(() => { start() }, start_time)
            } else {
                window.addEventListener("DOMContentLoaded", start)
            }
            console.log("Starting Verified Badge Loader: Settings Configuration v3")
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
        if (window.verifiedCheckmarkSettings["allowEfazDevApprovedBadges"] == true) {
            fetch("https://cdn.efaz.dev/extensions/dev.efaz.verified_badge_add_on/resources/approved_users.json").then(appr_res => {
                if (appr_res.ok) {
                    return appr_res.json()
                } else {
                    return {}
                }
            }).then(appr_json => {
                approved_efazdev_users = appr_json;
                if (document.readyState === "complete") {
                    timeout(() => { start() }, start_time)
                } else {
                    window.addEventListener("DOMContentLoaded", start)
                }
                console.log("Starting Verified Badge Loader: Settings Configuration v2")
            }).catch(err => {
                warn(err)
                if (document.readyState === "complete") {
                    timeout(() => { start() }, start_time)
                } else {
                    window.addEventListener("DOMContentLoaded", start)
                }
                console.log("Starting Verified Badge Loader: Settings Configuration v2")
            })
        } else {
            if (document.readyState === "complete") {
                timeout(() => { start() }, start_time)
            } else {
                window.addEventListener("DOMContentLoaded", start)
            }
            console.log("Starting Verified Badge Loader: Settings Configuration v2")
        }
    } else {  // Javascript URL / Chrome Console
        window.verifiedCheckmarkSettings = {
            "allowAlertMessages": false,
            "color": "#0066ff",
            "enabled": true,
            "groupsIncluded": true,
            "startTime": "125",
            "thanks": true,
            "verifiedPrompt": true,
            "verifiedBadgeBetweenAccounts": true,
            "allowEfazDevApprovedBadges": false,
            "useCustomApprovedBadgesByUser": false
        }
        if (typeof (window.verifiedCheckmarkSettings["allowAlertMessages"]) == "boolean") {
            allow_messages = window.verifiedCheckmarkSettings["allowAlertMessages"];
        }
        if (typeof (window.verifiedCheckmarkSettings["startTime"]) == "string") {
            if (Number(window.verifiedCheckmarkSettings["startTime"])) {
                start_time = Number(window.verifiedCheckmarkSettings["startTime"]);
            }
        }
        if (document.readyState === "complete") {
            timeout(() => { start() }, start_time)
        } else {
            window.addEventListener("DOMContentLoaded", start)
        }
        console.log("Starting Verified Badge Loader: Settings Configuration v1")
    }
}
loader() // Start Loader