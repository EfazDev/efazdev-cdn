EfazForms.get_xcsrf = async function(_) {
    const res = await fetch("https://db.efaz.dev/api/auth/account-xcsrftoken", {
        method: "POST",
        credentials: "include"
    });
    const data = await res.json();
    return data.success == true ? data.token : "";
};
EfazForms.on_form_loaded = async function(_) {
    const data = `<p class="footer">Reporting a problem or suggesting an idea means you agree to Efaz's <a href="https://efaz.dev/tos">Terms of Service</a> and <a href="https://efaz.dev/privacy">Privacy Policy</a>.</p>`;
    const temp_div = document.createElement("div");
    temp_div.innerHTML = data;
    document.getElementById("main_menu").appendChild(temp_div.children[0]);
    const send_btn = document.getElementById("submit_button");
    const gradient_span = document.createElement("span");
    gradient_span.setAttribute("class", "gradient-border");
    send_btn.parentNode.insertBefore(gradient_span, send_btn);
    gradient_span.appendChild(send_btn);
}
async function main() {
    const res = await fetch("https://db.efaz.dev/api/auth/authenticated", {
        "credentials": "include"
    });
    const data = await res.json();
    if (data.success == true) {
        await EfazForms.loadFormJSONfromURLByAsync("https://db.efaz.dev/forms/dev.efaz.forms.report");
    } else {
        window.location.replace("https://db.efaz.dev/login");
    }
}
main();