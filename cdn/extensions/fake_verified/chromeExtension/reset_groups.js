window.addEventListener("load", () => {
    var r = document.getElementById("reset_group_cache")
    r.addEventListener("click", () => {
        chrome.storage.sync.set({ "group_ownership": {} }, () => {
            alert("Successfully cleared all group cache!")
        });
    })
})