/* 

Efaz's Form System

Set-up Forms via a JSON!
Made by Efaz from efaz.dev!

(Information about this script)
Made by: Efaz from https://www.efaz.dev
Script Version: v1.1.5 Beta
Type of Code: JavaScript

*/

// Define Variables if not already.
if (!(typeof system_json !== 'undefined')) {
    var system_json = {};
}
if (!(typeof lastLoadedJSON !== 'undefined')) {
    var lastLoadedJSON = {};
}

// Form Variables
var questions = system_json["questions"];
var modes = system_json["modes"];
var selected_mode = system_json["defaultMode"];
var specific_settings = system_json["specific_settings"];
var failed_to_load_async = false;

// API Functions
function on_success_form(args) { };
function on_form_loaded(form_json) { };
try {
    async function get_xcsrf(args) {
        return null;
    };
} catch (err) {
    function get_xcsrf(args) {
        return new Promise((resolve, reject) => {
            resolve(null);
        });
    };
    console.warn("Unable to define get_xcsrf as async function.");
    failed_to_load_async = true;
}

// All Captchas
const task = (function () {
    class Token {
        #key;
        #count;
        constructor() {
            this.#key = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) { const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8); return v.toString(16); });
            this.#count = 1;
        }

        get_key() {
            if (this.#count == 1) {
                this.#count = 0;
                return this.#key;
            } else {
                return null;
            }
        }
        validateToken(e) {
            return e == this.#key;
        }
    }
    return new Token();
})();
const task_key = task.get_key();

// Google Captcha
var google_captcha_enabled = false;
var google_captcha = system_json["googleCaptcha"];

// Cloudflare Captcha
var cloudflare_captcha_enabled = false;
var cloudflare_captcha = system_json["cloudflareCaptcha"];
let widget_id = "";

// System Functions
try {
    async function getImageFromInput(input) {
        let files = input.files[0];
        if (files) {
            return new Promise((resolve, reject) => {
                let fileReader = new FileReader();
                fileReader.readAsDataURL(files);
                fileReader.onload = function (frEvent) {
                    resolve(frEvent.target.result);
                };
            });
        } else {
            return new Promise((resolve, reject) => {
                resolve(null);
            });
        }
    }

    async function get_values() {
        let new_table = {};
        for (let a = 0; a < questions.length; a++) {
            let valueInfo = questions[a];
            let new_obj = document.getElementById(valueInfo["jsonName"] + "_input");
            if (new_obj.value) {
                if (new_obj.type == "file") {
                    await getImageFromInput(new_obj).then(res => {
                        new_table[valueInfo["jsonName"]] = res;
                    });
                } else {
                    new_table[valueInfo["jsonName"]] = new_obj.value;
                }
            }
        };
        return new_table;
    }
} catch (err) {
    function getImageFromInput(input) {
        return null;
    }
    function get_values() {
        return {};
    }
    console.warn("Unable to define needed functions as async functions.");
    failed_to_load_async = true;
}

function getModeInfo(mode_name) {
    let new_table = { "success": false };
    for (let a = 0; a < modes.length; a++) {
        let newMode = modes[a];
        if (newMode["name"] == mode_name) {
            return { "success": true, "response": newMode };
        }
    };
    return new_table;
}

function refreshVariables() {
    questions = system_json["questions"];
    modes = system_json["modes"];
    selected_mode = system_json["defaultMode"];
    specific_settings = system_json["specific_settings"];
}

function view_main_menu() {
    let obj1 = document.getElementById("main_menu");
    let obj2 = document.getElementById("success");
    let obj3 = document.getElementById("failed");
    let obj4 = document.getElementById("awaiting");

    obj1.style = "display: block;";
    obj2.style = "display: none;";
    obj3.style = "display: none;";
    obj4.style = "display: none;";
}

function returnFromMessageAndClear() {
    loadLastLoadedJSON();
}

