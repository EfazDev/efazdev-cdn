fetch("https://db.efaz.dev/api/auth/authenticated", {
    'credentials': "include"
}).then(_0x3b74c1 => {
    _0x3b74c1.json().then(_0x41839c => {
        if (_0x41839c.success == true) {
            loadFormJSONfromURL("https://db.efaz.dev/forms/dev.efaz.forms.email-verification");
        } else {
            window.location.replace("https://db.efaz.dev/login");
        }
    });
});
async function get_xcsrf(_0x289b6e) {
    return fetch("https://db.efaz.dev/api/auth/account-xcsrftoken", {
        'method': "POST",
        'credentials': "include"
    }).then(_0x4f9144 => {
        return _0x4f9144.json().then(_0x49707f => {
            return _0x49707f.success == true ? _0x49707f.token : '';
        });
    });
}
function on_form_loaded(a) {
    var data = `<p class="footer">Verifying your email address means you agree to Efaz's <a href="https://efaz.dev/tos">Terms of Service</a> and <a href="https://efaz.dev/privacy">Privacy Policy</a>.</p>`;
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