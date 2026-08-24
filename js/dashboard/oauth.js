const url_search_params = new URLSearchParams(window.location.search);
EfazForms.get_xcsrf = async function (_) {
    const res = await fetch("https://db.efaz.dev/api/auth/account-xcsrftoken", {
        method: "POST",
        credentials: "include"
    });
    const data = await res.json();
    return data.success == true ? data.token : "";
};
EfazForms.on_success_form = async function (res) {
    if (res.fetch_response.redirect) {
        window.location.replace(res.fetch_response.redirect);
    } else {
        window.location.reload();
    }
};
window.addEventListener("load", async function () {
    if (url_search_params.get("oauth_id") && url_search_params.get("redirect_url")) {
        const oauth_id = url_search_params.get('oauth_id');
        try {
            const redirect_url = atob(url_search_params.get("redirect_url"));
            const provided_data = "";
            if (url_search_params.get("data")) {
                provided_data = atob(url_search_params.get("data"));
            }
            const oauth_res = await fetch("https://db.efaz.dev/api/oauth/" + oauth_id + '/details', {
                "method": "POST",
                "headers": {
                    "accept": "application/json",
                    "content-type": "application/json"
                },
                "credentials": "include",
                "body": JSON.stringify({
                    "redirect_url": redirect_url,
                    "data": provided_data
                })
            });
            const oauth_data = await oauth_res.json();
            if (oauth_data.success == false) {
                document.getElementById("error").style = '';
                document.getElementById("main_message1").innerText = oauth_data.message;
                document.getElementById("main_menu").style = "display: none;";
                return;
            }
            await EfazForms.loadFormJSONByAsync(oauth_data.form);
        } catch (err) {
            document.getElementById('error').style = '';
            document.getElementById('main_message1').innerText = "Failed to get redirect url or data.";
            document.getElementById("main_menu").style = "display: none;";
        }
    } else {
        document.getElementById("error").style = '';
        document.getElementById('main_message1').innerText = "Some data was not provided. Please include the required data to load the OAuth application.";
        document.getElementById("main_menu").style = "display: none;";
    }
});