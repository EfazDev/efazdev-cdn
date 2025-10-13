/*

Hello Hazem User!

Thanks for using Hazem.gg Auto Redeemer for hazem.gg!
Made by Efaz!

(Disclaimers)
1. Please don't change the code above "Line Code Break" note.
2. This script does modify the page of your hazem.gg html. Please know before running.

hazem.gg is made by false_dev from Quataun. This script reserves rights for Quataun for any action.
Any modification from outside of this script may be in void.
EFAZDEV IS NOT AFFILIATED WITH QUATAUN OR HAZEM.

How to use:

1. Open your developer console or inspect element.
2. Paste this code into your console
3. Press Enter or Return to run the code
4. Follow the prompts to start your auto-redeemer session!
5. After all the prompts are finished, you now have an auto-redeemer session running!

(Pre-QA)

How to get results of the auto-redeemer?
You can always open your console with the results after 7 seconds of console clearing that is made from Cloudflare.

Can I use this on a server or another website?
No, you cannot use this on another website or server as CORS policy does exist and Cloudflare can't generate keys outside the domain.

What browsers does this support?
Chrome, Safari on macOS, Firefox, and any other browser that is supported by Cloudflare's API and has developer consoles.

How many codes can this redeem?
Any amount! This script redeems codes one by one each on your array with no limit in any way!

Does this script take your codes?
No, this script uses your username when redeeming the codes.

Does this script take your Roblox Security Cookie?
No, browsers don't allow that type of behavior.

THERES NO UI. PLEASE DON'T ASK ME IF THERE'S NO UI.

(End of Pre-QA)

(Information about this script)
Made by: Efaz from https://www.efaz.dev
Script Version: v1.0.0
Type of Code: JavaScript

*/

var saved_key = ""
var key_valid = false
var hazem_site_key = "0x4AAAAAAAEKFvszRVVcaEp-"
var saved_id = turnstile.render("#cf-turnstile", {
    sitekey: hazem_site_key,
    callback: function (token) {
        saved_key = token
        key_valid = true
    },
})
var results = []
var success_messages = [
    "Invalid",
    "Redeemed",
    "Robux",
    "Find"
]

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function messageGenerator(mes) {
    var listOfLabels = document.getElementsByTagName("label")
    if (listOfLabels.length > 0) {
        listOfLabels[0].innerHTML = mes
    } else {
        console.log(mes)
        var element = document.createElement("label");
        element.appendChild(document.createTextNode(mes));
        element.classList.add("react-reveal")
        element.classList.add("flex")
        element.classList.add("text-white")
        element.classList.add("text-center")
        element.style.cssText = "animation-fill-mode: both; animation-duration: 875ms; animation-delay: 125ms; animation-iteration-count: 1; opacity: 1; animation-name: react-reveal-769105985008815-1;"
        element.style.display = "block";
        document.getElementsByTagName("form")[0].appendChild(element);
    }
}

function reset_button(enabled) {
    var listOfLabels = document.getElementsByTagName("a")
    var button
    for (var i = 0; i < listOfLabels.length; i++) {
        if (listOfLabels[i].href == "https://hazem.gg/?index") {
            button = listOfLabels[i]
        }
    }
    if (button) {
        if (enabled == true) {
            button.style.display = "block";
        } else {
            button.style.display = "none";
        }
    } else {
        if (enabled == true) {
            var element = document.createElement("a");
            element.appendChild(document.createTextNode("Click this to stop the current auto-redeemer session."));
            element.title = "Click this to stop the current auto-redeemer session.";
            element.href = "https://hazem.gg/?index"
            element.classList.add("react-reveal")
            element.classList.add("flex")
            element.classList.add("text-white")
            element.classList.add("text-center")
            element.style.cssText = "color: #ffffff; animation-fill-mode: both; animation-duration: 875ms; animation-delay: 125ms; animation-iteration-count: 1; opacity: 1; animation-name: react-reveal-769105985008815-1;"
            document.getElementsByTagName("form")[0].appendChild(element);
        } else {
            var element = document.createElement("a");
            element.appendChild(document.createTextNode("Click this to stop the current auto-redeemer session."));
            element.title = "Click this to stop the current auto-redeemer session.";
            element.href = "https://hazem.gg/?index"
            element.classList.add("react-reveal")
            element.classList.add("flex")
            element.classList.add("text-white")
            element.classList.add("text-center")
            button.style.display = "none";
            element.style.cssText = "color: #ffffff; animation-fill-mode: both; animation-duration: 875ms; animation-delay: 125ms; animation-iteration-count: 1; opacity: 1; animation-name: react-reveal-769105985008815-1;"
            document.getElementsByTagName("form")[0].appendChild(element);
        }
    }
}

