/* 

Efaz's Extension Settings Handler
By: EfazDev

thank_you.js:
    - Autofill extension details in the thank_you.html file

*/

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

async function localizeAll(s) {
    if (s) {
        await loopThroughArrayAsync(s, (i, v) => {
            if (typeof (v) == "string") {
                var q = v.replace(/__MSG_(\w+)__/g, function (match, v1) {
                    return v1 ? chrome.i18n.getMessage(v1) : "";
                });
                if (v != q) { s[i] = q; }
            }
        });
        return s;
    } else {
        let objs = document.getElementsByTagName("html");
        loopThroughArray(objs, (_, obj) => {
            var valStrH = obj.innerHTML.toString();
            var valNewH = valStrH.replace(/__MSG_(\w+)__/g, function (match, v1) {
                return v1 ? chrome.i18n.getMessage(v1) : "";
            });
            if (valNewH != valStrH) { obj.innerHTML = valNewH; }
        });
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    await localizeAll();
    var man_json = await localizeAll(chrome.runtime.getManifest());
    var extension_name = man_json["name"];
    var extension_version = man_json["version"];
    var extension_icon = man_json["icons"]["128"];

    function getTran(id) {
        if (!(chrome.i18n.getMessage(id) == "")) {
            return chrome.i18n.getMessage(id);
        }
    }
    document.getElementById("extens_icon").src = extension_icon;
    document.getElementById("extens_name").innerHTML = `${getTran("thanksTitle")} ${extension_name}!`;
    document.getElementById("extens_vers").innerHTML = `${getTran("thanksVersionNum")} v${extension_version}`;
});