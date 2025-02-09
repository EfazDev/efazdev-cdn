/* 

Efaz's Roblox Foundation Color Accents
By: EfazDev
Page: https://www.efaz.dev/roblox-foundation-color-accents

setting_colors.js:
    - Just a simple script that handles extra buttons in the Settings page.

*/

(function () {
    window.addEventListener("load", () => {
        var r = document.getElementById("old_green_color")
        if (r) {
            r.addEventListener("click", () => {
                document.getElementById("color").value = "#56ac72"
            })
        }
    })
})()