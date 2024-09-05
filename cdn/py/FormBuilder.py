import json
import os
import platform
import sys

def whichPythonCommand():
    LocalMachineOS = platform.system()
    if (
        LocalMachineOS == "win32"
        or LocalMachineOS == "win64"
        or LocalMachineOS == "Windows"
    ):
        return "python"
    else:
        return "python3"

if whichPythonCommand() == "python3":
    os.system("clear")
else:
    os.system("cls")

def printMainMessage(mes):
    print(f"\033[38;5;255m{mes}\033[0m")

def printErrorMessage(mes):
    print(f"\033[38;5;196m{mes}\033[0m")

def printSuccessMessage(mes):
    print(f"\033[38;5;82m{mes}\033[0m")

def printWarnMessage(mes):
    print(f"\033[38;5;202m{mes}\033[0m")

def printDebugMessage(mes):
    print(f"\033[38;5;226m{mes}\033[0m")
    
printWarnMessage("Welcome to Efaz's Form Builder!")
printWarnMessage("Script Version 1.0.0")
printWarnMessage("")
printWarnMessage("This script allows you to build your Form JSON using our form system!")
printWarnMessage("Made by @efazdev on Discord (efaz.dev)")
printWarnMessage("")
printWarnMessage("Console: ")

main_json = {
    "title": "",
    "icon_url": "",
    "questions": [],
    "googleCaptcha": {
        "enabled": False,
        "siteKey": "",
        "jsonName": "g_captcha"
    },
    "cloudflareCaptcha": {
        "enabled": False,
        "siteKey": "",
        "jsonName": "c_captcha"
    },
    "hideModeSelection": True,
    "showCurrentMode": False,
    "defaultMode": "None",
    "modes": [],
    "specific_settings": {
        "showRequiredText": True,
        "showModeInButtonText": False,
        "custom_css": "",
        "hideIcon": False
    }
}

printMainMessage("----------")
printMainMessage("Basics")
printMainMessage("----------")
main_json["title"] = input("Enter the title of the form: ")
main_json["icon_url"] = input("Enter the URL of the icon you're going to use (Will be shown on top the form title): ")
questions = []
questionCount = 0
def questionCreator():
    global questionCount
    new_question_field = {
        "name": "",
        "jsonName": "",
        "type": "Short Response",
        "placeholder": "",
        "required": True,
        "custom_class": ""
    }
    questionCount = questionCount + 1
    printMainMessage(f"Question #{questionCount}")
    new_question_field["name"] = input("Enter the name of the question: ")
    new_question_field["jsonName"] = input("Enter the json name that will be inside the request: ")
    def selectOne():
        printMainMessage("""Select one out of the list of types!

(1) - Short Response
(2) - Detailed Message
(3) - Integer
(4) - Email
(5) - Password
(6) - Time
(7) - Datetime Local
(8) - Selection
(9) - Image
(10) - Video
(11) - Audio
(12) - Date
(13) - Color
                        
    """)
        selected_mode_of_question = input("Enter number: ")
        if (selected_mode_of_question == "1"):
            new_question_field["type"] = "Short Response"
        elif (selected_mode_of_question == "2"):
            new_question_field["type"] = "Detailed Message"
        elif (selected_mode_of_question == "3"):
            new_question_field["type"] = "Integer"
        elif (selected_mode_of_question == "4"):
            new_question_field["type"] = "Email"
        elif (selected_mode_of_question == "5"):
            new_question_field["type"] = "Password"
        elif (selected_mode_of_question == "6"):
            new_question_field["type"] = "Time"
        elif (selected_mode_of_question == "7"):
            new_question_field["type"] = "Datetime Local"
        elif (selected_mode_of_question == "8"):
            new_question_field["type"] = "Selection"
        elif (selected_mode_of_question == "9"):
            new_question_field["type"] = "Image"
        elif (selected_mode_of_question == "10"):
            new_question_field["type"] = "Video"
        elif (selected_mode_of_question == "11"):
            new_question_field["type"] = "Audio"
        elif (selected_mode_of_question == "12"):
            new_question_field["type"] = "Date"
        elif (selected_mode_of_question == "13"):
            new_question_field["type"] = "Color"
        else:
            selectOne()
    selectOne()
    if new_question_field["type"] == "Selection":
        printMainMessage("Selection: ")
        currentPlaceholder = []
        def addSelection():
            currentPlaceholder.append({"name": input("Enter name of value: "), "value": input("Enter value that will be sent to the server: ")})
            printMainMessage("Would you like to add an another value to selection? (y/n)")
            if input(">> ").lower() == "y":
                addSelection()
        addSelection()
        new_question_field["placeholder"] = currentPlaceholder
    else:
        printMainMessage("Placeholder: ")
        new_question_field["placeholder"] = input("Enter the placeholder for this question: ")
    
    printMainMessage("Is this question gonna be required for the server? (y/n)")
    if input(">> ").lower() == "y":
        new_question_field["required"] = True
    else:
        new_question_field["required"] = False

    printMainMessage("Would you like to enter a custom CSS class for the input element when loaded the HTML page? (y/n)")
    if input(">> ").lower() == "y":
        new_question_field["custom_class"] = input("Enter class name: ")
    else:
        new_question_field["custom_class"] = ""

    questions.append(new_question_field)
    printSuccessMessage(f"Successfully created question #{questionCount}! Hooray!")
    printSuccessMessage("Would you like to create an another question? (y/n)")
    if input(">> ").lower() == "y":
        questionCreator()
