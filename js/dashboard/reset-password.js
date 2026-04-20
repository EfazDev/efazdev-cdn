function on_form_loaded(_0x215750) {
    var data = "<p class=\"footer\">Resetting your Password means you agree to Efaz's <a href=\"https://efaz.dev/tos\">Terms of Service</a> and <a href=\"https://efaz.dev/privacy\">Privacy Policy</a>.</p>";
    let temp_div = document.createElement("div");
    temp_div.innerHTML = data;
    document.getElementById("main_menu").appendChild(temp_div.children[0]);
}
async function get_xcsrf(_0x41bd1a) {
    return fetch("https://db.efaz.dev/api/auth/account-xcsrftoken", {
        'credentials': "include",
        'method': "POST"
    }).then(_0x335601 => {
        return _0x335601.json().then(_0x2e289b => {
            return _0x2e289b.success == true ? _0x2e289b.token : '';
        });
    });
}
window.onload = function () {
    fetch("https://db.efaz.dev/api/auth/authenticated", {
        'credentials': "include"
    }).then(_0x5ee1bd => {
        _0x5ee1bd.json().then(_0x4d2b4b => {
            if (_0x4d2b4b.success == true) {
                loadFormJSONfromURL("https://db.efaz.dev/forms/dev.efaz.forms.reset-password");
            } else {
                window.location.replace('/');
            }
        });
    });
};