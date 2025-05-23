/* 

Efaz's Form System Javascript API

Setup forms via a JSON!
Made by Efaz from efaz.dev!

(Information about this script)
Made by: Efaz from https://www.efaz.dev
Script Version: v1.1.0 Explorer Edition
Type of Code: JavaScript

*/

// Define Variables if not already.
if (!(typeof system_json !== 'undefined')) {
    var system_json = {}
}
if (!(typeof lastLoadedJSON !== 'undefined')) {
    var lastLoadedJSON = {}
}

// Form Variables
var questions = system_json["questions"]
var modes = system_json["modes"]
var selected_mode = system_json["defaultMode"]
var specific_settings = system_json["specific_settings"]

// API Functions
function on_success_form(args) { }
function on_form_loaded(form_json) { }
async function get_xcsrf(args) {
    return null
}

// All Captchas
const task = (function () {
    class Token {
        #key;
        #count;
        constructor() {
            this.#key = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) { const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8); return v.toString(16); })
            this.#count = 1
        }

        get_key() {
            if (this.#count == 1) {
                this.#count = 0
                return this.#key
            } else {
                return null
            }
        }
        validateToken(e) {
            return e == this.#key
        }
    }
    return new Token()
})()
const task_key = task.get_key()

// Google Captcha
var google_captcha_enabled = false
var google_captcha = system_json["googleCaptcha"]

// Cloudflare Captcha
var cloudflare_captcha_enabled = false
var cloudflare_captcha = system_json["cloudflareCaptcha"]
let widget_id = ""

// System Functions
async function getImageFromInput(input) {
    var files = input.files[0];
    if (files) {
        return new Promise((resolve, reject) => {
            var fileReader = new FileReader();
            fileReader.readAsDataURL(files);
            fileReader.onload = function (frEvent) {
                resolve(frEvent.target.result)
            }
        })
    } else {
        return new Promise((resolve, reject) => {
            resolve(null)
        })
    }
}

async function get_values() {
    var new_table = {}
    for (let a = 0; a < questions.length; a++) {
        var valueInfo = questions[a]
        var new_obj = document.getElementById(valueInfo["jsonName"] + "_input")
        if (new_obj.value) {
            if (new_obj.type == "file") {
                await getImageFromInput(new_obj).then(res => {
                    new_table[valueInfo["jsonName"]] = res
                })
            } else {
                new_table[valueInfo["jsonName"]] = new_obj.value
            }
        }
    }
    return new_table
}

async function getModeInfo(mode_name) {
    var new_table = { "success": false }
    for (let a = 0; a < modes.length; a++) {
        var newMode = modes[a]
        if (newMode["name"] == mode_name) {
            return { "success": true, "response": newMode }
        }
    }
    return new_table
}

function refreshVariables() {
    questions = system_json["questions"]
    modes = system_json["modes"]
    selected_mode = system_json["defaultMode"]
    specific_settings = system_json["specific_settings"]
}

function view_main_menu() {
    var obj1 = document.getElementById("main_menu")
    var obj2 = document.getElementById("success")
    var obj3 = document.getElementById("failed")
    var obj4 = document.getElementById("awaiting")

    obj1.style = "display: block;"
    obj2.style = "display: none;"
    obj3.style = "display: none;"
    obj4.style = "display: none;"
}

function returnFromMessageAndClear() {
    loadLastLoadedJSON()
}

function view_success_menu(mode, message) {
    var obj1 = document.getElementById("main_menu")
    var obj2 = document.getElementById("success")
    var obj3 = document.getElementById("failed")
    var obj6 = document.getElementById("awaiting")

    obj1.style = "display: none;"
    obj2.style = "display: block;"
    obj3.style = "display: none;"
    obj6.style = "display: none;"

    var obj4 = document.getElementById("message2")
    var obj5 = document.getElementById("reloadButton")
    if (message == null) {
        message = "No message was given."
    }
    getModeInfo(mode).then(response => {
        if (response["success"] == true) {
            if (response["response"]["thanksMessage"]) {
                obj4.innerHTML = response["response"]["thanksMessage"].replace("{jsonMessage}", message)
            } else {
                obj4.innerHTML = "Thanks for submitting your form!"
            }
            if (response["response"]["showTryAgainOnSuccess"] == false) {
                obj5.style = "display: none;"
            } else {
                obj5.style = "display: block;"
            }
        } else {
            obj4.innerHTML = "Thanks for submitting your form!"
        }
    })
}