questionCreator()
main_json["questions"] = questions
printMainMessage("----------")
printMainMessage("Captcha")
printMainMessage("----------")
printMainMessage("Would you like to enable a captcha? (y/n)")
if input(">> ").lower() == "y":
    def selectOne():
        printMainMessage("""Please select one of the currently supported captcha handlers:
                    
(1) - Cloudflare
(2) - reCAPTCHA (Google)  
                            
""")
        selected_captcha = input("Enter number: ")
        if (selected_captcha == "1"):
            main_json["cloudflareCaptcha"]["enabled"] = True
            main_json["cloudflareCaptcha"]["siteKey"] = input("Enter the site key you're going to be providing to Cloudflare: ")
            main_json["cloudflareCaptcha"]["jsonName"] = input("Enter the JSON name that is going to provide the user response in the request JSON: ")
            printSuccessMessage("Finished Invisible Captcha Setup!")
        elif (selected_captcha == "2"):
            main_json["googleCaptcha"]["enabled"] = True
            main_json["googleCaptcha"]["siteKey"] = input("Enter the site key you're going to be providing to reCAPTCHA: ")
            main_json["googleCaptcha"]["jsonName"] = input("Enter the JSON name that is going to provide the user response in the request JSON: ")
            printSuccessMessage("Finished Invisible Captcha Setup!")
        else:
            selectOne()
    selectOne()

