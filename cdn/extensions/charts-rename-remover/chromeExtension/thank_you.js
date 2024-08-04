/* 

Efaz's Extension Settings Handler
By: EfazDev

thank_you.js:
    - Autofill extension details in the thank_you.html file

*/

document.addEventListener("DOMContentLoaded", () => {
    fetch("manifest.json").then(man_res => {
        return man_res.json()
    }).then(man_json => {
        var extension_name = man_json["name"]
        var extension_version = man_json["version"]
        var extension_icon = man_json["icons"]["128"]

        document.getElementById("extens_icon").src = extension_icon
        document.getElementById("extens_name").innerHTML = `Thank you for installing ${extension_name}!`
        document.getElementById("extens_vers").innerHTML = `Version Number: v${extension_version}`
    })
})