function scanForInput(text, isPlaceHolder) {
    var listOfInputs = document.getElementsByTagName("input")
    var input
    for (var i = 0; i < listOfInputs.length; i++) {
        var inputCurrent = listOfInputs[i]
        if (isPlaceHolder == true) {
            if (inputCurrent.placeholder == text) {
                input = inputCurrent
            }
        } else {
            if (inputCurrent.value == text) {
                input = inputCurrent
            }
        }
    }
    return input
}

function redeemButtonLock(enabled, username) {
    var redeem_button = scanForInput("Redeem", false)
    var a = scanForInput("Roblox Username", true)
    var b = scanForInput("Code", true)
    var c = scanForInput("Made by EfazDev", true)
    var d = scanForInput("Auto Redeemer is On", true)
    if (redeem_button) {
        redeem_button.disabled = enabled
        if (enabled == true && (a && b)) {
            a.value = "Made by EfazDev"
            b.value = "Auto Redeemer is On"
            a.placeholder = "Made by EfazDev"
            b.placeholder = "Auto Redeemer is On"
        } else {
            c.value = username
            d.value = ""
            c.placeholder = "Roblox Username"
            d.placeholder = "Code"
        }
    }
}

function scanMessage(mes) {
    var enabled = false
    for (var i = 0; i < success_messages.length; i++) {
        if (mes.toLowerCase().includes(success_messages[i].toLowerCase())) enabled = true;
    }
    return enabled
}

function refreshKey() {
    key_valid = false
    turnstile.reset(saved_id)
}
triesCount = {}
async function code_redeem(codeToUse, username, index, listOfCodes) {
    if (key_valid == true) {
        saved_key = document.getElementsByName("cf-turnstile-response")[0].value
        console.log("Loaded Cloudflare Key: " + saved_key)
        key_valid = false
        current_count = 0

        if (triesCount[codeToUse]) {
            current_count = triesCount[codeToUse]
        }
        current_count = current_count + 1
        triesCount[codeToUse] = current_count
        try {
            var response = await fetch("https://hazem.gg/?index=&username=" + username + "&code=" + codeToUse + "&_data=routes%2F_index", {
                "headers": {
                    "accept": "*/*",
                    "accept-language": "en-US,en;q=0.9",
                    "content-type": "application/x-www-form-urlencoded;charset=UTF-8",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin"
                },
                "referrer": "https://hazem.gg/?index&code=" + codeToUse + "&username=" + username,
                "referrerPolicy": "strict-origin-when-cross-origin",
                "body": "code=" + codeToUse + "&username=" + username + "&cf-turnstile-response=" + saved_key,
                "method": "POST",
                "mode": "cors",
                "credentials": "include"
            })
                .then((response) => {
                    if (response?.ok) {
                        return response.json()
                    } else {
                        var res_text = response.text()
                        var res_text2 = ""
                        res_text.then(function (result) {
                            res_text2 = result
                        });
                        return { "message": "Failed Gateway with Vercel server: " + res_text2 }
                    }
                })
                .then((jsonRes) => {
                    if (scanMessage(jsonRes["message"])) {
                        refreshKey()
                        results.push({
                            "code": codeToUse,
                            "message": jsonRes["message"]
                        });
                        console.log("Success Code Reach: " + jsonRes["message"] + " | Code: " + codeToUse)
                        messageGenerator("Success Code Reach: " + jsonRes["message"] + " | Code: " + codeToUse)
                        if (results.length == listOfCodes.length) {
                            sleep(5000)
                            on_finished(username)
                        }
                        return {
                            "code": codeToUse,
                            "message": jsonRes["message"]
                        }
                    } else {
                        sleep(1000)
                        refreshKey()
                        messageGenerator("Failed Code Reach: " + jsonRes["message"] + " | Code: " + codeToUse + " | Count: " + current_count)
                        return code_redeem(codeToUse, username, index, listOfCodes)
                    }
                });
        } catch (exceptionVar) {
            sleep(1000)
            refreshKey()
            messageGenerator("Failed Code Reach: " + exceptionVar + " (Server Error) | Code: " + codeToUse + " | Count: " + current_count)
            return code_redeem(codeToUse, username, index, listOfCodes)
        }
    } else {
        await sleep(1000)
        return code_redeem(codeToUse, username, index, listOfCodes)
    }
}

async function on_finished(username) {
    console.log("Redeeming codes from your list is finished! Results should be in your console soon!")
    messageGenerator("Redeeming codes from your list is finished! Results should be in your console soon!")
    redeemButtonLock(false, username)
    reset_button(false)
    await sleep(7000)
    console.log("Results: ")
    console.log("----------")
    for (var i = 0; i < results.length; i++) {
        var codeToUse = results[i]
        console.log("Code: " + codeToUse["code"])
        console.log("Message: " + codeToUse["message"])
        console.log("----------")
    }
}

