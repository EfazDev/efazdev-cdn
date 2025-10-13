import os
import sys
import requests
import subprocess
import json

os.system("cls" if os.name == "nt" else 'echo "\033c\033[3J"; clear')
version = "v1.1.5"
hideBackgroundConsole = True
console_logs = []

def printBackgroundConsole(message):
    if hideBackgroundConsole == False and __name__ == "__main__":
        print(message)
        console_logs.append(message)

printBackgroundConsole("--------")
printBackgroundConsole("Clearing Previous Console messages..")
printBackgroundConsole("Loading Blacklisted Words..")

if os.path.exists("logger_word.json"):
    with open("logger_word.json") as f:
        data = json.loads(f.read())
    if data.get("UseOnlineJSON"):
        # Latest Version of JSON
        if data["UseOnlineJSON"] == True:
            result = requests.get(
                "https://raw.githubusercontent.com/EfazDev/efazdev-cdn/main/json/logger_word.json"
            )
            result = result.json()
            blacklisted_words = result["BlacklistedWords"]
            whitelisted_words = result["WhitelistedWords"]
            if result.get("AuthorizedFilesOrDirectorys"):
                if result.get("EnabledAuthorizedFiles") and result["EnabledAuthorizedFiles"] == True:
                    authorized_files = result["AuthorizedFilesOrDirectorys"]
                else:
                    authorized_files = []
            else:
                authorized_files = []
            printBackgroundConsole("Loaded Online JSON..")
        else:
            blacklisted_words = data["BlacklistedWords"]
            whitelisted_words = data["WhitelistedWords"]
            if data.get("AuthorizedFilesOrDirectorys"):
                if data.get("EnabledAuthorizedFiles") and data["EnabledAuthorizedFiles"] == True:
                    authorized_files = data["AuthorizedFilesOrDirectorys"]
                else:
                    authorized_files = []
            else:
                authorized_files = []
            printBackgroundConsole("Loaded JSON File.")
    else:
        blacklisted_words = data["BlacklistedWords"]
        whitelisted_words = data["WhitelistedWords"]
        if data.get("AuthorizedFilesOrDirectorys"):
            if data.get("EnabledAuthorizedFiles") and data["EnabledAuthorizedFiles"] == True:
                authorized_files = data["AuthorizedFilesOrDirectorys"]
            else:
                authorized_files = []
        else:
            authorized_files = []
        printBackgroundConsole("Loaded JSON File.")
