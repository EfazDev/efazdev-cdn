const message_list = {
    'FailedValidation': "System has returned an invalid response that the server didn't understand. Verification has failed.",
    'InvalidCode': "The code provided was invalid! Verification has failed.",
    'EmailVerificationNotExist': "You didn't go through the verification process and verification doesn't exist. Verification has failed.",
    'MultipleAccounts': "This email address has another EfazDev account linked to it. Verification has failed."
};
const url_search_params = new URLSearchParams(window.location.search);
const reason = url_search_params.get("reason");
window.addEventListener("load", function () {
    const err_mes_dom = document.getElementById("error_message");
    if (reason) {
        if (message_list[reason]) {
            err_mes_dom.innerHTML = message_list[reason];
        } else {
            err_mes_dom.innerHTML = "Reason given is invalid.";
        }
    } else {
        err_mes_dom.innerHTML = "No error was given.";
    }
});