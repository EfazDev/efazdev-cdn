window.addEventListener("load", () => {
    var r = document.getElementById("reset_group_cache")
    r.addEventListener("click", () => {
        chrome.storage.local.set({ "group_ownership": {} }, () => {
            alert("Successfully cleared all group cache!")
        });
    })

    var r = document.getElementById("reset_user_cache")
    r.addEventListener("click", () => {
        chrome.storage.local.set({ "user_verification": {} }, () => {
            alert("Successfully cleared all user cache!")
        });
    })
})