else:
    blacklisted_words = [
        {
            "word": "exec(",
            "mean": "Suspicious function used for running code from a string.",
            "level": 5
        },
        {
            "word": "exec(requests.",
            "mean": "Suspicious function used for running code from the internet.",
            "level": 5
        },
        {
            "word": "exec(conn.",
            "mean": "Suspicious function used for running code from the internet.",
            "level": 5
        },
        {
            "word": "eval(",
            "mean": "Suspicious function used for running code from the internet.",
            "level": 5
        },
        {
            "word": "exec(session.",
            "mean": "Suspicious function used for running code from the internet.",
            "level": 5
        },
        {
            "word": "fork(",
            "mean": "May be used as a background process.",
            "level": 4
        },
        {
            "word": "fork(session.",
            "mean": "May be used as a background process from the internet.",
            "level": 4
        },
        {
            "word": "fork(conn.",
            "mean": "May be used as a background process from the internet.",
            "level": 4
        },
        {
            "word": "fork(requests.",
            "mean": "May be used as a background process from the internet.",
            "level": 4
        },
        {
            "word": "ip_address",
            "mean": "This script mentions word IP.",
            "level": 4
        },
        {
            "word": "ipify",
            "mean": "This script uses your IP Address.",
            "level": 4
        },
        {
            "word": "grabify",
            "mean": "This script uses your IP Address.",
            "level": 4
        },
        {
            "word": "steal",
            "mean": "This script mentions word steal.",
            "level": 4
        },
        {
            "word": "localhost",
            "mean": "This script mentions using localhost on your network.",
            "level": 4
        },
        {
            "word": "logger",
            "mean": "Word logger detected.",
            "level": 4
        },
        {
            "word": "127.0.0.1",
            "mean": "This script mentions an localhost IP.",
            "level": 3
        },
        {
            "word": "trade",
            "mean": "This word was detected and this could be used to trade other users.",
            "level": 3
        },
        {
            "word": ".ROBLOSECURITY",
            "mean": "This script uses your Roblox Security Cookie. (Please check contents to see if its used for right purposes.)",
            "level": 3
        },
        {
            "word": "x-csrf-token",
            "mean": "This script is using a header that may be required for advanced options in websites with a cookie.",
            "level": 3
        },
        {
            "word": "os.system(",
            "mean": "Script runs code in the console.",
            "level": 2
        },
        {
            "word": "/webhooks/",
            "mean": "Uses a site to send a webhook",
            "level": 2
        },
        {
            "word": "raw.",
            "mean": "Connects to a raw version of a site",
            "level": 2
        },
        {
            "word": "raw.githubusercontent.com",
            "mean": "Connects to GitHub's Raw API.",
            "level": 2
        },
        {
            "word": "microsoft.com",
            "mean": "Connects to Microsoft's API.",
            "level": 2
        },
        {
            "word": "minecraft.net",
            "mean": "Connects to Minecraft's API.",
            "level": 2
        },
        {
            "word": "tinyurl",
            "mean": "Known site for shorting urls.",
            "level": 2
        },
        {
            "word": "bit.ly",
            "mean": "Known site for shorting urls.",
            "level": 2
        },
        {
            "word": "rb.gy",
            "mean": "Known site for shorting urls.",
            "level": 2
        },
        {
            "word": "bl.ink",
            "mean": "Known site for shorting urls.",
            "level": 2
        },
        {
            "word": "zpr.io",
            "mean": "Known site for shorting urls.",
            "level": 2
        },
        {
            "word": "short.gy",
            "mean": "Known site for shorting urls.",
            "level": 2
        },
        {
            "word": "t.ly",
            "mean": "Known site for shorting urls.",
            "level": 2
        },
        {
            "word": "pckd.me",
            "mean": "Known site for shorting urls.",
            "level": 2
        },
        {
            "word": "is.gd",
            "mean": "Known site for shorting urls.",
            "level": 2
        },
        {
            "word": "ow.ly",
            "mean": "Known site for shorting urls.",
            "level": 2
        },
        {
            "word": "3.ly",
            "mean": "Known site for shorting urls.",
            "level": 2
        },
        {
            "word": "tiny.cc",
            "mean": "Known site for shorting urls.",
            "level": 2
        },
        {
            "word": "clicky.me",
            "mean": "Known site for shorting urls.",
            "level": 2
        },
        {
            "word": "buff.ly",
            "mean": "Known site for shorting urls.",
            "level": 2
        },
        {
            "word": "t2mio.com",
            "mean": "Known site for shorting urls.",
            "level": 2
        },
        {
            "word": "cutt.ly",
            "mean": "Known site for shorting urls.",
            "level": 2
        },
        {
            "word": "shorturl.at",
            "mean": "Known site for shorting urls.",
            "level": 2
        },
        {
            "word": "smallseotools.com",
            "mean": "Known site for shorting urls.",
            "level": 2
        },
        {
            "word": "linksplit.io",
            "mean": "Known site for shorting urls.",
            "level": 2
        },
        {
            "word": "short.io",
            "mean": "Known site for shorting urls.",
            "level": 2
        },
        {
            "word": "kutt.it",
            "mean": "Known site for shorting urls.",
            "level": 2
        },
        {
            "word": "switchy.io",
            "mean": "Known site for shorting urls.",
            "level": 2
        },
        {
            "word": "gg.gg",
            "mean": "Known site for shorting urls.",
            "level": 2
        },
        {
            "word": "urlr.me",
            "mean": "Known site for shorting urls.",
            "level": 2
        },
        {
            "word": "name.com",
            "mean": "Known site for shorting urls.",
            "level": 2
        },
        {
            "word": "linkhuddle.com",
            "mean": "Known site for shorting urls.",
            "level": 2
        },
        {
            "word": "discord.com",
            "mean": "Connects to Discord's API",
            "level": 2
        },
        {
            "word": "cookie",
            "mean": "Gets Cookie",
            "level": 2
        },
        {
            "word": "ctypes",
            "mean": "Known module for checking if python script is using administrator permissions.",
            "level": 2
        },
        {
            "word": "discordapp.com",
            "mean": "Connects to Discord's API",
            "level": 2
        },
        {
            "word": "discordapp.net",
            "mean": "Connects to Discord's API",
            "level": 2
        },
        {
            "word": "take",
            "mean": "This script mentions word take.",
            "level": 2
        },
        {
            "word": "IP",
            "mean": "This script mentions word IP. Check if this script contains the word IP as it maybe detected between words.",
            "level": 1
        },
        {
            "word": "roblox.com",
            "mean": "Connects to Roblox's Servers.",
            "level": 1
        },
        {
            "word": "minecraft",
            "mean": "Mentions word minecraft",
            "level": 1
        },
        {
            "word": "microsoft",
            "mean": "Mentions word microsoft",
            "level": 1
        },
        {
            "word": "http://",
            "mean": "This script connects to an unsecured website.",
            "level": 1
        },
        {
            "word": "github.com",
            "mean": "Connects to GitHub",
            "level": 1
        },
        {
            "word": "requests",
            "mean": "This script connects to the internet.",
            "level": 1
        },
        {
            "word": "fetch(",
            "mean": "This script connects to the internet.",
            "level": 1
        },
        {
            "word": "platform",
            "mean": "Gets device info",
            "level": 1
        },
        {
            "word": "subprocess",
            "mean": "Create an another process from Python script.",
            "level": 1
        },
        {
            "word": "pastebin",
            "mean": "This script uses pastebin.com for unknown reasons which may be a logger or not.",
            "level": 1
        },
        {
            "word": "https://",
            "mean": "This script connects to the internet securely",
            "level": 0
        }
    ]
    whitelisted_words = []
    authorized_files = []
    printBackgroundConsole("Loaded filled JSON in Script")