function view_success_menu(mode, message) {
    let obj1 = document.getElementById("main_menu");
    let obj2 = document.getElementById("success");
    let obj3 = document.getElementById("failed");
    let obj6 = document.getElementById("awaiting");

    obj1.style = "display: none;";
    obj2.style = "display: block;";
    obj3.style = "display: none;";
    obj6.style = "display: none;";

    let obj4 = document.getElementById("message2");
    let obj5 = document.getElementById("reloadButton");
    if (message == null) {
        message = "No message was given.";
    };
    let response = getModeInfo(mode);
    if (response["success"] == true) {
        if (response["response"]["thanksMessage"]) {
            obj4.innerHTML = response["response"]["thanksMessage"].replace("{jsonMessage}", message);
        } else {
            obj4.innerHTML = "Thanks for submitting your form!";
        };
        if (response["response"]["showTryAgainOnSuccess"] == false) {
            obj5.style = "display: none;";
        } else {
            obj5.style = "display: block;";
        };
    } else {
        obj4.innerHTML = "Thanks for submitting your form!";
    }
}

function view_error_menu(text) {
    let obj1 = document.getElementById("main_menu");
    let obj2 = document.getElementById("success");
    let obj3 = document.getElementById("failed");
    let obj5 = document.getElementById("awaiting");

    obj1.style = "display: none;";
    obj2.style = "display: none;";
    obj3.style = "display: block;";
    obj5.style = "display: none;";

    let obj4 = document.getElementById("message1");
    obj4.innerHTML = text;
}

function view_awaiting_menu() {
    let obj1 = document.getElementById("main_menu");
    let obj2 = document.getElementById("success");
    let obj3 = document.getElementById("failed");
    let obj4 = document.getElementById("awaiting");

    obj1.style = "display: none;";
    obj2.style = "display: none;";
    obj3.style = "display: none;";
    obj4.style = "display: block;";
}

function set_mode(mode) {
    let response = getModeInfo(mode);
    if (response["success"] == true) {
        selected_mode = mode;
        main_mode_details = response["response"];

        if (system_json["showCurrentMode"] && document.getElementById("current_mode")) {
            let obj1 = document.getElementById("current_mode");
            let obj2 = document.getElementById("submit_button");
            obj1.innerHTML = 'Current Mode: ' + mode;

            if (specific_settings["showModeInButtonText"] == false) {
                obj2.innerHTML = 'Send Form!';
            } else {
                obj2.innerHTML = 'Send ' + mode + "!";
            }

            let questions = system_json["questions"];
            if (specific_settings["showAllQuestionsInAllModes"] == true) {
                for (let a = 0; a < questions.length; a++) {
                    let main_question = questions[a];
                    if (!(main_question["autofilled"] == true)) {
                        let object = document.getElementById(main_question["jsonName"] + '_input');
                        if (object) {
                            if (object.parentNode.tagName == "DIV") {
                                object.style.display = "";
                            } else {
                                object.parentNode.style.display = "";
                            }
                        }
                    }
                }
            } else {
                for (let a = 0; a < questions.length; a++) {
                    let main_question = questions[a];
                    if (!(main_question["autofilled"] == true)) {
                        let object = document.getElementById(main_question["jsonName"] + '_input');
                        if (object) {
                            if (object.parentNode.tagName == "DIV") {
                                object.style.display = "none";
                            } else {
                                object.parentNode.style.display = "none";
                            }
                        };

                        for (let b = 0; b < main_mode_details["formatted"].length; b++) {
                            let question_a_details = main_mode_details["formatted"][b];
                            if (question_a_details["jsonName"] == main_question["jsonName"]) {
                                if (object) {
                                    if (object.parentNode.tagName == "DIV") {
                                        object.style.display = "";
                                    } else {
                                        object.parentNode.style.display = "";
                                    }
                                }
                            }
                        }
                    }
                }
            }
        } else {
            let obj2 = document.getElementById("submit_button");
            obj2.innerHTML = 'Send Form!';
        };
    }
}

function get_captcha(callback_a, token) {
    if (task.validateToken(token)) {
        if (google_captcha_enabled == true) {
            return grecaptcha.execute(google_captcha["siteKey"], { action: 'validate_captcha' })
                .then(function (token) {
                    callback_a(["Google", token]);
                });
        } else if (cloudflare_captcha_enabled == true) {
            turnstile.render('#' + cloudflare_captcha["jsonName"] + '_input', {
                sitekey: cloudflare_captcha["siteKey"],
                callback: function (token) {
                    callback_a(["Cloudflare", token]);
                },
            });
        } else {
            return callback_a(["None", ""]);
        }
    } else {
        return callback_a(["None", ""]);
    }
}

function getIfResponseIsEmpty(t) {
    if (typeof t == 'string') {
        return t.trim().length === 0;
    } else if (typeof t == 'number') {
        return t !== 0;
    } else if (typeof t == 'undefined') {
        return true;
    };
}

