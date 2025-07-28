let enabled = true;
let allow_messages = false;
let settings = {}
let group_data = {};
let temp_usr = {};
let cache_html = {};
let start_time = 125;
let appr_efazdev_user = {};
let appr_user_users = {};
let group_scan = false;

function warn(mes) { console.warn(`Verified Badge Loader: ${mes}`) }
function timeout(func, ms) { setTimeout(func, ms); }
function start() {
    function logMessage(message) {
        if (allow_messages == true) { console.log(`Verified Badge Loader: ${message}`) }
    }
    function genVIcon(close, orgMargin, orgX, orgY, margin, sizeX, sizeY) {
        let res = close
        if ((typeof (orgMargin) == "number") && (typeof (margin) == "number")) { res = res.replace(`margin-left: ${orgMargin}px;`, `margin-left: ${margin}px;`) }
        if ((typeof (orgX) == "number") && (typeof (sizeX) == "number")) { res = res.replace(`width: ${orgX}px;`, `width: ${sizeX}px;`) }
        if ((typeof (orgY) == "number") && (typeof (sizeY) == "number")) { res = res.replace(`height: ${orgY}px;`, `height: ${sizeY}px;`) }
        return res
    }
    function applyChangesToHTML(json, user_checkmark_color) {
        if (cache_html[json["id"]]) { return cache_html[json["id"]]; }
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
        if (user_checkmark_color == "%230066ff" || user_checkmark_color == "%230066FF") {  // User's selected color
            user_checkmark_color = "%230066FF"
        } else if (appr_efazdev_user[json["id"]] && appr_efazdev_user[json["id"]]["hexColor"]) { // If the main user has selected the default, has EfazDev Approved Users enabled, and there's a color attached to the approved user.
            hex_color = appr_efazdev_user[json["id"]]["hexColor"].replace("#", "%23");
            efaz_approved_prompt_html = efaz_approved_prompt_html.replace("%23FF4B00", hex_color);
        } else if (appr_user_users[json["id"]] && appr_user_users[json["id"]]["hexColor"]) { // If the main user has selected the default, has EfazDev Approved Users enabled, and there's a color attached to the approved user.
            hex_color = appr_user_users[json["id"]]["hexColor"].replace("#", "%23");
            efaz_approved_prompt_html = efaz_approved_prompt_html.replace("%23FF4B00", hex_color);
        }
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
        friends_scroll_html = friends_scroll_html.replace("%230066FF", hex_color);
        /* Apply color changes to HTML above */
        if (!(cache_html[json["id"]])) {
            cache_html[json["id"]] = [
                hex_color, profile_html, profile2_html, name_html, 
                name_html_larger, name_side_real_html, name_side_html, game_html, 
                name_small_html, group_name_verified_html, group_owner_name_html, reseller_html, 
                efaz_approved_prompt_html, prompt_html, user_approved_prompt_html, friends_scroll_html
            ]
        }
        return cache_html[json["id"]]
    }
    function vIconPlaced(html) { return html.includes("data-rblx-badge-icon") || html.includes("replicate-badge-addon-prompt") || html.includes("Verified Badge Icon") }
    if (enabled) {
        let user_checkmark_color = "%230066FF"
        let broken_context = false;
        let cache_groups = null;
        let custom_checkmark_color = settings["color"]
        if (custom_checkmark_color) { user_checkmark_color = custom_checkmark_color.replace("#", "%23"); }
        function getIfLinkIsGroup(link) { return link.includes("/groups/") || link.includes("/communities/") }
        function getIfLinkIsUserProfile(link) { return link.includes("/users/") && link.includes("/profile") }
        function getIfLinkIsUser(link, userId) {  return (getIfLinkIsUserProfile(link) && link.includes("/" + userId + "/profile"))  }
        function generateInstantPromise(value) { return new Promise((resolve, reject) => { resolve(value) }); }
        async function getUserData(id, isMain) {
            if (broken_context == true) { return generateInstantPromise(null)
            } else {
                return chrome.storage.local.get("user_verification").then((stored_user_data) => {
                    if (!(typeof (stored_user_data["user_verification"]) == "object")) { stored_user_data["user_verification"] = {} }
                    if (stored_user_data["user_verification"][id.toString()]) { return stored_user_data["user_verification"][id.toString()]
                    } else if (temp_usr[id.toString()]) { return temp_usr[id.toString()]
                    } else if (appr_efazdev_user[id.toString()]) { return appr_efazdev_user[id.toString()]
                    } else if (appr_user_users[id.toString()]) { return appr_user_users[id.toString()]
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
                                if (res.ok) { return res.json()
                                } else {
                                    logMessage("User is not logged in!")
                                    return null
                                }
                            }).then(json => {
                                if (json) {
                                    temp_usr["*"] = json
                                    stored_user_data["user_verification"][json["id"].toString()] = json
                                    return chrome.storage.local.set(stored_user_data).then(() => {
                                        return json
                                    })
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
                    if (err.toString().includes("Extension context")) {
                        broken_context = true
                        return null
                    } else {
                        warn(`Error with getting approved users: ${err}`)
                        return null
                    }
                });
            }
        }
        function scanUser(id, isMain) {
            try {
                getUserData(id, isMain)
                    .then((res) => {
                        if (res) { return res
                        } else { return {}; }
                    })
                    .then((json) => {
                        if (json && json["id"]) {
                            let fhe = applyChangesToHTML(json, user_checkmark_color);
                            let hex_color = fhe[0];
                            let profile_html = fhe[1].replaceAll("[input_id]", json["id"]);
                            let profile2_html = fhe[2].replaceAll("[input_id]", json["id"]);
                            let name_html = fhe[3];
                            let name_html_larger = fhe[4];
                            let name_side_real_html = fhe[5];
                            let name_side_html = fhe[6];
                            let game_html = fhe[7];
                            let name_small_html = fhe[8];
                            let group_name_verified_html = fhe[9];
                            let group_owner_name_html = fhe[10];
                            let reseller_html = fhe[11];
                            let efaz_approved_prompt_html = fhe[12];
                            let prompt_html = fhe[13];
                            let user_approved_prompt_html = fhe[14];
                            let friends_scroll_html = fhe[15];

                            let include_groups = settings["groupsIncluded"] == true;
                            let userId = json["id"];
                            let username = json["name"];
                            let username_at = "@" + json["name"];
                            let displayName = json["displayName"];

                            async function approvedGroup(id, onlycached) {
                                if (broken_context == true) { return { "accepted": false } }
                                try {
                                    async function ee(allowed_groups) {
                                        if (!(typeof (allowed_groups["group_ownership"]) == "object")) { allowed_groups["group_ownership"] = {} }
                                        let group_keys = Object.keys(allowed_groups["group_ownership"])
                                        let changes_made = false
                                        group_keys.forEach((key) => {
                                            if (allowed_groups["group_ownership"][key] && allowed_groups["group_ownership"][key]["owner"] == userId && allowed_groups["group_ownership"][key]["accepted"] == false) { allowed_groups["group_ownership"][key]["accepted"] = true; changes_made = true }
                                        })
                                        if (changes_made == true) {
                                            chrome.storage.local.set(allowed_groups).then(() => {
                                                logMessage("Saved to chrome storage!")
                                                group_scan = false
                                                if (allowed_groups["group_ownership"][id] == false) { return { "accepted": false }
                                                } else { return allowed_groups["group_ownership"][id] }
                                            })
                                        }

                                        if (typeof (allowed_groups["group_ownership"][id]) == "object") {
                                            if (appr_efazdev_user[allowed_groups["group_ownership"][id]["owner"]] && (!(allowed_groups["group_ownership"][id]["owner"] == userId))) { return { "accepted": false }
                                            } else if (appr_user_users[allowed_groups["group_ownership"][id]["owner"]] && (!(allowed_groups["group_ownership"][id]["owner"] == userId))) { return { "accepted": false }
                                            } else { return allowed_groups["group_ownership"][id] }
                                        } else if (allowed_groups["group_ownership"][id] == false) { return { "accepted": false }
                                        } else if (allowed_groups["group_ownership"] && ((!(allowed_groups["group_ownership"][id])) && allowed_groups["group_ownership"][`scan_${userId}`] == true)) { return { "accepted": false }
                                        } else {
                                            if (onlycached == true) { return { "accepted": false }
                                            } else {
                                                if (group_scan == true) { return { "accepted": false }
                                                } else {
                                                    group_scan = true
                                                    if (group_data["temp_group_info"]) {
                                                        if (typeof (allowed_groups["group_ownership"][id]) == "object") {
                                                            if (appr_efazdev_user[allowed_groups["group_ownership"][id]["owner"]] && (!(allowed_groups["group_ownership"][id]["owner"] == userId))) { return { "accepted": false }
                                                            } else if (appr_user_users[allowed_groups["group_ownership"][id]["owner"]] && (!(allowed_groups["group_ownership"][id]["owner"] == userId))) { return { "accepted": false }
                                                            } else { return allowed_groups["group_ownership"][id] }
                                                        } else if (allowed_groups["group_ownership"][id] == false) { return { "accepted": false }
                                                        } else if (allowed_groups["group_ownership"] && ((!(allowed_groups["group_ownership"][id])) && allowed_groups["group_ownership"][`scan_${userId}`] == true)) { return { "accepted": false }
                                                        } else { return { "accepted": false } }
                                                    } else {
                                                        return fetch(`https://groups.roblox.com/v1/users/${userId}/groups/roles?includeLocked=true&includeNotificationPreferences=true`, { "mode": "cors", "credentials": "include" }).then(grou_res => {
                                                            if (grou_res.ok) { return grou_res.json(); }
                                                        }).then(grou_resjson => {
                                                            if (grou_resjson) {
                                                                if (grou_resjson["data"]) {
                                                                    group_data["temp_group_info"] = {}
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
                                                                        group_data["temp_group_info"][grou_json["id"]] = allowed_groups["group_ownership"][grou_json["id"]]
                                                                    })

                                                                    if (!(allowed_groups["group_ownership"][id])) {
                                                                        let user_approved_keys = Object.keys(appr_user_users)
                                                                        if (user_approved_keys) {
                                                                            user_approved_keys.forEach((ke) => {
                                                                                let info = appr_user_users[ke]
                                                                                if (info["approve_groups"]) {
                                                                                    if (info["approve_groups"].includes(id)) {
                                                                                        allowed_groups["group_ownership"][id] = {
                                                                                            "accepted": true,
                                                                                            "id": id,
                                                                                            "owner": info["id"],
                                                                                            "name": info["approve_groups"][id]["name"],
                                                                                        }
                                                                                        group_data["temp_group_info"][id] = allowed_groups["group_ownership"][id]
                                                                                    }
                                                                                }
                                                                            })
                                                                        }

                                                                        let efazdev_approved_keys = Object.keys(appr_efazdev_user)
                                                                        if (efazdev_approved_keys) {
                                                                            efazdev_approved_keys.forEach((ke) => {
                                                                                let info = appr_efazdev_user[ke]
                                                                                if (info["approve_groups"]) {
                                                                                    if (info["approve_groups"].includes(id)) {
                                                                                        allowed_groups["group_ownership"][id] = {
                                                                                            "accepted": true,
                                                                                            "id": id,
                                                                                            "owner": info["id"],
                                                                                            "name": info["approve_groups"][id]["name"],
                                                                                        }
                                                                                        group_data["temp_group_info"][id] = allowed_groups["group_ownership"][id]
                                                                                    }
                                                                                }
                                                                            })
                                                                        }
                                                                    }

                                                                    return chrome.storage.local.set(allowed_groups).then(() => {
                                                                        logMessage("Saved to chrome storage!")
                                                                        group_scan = false
                                                                        if (allowed_groups["group_ownership"][id] == false) { return { "accepted": false }
                                                                        } else if (allowed_groups["group_ownership"][id]) { return allowed_groups["group_ownership"][id]
                                                                        } else { return { "accepted": false } }
                                                                    })
                                                                } else { return { "accepted": false } }
                                                            } else { return { "accepted": false } }
                                                        });
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    if (cache_groups) { return await ee(cache_groups)
                                    } else {
                                        cache_groups = {};
                                        return await chrome.storage.local.get("group_ownership").then(async (allowed_groups) => {
                                            cache_groups = allowed_groups;
                                            return await ee(cache_groups)
                                        }).catch(err => {
                                            cache_groups = null;
                                        })
                                    }
                                } catch (err) {
                                    if (err.toString().includes("Extension context")) {
                                        broken_context = true;
                                        return { "accepted": false }
                                    } else {
                                        warn(`Error with getting approved group: ${err}`);
                                        return { "accepted": false }
                                    }
                                }
                            }
                            function promptMessage() {
                                if (settings) {
                                    let verified_prompt_enabled = settings["verifiedPrompt"];
                                    if (verified_prompt_enabled == true) {
                                        if (appr_efazdev_user[userId.toString()]) {
                                            const placeholder = document.createRange().createContextualFragment(`<div>${efaz_approved_prompt_html}</div>`);
                                            if (!(document.getElementById("fake_verified_badge"))) {
                                                document.body.appendChild(placeholder.children[0].children[0]);
                                            }
                                        } else if (appr_user_users[userId.toString()]) {
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

                            function looped() {
                                if (enabled == true) {
                                    if (getIfLinkIsUserProfile(window.location.pathname) && getIfLinkIsUser(window.location.pathname, userId.toString())) {
                                        let main_headers = Array.from(document.querySelectorAll(".profile-name.text-overflow"));
                                        if (main_headers.length > 0) {
                                            main_headers.forEach((main_header) => {
                                                if (main_header.offsetParent && main_header.offsetParent.className == "header-title") {
                                                    if (vIconPlaced(main_header.offsetParent.innerHTML)) { return ; }
                                                    if (main_header.offsetParent.innerHTML.includes(displayName)) {
                                                        main_header.offsetParent.appendChild(generateDOMElement(profile_html))
                                                    }
                                                } else if (main_header.parentElement && main_header.parentElement.className == "header-title") {
                                                    if (vIconPlaced(main_header.parentElement.innerHTML)) { return ; }
                                                    if (main_header.parentElement.innerHTML.includes(displayName)) {
                                                        main_header.parentElement.appendChild(generateDOMElement(profile_html))
                                                    }
                                                } else if (main_header.parentElement && main_header.parentElement.parentElement && main_header.parentElement.parentElement.className == "header-title") {
                                                    if (vIconPlaced(main_header.parentElement.parentElement.innerHTML)) { return ; }
                                                    if (main_header.parentElement.parentElement.innerHTML.includes(displayName)) {
                                                        main_header.parentElement.parentElement.appendChild(generateDOMElement(profile_html))
                                                    }
                                                }
                                            });
                                        }

                                        let main_headers2 = Array.from(document.querySelectorAll(".profile-header-title-container"));
                                        if (main_headers2.length > 0) {
                                            main_headers2.forEach((main_header) => {
                                                if (vIconPlaced(main_header.innerHTML)) { return ; }
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
                                                    if (vIconPlaced(main_name_on_side.outerHTML)) { return ; }
                                                    main_name_on_side.innerHTML = `${main_name_on_side.innerHTML} ${name_side_real_html}`;
                                                }
                                            }
                                        });
                                    }

                                    let username_containers = Array.from(document.querySelectorAll(".user-name-container"));
                                    if (username_containers.length > 0) {
                                        username_containers.forEach((usr_con) => {
                                            if (usr_con.innerHTML.includes(displayName)) {
                                                if (vIconPlaced(usr_con.innerHTML)) { return ; }
                                                if (usr_con.className == "dynamic-ellipsis-item user-name-container text-link") {
                                                    usr_con.innerHTML = `${usr_con.innerHTML} ${name_html.replace("width='28'", "width='14'").replace("height='28'", "height='14'")}`;
                                                } else {
                                                    usr_con.innerHTML = `${usr_con.innerHTML} ${name_html}`;
                                                }
                                            }
                                        });
                                    }

                                    function sectorA() { // Roblox Groups Main Handler
                                        if (getIfLinkIsGroup(window.location.pathname)) {
                                            function attachExtra() {
                                                let group_guilded_posts = Array.from(document.querySelectorAll(".text-name.name"));
                                                if (group_guilded_posts.length > 0) {
                                                    group_guilded_posts.forEach((shout) => {
                                                        if (shout.className == "text-name name" && shout.innerHTML.includes(displayName) && getIfLinkIsUserProfile(shout.href) && getIfLinkIsUser(shout.href, userId.toString())) {
                                                            if (vIconPlaced(shout.parentElement.outerHTML)) { return ; }
                                                            shout.outerHTML = `${shout.outerHTML} ${genVIcon(name_side_html, 2, 12, 12, 6, 16, 16)}`;
                                                        }
                                                    })
                                                }

                                                let name_in_group = Array.from(document.querySelectorAll(".list-item.member.ng-scope"));
                                                if (name_in_group.length > 0) {
                                                    name_in_group.forEach((main_name_on_group) => {
                                                        if (main_name_on_group && main_name_on_group.children[0] && main_name_on_group.children[0].children[0] && getIfLinkIsUserProfile(main_name_on_group.children[0].children[0].href) && getIfLinkIsUser(main_name_on_group.children[0].children[0].href, userId.toString())) {
                                                            if (main_name_on_group.children[0] && main_name_on_group.children[0].children[2] && main_name_on_group.children[0].children[2].children[0] && main_name_on_group.children[0].children[2].children[0].children[0]) {
                                                                if (vIconPlaced(main_name_on_group.children[0].children[2].children[0].innerHTML)) { return ; }
                                                                main_name_on_group.children[0].children[2].children[0].children[0].innerHTML = `${main_name_on_group.children[0].children[2].children[0].children[0].innerHTML} ${genVIcon(name_side_html, 2, 12, 12, 0, 16, 16)}`
                                                            }
                                                        }
                                                    });
                                                }

                                                let group_wall = Array.from(document.querySelectorAll(".text-label-medium.content-emphasis.ng-binding.ng-scope"));
                                                if (group_wall.length > 0) {
                                                    group_wall.forEach((main_name_on_group) => {
                                                        if (main_name_on_group.outerHTML.includes(displayName) && main_name_on_group.className == "text-label-medium content-emphasis ng-binding ng-scope" && getIfLinkIsUserProfile(main_name_on_group.href) && getIfLinkIsUser(main_name_on_group.href, userId.toString())) {
                                                            if (vIconPlaced(main_name_on_group.innerHTML)) { return ; }
                                                            main_name_on_group.innerHTML = `${main_name_on_group.innerHTML} ${genVIcon(name_side_html, 2, 12, 12, 0, 16, 16)}`;
                                                        }
                                                    });
                                                }

                                                let group_payouts_auto = Array.from(document.querySelectorAll(".avatar-card-name.text-lead.text-overflow.ng-binding.ng-scope"));
                                                if (group_payouts_auto.length > 0) {
                                                    group_payouts_auto.forEach((main_name_on_group) => {
                                                        if (main_name_on_group.innerHTML.includes(displayName) && getIfLinkIsUserProfile(main_name_on_group.href) && getIfLinkIsUser(main_name_on_group.href, userId.toString())) {
                                                            if (vIconPlaced(main_name_on_group.parentElement.innerHTML)) {
                                                                return
                                                            }
                                                            main_name_on_group.innerHTML = `${main_name_on_group.innerHTML} ${genVIcon(name_side_html, 2, 12, 12, -1, 16, 16)}`;
                                                        }
                                                    });
                                                }
                                            }
                                            function refresh() {
                                                let identified_id = window.location.pathname.match(/[0-9]+/);
                                                if (identified_id && identified_id[0]) {
                                                    let group_owners = Array.from(document.querySelectorAll(".MuiLink-underlineHover.web-blox-css-mui-94v26k"));
                                                    if (group_owners.length > 0) {
                                                        if (settings) {
                                                            if (settings["groupsIncluded"] == true) {
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
                                                                                            if (vIconPlaced(main_name_on_group.innerHTML)) {
                                                                                                return;
                                                                                            }
                                                                                            main_name_on_group.innerHTML = `${main_name_on_group.innerHTML} ${genVIcon(name_side_html, 2, 12, 12, 2, 16, 16)}`;
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
                                                                                if (!(group_owner_name.parentElement)) { return; }
                                                                                if (!(vIconPlaced(group_owner_name.parentElement.innerHTML))) {
                                                                                    group_owner_name.outerHTML = `${group_owner_name.outerHTML}${group_owner_name_html}`;
                                                                                }
                                                                                if (settings) {
                                                                                    if (settings["groupsIncluded"] == true) {
                                                                                        let group_name = Array.from(document.querySelectorAll(".profile-header-details-community-name.text-heading-large"));
                                                                                        if (group_name.length > 0) {
                                                                                            group_name.forEach((main_name_on_group) => {
                                                                                                if (vIconPlaced(main_name_on_group.innerHTML)) {
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
                                    function sectorB() { // Creator Name
                                        let unamec_2 = Array.from(document.querySelectorAll(".creator-name.text-link"));
                                        if (unamec_2.length > 0) {
                                            unamec_2.forEach((usr_con) => {
                                                if (usr_con.outerHTML.includes(username_at) && usr_con.className == "creator-name text-link") {
                                                    if (!(usr_con.parentElement)) { return ; }
                                                    if (vIconPlaced(usr_con.parentElement.outerHTML)) { return ; }
                                                    usr_con.outerHTML = `${usr_con.outerHTML} ${genVIcon(name_side_html, 2, null, null, -1)}`;
                                                }
                                            });
                                            unamec_2.forEach((usr_con) => {
                                                if (include_groups == true) {
                                                    if (usr_con.className == "creator-name text-link") {
                                                        if (usr_con.href && getIfLinkIsGroup(usr_con.href)) {
                                                            let group_id = usr_con.href.match(/[0-9]+/)[0];
                                                            approvedGroup(group_id).then((info) => {
                                                                if (info["accepted"] == true) {
                                                                    if (usr_con.className == "creator-name text-link") {
                                                                        if (usr_con.outerHTML.includes(info["name"])) {
                                                                            if (!(usr_con.parentElement)) { return; }
                                                                            if (vIconPlaced(usr_con.parentElement.outerHTML)) { return; }
                                                                            usr_con.outerHTML = `${usr_con.outerHTML} ${genVIcon(name_side_html, 2, null, null, -1)}`;
                                                                        }
                                                                    }
                                                                }
                                                            })
                                                        }
                                                    }
                                                }
                                            });
                                        }

                                        let unamec_7 = Array.from(document.querySelectorAll(".avatar-name.text-overflow.ng-binding"));
                                        if (unamec_7.length > 0) {
                                            unamec_7.forEach((usr_con) => {
                                                if (usr_con.outerHTML.includes(displayName) && usr_con.className == "avatar-name text-overflow ng-binding") {
                                                    if (usr_con.parentElement.parentElement.children[1].outerHTML.includes(username_at)) {
                                                        if (!(usr_con.parentElement)) { return; }
                                                        if (!(usr_con.parentElement.parentElement)) { return; }
                                                        if (!(usr_con.parentElement.parentElement.parentElement)) { return; }
                                                        if (vIconPlaced(usr_con.parentElement.parentElement.parentElement.outerHTML)) { return; }
                                                        usr_con.outerHTML = `${usr_con.outerHTML} ${name_small_html}`;
                                                    }
                                                }
                                            });
                                        }

                                        let unamec_8 = Array.from(document.querySelectorAll(".text-overflow.avatar-name.ng-binding.ng-scope"));
                                        if (unamec_8.length > 0) {
                                            unamec_8.forEach((usr_con) => {
                                                if (usr_con.outerHTML.includes(displayName) && usr_con.className == "text-overflow avatar-name ng-binding ng-scope") {
                                                    let unamec_9 = Array.from(document.querySelectorAll(".text-overflow.avatar-card-label.ng-binding.ng-scope"));
                                                    if (unamec_9.length > 0) {
                                                        unamec_9.forEach((usr_con_2) => {
                                                            if (usr_con.offsetParent == usr_con_2.offsetParent) {
                                                                if (usr_con_2.textContent == `@${username}`) {
                                                                    if (!(usr_con.parentElement)) { return ; }
                                                                    if (vIconPlaced(usr_con.parentElement.outerHTML)) { return ; }
                                                                    usr_con.outerHTML = `${usr_con.outerHTML} ${game_html}`;
                                                                }
                                                            }
                                                        });
                                                    }
                                                }
                                            });
                                        }

                                        addPromptButtonInput()
                                    }
                                    function sectorC() { // Roblox Avatar Cards
                                        let unamec_7 = Array.from(document.querySelectorAll(".avatar-name.text-overflow.ng-binding"));
                                        if (unamec_7.length > 0) {
                                            unamec_7.forEach((usr_con) => {
                                                if (usr_con.outerHTML.includes(displayName) && usr_con.className == "avatar-name text-overflow ng-binding") {
                                                    if (usr_con.parentElement.parentElement.children[1].outerHTML.includes(username_at)) {
                                                        if (!(usr_con.parentElement)) { return; }
                                                        if (!(usr_con.parentElement.parentElement)) { return; }
                                                        if (!(usr_con.parentElement.parentElement.parentElement)) { return; }
                                                        if (vIconPlaced(usr_con.parentElement.parentElement.parentElement.outerHTML)) { return; }
                                                        usr_con.outerHTML = `${usr_con.outerHTML} ${name_small_html}`;
                                                    }
                                                }
                                            });
                                        }

                                        addPromptButtonInput()
                                    }
                                    function sectorD() { // Resellers
                                        let unamec_10 = Array.from(document.querySelectorAll(".text-name.username.ng-binding"));
                                        if (unamec_10.length > 0) {
                                            unamec_10.forEach((usr_con) => {
                                                if (usr_con.outerHTML.includes(username) && usr_con.className == "text-name username ng-binding") {
                                                    if (!(usr_con.parentElement)) { return ; }
                                                    if (vIconPlaced(usr_con.parentElement.outerHTML)) { return ; }
                                                    usr_con.outerHTML = `${usr_con.outerHTML} ${reseller_html}`;
                                                }
                                            });
                                        }
                                    }
                                    function sectorE() { // More Avatar Cards
                                        let unamec_11 = Array.from(document.querySelectorAll(".text-overflow.avatar-name"));
                                        if (unamec_11.length > 0) {
                                            unamec_11.forEach((usr_con) => {
                                                if (usr_con && usr_con.outerHTML.includes(displayName) && getIfLinkIsUserProfile(usr_con.href) && getIfLinkIsUser(usr_con.href, userId.toString()) && usr_con.className == "text-overflow avatar-name") {
                                                    if (!(usr_con.parentElement)) { return ; }
                                                    if (vIconPlaced(usr_con.parentElement.outerHTML)) { return ; }
                                                    usr_con.outerHTML = `${usr_con.outerHTML} ${game_html}`;
                                                }
                                            });
                                        }
                                    }
                                    function sectorF() { // Game Cards
                                        let unamec_12 = Array.from(document.querySelectorAll(".text-overflow.game-card-name.ng-binding"));
                                        if (unamec_12.length > 0) {
                                            unamec_12.forEach((usr_con) => {
                                                if (include_groups == true) {
                                                    if (usr_con.className == "text-overflow game-card-name ng-binding") {
                                                        if (usr_con.parentElement.parentElement.href && getIfLinkIsGroup(usr_con.parentElement.parentElement.href)) {
                                                            let group_id = usr_con.parentElement.parentElement.href.match(/[0-9]+/)[0];
                                                            approvedGroup(group_id, true).then((info) => {
                                                                if (info["accepted"] == true) {
                                                                    if (usr_con.className == "text-overflow game-card-name ng-binding") {
                                                                        if (usr_con.outerHTML.includes(info["name"])) {
                                                                            if (!(usr_con.parentElement)) { return; }
                                                                            if (vIconPlaced(usr_con.parentElement.outerHTML)) { return; }
                                                                            usr_con.outerHTML = `${usr_con.outerHTML} ${genVIcon(name_side_html, 2, 12, 12, 4, 16, 16)}`;
                                                                        }
                                                                    }
                                                                }
                                                            })
                                                        }
                                                    }
                                                }
                                            });
                                        }

                                        let unamec_13 = Array.from(document.querySelectorAll(".ng-binding.slide-item-name.text-overflow.groups.font-title"));
                                        if (unamec_13.length > 0) {
                                            unamec_13.forEach((usr_con) => {
                                                if (include_groups == true) {
                                                    if (usr_con.className == "ng-binding slide-item-name text-overflow groups font-title") {
                                                        if (usr_con.parentElement.href && getIfLinkIsGroup(usr_con.parentElement.href)) {
                                                            let group_id = usr_con.parentElement.href.match(/[0-9]+/)[0];
                                                            approvedGroup(group_id, true).then((info) => {
                                                                if (info["accepted"] == true) {
                                                                    if (usr_con.className == "ng-binding slide-item-name text-overflow groups font-title") {
                                                                        if (usr_con.innerHTML.includes(info["name"])) {
                                                                            if (!(usr_con.parentElement)) { return; }
                                                                            if (vIconPlaced(usr_con.parentElement.outerHTML)) { return; }
                                                                            usr_con.innerHTML = `${usr_con.innerHTML} ${genVIcon(name_side_html, 2, 12, 12, 0, 28, 28)}`;
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
                                    function sectorG() { // Messages
                                        let unamec_12 = Array.from(document.querySelectorAll(".paired-name.message-summary-username.positionAboveLink.font-header-2.ng-scope"));
                                        if (unamec_12.length > 0) {
                                            unamec_12.forEach((usr_con) => {
                                                if (usr_con.children[0] && usr_con.className == "paired-name message-summary-username positionAboveLink font-header-2 ng-scope") {
                                                    if (vIconPlaced(usr_con.children[0].outerHTML)) { return ; }
                                                    if (usr_con.innerHTML.includes(username_at)) {
                                                        usr_con.children[0].innerHTML = `${usr_con.children[0].innerHTML}${game_html}`;
                                                    }
                                                }
                                            });
                                        }

                                        let unamec_13 = Array.from(document.querySelectorAll(".paired-name.text-name.username-container.font-header-2"));
                                        if (unamec_13.length > 0) {
                                            unamec_13.forEach((usr_con) => {
                                                if (usr_con.children[0] && usr_con.className == "paired-name text-name username-container font-header-2") {
                                                    if (vIconPlaced(usr_con.children[0].outerHTML)) { return ; }
                                                    if (usr_con.innerHTML.includes(username_at)) {
                                                        usr_con.children[0].innerHTML = `${usr_con.children[0].innerHTML}${game_html}`;
                                                    }
                                                }
                                            });
                                        }
                                    }
                                    function sectorH() { // More Names
                                        let unamec_4 = Array.from(document.querySelectorAll(".text-name"));
                                        if (unamec_4.length > 0) {
                                            unamec_4.forEach((usr_con) => {
                                                if (!(usr_con.parentElement)) { return ; }
                                                if (usr_con.parentElement.outerHTML.includes(username) && usr_con.parentElement.outerHTML.includes(userId) && usr_con.className == "text-name") {
                                                    if (vIconPlaced(usr_con.parentElement.parentElement.outerHTML)) { return ; }
                                                    usr_con.parentElement.outerHTML = `${usr_con.parentElement.outerHTML}${genVIcon(game_html, 4, null, null, 2, null, null)}`;
                                                } else if (include_groups == true) {
                                                    if (usr_con.href && getIfLinkIsGroup(usr_con.href)) {
                                                        let group_id = usr_con.href.match(/[0-9]+/)[0];
                                                        approvedGroup(group_id).then((info) => {
                                                            if (info["accepted"] == true && usr_con.className == "text-name") {
                                                                if (!(usr_con.parentElement)) { return ; }
                                                                if (!(usr_con.parentElement.parentElement)) { return ; }
                                                                if (usr_con.parentElement.outerHTML.includes(info["name"])) {
                                                                    if (vIconPlaced(usr_con.parentElement.parentElement.outerHTML)) { return ; }
                                                                    usr_con.parentElement.outerHTML = `${usr_con.parentElement.outerHTML}${genVIcon(game_html, 4, null, null, 2, null, null)}`;
                                                                }
                                                            }
                                                        })
                                                    }
                                                }
                                            });
                                        }

                                        let unamec_5 = Array.from(document.querySelectorAll(".rbx-private-owner"));
                                        if (unamec_5.length > 0) {
                                            unamec_5.forEach((usr_con) => {
                                                if (!(usr_con.children && usr_con.children[1])) { return ; }
                                                if (!(usr_con.children[1].children[0])) { return ; }
                                                if (!(usr_con.children[1].children[0].children[1])) { return ; }
                                                if (usr_con.children[1].href && getIfLinkIsUserProfile(usr_con.children[1].href) && getIfLinkIsUser(usr_con.children[1].href, userId.toString()) && usr_con.className == "rbx-private-owner") {
                                                    if (vIconPlaced(usr_con.children[1].children[0].children[1].innerHTML)) { return ; }
                                                    usr_con.children[1].children[0].children[1].innerHTML = genVIcon(game_html, 4, null, null, 1, null, null);
                                                }
                                            });
                                        }
                                    }

                                    let unamec_2 = Array.from(document.querySelectorAll(".creator-name.text-link"));
                                    if (unamec_2.length > 0) {
                                        unamec_2.forEach((usr_con) => {
                                            if (usr_con.outerHTML.includes(username_at) && usr_con.className == "creator-name text-link") {
                                                if (!(usr_con.parentElement)) { return ; }
                                                if (vIconPlaced(usr_con.parentElement.outerHTML)) { return ; }
                                                usr_con.outerHTML = `${usr_con.outerHTML} ${genVIcon(name_side_html, 2, null, null, -1)}`;
                                            }
                                            if (include_groups == true) {
                                                if (usr_con.className == "creator-name text-link" && usr_con.href && getIfLinkIsGroup(usr_con.href)) {
                                                    let group_id = usr_con.href.match(/[0-9]+/)[0];
                                                    approvedGroup(group_id).then((info) => {
                                                        if (info["accepted"] == true && usr_con.className == "creator-name text-link" && usr_con.outerHTML.includes(info["name"])) {
                                                            if (!(usr_con.parentElement)) { return; }
                                                            if (vIconPlaced(usr_con.parentElement.outerHTML)) { return; }
                                                            usr_con.outerHTML = `${usr_con.outerHTML} ${genVIcon(name_side_html, 2, null, null, -1)}`;
                                                        }
                                                    })
                                                }
                                            }
                                        });
                                    }

                                    let unamec_3 = Array.from(document.querySelectorAll(".text-name.text-overflow"));
                                    if (unamec_3.length > 0) {
                                        unamec_3.forEach((usr_con) => {
                                            if (usr_con.outerHTML.includes(username_at) && usr_con.className == "text-name text-overflow") {
                                                if (!(usr_con.parentElement)) { return ; }
                                                if (vIconPlaced(usr_con.parentElement.outerHTML)) { return ; }
                                                usr_con.outerHTML = `${usr_con.outerHTML}${game_html}`;
                                            } else if (include_groups == true) {
                                                if (usr_con.href && getIfLinkIsGroup(usr_con.href)) {
                                                    let group_id = usr_con.href.match(/[0-9]+/)[0];
                                                    approvedGroup(group_id).then((info) => {
                                                        if (info["accepted"] == true && usr_con.className == "text-name text-overflow") {
                                                            if (usr_con.outerHTML.includes(info["name"])) {
                                                                if (!(usr_con.parentElement)) { return ; }
                                                                if (vIconPlaced(usr_con.parentElement.outerHTML)) { return ; }
                                                                usr_con.outerHTML = `${usr_con.outerHTML}${game_html}`;
                                                            }
                                                        }
                                                    })
                                                }
                                            }
                                        });
                                    }

                                    let unamec_4 = Array.from(document.querySelectorAll(".text-name"));
                                    if (unamec_4.length > 0) {
                                        unamec_4.forEach((usr_con) => {
                                            if (!(usr_con.parentElement)) { return ; }
                                            if (usr_con.parentElement.outerHTML.includes(username) && usr_con.parentElement.outerHTML.includes(userId) && usr_con.className == "text-name") {
                                                if (vIconPlaced(usr_con.parentElement.parentElement.outerHTML)) { return ; }
                                                usr_con.parentElement.outerHTML = `${usr_con.parentElement.outerHTML}${genVIcon(game_html, 4, null, null, 2, null, null)}`;
                                            } else if (include_groups == true) {
                                                if (usr_con.href && getIfLinkIsGroup(usr_con.href)) {
                                                    let group_id = usr_con.href.match(/[0-9]+/)[0];
                                                    approvedGroup(group_id).then((info) => {
                                                        if (info["accepted"] == true && usr_con.className == "text-name") {
                                                            if (!(usr_con.parentElement)) { return ; }
                                                            if (!(usr_con.parentElement.parentElement)) { return ; }
                                                            if (usr_con.parentElement.outerHTML.includes(info["name"])) {
                                                                if (vIconPlaced(usr_con.parentElement.parentElement.outerHTML)) { return ; }
                                                                usr_con.parentElement.outerHTML = `${usr_con.parentElement.outerHTML}${genVIcon(game_html, 4, null, null, 2, null, null)}`;
                                                            }
                                                        }
                                                    })
                                                }
                                            }
                                        });
                                    }

                                    let unamec_5 = Array.from(document.querySelectorAll(".text-overflow.age-bracket-label-username.font-caption-header"));
                                    if (unamec_5.length > 0) {
                                        unamec_5.forEach((usr_con) => {
                                            if (usr_con.outerHTML.includes(displayName) && usr_con.className == "text-overflow age-bracket-label-username font-caption-header") {
                                                if (!(usr_con.parentElement)) { return ; }
                                                if (vIconPlaced(usr_con.parentElement.outerHTML)) { return ; }
                                                usr_con.outerHTML = `${usr_con.outerHTML} ${name_side_html.replace("margin-left: 2px;width: 12px;height: 12px; background: none !important;", "margin-right: 6px; margin-left: -2px; width: 14px; height: 14px; background: none !important;")}`;
                                            }
                                        });
                                    }

                                    let unamec_6 = Array.from(document.querySelectorAll(".text-name.name.ng-binding"));
                                    if (unamec_6.length > 0) {
                                        unamec_6.forEach((usr_con) => {
                                            if (usr_con.outerHTML.includes(displayName) && usr_con.className == "text-name name ng-binding") {
                                                if (!(usr_con.parentElement)) { return ; }
                                                if (vIconPlaced(usr_con.parentElement.outerHTML)) { return ; }
                                                usr_con.outerHTML = `${usr_con.outerHTML} ${genVIcon(name_side_html, 2, 12, 12, 4, 16, 16)}`;
                                            }
                                        });
                                    }

                                    let unamec_7 = Array.from(document.querySelectorAll(".avatar-name.text-overflow.ng-binding"));
                                    if (unamec_7.length > 0) {
                                        unamec_7.forEach((usr_con) => {
                                            if (usr_con.outerHTML.includes(displayName) && usr_con.className == "avatar-name text-overflow ng-binding") {
                                                if (usr_con.parentElement.parentElement.children[1].outerHTML.includes(username_at)) {
                                                    if (!(usr_con.parentElement)) { return ; }
                                                    if (!(usr_con.parentElement.parentElement)) { return ; }
                                                    if (vIconPlaced(usr_con.parentElement.parentElement.parentElement.outerHTML)) { return ; }
                                                    usr_con.outerHTML = `${usr_con.outerHTML} ${name_small_html}`;
                                                }
                                            }
                                        });
                                    }

                                    setTimeout(function () {
                                        let unamec_8 = Array.from(document.querySelectorAll(".text-overflow.avatar-name.ng-binding.ng-scope"));
                                        if (unamec_8.length > 0) {
                                            unamec_8.forEach((usr_con) => {
                                                if (usr_con.outerHTML.includes(displayName) && usr_con.className == "text-overflow avatar-name ng-binding ng-scope") {
                                                    let unamec_9 = Array.from(document.querySelectorAll(".text-overflow.avatar-card-label.ng-binding.ng-scope"));
                                                    if (unamec_9.length > 0) {
                                                        unamec_9.forEach((usr_con_2) => {
                                                            if (usr_con.offsetParent == usr_con_2.offsetParent) {
                                                                if (usr_con_2.textContent == `@${username}`) {
                                                                    if (!(usr_con.parentElement)) { return ; }
                                                                    if (vIconPlaced(usr_con.parentElement.outerHTML)) { return ; }
                                                                    usr_con.outerHTML = `${usr_con.outerHTML} ${game_html}`;
                                                                }
                                                            }
                                                        });
                                                    }
                                                }
                                            });
                                        }

                                        let friends_username_containers = Array.from(document.querySelectorAll(".text-link.friend-link.ng-isolate-scope"));
                                        if (friends_username_containers.length > 0) {
                                            friends_username_containers.forEach((usr_con) => {
                                                if (usr_con.href && usr_con.className == "text-link friend-link ng-isolate-scope") {
                                                    let userIdd = usr_con.href.match(/[0-9]+/)[0];
                                                    if (userId == userIdd) {
                                                        if (usr_con.innerHTML.includes('class="hide"') && usr_con.innerHTML.includes(displayName)) {
                                                            if (usr_con.children[1]) {
                                                                if (!(user_checkmark_color == "%230066ff" || user_checkmark_color == "%230066FF")) {  // User's selected color
                                                                    usr_con.children[1].innerHTML = usr_con.children[1].innerHTML.replaceAll(`class="hide"`, "").replaceAll(`%230066FF`, user_checkmark_color)
                                                                } else if (appr_efazdev_user[userId] && appr_efazdev_user[userId]["hexColor"]) { // If the main user has selected the default, has EfazDev Approved Users enabled, and there's a color attached to the approved user.
                                                                    let hex_color = appr_efazdev_user[userId]["hexColor"]
                                                                    hex_color = hex_color.replace("#", "%23");
                                                                    usr_con.children[1].innerHTML = usr_con.children[1].innerHTML.replaceAll(`class="hide"`, "").replaceAll(`%230066FF`, hex_color)
                                                                } else if (appr_user_users[userId] && appr_user_users[userId]["hexColor"]) { // If the main user has selected the default, has EfazDev Approved Users enabled, and there's a color attached to the approved user.
                                                                    let hex_color = appr_user_users[userId]["hexColor"]
                                                                    hex_color = hex_color.replace("#", "%23");
                                                                    usr_con.children[1].innerHTML = usr_con.children[1].innerHTML.replaceAll(`class="hide"`, "").replaceAll(`%230066FF`, hex_color)
                                                                } else {
                                                                    usr_con.children[1].innerHTML = usr_con.children[1].innerHTML.replaceAll(`class="hide"`, "")
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            });
                                        }

                                        let friends_scroll_containers = Array.from(document.querySelectorAll(".friends-carousel-tile-labels"));
                                        if (friends_scroll_containers.length > 0) {
                                            friends_scroll_containers.forEach((usr_con) => {
                                                if (usr_con.href && usr_con.className == "friends-carousel-tile-labels") {
                                                    let userIdd = usr_con.href.match(/[0-9]+/)[0];
                                                    if (userId == userIdd) {
                                                        if (usr_con.children[0] && usr_con.children[0].children[0]) {
                                                            if (vIconPlaced(usr_con.children[0].children[0].outerHTML)) { return ; }
                                                            usr_con.children[0].children[0].innerHTML = `${usr_con.children[0].children[0].innerHTML} ${genVIcon(friends_scroll_html, null, 28, 28, null, 16, 16).replace(`width='28'`, `width='16'`).replace(`height='28'`, `height='16'`)}`;
                                                        }
                                                    }
                                                }
                                            });
                                        }
                                    }, start_time);

                                    /* Start all automatic changes and observers */
                                    sectorA();
                                    sectorB();
                                    sectorC();
                                    sectorD();
                                    sectorE();
                                    sectorF();
                                    sectorG();
                                    sectorH();
                                    /* Start all automatic changes and observers */

                                    /* Loop entire function again */
                                    setTimeout(function () {
                                        addPromptButtonInput()
                                        looped()
                                    }, start_time)
                                    /* Loop entire function again */
                                }
                            }
                            looped()
                        }
                    }).catch(err => {
                        if (err.toString().includes("Extension context")) {
                            broken_context = true
                            return { "accepted": false }
                        } else {
                            warn(err);
                            if (allow_messages == true) { alert("We couldn't apply the verified badge due to an error! Sorry!");
                            } else { timeout(() => { scanUser(id, isMain) }, start_time) }
                        }
                    })
            } catch (err) {
                warn(err);
                if (allow_messages == true) alert("We couldn't apply the verified badge due to an error! Sorry!");
            }
        }
        getUserData("*", true).then(json => {
            if (json && json["id"]) { scanUser(json["id"], true) }
        }).catch(err => {
            warn(err);
            if (allow_messages == true) alert("We couldn't apply the verified badge due to an error! Sorry!");
        })
        setTimeout(function () {
            if (settings["verifiedBadgeBetweenAccounts"] == true) {
                getUserData("*", true).then(json => {
                    if (json && json["id"]) {
                        chrome.storage.local.get("user_verification").then((stored_user_data) => {
                            if (stored_user_data["user_verification"]) {
                                let ids = Object.keys(stored_user_data["user_verification"])
                                ids.forEach((user_id) => {
                                    if (!(user_id == json["id"])) { scanUser(user_id, false) }
                                })
                            }
                        })
                    }
                }).catch(err => {
                    warn(err);
                    if (allow_messages == true) alert("We couldn't apply the verified badge due to an error! Sorry!");
                })
            }
            if (settings["useCustomApprovedBadgesByUser"] == true) {
                getUserData("*", true).then(json => {
                    if (json && json["id"]) {
                        chrome.storage.local.get("user_verification").then((stored_user_data) => {
                            if (stored_user_data["user_verification"]) {
                                let ids = Object.keys(appr_user_users)
                                ids.forEach((user_id) => {
                                    let approved_user_info = appr_user_users[user_id]
                                    if (!(approved_user_info["id"] == json["id"].toString())) { scanUser(approved_user_info["id"], false) }
                                })
                            }
                        })
                    }
                }).catch(err => {
                    warn(err);
                    if (allow_messages == true) alert("We couldn't apply the verified badge due to an error! Sorry!");
                })
            }
            if (settings["allowEfazDevApprovedBadges"] == true) {
                getUserData("*", true).then(json => {
                    if (json && json["id"]) {
                        chrome.storage.local.get("user_verification").then((stored_user_data) => {
                            if (stored_user_data["user_verification"]) {
                                let ids = Object.keys(appr_efazdev_user)
                                ids.forEach((user_id) => {
                                    let approved_user_info = appr_efazdev_user[user_id]
                                    if (!(approved_user_info["id"] == json["id"].toString())) { scanUser(approved_user_info["id"], false) }
                                })
                            }
                        })
                    }
                }).catch(err => {
                    warn(err);
                    if (allow_messages == true) alert("We couldn't apply the verified badge due to an error! Sorry!");
                })
            }
        }, start_time * 5)
    }
}
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
            return chrome.storage.local.get(storage_key).then(async (user_settings) => {
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
async function loader() { // Script Loader
    if (!(window.location.hostname == "www.roblox.com")) { return; }
    const storage_key = "dev.efaz.verified_badge_add_on"
    getSettings(storage_key, async function (items) {
        settings = items[storage_key]
        if (typeof (settings["enabled"]) == "boolean") { enabled = settings["enabled"]; }
        if (typeof (settings["allowAlertMessages"]) == "boolean") { allow_messages = settings["allowAlertMessages"]; }
        if (typeof (settings["startTime"]) == "string" && Number(settings["startTime"])) { start_time = Number(settings["startTime"]); }
        if (settings["allowEfazDevApprovedBadges"] == true) {
            try {
                let appr_json = await fetch("https://cdn.efaz.dev/extensions/dev.efaz.verified_badge_add_on/resources/approved_users.json").then(appr_res => {
                    if (appr_res.ok) { return appr_res.json()
                    } else { return {} }
                }).catch((err) => {
                    warn(err)
                    return {}
                })
                appr_efazdev_user = appr_json;
            } catch (err) {
                warn(err)
                appr_efazdev_user = {}
            }
        }
        if (settings["useCustomApprovedBadgesByUser"] == true) {
            try {
                let appr_json = await chrome.storage.local.get("user_approved_json").then(async (app_json_items) => {
                    if (app_json_items && app_json_items["user_approved_json"]) {
                        if (typeof (app_json_items["user_approved_json"]) == "object") { return app_json_items["user_approved_json"] } else {
                            warn("Invalid JSON data.");
                            return {}
                        }
                    } else { return {} }
                });
                appr_user_users = appr_json;
            } catch (err) {
                warn(err)
                appr_user_users = {}
            }
        }
        if (document.readyState === "complete") { timeout(() => { start() }, start_time) } else { window.addEventListener("DOMContentLoaded", start) }
        console.log("Starting Verified Badge Loader: Settings Configuration v3")
    })
}
loader() // Start Loader