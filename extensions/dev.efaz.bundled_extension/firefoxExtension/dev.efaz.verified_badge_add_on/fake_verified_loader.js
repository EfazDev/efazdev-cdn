let enabled = true;
let allow_messages = false;
let settings = {};
let group_data = {};
let temp_usr = {};
let appr_efazdev_user = {};
let appr_user_users = {};
let running_users = {};
let running_groups = {};
let group_scan = false;
let storage = chrome.storage.local;
let storage_key = "dev.efaz.verified_badge_add_on";

function warn(mes) { console.warn("Verified Badge Loader: " + mes); }
function timeout(func, ms) { setTimeout(func, ms); }
function logMessage(message) {
    if (allow_messages == true) { console.log("Verified Badge Loader: " + message); }
}
function genVIcon(close, orgMargin, orgX, orgY, margin, sizeX, sizeY) {
    if ((typeof (orgMargin) == "number") && (typeof (margin) == "number")) { close = close.replace("margin-left: " + orgMargin + "px;", "margin-left: " + margin + "px;"); }
    if ((typeof (orgX) == "number") && (typeof (sizeX) == "number")) { close = close.replace("width: " + orgX + "px;", "width: " + sizeX + "px;"); }
    if ((typeof (orgY) == "number") && (typeof (sizeY) == "number")) { close = close.replace("height: " + orgY + "px;", "height: " + sizeY + "px;"); }
    return close;
}
async function loopThroughArrayAsync(array, callback) {
    if (Array.isArray(array)) {
        for (let a = 0; a < array.length; a++) {
            await callback(a, array[a]);
        }
    } else if (array && typeof array === "object") {
        for (const a of Object.keys(array)) {
            await callback(a, array[a]);
        }
    }
}
function loopThroughArray(array, callback) {
    if (Array.isArray(array)) {
        for (let a = 0; a < array.length; a++) {
            callback(a, array[a]);
        }
    } else if (array && typeof array === "object") {
        for (const a of Object.keys(array)) {
            callback(a, array[a]);
        }
    }
}
function getTran(id) {
    if (!(chrome.i18n.getMessage(storage_key.replaceAll(".", "_") + "_" + id) == "")) {
        return chrome.i18n.getMessage(storage_key.replaceAll(".", "_") + "_" + id);
    } else if (!(chrome.i18n.getMessage(id.replaceAll(".", "_")) == "")) {
        return chrome.i18n.getMessage(id.replaceAll(".", "_"));
    }
}
function applyChangesToHTML(json, user_checkmark_color) {
    /* All of these HTML variables are extracted from the Roblox Website and modified to be functioned like the actual badge. */
    let profile_html = `<span evba="true" evba_type="profile_html" role="button" tabindex="0" data-rblx-verified-badge-icon="" data-rblx-badge-icon="true" class="jss16"><img class="profile-verified-badge-icon" src="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28' fill='none'%3E%3Cg clip-path='url(%23clip0_8_46)'%3E%3Crect x='5.88818' width='22.89' height='22.89' transform='rotate(15 5.88818 0)' fill='%230066FF'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M20.543 8.7508L20.549 8.7568C21.15 9.3578 21.15 10.3318 20.549 10.9328L11.817 19.6648L7.45 15.2968C6.85 14.6958 6.85 13.7218 7.45 13.1218L7.457 13.1148C8.058 12.5138 9.031 12.5138 9.633 13.1148L11.817 15.2998L18.367 8.7508C18.968 8.1498 19.942 8.1498 20.543 8.7508Z' fill='white'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_8_46'%3E%3Crect width='28' height='28' fill='white'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E" title="${json["id"]}" alt="${json["id"]}"></span>`;
    let profile2_html = `<span evba="true" evba_type="profile2_html" role="button" tabindex="0" data-rblx-verified-badge-icon="" data-rblx-badge-icon="true" class="jss4"><img class="profile-verified-badge-icon" src="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28' fill='none'%3E%3Cg clip-path='url(%23clip0_8_46)'%3E%3Crect x='5.88818' width='22.89' height='22.89' transform='rotate(15 5.88818 0)' fill='%230066FF'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M20.543 8.7508L20.549 8.7568C21.15 9.3578 21.15 10.3318 20.549 10.9328L11.817 19.6648L7.45 15.2968C6.85 14.6958 6.85 13.7218 7.45 13.1218L7.457 13.1148C8.058 12.5138 9.031 12.5138 9.633 13.1148L11.817 15.2998L18.367 8.7508C18.968 8.1498 19.942 8.1498 20.543 8.7508Z' fill='white'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_8_46'%3E%3Crect width='28' height='28' fill='white'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E" title="${json["id"]}" alt="${json["id"]}"></span>`;
    let name_html = `<img evba="true" evba_type="name_html" class="verified-badge-icon-catalog-item-rendered" src="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28' fill='none'%3E%3Cg clip-path='url(%23clip0_8_46)'%3E%3Crect x='5.88818' width='22.89' height='22.89' transform='rotate(15 5.88818 0)' fill='%230066FF'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M20.543 8.7508L20.549 8.7568C21.15 9.3578 21.15 10.3318 20.549 10.9328L11.817 19.6648L7.45 15.2968C6.85 14.6958 6.85 13.7218 7.45 13.1218L7.457 13.1148C8.058 12.5138 9.031 12.5138 9.633 13.1148L11.817 15.2998L18.367 8.7508C18.968 8.1498 19.942 8.1498 20.543 8.7508Z' fill='white'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_8_46'%3E%3Crect width='28' height='28' fill='white'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E" title="Verified Badge Icon" alt="Verified Badge Icon">`;
    let name_side_html = `<img evba="true" evba_type="name_side_html" src="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28' fill='none'%3E%3Cg clip-path='url(%23clip0_8_46)'%3E%3Crect x='5.88818' width='22.89' height='22.89' transform='rotate(15 5.88818 0)' fill='%230066FF'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M20.543 8.7508L20.549 8.7568C21.15 9.3578 21.15 10.3318 20.549 10.9328L11.817 19.6648L7.45 15.2968C6.85 14.6958 6.85 13.7218 7.45 13.1218L7.457 13.1148C8.058 12.5138 9.031 12.5138 9.633 13.1148L11.817 15.2998L18.367 8.7508C18.968 8.1498 19.942 8.1498 20.543 8.7508Z' fill='white'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_8_46'%3E%3Crect width='28' height='28' fill='white'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E" title="Verified Badge Icon" alt="Verified Badge Icon" style="margin-left: 2px;width: 12px;height: 12px; background: none !important;">`;
    let name_side_real_html = `<img evba="true" evba_type="name_side_real_html" src="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28' fill='none'%3E%3Cg clip-path='url(%23clip0_8_46)'%3E%3Crect x='5.88818' width='22.89' height='22.89' transform='rotate(15 5.88818 0)' fill='%230066FF'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M20.543 8.7508L20.549 8.7568C21.15 9.3578 21.15 10.3318 20.549 10.9328L11.817 19.6648L7.45 15.2968C6.85 14.6958 6.85 13.7218 7.45 13.1218L7.457 13.1148C8.058 12.5138 9.031 12.5138 9.633 13.1148L11.817 15.2998L18.367 8.7508C18.968 8.1498 19.942 8.1498 20.543 8.7508Z' fill='white'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_8_46'%3E%3Crect width='28' height='28' fill='white'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E" title="Verified Badge Icon" alt="Verified Badge Icon" style="margin-left: 2px;width: 18px;height: 18px; background: none !important;">`;
    let prompt_html = `<div evba="true" evba_type="prompt_html" role="dialog" id="fake_verified_badge"><div class="modal-backdrop in"></div><div role="dialog" tabindex="-1" class="in modal" style="display: block;"><div class="modal-window modal-sm modal-dialog"><div class="modal-content" role="document"><div class="modal-header"><button type="button" class="close" title="close" onclick="document.getElementById('fake_verified_badge').remove()"><span class="icon-close"></span></button><h4 class="modal-title">Verified Badge Add-on</h4></div><div class="modal-body"><div><div><span role="button" tabindex="0" data-rblx-verified-badge-icon="" data-rblx-badge-icon="true" class="hz-centered-badge-container"><img class=" jss272" src="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28' fill='none'%3E%3Cg clip-path='url(%23clip0_8_46)'%3E%3Crect x='5.88818' width='22.89' height='22.89' transform='rotate(15 5.88818 0)' fill='%23FF4B00'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M20.543 8.7508L20.549 8.7568C21.15 9.3578 21.15 10.3318 20.549 10.9328L11.817 19.6648L7.45 15.2968C6.85 14.6958 6.85 13.7218 7.45 13.1218L7.457 13.1148C8.058 12.5138 9.031 12.5138 9.633 13.1148L11.817 15.2998L18.367 8.7508C18.968 8.1498 19.942 8.1498 20.543 8.7508Z' fill='white'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_8_46'%3E%3Crect width='28' height='28' fill='white'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E" title="Verified Badge" alt="Verified Badge"></span></div><div>${getTran("dev_efaz_verified_badge_add_on_badgeIdentification1")}</div></div></div><div class="modal-footer"><div class="loading"></div><div class="modal-buttons"><button type="button" class="modal-button btn-primary-md btn-min-width" onclick="window.location.replace('https://en.help.roblox.com/hc/en-us/articles/7997207259156')">Learn More</button><button type="button" class="modal-button btn-control-md btn-min-width" onclick="document.getElementById('fake_verified_badge').remove()">Close</button></div></div></div></div></div></div>`;
    let efaz_approved_prompt_html = `<div evba="true" evba_type="efaz_approved_prompt_html" role="dialog" id="fake_verified_badge"><div class="modal-backdrop in"></div><div role="dialog" tabindex="-1" class="in modal" style="display: block;"><div class="modal-window modal-sm modal-dialog"><div class="modal-content" role="document"><div class="modal-header"><button type="button" class="close" title="close" onclick="document.getElementById('fake_verified_badge').remove()"><span class="icon-close"></span></button><h4 class="modal-title">Verified Badge Add-on</h4></div><div class="modal-body"><div><div><span role="button" tabindex="0" data-rblx-verified-badge-icon="" data-rblx-badge-icon="true" class="hz-centered-badge-container"><img class=" jss272" src="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28' fill='none'%3E%3Cg clip-path='url(%23clip0_8_46)'%3E%3Crect x='5.88818' width='22.89' height='22.89' transform='rotate(15 5.88818 0)' fill='%23FF4B00'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M20.543 8.7508L20.549 8.7568C21.15 9.3578 21.15 10.3318 20.549 10.9328L11.817 19.6648L7.45 15.2968C6.85 14.6958 6.85 13.7218 7.45 13.1218L7.457 13.1148C8.058 12.5138 9.031 12.5138 9.633 13.1148L11.817 15.2998L18.367 8.7508C18.968 8.1498 19.942 8.1498 20.543 8.7508Z' fill='white'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_8_46'%3E%3Crect width='28' height='28' fill='white'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E" title="Verified Badge" alt="Verified Badge"></span></div><div>${getTran("dev_efaz_verified_badge_add_on_badgeIdentification2")}</div></div></div><div class="modal-footer"><div class="loading"></div><div class="modal-buttons"><button type="button" class="modal-button btn-primary-md btn-min-width" onclick="window.location.replace('https://en.help.roblox.com/hc/en-us/articles/7997207259156')">Learn More</button><button type="button" class="modal-button btn-control-md btn-min-width" onclick="document.getElementById('fake_verified_badge').remove()">Close</button></div></div></div></div></div></div>`;
    let user_approved_prompt_html = `<div evba="true" evba_type="user_approved_prompt_html" role="dialog" id="fake_verified_badge"><div class="modal-backdrop in"></div><div role="dialog" tabindex="-1" class="in modal" style="display: block;"><div class="modal-window modal-sm modal-dialog"><div class="modal-content" role="document"><div class="modal-header"><button type="button" class="close" title="close" onclick="document.getElementById('fake_verified_badge').remove()"><span class="icon-close"></span></button><h4 class="modal-title">Verified Badge Add-on</h4></div><div class="modal-body"><div><div><span role="button" tabindex="0" data-rblx-verified-badge-icon="" data-rblx-badge-icon="true" class="hz-centered-badge-container"><img class=" jss272" src="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28' fill='none'%3E%3Cg clip-path='url(%23clip0_8_46)'%3E%3Crect x='5.88818' width='22.89' height='22.89' transform='rotate(15 5.88818 0)' fill='%230066FF'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M20.543 8.7508L20.549 8.7568C21.15 9.3578 21.15 10.3318 20.549 10.9328L11.817 19.6648L7.45 15.2968C6.85 14.6958 6.85 13.7218 7.45 13.1218L7.457 13.1148C8.058 12.5138 9.031 12.5138 9.633 13.1148L11.817 15.2998L18.367 8.7508C18.968 8.1498 19.942 8.1498 20.543 8.7508Z' fill='white'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_8_46'%3E%3Crect width='28' height='28' fill='white'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E" title="Verified Badge" alt="Verified Badge"></span></div><div>${getTran("dev_efaz_verified_badge_add_on_badgeIdentification3")}</div></div></div><div class="modal-footer"><div class="loading"></div><div class="modal-buttons"><button type="button" class="modal-button btn-primary-md btn-min-width" onclick="window.location.replace('https://en.help.roblox.com/hc/en-us/articles/7997207259156')">Learn More</button><button type="button" class="modal-button btn-control-md btn-min-width" onclick="document.getElementById('fake_verified_badge').remove()">Close</button></div></div></div></div></div></div>`;
    let game_html = `<span evba="true" evba_type="game_html" role="button" tabindex="0" replicate-badge-addon-prompt="${json["id"]}_true" data-rblx-verified-badge-icon="" data-rblx-badge-icon="true" class="jss4"><img class="verified-badge-icon-experience-creator" style="margin-left: 4px;width: 16px;height: 16px;" src="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28' fill='none'%3E%3Cg clip-path='url(%23clip0_8_46)'%3E%3Crect x='5.88818' width='22.89' height='22.89' transform='rotate(15 5.88818 0)' fill='%230066FF'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M20.543 8.7508L20.549 8.7568C21.15 9.3578 21.15 10.3318 20.549 10.9328L11.817 19.6648L7.45 15.2968C6.85 14.6958 6.85 13.7218 7.45 13.1218L7.457 13.1148C8.058 12.5138 9.031 12.5138 9.633 13.1148L11.817 15.2998L18.367 8.7508C18.968 8.1498 19.942 8.1498 20.543 8.7508Z' fill='white'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_8_46'%3E%3Crect width='28' height='28' fill='white'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E" title="Verified Badge Icon" alt="Verified Badge Icon"></span>`;
    let name_small_html = `<span><span evba="true" evba_type="name_small_html" role="button" tabindex="0" data-rblx-verified-badge-icon="" replicate-badge-addon-prompt="${json["id"]}_true" data-rblx-badge-icon="true" class="jss22"><img class="verified-badge-icon-member-card-rendered" src="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28' fill='none'%3E%3Cg clip-path='url(%23clip0_8_46)'%3E%3Crect x='5.88818' width='22.89' height='22.89' transform='rotate(15 5.88818 0)' fill='%230066FF'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M20.543 8.7508L20.549 8.7568C21.15 9.3578 21.15 10.3318 20.549 10.9328L11.817 19.6648L7.45 15.2968C6.85 14.6958 6.85 13.7218 7.45 13.1218L7.457 13.1148C8.058 12.5138 9.031 12.5138 9.633 13.1148L11.817 15.2998L18.367 8.7508C18.968 8.1498 19.942 8.1498 20.543 8.7508Z' fill='white'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_8_46'%3E%3Crect width='28' height='28' fill='white'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E" title="Verified Badge Icon" alt="Verified Badge Icon"></span></span>`;
    let group_name_verified_html = `<span evba="true" evba_type="group_name_verified_html" role="button" tabindex="0" data-rblx-verified-badge-icon="" replicate-badge-addon-prompt="${json["id"]}_true" data-rblx-badge-icon="true" class="jss250"><img class="verified-badge-icon-group-name-rendered" src="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28' fill='none'%3E%3Cg clip-path='url(%23clip0_8_46)'%3E%3Crect x='5.88818' width='22.89' height='22.89' transform='rotate(15 5.88818 0)' fill='%230066FF'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M20.543 8.7508L20.549 8.7568C21.15 9.3578 21.15 10.3318 20.549 10.9328L11.817 19.6648L7.45 15.2968C6.85 14.6958 6.85 13.7218 7.45 13.1218L7.457 13.1148C8.058 12.5138 9.031 12.5138 9.633 13.1148L11.817 15.2998L18.367 8.7508C18.968 8.1498 19.942 8.1498 20.543 8.7508Z' fill='white'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_8_46'%3E%3Crect width='28' height='28' fill='white'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E" title="Verified Badge Icon" alt="Verified Badge Icon"></span>`;
    let group_owner_name_html = `<span><span evba="true" evba_type="group_owner_name_html" role="button" tabindex="0" data-rblx-verified-badge-icon="" replicate-badge-addon-prompt="${json["id"]}_true" data-rblx-badge-icon="true" class="verified-badge-icon-group-owner-container"><img class="verified-badge-icon-group-owner-rendered" style="margin-left: 4px; width: 16px; height: 16px;" src="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28' fill='none'%3E%3Cg clip-path='url(%23clip0_8_46)'%3E%3Crect x='5.88818' width='22.89' height='22.89' transform='rotate(15 5.88818 0)' fill='%230066FF'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M20.543 8.7508L20.549 8.7568C21.15 9.3578 21.15 10.3318 20.549 10.9328L11.817 19.6648L7.45 15.2968C6.85 14.6958 6.85 13.7218 7.45 13.1218L7.457 13.1148C8.058 12.5138 9.031 12.5138 9.633 13.1148L11.817 15.2998L18.367 8.7508C18.968 8.1498 19.942 8.1498 20.543 8.7508Z' fill='white'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_8_46'%3E%3Crect width='28' height='28' fill='white'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E" title="Verified Badge Icon" alt="Verified Badge Icon"></span></span>`;
    let reseller_html = `<span><span evba="true" evba_type="reseller_html" role="button" tabindex="0" data-rblx-verified-badge-icon="" replicate-badge-addon-prompt="${json["id"]}_true" data-rblx-badge-icon="true" class="jss22"><img class="verified-badge-icon-item-resellers-rendered" src="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28' fill='none'%3E%3Cg clip-path='url(%23clip0_8_46)'%3E%3Crect x='5.88818' width='22.89' height='22.89' transform='rotate(15 5.88818 0)' fill='%230066FF'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M20.543 8.7508L20.549 8.7568C21.15 9.3578 21.15 10.3318 20.549 10.9328L11.817 19.6648L7.45 15.2968C6.85 14.6958 6.85 13.7218 7.45 13.1218L7.457 13.1148C8.058 12.5138 9.031 12.5138 9.633 13.1148L11.817 15.2998L18.367 8.7508C18.968 8.1498 19.942 8.1498 20.543 8.7508Z' fill='white'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_8_46'%3E%3Crect width='28' height='28' fill='white'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E" title="Verified Badge Icon" alt="Verified Badge Icon"></span></span>`;
    let friends_scroll_html = `<div class="friend-tile-verified-badge"><div class="friend-tile-spacer"></div><span role="button" tabindex="0" evba="true" data-rblx-verified-badge-icon="" data-rblx-badge-icon="true" class="verified-badge jss40" style="margin-top: -2px;"><img class=" jss38" src="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28' fill='none'%3E%3Cg clip-path='url(%23clip0_8_46)'%3E%3Crect x='5.88818' width='22.89' height='22.89' transform='rotate(15 5.88818 0)' fill='%230066FF'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M20.543 8.7508L20.549 8.7568C21.15 9.3578 21.15 10.3318 20.549 10.9328L11.817 19.6648L7.45 15.2968C6.85 14.6958 6.85 13.7218 7.45 13.1218L7.457 13.1148C8.058 12.5138 9.031 12.5138 9.633 13.1148L11.817 15.2998L18.367 8.7508C18.968 8.1498 19.942 8.1498 20.543 8.7508Z' fill='white'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_8_46'%3E%3Crect width='28' height='28' fill='white'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E" title="Verified Badge Icon" alt="Verified Badge Icon"></span></div>`;
    /* All of these HTML variables are extracted from the Roblox Website and modified to be functioned like the actual badge. */

    /* Apply color changes to HTML above */
    let hex_color = user_checkmark_color;
    if (user_checkmark_color == "%230066ff" || user_checkmark_color == "%230066FF") {  // User's selected color
        user_checkmark_color = "%230066FF";
    } else if (appr_efazdev_user[json["id"]] && appr_efazdev_user[json["id"]]["hexColor"]) { // If the main user has selected the default, has EfazDev Approved Users enabled, and there's a color attached to the approved user.
        hex_color = appr_efazdev_user[json["id"]]["hexColor"].replace("#", "%23");
        efaz_approved_prompt_html = efaz_approved_prompt_html.replace("%23FF4B00", hex_color);
    } else if (appr_user_users[json["id"]] && appr_user_users[json["id"]]["hexColor"]) { // If the main user has selected the default, has EfazDev Approved Users enabled, and there's a color attached to the approved user.
        hex_color = appr_user_users[json["id"]]["hexColor"].replace("#", "%23");
        efaz_approved_prompt_html = efaz_approved_prompt_html.replace("%23FF4B00", hex_color);
    }
    profile_html = profile_html.replaceAll("%230066FF", hex_color);
    profile2_html = profile2_html.replaceAll("%230066FF", hex_color);
    name_html = name_html.replaceAll("%230066FF", hex_color);
    name_side_real_html = name_side_real_html.replaceAll("%230066FF", hex_color);
    name_side_html = name_side_html.replaceAll("%230066FF", hex_color);
    game_html = game_html.replaceAll("%230066FF", hex_color);
    name_small_html = name_small_html.replaceAll("%230066FF", hex_color);
    group_name_verified_html = group_name_verified_html.replaceAll("%230066FF", hex_color);
    group_owner_name_html = group_owner_name_html.replaceAll("%230066FF", hex_color);
    reseller_html = reseller_html.replaceAll("%230066FF", hex_color);
    friends_scroll_html = friends_scroll_html.replaceAll("%230066FF", hex_color);
    /* Apply color changes to HTML above */
    return [
        hex_color, profile_html, profile2_html, name_html, name_side_real_html, name_side_html, game_html,
        name_small_html, group_name_verified_html, group_owner_name_html, reseller_html,
        efaz_approved_prompt_html, prompt_html, user_approved_prompt_html, friends_scroll_html
    ];
}
function vIconPlaced(element, inner, select_existing) { 
    if (select_existing == true) {
        return element.querySelector("*[data-rblx-badge-icon='true']");
    }
    let html = inner ? element.innerHTML : element.outerHTML;
    return html.includes("data-rblx-badge-icon") || html.includes("replicate-badge-addon-prompt") || html.includes("Verified Badge Icon");
}
function getUserInfoFromGroup(groupId) { return running_users[running_groups[groupId]["owner"]["userId"]]; }
function addOutsideElementInsideAfter(element, html) { element.insertAdjacentHTML("beforeend", html); }
function addOutsideElementAfter(element, html) { element.insertAdjacentHTML("afterend", html); }
function getIfLinkIsGroup(link) { return link && link.includes("/groups/") || link.includes("/communities/"); }
function getIfLinkIsUserProfile(link) { return link && link.includes("/users/") && link.includes("/profile"); }
function getUserIdFromLink(link) {
    if (!getIfLinkIsUserProfile(link)) { return null; }
    let split_link = link.split("/users/")[1].split("/profile")[0].split("?")[0].split("#")[0];
    if (isNaN(split_link)) { return null; }
    return split_link;
}
function getGroupIdFromLink(link) {
    if (!getIfLinkIsGroup(link)) { return null; }
    let split_link = "";
    if (link.includes("/groups/")) {
        split_link = link.split("/groups/")[1].split("/")[0].split("?")[0].split("#")[0];
    } else if (link.includes("/communities/")) {
        split_link = link.split("/communities/")[1].split("/")[0].split("?")[0].split("#")[0];
    }
    if (isNaN(split_link)) { return null; }
    return split_link;
}
function getIfLinkIsUser(link, userId) { return (link && getIfLinkIsUserProfile(link) && link.includes("/" + userId + "/profile")); }
function generateInstantPromise(value) { return new Promise((resolve, reject) => { resolve(value); }); }
async function start() {
    if (enabled) {
        let user_checkmark_color = "%230066FF";
        let broken_context = false;
        let cache_groups = null;
        let custom_checkmark_color = settings["color"];
        if (custom_checkmark_color) { user_checkmark_color = custom_checkmark_color.replace("#", "%23"); }
        async function getUserData(id, isMain) {
            if (broken_context == true) {
                return generateInstantPromise(null);
            } else {
                return chrome.storage.local.get("user_verification").then((stored_user_data) => {
                    if (!(typeof (stored_user_data["user_verification"]) == "object")) { stored_user_data["user_verification"] = {}; }
                    if (stored_user_data["user_verification"][id.toString()]) {
                        return stored_user_data["user_verification"][id.toString()];
                    } else if (temp_usr[id.toString()]) {
                        return temp_usr[id.toString()];
                    } else if (appr_efazdev_user[id.toString()]) {
                        return appr_efazdev_user[id.toString()];
                    } else if (appr_user_users[id.toString()]) {
                        return appr_user_users[id.toString()];
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
                                    return res.json();
                                } else {
                                    logMessage("User is not logged in!");
                                    return null;
                                }
                            }).then(json => {
                                if (json) {
                                    temp_usr["*"] = json;
                                    stored_user_data["user_verification"][json["id"].toString()] = json;
                                    return chrome.storage.local.set(stored_user_data).then(() => {
                                        return json;
                                    });
                                }
                            }).catch(err => {
                                logMessage(err.stack);
                                return null;
                            });
                        } else {
                            if (stored_user_data["user_verification"][id.toString()]) {
                                return stored_user_data["user_verification"][id.toString()];
                            } else {
                                logMessage("Something went wrong.");
                                return null;
                            }
                        }
                    }
                }).catch(err => {
                    if (err.toString().includes("Extension context")) {
                        broken_context = true;
                        warn("Extension context is suspected to be broken. Error: " + err.toString());
                        return null;
                    } else {
                        warn("Error with getting approved users: " + err.toString());
                        return null;
                    }
                });
            }
        }
        async function approvedGroups(owner, onlycached) {
            if (broken_context == true) { return { "accepted": false }; }
            try {
                async function run(allowed_groups) {
                    if (!(typeof (allowed_groups["group_ownership_v2"]) == "object")) { allowed_groups["group_ownership_v2"] = {}; }
                    if (onlycached == true) { return { "groups": allowed_groups["group_ownership_v2"] || {} }; }
                    if (!settings || !settings["groupsIncluded"]) { return { "groups": {} }; }
                    if ((appr_efazdev_user || appr_user_users) && (appr_efazdev_user[owner["id"].toString()] || appr_user_users[owner["id"].toString()])) {
                        await loopThroughArrayAsync(appr_efazdev_user, async (user, data) => {
                            if (data && data["approve_groups"] && Array.isArray(data["approve_groups"])) {
                                await loopThroughArrayAsync(data["approve_groups"], async (group_id, group_data) => {
                                    if (group_data) {
                                        allowed_groups["group_ownership_v2"][group_data["id"]] = {
                                            "group": {
                                                "id": group_data["id"],
                                                "name": group_data["name"],
                                                "memberCount": group_data["memberCount"],
                                                "hasVerifiedBadge": group_data["hasVerifiedBadge"]
                                            },
                                            "role": {
                                                "rank": 255
                                            },
                                            "owner": group_data["owner"]
                                        };
                                    }
                                });
                            }
                        });
                        await loopThroughArrayAsync(appr_user_users, async (user, data) => {
                            if (data && data["approve_groups"] && Array.isArray(data["approve_groups"])) {
                                await loopThroughArrayAsync(data["approve_groups"], async (group_id, group_data) => {
                                    if (group_data) {
                                        allowed_groups["group_ownership_v2"][group_data["id"]] = {
                                            "group": {
                                                "id": group_data["id"],
                                                "name": group_data["name"],
                                                "memberCount": group_data["memberCount"],
                                                "hasVerifiedBadge": group_data["hasVerifiedBadge"]
                                            },
                                            "role": {
                                                "rank": 255
                                            },
                                            "owner": group_data["owner"]
                                        };
                                    }
                                });
                            }
                        });
                        return { "groups": allowed_groups["group_ownership_v2"] || {} };
                    }
                    await fetch("https://groups.roblox.com/v2/users/" + owner["id"] + "/groups/roles", {
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
                            return res.json();
                        } else {
                            logMessage("Failed to get group roles for user " + owner["id"]);
                            return null;
                        }
                    }).then(async (json) => {
                        if (json && json["data"] && Array.isArray(json["data"])) {
                            let groups = allowed_groups["group_ownership_v2"];
                            await loopThroughArrayAsync(json["data"], async (group) => {
                                if (group && group["group"] && group["role"] && group["role"]["rank"] == 255) {
                                    groups[group["group"]["id"]] = group;
                                    groups[group["group"]["id"]]["owner"] = owner;
                                }
                            });
                            await chrome.storage.local.set({ "group_ownership_v2": groups });
                            group_data = groups;
                            return { "groups": groups };
                        } else {
                            logMessage("Failed to get group roles for user " + owner["id"]);
                            return null;
                        }
                    }).catch(err => {
                        logMessage("Error fetching group roles for user " + owner["id"] + ": " + err.toString());
                        return null;
                    });
                    return { "groups": {} };
                }
                if (cache_groups) {
                    return await run(cache_groups);
                } else {
                    cache_groups = {};
                    return await chrome.storage.local.get("group_ownership_v2").then(async (allowed_groups) => {
                        cache_groups = allowed_groups;
                        return await run(cache_groups);
                    }).catch(err => {
                        cache_groups = null;
                        return { "groups": {} };
                    });
                }
            } catch (err) {
                if (err.toString().includes("Extension context")) {
                    broken_context = true;
                    warn("Extension context is suspected to be broken. Error: " + err.toString());
                    return { "groups": {} };
                } else {
                    warn("Error with getting approved group: " + err.toString());
                    return { "groups": {} };
                }
            }
        }
        async function scanUser(id, isMain) {
            try {
                await getUserData(id, isMain)
                    .then((res) => {
                        if (res) {
                            return res;
                        } else { return {}; }
                    })
                    .then(async (json) => {
                        if (json && json["id"]) {
                            let fhe = applyChangesToHTML(json, user_checkmark_color);
                            let hex_color = fhe[0];
                            let profile_html = fhe[1];
                            let profile2_html = fhe[2];
                            let name_html = fhe[3];
                            let name_side_real_html = fhe[4];
                            let name_side_html = fhe[5];
                            let game_html = fhe[6];
                            let name_small_html = fhe[7];
                            let group_name_verified_html = fhe[8];
                            let group_owner_name_html = fhe[9];
                            let reseller_html = fhe[10];
                            let efaz_approved_prompt_html = fhe[11];
                            let prompt_html = fhe[12];
                            let user_approved_prompt_html = fhe[13];
                            let friends_scroll_html = fhe[14];

                            let userId = json["id"];
                            let username = json["name"];
                            let username_at = "@" + json["name"];
                            let displayName = json["displayName"];
                            let approvingGroups = await approvedGroups(json, false);
                            await loopThroughArrayAsync(approvingGroups["groups"], async (group_id, group_info) => {
                                running_groups[group_id] = group_info;
                                running_groups[group_id.toString()] = group_info;
                            });
                            running_users[userId.toString()] = {
                                "user_id": userId,
                                "user_checkmark_color": user_checkmark_color,
                                "name": username,
                                "username_at": username_at,
                                "display_name": displayName,
                                "hex_color": hex_color,
                                "profile_html": profile_html,
                                "profile2_html": profile2_html,
                                "name_html": name_html,
                                "name_side_real_html": name_side_real_html,
                                "name_side_html": name_side_html,
                                "game_html": game_html,
                                "name_small_html": name_small_html,
                                "group_name_verified_html": group_name_verified_html,
                                "group_owner_name_html": group_owner_name_html,
                                "reseller_html": reseller_html,
                                "efaz_approved_prompt_html": efaz_approved_prompt_html,
                                "prompt_html": prompt_html,
                                "user_approved_prompt_html": user_approved_prompt_html,
                                "friends_scroll_html": friends_scroll_html,
                                "groups": approvingGroups["groups"] || {}
                            };
                            running_users[username] = running_users[userId.toString()];
                            if (id == "*" || isMain == true) {
                                running_users["*"] = running_users[userId.toString()];
                            }
                        }
                    }).catch(err => {
                        if (err.toString().includes("Extension context")) {
                            broken_context = true;
                            warn("Extension context is suspected to be broken. Error: " + err.toString());
                        } else {
                            warn(err);
                            if (allow_messages == true) {
                                alert("We couldn't apply the verified badge due to an error! Sorry!");
                            } else { scanUser(id, isMain); }
                        }
                    });
            } catch (err) {
                warn(err);
                if (allow_messages == true) alert("We couldn't apply the verified badge due to an error! Sorry!");
            }
        }
        function promptMessage(userId) {
            if (settings) {
                let verified_prompt_enabled = settings["verifiedPrompt"];
                if (verified_prompt_enabled == true) {
                    if (appr_efazdev_user[userId.toString()]) {
                        const placeholder = document.createRange().createContextualFragment("<div>" + running_users[userId]["efaz_approved_prompt_html"] + "</div>");
                        if (!(document.getElementById("fake_verified_badge"))) {
                            document.body.appendChild(placeholder.children[0].children[0]);
                        }
                    } else if (appr_user_users[userId.toString()]) {
                        const placeholder = document.createRange().createContextualFragment("<div>" + running_users[userId]["user_approved_prompt_html"] + "</div>");
                        if (!(document.getElementById("fake_verified_badge"))) {
                            document.body.appendChild(placeholder.children[0].children[0]);
                        }
                    } else {
                        const placeholder = document.createRange().createContextualFragment("<div>" + running_users[userId]["prompt_html"] + "</div>");
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
        function addPromptButtonInput(userId) {
            let list_item = document.querySelectorAll("span[replicate-badge-addon-prompt=\"" + userId + "_true\"]");
            if (list_item.length > 0) {
                loopThroughArray(list_item, (_, verified_badge_contain) => {
                    verified_badge_contain.setAttribute("replicate-badge-addon-prompt", "false");
                    verified_badge_contain.addEventListener("click", promptMessage.bind(null, userId));
                });
            }
            list_item = null;
        }
        async function approvedGroup(groupId, userId) {
            if (settings["groupsIncluded"] == false) { return false; }
            if (running_groups[groupId]) {
                if (userId && running_groups[groupId]["owner"] && !(running_groups[groupId]["owner"]["userId"] == userId)) {
                    return { "accepted": false };
                }
                return { "accepted": true, "group": running_groups[groupId] };
            } else {
                return { "accepted": false };
            }
        }
        async function userInfoHelper(userUrl) {
            if (!(getIfLinkIsUserProfile(userUrl))) {
                return [null, null];
            }
            let user_id = getUserIdFromLink(userUrl);
            let usr_data = running_users[user_id];
            if (user_id && usr_data) {
                return [user_id, usr_data];
            }
            return [null, null];
        }
        async function groupInfoHelper(groupUrl) {
            if (!(getIfLinkIsGroup(groupUrl))) {
                return [{"accepted": false}, null];
            }
            let group_id = getGroupIdFromLink(groupUrl);
            if (running_groups[group_id]) {
                let usr_data = getUserInfoFromGroup(group_id);
                let user_id = usr_data["user_id"];
                if (usr_data && user_id) {
                    return await approvedGroup(group_id).then(async (info) => {
                        if (info["accepted"] == true) {
                            return [info, usr_data, user_id];
                        } else {
                            return [info, null, null];
                        }
                    })   
                } else {
                    return [{"accepted": false}, null, null];
                }
            }
            return [{"accepted": false}, null, null];
        }
        async function mainLoop() {
            try {
                /* Allowed DOM List */
                let query_names = [
                    ".profile-name.text-overflow",
                    ".profile-header-title-container",
                    ".profile-content > .info > .names > h1",
                    ".premium-badge-right-aligned, .profile-content > .info > .names > h1 > .premium-badge-icon",
                    ".profile-header-premium-badge",
                    ".header-caption > .header-names > h1.profile-name",
                    ".header-caption > .header-names > h1.profile-name > .premium-badge-icon",
                    ".font-header-2.dynamic-ellipsis-item",
                    ".user-name-container",
                    ".friends-carousel-tile-labels",
                    ".text-link.friend-link.ng-isolate-scope",
                    ".text-overflow.avatar-name.ng-binding.ng-scope",
                    ".transactions-title-with-input > a",
                    ".avatar-name.text-overflow.ng-binding",
                    ".text-name.name.ng-binding",
                    "a[href='/users/profile'] > span.flex > span.text-truncate-end",
                    ".text-overflow.age-bracket-label-username.font-caption-header",
                    ".text-name",
                    ".text-name.text-overflow",
                    ".creator-name.text-link",
                    ".groups-list-item",
                    ".MuiLink-underlineHover.web-blox-css-mui-94v26k",
                    ".text-name.name",
                    ".list-item.member.ng-scope",
                    ".list-item > a.group-search-name-link",
                    ".text-label-medium.content-emphasis.ng-binding.ng-scope",
                    ".avatar-card-name.text-lead.text-overflow.ng-binding.ng-scope",
                    ".user-list-container > .flex-col > .w-auto > .user-item-clickable",
                    ".creator-name.text-link",
                    ".avatar-name.text-overflow.ng-binding",
                    ".text-name.username.ng-binding",
                    ".text-overflow.avatar-name",
                    ".text-overflow.game-card-name.ng-binding",
                    ".ng-binding.slide-item-name.text-overflow.groups.font-title",
                    "span[ng-bind='message.recipient.UserName'].ng-binding",
                    ".paired-name.text-name.username-container.font-header-2",
                    ".gap-xxsmall.flex > .icon-filled-premium",
                    "#profile-header-title-container-name",
                    ".rbx-private-owner"
                ].join(", ");
                let include_groups = settings && settings["groupsIncluded"] == true;

                /* Named Containers */
                async function named_container(usr_con) {
                    // User's Profile
                    await userInfoHelper(window.location.pathname).then(async ([_, open_user_data]) => {
                        if (open_user_data) {
                            let profile_html = open_user_data["profile_html"];
                            let profile2_html = open_user_data["profile2_html"];
                            if (usr_con.matches(".profile-name.text-overflow")) {
                                if (usr_con.offsetParent && usr_con.offsetParent.getAttribute("class") == "header-title") {
                                    if (vIconPlaced(usr_con.offsetParent, true)) { return; }
                                    if (usr_con.offsetParent.innerHTML.includes(open_user_data["display_name"])) {
                                        usr_con.offsetParent.appendChild(generateDOMElement(profile_html));
                                    }
                                } else if (usr_con.parentElement && usr_con.parentElement.getAttribute("class") == "header-title") {
                                    if (vIconPlaced(usr_con.parentElement, true)) { return; }
                                    if (usr_con.parentElement.innerHTML.includes(open_user_data["display_name"])) {
                                        usr_con.parentElement.appendChild(generateDOMElement(profile_html));
                                    }
                                } else if (usr_con.parentElement && usr_con.parentElement.parentElement && usr_con.parentElement.parentElement.getAttribute("class") == "header-title") {
                                    if (vIconPlaced(usr_con.parentElement.parentElement, true)) { return; }
                                    if (usr_con.parentElement.parentElement.innerHTML.includes(open_user_data["display_name"])) {
                                        usr_con.parentElement.parentElement.appendChild(generateDOMElement(profile_html));
                                    }
                                }
                            } else if (usr_con.matches(".profile-header-title-container") || usr_con.matches("#profile-header-title-container-name")) {
                                if (vIconPlaced(usr_con, true)) { return; }
                                let s = generateDOMElement(profile2_html);
                                s.children[0].style = "margin-left: 6px;";
                                usr_con.appendChild(s);
                            } else if (usr_con.matches(".profile-content > .info > .names > h1")) {
                                if (vIconPlaced(usr_con, true)) { return; }
                                if (usr_con.innerHTML.includes(open_user_data["display_name"])) {
                                    let s = generateDOMElement(profile2_html.replace("28", "18").replace("28", "18"));
                                    s.children[0].style = "height: 18px; width: 18px; margin-left: 4px;";
                                    usr_con.appendChild(s);
                                }
                            } else if (usr_con.matches(".premium-badge-right-aligned, .profile-content > .info > .names > h1 > .premium-badge-icon")) {
                                if (usr_con && (usr_con.getAttribute("class") == "premium-badge-right-aligned" || usr_con.getAttribute("class") == "premium-badge-icon")) {
                                    usr_con.remove();
                                }
                            } else if (usr_con.matches(".profile-header-premium-badge") || usr_con.matches(".gap-xxsmall.flex > .icon-filled-premium")) {
                                if (usr_con) {
                                    usr_con.remove();
                                }
                            }
                        }
                    });

                    if (true) {
                        let user_inf = running_users["*"];
                        let profile2_html = user_inf["profile2_html"];
                        let name_html = user_inf["name_html"];
                        let name_side_real_html = user_inf["name_side_real_html"];
                        if (usr_con.matches("a[href='/users/profile'] > span.flex > span.text-truncate-end")) {
                            if (vIconPlaced(usr_con, true)) { return; }
                            if (usr_con.innerHTML.includes(user_inf["display_name"])) {
                                let s = generateDOMElement(profile2_html.replace("28", "18").replace("28", "18"));
                                s.children[0].style = "height: 18px; width: 18px; margin-left: 8px;";
                                usr_con.appendChild(s);
                            }
                        } else if (usr_con.matches(".header-caption > .header-names > h1.profile-name")) {
                            if (vIconPlaced(usr_con, true)) { return; }
                            if (usr_con.innerHTML.includes(user_inf["display_name"])) {
                                let s = generateDOMElement(profile2_html.replace("28", "18").replace("28", "18"));
                                s.children[0].style = "height: 18px; width: 18px; margin-left: 4px;";
                                usr_con.appendChild(s);
                            }
                        } else if (usr_con.matches(".header-caption > .header-names > h1.profile-name > .premium-badge-icon")) {
                            if (usr_con && (usr_con.getAttribute("class") == "premium-badge-right-aligned" || usr_con.getAttribute("class") == "premium-badge-icon")) {
                                usr_con.remove();
                            }
                        } else if (usr_con.matches(".font-header-2.dynamic-ellipsis-item")) {
                            if ((usr_con.outerHTML.includes(user_inf["display_name"]) || usr_con.outerHTML.includes(user_inf["username"])) && usr_con.parentElement && usr_con.parentElement.href) {
                                if (getIfLinkIsUserProfile(usr_con.parentElement.href) && getIfLinkIsUser(usr_con.parentElement.href, user_inf["user_id"].toString())) {
                                    if (vIconPlaced(usr_con, false)) { return; }
                                    addOutsideElementInsideAfter(usr_con, " " + name_side_real_html);
                                }
                            }
                        } else if (usr_con.matches(".user-name-container")) {
                            if (usr_con.innerHTML.includes(user_inf["display_name"])) {
                                if (vIconPlaced(usr_con, true)) { return; }
                                if (usr_con.getAttribute("class") == "dynamic-ellipsis-item user-name-container text-link") {
                                    addOutsideElementInsideAfter(usr_con, " " + name_html.replace("width='28'", "width='14'").replace("height='28'", "height='14'"));
                                } else {
                                    addOutsideElementInsideAfter(usr_con, " " + name_html);
                                }
                            }
                        }
                    }
                }

                /* Unnamed Containers */
                async function unnamed_container(usr_con) {
                    if (usr_con.matches(".friends-carousel-tile-labels")) {
                        // Friend Carousel
                        if (usr_con.href && usr_con.getAttribute("class") == "friends-carousel-tile-labels") {
                            await userInfoHelper(usr_con.href).then(async ([_, user_inf]) => {
                                if (user_inf) {
                                    if (usr_con.children[0] && usr_con.children[0].children[0]) {
                                        if (vIconPlaced(usr_con.children[0].children[0], false)) { return; }
                                        addOutsideElementInsideAfter(usr_con.children[0].children[0], " " + genVIcon(user_inf["friends_scroll_html"], null, 28, 28, null, 16, 16).replace("width='28'", "width='16'").replace("height='28'", "height='16'"));
                                    }
                                }
                            });
                        }
                    } else if (usr_con.matches(".text-link.friend-link.ng-isolate-scope")) {
                        if (usr_con.href && usr_con.getAttribute("class") == "text-link friend-link ng-isolate-scope") {
                            await userInfoHelper(usr_con.href).then(async ([user_id, user_inf]) => {
                                if (user_inf) {
                                    if (usr_con.innerHTML.includes('class="hide"') && usr_con.innerHTML.includes(user_inf["display_name"])) {
                                        if (usr_con.children[1]) {
                                            if (!(user_inf["user_checkmark_color"] == "%230066ff" || user_inf["user_checkmark_color"] == "%230066FF")) {  // User's selected color
                                                usr_con.children[1].innerHTML = usr_con.children[1].innerHTML.replaceAll('class="hide"', "").replaceAll("%230066FF", user_inf["user_checkmark_color"]);
                                            } else if (appr_efazdev_user[user_id] && appr_efazdev_user[user_id]["hexColor"]) { // If the main user has selected the default, has EfazDev Approved Users enabled, and there's a color attached to the approved user.
                                                let hex_color = appr_efazdev_user[user_id]["hexColor"];
                                                hex_color = hex_color.replace("#", "%23");
                                                usr_con.children[1].innerHTML = usr_con.children[1].innerHTML.replaceAll('class="hide"', "").replaceAll("%230066FF", hex_color);
                                            } else if (appr_user_users[user_id] && appr_user_users[user_id]["hexColor"]) { // If the main user has selected the default, has EfazDev Approved Users enabled, and there's a color attached to the approved user.
                                                let hex_color = appr_user_users[user_id]["hexColor"];
                                                hex_color = hex_color.replace("#", "%23");
                                                usr_con.children[1].innerHTML = usr_con.children[1].innerHTML.replaceAll('class="hide"', "").replaceAll("%230066FF", hex_color);
                                            } else {
                                                usr_con.children[1].innerHTML = usr_con.children[1].innerHTML.replaceAll('class="hide"', "");
                                            }
                                        }
                                    }
                                }
                            });
                        }
                    } else if (usr_con.matches(".text-overflow.avatar-name.ng-binding.ng-scope")) {
                        // Search Page
                        if (usr_con.getAttribute("class") == "text-overflow avatar-name ng-binding ng-scope" && usr_con.parentElement && usr_con.parentElement.parentElement) {
                            let unamec_10 = usr_con.parentElement.parentElement.querySelectorAll(".text-overflow.avatar-card-label.ng-binding.ng-scope");
                            if (unamec_10.length > 0) {
                                await loopThroughArrayAsync(unamec_10, async (_, usr_con_2) => {
                                    let usr_data = running_users[usr_con_2.textContent.replace("@", "")];
                                    if (usr_data) {
                                        if (!(usr_con.parentElement)) { return; }
                                        if (vIconPlaced(usr_con.parentElement, false)) { return; }
                                        addOutsideElementAfter(usr_con, " " + usr_data["game_html"]);
                                        addPromptButtonInput(usr_data["user_id"]);
                                    }
                                });
                            }
                            unamec_10 = null;
                        }
                    } else if (usr_con.matches(".transactions-title-with-input > a")) {
                        // Transactions Page
                        await userInfoHelper(usr_con.href).then(async ([_, usr_data]) => {
                            if (usr_data) {
                                if (vIconPlaced(usr_con.parentElement, false)) { return; }
                                addOutsideElementAfter(usr_con, " " + genVIcon(usr_data["name_side_html"], 2, 12, 12, 0, 20, 20));
                            }
                        });
                    } else if (usr_con.matches(".avatar-name.text-overflow.ng-binding")) {
                        // Group Member Cards in Manage Page
                        if (usr_con.href && usr_con.getAttribute("class") == "avatar-name text-overflow ng-binding") {
                            await userInfoHelper(usr_con.href).then(async ([user_id, user_inf]) => {
                                if (user_id && user_inf) {
                                    if (usr_con.parentElement && usr_con.parentElement.parentElement && usr_con.parentElement.parentElement.children[1] && usr_con.parentElement.parentElement.children[1].outerHTML.includes(user_inf["username_at"])) {
                                        if (!(usr_con.parentElement)) { return; }
                                        if (!(usr_con.parentElement.parentElement)) { return; }
                                        if (vIconPlaced(usr_con.parentElement.parentElement.parentElement, false)) { return; }
                                        addOutsideElementAfter(usr_con, " " + user_inf["name_small_html"]);
                                        addPromptButtonInput(user_id);
                                    }
                                }
                            });
                        }
                    } else if (usr_con.matches(".text-name.name.ng-binding")) {
                        // Group Owner in Manage Page
                        if (usr_con.href && usr_con.getAttribute("class") == "text-name name ng-binding") {
                            await userInfoHelper(usr_con.href).then(async ([_, user_inf]) => {
                                if (user_inf) {
                                    if (!(usr_con.parentElement)) { return; }
                                    if (vIconPlaced(usr_con.parentElement, false)) { return; }
                                    addOutsideElementAfter(usr_con, " " + genVIcon(user_inf["name_side_html"], 2, 12, 12, 4, 16, 16));
                                }
                            });
                        }
                    } else if (usr_con.matches(".text-overflow.age-bracket-label-username.font-caption-header")) {
                        // Top Bar Name
                        if (usr_con.parentElement && usr_con.parentElement.href && usr_con.getAttribute("class") == "text-overflow age-bracket-label-username font-caption-header") {
                            await userInfoHelper(usr_con.parentElement.href).then(async ([user_id, user_inf]) => {
                                if (user_inf) {
                                    if (!(usr_con.parentElement)) { return; }
                                    if (vIconPlaced(usr_con.parentElement, false)) { return; }
                                    addOutsideElementAfter(usr_con, " " + user_inf["name_side_html"].replace("margin-left: 2px;width: 12px;height: 12px; background: none !important;", "margin-right: 6px; margin-left: -2px; width: 14px; height: 14px; background: none !important;"));
                                }
                            });
                        }
                    } else if (usr_con.matches(".text-name")) {
                        // Creator Names
                        if (usr_con.matches(".text-name.text-overflow")) {
                            if (usr_con.href && usr_con.getAttribute("class") == "text-name text-overflow") {
                                await userInfoHelper(usr_con.href).then(async ([user_id, user_inf]) => {
                                    if (user_inf) {
                                        if (!(usr_con.parentElement)) { return; }
                                        if (vIconPlaced(usr_con.parentElement, false)) { return; }
                                        addOutsideElementAfter(usr_con, " " + user_inf["game_html"]);
                                        addPromptButtonInput(user_id);
                                    }
                                });
                            }
                            if (usr_con.href && include_groups == true) {
                                await groupInfoHelper(usr_con.href).then(async ([info, user_inf, user_id]) => {
                                    if (info["accepted"] == true && usr_con.getAttribute("class") == "text-name text-overflow") {
                                        if (!(usr_con.parentElement)) { return; }
                                        if (vIconPlaced(usr_con.parentElement, false)) { return; }
                                        addOutsideElementAfter(usr_con, " " + user_inf["game_html"]);
                                        addPromptButtonInput(user_id);
                                    }
                                });
                            }
                        } else {
                            if (!(usr_con.parentElement)) { return; }
                            if (usr_con.href && usr_con.getAttribute("class") == "text-name") {
                                await userInfoHelper(usr_con.href).then(async ([user_id, user_inf]) => {
                                    if (user_inf) {
                                        if (vIconPlaced(usr_con.parentElement.parentElement, false)) { return; }
                                        addOutsideElementAfter(usr_con.parentElement, " " + genVIcon(user_inf["game_html"], 4, null, null, 2, null, null));
                                        addPromptButtonInput(user_id);
                                    }
                                });
                            }
                            if (usr_con.href && include_groups == true) {
                                await groupInfoHelper(usr_con.href).then(async ([info, user_inf, user_id]) => {
                                    if (info["accepted"] == true && usr_con.getAttribute("class") == "text-name") {
                                        if (!(usr_con.parentElement)) { return; }
                                        if (!(usr_con.parentElement.parentElement)) { return; }
                                        if (vIconPlaced(usr_con.parentElement.parentElement, false)) { return; }
                                        addOutsideElementAfter(usr_con.parentElement, " " + genVIcon(user_inf["game_html"], 4, null, null, 2, null, null));
                                        addPromptButtonInput(user_id);
                                    }
                                });
                            }
                        }
                    } else if (usr_con.matches(".creator-name.text-link")) {
                        // Catalog Creator Names
                        if (usr_con.href && usr_con.getAttribute("class") == "creator-name text-link") {
                            await userInfoHelper(usr_con.href).then(async ([_, user_inf]) => {
                                if (user_inf) {
                                    if (!(usr_con.parentElement)) { return; }
                                    if (vIconPlaced(usr_con.parentElement, false)) { return; }
                                    addOutsideElementAfter(usr_con, " " + genVIcon(user_inf["name_side_html"], 2, null, null, -1));
                                }
                            });
                        }
                        if (usr_con.getAttribute("class") == "creator-name text-link" && usr_con.href && include_groups == true) {
                            await groupInfoHelper(usr_con.href).then(async ([info, usr_info, _]) => {
                                if (info["accepted"] == true && usr_con.getAttribute("class") == "creator-name text-link") {
                                    if (!(usr_con.parentElement)) { return; }
                                    if (vIconPlaced(usr_con.parentElement, false)) { return; }
                                    addOutsideElementAfter(usr_con, " " + genVIcon(usr_info["name_side_html"], 2, null, null, -1));
                                }
                            });
                        }
                    }
                }

                /* Sector A: Group Handler */
                async function sector_a(usr_con) {
                    if (getIfLinkIsGroup(window.location.pathname)) {
                        let identified_id = getGroupIdFromLink(window.location.pathname);
                        if (identified_id && include_groups) {
                            if (usr_con.matches(".groups-list-item")) {
                                if (usr_con.children[1] && usr_con.children[1].children[0] && usr_con.children[1].children[0].children[0] && usr_con.children[1].children[0].children[0].children[0] && usr_con.href) {
                                    await groupInfoHelper(usr_con.href).then(async ([info, user_inf, _]) => {
                                        if (info["accepted"] == true) {
                                            usr_con = usr_con.children[1].children[0].children[0].children[0];
                                            if (vIconPlaced(usr_con, true)) { return; }
                                            addOutsideElementInsideAfter(usr_con, " " + genVIcon(user_inf["name_side_html"], 2, 12, 12, 2, 16, 16));
                                        }
                                    });
                                }
                            }
                            if (usr_con.matches(".MuiLink-underlineHover.web-blox-css-mui-94v26k")) {
                                await userInfoHelper(usr_con.href).then(async ([owner_user_id, owner_data]) => {
                                    if (owner_data && usr_con.innerHTML.includes(owner_data["display_name"])) {
                                        let group_name_verified_html = owner_data["group_name_verified_html"];
                                        let group_owner_name_html = owner_data["group_owner_name_html"];
                                        if (!(usr_con.parentElement)) { return; }
                                        if (!(vIconPlaced(usr_con.parentElement, true))) {
                                            addOutsideElementAfter(usr_con, " " + group_owner_name_html);
                                        }
                                        let group_name = document.querySelectorAll(".profile-header-details-community-name.text-heading-large");
                                        if (group_name.length > 0) {
                                            await loopThroughArrayAsync(group_name, async (_, usr_con) => {
                                                if (vIconPlaced(usr_con, true)) {
                                                    return;
                                                }
                                                addOutsideElementInsideAfter(usr_con, group_name_verified_html);
                                            });
                                        }
                                        addPromptButtonInput(owner_user_id);
                                        group_name = null;
                                    }
                                });
                            }
                            if (usr_con.matches(".text-name.name")) {
                                if (usr_con.getAttribute("class") == "text-name name") {
                                    await userInfoHelper(usr_con.href).then(async ([_, user_inf]) => {
                                        if (user_inf && usr_con.innerHTML.includes(user_inf["display_name"])) {
                                            if (vIconPlaced(usr_con.parentElement, false)) { return; }
                                            addOutsideElementAfter(usr_con, " " + genVIcon(user_inf["name_side_html"], 2, 12, 12, 6, 16, 16));
                                        }
                                    });
                                }
                            } else if (usr_con.matches(".user-list-container > .flex-col > .w-auto > .user-item-clickable")) {
                                if (usr_con.href) {
                                    await userInfoHelper(usr_con.href).then(async ([_, user_inf]) => {
                                        if (user_inf && usr_con.innerHTML.includes(user_inf["display_name"])) {
                                            let target_element = usr_con.querySelector(".text-title-medium.text-truncate-split")
                                            if (target_element) {
                                                if (vIconPlaced(target_element, false)) { return; }
                                                addOutsideElementInsideAfter(target_element, " " + genVIcon(user_inf["name_side_html"], 2, 12, 12, 0, 16, 16));
                                            }
                                        }
                                    });
                                }
                            } else if (usr_con.matches(".list-item.member.ng-scope")) {
                                if (usr_con.children[0] && usr_con.children[0].children[0]) {
                                    await userInfoHelper(usr_con.children[0].children[0].href).then(async ([_, user_inf]) => {
                                        if (user_inf && usr_con.children[0] && usr_con.children[0].children[2] && usr_con.children[0].children[2].children[0] && usr_con.children[0].children[2].children[0].children[0]) {
                                            if (vIconPlaced(usr_con.children[0].children[2].children[0], true)) { return; }
                                            addOutsideElementInsideAfter(usr_con.children[0].children[2].children[0].children[0], " " + genVIcon(user_inf["name_side_html"], 2, 12, 12, 0, 16, 16));
                                        }
                                    });
                                }
                            } else if (usr_con.matches(".text-label-medium.content-emphasis.ng-binding.ng-scope")) {
                                if (usr_con.getAttribute("class") == "text-label-medium content-emphasis ng-binding ng-scope") {
                                    await userInfoHelper(usr_con.href).then(async ([_, user_inf]) => {
                                        if (user_inf && usr_con.innerHTML.includes(user_inf["display_name"])) {
                                            if (vIconPlaced(usr_con, true)) { return; }
                                            addOutsideElementInsideAfter(usr_con, " " + genVIcon(user_inf["name_side_html"], 2, 12, 12, 0, 16, 16));
                                        }
                                    });
                                }
                            } else if (usr_con.matches(".avatar-card-name.text-lead.text-overflow.ng-binding.ng-scope")) {
                                await userInfoHelper(usr_con.href).then(async ([_, user_inf]) => {
                                    if (user_inf && usr_con.innerHTML.includes(user_inf["display_name"])) {
                                        if (vIconPlaced(usr_con.parentElement, true)) { return; }
                                        addOutsideElementInsideAfter(usr_con, " " + genVIcon(user_inf["name_side_html"], 2, 12, 12, -1, 16, 16));
                                    }
                                });
                            }
                        }
                    }
                    // Group Searches
                    if (usr_con.matches(".list-item > a.group-search-name-link")) {
                        if (usr_con.href && getIfLinkIsGroup(usr_con.href)) {
                            await groupInfoHelper(usr_con.href).then(async ([info, user_data, _]) => {
                                if (info["accepted"] == true) {
                                    let card_name = usr_con.querySelector(".group-card-name > .font-header-2.text-overflow.ng-binding");
                                    if (user_data && card_name) {
                                        if (vIconPlaced(card_name, true)) { return; }
                                        addOutsideElementInsideAfter(card_name, genVIcon(user_data["name_side_html"], 2, 12, 12, 4, 16, 16));
                                    }
                                }
                            });
                        }
                    }
                }

                /* Sector B: Creator Names */
                async function sector_b(usr_con) {
                    if (usr_con.matches(".creator-name.text-link")) {
                        if (usr_con.href && usr_con.getAttribute("class") == "creator-name text-link") {
                            await userInfoHelper(usr_con.href).then(async ([_, user_inf]) => {
                                if (user_inf) {
                                    if (!(usr_con.parentElement)) { return; }
                                    if (vIconPlaced(usr_con.parentElement, false)) { return; }
                                    addOutsideElementAfter(usr_con, " " + genVIcon(user_inf["name_side_html"], 2, null, null, -1));
                                }
                            });
                        }
                        if (include_groups == true && usr_con.getAttribute("class") == "creator-name text-link" && usr_con.href) {
                            await groupInfoHelper(usr_con.href).then(async ([info, usr_info, _]) => {
                                if (info["accepted"] == true) {
                                    if (usr_con.getAttribute("class") == "creator-name text-link") {
                                        if (!(usr_con.parentElement)) { return; }
                                        if (vIconPlaced(usr_con.parentElement, false)) { return; }
                                        addOutsideElementAfter(usr_con, " " + genVIcon(usr_info["name_side_html"], 2, null, null, -1));
                                    }
                                }
                            });
                        }
                    } else if (usr_con.matches(".avatar-name.text-overflow.ng-binding")) {
                        // Unknown, Assumed with URL
                        if (usr_con.matches(".text-overflow.avatar-name.ng-binding.ng-scope")) {
                            if (usr_con.href && usr_con.getAttribute("class") == "text-overflow avatar-name ng-binding ng-scope") {
                                await userInfoHelper(usr_con.href).then(async ([user_id, user_inf]) => {
                                    if (user_id && user_inf) {
                                        let unamec_9 = document.querySelectorAll(".text-overflow.avatar-card-label.ng-binding.ng-scope");
                                        if (unamec_9.length > 0) {
                                            await loopThroughArrayAsync(unamec_9, async (_, usr_con_2) => {
                                                if (usr_con.offsetParent == usr_con_2.offsetParent) {
                                                    if (usr_con_2.textContent == user_inf["username_at"]) {
                                                        if (!(usr_con.parentElement)) { return; }
                                                        if (vIconPlaced(usr_con.parentElement, false)) { return; }
                                                        addOutsideElementAfter(usr_con, " " + user_inf["game_html"]);
                                                        addPromptButtonInput(user_id);
                                                    }
                                                }
                                            });
                                        }
                                    }
                                });
                            }
                        } else {
                            if (usr_con.href && usr_con.getAttribute("class") == "avatar-name text-overflow ng-binding") {
                                await userInfoHelper(usr_con.href).then(async ([user_id, user_inf]) => {
                                    if (user_id && user_inf) {
                                        if (!(usr_con.parentElement)) { return; }
                                        if (!(usr_con.parentElement.parentElement)) { return; }
                                        if (!(usr_con.parentElement.parentElement.parentElement)) { return; }
                                        if (!(usr_con.parentElement.parentElement.children[1])) { return; }
                                        if (usr_con.parentElement.parentElement.children[1].outerHTML.includes(user_inf["username_at"])) {
                                            if (vIconPlaced(usr_con.parentElement.parentElement.parentElement, false)) { return; }
                                            addOutsideElementAfter(usr_con, " " + user_inf["name_small_html"]);
                                            addPromptButtonInput(user_id);
                                        }
                                    }
                                });
                            }
                        }
                    }
                }

                /* Sector C: Avatar Cards */
                async function sector_c(usr_con) {
                    // Unknown, Assumed with URL
                    if (usr_con.matches(".avatar-name.text-overflow.ng-binding")) {
                        if (usr_con.href && usr_con.getAttribute("class") == "avatar-name text-overflow ng-binding") {
                            await userInfoHelper(usr_con.href).then(async ([user_id, user_inf]) => {
                                if (user_id && user_inf) {
                                    if (!(usr_con.parentElement)) { return; }
                                    if (!(usr_con.parentElement.parentElement)) { return; }
                                    if (!(usr_con.parentElement.parentElement.parentElement)) { return; }
                                    if (!(usr_con.parentElement.parentElement.children[1])) { return; }
                                    if (usr_con.parentElement.parentElement.children[1].outerHTML.includes(user_inf["username_at"])) {
                                        if (vIconPlaced(usr_con.parentElement.parentElement.parentElement, false)) { return; }
                                        addOutsideElementAfter(usr_con, " " + user_inf["name_small_html"]);
                                        addPromptButtonInput(user_id);
                                    }
                                }
                            });
                        }
                    }
                }

                /* Sector D: Resellers */
                async function sector_d(usr_con) {
                    if (usr_con.matches(".text-name.username.ng-binding")) {
                        if (usr_con.href && usr_con.getAttribute("class") == "text-name username ng-binding") {
                            await userInfoHelper(usr_con.href).then(async ([user_id, user_inf]) => {
                                if (user_id && user_inf) {
                                    if (!(usr_con.parentElement)) { return; }
                                    if (vIconPlaced(usr_con.parentElement, false)) { return; }
                                    addOutsideElementAfter(usr_con, " " + user_inf["reseller_html"]);
                                    addPromptButtonInput(user_id);
                                }
                            });
                        }
                    }
                }

                /* Sector E: More Avatar Cards */
                async function sector_e(usr_con) {
                    if (usr_con.matches(".text-overflow.avatar-name")) {
                        if (usr_con.getAttribute("class") == "text-overflow avatar-name") {
                            let quick_hide = usr_con.parentElement.querySelector("*[data-rblx-badge-icon='true']")
                            if (quick_hide) {
                                quick_hide.setAttribute("style", "display: none;")
                            }
                            await userInfoHelper(usr_con.href).then(async ([user_id, user_inf]) => {
                                if (user_id && user_inf) {
                                    if (!(usr_con.parentElement)) { return; }
                                    let element = vIconPlaced(usr_con.parentElement, false, true)
                                    if (element) {
                                        element.children[0].setAttribute("src", generateDOMElement(user_inf["game_html"]).children[0].getAttribute("src"))
                                        element.setAttribute("style", "display: block;")
                                    } else {
                                        addOutsideElementAfter(usr_con, " " + user_inf["game_html"]);
                                    }
                                    addPromptButtonInput(user_id);
                                }
                            });
                        }
                    }
                }

                /* Sector F: Game Cards */
                async function sector_f(usr_con) {
                    if (include_groups == true) {
                        if (usr_con.matches(".text-overflow.game-card-name.ng-binding")) {
                            if (usr_con.parentElement.parentElement.href && usr_con.getAttribute("class") == "text-overflow game-card-name ng-binding") {
                                await groupInfoHelper(usr_con.parentElement.parentElement.href).then(async ([info, usr_info, _]) => {
                                    if (info["accepted"] == true && usr_con.getAttribute("class") == "text-overflow game-card-name ng-binding") {
                                        if (!(usr_con.parentElement)) { return; }
                                        if (vIconPlaced(usr_con.parentElement, false)) { return; }
                                        addOutsideElementAfter(usr_con, " " + genVIcon(usr_info["name_side_html"], 2, 12, 12, 4, 16, 16));
                                    }
                                });
                            }
                        } else if (usr_con.matches(".ng-binding.slide-item-name.text-overflow.groups.font-title")) {
                            if (usr_con.getAttribute("class") == "ng-binding slide-item-name text-overflow groups font-title") {
                                if (usr_con.parentElement.href) {
                                    await groupInfoHelper(usr_con.parentElement.href).then(async ([info, usr_info, _]) => {
                                        if (info["accepted"] == true) {
                                            if (usr_con.getAttribute("class") == "ng-binding slide-item-name text-overflow groups font-title") {
                                                let name_side_html = usr_info["name_side_html"];
                                                if (!(usr_con.parentElement)) { return; }
                                                if (vIconPlaced(usr_con.parentElement, false)) { return; }
                                                addOutsideElementInsideAfter(usr_con, " " + genVIcon(name_side_html, 2, 12, 12, 0, 28, 28));
                                            }
                                        }
                                    });
                                }
                            }
                        }
                    }
                }

                /* Sector G: Messages */
                async function sector_g(usr_con) {
                    if (usr_con.matches("span[ng-bind='message.recipient.UserName'].ng-binding")) {
                        let username = usr_con.textContent;
                        if (running_users[username.replace("@", "")]) {
                            let user_inf = running_users[username.replace("@", "")];
                            if (!(usr_con.parentElement)) { return; }
                            if (!(usr_con.parentElement.querySelector("span[ng-bind='message.recipient.displayName']"))) { return; }
                            let display_name = usr_con.parentElement.querySelector("span[ng-bind='message.recipient.displayName']");
                            if (vIconPlaced(display_name, true)) { return; }
                            addOutsideElementInsideAfter(display_name, user_inf["game_html"]);
                            addPromptButtonInput(user_inf["user_id"]);
                        }
                    } else if (usr_con.matches(".paired-name.text-name.username-container.font-header-2")) {
                        if (usr_con.children[0] && usr_con.href && usr_con.getAttribute("class") == "paired-name text-name username-container font-header-2") {
                            await userInfoHelper(usr_con.href).then(async ([user_id, user_inf]) => {
                                if (user_id && user_inf) {
                                    if (vIconPlaced(usr_con.children[0], true)) { return; }
                                    if (usr_con.innerHTML.includes(user_inf["username_at"])) {
                                        addOutsideElementInsideAfter(usr_con.children[0], user_inf["game_html"]);
                                        addPromptButtonInput(user_id);
                                    }
                                }
                            });
                        }
                    }
                }

                /* Sector H: More Names */
                async function sector_h(usr_con) {
                    if (usr_con.matches(".text-name")) {
                        if (!(usr_con.parentElement)) { return; }
                        if (usr_con.href && usr_con.getAttribute("class") == "text-name") {
                            await userInfoHelper(usr_con.href).then(async ([user_id, user_inf]) => {
                                if (user_id && user_inf) {
                                    if (vIconPlaced(usr_con.parentElement.parentElement, false)) { return; }
                                    addOutsideElementAfter(usr_con.parentElement, genVIcon(user_inf["game_html"], 4, null, null, 2, null, null));
                                    addPromptButtonInput(user_id);
                                }
                            });
                        }
                        if (include_groups == true && usr_con.href) {
                            await groupInfoHelper(usr_con.href).then(async ([info, user_inf, user_id]) => {
                                if (info["accepted"] == true && usr_con.getAttribute("class") == "text-name") {
                                    if (!(usr_con.parentElement)) { return; }
                                    if (!(usr_con.parentElement.parentElement)) { return; }
                                    if (vIconPlaced(usr_con.parentElement.parentElement, false)) { return; }
                                    addOutsideElementAfter(usr_con.parentElement, genVIcon(user_inf["game_html"], 4, null, null, 2, null, null));
                                    addPromptButtonInput(user_id);
                                }
                            });
                        }
                    } else if (usr_con.matches(".rbx-private-owner")) {
                        if (!(usr_con.children && usr_con.children[1])) { return; }
                        if (!(usr_con.children[1].children[0])) { return; }
                        if (!(usr_con.children[1].children[0].children[1])) { return; }
                        if (usr_con.children[1].href && usr_con.getAttribute("class") == "rbx-private-owner") {
                            await userInfoHelper(usr_con.children[1].href).then(async ([user_id, user_inf]) => {
                                if (user_id && user_inf) {
                                    if (vIconPlaced(usr_con.children[1].children[0].children[1], true)) { return; }
                                    addOutsideElementInsideAfter(usr_con.children[1].children[0].children[1], genVIcon(user_inf["game_html"], 4, null, null, 1, null, null));
                                    addPromptButtonInput(user_id);
                                }
                            });
                        }
                    }
                }

                /* Container Handling */
                async function handle_container(usr_con) {
                    try {
                        /* Run All Sectors and Prompt Handling */
                        await named_container(usr_con);
                        await unnamed_container(usr_con);
                        await sector_a(usr_con);
                        await sector_b(usr_con);
                        await sector_c(usr_con);
                        await sector_d(usr_con);
                        await sector_e(usr_con);
                        await sector_f(usr_con);
                        await sector_g(usr_con);
                        await sector_h(usr_con);
                    } catch (err) {
                        warn(err.stack);
                    }
                }

                /* Start observers */
                observer = new MutationObserver((mutations) => {
                    mutations.forEach(m => {
                        m.addedNodes.forEach(node => {
                            if (node.nodeType === Node.ELEMENT_NODE) {
                                if (node.matches(query_names)) { handle_container(node); }
                                node.querySelectorAll(query_names).forEach(desc => { handle_container(desc); });
                            }
                        });
                        if (m.target instanceof Element) {
                            if (m.target.matches(query_names)) {
                                handle_container(m.target);
                            };
                        } else if (m.target.nodeType === Node.TEXT_NODE) {
                            let parent = m.target.parentElement;
                            if (parent) {
                                if (parent.matches(query_names)) { handle_container(parent); }
                            }
                        }
                    });
                });
                observer.observe(document.documentElement, {
                    childList: true,
                    subtree: true,
                    characterData: true
                });
                let query_selectors = document.querySelectorAll(query_names);
                for (let i = 0; i < query_selectors.length; i++) {
                    let header = query_selectors[i];
                    await handle_container(header);
                }
                query_selectors = null;
            } catch (err) {
                warn(err);
                if (allow_messages == true) alert("We couldn't apply the verified badge due to an error! Sorry!");
            }
        }
        await getUserData("*", true).then(async (json) => {
            if (json && json["id"]) {
                await scanUser(json["id"], true);
                await chrome.storage.local.get("user_verification").then(async (stored_user_data) => {
                    if (stored_user_data["user_verification"] && settings["verifiedBadgeBetweenAccounts"] == true) {
                        let ids = Object.keys(stored_user_data["user_verification"]);
                        await loopThroughArrayAsync(ids, async (_, user_id) => {
                            if (!(user_id == json["id"])) {
                                await scanUser(user_id, false);
                            }
                        });
                    }
                    if (settings["useCustomApprovedBadgesByUser"] == true) {
                        let ids = Object.keys(appr_user_users);
                        await loopThroughArrayAsync(ids, async (_, user_id) => {
                            let approved_user_info = appr_user_users[user_id];
                            if (!(approved_user_info["id"] == json["id"].toString())) {
                                await scanUser(approved_user_info["id"], false);
                            }
                        });
                    }
                    if (settings["allowEfazDevApprovedBadges"] == true) {
                        let ids = Object.keys(appr_efazdev_user);
                        await loopThroughArrayAsync(ids, async (_, user_id) => {
                            let approved_user_info = appr_efazdev_user[user_id];
                            if (!(approved_user_info["id"] == json["id"].toString())) {
                                await scanUser(approved_user_info["id"], false);
                            }
                        });
                    }
                });
                await mainLoop();
            }
        }).catch(err => {
            warn(err.stack);
            if (allow_messages == true) alert("We couldn't apply the verified badge due to an error! Sorry!");
        });
    }
}
function getChromeURL(resource) {
    try {
        // This is for Efaz's Roblox Extension support
        if (chrome.runtime.getManifest()["homepage_url"] == "https://www.efaz.dev/roblox-extension") {
            // This is run under bundled extension [{extension_name}/{resource}]
            return chrome.runtime.getURL("dev.efaz.verified_badge_add_on" + "/" + resource);
        } else {
            return chrome.runtime.getURL(resource);
        }
    } catch (_) {
        // This is run under mini extension [{resource}]
        return chrome.runtime.getURL(resource);
    }
}
async function getSettings(storage_key, callback) {
    return await fetch(getChromeURL("settings.json")).then((res) => {
        if (res.ok) { return res.json(); }
    }).then(async (jso) => {
        if (jso) {
            let te = await storage.get(storage_key);
            let user_settings = {};
            if (te && te[storage_key]) {
                user_settings = te;
            } else if (jso["old_name"]) {
                let old = await storage.get(jso["old_name"]);
                if (old) {
                    user_settings = old;
                    user_settings = { [storage_key]: user_settings[jso["old_name"]] };
                }
            }
            if (!(user_settings[storage_key])) { user_settings[storage_key] = {}; }
            await loopThroughArrayAsync(jso["settings"], async (i, v) => {
                if (typeof (user_settings[storage_key][i]) == "undefined") {
                    if (!(typeof (v["default"]) == "undefined")) {
                        if (!(getTran(i + "_default") == null)) {
                            user_settings[storage_key][i] = (getTran(i + "_default"));
                        } else {
                            user_settings[storage_key][i] = (v["default"]);
                        }
                    }
                }
            });
            if (callback) { callback(user_settings); }
            return user_settings;
        }
    });
}
async function loader() { // Script Loader
    if (!(window.location.hostname == "www.roblox.com")) { return; }
    const storage_key = "dev.efaz.verified_badge_add_on";
    await getSettings(storage_key, async function (items) {
        settings = items[storage_key];
        if (typeof (settings["enabled"]) == "boolean") { enabled = settings["enabled"]; }
        if (typeof (settings["allowAlertMessages"]) == "boolean") { allow_messages = settings["allowAlertMessages"]; }
        if (enabled == true) {
            if (settings["allowEfazDevApprovedBadges"] == true) {
                try {
                    let appr_json = await fetch("https://cdn.efaz.dev/extensions/dev.efaz.verified_badge_add_on/resources/approved_users.json").then(appr_res => {
                        if (appr_res.ok) {
                            return appr_res.json();
                        } else { return {}; }
                    }).catch((err) => {
                        warn(err);
                        return {};
                    });
                    appr_efazdev_user = appr_json;
                } catch (err) {
                    warn(err);
                    appr_efazdev_user = {};
                }
            }
            if (settings["useCustomApprovedBadgesByUser"] == true) {
                try {
                    let appr_json = await chrome.storage.local.get("user_approved_json").then(async (app_json_items) => {
                        if (app_json_items && app_json_items["user_approved_json"]) {
                            if (typeof (app_json_items["user_approved_json"]) == "object") { return app_json_items["user_approved_json"]; } else {
                                warn("Invalid JSON data.");
                                return {};
                            }
                        } else { return {}; }
                    });
                    appr_user_users = appr_json;
                } catch (err) {
                    warn(err);
                    appr_user_users = {};
                }
            }
            if (document.readyState === "complete") { start(); } else { window.addEventListener("load", start); }
            console.log("Starting Verified Badge Loader: Settings Configuration v3");
        }
    });
}
loader(); // Start Loader