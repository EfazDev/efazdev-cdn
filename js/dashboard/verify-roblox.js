fetch("https://db.efaz.dev/api/auth/authenticated", {
    'credentials': "include"
}).then(_0x2c1375 => {
    _0x2c1375.json().then(_0x328e41 => {
        if (_0x328e41.success == true) {
            loadFormJSONfromURL("https://db.efaz.dev/forms/dev.efaz.forms.roblox-verification");
        } else {
            window.location.replace("https://db.efaz.dev/login");
        }
    });
});
async function get_xcsrf(_0x51aaf3) {
    return fetch("https://db.efaz.dev/api/auth/account-xcsrftoken", {
        'method': "POST",
        'credentials': "include"
    }).then(_0x36dc26 => {
        return _0x36dc26.json().then(_0x8a555e => {
            return _0x8a555e.success == true ? _0x8a555e.token : '';
        });
    });
}
function on_form_loaded(a) {
    var data = `<p class="footer">Verifying your Roblox account means you agree to Efaz's <a href="https://efaz.dev/tos">Terms of Service</a> and <a href="https://efaz.dev/privacy">Privacy Policy</a> AND Roblox's <a href="https://en.help.roblox.com/hc/en-us/articles/115004647846-Roblox-Terms-of-Use">Terms of Service</a> and <a href="https://en.help.roblox.com/hc/en-us/articles/115004630823-Roblox-Privacy-and-Cookie-Policy">Privacy Policy</a>.</p>`;
    let temp_div = document.createElement("div");
    temp_div.innerHTML = data;
    document.getElementById("main_menu").appendChild(temp_div.children[0]);
    var send_btn = document.getElementById("submit_button");
    let gradient_span = document.createElement("span");
    let send_btn_parent = send_btn.parentNode;
    gradient_span.setAttribute("class", "gradient-border");
    send_btn.parentNode.insertBefore(gradient_span, send_btn);
    gradient_span.appendChild(send_btn);
}