function view_error_menu(text) {
    var obj1 = document.getElementById("main_menu")
    var obj2 = document.getElementById("success")
    var obj3 = document.getElementById("failed")
    var obj5 = document.getElementById("awaiting")

    obj1.style = "display: none;"
    obj2.style = "display: none;"
    obj3.style = "display: block;"
    obj5.style = "display: none;"

    var obj4 = document.getElementById("message1")
    obj4.innerHTML = text
}

function view_awaiting_menu() {
    var obj1 = document.getElementById("main_menu")
    var obj2 = document.getElementById("success")
    var obj3 = document.getElementById("failed")
    var obj4 = document.getElementById("awaiting")

    obj1.style = "display: none;"
    obj2.style = "display: none;"
    obj3.style = "display: none;"
    obj4.style = "display: block;"
}

function set_mode(mode) {
    getModeInfo(mode).then(response => {
        if (response["success"] == true) {
            selected_mode = mode
            main_mode_details = response["response"]

            if (system_json["showCurrentMode"] && document.getElementById("current_mode")) {
                var obj1 = document.getElementById("current_mode")
                var obj2 = document.getElementById("sendButton")
                obj1.innerHTML = `Current Mode: ${mode}`

                if (specific_settings["showModeInButtonText"] == false) {
                    obj2.innerHTML = `Send Form!`
                } else {
                    obj2.innerHTML = `Send ${mode}!`
                }

                var questions = system_json["questions"]
                if (specific_settings["showAllQuestionsInAllModes"] == true) {
                    for (let a = 0; a < questions.length; a++) {
                        var main_question = questions[a]
                        if (!(main_question["autofilled"] == true)) {
                            var object = document.getElementById(`${main_question["jsonName"]}_input`)
                            if (object) {
                                if (object.parentNode.tagName == "DIV") {
                                    object.style.display = ""
                                } else {
                                    object.parentNode.style.display = ""
                                }
                            }
                        }
                    }
                } else {
                    for (let a = 0; a < questions.length; a++) {
                        var main_question = questions[a]
                        if (!(main_question["autofilled"] == true)) {
                            var object = document.getElementById(`${main_question["jsonName"]}_input`)
                            if (object) {
                                if (object.parentNode.tagName == "DIV") {
                                    object.style.display = "none"
                                } else {
                                    object.parentNode.style.display = "none"
                                }
                            }

                            for (let b = 0; b < main_mode_details["formatted"].length; b++) {
                                var question_a_details = main_mode_details["formatted"][b]
                                if (question_a_details["jsonName"] == main_question["jsonName"]) {
                                    if (object) {
                                        if (object.parentNode.tagName == "DIV") {
                                            object.style.display = ""
                                        } else {
                                            object.parentNode.style.display = ""
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            } else {
                var obj2 = document.getElementById("sendButton")
                obj2.innerHTML = `Send Form!`
            }
        }
    })
}

async function get_captcha(callback_a, token) {
    if (task.validateToken(token)) {
        if (google_captcha_enabled == true) {
            return grecaptcha.execute(google_captcha["siteKey"], { action: 'validate_captcha' })
                .then(function (token) {
                    callback_a(["Google", token])
                })
        } else if (cloudflare_captcha_enabled == true) {
            await turnstile.render(`#${cloudflare_captcha["jsonName"]}_input`, {
                sitekey: cloudflare_captcha["siteKey"],
                callback: function (token) {
                    callback_a(["Cloudflare", token])
                },
            });
        } else {
            return callback_a(["None", ""])
        }
    } else {
        return callback_a(["None", ""])
    }
}

function getIfResponseIsEmpty(t) {
    if (typeof t == 'string') {
        return t.trim().length === 0
    } else if (typeof t == 'number') {
        return t !== 0
    } else if (typeof t == 'undefined') {
        return true
    }
}

function send_response(verification_key) {
    if (task.validateToken(atob(verification_key))) {
        view_awaiting_menu()
        try {
            function responseToError(err) {
                view_error_menu("Response couldn't be sent due to a client error. View console for specific details.")
                console.log(`
            Error:
            
            ${err.message}
            `)
            }
            get_values().then(values => {
                get_xcsrf(values).then(x_csrf_token => {
                    getModeInfo(selected_mode).then(mode_response => {
                        if (mode_response["success"] == true) {
                            mode_response = mode_response["response"]
                            var new_formated_values = {}
                            var new_api_url = mode_response["api_url"]
                            var listOfKeysProvided = Object.keys(values);
                            var appliedAtSymbol = false

                            var listOfEmptyRequiredVariables = []

                            for (let c = 0; c < listOfKeysProvided.length; c++) {
                                var key = listOfKeysProvided[c]
                                var main_val = values[key]
                                for (let d = 0; d < mode_response["formatted"].length; d++) {
                                    var main_val2 = mode_response["formatted"][d]
                                    if (main_val2["jsonName"] == key) {
                                        if (main_val2["in"] == "Body") {
                                            new_formated_values[key] = main_val
                                        } else if (main_val2["in"] == "URL") {
                                            if (appliedAtSymbol == false) {
                                                new_api_url = new_api_url + `?${main_val2["jsonName"]}=${main_val}`
                                                appliedAtSymbol = true
                                            } else {
                                                new_api_url = new_api_url + `&${main_val2["jsonName"]}=${main_val}`
                                            }
                                        }
                                    }
                                }
                            }

                            for (let e = 0; e < questions.length; e++) {
                                var question = questions[e]
                                if (question["required"] == true) {
                                    if (getIfResponseIsEmpty(new_formated_values[question["jsonName"]])) {
                                        if (mode_response["formatted"]) {
                                            for (let h = 0; h < mode_response["formatted"].length; h++) {
                                                var lista = mode_response["formatted"][h]
                                                if (lista["jsonName"] == question["jsonName"]) {
                                                    listOfEmptyRequiredVariables.push(question["name"])
                                                }
                                            }
                                        } else {
                                            listOfEmptyRequiredVariables.push(question["name"])
                                        }
                                    }
                                }
                            }

                            if (listOfEmptyRequiredVariables.length > 0) {
                                var new_string_g = `${listOfEmptyRequiredVariables[0]}`
                                var remove = false
                                for (let f = 0; f < listOfEmptyRequiredVariables.length + 1; f++) {
                                    if (remove == true) {
                                        if (listOfEmptyRequiredVariables[f]) {
                                            var val_h = listOfEmptyRequiredVariables[f]
                                            new_string_g = new_string_g + `, ${val_h}`
                                        }
                                    } else {
                                        remove = true
                                    }
                                }
                                view_error_menu(`The following questions were filled empty: ${new_string_g}`)
                            } else {
                                get_captcha(captcha_key => {
                                    if (captcha_key[0] == "Google") {
                                        new_formated_values[google_captcha["jsonName"]] = captcha_key[1]
                                    } else if (captcha_key[0] == "Cloudflare") {
                                        new_formated_values[cloudflare_captcha["jsonName"]] = captcha_key[1]
                                    }

                                    var converted_json_string = JSON.stringify(new_formated_values)
                                    try {
                                        if (!(mode_response["type_of_api"] == "POST" || mode_response["type_of_api"] == "PUT" || mode_response["type_of_api"] == "PATCH")) {
                                            mode_response["type_of_api"] = "POST"
                                        }
                                        var include_credentials = "omit"
                                        if (specific_settings["include_cookies"] == true) {
                                            include_credentials = "include"
                                        }
                                        fetch(new_api_url, {
                                            "headers": {
                                                "accept": "application/json",
                                                "accept-language": "en-US,en;q=0.9",
                                                "content-type": "application/json",
                                                "sec-fetch-dest": "empty",
                                                "sec-fetch-mode": "cors",
                                                "sec-fetch-site": "same-origin",
                                                "credentials": include_credentials,
                                                "cookie": document.cookie,
                                                "x-csrf-token": x_csrf_token
                                            },
                                            "referrerPolicy": "strict-origin-when-cross-origin",
                                            "body": converted_json_string,
                                            "method": mode_response["type_of_api"],
                                            "mode": "cors",
                                            "credentials": include_credentials,
                                        }).then(res => {
                                            if (res.ok) {
                                                res.json().then(json => {
                                                    values["fetch_response"] = json
                                                    values["current_form"] = system_json
                                                    if (specific_settings["allow_second_form"] == true) {
                                                        if (json["form"]) {
                                                            loadFormJSON(json["form"])
                                                        } else {
                                                            view_success_menu(selected_mode, json["message"])
                                                            on_success_form(values)
                                                        }
                                                    } else {
                                                        view_success_menu(selected_mode, json["message"])
                                                        on_success_form(values)
                                                    }
                                                })
                                            } else {
                                                res.json().then(json => {
                                                    view_error_menu(json["message"])
                                                })
                                            }
                                        })
                                    } catch (err) {
                                        view_error_menu(err.message)
                                    }
                                }, task_key)
                            }
                        }
                    }).catch(responseToError)
                }).catch(responseToError)
            }).catch(responseToError)
        } catch (err) {
            responseToError(err)
        }
    }
}

function explore() {
    var url_used = document.getElementById("explore_button_input_sys").value
    try {
        loadFormJSONfromURLByAsync(url_used).then((res) => {
            if (res[0]) {
                setTimeout(() => {
                    document.getElementById("exploreButton").innerHTML = "Success!"
                    setTimeout(() => {
                        document.getElementById("exploreButton").innerHTML = "Explore!"
                    }, 2000)
                }, 1000)
            } else {
                document.getElementById("exploreButton").innerHTML = "Request failed to load!"
                setTimeout(() => {
                    document.getElementById("exploreButton").innerHTML = "Explore!"
                }, 2000)
            }
        })
    } catch (err) {
        document.getElementById("exploreButton").innerHTML = "Request failed to load!"
        setTimeout(() => {
            document.getElementById("exploreButton").innerHTML = "Explore!"
        }, 2000)
    }
}

function start_system() {
    refreshVariables()
    var disabled_system = false
    var title = "Error while loading Form JSON. If you're a visitor, please contact the site owner to manage the JSON correctly."
    var icon_url = "https://cdn.efaz.dev/png/logo.png"
    if (system_json["title"] == null) {
        disabled_system = true
    } else {
        title = system_json["title"]
        icon_url = system_json["icon_url"]
    }
    document.body.innerHTML = `
    <top alt="topbar">Enter Form JSON URL: <input placeholder="Enter URL!" class="topbar_loaded_a" type="text" id="explore_button_input_sys">    <button type="button" class="topbar_loaded_b" id="exploreButton" onclick="explore()">Explore!</button></top>
    <div id="main_menu">
        <h1 id="title1">${title}</h1>
    </div>
    <div id="failed" style="display: none;">
        <h1 id="title2">Oops!</h1>
        <p id="message1">{error}</p>
        <br>
        <button type="button" id="returnButton" class="center" onclick="view_main_menu()">Try again!</button>
    </div>
    <div id="awaiting" style="display: none;">
        <h1 id="title2">Hold on!</h1>
        <p id="message1">We are processing your request! Be right back!</p>
    </div>
    <div id="success" style="display: none;">
        <h1 id="title3">Success!</h1>
        <p id="message2">Thanks for submitting your form!</p>
        <br>
        <button type="button" id="reloadButton" class="center" onclick="returnFromMessageAndClear()">Do another!</button>
    </div>
    ` /* Clear all objects inside the body and resets to default usable HTML. */

    if (disabled_system == false) {
        try {
            var main_menu = document.getElementById("main_menu")
            if (!(specific_settings["hideIcon"] == true)) {
                if (specific_settings["resize_logo"]) {
                    var new_html = `<img src="${icon_url}" height="${specific_settings["resize_logo"]["height"]}" width="${specific_settings["resize_logo"]["width"]}" class="center">`
                    main_menu.innerHTML = new_html + main_menu.innerHTML
                } else {
                    var new_html = `<img src="${icon_url}" height="64" width="64" class="center">`
                    main_menu.innerHTML = new_html + main_menu.innerHTML
                }
            }
            if (specific_settings["add_html_slot1"]) {
                main_menu.innerHTML = main_menu.innerHTML + specific_settings["add_html_slot1"]
            }
            for (let a = 0; a < questions.length; a++) {
                var newQuestion = questions[a]
                if (newQuestion["type"] == "Short Response" || newQuestion["type"] == "SR") {
                    var new_html = `<p>${newQuestion["name"]}: <input placeholder="${newQuestion["placeholder"]}" type="text" class="${newQuestion["custom_class"]}" id="${newQuestion["jsonName"]}_input"`
                    if (newQuestion["required"] == true) {
                        new_html = new_html + ` required></input>`
                        if (specific_settings["showRequiredText"] == true) {
                            new_html = new_html + ` <e class="required">*</e>`
                        }
                    } else {
                        new_html = new_html + `></input>`
                    }
                    new_html = new_html + `</p>`
                    main_menu.innerHTML = main_menu.innerHTML + new_html
                } else if (newQuestion["type"] == "Detailed Message" || newQuestion["type"] == "DM") {
                    var new_html = `<p>${newQuestion["name"]}: </p><textarea placeholder="${newQuestion["placeholder"]}" type="text" class="${newQuestion["custom_class"]}" id="${newQuestion["jsonName"]}_input" cols="40" rows="10"`
                    if (newQuestion["required"] == true) {
                        new_html = new_html + ` required></textarea>`
                        if (specific_settings["showRequiredText"] == true) {
                            new_html = new_html + ` <e class="required">(required)</e>`
                        }
                    } else {
                        new_html = new_html + `></textarea>`
                    }
                    main_menu.innerHTML = main_menu.innerHTML + new_html
                } else if (newQuestion["type"] == "Integer" || newQuestion["type"] == "INT") {
                    var new_html = `<p>${newQuestion["name"]}: <input placeholder="${newQuestion["placeholder"]}" type="number" class="${newQuestion["custom_class"]}" id="${newQuestion["jsonName"]}_input"`
                    if (newQuestion["required"] == true) {
                        new_html = new_html + ` required></input>`
                        if (specific_settings["showRequiredText"] == true) {
                            new_html = new_html + ` <e class="required">*</e>`
                        }
                    } else {
                        new_html = new_html + `></input>`
                    }
                    new_html = new_html + `</p>`
                    main_menu.innerHTML = main_menu.innerHTML + new_html
                } else if (newQuestion["type"] == "Email" || newQuestion["type"] == "EMAIL") {
                    var new_html = `<p>${newQuestion["name"]}: <input placeholder="${newQuestion["placeholder"]}" type="email" class="${newQuestion["custom_class"]}" id="${newQuestion["jsonName"]}_input"`
                    if (newQuestion["required"] == true) {
                        new_html = new_html + ` required></input>`
                        if (specific_settings["showRequiredText"] == true) {
                            new_html = new_html + ` <e class="required">*</e>`
                        }
                    } else {
                        new_html = new_html + `></input>`
                    }
                    new_html = new_html + `</p>`
                    main_menu.innerHTML = main_menu.innerHTML + new_html
                } else if (newQuestion["type"] == "Password" || newQuestion["type"] == "PW") {
                    var new_html = `<p>${newQuestion["name"]}: <input placeholder="${newQuestion["placeholder"]}" type="password" class="${newQuestion["custom_class"]}" id="${newQuestion["jsonName"]}_input"`
                    if (newQuestion["required"] == true) {
                        new_html = new_html + ` required></input>`
                        if (specific_settings["showRequiredText"] == true) {
                            new_html = new_html + ` <e class="required">*</e>`
                        }
                    } else {
                        new_html = new_html + `></input>`
                    }
                    new_html = new_html + `</p>`
                    main_menu.innerHTML = main_menu.innerHTML + new_html
                } else if (newQuestion["type"] == "Time" || newQuestion["type"] == "TIME") {
                    var new_html = `<p>${newQuestion["name"]}: <input placeholder="${newQuestion["placeholder"]}" type="time" class="${newQuestion["custom_class"]}" id="${newQuestion["jsonName"]}_input"`
                    if (newQuestion["required"] == true) {
                        new_html = new_html + ` required></input>`
                        if (specific_settings["showRequiredText"] == true) {
                            new_html = new_html + ` <e class="required">*</e>`
                        }
                    } else {
                        new_html = new_html + `></input>`
                    }
                    new_html = new_html + `</p>`
                    main_menu.innerHTML = main_menu.innerHTML + new_html
                } else if (newQuestion["type"] == "Datetime Local" || newQuestion["type"] == "DTLocal") {
                    var new_html = `<p>${newQuestion["name"]}: <input placeholder="${newQuestion["placeholder"]}" type="datetime-local" class="${newQuestion["custom_class"]}" id="${newQuestion["jsonName"]}_input"`
                    if (newQuestion["required"] == true) {
                        new_html = new_html + ` required></input>`
                        if (specific_settings["showRequiredText"] == true) {
                            new_html = new_html + ` <e class="required">*</e>`
                        }
                    } else {
                        new_html = new_html + `></input>`
                    }
                    new_html = new_html + `</p>`
                    main_menu.innerHTML = main_menu.innerHTML + new_html
                } else if (newQuestion["type"] == "Color" || newQuestion["type"] == "HEX") {
                    var new_html = `<p>${newQuestion["name"]}: <input placeholder="${newQuestion["placeholder"]}" type="color" class="${newQuestion["custom_class"]}" id="${newQuestion["jsonName"]}_input"`
                    if (newQuestion["required"] == true) {
                        new_html = new_html + ` required></input>`
                        if (specific_settings["showRequiredText"] == true) {
                            new_html = new_html + ` <e class="required">*</e>`
                        }
                    } else {
                        new_html = new_html + `></input>`
                    }
                    new_html = new_html + `</p>`
                    main_menu.innerHTML = main_menu.innerHTML + new_html
                } else if (newQuestion["type"] == "Selection" || newQuestion["type"] == "SELECT") {
                    var new_html = `<p>${newQuestion["name"]}: <select class="${newQuestion["custom_class"]}" id="${newQuestion["jsonName"]}_input"`
                    if (newQuestion["required"] == true) {
                        new_html = new_html + ` required>`

                        for (let d_k = 0; d_k < newQuestion["placeholder"].length; d_k++) {
                            var sel = newQuestion["placeholder"][d_k]
                            new_html = new_html + `<option value="${sel["value"]}">${sel["name"]}</option>`
                        }

                        new_html = new_html + `</select>`

                        if (specific_settings["showRequiredText"] == true) {
                            new_html = new_html + ` <e class="required">*</e>`
                        }
                    } else {
                        new_html = new_html + `>`
                        for (let d_k = 0; d_k < newQuestion["placeholder"].length; d_k++) {
                            var sel = newQuestion["placeholder"][d_k]
                            new_html = new_html + `<option value="${sel["value"]}">${sel["name"]}</option>`
                        }
                        new_html = new_html + `</select>`
                    }
                    new_html = new_html + `</p>`
                    main_menu.innerHTML = main_menu.innerHTML + new_html
                } else if (newQuestion["type"] == "Image" || newQuestion["type"] == "IMG") {
                    var new_html = `<p>${newQuestion["name"]}: <input accept="image/*" type="file" class="${newQuestion["custom_class"]}" id="${newQuestion["jsonName"]}_input"`
                    if (newQuestion["required"] == true) {
                        new_html = new_html + ` required></input>`
                        if (specific_settings["showRequiredText"] == true) {
                            new_html = new_html + ` <e class="required">*</e>`
                        }
                    } else {
                        new_html = new_html + `></input>`
                    }
                    new_html = new_html + `</p>`
                    main_menu.innerHTML = main_menu.innerHTML + new_html
                } else if (newQuestion["type"] == "Video" || newQuestion["type"] == "VID") {
                    var new_html = `<p>${newQuestion["name"]}: <input accept="video/*" type="file" class="${newQuestion["custom_class"]}" id="${newQuestion["jsonName"]}_input"`
                    if (newQuestion["required"] == true) {
                        new_html = new_html + ` required></input>`
                        if (specific_settings["showRequiredText"] == true) {
                            new_html = new_html + ` <e class="required">*</e>`
                        }
                    } else {
                        new_html = new_html + `></input>`
                    }
                    new_html = new_html + `</p>`
                    main_menu.innerHTML = main_menu.innerHTML + new_html
                } else if (newQuestion["type"] == "Audio" || newQuestion["type"] == "AUD") {
                    var new_html = `<p>${newQuestion["name"]}: <input accept="audio/*" type="file" class="${newQuestion["custom_class"]}" id="${newQuestion["jsonName"]}_input"`
                    if (newQuestion["required"] == true) {
                        new_html = new_html + ` required></input>`
                        if (specific_settings["showRequiredText"] == true) {
                            new_html = new_html + ` <e class="required">*</e>`
                        }
                    } else {
                        new_html = new_html + `></input>`
                    }
                    new_html = new_html + `</p>`
                    main_menu.innerHTML = main_menu.innerHTML + new_html
                } else if (newQuestion["type"] == "Date" || newQuestion["type"] == "DATE") {
                    var new_html = `<p>${newQuestion["name"]}: <input placeholder="${newQuestion["placeholder"]}" type="date" class="${newQuestion["custom_class"]}" id="${newQuestion["jsonName"]}_input"`
                    if (newQuestion["required"] == true) {
                        new_html = new_html + ` required></input>`
                        if (specific_settings["showRequiredText"] == true) {
                            new_html = new_html + ` <e class="required">*</e>`
                        }
                    } else {
                        new_html = new_html + `></input>`
                    }
                    new_html = new_html + `</p>`
                    main_menu.innerHTML = main_menu.innerHTML + new_html
                } else {
                    var new_html = `<p>${newQuestion["name"]}: Failed to create question. Please ask the owner of this form to correct the question type.</p>"`
                    main_menu.innerHTML = main_menu.innerHTML + new_html
                }
                if (document.getElementById(`${newQuestion["jsonName"]}_input`)) {
                    var object = document.getElementById(`${newQuestion["jsonName"]}_input`)
                    if (object.tagName.toLowerCase() == "input") {
                        if (newQuestion["autofilled"] == true) {
                            object.parentNode.style.display = "none"
                            object.setAttribute("value", newQuestion["autofilled_value"])
                            object.setAttribute("autofilled", "true")
                        }
                    }
                }
            }
            if (system_json["hideModeSelection"] == false) {
                var new_html = `<p>Modes: `
                for (let b = 0; b < modes.length; b++) {
                    var new_mode = modes[b]
                    new_html = new_html + `<button type="button" id="modeButton" onclick="set_mode('${new_mode["name"]}')">${new_mode["name"]}</button> `
                }
                main_menu.innerHTML = main_menu.innerHTML + new_html
            }
            if (system_json["showCurrentMode"] == true) {
                var new_html = `<p id="current_mode">Current Mode: ${selected_mode}</p>`
                if (specific_settings["add_html_slot2"]) {
                    new_html = new_html + specific_settings["add_html_slot2"]
                }
                if (specific_settings["showModeInButtonText"] == false) {
                    new_html = new_html + `<button type="button" id="sendButton" class="center" onclick="send_response('${btoa(task_key)}')">Send Form!</button>`
                } else {
                    new_html = new_html + `<button type="button" id="sendButton" class="center" onclick="send_response('${btoa(task_key)}')">Send ${selected_mode}!</button>`
                }
                main_menu.innerHTML = main_menu.innerHTML + new_html
            } else {
                new_html = ""
                if (specific_settings["add_html_slot2"]) {
                    new_html = new_html + specific_settings["add_html_slot2"]
                }
                new_html = new_html + `<button type="button" id="sendButton" class="center" onclick="send_response('${btoa(task_key)}')">Send Form!</button>`
                main_menu.innerHTML = main_menu.innerHTML + new_html
            }
            if (specific_settings["add_html_slot3"]) {
                main_menu.innerHTML = main_menu.innerHTML + specific_settings["add_html_slot3"]
            }
            if (google_captcha["enabled"] == true && cloudflare_captcha["enabled"] == false) {
                var new_html = `<input type="hidden" id="${google_captcha["jsonName"]}_input" name="${google_captcha["jsonName"]}_input"></input>`
                main_menu.innerHTML = main_menu.innerHTML + new_html

                try {
                    grecaptcha.ready(function () {
                        grecaptcha.execute(google_captcha["siteKey"], { action: 'validate_captcha' }).then(function (token) {
                            document.getElementById(`${google_captcha["jsonName"]}_input`).innerHTML = token
                        });
                        google_captcha_enabled = true

                        var new_html = `<p class="footer">This form uses and is protected by reCAPTCHA that is used by Google's <a href="https://policies.google.com/privacy?hl=en-US">Privacy Policy</a> and <a href="https://policies.google.com/terms?hl=en-US">Terms of Service</a>.</p>`
                        document.body.innerHTML = document.body.innerHTML + new_html
                    });
                } catch (err) {
                    console.warn("Google Captcha failed to load due to an error. Please make sure to use Google Captcha v3 and is in your head object!")
                }
            } else if (google_captcha["enabled"] == false && cloudflare_captcha["enabled"] == true) {
                var new_html = `<input type="hidden" id="${cloudflare_captcha["jsonName"]}_input" name="${cloudflare_captcha["jsonName"]}_input"></input>`
                main_menu.innerHTML = main_menu.innerHTML + new_html

                try {
                    turnstile.ready(function () {
                        widget_id = turnstile.render(`#${cloudflare_captcha["jsonName"]}_input`, {
                            sitekey: cloudflare_captcha["siteKey"],
                            callback: function (token) {
                                document.getElementById(`${cloudflare_captcha["jsonName"]}_input`).innerHTML = token
                            },
                        });
                        cloudflare_captcha_enabled = true
                    });
                } catch (err) {
                    console.warn("Cloudflare Captcha failed to load due to an error. Please make sure to use the module and is in your head object!")
                }
            } else if (google_captcha["enabled"] == true && cloudflare_captcha["enabled"] == true) {
                console.warn("You can't have both CAPTCHAs enabled at the same time. Disable one in your JSON settings!")
            }
            if (specific_settings["custom_css"] && (!(getIfResponseIsEmpty(specific_settings["custom_css"])))) {
                var custom_css_url = specific_settings["custom_css"]
                if (document.getElementById("css_spreadsheet")) {
                    document.getElementById("css_spreadsheet").setAttribute("href", custom_css_url);
                }
            }
            lastLoadedJSON = system_json
            console.log("Successfully created form!")
            on_form_loaded(system_json)
        } catch (err) {
            console.warn("System was disabled due to an error, please check if the json is valid: " + err.message)
        }
    } else {
        console.warn("System was disabled due to a JSON error, please check if the json is valid: " + JSON.stringify(system_json))
    }
}

function loadFormJSONfromURL(url) {
    try {
        system_json = {}
        fetch(url).then(res => {
            if (res.ok) {
                res.json().then(json => {
                    system_json = json
                    questions = system_json["questions"]
                    modes = system_json["modes"]
                    specific_settings = system_json["specific_settings"]
                    selected_mode = system_json["defaultMode"]
                    google_captcha = system_json["googleCaptcha"]
                    cloudflare_captcha = system_json["cloudflareCaptcha"]
                    start_system()
                })
            } else {
                res.json().then(json => {
                    console.error(`Request failed, json resulted with: ${JSON.stringify(json)}`)
                })
            }
        })
    } catch (err) {
        console.log(`Error while loading from url: ${err.message}`)
        loadLastLoadedJSON()
    }
}

function loadLastLoadedJSON() {
    system_json = lastLoadedJSON
    questions = system_json["questions"]
    modes = system_json["modes"]
    specific_settings = system_json["specific_settings"]
    selected_mode = system_json["defaultMode"]
    google_captcha = system_json["googleCaptcha"]
    cloudflare_captcha = system_json["cloudflareCaptcha"]
    start_system()
}

function loadFormJSON(json) {
    system_json = json
    questions = system_json["questions"]
    modes = system_json["modes"]
    specific_settings = system_json["specific_settings"]
    selected_mode = system_json["defaultMode"]
    google_captcha = system_json["googleCaptcha"]
    cloudflare_captcha = system_json["cloudflareCaptcha"]
    start_system()
}

async function loadFormJSONfromURLByAsync(url) {
    try {
        system_json = {}
        return fetch(url).then(res => {
            if (res.ok) {
                return res.json().then(json => {
                    system_json = json
                    questions = system_json["questions"]
                    modes = system_json["modes"]
                    specific_settings = system_json["specific_settings"]
                    selected_mode = system_json["defaultMode"]
                    google_captcha = system_json["googleCaptcha"]
                    cloudflare_captcha = system_json["cloudflareCaptcha"]
                    start_system()
                    return [true, "success"]
                }).catch(err => {
                    return [false, err.message]
                })
            } else {
                return res.json().then(json => {
                    console.error(`Request failed, json resulted with: ${JSON.stringify(json)}`)
                    return [false, JSON.stringify(json)]
                }).catch(err => {
                    console.error(`Request failed, json resulted with: ${err.message}`)
                    return [false, err.message]
                })
            }
        }).catch(err => {
            console.log(`Error while loading from url: ${err.message}`)
            loadLastLoadedJSON()
            return [false, err.message]
        })
    } catch (err) {
        console.log(`Error while loading from url: ${err.message}`)
        loadLastLoadedJSON()
        return [false, err.message]
    }
}

async function loadLastLoadedJSONByAsync() {
    try {
        system_json = lastLoadedJSON
        questions = system_json["questions"]
        modes = system_json["modes"]
        specific_settings = system_json["specific_settings"]
        selected_mode = system_json["defaultMode"]
        google_captcha = system_json["googleCaptcha"]
        cloudflare_captcha = system_json["cloudflareCaptcha"]
        start_system()
        return [true, "success"]
    } catch (err) {
        return [false, err.message]
    }
}

async function loadFormJSONByAsync(json) {
    try {
        system_json = json
        questions = system_json["questions"]
        modes = system_json["modes"]
        specific_settings = system_json["specific_settings"]
        selected_mode = system_json["defaultMode"]
        google_captcha = system_json["googleCaptcha"]
        cloudflare_captcha = system_json["cloudflareCaptcha"]
        start_system()
        return [true, "success"]
    } catch (err) {
        return [false, err.message]
    }
}

(function () {
    window.addEventListener("load", function () {
        loadFormJSONfromURL("https://forms.efaz.dev/example.json")
    });
})()