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

    var r = document.getElementById("custom_approved_badges_by_user")
    r.addEventListener('click', async () => {
        try {
            const [fileHandle] = await window.showOpenFilePicker();
            if (fileHandle) {
                const permission = await fileHandle.requestPermission();
                if (permission === "granted") {
                    const file = await fileHandle.getFile();
                    let contents = await file.text();
                    contents = JSON.parse(contents);
                    chrome.storage.local.set({ "user_approved_json": contents }, () => {
                        alert("Successfully fetched and saved approved user JSON!");
                    });
                }
            }
        } catch (error) {
            if (!(error.toString() && error.toString().includes("aborted"))) {
                console.warn(error);
                alert("There was an issue trying to save approved user JSON!")
            }
        }
    });
})