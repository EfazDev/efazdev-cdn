const testingMode = false
var isDownloading = false

function setMessage(message) {
    document.getElementById("message").innerHTML = message
}

function setIsDownloading(toggle) {
    isDownloading = toggle
    const objectButton = document.getElementById("retryButton")
    if (isDownloading == true) {
        objectButton.style.display = "none";
    } else {
        objectButton.style.display = "block";
    }
}

function pageInIframe() {
    return (window.location !== window.parent.location);
}

function download() {
    if (pageInIframe() == true) {
        setMessage("Refused to download: This page is inside an iframe.")
    } else {
        if (isDownloading == false) {
            setIsDownloading(true)
            var url = getDownloadURL()
            console.log("Loaded URL: " + url)

            setMessage("Awaiting server..")
            getIfServerIsActive().then(response => {
                if (response == true) {
                    setMessage("Starting Download..")
                    if (testingMode == false) {
                        const object = document.getElementById("downloadbutton")
                        object.href = url
                        object.click()
                        setIsDownloading(false)
                        setMessage("Download should be started! You'll be redirected soon!")

                        setTimeout(() => {
                            object.href = thanksURL
                            object.click()
                        }, "4000");
                    }
                } else {
                    setMessage("Server may be down. Try again later!")
                    setIsDownloading(false)
                }
            }).catch(err => {
                setMessage("Server may be down. Try again later!")
                setIsDownloading(false)
            })
        }
    }
}

window.onload = download;