const task = function () {
    class _0x2aca2e {
        #key;
        #count;
        constructor() {
            this.#key = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (_0x517864) {
                const _0x3afcda = Math.random() * 0x10 | 0x0;
                const _0x17f903 = _0x517864 == 'x' ? _0x3afcda : _0x3afcda & 0x3 | 0x8;
                return _0x17f903.toString(0x10);
            });
            this.#count = 0x1;
        }
        ["get_key"]() {
            return this.#count == 0x1 ? (this.#count = 0x0, this.#key) : null;
        }
        ["validateToken"](_0x5d5677) {
            return _0x5d5677 == this.#key;
        }
    }
    return new _0x2aca2e();
}();
const task_key = task.get_key();
var list = {
    'main': ["main_group", "hide_group_main", true, "Main"]
};
var listArray = [["main_group", "hide_group_main", true, "Main"]];
window.onload = function () {
    fetch("https://db.efaz.dev/api/auth/authenticated", {
        'credentials': "include",
        'headers': {
            'cookie': document.cookie
        }
    }).then(_0x2d9d1a => {
        return _0x2d9d1a.json();
    }).then(_0x3878fb => {
        if (_0x3878fb.success == true) {
            if (_0x3878fb.account_info.verified == true) {
                document.getElementById("title1").innerHTML = "Hello, " + _0x3878fb.account_info.username + " <img src=\"https://cdn.efaz.dev/png/checkmark.png\" height=\"25\" width=\"25\">";
            } else {
                document.getElementById("title1").innerHTML = "Hello, " + _0x3878fb.account_info.username + '';
            }
            fetch("https://db.efaz.dev/api/auth/user-has-efaz-chain", {
                'credentials': "include",
                'headers': {
                    'cookie': document.cookie
                }
            }).then(_0x329b50 => {
                return _0x329b50.json();
            }).then(_0x2c6015 => {
                if (_0x2c6015.success == true) {
                    if (_0x2c6015.owned == true) {
                        document.getElementById('title1').innerHTML = document.getElementById('title1').innerHTML + " <img src=\"https://cdn.efaz.dev/png/efaz_chain.png\" height=\"25\" width=\"25\">!";
                    } else {
                        document.getElementById("title1").innerHTML = document.getElementById("title1").innerHTML + '!';
                    }
                } else {
                    window.location.replace("https://db.efaz.dev/login");
                }
            });
            fetch('https://db.efaz.dev/api/payment/store', {
                'credentials': "include",
                'headers': {
                    'cookie': document.cookie
                }
            }).then(_0x4cfbf6 => {
                return _0x4cfbf6.json();
            }).then(_0x1bb6e5 => {
                if (_0x1bb6e5.success == true) {
                    if (_0x1bb6e5.data.length > 0x0) {
                        var _0x541ac1 = "<button class=\"\" id=\"hide_group_main\" onclick=\"hide_group('main')\">Main</button> ";
                        var _0xbf1509 = 0x0;
                        for (const [_0x18f3d3, _0x38744a] of _0x1bb6e5.data.entries()) {
                            if (_0x38744a.product_name) {
                                let _0x112956 = new Intl.NumberFormat("en-US", {
                                    'style': 'currency',
                                    'currency': "USD"
                                });
                                var _0x4006c5 = _0x38744a.id;
                                var _0xecb490 = _0x38744a.product_name;
                                var _0x38f34c = _0x38744a.description;
                                var _0x426ae2 = _0x112956.format(_0x38744a.price);
                                var _0x305168 = "<group id=\"item_" + _0x4006c5 + "\" style=\"display: none;\">\n                <h2 id=\"item_" + _0x4006c5 + "_title\">" + _0xecb490 + "</h2>\n                <p id=\"item_" + _0x4006c5 + "_description\">" + _0x38f34c + "</p>\n                <m id=\"item_" + _0x4006c5 + "_price\">Price: " + _0x426ae2 + "</m>";
                                if (_0x38744a.owned == false) {
                                    _0x305168 = _0x305168 + ("<button class=\"center\" buy=\"buy_button\" onclick=\"create_session('" + _0x4006c5 + "')\">Buy Now!</button></group>");
                                } else {
                                    _0x305168 = _0x305168 + "<button class=\"center\" buy=\"buy_button\" onclick=\"\">Owned!</button></group>";
                                }
                                var _0x4c5cc2 = "<button class=\"\" id=\"hide_group_" + _0x4006c5 + "\" onclick=\"hide_group('item_" + _0x4006c5 + "')\">" + _0xecb490 + "</button> ";
                                list["item_" + _0x4006c5] = ['item_' + _0x4006c5, 'hide_group_' + _0x4006c5, true, _0xecb490];
                                listArray.push(["item_" + _0x4006c5, "hide_group_" + _0x4006c5, true, _0xecb490]);
                                _0x541ac1 = _0x541ac1 + _0x4c5cc2;
                                document.getElementById("main_menu").innerHTML = document.getElementById("main_menu").innerHTML + _0x305168;
                                _0xbf1509++;
                                if (_0xbf1509 == _0x1bb6e5.data.length) {
                                    document.getElementById('main_menu').innerHTML = document.getElementById('main_menu').innerHTML + "<p id=\"hidegrouplist\"></p>";
                                    document.getElementById('hidegrouplist').innerHTML = _0x541ac1;
                                }
                            }
                        }
                    } else {
                        document.getElementById("main_menu").innerHTML = document.getElementById('main_menu').innerHTML + "<p id=\"hidegrouplist\">No Items Available. :(</p>";
                    }
                } else {
                    window.location.replace("https://db.efaz.dev/login");
                }
            });
        } else {
            window.location.replace("https://db.efaz.dev/login");
        }
    })["catch"](_0x1508b2 => {
        window.location.replace("https://db.efaz.dev/servererror");
    });
};
function hide_group(_0x373b15) {
    for (a_e_q = 0x0; a_e_q < listArray.length; a_e_q++) {
        var _0x5cac20 = listArray[a_e_q];
        document.getElementById(_0x5cac20[0x0]).style = "display: none;";
    }
    if (list[_0x373b15]) {
        var _0x209680 = list[_0x373b15];
        document.getElementById(_0x209680[0x0]).style = '';
        document.getElementById(_0x209680[0x1]).innerHTML = _0x209680[0x3];
    } else {
        console.log("Group Object not found.");
    }
}
async function get_captcha(_0xdb07ad, _0x60d1a4) {
    if (task.validateToken(_0x60d1a4)) {
        await turnstile.render('#invis', {
            'sitekey': "0x4AAAAAAAL7YK_aJBt5iMM6",
            'callback': function (_0x3c350b) {
                _0xdb07ad(["Cloudflare", _0x3c350b]);
            }
        });
    } else {
        return _0xdb07ad(['None', '']);
    }
}
function create_session(_0x156449) {
    document.getElementById("main_menu").style = "display: none;";
    document.getElementById("holdOn").style = '';
    get_captcha(function (_0x4c6742) {
        fetch("https://db.efaz.dev/api/auth/account-xcsrftoken", {
            'method': "POST",
            'credentials': "include"
        }).then(_0x3d8f37 => {
            return _0x3d8f37.json();
        }).then(_0x10d576 => {
            if (_0x10d576.success == true) {
                var _0x51f46b = _0x10d576.token;
                fetch("https://db.efaz.dev/api/payment/generate-session", {
                    'method': "POST",
                    'credentials': "include",
                    'headers': {
                        'X-Csrf-Token': _0x51f46b,
                        'cookie': document.cookie
                    },
                    'body': "{\"c_captcha\": \"" + _0x4c6742[0x1] + "\", \"itemId\": \"" + _0x156449 + "\"}"
                }).then(_0x22bd3d => {
                    return _0x22bd3d.json();
                }).then(_0x5cca81 => {
                    if (_0x5cca81.success == true) {
                        window.location.replace(_0x5cca81.generated_url);
                    } else {
                        window.location.reload();
                    }
                })['catch'](_0x25126f => {
                    window.location.reload();
                });
            }
        })["catch"](_0x141376 => {
            window.location.reload();
        });
    }, task_key);
}