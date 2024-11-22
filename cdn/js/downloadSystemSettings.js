const thanksURL = "https://www.efaz.dev/thanks"
function getDownloadURL() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return "https://api.efaz.dev/api/projects/download/" + folder + "/" + urlParams.get('fileName')
}
async function getIfServerIsActive() {
    return fetch("https://api.efaz.dev")
        .then(res => {
            if (res.ok) {
                return res.json()
            } else {
                return { "success": false }
            }
        })
        .then(new_json => {
            if (new_json["success"] == true) {
                return true
            } else {
                return false
            }
        })
        .catch(err => {
            return false
        })
}