function start_system() {
    refreshVariables();
    let title = "System Form";
    let icon_url = "https://cdn.efaz.dev/png/logo.png";
    if (system_json["title"] != null) {
        title = system_json["title"];
        icon_url = system_json["icon_url"];
    }
    document.body.innerHTML =
        '<div id="main_menu">\n' +
        '    <h1 id="title1">' + title + '</h1>\n' +
        '</div>\n' +
        '<div id="failed" style="display: none;">\n' +
        '    <h1 id="title2">Oops!</h1>\n' +
        '    <p id="message1">{error}</p>\n' +
        '    <br>\n' +
        '    <button type="button" id="returnButton" class="center">Try again!</button>\n' +
        '</div>\n' +
        '<div id="awaiting" style="display: none;">\n' +
        '    <h1 id="title4">Hold on!</h1>\n' +
        '    <p id="message3">We are processing your request! Be right back!</p>\n' +
        '</div>\n' +
        '<div id="success" style="display: none;">\n' +
        '    <h1 id="title3">Success!</h1>\n' +
        '    <p id="message2">Thanks for submitting your form!</p>\n' +
        '    <br>\n' +
        '    <button type="button" id="reloadButton" class="center">Do another!</button>\n' +
        '</div>'; /* Clear all objects inside the body and resets to default usable HTML. */
    
    try {
        /* Handle Missing Functions */
        if (failed_to_load_async == true) {
            document.getElementById("title4").innerText= "Uh oh!"
            document.getElementById("message3").innerText= "Something went wrong loading this form! Please update your browser or check your browser settings!"
            return;
        }

        /* Inital Buttons */
        document.getElementById("reloadButton").addEventListener("click", returnFromMessageAndClear);
        document.getElementById("returnButton").addEventListener("click", view_main_menu);

        /* Inital Title and Start */
        let main_menu = document.getElementById("main_menu");
        if (!(specific_settings["hideIcon"] == true)) {
            if (specific_settings["resize_logo"]) {
                let new_html = '<img src="' + icon_url + '" height="' + specific_settings["resize_logo"]["height"] + '" width="' + specific_settings["resize_logo"]["width"] + '" class="center">';
                main_menu.innerHTML = new_html + main_menu.innerHTML;
            } else {
                let new_html = '<img src="' + icon_url + '" height="64" width="64" class="center">';
                main_menu.innerHTML = new_html + main_menu.innerHTML;
            };
        };
        if (specific_settings["add_html_slot1"]) {
            main_menu.innerHTML = main_menu.innerHTML + specific_settings["add_html_slot1"];
        };

        /* Questions */
        for (let a = 0; a < questions.length; a++) {
            let newQuestion = questions[a];
            if (newQuestion["type"] == "Short Response" || newQuestion["type"] == "SR") {
                let new_html = '<p>' + newQuestion["name"] + ': <input placeholder="' + newQuestion["placeholder"] +
                    '" type="text" class="' + newQuestion["custom_class"] +
                    '" id="' + newQuestion["jsonName"] + '_input"';
                if (newQuestion["required"] == true) {
                    new_html = new_html + ' required></input>';
                    if (specific_settings["showRequiredText"] == true) {
                        new_html = new_html + ' <e class="required">*</e>';
                    };
                } else {
                    new_html = new_html + '></input>';
                };
                new_html = new_html + '</p>';
                main_menu.innerHTML = main_menu.innerHTML + new_html;
            } else if (newQuestion["type"] == "Detailed Message" || newQuestion["type"] == "DM") {
                let new_html = '<p>' + newQuestion["name"] + ': </p><textarea placeholder="' + newQuestion["placeholder"] + '" type="text" class="' + newQuestion["custom_class"] + '" id="' + newQuestion["jsonName"] + '_input" cols="40" rows="10"';
                if (newQuestion["required"] == true) {
                    new_html = new_html + " required></textarea>";
                    if (specific_settings["showRequiredText"] == true) {
                        new_html = new_html + ' <e class="required">(required)</e>';
                    };
                } else {
                    new_html = new_html + "></textarea>";
                };
                main_menu.innerHTML = main_menu.innerHTML + new_html;
            } else if (newQuestion["type"] == "Integer" || newQuestion["type"] == "INT") {
                let new_html = '<p>' + newQuestion["name"] + ': <input placeholder="' + newQuestion["placeholder"] + '" type="number" class="' + newQuestion["custom_class"] + '" id="' + newQuestion["jsonName"] + '_input"';
                if (newQuestion["required"] == true) {
                    new_html = new_html + ' required></input>';
                    if (specific_settings["showRequiredText"] == true) {
                        new_html = new_html + ' <e class="required">*</e>';
                    };
                } else {
                    new_html = new_html + '></input>';
                };
                new_html = new_html + '</p>';
                main_menu.innerHTML = main_menu.innerHTML + new_html;
            } else if (newQuestion["type"] == "Email" || newQuestion["type"] == "EMAIL") {
                let new_html = '<p>' + newQuestion["name"] + ': <input placeholder="' + newQuestion["placeholder"] + '" type="email" class="' + newQuestion["custom_class"] + '" id="' + newQuestion["jsonName"] + '_input"';
                if (newQuestion["required"] == true) {
                    new_html = new_html + ' required></input>';
                    if (specific_settings["showRequiredText"] == true) {
                        new_html = new_html + ' <e class="required">*</e>';
                    };
                } else {
                    new_html = new_html + '></input>';
                };
                new_html = new_html + '</p>';
                main_menu.innerHTML = main_menu.innerHTML + new_html;
            } else if (newQuestion["type"] == "Password" || newQuestion["type"] == "PW") {
                let new_html = '<p>' + newQuestion["name"] + ': <input placeholder="' + newQuestion["placeholder"] + '" type="password" class="' + newQuestion["custom_class"] + '" id="' + newQuestion["jsonName"] + '_input"';
                if (newQuestion["required"] == true) {
                    new_html = new_html + ' required></input>';
                    if (specific_settings["showRequiredText"] == true) {
                        new_html = new_html + ' <e class="required">*</e>';
                    };
                } else {
                    new_html = new_html + '></input>';
                };
                new_html = new_html + '</p>';
                main_menu.innerHTML = main_menu.innerHTML + new_html;
            } else if (newQuestion["type"] == "Time" || newQuestion["type"] == "TIME") {
                let new_html = '<p>' + newQuestion["name"] + ': <input placeholder="' + newQuestion["placeholder"] + '" type="time" class="' + newQuestion["custom_class"] + '" id="' + newQuestion["jsonName"] + '_input"';
                if (newQuestion["required"] == true) {
                    new_html = new_html + ' required></input>';
                    if (specific_settings["showRequiredText"] == true) {
                        new_html = new_html + ' <e class="required">*</e>';
                    };
                } else {
                    new_html = new_html + '></input>';
                };
                new_html = new_html + '</p>';
                main_menu.innerHTML = main_menu.innerHTML + new_html;
            } else if (newQuestion["type"] == "Datetime Local" || newQuestion["type"] == "DTLocal") {
                let new_html = '<p>' + newQuestion["name"] + ': <input placeholder="' + newQuestion["placeholder"] + '" type="datetime-local" class="' + newQuestion["custom_class"] + '" id="' + newQuestion["jsonName"] + '_input"';
                if (newQuestion["required"] == true) {
                    new_html = new_html + ' required></input>';
                    if (specific_settings["showRequiredText"] == true) {
                        new_html = new_html + ' <e class="required">*</e>';
                    };
                } else {
                    new_html = new_html + '></input>';
                };
                new_html = new_html + '</p>';
                main_menu.innerHTML = main_menu.innerHTML + new_html;
            } else if (newQuestion["type"] == "Color" || newQuestion["type"] == "HEX") {
                let new_html = '<p>' + newQuestion["name"] + ': <input placeholder="' + newQuestion["placeholder"] + '" type="color" class="' + newQuestion["custom_class"] + '" id="' + newQuestion["jsonName"] + '_input"';
                if (newQuestion["required"] == true) {
                    new_html = new_html + ' required></input>';
                    if (specific_settings["showRequiredText"] == true) {
                        new_html = new_html + ' <e class="required">*</e>';
                    };
                } else {
                    new_html = new_html + '></input>';
                };
                new_html = new_html + '</p>';
                main_menu.innerHTML = main_menu.innerHTML + new_html;
            } else if (newQuestion["type"] == "Selection" || newQuestion["type"] == "SELECT") {
                let new_html = '<p>' + newQuestion["name"] + ': <select class="' + newQuestion["custom_class"] + '" id="' + newQuestion["jsonName"] + '_input"';
                if (newQuestion["required"] == true) {
                    new_html = new_html + ' required>';

                    for (let d_k = 0; d_k < newQuestion["placeholder"].length; d_k++) {
                        let sel = newQuestion["placeholder"][d_k];
                        new_html = new_html + '<option value="' + sel["value"] + '">' + sel["name"] + '</option>';
                    };

                    new_html = new_html + '</select>';

                    if (specific_settings["showRequiredText"] == true) {
                        new_html = new_html + ' <e class="required">*</e>';
                    };
                } else {
                    new_html = new_html + '>';
                    for (let d_k = 0; d_k < newQuestion["placeholder"].length; d_k++) {
                        let sel = newQuestion["placeholder"][d_k];
                        new_html = new_html + '<option value="' + sel["value"] + '">' + sel["name"] + '</option>';
                    };
                    new_html = new_html + '</select>';
                };
                new_html = new_html + '</p>';
                main_menu.innerHTML = main_menu.innerHTML + new_html;
            } else if (newQuestion["type"] == "Image" || newQuestion["type"] == "IMG") {
                let new_html = '<p>' + newQuestion["name"] + ': <input accept="image/*" type="file" class="' + newQuestion["custom_class"] + '" id="' + newQuestion["jsonName"] + '_input"';
                if (newQuestion["required"] == true) {
                    new_html = new_html + ' required></input>';
                    if (specific_settings["showRequiredText"] == true) {
                        new_html = new_html + ' <e class="required">*</e>';
                    };
                } else {
                    new_html = new_html + '></input>';
                };
                new_html = new_html + '</p>';
                main_menu.innerHTML = main_menu.innerHTML + new_html;
            } else if (newQuestion["type"] == "Video" || newQuestion["type"] == "VID") {
                let new_html = '<p>' + newQuestion["name"] + ': <input accept="video/*" type="file" class="' + newQuestion["custom_class"] + '" id="' + newQuestion["jsonName"] + '_input"';
                if (newQuestion["required"] == true) {
                    new_html = new_html + ' required></input>';
                    if (specific_settings["showRequiredText"] == true) {
                        new_html = new_html + ' <e class="required">*</e>';
                    };
                } else {
                    new_html = new_html + '></input>';
                };
                new_html = new_html + '</p>';
                main_menu.innerHTML = main_menu.innerHTML + new_html;
            } else if (newQuestion["type"] == "Audio" || newQuestion["type"] == "AUD") {
                let new_html = '<p>' + newQuestion["name"] + ': <input accept="audio/*" type="file" class="' + newQuestion["custom_class"] + '" id="' + newQuestion["jsonName"] + '_input"';
                if (newQuestion["required"] == true) {
                    new_html = new_html + ' required></input>';
                    if (specific_settings["showRequiredText"] == true) {
                        new_html = new_html + ' <e class="required">*</e>';
                    };
                } else {
                    new_html = new_html + '></input>';
                };
                new_html = new_html + '</p>';
                main_menu.innerHTML = main_menu.innerHTML + new_html;
            } else if (newQuestion["type"] == "Date" || newQuestion["type"] == "DATE") {
                let new_html = '<p>' + newQuestion["name"] + ': <input placeholder="' + newQuestion["placeholder"] + '" type="date" class="' + newQuestion["custom_class"] + '" id="' + newQuestion["jsonName"] + '_input"';
                if (newQuestion["required"] == true) {
                    new_html = new_html + ' required></input>';
                    if (specific_settings["showRequiredText"] == true) {
                        new_html = new_html + ' <e class="required">*</e>';
                    };
                } else {
                    new_html = new_html + '></input>';
                };
                new_html = new_html + '</p>';
                main_menu.innerHTML = main_menu.innerHTML + new_html;
            } else {
                let new_html = '<p>' + newQuestion["name"] + ': Failed to create question. Please ask the owner of this form to correct the question type.</p>"';
                main_menu.innerHTML = main_menu.innerHTML + new_html;
            };
            if (document.getElementById(newQuestion["jsonName"] + '_input')) {
                let object = document.getElementById(newQuestion["jsonName"] + '_input');
                if (object.tagName.toLowerCase() == "input") {
                    if (newQuestion["autofilled"] == true) {
                        object.parentNode.style.display = "none";
                        object.setAttribute("value", newQuestion["autofilled_value"]);
                        object.setAttribute("autofilled", "true");
                    }
                }
            };
        };

        /* Modes */
        if (system_json["hideModeSelection"] == false) {
            let new_html = '<p>Modes: ';
            for (let b = 0; b < modes.length; b++) {
                let new_mode = modes[b];
                new_html = new_html + '<button type="button" id="modeButton_' + new_mode["name"] + '">' + new_mode["name"] + '</button> ';
            };
            main_menu.innerHTML = main_menu.innerHTML + new_html;
            document.getElementById('modeButton_' + new_mode["name"]).addEventListener("click", () => {
                set_mode(new_mode["name"]);
            });
        };
        if (system_json["showCurrentMode"] == true) {
            let new_html = '<p id="current_mode">Current Mode: ' + selected_mode + '</p>';
            if (specific_settings["add_html_slot2"]) {
                new_html = new_html + specific_settings["add_html_slot2"];
            };
            if (specific_settings["showModeInButtonText"] == false) {
                new_html = new_html + '<button type="button" id="submit_button" class="center">Send Form!</button>';
            } else {
                new_html = new_html + '<button type="button" id="submit_button" class="center">Send ' + selected_mode + '!</button>';
            };
            main_menu.innerHTML = main_menu.innerHTML + new_html;
        } else {
            new_html = "";
            if (specific_settings["add_html_slot2"]) {
                new_html = new_html + specific_settings["add_html_slot2"];
            }
            new_html = new_html + '<button type="button" id="submit_button" class="center">Send Form!</button>';
            main_menu.innerHTML = main_menu.innerHTML + new_html;
        };

        /* Submitting */
        document.getElementById("submit_button").addEventListener("click", () => {
            view_awaiting_menu();
            try {
                function responseToError(err) {
                    view_error_menu("Response couldn't be sent due to a client error. View console for specific details.");
                    console.log('EfazDev Forms System Error: ' + err.message);
                }
                get_values().then(values => {
                    get_xcsrf(values).then(x_csrf_token => {
                        let mode_response = getModeInfo(selected_mode);
                        if (mode_response["success"] == true) {
                            mode_response = mode_response["response"];
                            let new_formated_values = {};
                            let new_api_url = mode_response["api_url"];
                            let listOfKeysProvided = Object.keys(values);
                            let appliedAtSymbol = false;
                            let listOfEmptyRequiredVariables = [];

                            for (let c = 0; c < listOfKeysProvided.length; c++) {
                                let key = listOfKeysProvided[c];
                                let main_val = values[key];
                                for (let d = 0; d < mode_response["formatted"].length; d++) {
                                    let main_val2 = mode_response["formatted"][d];
                                    if (main_val2["jsonName"] == key) {
                                        if (main_val2["in"] == "Body") {
                                            new_formated_values[key] = main_val;
                                        } else if (main_val2["in"] == "URL") {
                                            if (appliedAtSymbol == false) {
                                                new_api_url = new_api_url + '?' + main_val2["jsonName"] + '=' + main_val;
                                                appliedAtSymbol = true;
                                            } else {
                                                new_api_url = new_api_url + '?' + main_val2["jsonName"] + '=' + main_val;
                                            }
                                        };
                                    }
                                };
                            };

                            for (let e = 0; e < questions.length; e++) {
                                let question = questions[e];
                                if (question["required"] == true) {
                                    if (getIfResponseIsEmpty(new_formated_values[question["jsonName"]])) {
                                        if (mode_response["formatted"]) {
                                            for (let h = 0; h < mode_response["formatted"].length; h++) {
                                                let lista = mode_response["formatted"][h];
                                                if (lista["jsonName"] == question["jsonName"]) {
                                                    listOfEmptyRequiredVariables.push(question["name"]);
                                                }
                                            };
                                        } else {
                                            listOfEmptyRequiredVariables.push(question["name"]);
                                        }
                                    };
                                }
                            };

                            if (listOfEmptyRequiredVariables.length > 0) {
                                let new_string_g = (listOfEmptyRequiredVariables[0] || "null").toString();
                                let remove = false;
                                for (let f = 0; f < listOfEmptyRequiredVariables.length + 1; f++) {
                                    if (remove == true) {
                                        if (listOfEmptyRequiredVariables[f]) {
                                            let val_h = listOfEmptyRequiredVariables[f];
                                            new_string_g = new_string_g + ", " + (val_h || "null").toString();
                                        };
                                    } else {
                                        remove = true;
                                    };
                                };
                                view_error_menu("The following questions were filled empty: " + new_string_g);
                            } else {
                                get_captcha(captcha_key => {
                                    if (captcha_key[0] == "Google") {
                                        new_formated_values[google_captcha["jsonName"]] = captcha_key[1];
                                    } else if (captcha_key[0] == "Cloudflare") {
                                        new_formated_values[cloudflare_captcha["jsonName"]] = captcha_key[1];
                                    };

                                    let converted_json_string = JSON.stringify(new_formated_values);
                                    try {
                                        if (!(mode_response["type_of_api"] == "POST" || mode_response["type_of_api"] == "PUT" || mode_response["type_of_api"] == "PATCH")) {
                                            mode_response["type_of_api"] = "POST";
                                        };
                                        let include_credentials = "omit";
                                        if (specific_settings["include_cookies"] == true) {
                                            include_credentials = "include";
                                        };
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
                                                    values["fetch_response"] = json;
                                                    values["current_form"] = system_json;
                                                    if (specific_settings["allow_second_form"] == true) {
                                                        if (json["form"]) {
                                                            loadFormJSON(json["form"]);
                                                        } else {
                                                            view_success_menu(selected_mode, json["message"]);
                                                            on_success_form(values);
                                                        };
                                                    } else {
                                                        view_success_menu(selected_mode, json["message"]);
                                                        on_success_form(values);
                                                    }
                                                });
                                            } else {
                                                res.json().then(json => {
                                                    view_error_menu(json["message"]);
                                                });
                                            };
                                        });
                                    } catch (err) {
                                        view_error_menu(err.message);
                                    }
                                }, task_key);
                            }
                        }
                    }).catch(responseToError);
                }).catch(responseToError);
            } catch (err) {
                responseToError(err);
            }
        });

        /* HTML Slot */
        if (specific_settings["add_html_slot3"]) {
            main_menu.innerHTML = main_menu.innerHTML + specific_settings["add_html_slot3"];
        };

        /* Captcha */
        if (google_captcha["enabled"] == true && cloudflare_captcha["enabled"] == false) {
            let new_html = '<input type="hidden" id="' + google_captcha["jsonName"] + '_input" name="' + google_captcha["jsonName"] + '_input"></input>';
            main_menu.innerHTML = main_menu.innerHTML + new_html;

            try {
                grecaptcha.ready(function () {
                    grecaptcha.execute(google_captcha["siteKey"], { action: 'validate_captcha' }).then(function (token) {
                        document.getElementById(google_captcha["jsonName"] + '_input').innerHTML = token;
                    });
                    google_captcha_enabled = true;

                    let new_html = '<p class="footer">This form uses and is protected by reCAPTCHA that is used by Google\'s <a href="https://policies.google.com/privacy?hl=en-US">Privacy Policy</a> and <a href="https://policies.google.com/terms?hl=en-US">Terms of Service</a>.</p>';
                    document.body.innerHTML = document.body.innerHTML + new_html;
                });
            } catch (err) {
                console.warn("Google Captcha failed to load due to an error. Please make sure to use Google Captcha v3 and is in your head object!");
            }
        } else if (google_captcha["enabled"] == false && cloudflare_captcha["enabled"] == true) {
            let new_html = '<input type="hidden" id="' + cloudflare_captcha["jsonName"] + '_input" name="' + cloudflare_captcha["jsonName"] + '_input"></input>';
            main_menu.innerHTML = main_menu.innerHTML + new_html;

            try {
                turnstile.ready(function () {
                    widget_id = turnstile.render('#' + cloudflare_captcha["jsonName"] + '_input', {
                        sitekey: cloudflare_captcha["siteKey"],
                        callback: function (token) {
                            document.getElementById(cloudflare_captcha["jsonName"] + '_input').innerHTML = token;
                        },
                    });
                    cloudflare_captcha_enabled = true;
                });
            } catch (err) {
                console.warn("Cloudflare Captcha failed to load due to an error. Please make sure to use the module and is in your head object!");
            }
        } else if (google_captcha["enabled"] == true && cloudflare_captcha["enabled"] == true) {
            console.warn("You can't have both CAPTCHAs enabled at the same time. Disable one in your JSON settings!");
        };

        /* Custom CSS */
        if (specific_settings["custom_css"] && (!(getIfResponseIsEmpty(specific_settings["custom_css"])))) {
            let custom_css_url = specific_settings["custom_css"];
            if (document.getElementById("css_spreadsheet")) {
                document.getElementById("css_spreadsheet").setAttribute("href", custom_css_url);
            }
        };

        /* Done! */
        lastLoadedJSON = system_json;
        console.log("Successfully created form!");
        on_form_loaded(system_json);
    } catch (err) {
        console.warn("System was disabled due to an error, please check if the json is valid: " + err.message);
    }
};