printBackgroundConsole("Loading Color Module..")

def scan_contents(content):
    contentsFound = []
    if not content.find("Efaz's Logger Detector") == -1:
        if (
            not content.find(
                'printMainMessage("If you find a level 3, this means the script is using forbidden words that are dangerous.")'
            )
            == -1
        ):
            if (
                not content.find(
                    'print("Loading Color Module..")'
                )
                == -1
            ):
                return [
                    {
                        "word": "Logger Detector",
                        "mean": "This script identifies as this copy of the logger detector. If you think this is not a detector, this is mostly a logger hiding.",
                        "level": 0,
                    }
                ]
            else:
                return [
                    {
                        "word": "Warning!",
                        "mean": "This script is trying to identify as this logger detector! Do not run the script scanned!",
                        "level": 5,
                    }
                ]
        else:
            return [
                {
                    "word": "Warning!",
                    "mean": "This script is trying to identify as this logger detector! Do not run the script scanned!",
                    "level": 5,
                }
            ]
    else:
        for word in blacklisted_words:
            if not content.find(word["word"]) == -1:
                json_use = {}
                if word["word"] in whitelisted_words:
                    json_use = {
                        "word": word["word"],
                        "mean": "Whitelisted word",
                        "level": 0,
                    }
                else:
                    if content.count(word["word"]) > 1:
                        json_use = {
                            "word": word["word"],
                            "mean": word["mean"]
                            + " + "
                            + str(content.count(word["word"]) - 1)
                            + " more mentions",
                            "level": word["level"],
                        }
                    else:
                        json_use = word
                contentsFound.append(json_use)
        return contentsFound

