/* 

Efaz's Extension Settings Handler
By: EfazDev

thank_you.js:
    - Autofill extension details in the thank_you.html file

*/

async function localizeAll(data) {
    const replacer = (_, v1) => v1 ? chrome.i18n.getMessage(v1) : "";
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
    let node;
    while ((node = walker.nextNode())) {
        const text = node.nodeValue;
        if (text && text.includes("__MSG_")) {
            node.nodeValue = text.replace(/__MSG_(\w+)__/g, replacer);
        }
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    await localizeAll();
    localizeAll();
    
    const man_json = chrome.runtime.getManifest();
    const extension_name = chrome.i18n.getMessage("name") || man_json.name;
    const extension_version = man_json.version;
    const extension_icon = man_json.icons?.["128"] || "";

    const iconEl = document.getElementById("extens_icon");
    if (iconEl && extension_icon) iconEl.src = extension_icon;
    const nameEl = document.getElementById("extens_name");
    if (nameEl) nameEl.innerText = `${getTran("thanksTitle")} ${extension_name}!`;
    const versEl = document.getElementById("extens_vers");
    if (versEl) versEl.innerText = `${getTran("thanksVersionNum")} v${extension_version}`;
});