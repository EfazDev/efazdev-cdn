let enabled = true;
let allow_messages = false;
let settings = {};
let group_data = {};
let temp_usr = {};
let cache_html = {};
let appr_efazdev_user = {};
let appr_user_users = {};
let group_scan = false;
let storage = chrome.storage.local;
let storage_key = "dev.efaz.verified_badge_add_on";

function warn(mes) { console.warn(`Verified Badge Loader: ${mes}`); }
function timeout(func, ms) { setTimeout(func, ms); }
function logMessage(message) {
    if (allow_messages == true) { console.log(`Verified Badge Loader: ${message}`); }
}
function genVIcon(close, orgMargin, orgX, orgY, margin, sizeX, sizeY) {
    if ((typeof (orgMargin) == "number") && (typeof (margin) == "number")) { close = close.replace(`margin-left: ${orgMargin}px;`, `margin-left: ${margin}px;`); }
    if ((typeof (orgX) == "number") && (typeof (sizeX) == "number")) { close = close.replace(`width: ${orgX}px;`, `width: ${sizeX}px;`); }
    if ((typeof (orgY) == "number") && (typeof (sizeY) == "number")) { close = close.replace(`height: ${orgY}px;`, `height: ${sizeY}px;`); }
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
    if (cache_html[json["id"]]) { return cache_html[json["id"]]; }
    /* All of these HTML variables are extracted from the Roblox Website and modified to be functioned like the actual badge. */
    let profile_html = `<span efaz-verified-badge-addon="true" role="button" tabindex="0" data-rblx-verified-badge-icon="" data-rblx-badge-icon="true" class="jss16"><img class="profile-verified-badge-icon" src="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28' fill='none'%3E%3Cg clip-path='url(%23clip0_8_46)'%3E%3Crect x='5.88818' width='22.89' height='22.89' transform='rotate(15 5.88818 0)' fill='%230066FF'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M20.543 8.7508L20.549 8.7568C21.15 9.3578 21.15 10.3318 20.549 10.9328L11.817 19.6648L7.45 15.2968C6.85 14.6958 6.85 13.7218 7.45 13.1218L7.457 13.1148C8.058 12.5138 9.031 12.5138 9.633 13.1148L11.817 15.2998L18.367 8.7508C18.968 8.1498 19.942 8.1498 20.543 8.7508Z' fill='white'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_8_46'%3E%3Crect width='28' height='28' fill='white'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E" title="[input_id]" alt="[input_id]"></span>`;
    let profile2_html = `<span efaz-verified-badge-addon="true" role="button" tabindex="0" data-rblx-verified-badge-icon="" data-rblx-badge-icon="true" class="jss4"><img class="profile-verified-badge-icon" src="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28' fill='none'%3E%3Cg clip-path='url(%23clip0_8_46)'%3E%3Crect x='5.88818' width='22.89' height='22.89' transform='rotate(15 5.88818 0)' fill='%230066FF'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M20.543 8.7508L20.549 8.7568C21.15 9.3578 21.15 10.3318 20.549 10.9328L11.817 19.6648L7.45 15.2968C6.85 14.6958 6.85 13.7218 7.45 13.1218L7.457 13.1148C8.058 12.5138 9.031 12.5138 9.633 13.1148L11.817 15.2998L18.367 8.7508C18.968 8.1498 19.942 8.1498 20.543 8.7508Z' fill='white'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_8_46'%3E%3Crect width='28' height='28' fill='white'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E" title="[input_id]" alt="[input_id]"></span>`;
    let name_html = `<img efaz-verified-badge-addon="true" class="verified-badge-icon-catalog-item-rendered" src="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28' fill='none'%3E%3Cg clip-path='url(%23clip0_8_46)'%3E%3Crect x='5.88818' width='22.89' height='22.89' transform='rotate(15 5.88818 0)' fill='%230066FF'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M20.543 8.7508L20.549 8.7568C21.15 9.3578 21.15 10.3318 20.549 10.9328L11.817 19.6648L7.45 15.2968C6.85 14.6958 6.85 13.7218 7.45 13.1218L7.457 13.1148C8.058 12.5138 9.031 12.5138 9.633 13.1148L11.817 15.2998L18.367 8.7508C18.968 8.1498 19.942 8.1498 20.543 8.7508Z' fill='white'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_8_46'%3E%3Crect width='28' height='28' fill='white'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E" title="Verified Badge Icon" alt="Verified Badge Icon">`;
    let name_html_larger = `<span efaz-verified-badge-addon="true" role="button" tabindex="0" replicate-badge-addon-prompt="${json["id"]}_true" data-rblx-verified-badge-icon="" data-rblx-badge-icon="true" class="jss292"><img class="verified-badge-icon-group-shout-rendered" src="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28' fill='none'%3E%3Cg clip-path='url(%23clip0_8_46)'%3E%3Crect x='5.88818' width='22.89' height='22.89' transform='rotate(15 5.88818 0)' fill='%230066FF'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M20.543 8.7508L20.549 8.7568C21.15 9.3578 21.15 10.3318 20.549 10.9328L11.817 19.6648L7.45 15.2968C6.85 14.6958 6.85 13.7218 7.45 13.1218L7.457 13.1148C8.058 12.5138 9.031 12.5138 9.633 13.1148L11.817 15.2998L18.367 8.7508C18.968 8.1498 19.942 8.1498 20.543 8.7508Z' fill='white'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_8_46'%3E%3Crect width='28' height='28' fill='white'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E" title="Verified Badge Icon" alt="Verified Badge Icon"></span>`;
    let name_side_html = `<img efaz-verified-badge-addon="true" src="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28' fill='none'%3E%3Cg clip-path='url(%23clip0_8_46)'%3E%3Crect x='5.88818' width='22.89' height='22.89' transform='rotate(15 5.88818 0)' fill='%230066FF'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M20.543 8.7508L20.549 8.7568C21.15 9.3578 21.15 10.3318 20.549 10.9328L11.817 19.6648L7.45 15.2968C6.85 14.6958 6.85 13.7218 7.45 13.1218L7.457 13.1148C8.058 12.5138 9.031 12.5138 9.633 13.1148L11.817 15.2998L18.367 8.7508C18.968 8.1498 19.942 8.1498 20.543 8.7508Z' fill='white'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_8_46'%3E%3Crect width='28' height='28' fill='white'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E" title="Verified Badge Icon" alt="Verified Badge Icon" style="margin-left: 2px;width: 12px;height: 12px; background: none !important;">`;
    let name_side_real_html = `<img efaz-verified-badge-addon="true" src="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28' fill='none'%3E%3Cg clip-path='url(%23clip0_8_46)'%3E%3Crect x='5.88818' width='22.89' height='22.89' transform='rotate(15 5.88818 0)' fill='%230066FF'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M20.543 8.7508L20.549 8.7568C21.15 9.3578 21.15 10.3318 20.549 10.9328L11.817 19.6648L7.45 15.2968C6.85 14.6958 6.85 13.7218 7.45 13.1218L7.457 13.1148C8.058 12.5138 9.031 12.5138 9.633 13.1148L11.817 15.2998L18.367 8.7508C18.968 8.1498 19.942 8.1498 20.543 8.7508Z' fill='white'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_8_46'%3E%3Crect width='28' height='28' fill='white'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E" title="Verified Badge Icon" alt="Verified Badge Icon" style="margin-left: 2px;width: 18px;height: 18px; background: none !important;">`;
    let prompt_html = `<div efaz-verified-badge-addon="true" role="dialog" id="fake_verified_badge"><div class="modal-backdrop in"></div><div role="dialog" tabindex="-1" class="in modal" style="display: block;"><div class="modal-window modal-sm modal-dialog"><div class="modal-content" role="document"><div class="modal-header"><button type="button" class="close" title="close" onclick="document.getElementById('fake_verified_badge').remove()"><span class="icon-close"></span></button><h4 class="modal-title">Verified Badge Add-on</h4></div><div class="modal-body"><div><div><span role="button" tabindex="0" data-rblx-verified-badge-icon="" data-rblx-badge-icon="true" class="hz-centered-badge-container"><img class=" jss272" src="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28' fill='none'%3E%3Cg clip-path='url(%23clip0_8_46)'%3E%3Crect x='5.88818' width='22.89' height='22.89' transform='rotate(15 5.88818 0)' fill='%23FF4B00'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M20.543 8.7508L20.549 8.7568C21.15 9.3578 21.15 10.3318 20.549 10.9328L11.817 19.6648L7.45 15.2968C6.85 14.6958 6.85 13.7218 7.45 13.1218L7.457 13.1148C8.058 12.5138 9.031 12.5138 9.633 13.1148L11.817 15.2998L18.367 8.7508C18.968 8.1498 19.942 8.1498 20.543 8.7508Z' fill='white'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_8_46'%3E%3Crect width='28' height='28' fill='white'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E" title="Verified Badge" alt="Verified Badge"></span></div><div>${getTran("dev_efaz_verified_badge_add_on_badgeIdentification1")}</div></div></div><div class="modal-footer"><div class="loading"></div><div class="modal-buttons"><button type="button" class="modal-button btn-primary-md btn-min-width" onclick="window.location.replace('https://en.help.roblox.com/hc/en-us/articles/7997207259156')">Learn More</button><button type="button" class="modal-button btn-control-md btn-min-width" onclick="document.getElementById('fake_verified_badge').remove()">Close</button></div></div></div></div></div></div>`;
    let efaz_approved_prompt_html = `<div efaz-verified-badge-addon="true" role="dialog" id="fake_verified_badge"><div class="modal-backdrop in"></div><div role="dialog" tabindex="-1" class="in modal" style="display: block;"><div class="modal-window modal-sm modal-dialog"><div class="modal-content" role="document"><div class="modal-header"><button type="button" class="close" title="close" onclick="document.getElementById('fake_verified_badge').remove()"><span class="icon-close"></span></button><h4 class="modal-title">Verified Badge Add-on</h4></div><div class="modal-body"><div><div><span role="button" tabindex="0" data-rblx-verified-badge-icon="" data-rblx-badge-icon="true" class="hz-centered-badge-container"><img class=" jss272" src="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28' fill='none'%3E%3Cg clip-path='url(%23clip0_8_46)'%3E%3Crect x='5.88818' width='22.89' height='22.89' transform='rotate(15 5.88818 0)' fill='%23FF4B00'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M20.543 8.7508L20.549 8.7568C21.15 9.3578 21.15 10.3318 20.549 10.9328L11.817 19.6648L7.45 15.2968C6.85 14.6958 6.85 13.7218 7.45 13.1218L7.457 13.1148C8.058 12.5138 9.031 12.5138 9.633 13.1148L11.817 15.2998L18.367 8.7508C18.968 8.1498 19.942 8.1498 20.543 8.7508Z' fill='white'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_8_46'%3E%3Crect width='28' height='28' fill='white'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E" title="Verified Badge" alt="Verified Badge"></span></div><div>${getTran("dev_efaz_verified_badge_add_on_badgeIdentification2")}</div></div></div><div class="modal-footer"><div class="loading"></div><div class="modal-buttons"><button type="button" class="modal-button btn-primary-md btn-min-width" onclick="window.location.replace('https://en.help.roblox.com/hc/en-us/articles/7997207259156')">Learn More</button><button type="button" class="modal-button btn-control-md btn-min-width" onclick="document.getElementById('fake_verified_badge').remove()">Close</button></div></div></div></div></div></div>`;
    let user_approved_prompt_html = `<div efaz-verified-badge-addon="true" role="dialog" id="fake_verified_badge"><div class="modal-backdrop in"></div><div role="dialog" tabindex="-1" class="in modal" style="display: block;"><div class="modal-window modal-sm modal-dialog"><div class="modal-content" role="document"><div class="modal-header"><button type="button" class="close" title="close" onclick="document.getElementById('fake_verified_badge').remove()"><span class="icon-close"></span></button><h4 class="modal-title">Verified Badge Add-on</h4></div><div class="modal-body"><div><div><span role="button" tabindex="0" data-rblx-verified-badge-icon="" data-rblx-badge-icon="true" class="hz-centered-badge-container"><img class=" jss272" src="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28' fill='none'%3E%3Cg clip-path='url(%23clip0_8_46)'%3E%3Crect x='5.88818' width='22.89' height='22.89' transform='rotate(15 5.88818 0)' fill='%230066FF'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M20.543 8.7508L20.549 8.7568C21.15 9.3578 21.15 10.3318 20.549 10.9328L11.817 19.6648L7.45 15.2968C6.85 14.6958 6.85 13.7218 7.45 13.1218L7.457 13.1148C8.058 12.5138 9.031 12.5138 9.633 13.1148L11.817 15.2998L18.367 8.7508C18.968 8.1498 19.942 8.1498 20.543 8.7508Z' fill='white'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_8_46'%3E%3Crect width='28' height='28' fill='white'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E" title="Verified Badge" alt="Verified Badge"></span></div><div>${getTran("dev_efaz_verified_badge_add_on_badgeIdentification3")}</div></div></div><div class="modal-footer"><div class="loading"></div><div class="modal-buttons"><button type="button" class="modal-button btn-primary-md btn-min-width" onclick="window.location.replace('https://en.help.roblox.com/hc/en-us/articles/7997207259156')">Learn More</button><button type="button" class="modal-button btn-control-md btn-min-width" onclick="document.getElementById('fake_verified_badge').remove()">Close</button></div></div></div></div></div></div>`;
    let game_html = `<span efaz-verified-badge-addon="true" role="button" tabindex="0" replicate-badge-addon-prompt="${json["id"]}_true" data-rblx-verified-badge-icon="" data-rblx-badge-icon="true" class="jss4"><img class="verified-badge-icon-experience-creator" style="margin-left: 4px;width: 16px;height: 16px;" src="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28' fill='none'%3E%3Cg clip-path='url(%23clip0_8_46)'%3E%3Crect x='5.88818' width='22.89' height='22.89' transform='rotate(15 5.88818 0)' fill='%230066FF'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M20.543 8.7508L20.549 8.7568C21.15 9.3578 21.15 10.3318 20.549 10.9328L11.817 19.6648L7.45 15.2968C6.85 14.6958 6.85 13.7218 7.45 13.1218L7.457 13.1148C8.058 12.5138 9.031 12.5138 9.633 13.1148L11.817 15.2998L18.367 8.7508C18.968 8.1498 19.942 8.1498 20.543 8.7508Z' fill='white'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_8_46'%3E%3Crect width='28' height='28' fill='white'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E" title="Verified Badge Icon" alt="Verified Badge Icon"></span>`;
    let name_small_html = `<span><span efaz-verified-badge-addon="true" role="button" tabindex="0" data-rblx-verified-badge-icon="" replicate-badge-addon-prompt="${json["id"]}_true" data-rblx-badge-icon="true" class="jss22"><img class="verified-badge-icon-member-card-rendered" src="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28' fill='none'%3E%3Cg clip-path='url(%23clip0_8_46)'%3E%3Crect x='5.88818' width='22.89' height='22.89' transform='rotate(15 5.88818 0)' fill='%230066FF'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M20.543 8.7508L20.549 8.7568C21.15 9.3578 21.15 10.3318 20.549 10.9328L11.817 19.6648L7.45 15.2968C6.85 14.6958 6.85 13.7218 7.45 13.1218L7.457 13.1148C8.058 12.5138 9.031 12.5138 9.633 13.1148L11.817 15.2998L18.367 8.7508C18.968 8.1498 19.942 8.1498 20.543 8.7508Z' fill='white'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_8_46'%3E%3Crect width='28' height='28' fill='white'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E" title="Verified Badge Icon" alt="Verified Badge Icon"></span></span>`;
    let group_name_verified_html = `<span efaz-verified-badge-addon="true" role="button" tabindex="0" data-rblx-verified-badge-icon="" replicate-badge-addon-prompt="${json["id"]}_true" data-rblx-badge-icon="true" class="jss250"><img class="verified-badge-icon-group-name-rendered" src="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28' fill='none'%3E%3Cg clip-path='url(%23clip0_8_46)'%3E%3Crect x='5.88818' width='22.89' height='22.89' transform='rotate(15 5.88818 0)' fill='%230066FF'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M20.543 8.7508L20.549 8.7568C21.15 9.3578 21.15 10.3318 20.549 10.9328L11.817 19.6648L7.45 15.2968C6.85 14.6958 6.85 13.7218 7.45 13.1218L7.457 13.1148C8.058 12.5138 9.031 12.5138 9.633 13.1148L11.817 15.2998L18.367 8.7508C18.968 8.1498 19.942 8.1498 20.543 8.7508Z' fill='white'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_8_46'%3E%3Crect width='28' height='28' fill='white'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E" title="Verified Badge Icon" alt="Verified Badge Icon"></span>`;
    let group_owner_name_html = `<span><span efaz-verified-badge-addon="true" role="button" tabindex="0" data-rblx-verified-badge-icon="" replicate-badge-addon-prompt="${json["id"]}_true" data-rblx-badge-icon="true" class="verified-badge-icon-group-owner-container"><img class="verified-badge-icon-group-owner-rendered" style="margin-left: 4px; width: 16px; height: 16px;" src="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28' fill='none'%3E%3Cg clip-path='url(%23clip0_8_46)'%3E%3Crect x='5.88818' width='22.89' height='22.89' transform='rotate(15 5.88818 0)' fill='%230066FF'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M20.543 8.7508L20.549 8.7568C21.15 9.3578 21.15 10.3318 20.549 10.9328L11.817 19.6648L7.45 15.2968C6.85 14.6958 6.85 13.7218 7.45 13.1218L7.457 13.1148C8.058 12.5138 9.031 12.5138 9.633 13.1148L11.817 15.2998L18.367 8.7508C18.968 8.1498 19.942 8.1498 20.543 8.7508Z' fill='white'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_8_46'%3E%3Crect width='28' height='28' fill='white'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E" title="Verified Badge Icon" alt="Verified Badge Icon"></span></span>`;
    let reseller_html = `<span><span efaz-verified-badge-addon="true" role="button" tabindex="0" data-rblx-verified-badge-icon="" replicate-badge-addon-prompt="${json["id"]}_true" data-rblx-badge-icon="true" class="jss22"><img class="verified-badge-icon-item-resellers-rendered" src="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28' fill='none'%3E%3Cg clip-path='url(%23clip0_8_46)'%3E%3Crect x='5.88818' width='22.89' height='22.89' transform='rotate(15 5.88818 0)' fill='%230066FF'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M20.543 8.7508L20.549 8.7568C21.15 9.3578 21.15 10.3318 20.549 10.9328L11.817 19.6648L7.45 15.2968C6.85 14.6958 6.85 13.7218 7.45 13.1218L7.457 13.1148C8.058 12.5138 9.031 12.5138 9.633 13.1148L11.817 15.2998L18.367 8.7508C18.968 8.1498 19.942 8.1498 20.543 8.7508Z' fill='white'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_8_46'%3E%3Crect width='28' height='28' fill='white'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E" title="Verified Badge Icon" alt="Verified Badge Icon"></span></span>`;
    let friends_scroll_html = `<div class="friend-tile-verified-badge"><div class="friend-tile-spacer"></div><span role="button" tabindex="0" efaz-verified-badge-addon="true" data-rblx-verified-badge-icon="" data-rblx-badge-icon="true" class="verified-badge jss40" style="margin-top: -2px;"><img class=" jss38" src="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28' fill='none'%3E%3Cg clip-path='url(%23clip0_8_46)'%3E%3Crect x='5.88818' width='22.89' height='22.89' transform='rotate(15 5.88818 0)' fill='%230066FF'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M20.543 8.7508L20.549 8.7568C21.15 9.3578 21.15 10.3318 20.549 10.9328L11.817 19.6648L7.45 15.2968C6.85 14.6958 6.85 13.7218 7.45 13.1218L7.457 13.1148C8.058 12.5138 9.031 12.5138 9.633 13.1148L11.817 15.2998L18.367 8.7508C18.968 8.1498 19.942 8.1498 20.543 8.7508Z' fill='white'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_8_46'%3E%3Crect width='28' height='28' fill='white'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E" title="Verified Badge Icon" alt="Verified Badge Icon"></span></div>`;
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
        ];
    }
    return cache_html[json["id"]];
}
function vIconPlaced(html) { return html.includes("data-rblx-badge-icon") || html.includes("replicate-badge-addon-prompt") || html.includes("Verified Badge Icon"); }
function getIfLinkIsGroup(link) { return link && link.includes("/groups/") || link.includes("/communities/"); }
function getIfLinkIsUserProfile(link) { return link && link.includes("/users/") && link.includes("/profile"); }
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
                                logMessage(err.message);
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
                        warn(`Error with getting approved users: ${err}`);
                        return null;
                    }
                });
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
                                if (broken_context == true) { return { "accepted": false }; }
                                try {
                                    async function run(allowed_groups) {
                                        if (!(typeof (allowed_groups["group_ownership"]) == "object")) { allowed_groups["group_ownership"] = {}; }
                                        let group_keys = Object.keys(allowed_groups["group_ownership"]);
                                        let changes_made = false;
                                        await loopThroughArrayAsync(group_keys, async (_, key) => {
                                            if (allowed_groups["group_ownership"][key] && allowed_groups["group_ownership"][key]["owner"] == userId && allowed_groups["group_ownership"][key]["accepted"] == false) { allowed_groups["group_ownership"][key]["accepted"] = true; changes_made = true; }
                                        });
                                        if (changes_made == true) {
                                            chrome.storage.local.set(allowed_groups).then(() => {
                                                logMessage("Saved to chrome storage!");
                                                group_scan = false;
                                                if (allowed_groups["group_ownership"][id] == false) {
                                                    return { "accepted": false };
                                                } else { return allowed_groups["group_ownership"][id]; }
                                            });
                                        }

                                        if (typeof (allowed_groups["group_ownership"][id]) == "object") {
                                            if (appr_efazdev_user[allowed_groups["group_ownership"][id]["owner"]] && (!(allowed_groups["group_ownership"][id]["owner"] == userId))) {
                                                return { "accepted": false };
                                            } else if (appr_user_users[allowed_groups["group_ownership"][id]["owner"]] && (!(allowed_groups["group_ownership"][id]["owner"] == userId))) {
                                                return { "accepted": false };
                                            } else { return allowed_groups["group_ownership"][id]; }
                                        } else if (allowed_groups["group_ownership"][id] == false) {
                                            return { "accepted": false };
                                        } else if (allowed_groups["group_ownership"] && ((!(allowed_groups["group_ownership"][id])) && allowed_groups["group_ownership"][`scan_${userId}`] == true)) {
                                            return { "accepted": false };
                                        } else {
                                            if (onlycached == true) {
                                                return { "accepted": false };
                                            } else {
                                                if (group_scan == true) {
                                                    return { "accepted": false };
                                                } else {
                                                    group_scan = true;
                                                    if (group_data["temp_group_info"]) {
                                                        if (typeof (allowed_groups["group_ownership"][id]) == "object") {
                                                            if (appr_efazdev_user[allowed_groups["group_ownership"][id]["owner"]] && (!(allowed_groups["group_ownership"][id]["owner"] == userId))) {
                                                                return { "accepted": false };
                                                            } else if (appr_user_users[allowed_groups["group_ownership"][id]["owner"]] && (!(allowed_groups["group_ownership"][id]["owner"] == userId))) {
                                                                return { "accepted": false };
                                                            } else { return allowed_groups["group_ownership"][id]; }
                                                        } else if (allowed_groups["group_ownership"][id] == false) {
                                                            return { "accepted": false };
                                                        } else if (allowed_groups["group_ownership"] && ((!(allowed_groups["group_ownership"][id])) && allowed_groups["group_ownership"][`scan_${userId}`] == true)) {
                                                            return { "accepted": false };
                                                        } else { return { "accepted": false }; }
                                                    } else {
                                                        return fetch(`https://groups.roblox.com/v1/users/${userId}/groups/roles?includeLocked=true&includeNotificationPreferences=true`, { "mode": "cors", "credentials": "include" }).then(grou_res => {
                                                            if (grou_res.ok) { return grou_res.json(); }
                                                        }).then(async (grou_resjson) => {
                                                            if (grou_resjson) {
                                                                if (grou_resjson["data"]) {
                                                                    group_data["temp_group_info"] = {};
                                                                    allowed_groups["group_ownership"][`scan_${userId}`] = true;
                                                                    await loopThroughArrayAsync(grou_resjson["data"], async (_, grou_json) => {
                                                                        grou_json = grou_json["group"];
                                                                        if (grou_json["owner"] && grou_json["owner"]["userId"] == userId) {
                                                                            grou_json["accepted"] = true;
                                                                            allowed_groups["group_ownership"][grou_json["id"]] = {
                                                                                "accepted": grou_json["accepted"],
                                                                                "name": grou_json["name"],
                                                                                "id": grou_json["id"],
                                                                                "owner": grou_json["owner"]["userId"],
                                                                            };
                                                                        } else {
                                                                            if (grou_json["owner"]) {
                                                                                grou_json["accepted"] = false;
                                                                                allowed_groups["group_ownership"][grou_json["id"]] = {
                                                                                    "accepted": grou_json["accepted"],
                                                                                    "name": grou_json["name"],
                                                                                    "id": grou_json["id"],
                                                                                    "owner": grou_json["owner"]["userId"],
                                                                                };
                                                                            }
                                                                        }
                                                                        group_data["temp_group_info"][grou_json["id"]] = allowed_groups["group_ownership"][grou_json["id"]];
                                                                    });

                                                                    if (!(allowed_groups["group_ownership"][id])) {
                                                                        let user_approved_keys = Object.keys(appr_user_users);
                                                                        if (user_approved_keys) {
                                                                            await loopThroughArrayAsync(user_approved_keys, async (_, ke) => {
                                                                                let info = appr_user_users[ke];
                                                                                if (info["approve_groups"]) {
                                                                                    if (info["approve_groups"].includes(id)) {
                                                                                        allowed_groups["group_ownership"][id] = {
                                                                                            "accepted": true,
                                                                                            "id": id,
                                                                                            "owner": info["id"],
                                                                                            "name": info["approve_groups"][id]["name"],
                                                                                        };
                                                                                        group_data["temp_group_info"][id] = allowed_groups["group_ownership"][id];
                                                                                    }
                                                                                }
                                                                            });
                                                                        }

                                                                        let efazdev_approved_keys = Object.keys(appr_efazdev_user);
                                                                        if (efazdev_approved_keys) {
                                                                            await loopThroughArrayAsync(efazdev_approved_keys, async (_, ke) => {
                                                                                let info = appr_efazdev_user[ke];
                                                                                if (info["approve_groups"]) {
                                                                                    if (info["approve_groups"].includes(id)) {
                                                                                        allowed_groups["group_ownership"][id] = {
                                                                                            "accepted": true,
                                                                                            "id": id,
                                                                                            "owner": info["id"],
                                                                                            "name": info["approve_groups"][id]["name"],
                                                                                        };
                                                                                        group_data["temp_group_info"][id] = allowed_groups["group_ownership"][id];
                                                                                    }
                                                                                }
                                                                            });
                                                                        }
                                                                    }

                                                                    return chrome.storage.local.set(allowed_groups).then(() => {
                                                                        logMessage("Saved to chrome storage!");
                                                                        group_scan = false;
                                                                        if (allowed_groups["group_ownership"][id] == false) {
                                                                            return { "accepted": false };
                                                                        } else if (allowed_groups["group_ownership"][id]) {
                                                                            return allowed_groups["group_ownership"][id];
                                                                        } else { return { "accepted": false }; }
                                                                    });
                                                                } else { return { "accepted": false }; }
                                                            } else { return { "accepted": false }; }
                                                        });
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    if (cache_groups) {
                                        return await run(cache_groups);
                                    } else {
                                        cache_groups = {};
                                        return await chrome.storage.local.get("group_ownership").then(async (allowed_groups) => {
                                            cache_groups = allowed_groups;
                                            return await run(cache_groups);
                                        }).catch(err => {
                                            cache_groups = null;
                                        });
                                    }
                                } catch (err) {
                                    if (err.toString().includes("Extension context")) {
                                        broken_context = true;
                                        warn("Extension context is suspected to be broken. Error: " + err.toString());
                                        return { "accepted": false };
                                    } else {
                                        warn(`Error with getting approved group: ${err}`);
                                        return { "accepted": false };
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
                                let list_item = document.querySelectorAll(`span[replicate-badge-addon-prompt="${userId}_true"]`);
                                if (list_item.length > 0) {
                                    loopThroughArray(list_item, (_, verified_badge_contain) => {
                                        verified_badge_contain.setAttribute("replicate-badge-addon-prompt", "false");
                                        verified_badge_contain.addEventListener("click", promptMessage);
                                    });
                                }
                                list_item = null;
                            }
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
                                ".text-overflow.age-bracket-label-username.font-caption-header",
                                ".text-name",
                                ".text-name.text-overflow",
                                ".creator-name.text-link",
                                ".groups-list-item",
                                ".MuiLink-underlineHover.web-blox-css-mui-94v26k",
                                ".text-name.name",
                                ".list-item.member.ng-scope",
                                ".text-label-medium.content-emphasis.ng-binding.ng-scope",
                                ".avatar-card-name.text-lead.text-overflow.ng-binding.ng-scope",
                                ".creator-name.text-link",
                                ".avatar-name.text-overflow.ng-binding",
                                ".text-name.username.ng-binding",
                                ".text-overflow.avatar-name",
                                ".text-overflow.game-card-name.ng-binding",
                                ".ng-binding.slide-item-name.text-overflow.groups.font-title",
                                ".paired-name.message-summary-username.positionAboveLink.font-header-2.ng-scope",
                                ".paired-name.text-name.username-container.font-header-2",
                                ".gap-xxsmall.flex > .icon-filled-premium",
                                "#profile-header-title-container-name",
                                ".rbx-private-owner"
                            ].join(", ");
                            async function handle_container(usr_con) {
                                /* Checks */
                                if (enabled == false) { return; }

                                /* Named Containers */
                                async function named_container() {
                                    let main_header = usr_con;
                                    if (getIfLinkIsUserProfile(window.location.pathname) && getIfLinkIsUser(window.location.pathname, userId.toString())) {
                                        if (usr_con.matches(".profile-name.text-overflow")) {
                                            if (main_header.offsetParent && main_header.offsetParent.getAttribute("class") == "header-title") {
                                                if (vIconPlaced(main_header.offsetParent.innerHTML)) { return; }
                                                if (main_header.offsetParent.innerHTML.includes(displayName)) {
                                                    main_header.offsetParent.appendChild(generateDOMElement(profile_html));
                                                }
                                            } else if (main_header.parentElement && main_header.parentElement.getAttribute("class") == "header-title") {
                                                if (vIconPlaced(main_header.parentElement.innerHTML)) { return; }
                                                if (main_header.parentElement.innerHTML.includes(displayName)) {
                                                    main_header.parentElement.appendChild(generateDOMElement(profile_html));
                                                }
                                            } else if (main_header.parentElement && main_header.parentElement.parentElement && main_header.parentElement.parentElement.getAttribute("class") == "header-title") {
                                                if (vIconPlaced(main_header.parentElement.parentElement.innerHTML)) { return; }
                                                if (main_header.parentElement.parentElement.innerHTML.includes(displayName)) {
                                                    main_header.parentElement.parentElement.appendChild(generateDOMElement(profile_html));
                                                }
                                            }
                                        } else if (usr_con.matches(".profile-header-title-container") || usr_con.matches("#profile-header-title-container-name")) {
                                            if (vIconPlaced(main_header.innerHTML)) { return; }
                                            if (main_header.innerHTML.includes(displayName)) {
                                                let s = generateDOMElement(profile2_html);
                                                s.children[0].style = "margin-left: 6px;";
                                                main_header.appendChild(s);
                                            }
                                        } else if (usr_con.matches(".profile-content > .info > .names > h1")) {
                                            if (vIconPlaced(main_header.innerHTML)) { return; }
                                            if (main_header.innerHTML.includes(displayName)) {
                                                let s = generateDOMElement(profile2_html.replace("28", "18").replace("28", "18"));
                                                s.children[0].style = "height: 18px; width: 18px; margin-left: 4px;";
                                                main_header.appendChild(s);
                                            }
                                        } else if (usr_con.matches(".premium-badge-right-aligned, .profile-content > .info > .names > h1 > .premium-badge-icon")) {
                                            if (main_header && (main_header.getAttribute("class") == "premium-badge-right-aligned" || main_header.getAttribute("class") == "premium-badge-icon")) {
                                                main_header.remove();
                                            }
                                        } else if (usr_con.matches(".profile-header-premium-badge") || usr_con.matches(".gap-xxsmall.flex > .icon-filled-premium")) {
                                            if (main_header) {
                                                main_header.remove();
                                            }
                                        }
                                    }
                                    if (usr_con.matches(".header-caption > .header-names > h1.profile-name")) {
                                        if (vIconPlaced(main_header.innerHTML)) { return; }
                                        if (main_header.innerHTML.includes(displayName)) {
                                            let s = generateDOMElement(profile2_html.replace("28", "18").replace("28", "18"));
                                            s.children[0].style = "height: 18px; width: 18px; margin-left: 4px;";
                                            main_header.appendChild(s);
                                        }
                                    } else if (usr_con.matches(".header-caption > .header-names > h1.profile-name > .premium-badge-icon")) {
                                        if (main_header && (main_header.getAttribute("class") == "premium-badge-right-aligned" || main_header.getAttribute("class") == "premium-badge-icon")) {
                                            main_header.remove();
                                        }
                                    } else if (usr_con.matches(".font-header-2.dynamic-ellipsis-item")) {
                                        if ((usr_con.outerHTML.includes(displayName) || usr_con.outerHTML.includes(username)) && usr_con.parentElement && usr_con.parentElement.href) {
                                            if (getIfLinkIsUserProfile(usr_con.parentElement.href) && getIfLinkIsUser(usr_con.parentElement.href, userId.toString())) {
                                                if (vIconPlaced(usr_con.outerHTML)) { return; }
                                                usr_con.innerHTML = `${usr_con.innerHTML} ${name_side_real_html}`;
                                            }
                                        }
                                    } else if (usr_con.matches(".user-name-container")) {
                                        if (usr_con.innerHTML.includes(displayName)) {
                                            if (vIconPlaced(usr_con.innerHTML)) { return; }
                                            if (usr_con.getAttribute("class") == "dynamic-ellipsis-item user-name-container text-link") {
                                                usr_con.innerHTML = `${usr_con.innerHTML} ${name_html.replace("width='28'", "width='14'").replace("height='28'", "height='14'")}`;
                                            } else {
                                                usr_con.innerHTML = `${usr_con.innerHTML} ${name_html}`;
                                            }
                                        }
                                    }
                                }

                                /* Unnamed Containers */
                                async function unnamed_container() {
                                    if (usr_con.matches(".friends-carousel-tile-labels")) {
                                        if (usr_con.href && usr_con.getAttribute("class") == "friends-carousel-tile-labels") {
                                            let userIdd = usr_con.href.match(/[0-9]+/)[0];
                                            if (userId == userIdd) {
                                                if (usr_con.children[0] && usr_con.children[0].children[0]) {
                                                    if (vIconPlaced(usr_con.children[0].children[0].outerHTML)) { return; }
                                                    usr_con.children[0].children[0].innerHTML = `${usr_con.children[0].children[0].innerHTML} ${genVIcon(friends_scroll_html, null, 28, 28, null, 16, 16).replace(`width='28'`, `width='16'`).replace(`height='28'`, `height='16'`)}`;
                                                }
                                            }
                                        }
                                    } else if (usr_con.matches(".text-link.friend-link.ng-isolate-scope")) {
                                        if (usr_con.href && usr_con.getAttribute("class") == "text-link friend-link ng-isolate-scope") {
                                            let userIdd = usr_con.href.match(/[0-9]+/)[0];
                                            if (userId == userIdd) {
                                                if (usr_con.innerHTML.includes('class="hide"') && usr_con.innerHTML.includes(displayName)) {
                                                    if (usr_con.children[1]) {
                                                        if (!(user_checkmark_color == "%230066ff" || user_checkmark_color == "%230066FF")) {  // User's selected color
                                                            usr_con.children[1].innerHTML = usr_con.children[1].innerHTML.replaceAll(`class="hide"`, "").replaceAll(`%230066FF`, user_checkmark_color);
                                                        } else if (appr_efazdev_user[userId] && appr_efazdev_user[userId]["hexColor"]) { // If the main user has selected the default, has EfazDev Approved Users enabled, and there's a color attached to the approved user.
                                                            let hex_color = appr_efazdev_user[userId]["hexColor"];
                                                            hex_color = hex_color.replace("#", "%23");
                                                            usr_con.children[1].innerHTML = usr_con.children[1].innerHTML.replaceAll(`class="hide"`, "").replaceAll(`%230066FF`, hex_color);
                                                        } else if (appr_user_users[userId] && appr_user_users[userId]["hexColor"]) { // If the main user has selected the default, has EfazDev Approved Users enabled, and there's a color attached to the approved user.
                                                            let hex_color = appr_user_users[userId]["hexColor"];
                                                            hex_color = hex_color.replace("#", "%23");
                                                            usr_con.children[1].innerHTML = usr_con.children[1].innerHTML.replaceAll(`class="hide"`, "").replaceAll(`%230066FF`, hex_color);
                                                        } else {
                                                            usr_con.children[1].innerHTML = usr_con.children[1].innerHTML.replaceAll(`class="hide"`, "");
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    } else if (usr_con.matches(".text-overflow.avatar-name.ng-binding.ng-scope")) {
                                        if (usr_con.outerHTML.includes(displayName) && usr_con.getAttribute("class") == "text-overflow avatar-name ng-binding ng-scope") {
                                            let unamec_10 = document.querySelectorAll(".text-overflow.avatar-card-label.ng-binding.ng-scope");
                                            if (unamec_10.length > 0) {
                                                await loopThroughArrayAsync(unamec_10, async (_, usr_con_2) => {
                                                    if (usr_con.offsetParent == usr_con_2.offsetParent) {
                                                        if (usr_con_2.textContent == `@${username}`) {
                                                            if (!(usr_con.parentElement)) { return; }
                                                            if (vIconPlaced(usr_con.parentElement.outerHTML)) { return; }
                                                            usr_con.outerHTML = `${usr_con.outerHTML} ${game_html}`;
                                                        }
                                                    }
                                                });
                                            }
                                            unamec_10 = null;
                                        }
                                    } else if (usr_con.matches(".transactions-title-with-input > a")) {
                                        if (usr_con.innerHTML.includes(displayName) && getIfLinkIsUser(usr_con.href, userId)) {
                                            if (vIconPlaced(usr_con.parentElement.outerHTML)) { return; }
                                            usr_con.outerHTML = `${usr_con.outerHTML} ${genVIcon(name_side_html, 2, 12, 12, 0, 20, 20)}`;
                                        }
                                    } else if (usr_con.matches(".avatar-name.text-overflow.ng-binding")) {
                                        if (usr_con.outerHTML.includes(displayName) && usr_con.getAttribute("class") == "avatar-name text-overflow ng-binding") {
                                            if (usr_con.parentElement.parentElement.children[1].outerHTML.includes(username_at)) {
                                                if (!(usr_con.parentElement)) { return; }
                                                if (!(usr_con.parentElement.parentElement)) { return; }
                                                if (vIconPlaced(usr_con.parentElement.parentElement.parentElement.outerHTML)) { return; }
                                                usr_con.outerHTML = `${usr_con.outerHTML} ${name_small_html}`;
                                            }
                                        }
                                    } else if (usr_con.matches(".text-name.name.ng-binding")) {
                                        if (usr_con.outerHTML.includes(displayName) && usr_con.getAttribute("class") == "text-name name ng-binding") {
                                            if (!(usr_con.parentElement)) { return; }
                                            if (vIconPlaced(usr_con.parentElement.outerHTML)) { return; }
                                            usr_con.outerHTML = `${usr_con.outerHTML} ${genVIcon(name_side_html, 2, 12, 12, 4, 16, 16)}`;
                                        }
                                    } else if (usr_con.matches(".text-overflow.age-bracket-label-username.font-caption-header")) {
                                        if (usr_con.outerHTML.includes(displayName) && usr_con.getAttribute("class") == "text-overflow age-bracket-label-username font-caption-header") {
                                            if (!(usr_con.parentElement)) { return; }
                                            if (vIconPlaced(usr_con.parentElement.outerHTML)) { return; }
                                            usr_con.outerHTML = `${usr_con.outerHTML} ${name_side_html.replace("margin-left: 2px;width: 12px;height: 12px; background: none !important;", "margin-right: 6px; margin-left: -2px; width: 14px; height: 14px; background: none !important;")}`;
                                        }
                                    } else if (usr_con.matches(".text-name")) {
                                        if (usr_con.matches(".text-name.text-overflow")) {
                                            if (usr_con.outerHTML.includes(username_at) && usr_con.getAttribute("class") == "text-name text-overflow") {
                                                if (!(usr_con.parentElement)) { return; }
                                                if (vIconPlaced(usr_con.parentElement.outerHTML)) { return; }
                                                usr_con.outerHTML = `${usr_con.outerHTML}${game_html}`;
                                            } else if (include_groups == true) {
                                                if (usr_con.href && getIfLinkIsGroup(usr_con.href)) {
                                                    let group_id = usr_con.href.match(/[0-9]+/)[0];
                                                    await approvedGroup(group_id).then((info) => {
                                                        if (info["accepted"] == true && usr_con.getAttribute("class") == "text-name text-overflow") {
                                                            if (usr_con.outerHTML.includes(info["name"])) {
                                                                if (!(usr_con.parentElement)) { return; }
                                                                if (vIconPlaced(usr_con.parentElement.outerHTML)) { return; }
                                                                usr_con.outerHTML = `${usr_con.outerHTML}${game_html}`;
                                                            }
                                                        }
                                                    });
                                                }
                                            }
                                        } else {
                                            if (!(usr_con.parentElement)) { return; }
                                            if (usr_con.parentElement.outerHTML.includes(username) && usr_con.parentElement.outerHTML.includes(userId) && usr_con.getAttribute("class") == "text-name") {
                                                if (vIconPlaced(usr_con.parentElement.parentElement.outerHTML)) { return; }
                                                usr_con.parentElement.outerHTML = `${usr_con.parentElement.outerHTML}${genVIcon(game_html, 4, null, null, 2, null, null)}`;
                                            } else if (include_groups == true) {
                                                if (usr_con.href && getIfLinkIsGroup(usr_con.href)) {
                                                    let group_id = usr_con.href.match(/[0-9]+/)[0];
                                                    await approvedGroup(group_id).then((info) => {
                                                        if (info["accepted"] == true && usr_con.getAttribute("class") == "text-name") {
                                                            if (!(usr_con.parentElement)) { return; }
                                                            if (!(usr_con.parentElement.parentElement)) { return; }
                                                            if (usr_con.parentElement.outerHTML.includes(info["name"])) {
                                                                if (vIconPlaced(usr_con.parentElement.parentElement.outerHTML)) { return; }
                                                                usr_con.parentElement.outerHTML = `${usr_con.parentElement.outerHTML}${genVIcon(game_html, 4, null, null, 2, null, null)}`;
                                                            }
                                                        }
                                                    });
                                                }
                                            }
                                        }
                                    } else if (usr_con.matches(".creator-name.text-link")) {
                                        if (usr_con.outerHTML.includes(username_at) && usr_con.getAttribute("class") == "creator-name text-link") {
                                            if (!(usr_con.parentElement)) { return; }
                                            if (vIconPlaced(usr_con.parentElement.outerHTML)) { return; }
                                            usr_con.outerHTML = `${usr_con.outerHTML} ${genVIcon(name_side_html, 2, null, null, -1)}`;
                                        }
                                        if (include_groups == true) {
                                            if (usr_con.getAttribute("class") == "creator-name text-link" && usr_con.href && getIfLinkIsGroup(usr_con.href)) {
                                                let group_id = usr_con.href.match(/[0-9]+/)[0];
                                                await approvedGroup(group_id).then((info) => {
                                                    if (info["accepted"] == true && usr_con.getAttribute("class") == "creator-name text-link" && usr_con.outerHTML.includes(info["name"])) {
                                                        if (!(usr_con.parentElement)) { return; }
                                                        if (vIconPlaced(usr_con.parentElement.outerHTML)) { return; }
                                                        usr_con.outerHTML = `${usr_con.outerHTML} ${genVIcon(name_side_html, 2, null, null, -1)}`;
                                                    }
                                                });
                                            }
                                        }
                                    }
                                }

                                /* Sector A: Group Handler */
                                async function sector_a() {
                                    if (getIfLinkIsGroup(window.location.pathname)) {
                                        let identified_id = window.location.pathname.match(/[0-9]+/);
                                        if (identified_id && identified_id[0] && document.querySelector(".MuiLink-underlineHover.web-blox-css-mui-94v26k") && settings && settings["groupsIncluded"] == true) {
                                            if (usr_con.matches(".groups-list-item")) {
                                                if (usr_con.children[1] && usr_con.children[1].children[0] && usr_con.children[1].children[0].children[0] && usr_con.children[1].children[0].children[0].children[0] && usr_con.href) {
                                                    let group_id = usr_con.href.match(/[0-9]+/)[0];
                                                    if (group_id) {
                                                        await approvedGroup(group_id).then(async (info) => {
                                                            if (info["accepted"] == true) {
                                                                usr_con = usr_con.children[1].children[0].children[0].children[0];
                                                                if (vIconPlaced(usr_con.innerHTML)) {
                                                                    return;
                                                                }
                                                                usr_con.innerHTML = `${usr_con.innerHTML} ${genVIcon(name_side_html, 2, 12, 12, 2, 16, 16)}`;
                                                            }
                                                        });
                                                    }
                                                }
                                            }
                                            await approvedGroup(identified_id[0]).then(async (info) => {
                                                if (info["accepted"] == true) {
                                                    if (usr_con.matches(".MuiLink-underlineHover.web-blox-css-mui-94v26k")) {
                                                        if (usr_con.innerHTML.includes(displayName) && getIfLinkIsUserProfile(usr_con.href) && getIfLinkIsUser(usr_con.href, userId.toString())) {
                                                            if (!(usr_con.parentElement)) { return; }
                                                            if (!(vIconPlaced(usr_con.parentElement.innerHTML))) {
                                                                usr_con.outerHTML = `${usr_con.outerHTML}${group_owner_name_html}`;
                                                            }
                                                            if (settings && settings["groupsIncluded"] == true) {
                                                                let group_name = document.querySelectorAll(".profile-header-details-community-name.text-heading-large");
                                                                if (group_name.length > 0) {
                                                                    await loopThroughArrayAsync(group_name, async (_, usr_con) => {
                                                                        if (vIconPlaced(usr_con.innerHTML)) {
                                                                            return;
                                                                        }
                                                                        usr_con.innerHTML = `${usr_con.innerHTML}${group_name_verified_html}`;
                                                                    });
                                                                }
                                                                group_name = null;
                                                            }
                                                        }
                                                    }
                                                }
                                            });
                                            if (usr_con.matches(".text-name.name")) {
                                                if (usr_con.getAttribute("class") == "text-name name" && usr_con.innerHTML.includes(displayName) && getIfLinkIsUserProfile(usr_con.href) && getIfLinkIsUser(usr_con.href, userId.toString())) {
                                                    if (vIconPlaced(usr_con.parentElement.outerHTML)) { return; }
                                                    usr_con.outerHTML = `${usr_con.outerHTML} ${genVIcon(name_side_html, 2, 12, 12, 6, 16, 16)}`;
                                                }
                                            } else if (usr_con.matches(".list-item.member.ng-scope")) {
                                                if (usr_con && usr_con.children[0] && usr_con.children[0].children[0] && getIfLinkIsUserProfile(usr_con.children[0].children[0].href) && getIfLinkIsUser(usr_con.children[0].children[0].href, userId.toString())) {
                                                    if (usr_con.children[0] && usr_con.children[0].children[2] && usr_con.children[0].children[2].children[0] && usr_con.children[0].children[2].children[0].children[0]) {
                                                        if (vIconPlaced(usr_con.children[0].children[2].children[0].innerHTML)) { return; }
                                                        usr_con.children[0].children[2].children[0].children[0].innerHTML = `${usr_con.children[0].children[2].children[0].children[0].innerHTML} ${genVIcon(name_side_html, 2, 12, 12, 0, 16, 16)}`;
                                                    }
                                                }
                                            } else if (usr_con.matches(".text-label-medium.content-emphasis.ng-binding.ng-scope")) {
                                                if (usr_con.outerHTML.includes(displayName) && usr_con.getAttribute("class") == "text-label-medium content-emphasis ng-binding ng-scope" && getIfLinkIsUserProfile(usr_con.href) && getIfLinkIsUser(usr_con.href, userId.toString())) {
                                                    if (vIconPlaced(usr_con.innerHTML)) { return; }
                                                    usr_con.innerHTML = `${usr_con.innerHTML} ${genVIcon(name_side_html, 2, 12, 12, 0, 16, 16)}`;
                                                }
                                            } else if (usr_con.matches(".avatar-card-name.text-lead.text-overflow.ng-binding.ng-scope")) {
                                                if (usr_con.innerHTML.includes(displayName) && getIfLinkIsUserProfile(usr_con.href) && getIfLinkIsUser(usr_con.href, userId.toString())) {
                                                    if (vIconPlaced(usr_con.parentElement.innerHTML)) {
                                                        return;
                                                    }
                                                    usr_con.innerHTML = `${usr_con.innerHTML} ${genVIcon(name_side_html, 2, 12, 12, -1, 16, 16)}`;
                                                }
                                            }
                                        }
                                    }
                                }

                                /* Sector B: Creator Names */
                                async function sector_b() {
                                    if (usr_con.matches(".creator-name.text-link")) {
                                        if (usr_con.outerHTML.includes(username_at) && usr_con.getAttribute("class") == "creator-name text-link") {
                                            if (!(usr_con.parentElement)) { return; }
                                            if (vIconPlaced(usr_con.parentElement.outerHTML)) { return; }
                                            usr_con.outerHTML = `${usr_con.outerHTML} ${genVIcon(name_side_html, 2, null, null, -1)}`;
                                        }
                                        if (include_groups == true) {
                                            if (usr_con.getAttribute("class") == "creator-name text-link") {
                                                if (usr_con.href && getIfLinkIsGroup(usr_con.href)) {
                                                    let group_id = usr_con.href.match(/[0-9]+/)[0];
                                                    await approvedGroup(group_id).then((info) => {
                                                        if (info["accepted"] == true) {
                                                            if (usr_con.getAttribute("class") == "creator-name text-link") {
                                                                if (usr_con.outerHTML.includes(info["name"])) {
                                                                    if (!(usr_con.parentElement)) { return; }
                                                                    if (vIconPlaced(usr_con.parentElement.outerHTML)) { return; }
                                                                    usr_con.outerHTML = `${usr_con.outerHTML} ${genVIcon(name_side_html, 2, null, null, -1)}`;
                                                                }
                                                            }
                                                        }
                                                    });
                                                }
                                            }
                                        }
                                    } else if (usr_con.matches(".avatar-name.text-overflow.ng-binding")) {
                                        if (usr_con.matches(".text-overflow.avatar-name.ng-binding.ng-scope")) {
                                            if (usr_con.outerHTML.includes(displayName) && usr_con.getAttribute("class") == "text-overflow avatar-name ng-binding ng-scope") {
                                                let unamec_9 = document.querySelectorAll(".text-overflow.avatar-card-label.ng-binding.ng-scope");
                                                if (unamec_9.length > 0) {
                                                    await loopThroughArrayAsync(unamec_9, async (_, usr_con_2) => {
                                                        if (usr_con.offsetParent == usr_con_2.offsetParent) {
                                                            if (usr_con_2.textContent == `@${username}`) {
                                                                if (!(usr_con.parentElement)) { return; }
                                                                if (vIconPlaced(usr_con.parentElement.outerHTML)) { return; }
                                                                usr_con.outerHTML = `${usr_con.outerHTML} ${game_html}`;
                                                            }
                                                        }
                                                    });
                                                }
                                            }
                                        } else {
                                            if (usr_con.outerHTML.includes(displayName) && usr_con.getAttribute("class") == "avatar-name text-overflow ng-binding") {
                                                if (usr_con.parentElement.parentElement.children[1].outerHTML.includes(username_at)) {
                                                    if (!(usr_con.parentElement)) { return; }
                                                    if (!(usr_con.parentElement.parentElement)) { return; }
                                                    if (!(usr_con.parentElement.parentElement.parentElement)) { return; }
                                                    if (vIconPlaced(usr_con.parentElement.parentElement.parentElement.outerHTML)) { return; }
                                                    usr_con.outerHTML = `${usr_con.outerHTML} ${name_small_html}`;
                                                }
                                            }
                                        }
                                    }
                                }

                                /* Sector C: Avatar Cards */
                                async function sector_c() {
                                    if (usr_con.matches(".avatar-name.text-overflow.ng-binding")) {
                                        if (usr_con.outerHTML.includes(displayName) && usr_con.getAttribute("class") == "avatar-name text-overflow ng-binding") {
                                            if (usr_con.parentElement.parentElement.children[1].outerHTML.includes(username_at)) {
                                                if (!(usr_con.parentElement)) { return; }
                                                if (!(usr_con.parentElement.parentElement)) { return; }
                                                if (!(usr_con.parentElement.parentElement.parentElement)) { return; }
                                                if (vIconPlaced(usr_con.parentElement.parentElement.parentElement.outerHTML)) { return; }
                                                usr_con.outerHTML = `${usr_con.outerHTML} ${name_small_html}`;
                                            }
                                        }
                                    }
                                }

                                /* Sector D: Resellers */
                                async function sector_d() {
                                    if (usr_con.matches(".text-name.username.ng-binding")) {
                                        if (usr_con.outerHTML.includes(username) && usr_con.getAttribute("class") == "text-name username ng-binding") {
                                            if (!(usr_con.parentElement)) { return; }
                                            if (vIconPlaced(usr_con.parentElement.outerHTML)) { return; }
                                            usr_con.outerHTML = `${usr_con.outerHTML} ${reseller_html}`;
                                        }
                                    }
                                }

                                /* Sector E: More Avatar Cards */
                                async function sector_e() {
                                    if (usr_con.matches(".text-overflow.avatar-name")) {
                                        if (usr_con && usr_con.outerHTML.includes(displayName) && getIfLinkIsUserProfile(usr_con.href) && getIfLinkIsUser(usr_con.href, userId.toString()) && usr_con.getAttribute("class") == "text-overflow avatar-name") {
                                            if (!(usr_con.parentElement)) { return; }
                                            if (vIconPlaced(usr_con.parentElement.outerHTML)) { return; }
                                            usr_con.outerHTML = `${usr_con.outerHTML} ${game_html}`;
                                        }
                                    }
                                }

                                /* Sector F: Game Cards */
                                async function sector_f() {
                                    if (include_groups == true) {
                                        if (usr_con.matches(".text-overflow.game-card-name.ng-binding")) {
                                            if (usr_con.getAttribute("class") == "text-overflow game-card-name ng-binding") {
                                                if (usr_con.parentElement.parentElement.href && getIfLinkIsGroup(usr_con.parentElement.parentElement.href)) {
                                                    let group_id = usr_con.parentElement.parentElement.href.match(/[0-9]+/)[0];
                                                    await approvedGroup(group_id, true).then((info) => {
                                                        if (info["accepted"] == true) {
                                                            if (usr_con.getAttribute("class") == "text-overflow game-card-name ng-binding") {
                                                                if (usr_con.outerHTML.includes(info["name"])) {
                                                                    if (!(usr_con.parentElement)) { return; }
                                                                    if (vIconPlaced(usr_con.parentElement.outerHTML)) { return; }
                                                                    usr_con.outerHTML = `${usr_con.outerHTML} ${genVIcon(name_side_html, 2, 12, 12, 4, 16, 16)}`;
                                                                }
                                                            }
                                                        }
                                                    });
                                                }
                                            }
                                        } else if (usr_con.matches(".ng-binding.slide-item-name.text-overflow.groups.font-title")) {
                                            if (usr_con.getAttribute("class") == "ng-binding slide-item-name text-overflow groups font-title") {
                                                if (usr_con.parentElement.href && getIfLinkIsGroup(usr_con.parentElement.href)) {
                                                    let group_id = usr_con.parentElement.href.match(/[0-9]+/)[0];
                                                    await approvedGroup(group_id, true).then((info) => {
                                                        if (info["accepted"] == true) {
                                                            if (usr_con.getAttribute("class") == "ng-binding slide-item-name text-overflow groups font-title") {
                                                                if (usr_con.innerHTML.includes(info["name"])) {
                                                                    if (!(usr_con.parentElement)) { return; }
                                                                    if (vIconPlaced(usr_con.parentElement.outerHTML)) { return; }
                                                                    usr_con.innerHTML = `${usr_con.innerHTML} ${genVIcon(name_side_html, 2, 12, 12, 0, 28, 28)}`;
                                                                }
                                                            }
                                                        }
                                                    });
                                                }
                                            }
                                        }
                                    }
                                }

                                /* Sector G: Messages */
                                async function sector_g() {
                                    if (usr_con.matches(".paired-name.message-summary-username.positionAboveLink.font-header-2.ng-scope")) {
                                        if (usr_con.children[0] && usr_con.getAttribute("class") == "paired-name message-summary-username positionAboveLink font-header-2 ng-scope") {
                                            if (vIconPlaced(usr_con.children[0].outerHTML)) { return; }
                                            if (usr_con.innerHTML.includes(username_at)) {
                                                usr_con.children[0].innerHTML = `${usr_con.children[0].innerHTML}${game_html}`;
                                            }
                                        }
                                    } else if (usr_con.matches(".paired-name.text-name.username-container.font-header-2")) {
                                        if (usr_con.children[0] && usr_con.getAttribute("class") == "paired-name text-name username-container font-header-2") {
                                            if (vIconPlaced(usr_con.children[0].outerHTML)) { return; }
                                            if (usr_con.innerHTML.includes(username_at)) {
                                                usr_con.children[0].innerHTML = `${usr_con.children[0].innerHTML}${game_html}`;
                                            }
                                        }
                                    }
                                }

                                /* Sector H: More Names */
                                async function sector_h() {
                                    if (usr_con.matches(".text-name")) {
                                        if (!(usr_con.parentElement)) { return; }
                                        if (usr_con.parentElement.outerHTML.includes(username) && usr_con.parentElement.outerHTML.includes(userId) && usr_con.getAttribute("class") == "text-name") {
                                            if (vIconPlaced(usr_con.parentElement.parentElement.outerHTML)) { return; }
                                            usr_con.parentElement.outerHTML = `${usr_con.parentElement.outerHTML}${genVIcon(game_html, 4, null, null, 2, null, null)}`;
                                        } else if (include_groups == true) {
                                            if (usr_con.href && getIfLinkIsGroup(usr_con.href)) {
                                                let group_id = usr_con.href.match(/[0-9]+/)[0];
                                                await approvedGroup(group_id).then((info) => {
                                                    if (info["accepted"] == true && usr_con.getAttribute("class") == "text-name") {
                                                        if (!(usr_con.parentElement)) { return; }
                                                        if (!(usr_con.parentElement.parentElement)) { return; }
                                                        if (usr_con.parentElement.outerHTML.includes(info["name"])) {
                                                            if (vIconPlaced(usr_con.parentElement.parentElement.outerHTML)) { return; }
                                                            usr_con.parentElement.outerHTML = `${usr_con.parentElement.outerHTML}${genVIcon(game_html, 4, null, null, 2, null, null)}`;
                                                        }
                                                    }
                                                });
                                            }
                                        }
                                    } else if (usr_con.matches(".rbx-private-owner")) {
                                        if (!(usr_con.children && usr_con.children[1])) { return; }
                                        if (!(usr_con.children[1].children[0])) { return; }
                                        if (!(usr_con.children[1].children[0].children[1])) { return; }
                                        if (usr_con.children[1].href && getIfLinkIsUserProfile(usr_con.children[1].href) && getIfLinkIsUser(usr_con.children[1].href, userId.toString()) && usr_con.getAttribute("class") == "rbx-private-owner") {
                                            if (vIconPlaced(usr_con.children[1].children[0].children[1].innerHTML)) { return; }
                                            usr_con.children[1].children[0].children[1].innerHTML = genVIcon(game_html, 4, null, null, 1, null, null);
                                        }
                                    }
                                }

                                /* Run All Sectors and Prompt Handling */
                                await named_container();
                                await unnamed_container();
                                await sector_a();
                                await sector_b();
                                await sector_c();
                                await sector_d();
                                await sector_e();
                                await sector_f();
                                await sector_g();
                                await sector_h();
                                addPromptButtonInput();
                            }

                            /* Load Groups */
                            approvedGroup(1, true)

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
        await getUserData("*", true).then(json => {
            if (json && json["id"]) {
                scanUser(json["id"], true);
            }
        }).catch(err => {
            warn(err);
            if (allow_messages == true) alert("We couldn't apply the verified badge due to an error! Sorry!");
        });
        timeout(async function () {
            if (settings["verifiedBadgeBetweenAccounts"] == true) {
                await getUserData("*", true).then((json) => {
                    if (json && json["id"]) {
                        chrome.storage.local.get("user_verification").then(async (stored_user_data) => {
                            if (stored_user_data["user_verification"]) {
                                let ids = Object.keys(stored_user_data["user_verification"]);
                                await loopThroughArrayAsync(ids, async (_, user_id) => {
                                    if (!(user_id == json["id"])) { scanUser(user_id, false); }
                                });
                            }
                        });
                    }
                }).catch(err => {
                    warn(err);
                    if (allow_messages == true) alert("We couldn't apply the verified badge due to an error! Sorry!");
                });
            }
            if (settings["useCustomApprovedBadgesByUser"] == true) {
                await getUserData("*", true).then((json) => {
                    if (json && json["id"]) {
                        chrome.storage.local.get("user_verification").then(async (stored_user_data) => {
                            if (stored_user_data["user_verification"]) {
                                let ids = Object.keys(appr_user_users);
                                await loopThroughArrayAsync(ids, async (_, user_id) => {
                                    let approved_user_info = appr_user_users[user_id];
                                    if (!(approved_user_info["id"] == json["id"].toString())) { scanUser(approved_user_info["id"], false); }
                                });
                            }
                        });
                    }
                }).catch(err => {
                    warn(err);
                    if (allow_messages == true) alert("We couldn't apply the verified badge due to an error! Sorry!");
                });
            }
            if (settings["allowEfazDevApprovedBadges"] == true) {
                await getUserData("*", true).then((json) => {
                    if (json && json["id"]) {
                        chrome.storage.local.get("user_verification").then(async (stored_user_data) => {
                            if (stored_user_data["user_verification"]) {
                                let ids = Object.keys(appr_efazdev_user);
                                await loopThroughArrayAsync(ids, async (_, user_id) => {
                                    let approved_user_info = appr_efazdev_user[user_id];
                                    if (!(approved_user_info["id"] == json["id"].toString())) { scanUser(approved_user_info["id"], false); }
                                });
                            }
                        });
                    }
                }).catch(err => {
                    warn(err);
                    if (allow_messages == true) alert("We couldn't apply the verified badge due to an error! Sorry!");
                });
            }
        }, 500);
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
    getSettings(storage_key, async function (items) {
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