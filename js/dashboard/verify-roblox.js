async function main() {
    const res = await fetch("https://db.efaz.dev/api/auth/authenticated", {
        "credentials": "include"
    });
    const data = await res.json();
    if (data.success == true) {
        await EfazForms.loadFormJSONfromURLByAsync("https://db.efaz.dev/forms/dev.efaz.forms.roblox-verification");
    } else {
        window.location.replace("https://db.efaz.dev/login");
    }
}
EfazForms.get_xcsrf = async function (_) {
    const res = await fetch("https://db.efaz.dev/api/auth/account-xcsrftoken", {
        method: "POST",
        credentials: "include"
    });
    const data = await res.json();
    return data.success == true ? data.token : "";
}
EfazForms.on_form_loaded = async function (_) {
    const data = `<p class="footer">Verifying your Roblox account means you agree to Efaz's <a href="https://efaz.dev/tos">Terms of Service</a> and <a href="https://efaz.dev/privacy">Privacy Policy</a> AND Roblox's <a href="https://en.help.roblox.com/hc/en-us/articles/115004647846-Roblox-Terms-of-Use">Terms of Service</a> and <a href="https://en.help.roblox.com/hc/en-us/articles/115004630823-Roblox-Privacy-and-Cookie-Policy">Privacy Policy</a>.</p>`;
    const temp_div = document.createElement("div");
    temp_div.innerHTML = data;
    document.getElementById("main_menu").appendChild(temp_div.children[0]);
    const send_btn = document.getElementById("submit_button");
    const gradient_span = document.createElement("span");
    gradient_span.setAttribute("class", "gradient-border");
    send_btn.parentNode.insertBefore(gradient_span, send_btn);
    gradient_span.appendChild(send_btn);
}
main();