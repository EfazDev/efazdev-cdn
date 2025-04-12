/* 

Efaz's Roblox Foundation Color Accents
By: EfazDev
Page: https://www.efaz.dev/roblox-foundation-color-accents

setting_colors.js:
    - Just a simple script that handles extra buttons in the Settings page.

*/

(function () {
    window.addEventListener("load", () => {
        var color_buttons = {
            "red_color": "#ff0000",
            "orange_color": "#ff4b00",
            "yellow_color": "#ffdd00",
            "old_green_color": "#56ac72",
            "lime_color": "#00e900",
            "cyan_color": "#00d5ff",
            "blue_color": "#335FFF",
            "purple_color": "#9000ff",
            "pink_color": "#ff00ff"
        }
        var color_keys = Object.keys(color_buttons)
        for (let i = 0; i < color_keys.length; i++) {
            let color_key = color_keys[i]
            let r = document.getElementById(color_key)
            if (r) {
                r.addEventListener("click", () => {
                    document.getElementById("color").value = color_buttons[color_key]
                })
            }
        }
    })
})()