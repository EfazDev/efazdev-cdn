/* 

Efaz's Form System

Set-up Forms via a JSON!
Made by Efaz from efaz.dev!

(Information about this script)
Made by: Efaz from https://www.efaz.dev
Script Version: v1.2.0 Beta
Type of Code: JavaScript

*/

EfazForms = {};
(function () {
    // Form Variables
    let system_json = {};
    let last_loaded_json = {};
    let ui_elements = {};
    let questions = system_json["questions"];
    let modes = system_json["modes"];
    let selected_mode = system_json["defaultMode"];
    let specific_settings = system_json["specific_settings"];

    // API Functions
    EfazForms.on_success_form = async function (args) { };
    EfazForms.on_form_loaded = async function (form_json) { };
    EfazForms.get_xcsrf = async function(args) {
        return null;
    };

    // All Captchas
    const task = (function () {
        const key = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
        let count = 1;
        return {
            get_key() {
                if (count == 1) { count = 0; return key; }
                return null;
            },
            validateToken(e) {
                return e == key;
            }
        };
    })();
    const task_key = task.get_key();

    // Google Captcha
    let google_captcha_enabled = false;
    let google_captcha = system_json["googleCaptcha"];

    // Cloudflare Captcha
    let cloudflare_captcha_enabled = false;
    let cloudflare_captcha = system_json["cloudflareCaptcha"];
    let cloudflare_widget_id = null;

    // Cap Captcha
    let cap_captcha_enabled = false;
    let cap_captcha = system_json["capCaptcha"];
    let cap_captcha_object = null;

    // Run System
    EfazForms.get_values = async function() {
        let new_table = {};
        for (const valueInfo of questions) {
            let new_obj = ui_elements["question:" + valueInfo["jsonName"]];
            if (new_obj.value) {
                if (new_obj.type == "file") {
                    new_table[valueInfo["jsonName"]] = await getFileFromInput(new_obj);
                } else {
                    new_table[valueInfo["jsonName"]] = new_obj.value;
                }
            }
        };
        return new_table;
    }

    async function getFileFromInput(input) {
        let files = input.files[0];
        if (files) {
            if (system_json["formDataEnabled"]) {
                return files;
            }
            return new Promise((resolve, _) => {
                let fileReader = new FileReader();
                fileReader.readAsDataURL(files);
                fileReader.onload = function (frEvent) {
                    resolve(frEvent.target.result);
                };
            });
        } else {
            return null;
        }
    }

    function make_log(func, message) {
        func("EfazDev Forms: " + message);
    }

    function getModeInfo(mode_name) {
        for (const newMode of modes) {
            if (newMode.name === mode_name) {
                return { success: true, response: newMode };
            }
        }
        return { success: false };
    }

    function refreshVariables() {
        questions = system_json["questions"];
        modes = system_json["modes"];
        selected_mode = system_json["defaultMode"];
        specific_settings = system_json["specific_settings"];
    }

    function view_main_menu() {
        ui_elements.main_menu.style.display = "initial";
        ui_elements.success.style.display = "none";
        ui_elements.failed.style.display = "none";
        ui_elements.awaiting.style.display = "none";
    }

    function returnFromMessageAndClear() {
        EfazForms.loadLastLoadedJSON();
    }

    function view_success_menu(mode, message) {
        ui_elements.main_menu.style.display = "none";
        ui_elements.success.style.display = "initial";
        ui_elements.failed.style.display = "none";
        ui_elements.awaiting.style.display = "none";

        if (message == null) {
            message = "No message was given.";
        };
        let response = getModeInfo(mode);
        if (response["success"]) {
            if (response["response"]["thanksMessage"]) {
                ui_elements.message2.innerHTML = response["response"]["thanksMessage"].replace("{jsonMessage}", message);
            } else {
                ui_elements.message2.innerHTML = "Thanks for submitting your form!";
            };
            if (!response["response"]["showTryAgainOnSuccess"]) {
                ui_elements.reloadButton.style = "display: none;";
            } else {
                ui_elements.reloadButton.style = "display: initial;";
            };
        } else {
            ui_elements.message2.innerHTML = "Thanks for submitting your form!";
        }
    }

    function view_error_menu(text) {
        ui_elements.main_menu.style.display = "none";
        ui_elements.success.style.display = "none";
        ui_elements.failed.style.display = "initial";
        ui_elements.awaiting.style.display = "none";
        ui_elements.message1.innerHTML = text;
    }

    function view_awaiting_menu() {
        ui_elements.main_menu.style.display = "none";
        ui_elements.success.style.display = "none";
        ui_elements.failed.style.display = "none";
        ui_elements.awaiting.style.display = "initial";
    }

    function set_mode(mode) {
        let response = getModeInfo(mode);
        if (response["success"]) {
            selected_mode = mode;
            main_mode_details = response["response"];
            make_log(console.log, 'Set current mode: ' + selected_mode);
            if (system_json["showCurrentMode"] && ui_elements.current_mode) {
                ui_elements.current_mode.innerHTML = "Current Mode: " + mode;
                if (!specific_settings["showModeInButtonText"]) {
                    ui_elements.submit_button.innerHTML = 'Send Form!';
                } else {
                    ui_elements.submit_button.innerHTML = 'Send ' + mode + "!";
                }

                let questions = system_json["questions"];
                if (specific_settings["showAllQuestionsInAllModes"]) {
                    for (const main_question of questions) {
                        if (!(main_question["autofilled"])) {
                            let object = ui_elements["question:" + main_question["jsonName"]];
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
                    for (const main_question of questions) {
                        if (!(main_question["autofilled"])) {
                            let object = ui_elements["question:" + main_question["jsonName"]];
                            if (object) {
                                if (object.parentNode.tagName == "DIV") {
                                    object.style.display = "none";
                                } else {
                                    object.parentNode.style.display = "none";
                                }
                            };

                            for (const question_a_details of main_mode_details["formatted"]) {
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
                ui_elements.submit_button.innerHTML = 'Send Form!';
            };
        }
    }

    function responseToError(err) {
        view_error_menu("Response couldn't be sent due to a client error. View console for specific details.");
        make_log(console.warn, 'There was an issue sending response due to a client error: ' + err.stack);
    }

    function set_buttons() {
        /* Mode Buttons */
        if (!system_json["hideModeSelection"]) {
            for (let b = 0; b < modes.length; b++) {
                let new_mode = modes[b];
                let btn = ui_elements["modeButton_" + new_mode["name"]];
                btn.addEventListener("click", () => {
                    set_mode(new_mode["name"]);
                });
            }
        }

        /* Submitting */
        ui_elements.submit_button.addEventListener("click", async () => {
            view_awaiting_menu();
            try {
                let values = await EfazForms.get_values();
                let x_csrf_token = await EfazForms.get_xcsrf(values);
                let mode_response = getModeInfo(selected_mode);
                if (!mode_response["success"]) { return }
                mode_response = mode_response["response"];
                let new_formated_values = {};
                let new_api_url = mode_response["api_url"];
                let listOfKeysProvided = Object.keys(values);
                let params = new URLSearchParams();
                let listOfEmptyRequiredVariables = [];

                for (let key of listOfKeysProvided) {
                    let main_val = values[key];
                    for (let main_val2 of mode_response["formatted"]) {
                        if (main_val2["jsonName"] == key) {
                            if (main_val2["in"] == "Body") {
                                new_formated_values[key] = main_val;
                            } else if (main_val2["in"] == "URL") {
                                params.append(main_val2["jsonName"], main_val);
                            }
                        }
                    }
                }

                let queryString = params.toString();
                if (queryString) new_api_url += `?${queryString}`;

                for (const question in questions) {
                    if (question["required"]) {
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
                    let new_string_g = listOfEmptyRequiredVariables.map(val => val || "null").join(", ");
                    view_error_menu("The following questions were filled empty: " + new_string_g);
                    make_log(console.log, "The following questions were filled empty: " + new_string_g);
                    if (cloudflare_captcha_enabled && cloudflare_widget_id !== null) {
                        turnstile.reset(cloudflare_widget_id);
                    }
                    return;
                }
                get_captcha(async (captcha_key) => {
                    if (captcha_key[0] == "Google") {
                        new_formated_values[google_captcha["jsonName"]] = captcha_key[1];
                    } else if (captcha_key[0] == "Cloudflare") {
                        new_formated_values[cloudflare_captcha["jsonName"]] = captcha_key[1];
                    } else if (captcha_key[0] == "Cap") {
                        new_formated_values[cap_captcha["jsonName"]] = captcha_key[1];
                    };

                    let sending_data;
                    let content_type = "application/json"
                    if (system_json["formDataEnabled"]) {
                        sending_data = new FormData();
                        for (const key in new_formated_values) {
                            sending_data.append(key, new_formated_values[key]);
                        }
                        content_type = "multipart/form-data";
                    } else {
                        sending_data = JSON.stringify(new_formated_values);
                    }
                    try {
                        if (!(mode_response["type_of_api"] == "POST" || mode_response["type_of_api"] == "PUT" || mode_response["type_of_api"] == "PATCH")) {
                            mode_response["type_of_api"] = "POST";
                        };
                        let include_credentials = specific_settings["include_cookies"] ? "include" : "omit";
                        const form_res = await fetch(new_api_url, {
                            "headers": {
                                "accept": "application/json",
                                "accept-language": "en-US,en;q=0.9",
                                "content-type": content_type,
                                "sec-fetch-dest": "empty",
                                "sec-fetch-mode": "cors",
                                "sec-fetch-site": "same-origin",
                                "credentials": include_credentials,
                                "cookie": document.cookie,
                                "x-csrf-token": x_csrf_token
                            },
                            "referrerPolicy": "strict-origin-when-cross-origin",
                            "body": sending_data,
                            "method": mode_response["type_of_api"],
                            "mode": "cors",
                            "credentials": include_credentials,
                        })
                        const form_json = await form_res.json();
                        if (!form_res.ok) {
                            view_error_menu(form_json["message"]);
                            make_log(console.log, "Unable to submit form: " + form_json["message"]);
                            if (cloudflare_captcha_enabled && cloudflare_widget_id !== null) {
                                turnstile.reset(cloudflare_widget_id);
                            }
                            return;
                        }
                        values["fetch_response"] = form_json;
                        values["current_form"] = system_json;
                        if (specific_settings["allow_second_form"]) {
                            if (form_json["form"]) {
                                EfazForms.loadFormJSON(form_json["form"]);
                            } else {
                                view_success_menu(selected_mode, form_json["message"]);
                                EfazForms.on_success_form(values);
                            };
                        } else {
                            view_success_menu(selected_mode, form_json["message"]);
                            EfazForms.on_success_form(values);
                        }
                        make_log(console.log, "Successfully submitted form to " + new_api_url + "!");
                    } catch (err) {
                        view_error_menu(err.stack);
                        make_log(console.log, "Unable to submit form: " + err.stack);
                    }
                }, task_key);
            } catch (err) {
                responseToError(err);
            }
        });
    }

    function get_captcha(callback_a, token) {
        if (task.validateToken(token)) {
            if (google_captcha_enabled) {
                return grecaptcha.execute(google_captcha["siteKey"], { action: 'validate_captcha' })
                    .then(function (token) {
                        callback_a(["Google", token]);
                    });
            } else if (cloudflare_captcha_enabled) {
                return callback_a(["Cloudflare", ui_elements["question:" + cloudflare_captcha["jsonName"]].value]);
            } else if (cap_captcha_enabled) {
                return cap_captcha_object.solve().then(solution => {
                    callback_a(["Cap", solution.token]);
                });
            } else {
                return callback_a(["None", ""]);
            }
        } else {
            make_log(console.warn, "Unable to resolve captcha due to invalid token..");
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
        /* Information Variables */
        refreshVariables();
        let title = "System Form";
        let icon_url = "https://cdn.efaz.dev/png/logo.png";

        /* Set Basics */
        if (system_json["title"] != null) {
            title = system_json["title"];
            icon_url = system_json["icon_url"];
        }
        let html_set = '<form id="main_menu" onsubmit="event.preventDefault();">\n' +
            '    <h1 id="title1">' + title + '</h1>\n' +
            '</form>\n' +
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
            '</div>';
        document.body.innerHTML = html_set;
        ui_elements = {
            main_menu: document.getElementById("main_menu"),
            success: document.getElementById("success"),
            failed: document.getElementById("failed"),
            awaiting: document.getElementById("awaiting"),
            title1: document.getElementById("title1"),
            title2: document.getElementById("title2"),
            title3: document.getElementById("title3"),
            title4: document.getElementById("title4"),
            message1: document.getElementById("message1"),
            message2: document.getElementById("message2"),
            message3: document.getElementById("message3"),
            current_mode: document.getElementById("current_mode"),
            return_button: document.getElementById("returnButton"),
            reload_button: document.getElementById("reloadButton"),
            submit_button: document.getElementById("submit_button"),
            css_spreadsheet: document.getElementById("css_spreadsheet")
        };

        try {
            /* Initial Buttons */
            ui_elements.reload_button.addEventListener("click", returnFromMessageAndClear);
            ui_elements.return_button.addEventListener("click", view_main_menu);

            /* Initial Title and Start */
            let fragment = document.createDocumentFragment();
            let endFragment = document.createDocumentFragment();
            if (specific_settings["hideIcon"] != true) {
                let img = document.createElement("img");
                img.src = icon_url;
                img.className = "center";
                if (specific_settings["resize_logo"]) {
                    img.height = specific_settings["resize_logo"]["height"];
                    img.width = specific_settings["resize_logo"]["width"];
                } else {
                    img.height = 64;
                    img.width = 64;
                }
                ui_elements.main_menu.insertBefore(img, ui_elements.title1);
            };
            if (specific_settings["add_html_slot1"]) {
                let slot1 = document.createElement("div");
                slot1.innerHTML = specific_settings["add_html_slot1"];
                ui_elements.main_menu.insertBefore(slot1, ui_elements.title1);
            };

            let wait_till_end = []

            /* Captcha */
            if (google_captcha || cloudflare_captcha || cap_captcha) {
                if ((google_captcha && google_captcha["enabled"]) + (cloudflare_captcha && cloudflare_captcha["enabled"]) + (cap_captcha && cap_captcha["enabled"]) > 1) {
                    make_log(console.warn, "You can't have multiple CAPTCHAs enabled at once. Enable only one in your JSON settings!");
                } else if (google_captcha && google_captcha["enabled"]) {
                    let captchaInput = document.createElement("input");
                    captchaInput.type = "hidden";
                    captchaInput.id = google_captcha["jsonName"] + "_input";
                    captchaInput.name = google_captcha["jsonName"] + "_input";
                    fragment.appendChild(captchaInput);
                    ui_elements["question:" + google_captcha["jsonName"]] = captchaInput; 
                    wait_till_end.push(function () {
                        try {
                            grecaptcha.ready(function () {
                                grecaptcha.execute(google_captcha["siteKey"], { action: 'validate_captcha' }).then(function (token) {
                                    ui_elements["question:" + google_captcha["jsonName"]].value = token;
                                });
                                google_captcha_enabled = true;
                                let footer = document.createElement("p");
                                footer.className = "footer";
                                footer.innerHTML = 'This form uses and is protected by reCAPTCHA that is used by Google\'s <a href="https://policies.google.com/privacy?hl=en-US">Privacy Policy</a> and <a href="https://policies.google.com/terms?hl=en-US">Terms of Service</a>.';
                                ui_elements.main_menu.appendChild(footer);
                                make_log(console.log, "Google Captcha is ready to be used!");
                            });
                            make_log(console.log, "Ran ready for Google!");
                        } catch (err) {
                            make_log(console.warn, "Google Captcha failed to load due to an error. Please make sure to use Google Captcha v3 and is in your head object!");
                        }
                    });
                } else if (cloudflare_captcha && cloudflare_captcha["enabled"]) {
                    let captchaInput = document.createElement("input");
                    captchaInput.type = "hidden";
                    captchaInput.id = cloudflare_captcha["jsonName"] + "_input";
                    captchaInput.name = cloudflare_captcha["jsonName"] + "_input";
                    fragment.appendChild(captchaInput);
                    ui_elements["question:" + cloudflare_captcha["jsonName"]] = captchaInput;
                    wait_till_end.push(function () {
                        try {
                            cloudflare_widget_id = turnstile.render('#' + cloudflare_captcha["jsonName"] + '_input', {
                                sitekey: cloudflare_captcha["siteKey"],
                                callback: function (token) {
                                    ui_elements["question:" + cloudflare_captcha["jsonName"]].value = token;
                                    if (ui_elements.submit_button) {
                                        ui_elements.submit_button.disabled = false;
                                    }
                                },
                                'expired-callback': function () {
                                    turnstile.reset(cloudflare_widget_id);
                                    ui_elements["question:" + cloudflare_captcha["jsonName"]].value = "";
                                    if (ui_elements.submit_button) {
                                        ui_elements.submit_button.disabled = true;
                                    }
                                    make_log(console.log, "Captcha expired and was automatically reset.");
                                }
                            });
                            cloudflare_captcha_enabled = true;
                            make_log(console.log, "Cloudflare Captcha is ready to be used!");
                        } catch (err) {
                            make_log(console.warn, "Cloudflare Captcha failed to load due to an error. Please make sure to use the module and is in your head object!");
                        }
                    });
                } else if (cap_captcha && cap_captcha["enabled"]) {
                    wait_till_end.push(function () {
                        try {
                            cap_captcha_object = new Cap({
                                apiEndpoint: cap_captcha["apiEndpoint"],
                            });
                            cap_captcha_enabled = true;
                            make_log(console.log, "Cap Captcha is ready to be used!");
                        } catch (err) {
                            make_log(console.warn, "Cap Captcha failed to load due to an error. Please make sure to use the module and is in your head object!");
                        }
                    });
                };
            }

            /* Questions */
            for (const newQuestion of questions) {
                let p = document.createElement("p");
                p.textContent = newQuestion["name"] + ": ";
                let input;
                let isTextarea = newQuestion["type"] === "Detailed Message" || newQuestion["type"] === "DM";
                let isSelect = newQuestion["type"] === "Selection" || newQuestion["type"] === "SELECT";
                if (isTextarea) {
                    input = document.createElement("textarea");
                    input.cols = 40;
                    input.rows = 10;
                } else if (isSelect) {
                    input = document.createElement("select");
                    for (const sel of newQuestion["placeholder"]) {
                        let option = document.createElement("option");
                        option.value = sel["value"];
                        option.textContent = sel["name"];
                        input.appendChild(option);
                    }
                } else {
                    input = document.createElement("input");
                    const typeMap = {
                        "Short Response": "text", "SR": "text",
                        "One Time Password": "text", "OTP": "text",
                        "Slider": "range", "RANGE": "range",
                        "Integer": "number", "INT": "number",
                        "Email": "email", "EMAIL": "email",
                        "Phone": "tel", "TEL": "tel",
                        "Password": "password", "PW": "password",
                        "Checkbox": "checkbox", "CHECK": "checkbox",
                        "Color": "color", "HEX": "color",
                        "Date": "date", "DATE": "date"
                    };
                    input.type = typeMap[newQuestion["type"]] || "text";
                    if (newQuestion["type"] === "Image" || newQuestion["type"] === "IMG") input.accept = "image/*";
                    if (newQuestion["type"] === "File" || newQuestion["type"] === "FILE") input.accept = newQuestion["acceptingFiles"];
                    if (input.type === "range") {
                        input.min = newQuestion["min"];
                        input.max = newQuestion["max"];
                        input.step = newQuestion["step"];
                    }
                }
                input.id = newQuestion["jsonName"] + "_input";
                if (newQuestion["custom_class"]) input.className = newQuestion["custom_class"];
                if (newQuestion["placeholder"] && !isSelect) input.placeholder = newQuestion["placeholder"];
                if (newQuestion["autocomplete"]) input.autocomplete = newQuestion["autocomplete"];
                if (newQuestion["autofilled"]) {
                    p.style.display = "none";
                    input.value = newQuestion["autofilled_value"];
                    input.setAttribute("autofilled", "true");
                }
                if (newQuestion["required"]) {
                    input.required = true;
                    if (specific_settings["showRequiredText"]) {
                        let reqTag = document.createElement("e");
                        reqTag.className = "required";
                        reqTag.textContent = isTextarea ? " (required)" : " *";
                        p.appendChild(reqTag);
                    }
                }
                p.insertBefore(input, p.lastChild && p.lastChild.tagName === "E" ? p.lastChild : null);
                if (!p.contains(input)) p.appendChild(input); 
                fragment.appendChild(p);
                ui_elements["question:" + newQuestion["jsonName"]] = input;
            };

            /* Modes */
            if (!system_json["hideModeSelection"]) {
                let modeP = document.createElement("p");
                modeP.textContent = "Modes: ";
                for (const new_mode of modes) {
                    let btn = document.createElement("button");
                    btn.type = "button";
                    btn.id = "modeButton_" + new_mode["name"];
                    btn.textContent = new_mode["name"];
                    modeP.appendChild(btn);
                    modeP.appendChild(document.createTextNode(" "));
                    ui_elements["modeButton_" + new_mode["name"]] = btn; 
                }
                fragment.appendChild(modeP);
            }
            if (specific_settings["add_html_slot2"]) {
                let slot2 = document.createElement("div");
                slot2.innerHTML = specific_settings["add_html_slot2"];
                fragment.append(...slot2.children);
            }
            if (system_json["showCurrentMode"]) {
                let currentModeP = document.createElement("p");
                currentModeP.id = "current_mode";
                currentModeP.textContent = "Current Mode: " + selected_mode;
                fragment.appendChild(currentModeP);
                ui_elements.current_mode = currentModeP; 
            }

            /* Submit Button */
            let submitBtn = document.createElement("button");
            submitBtn.type = "button";
            submitBtn.id = "submit_button";
            submitBtn.className = "center";
            submitBtn.disabled = true;
            if (!cloudflare_captcha?.enabled) {
                ui_elements.submit_button.disabled = false;
            }
            let buttonText = "Send Form!";
            if (system_json["showCurrentMode"] && specific_settings["showModeInButtonText"]) {
                buttonText = "Send " + selected_mode + "!";
            }
            submitBtn.textContent = buttonText;
            fragment.appendChild(submitBtn);
            ui_elements.submit_button = submitBtn;

            /* HTML Slot */
            if (specific_settings["add_html_slot3"]) {
                let slot3 = document.createElement("div");
                slot3.innerHTML = specific_settings["add_html_slot3"];
                fragment.append(...slot3.children);
            }

            /* Custom CSS */
            if (specific_settings["custom_css"] && (!(getIfResponseIsEmpty(specific_settings["custom_css"])))) {
                let custom_css_url = specific_settings["custom_css"];
                if (ui_elements.css_spreadsheet) {
                    ui_elements.css_spreadsheet.setAttribute("href", custom_css_url);
                }
            };

            /* Done! */
            ui_elements.main_menu.appendChild(fragment);
            ui_elements.main_menu.appendChild(endFragment);
            if (!system_json["hideModeSelection"]) {
                for (let b = 0; b < modes.length; b++) {
                    let new_mode = modes[b];
                    ui_elements["modeButton_" + new_mode["name"]] = document.getElementById("modeButton_" + new_mode["name"]);
                }
            }
            for (const func of wait_till_end) {
                func();
            }
            set_buttons();
            last_loaded_json = system_json;
            make_log(console.log, "Successfully created form!");
            try {
                on_form_loaded(system_json);
            } catch (err) {
                make_log(console.warn, "Unable to run on_form_loaded event due to an error: " + err.stack);
            }
        } catch (err) {
            document.body.innerHTML = html_set;
            view_awaiting_menu();
            ui_elements.title4.innerText = "Uh oh!";
            ui_elements.message3.innerText = "Something went wrong loading this form! Please try again later!";
            make_log(console.warn, "System was disabled due to an error, please check if the json is valid: " + err.stack);
        }
    };

    EfazForms.loadFormJSONfromURL = function(url) {
        try {
            system_json = {};
            fetch(url).then(async (res) => {
                const json = await res.json();
                if (res.ok) {
                    system_json = json;
                    questions = system_json["questions"];
                    modes = system_json["modes"];
                    specific_settings = system_json["specific_settings"];
                    selected_mode = system_json["defaultMode"];
                    google_captcha = system_json["googleCaptcha"];
                    cloudflare_captcha = system_json["cloudflareCaptcha"];
                    cap_captcha = system_json["capCaptcha"];
                    start_system();
                } else {
                    console.error('Request failed, json resulted with: ' + JSON.stringify(json));
                }
            });
        } catch (err) {
            make_log(console.log, 'Error while loading from url: ' + err.stack);
            EfazForms.loadLastLoadedJSON();
        };
    };

    EfazForms.loadLastLoadedJSON = function() {
        system_json = last_loaded_json;
        questions = system_json["questions"];
        modes = system_json["modes"];
        specific_settings = system_json["specific_settings"];
        selected_mode = system_json["defaultMode"];
        google_captcha = system_json["googleCaptcha"];
        cloudflare_captcha = system_json["cloudflareCaptcha"];
        start_system();
    };

    EfazForms.loadFormJSON = function(json) {
        system_json = json;
        questions = system_json["questions"];
        modes = system_json["modes"];
        specific_settings = system_json["specific_settings"];
        selected_mode = system_json["defaultMode"];
        google_captcha = system_json["googleCaptcha"];
        cloudflare_captcha = system_json["cloudflareCaptcha"];
        start_system();
    };

    EfazForms.loadFormJSONfromURLByAsync = async function(url) {
        try {
            system_json = {};
            const res = await fetch(url);
            const json = await res.json();
            if (res.ok) {
                system_json = json;
                questions = system_json["questions"];
                modes = system_json["modes"];
                specific_settings = system_json["specific_settings"];
                selected_mode = system_json["defaultMode"];
                google_captcha = system_json["googleCaptcha"];
                cloudflare_captcha = system_json["cloudflareCaptcha"];
                start_system();
                return [true, "success"];
            } else {
                console.error('Request failed, json resulted with: ' + JSON.stringify(json));
                return [false, JSON.stringify(json)];
            }
        } catch (err) {
            make_log(console.log, 'Error while loading from url: ' + err.stack);
            EfazForms.loadLastLoadedJSON();
            return [false, err.stack];
        }
    };

    EfazForms.loadLastLoadedJSONByAsync = async function() {
        try {
            system_json = last_loaded_json;
            questions = system_json["questions"];
            modes = system_json["modes"];
            specific_settings = system_json["specific_settings"];
            selected_mode = system_json["defaultMode"];
            google_captcha = system_json["googleCaptcha"];
            cloudflare_captcha = system_json["cloudflareCaptcha"];
            start_system();
            return [true, "success"];
        } catch (err) {
            return [false, err.stack];
        }
    };

    EfazForms.loadFormJSONByAsync = async function(json) {
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
            return [false, err.stack];
        }
    };
})();