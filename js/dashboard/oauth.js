window.onload = function () {
    const _0xaf8e0a = window.location.search;
    const _0x58cb20 = new URLSearchParams(_0xaf8e0a);
    if (_0x58cb20.get("oauth_id") && _0x58cb20.get("redirect_url")) {
        var _0xd5e597 = _0x58cb20.get('oauth_id');
        try {
            var _0x4b2f57 = atob(_0x58cb20.get("redirect_url"));
            var _0x3803dd = '';
            if (_0x58cb20.get("data")) {
                _0x3803dd = atob(_0x58cb20.get("data"));
            }
            fetch("https://db.efaz.dev/api/oauth/" + _0xd5e597 + '/details', {
                'method': "POST",
                'headers': {
                    'accept': "application/json",
                    'content-type': 'application/json'
                },
                "credentials": "include",
                'body': JSON.stringify({
                    'redirect_url': _0x4b2f57,
                    'data': _0x3803dd
                })
            }).then(_0x33e060 => {
                return _0x33e060.json();
            }).then(_0x5b1800 => {
                if (_0x5b1800.success == false) {
                    document.getElementById("error").style = '';
                    document.getElementById("main_message1").innerText = _0x5b1800.message;
                    document.getElementById("main_menu").style = "display: none;";
                } else {
                    loadFormJSON(_0x5b1800.form);
                }
            });
        } catch (_0x372942) {
            document.getElementById('error').style = '';
            document.getElementById('main_message1').innerText = "Failed to get redirect url or data.";
            document.getElementById("main_menu").style = "display: none;";
        }
    } else {
        document.getElementById("error").style = '';
        document.getElementById('main_message1').innerText = "Some data was not provided. Please include the required data to load the OAuth application.";
        document.getElementById("main_menu").style = "display: none;";
    }
};
async function get_xcsrf(_0x2ef6fb) {
    return fetch("https://db.efaz.dev/api/auth/account-xcsrftoken", {
        "credentials": "include",
        'method': "POST"
    }).then(_0x2dce40 => {
        return _0x2dce40.json().then(_0xe16c40 => {
            return _0xe16c40.success == true ? _0xe16c40.token : '';
        });
    });
}
function on_success_form(_0xdbc88c) {
    if (_0xdbc88c.fetch_response.redirect) {
        window.location.replace(_0xdbc88c.fetch_response.redirect);
    } else {
        window.location.reload();
    }
}