window.onload = function () {
    const _0xb09bd = window.location.search;
    const _0x2ce395 = new URLSearchParams(_0xb09bd);
    const _0x378a4d = _0x2ce395.get('error');
    var _0xda615c = document.getElementById("error_message");
    if (_0x378a4d) {
        _0xda615c.innerHTML = atob(_0x378a4d);
    } else {
        _0xda615c.innerHTML = "No error was given.";
    }
};