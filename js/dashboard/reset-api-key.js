function on_form_loaded(_0x24843b) {
    var _0x2e7068 = {
        UopCh: "main_menu"
    };
    _0x2e7068.hECxP = function (_0xd7e35e, _0xec2628) {
        return _0xd7e35e + _0xec2628;
    };
    var data = "<p class=\"footer\">Resetting your API Key means you agree to Efaz's <a href=\"https://efaz.dev/tos\">Terms of Service</a> and <a href=\"https://efaz.dev/privacy\">Privacy Policy</a>.</p>";
    let temp_div = document.createElement("div");
    temp_div.innerHTML = data;
    document.getElementById("main_menu").appendChild(temp_div.children[0]);
    document.getElementById("main_menu").innerHTML = _0x2e7068.hECxP(document.getElementById("main_menu").innerHTML, _0x2e7068.uUJTW);
}
async function get_xcsrf(_0x54963b) {
    return fetch("https://db.efaz.dev/api/auth/account-xcsrftoken", {
        'credentials': "include",
        'method': 'POST'
    }).then(_0x31c341 => {
        return _0x31c341.json().then(_0xe41818 => {
            return _0xe41818.success == true ? _0xe41818.token : '';
        });
    });
}
window.onload = function () {
    var _0x4d3227 = {
        credentials: "include"
    };
    fetch("https://db.efaz.dev/api/auth/authenticated", _0x4d3227).then(_0x1b9b28 => {
        _0x1b9b28.json().then(_0x53f7d5 => {
            if (_0x53f7d5.success == true) {
                loadFormJSONfromURL("https://db.efaz.dev/forms/dev.efaz.forms.reset-api");
            } else {
                window.location.replace('/');
            }
        });
    });
};