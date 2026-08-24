EfazForms.on_form_loaded = async function (_) {
    const data = "<p class=\"footer\">Resetting your Password means you agree to Efaz's <a href=\"https://efaz.dev/tos\">Terms of Service</a> and <a href=\"https://efaz.dev/privacy\">Privacy Policy</a>.</p>";
    const temp_div = document.createElement("div");
    temp_div.innerHTML = data;
    document.getElementById("main_menu").appendChild(temp_div.children[0]);
}
EfazForms.get_xcsrf = async function (_) {
    const res = await fetch("https://db.efaz.dev/api/auth/xcsrftoken", {
        method: "POST",
        credentials: "include"
    });
    const data = await res.json();
    return data.success == true ? data.token : "";
}
async function main() {
    const res = await fetch("https://db.efaz.dev/api/auth/authenticated", {
        "credentials": "include"
    });
    const data = await res.json();
    if (data.success == false) {
        await EfazForms.loadFormJSONfromURLByAsync("https://db.efaz.dev/forms/dev.efaz.forms.reset-password");
    } else {
        window.location.replace("https://db.efaz.dev/login");
    }
}
main();