function loadFormJSONfromURL(url) {
    try {
        system_json = {};
        fetch(url).then(res => {
            if (res.ok) {
                res.json().then(json => {
                    system_json = json;
                    questions = system_json["questions"];
                    modes = system_json["modes"];
                    specific_settings = system_json["specific_settings"];
                    selected_mode = system_json["defaultMode"];
                    google_captcha = system_json["googleCaptcha"];
                    cloudflare_captcha = system_json["cloudflareCaptcha"];
                    start_system();
                });
            } else {
                res.json().then(json => {
                    console.error('Request failed, json resulted with: ' + JSON.stringify(json));
                });
            }
        });
    } catch (err) {
        console.log('Error while loading from url: ' + err.message);
        loadLastLoadedJSON();
    };
};

function loadLastLoadedJSON() {
    system_json = lastLoadedJSON;
    questions = system_json["questions"];
    modes = system_json["modes"];
    specific_settings = system_json["specific_settings"];
    selected_mode = system_json["defaultMode"];
    google_captcha = system_json["googleCaptcha"];
    cloudflare_captcha = system_json["cloudflareCaptcha"];
    start_system();
};

function loadFormJSON(json) {
    system_json = json;
    questions = system_json["questions"];
    modes = system_json["modes"];
    specific_settings = system_json["specific_settings"];
    selected_mode = system_json["defaultMode"];
    google_captcha = system_json["googleCaptcha"];
    cloudflare_captcha = system_json["cloudflareCaptcha"];
    start_system();
};