def testIfURL(text):
    enabled = True
    if os.path.exists("logger_word.json"):
        with open("logger_word.json") as f:
            data = json.loads(f.read())
        if data.get("ScanForOnlineLinks"):
            if data["ScanForOnlineLinks"] == False:
                enabled = False

    if enabled == False:
        return {"success": False, "statement": "URL Scanning is Disabled"}

    try:
        if text.startswith("https://"):
            req = requests.get(text)
            if req.status_code == 404:
                return {
                    "success": False,
                    "statement": "Website returns 404 (Not Found)",
                }
            else:
                if "text/html" in req.headers["content-type"]:
                    return {
                        "success": False,
                        "statement": "Received HTML instead of raw code.",
                    }
                else:
                    return {
                        "success": True,
                        "statement": "This is a valid website with a SSL certificate",
                    }
        elif text.startswith("http://"):
            req = requests.get(text)
            if req.status_code == 404:
                return {
                    "success": False,
                    "statement": "Website returns 404 (Not Found)",
                }
            else:
                if "text/html" in req.headers["content-type"]:
                    return {
                        "success": False,
                        "statement": "Received HTML instead of raw code.",
                    }
                else:
                    return {
                        "success": True,
                        "statement": "This is a valid website with no SSL certificate",
                    }
        else:
            return {"success": False, "statement": "Not a valid URL"}
    except Exception as e:
        return {"success": False, "statement": str(e)}

def printErrorMessage(mes):
    print(f"\x1b[38;2;255;0;0m{mes}\033[38;5;231m")
    console_logs.append(mes + " - ERROR")

def printMainMessage(mes):
    print(f"\033[38;5;255m{mes}\033[0m")
    console_logs.append(mes + " - Main")

def printErrorMessage(mes):
    print(f"\033[38;5;196m{mes}\033[0m")
    console_logs.append(mes + " - ERROR")

def printSuccessMessage(mes):
    print(f"\033[38;5;82m{mes}\033[0m")
    console_logs.append(mes + " - SUCCESS")

def printWarnMessage(mes):
    print(f"\033[38;5;202m{mes}\033[0m")
    console_logs.append(mes + " - WARN")

def checkFileAuthorized(dir):
    found = False
    for file in authorized_files:
        if not file.find(dir) == -1:
            found = True
    return found

def genLevelMess(message, level):
    if level == 1:
        return f"\x1b[38;2;255;255;0m{message}\033[38;5;231m"
    elif level == 2:
        return f"\x1b[38;2;255;75;0m{message}\033[38;5;231m"
    elif level == 3:
        return f"\x1b[38;2;255;0;0m{message}\033[38;5;231m"
    elif level == 4:
        return f"\x1b[38;2;255;0;255m{message}\033[38;5;231m"
    elif level == 5:
        return f"\x1b[38;2;0;0;255m{message}\033[38;5;231m"
    else:
        return f"\x1b[38;2;0;255;0m{message}\033[38;5;231m"

def genoption(level):
    if level == 1:
        return f"\x1b[38;2;255;255;0mThis script is maybe safe\033[38;5;231m"
    elif level == 2:
        return f"\x1b[38;2;255;75;0mThis script is maybe a logger\033[38;5;231m"
    elif level == 3:
        return f"\x1b[38;2;255;0;0mThis script is maybe 50% a logger\033[38;5;231m"
    elif level == 4:
        return f"\x1b[38;2;255;0;255mThis script is 75% a logger\033[38;5;231m"
    elif level == 5:
        return f"\x1b[38;2;0;0;255mThis script is 100% a logger\033[38;5;231m"
    else:
        return f"\x1b[38;2;0;255;0mThis script is safe\033[38;5;231m"

