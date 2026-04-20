window.onload = function () {
    var _0x579e0f = {
        'UserIDInvalid': "Roblox failed to authenticate your User ID! Verification has failed.",
        'RobloxSaysCodeInvalid': "Roblox failed to authenticate key given! Verification has failed.",
        'FailedValidation': "Roblox has returned an invalid response that the server didn't understand. Verification has failed.",
        'InvalidCode': "The code provided by Roblox was invalid! Verification has failed.",
        'MultipleAccounts': "This Roblox account has another EfazDev account linked to it. Verification has failed."
    };
    const _0x406e67 = window.location.search;
    const _0x398937 = new URLSearchParams(_0x406e67);
    const _0x321b4d = _0x398937.get('reason');
    var _0x1a7ccd = document.getElementById('error_message');
    if (_0x321b4d) {
        if (_0x579e0f[_0x321b4d]) {
            _0x1a7ccd.innerHTML = _0x579e0f[_0x321b4d];
        } else {
            _0x1a7ccd.innerHTML = "Reason given is invalid.";
        }
    } else {
        _0x1a7ccd.innerHTML = "No error was given.";
    }
};