printMainMessage("----------")
printMainMessage("Modes")
printMainMessage("----------")
modeCount = 0
def createMode():
    global modeCount
    modeCount = modeCount + 1
    printMainMessage(f"Mode #{modeCount}")
    new_mode_field = {
        "name": "None",
        "api_url": "",
        "type_of_api": "POST",
        "formatted": [],
        "thanksMessage": "",
        "showTryAgainOnSuccess": False,
        "showTypeOfModeInBody": False
    }
    new_mode_field["name"] = input("Enter the name of the mode: ")
    if main_json["defaultMode"] == "None":
        printMainMessage("Will this be your default mode? (y/n)")
        if input(">> ").lower() == "y":
            main_json["defaultMode"] = new_mode_field["name"]
    new_mode_field["api_url"] = input("Enter the API URL that the Form System will send the request to: ")
    def selectOne():
        printMainMessage("""Please select one of requests methods supported:
                    
(1) - POST
(2) - PUT
(3) - PATCH
                        
""")
        selected_method = input("Enter number: ")
        if (selected_method == "1"):
            new_mode_field["type_of_api"] = "POST"
        elif (selected_method == "2"):
            new_mode_field["type_of_api"] = "PUT"
        elif (selected_method == "3"):
            new_mode_field["type_of_api"] = "PATCH"
        else:
            selectOne()
    selectOne()
    for question in main_json["questions"]:
        printMainMessage(f"Should {question['jsonName']} be included in this API Link? (y/n)")
        if input(">> ").lower() == "y":
            new_format_field = {
                "questionName": question["name"],
                "jsonName": question["jsonName"],
                "in": "Body"
            }
            def selectOne():
                printMainMessage("""Please select where this question should be located at:
                            
(1) - Body
(2) - Parameters  
                                    
        """)
                selected_in = input("Enter number: ")
                if (selected_in == "1"):
                    new_format_field["in"] = "Body"
                elif (selected_in == "2"):
                    new_format_field["in"] = "URL"
                else:
                    selectOne()
            selectOne()
            new_mode_field["formatted"].append(new_format_field)
    new_mode_field["thanksMessage"] = input('Enter the Thank You message when the response is a success. Use {jsonMessage} for "message" key in response: ')
    printMainMessage("Would you like to show the Try Again button on success? (y/n)")
    if input(">> ").lower() == "y":
        new_mode_field["showTryAgainOnSuccess"] = True
    else:
        new_mode_field["showTryAgainOnSuccess"] = False
    printMainMessage("Would you like to show this mode inside the payload? (y/n)")
    if input(">> ").lower() == "y":
        new_mode_field["showTypeOfModeInBody"] = True
    else:
        new_mode_field["showTypeOfModeInBody"] = False

    printSuccessMessage(f"Successfully created mode: {new_mode_field['name']}")
    main_json["modes"].append(new_mode_field)
    printMainMessage("Would you like to create an another mode? (y/n)")
    if input(">> ").lower() == "y":
        createMode()
    else:
        if main_json["defaultMode"] == "None":
            main_json["defaultMode"] = new_mode_field["name"]
createMode()
printMainMessage("Would you like to show the option to select modes? (y/n)")
if input(">> ").lower() == "y":
    main_json["hideModeSelection"] = False
else:
    main_json["hideModeSelection"] = True

printMainMessage("Would you like to show current mode in HTML? (y/n)")
if input(">> ").lower() == "y":
    main_json["showCurrentMode"] = True
else:
    main_json["showCurrentMode"] = False

printMainMessage("----------")
printMainMessage("Specific Settings")
printMainMessage("----------")

printMainMessage("Would you like to show required text in every required question in HTML? (y/n)")
if input(">> ").lower() == "y":
    main_json["specific_settings"]["showRequiredText"] = True
else:
    main_json["specific_settings"]["showRequiredText"] = False

printMainMessage("Would you like to show mode in the button text? (y/n)")
if input(">> ").lower() == "y":
    main_json["specific_settings"]["showModeInButtonText"] = True
else:
    main_json["specific_settings"]["showModeInButtonText"] = False

printMainMessage("Would you like to hide the icon shown above the title? (y/n)")
if input(">> ").lower() == "y":
    main_json["specific_settings"]["hideIcon"] = True
else:
    main_json["specific_settings"]["hideIcon"] = False

main_json["specific_settings"]["custom_css"] = input("Enter Link of the CSS Stylesheet specialized for this form (Blank = No CSS, Changing stylesheets depends on the developer if supported): ")

printMainMessage("----------")
printMainMessage("Ending Basics")
printMainMessage("----------")

jsonInString = json.dumps(main_json)
printSuccessMessage("Woo hoo! You finally created the form!")
printSuccessMessage(f"Your final JSON: {jsonInString}")
printMainMessage("Would you like to save the JSON? (y/n)")
if input(">> ").lower() == "y":
    with open(f"{main_json['title'].replace(' ', '_')}_form.json", "w") as f:
        json.dump(main_json, f, indent=4)
    printSuccessMessage(f"Successfully created file: {main_json['title'].replace(' ', '_')}_form.json! This should be in the folder that the console pointed it to.")
printMainMessage("Would you like to create another form? (y/n)")
if input(">> ").lower() == "y":
    python = sys.executable
    os.execl(python, python, *sys.argv)