def scanAPI(dir):
    URLTest = testIfURL(dir)
    result = ["", 1]
    if URLTest["success"] == False and not URLTest["statement"] == "Not a valid URL":
        printErrorMessage("Error while testing URL: " + URLTest["statement"])
        return {"error": URLTest["statement"], "code": 400}
    if os.path.isfile(dir):
        result = [dir, 1]
    elif URLTest["success"] == True:
        result = [dir, 2]
    else:
        printErrorMessage("File not found")
        return {"error": "File not found", "code": 404}

    if result[1] == 1:
        with open(result[0]) as f:
            file_contents = f.read()
    elif result[1] == 2:
        file_contents = requests.get(result[0]).text
    else:
        printErrorMessage("Script brought an invalid type of directory.")
        file_contents = ""

    if checkFileAuthorized(dir):
        listFound = [
            {
                "word": "Whitelisted or Authorized File",
                "mean": "This file was whitelisted as having no viruses. If you think you never added it to your list, remove it from your list ASAP!",
                "level": 0
            }
        ]
    else:
        listFound = scan_contents(file_contents)
    highestLevel = 0
    for item in listFound:
        if item["level"] > highestLevel:
            highestLevel = item["level"]

    json = {
        "highestLevel": highestLevel,
        "itemList": listFound,
        "typeOfDirectory": result[1],
        "directory": result[0],
        "safeLevelMessage": f"Safe Level: {genoption(highestLevel)} (Level: {genLevelMess(str(highestLevel), highestLevel)})",
    }
    return json
    
def getItemData(item_name):
    itemFound = {
        "word": item_name,
        "mean": "Item is not found in blacklisted words.",
        "level": 0
    }
    for i in blacklisted_words:
        if i["word"] == item_name:
            itemFound = i
    return itemFound

