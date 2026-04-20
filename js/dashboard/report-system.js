fetch("https://db.efaz.dev/api/auth/authenticated", {
    'credentials': 'include'
}).then(_0x32d90c => {
    _0x32d90c.json().then(_0x8e6154 => {
        if (_0x8e6154.success == true) {
            loadFormJSONfromURL("https://db.efaz.dev/forms/dev.efaz.forms.report");
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
function on_form_loaded(a) {
    var data = `<p class="footer">Reporting a problem or suggesting an idea means you agree to Efaz's <a href="https://efaz.dev/tos">Terms of Service</a> and <a href="https://efaz.dev/privacy">Privacy Policy</a>.</p>`;
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