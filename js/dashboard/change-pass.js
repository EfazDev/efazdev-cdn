EfazForms.get_xcsrf = async function (_) {
    const res = await fetch("https://db.efaz.dev/api/auth/account-xcsrftoken", {
        method: "POST",
        credentials: "include"
    });
    const data = await res.json();
    return data.success == true ? data.token : "";
};
async function main() {
    const res = await fetch("https://db.efaz.dev/api/auth/authenticated", {
        "credentials": "include"
    });
    const data = await res.json();
    if (data.success == true) {
        await EfazForms.loadFormJSONfromURLByAsync("https://db.efaz.dev/forms/dev.efaz.forms.change-password");
    } else {
        window.location.replace("https://db.efaz.dev/login");
    }
}
main();