async function main_code(codes, username) {
    console.log("Starting System...")
    messageGenerator("Starting Auto Redeemer..")
    redeemButtonLock(true, username)
    reset_button(true)
    if (codes.length < 1) {
        console.log("There were no codes on your list. Please make sure you added the list correctly.")
        messageGenerator("There were no codes on your list. Please make sure you added the list correctly.")
        redeemButtonLock(false, username)
        reset_button(false)
    } else {
        for (var i = 0; i < codes.length; i++) {
            var codeToUse = codes[i]
            var resp = code_redeem(codeToUse, username, i, codes)
        }
    }
}

async function prompts() {
    var listCodes = []
    var username = ""
    var filled = false
    function main_prompt(question, defaults) {
        messageGenerator("Follow the prompts on your screen.")
        var e = prompt(question, defaults)
        if (e == null) {
            return main_prompt(question, defaults)
        } else {
            return e
        }
    }
    function confirmPrompt(question, correct, defaults) {
        var q = main_prompt(question, defaults)
        if (q?.toLowerCase() == correct?.toLowerCase()) {
            return true
        } else {
            return false
        }
    }
    function usernamePro() {
        username = main_prompt("Please enter your username: ", "EfazDev");
        if (confirmPrompt("Confirm this user? (" + username + ") (yes/no): ", "yes", "yes")) {
            console.log("Confirmed Username: " + username)
        } else {
            usernamePro()
        }
    }
    usernamePro()
    if (confirmPrompt("Code Array? (yes/no): ", "yes", "no")) {
        var arrayString = main_prompt("Enter your code array here: ", "[]")
        try {
            listCodes = arrayString.replace(/'/g, '"');
            listCodes = JSON.parse(listCodes);
            filled = true
        } catch (exceptionVar) {
            console.log("Error while decoding array: " + exceptionVar)
        }
    }
    if (filled == false) {
        function addCode() {
            var code = main_prompt("Enter code here: ", "DICE$haha")
            if (confirmPrompt("Confirm Code: " + code + " (y/n): ", "y", "y")) {
                listCodes.push(code)
                if (confirmPrompt("Do you want to add another code? (yes/no): ", "yes", "no")) {
                    addCode()
                }
            } else {
                addCode()
            }
        }
        addCode()
    }
    if (confirmPrompt("Prompts Finished, continue to script? (yes/no): ", "yes", "yes")) {
        main_code(listCodes, username)
    } else {
        alert("Auto-Redeemer Session Closed.")
        messageGenerator("Auto-Redeemer Session Closed.")
    }
}

// Line Code Break

start_cons = `
██╗░░██╗░█████╗░███████╗███████╗███╗░░░███╗░░░░██████╗░░██████╗░
██║░░██║██╔══██╗╚════██║██╔════╝████╗░████║░░░██╔════╝░██╔════╝░
███████║███████║░░███╔═╝█████╗░░██╔████╔██║░░░██║░░██╗░██║░░██╗░
██╔══██║██╔══██║██╔══╝░░██╔══╝░░██║╚██╔╝██║░░░██║░░╚██╗██║░░╚██╗
██║░░██║██║░░██║███████╗███████╗██║░╚═╝░██║██╗╚██████╔╝╚██████╔╝
╚═╝░░╚═╝╚═╝░░╚═╝╚══════╝╚══════╝╚═╝░░░░░╚═╝╚═╝░╚═════╝░░╚═════╝░

██████╗░███████╗██████╗░███████╗███████╗███╗░░░███╗███████╗██████╗░
██╔══██╗██╔════╝██╔══██╗██╔════╝██╔════╝████╗░████║██╔════╝██╔══██╗
██████╔╝█████╗░░██║░░██║█████╗░░█████╗░░██╔████╔██║█████╗░░██████╔╝
██╔══██╗██╔══╝░░██║░░██║██╔══╝░░██╔══╝░░██║╚██╔╝██║██╔══╝░░██╔══██╗
██║░░██║███████╗██████╔╝███████╗███████╗██║░╚═╝░██║███████╗██║░░██║
╚═╝░░╚═╝╚══════╝╚═════╝░╚══════╝╚══════╝╚═╝░░░░░╚═╝╚══════╝╚═╝░░╚═╝

Hello Hazem User!
Continue with the following prompts to setup your auto-redeemer session!

(This script is not made by hazem)
hazem.gg is made by false_dev from Quataun. This script reserves rights for Quataun for any action.
Any modification from outside of this script may be in void.
EFAZDEV IS NOT AFFILIATED WITH QUATAUN OR HAZEM.

Logs are shown below:
`;
console.log(start_cons)
prompts()

/* 

Example:
main_code(["DICE$blahblah", "DICE$blahbah", "DICE$woahwah"], "EfazDev") 

Useful Tools:
https://pinetools.com/add-text-each-line - Add text to each beginning or ending of a line. Useful for adding the " at the beginning and ", at the ending.

Example:
"DICE$blahblah",
"DICE$blahbah",
"DICE$woahwah",

(Add [ before and ] after each and remove the comma after the last code.)

Example:
["DICE$blahblah", "DICE$blahbah", "DICE$woahwah"]

*/