if __name__ == "__main__":
    printMainMessage("--------")
    printWarnMessage("Welcome to Efaz's Logger Detector!")
    printWarnMessage(
        "Used for finding if following words were found in your python script."
    )
    printWarnMessage(
        "If you find a level 3, this means the script is using forbidden words that are dangerous."
    )
    printWarnMessage(f"Script Version {version}")

    # Secured within this script only and can't be used within the module.

    def deleteDirectory(dir):
        if os.path.exists(dir):
            try:
                os.remove(dir)
                return {"success": True}
            except Exception as e:
                return {"success": False}
        else:
            return {"success": False}

    def argumentHandler(args):
        if len(args) > 2:
            arg1 = args[1]
            arg2 = args[2]

            main_directory = ""

            if arg1 == "-console":
                main_directory = arg2
                listFound2 = scanAPI(main_directory)
                if listFound2.get("error"):
                    printErrorMessage(
                        f"Error while scanning file: {listFound2['error']} ({str(listFound2['code'])})"
                    )
                else:
                    printMainMessage("--------")
                    printMainMessage("")
                    printMainMessage("Scan Finished!")
                    printMainMessage("Results are below:")
                    printMainMessage("")
                    printMainMessage("Directory: " + main_directory)
                    printMainMessage(
                        f"Safe Level: {genoption(listFound2['highestLevel'])} (Level: {genLevelMess(str(listFound2['highestLevel']), listFound2['highestLevel'])})"
                    )
                    if len(listFound2["itemList"]) > 0:
                        printMainMessage("Items that were found in the script:")
                        printMainMessage("")
                        for item in listFound2["itemList"]:
                            print(
                                genLevelMess(
                                    item["word"]
                                    + " - "
                                    + item["mean"]
                                    + " - Level: "
                                    + str(item["level"]),
                                    item["level"],
                                )
                            )
                            console_logs.append(genLevelMess(
                                item["word"]
                                + " - "
                                + item["mean"]
                                + " - Level: "
                                + str(item["level"]),
                                item["level"],
                            ))
                        printMainMessage("")
                    else:
                        printMainMessage("Items that were found in the script:")
                        printMainMessage("")
                        printSuccessMessage("None were found")
                        printMainMessage("")
                    printMainMessage("--------")
                    if (
                        listFound2["highestLevel"] > 2
                        and listFound2["typeOfDirectory"] == 1
                    ):
                        printMainMessage(
                            "Would you like to delete the file as its 50% or more untrusted? (y/n): "
                        )
                        if input(">> ").lower() == "y":
                            res = deleteDirectory(main_directory)
                            if res["success"] == True:
                                printSuccessMessage(
                                    "Successfully deleted the file from system: "
                                    + main_directory
                                )
                            else:
                                printErrorMessage(
                                    "Failed to delete the file from your system."
                                )
            elif arg1 == "-json":
                main_directory = arg2
                printMainMessage(json.dumps(scanAPI(main_directory)))
            elif arg1 == "-scanrun":
                main_directory = arg2
                api_result = scanAPI(main_directory)

                if api_result.get("error"):
                    printErrorMessage(f"Error while loading script: {api_result['error']} ({str(api_result['code'])})")
                else:
                    printMainMessage("-----------")
                    if api_result["typeOfDirectory"] == 2:
                        printErrorMessage("Failed to run script: Script is online and cannot be downloaded.")
                    elif api_result["highestLevel"] > 2:
                        printErrorMessage("WARNING!")
                        printErrorMessage("Script has been detected above the dangerous zone!")
                        printMainMessage("Highest Level: " + genLevelMess(str(api_result["highestLevel"]), api_result["highestLevel"]))
                        printMainMessage("-----------")
                        printMainMessage("Following Items:")

                        for i in api_result["itemList"]:
                            if i["level"] > 2:
                                print(genLevelMess(
                                    i["word"]
                                    + " - "
                                    + i["mean"]
                                    + " - Level: "
                                    + str(i["level"]),
                                    i["level"],
                                ))
                                console_logs.append(genLevelMess(
                                    i["word"]
                                    + " - "
                                    + i["mean"]
                                    + " - Level: "
                                    + str(i["level"]),
                                    i["level"],
                                ))
                        printMainMessage("-----------")
                        printMainMessage("Please choose from the following options:")
                        printMainMessage("")
                        printSuccessMessage("1 - Delete File from System")
                        printErrorMessage("2 - Run Script Anyway")
                        printWarnMessage("3 - Ignore and don't run the script.")
                        printMainMessage("")
                        selectionInput = input(">> ")
                        if selectionInput == "1":
                            res = deleteDirectory(main_directory)
                            if res["success"] == True:
                                printSuccessMessage("File has been deleted from the system.")
                            else:
                                printErrorMessage("File was unable to be deleted.")
                        elif selectionInput == "2":
                            printErrorMessage("Running script under dangerous zone.")
                            subprocess.Popen([sys.executable, main_directory])
                        else:
                            printWarnMessage("Ignored Script and not ran.")
                    else:
                        printSuccessMessage("Script is under dangerous mode. Running script..")
                        subprocess.Popen([sys.executable, main_directory])
            elif arg1 == "-list":
                listFound2 = scan_contents(json.dumps(blacklisted_words))
                printMainMessage("--------")
                printMainMessage("")
                printMainMessage("List of words blacklisted below:")
                printMainMessage("")
                if len(listFound2) > 0:
                    for item in listFound2:
                        print(
                            genLevelMess(
                                item["word"]
                                + " - "
                                + item["mean"]
                                + " - Level: "
                                + str(item["level"]),
                                item["level"],
                            )
                        )
                        console_logs.append(genLevelMess(
                            item["word"]
                            + " - "
                            + item["mean"]
                            + " - Level: "
                            + str(item["level"]),
                            item["level"],
                        ))
                    printMainMessage("")
                else:
                    printSuccessMessage("None were found")
                    printMainMessage("")
                printMainMessage("--------")
                printMainMessage("")
                printMainMessage("List of words whitelisted below:")
                printMainMessage("")
                if len(whitelisted_words) > 0:
                    for item in whitelisted_words:
                        item_data = getItemData(item)
                        print(
                            genLevelMess(
                                item_data["word"]
                                + " - "
                                + item_data["mean"]
                                + " - Level: "
                                + str(item_data["level"]),
                                item_data["level"],
                            )
                        )    
                        console_logs.append(genLevelMess(
                                item_data["word"]
                                + " - "
                                + item_data["mean"]
                                + " - Level: "
                                + str(item_data["level"]),
                                item_data["level"],
                            ))
                    printMainMessage("")
                else:
                    printSuccessMessage("None were found")
                    printMainMessage("")
                printMainMessage("--------")
            else:
                printErrorMessage(
                    "Error while scanning file: Argument 1 is not -json, -console, -list or -scanrun."
                )

    def mainScript(dir):
        directory = ""
        typeOfDir = 1

        def promptDir():
            printMainMessage("--------")
            printMainMessage("Directory Section:")
            asked = input("What's your script to scan: ")
            asked = asked.replace("'", "")
            printMainMessage("Directory: " + asked)
            printMainMessage("----")
            printMainMessage("This is correct? (y/n): ")
            if input(">> ").lower() == "y":
                URLTest = testIfURL(asked)
                if (
                    URLTest["success"] == False
                    and not URLTest["statement"] == "Not a valid URL"
                ):
                    printErrorMessage(
                        "Error while testing URL: " + URLTest["statement"]
                    )
                if os.path.isfile(asked):
                    return [asked, 1]
                elif URLTest["success"] == True:
                    printSuccessMessage(URLTest["statement"])
                    return [asked, 2]
                else:
                    printErrorMessage("File not found: Restarting..")
                    return promptDir()
            else:
                return promptDir()

        if dir == "":
            result = promptDir()
            directory = result[0]
            typeOfDir = result[1]
        else:
            directory = dir
            typeOfDir = 1

        if typeOfDir == 1:
            with open(directory) as f:
                file_contents = f.read()
        elif typeOfDir == 2:
            file_contents = requests.get(directory).text
        else:
            printErrorMessage("Script brought an invalid type of directory.")
            file_contents = ""

        if checkFileAuthorized(dir):
            listFound = [
                {
                    "word": "Whitelisted or Authorized File",
                    "mean": "This file was whitelisted as having no viruses. If you think you never added it to your list, remove it from your list ASAP!",
                    "level": 0
                }
            ]
        else:
            listFound = scan_contents(file_contents)
        highestLevel = 0
        for item in listFound:
            if item["level"] > highestLevel:
                highestLevel = item["level"]
        printMainMessage("--------")
        printMainMessage("")
        printMainMessage("Scan Finished!")
        printMainMessage("Results are below:")
        printMainMessage("")
        printMainMessage("Directory: " + directory)
        printMainMessage(
            f"Safe Level: {genoption(highestLevel)} (Level: {genLevelMess(str(highestLevel), highestLevel)})"
        )
        if len(listFound) > 0:
            printMainMessage("Items that were found in the script:")
            printMainMessage("")
            for item in listFound:
                print(
                    genLevelMess(
                        item["word"]
                        + " - "
                        + item["mean"]
                        + " - Level: "
                        + str(item["level"]),
                        item["level"],
                    )
                )
                console_logs.append(genLevelMess(
                        item["word"]
                        + " - "
                        + item["mean"]
                        + " - Level: "
                        + str(item["level"]),
                        item["level"],
                    ))
            printMainMessage("")
        else:
            printMainMessage("Items that were found in the script:")
            printMainMessage("")
            printSuccessMessage("None were found")
            printMainMessage("")
        if highestLevel > 2 and typeOfDir == 1:
            printMainMessage("--------")
            printMainMessage(
                "Would you like to delete the file as its 50% or more untrusted? (y/n): "
            )
            if input(">> ").lower() == "y":
                res = deleteDirectory(directory)
                if res["success"] == True:
                    printSuccessMessage(
                        "Successfully deleted the file from system: " + directory
                    )
                else:
                    printErrorMessage("Failed to delete the file from your system.")
        else:
            printMainMessage("--------")
            printMainMessage(
                "Deletion Assistant not started since this script doesn't reach highest level requirement."
            )
        printMainMessage("--------")
        printMainMessage("Try again with another file? (y/n): ")
        if input(">> ").lower() == "y":
            mainScript("")
        else:
            exit()

    if len(sys.argv) > 2:
        argumentHandler(sys.argv)
    else:
        mainScript("")
else:
    def getConsoleLogs():
        return console_logs
    
    def logger_detector_info():
        return {
            "version": version,
            "backgroundConsoleHidden": hideBackgroundConsole
        }
    
    if hideBackgroundConsole == False:
        printMainMessage("Mode Detected: " + __name__)
        printMainMessage("File Ran: " + __file__)
        printSuccessMessage("Activated Module Mode.")