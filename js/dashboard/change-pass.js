fetch("https://db.efaz.dev/api/auth/authenticated", {
    'credentials': 'include'
}).then(_0x32d90c => {
    _0x32d90c.json().then(_0x8e6154 => {
        if (_0x8e6154.success == true) {
            loadFormJSONfromURL("https://db.efaz.dev/forms/dev.efaz.forms.change-password");
        } else {
            window.location.replace("https://db.efaz.dev/login");
        }
    });
});
async function get_xcsrf(_0x53c16e) {
    return fetch("https://db.efaz.dev/api/auth/account-xcsrftoken", {
        'method': "POST",
        'credentials': "include"
    }).then(_0x1ea56c => {
        return _0x1ea56c.json().then(_0x1162c4 => {
            return _0x1162c4.success == true ? _0x1162c4.token : '';
        });
    });
}