try {
    async function loadFormJSONfromURLByAsync(url) {
        try {
            system_json = {};
            return fetch(url).then(res => {
                if (res.ok) {
                    return res.json().then(json => {
                        system_json = json;
                        questions = system_json["questions"];
                        modes = system_json["modes"];
                        specific_settings = system_json["specific_settings"];
                        selected_mode = system_json["defaultMode"];
                        google_captcha = system_json["googleCaptcha"];
                        cloudflare_captcha = system_json["cloudflareCaptcha"];
                        start_system();
                        return [true, "success"];
                    }).catch(err => {
                        return [false, err.message];
                    });
                } else {
                    return res.json().then(json => {
                        console.error('Request failed, json resulted with: ' + JSON.stringify(json));
                        return [false, JSON.stringify(json)];
                    }).catch(err => {
                        console.error('Request failed, json resulted with: ' + err.message);
                        return [false, err.message];
                    });
                }
            }).catch(err => {
                console.log('Error while loading from url: ' + err.message);
                loadLastLoadedJSON();
                return [false, err.message];
            });
        } catch (err) {
            console.log('Error while loading from url: ' + err.message);
            loadLastLoadedJSON();
            return [false, err.message];
        }
    };

    async function loadLastLoadedJSONByAsync() {
        try {
            system_json = lastLoadedJSON;
            questions = system_json["questions"];
            modes = system_json["modes"];
            specific_settings = system_json["specific_settings"];
            selected_mode = system_json["defaultMode"];
            google_captcha = system_json["googleCaptcha"];
            cloudflare_captcha = system_json["cloudflareCaptcha"];
            start_system();
            return [true, "success"];
        } catch (err) {
            return [false, err.message];
        }
    };

    async function loadFormJSONByAsync(json) {
        try {
            system_json = json;
            questions = system_json["questions"];
            modes = system_json["modes"];
            specific_settings = system_json["specific_settings"];
            selected_mode = system_json["defaultMode"];
            google_captcha = system_json["googleCaptcha"];
            cloudflare_captcha = system_json["cloudflareCaptcha"];
            start_system();
            return [true, "success"];
        } catch (err) {
            return [false, err.message];
        }
    };
} catch (err) {
    const loadFormJSONfromURLByAsync = loadFormJSONfromURL;
    const loadLastLoadedJSONByAsync = loadLastLoadedJSON;
    const loadFormJSONByAsync = loadFormJSON;
    console.warn("Unable to define load form async functions as async function.");
    failed_to_load_async = true;
}