window.onload = function () {
    var _0xf8f088 = {
        'FailedValidation': "System has returned an invalid response that the server didn't understand. Verification has failed.",
        'InvalidCode': "The code provided was invalid! Verification has failed.",
        'EmailVerificationNotExist': "You didn't go through the verification process and verification doesn't exist. Verification has failed.",
        'MultipleAccounts': "This email address has another EfazDev account linked to it. Verification has failed."
    };
    const _0x2904e3 = window.location.search;
    const _0x52c488 = new URLSearchParams(_0x2904e3);
    const _0x36555a = _0x52c488.get("reason");
    var _0x5a41dc = document.getElementById("error_message");
    if (_0x36555a) {
        if (_0xf8f088[_0x36555a]) {
            _0x5a41dc.innerHTML = _0xf8f088[_0x36555a];
        } else {
            _0x5a41dc.innerHTML = "Reason given is invalid.";
        }
    } else {
        _0x5a41dc.innerHTML = "No error was given.";
    }
};