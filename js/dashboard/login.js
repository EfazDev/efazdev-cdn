(() => {
    const url_search_params = new URLSearchParams(window.location.search);
    const redirect_url = url_search_params.get("redirect_url");
    const { startAuthentication } = SimpleWebAuthnBrowser;
    EfazForms.get_xcsrf = async function (_) {
        const res = await fetch("https://db.efaz.dev/api/auth/xcsrftoken", {
            method: "POST",
            credentials: "include"
        });
        const data = await res.json();
        return data.success == true ? data.token : "";
    };
    EfazForms.on_success_form = async function (res) {
        if (res.fetch_response.form) {
            await EfazForms.loadFormJSONByAsync(res.fetch_response.form);
        } else {
            document.cookie = res.fetch_response.cookie;
            if (redirect_url) {
                window.location.replace(atob(redirect_url));
            } else {
                document.cookie = res.fetch_response.cookie;
                window.location.replace('/');
            }
        }
    };
    EfazForms.on_form_loaded = function (_) {
        var data = `<p class="footer" style="font-size: 0.9rem;">Creating an account means you agree to Efaz's <a href="https://efaz.dev/tos">Terms of Service</a> and <a href="https://efaz.dev/privacy">Privacy Policy</a>. Login via Roblox is provided via Roblox's 0Auth Applications. By pressing the button, you'll be redirected to Roblox's website.</p>`;
        let temp_div = document.createElement("div");
        temp_div.innerHTML = data;
        document.getElementById("main_menu").appendChild(temp_div.children[0]);
        var send_btn = document.getElementById("submit_button");
        let gradient_span = document.createElement("span");
        gradient_span.setAttribute("class", "gradient-border");
        send_btn.parentNode.insertBefore(gradient_span, send_btn);
        gradient_span.appendChild(send_btn);
    };
    window.redirect_to_roblox = function() {
        window.location.replace("https://db.efaz.dev/roblox-login");
    }
    async function triggerPasskeyAuthentication() {
        try {

            const resp = await fetch("https://db.efaz.dev/api/auth/generate-passkey-auth-options");
            const jsonResp = await resp.json();
            const options = jsonResp.options;
            const challenge_ticket = jsonResp.challenge_ticket;
            const asseResp = await startAuthentication({ optionsJSON: options });
            const csrfToken = await EfazForms.get_xcsrf();
            const captcha_element = document.getElementById("c_captcha_input");
            while (captcha_element.value === "") {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            const curCaptcha = captcha_element.value;
            const payload = {
                ...asseResp,
                challenge_ticket: challenge_ticket,
                c_captcha: curCaptcha
            };
            const verificationResp = await fetch("https://db.efaz.dev/api/auth/login", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "x-csrf-token": csrfToken
                },
                body: JSON.stringify(payload),
            });
            const verificationJSON = await verificationResp.json();
            if (verificationJSON.verified) {
                markedLoggedIn();
            } else {
                turnstile.reset(captcha_element);
            }
        } catch (error) {
            console.error(error);
        }
    }
    function markedLoggedIn() {
        document.getElementById("main_menu").innerHTML = "<h1 id=\"title1\">Success!</h1><p>Logging into your EfazDev account!</p>";
        if (redirect_url) {
            window.location.replace(atob(redirect_url));
        } else {
            window.location.replace('/');
        }
    }
    function markedFailedLogin(reason) {
        document.getElementById("main_menu").innerHTML = "<h1 id=\"title1\">Oops!</h1><p id=\"error_message\">" + reason + "</p><button class=\"center\" onclick='window.location.replace(\"https://db.efaz.dev\")'>Return back to the home page</button>";
    }
    window.addEventListener("load", async function () {
        if (url_search_params.get("success") == "true") {
            const ticket = url_search_params.get("ticket");
            if (ticket) {
                const ticket_res = await fetch("https://db.efaz.dev/api/auth/redeem-roblox-login-ticket?ticket=" + ticket, {
                    "credentials": "include"
                });
                const ticket_data = await ticket_res.json();
                if (ticket_data.success == true) {
                    const ticket_data_data = ticket_data.data;
                    const ticket_cookie = ticket_data_data.cookie;
                    document.cookie = ticket_cookie;
                    markedLoggedIn();
                } else {
                    markedFailedLogin(ticket_data.message);
                }
            } else {
                markedFailedLogin("Login Ticket is not found.");
            }
        } else if (url_search_params.get("success") == "false") {
            const login_fail_reason = url_search_params.get("reason");
            const reasons_table = {
                "UserIDInvalid": "Roblox failed to authenticate your User ID! Login has failed.",
                "RobloxSaysCodeInvalid": "Roblox failed to authenticate key given! Login has failed.",
                "FailedValidation": "Roblox has returned an invalid response that the server didn't understand. Login has failed.",
                "InvalidCode": "The code provided by Roblox was invalid! Login has failed.",
                "MultipleAccounts": "This Roblox account has multiple EfazDev account linked to it. Login has failed.",
                "AccountNotFound": "No EfazDev accounts were linked to this Roblox account. Login has failed.",
                "AccountTerminated": "This account was terminated. Please ask Efaz for more details! Login has failed."
            };
            if (reasons_table[login_fail_reason]) {
                login_fail_reason = reasons_table[login_fail_reason];
            } else {
                login_fail_reason = "Reason given is invalid. Login has failed.";
            }
            markedFailedLogin(login_fail_reason);
        } else {
            const res = await fetch("https://db.efaz.dev/api/auth/authenticated", {
                "credentials": "include"
            });
            const data = await res.json();
            if (data.success == false) {
                await EfazForms.loadFormJSONfromURLByAsync('https://db.efaz.dev/forms/dev.efaz.forms.login');
            } else {
                window.location.replace("/");
                return;
            }
            triggerPasskeyAuthentication();
        }
    });
})();