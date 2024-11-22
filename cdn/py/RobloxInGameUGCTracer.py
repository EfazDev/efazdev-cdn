import os
import sys
import requests
import re
import json

os.system("cls" if os.name == "nt" else 'echo "\033c\033[3J"; clear')
version = "v1.1.0"
hideBackgroundConsole = True
console_logs = []

def printBackgroundConsole(message):
    if hideBackgroundConsole == False and __name__ == "__main__":
        print(message)
        console_logs.append(message)

printBackgroundConsole("--------")
printBackgroundConsole("Clearing Previous Console messages..")
printBackgroundConsole("Loading Color Module..")

def printErrorMessage(mes):
    print(f"\x1b[38;2;255;0;0m{mes}\033[38;5;231m")
    console_logs.append(mes + " - ERROR")

def testIfInt(value):
    try:
        new_int = int(value)
        if new_int < 3000:
            return False
        return True
    except Exception as e:
        return False

def getLink(value):
    if testIfInt(value):
        return value
    else:
        try:
            new_value = re.findall("\d+", value)[0]
            return new_value
        except Exception as e:
            return None

def printMainMessage(mes):
    print(f"\033[38;5;255m{mes}\033[0m")
    console_logs.append(mes + " - Main")

def printSuccessMessage(mes):
    print(f"\033[38;5;82m{mes}\033[0m")
    console_logs.append(mes + " - SUCCESS")

def printWarnMessage(mes):
    print(f"\033[38;5;202m{mes}\033[0m")
    console_logs.append(mes + " - WARN")

if __name__ == "__main__":
    global granted_temp_playableapproved
    granted_temp_playableapproved = False

    printWarnMessage("Welcome to Efaz's Roblox In-Game UGC Tracer!")
    printWarnMessage(f"Script {version}")
    printWarnMessage("")
    printWarnMessage("This script allows you to find game links of an In-Game UGC Limited!")
    printWarnMessage("Made by Efaz from efaz.dev")
    printWarnMessage("")
    printWarnMessage("Console: ")
    def get_playable(id):
        if testIfInt(id):
            if os.path.exists("RobloxInGameUGCTracerPlayableEnabled") or granted_temp_playableapproved == True:
                url = "https://api.efaz.dev/api/roblox/accesslevel/" + str(id)
                res = requests.get(url)
                main_json = res.json()

                if main_json["success"]:
                    main_response = main_json["response"]
                    if len(main_response) > 0:
                        main_playable_list = {
                            "InsufficientPermissionGroupOnly": "Group Only",
                            "InsufficientPermissionFriendsOnly": "Friends Only",
                            "Playable": "Everyone can join",
                            "UnderReview": "Game is under review",
                            "UniverseRootPlaceIsPrivate": "Root Game is private",
                            "PlaceHasNoPublishedVersion": "Game is not published",
                            "": "Blank"
                        }
                        game_detail = main_response[0]
                        if main_playable_list.get(game_detail["playabilityStatus"]):
                            return main_playable_list[game_detail["playabilityStatus"]]
                        else:
                            return game_detail["playabilityStatus"]
                    else:
                        return "Failed to check access: ID might have been invalid"
                else:
                    return "Failed to check access: Request Failed"
            else:
                return "Disabled, enable it by doing enablePlayable() in the IDs field."
        else:
            return "Invalid Integer"
        
    def run(id, showrestart):
        url1 = f"https://economy.roblox.com/v2/assets/{id}/details"
        url2 = f"https://games.roblox.com/v1/games?universeIds="

        printMainMessage("Started session finding info about: " + str(id))
        try:
            res = requests.get(url1)
            main_json = res.json()
            if main_json.get("errors"):
                printErrorMessage("Error while getting request. More information is below:")
                print(f"---------------")
                print(f"Request #1")
                print(f"URL: {url1}")
                print(f"Status Code: {res.status_code}")
                print(f"---------------")
                for i in main_json["errors"]:
                    print(f"Code: {i['code']}")
                    print(f"Message: {i['message']}")
                    print(f"---------------")
                printErrorMessage("Restarting Form..")
            else:
                if main_json.get("SaleLocation"):
                    if main_json["SaleLocation"].get("UniverseIds"):
                        listOfUniverseIds = main_json["SaleLocation"]["UniverseIds"]
                        generated_string = ""

                        for i in listOfUniverseIds:
                            generated_string = generated_string + f"{i},"
                        
                        generated_url = url2 + generated_string
                        res2 = requests.get(generated_url)
                        main_json2 = res2.json()

                        if main_json2.get("errors"):
                            printErrorMessage("Error while getting request. More information is below:")
                            print(f"---------------")
                            print(f"Request #2")
                            print(f"URL: {generated_string}")
                            print(f"Status Code: {res2.status_code}")
                            print(f"---------------")
                            for i in main_json2["errors"]:
                                print(f"Code: {i['code']}")
                                print(f"Message: {i['message']}")
                                print(f"---------------")
                            printErrorMessage("Restarting Form..")
                        else:
                            listOfGames = main_json2["data"]
                            printSuccessMessage(f"Successfully grabbed info of item!")
                            printSuccessMessage(f"")
                            printSuccessMessage(f"Item Name: {main_json['Name']}")
                            printSuccessMessage(f"Item ID: {id}")
                            printSuccessMessage(f"Creator Name: {main_json['Creator']['Name']}")
                            printSuccessMessage(f"Creator ID: {main_json['Creator']['Id']}")
                            printSuccessMessage(f"Price: {main_json['PriceInRobux']}")
                            printSuccessMessage(f"Remaining Stock: {main_json['Remaining']}")
                            printSuccessMessage(f"")
                            printSuccessMessage(f"Universal Games:")
                            print(f"---------------")
                            for i in listOfGames:
                                print(f"Game Name: {i['name']}")
                                print(f"Root Game ID: {i['rootPlaceId']}")
                                print(f"Root Game Link: https://www.roblox.com/games/{i['rootPlaceId']}")
                                print(f"Universe ID: {i['id']}")
                                print(f"Max Players Per Server: {i['maxPlayers']}")
                                print(f"Can Create Private Servers: {i['createVipServersAllowed']}")
                                print(f"Total Players Playing: {i['playing']}")
                                print(f"Playable: {get_playable(i['id'])}")
                                print(f"---------------")
                            if showrestart:
                                printWarnMessage("Do you want to try again with another item?")
                                mai = input(">> ")
                                url = getLink(mai)
                                if mai.lower() == "y":
                                    printWarnMessage("Restarting System..")
                                elif not (url == None):
                                    run(url, showrestart)
                                else:
                                    exit()
                    else:
                        printErrorMessage("This asset doesn't have a set Experience ID.")
                else:
                    printErrorMessage("This asset doesn't have a set sale location.")
        except Exception as e:
            printErrorMessage("Error while getting games linked to this item: " + str(e))

    def argumentHandler(args):
        if len(args) > 1:
            arg1 = args[1]

            main_id = ""
            global granted_temp_playableapproved

            if len(args) > 2:
                arg2 = args[2]
                if arg1 == "-i":
                    main_id = arg2
                    if testIfInt(main_id):
                        run(int(main_id), False)
                    else:
                        printErrorMessage(
                            "The Item ID passed isn't a valid int."
                        )
                elif arg1 == "-l":
                    main_link = arg2
                    url = getLink(main_link)
                    if not (url == None):
                        run(url, False)
                    else:
                        printErrorMessage(
                            "The link passed isn't a valid link."
                        )
                elif arg1 == "-i-p":
                    granted_temp_playableapproved = True

                    main_id = arg2
                    if testIfInt(main_id):
                        run(int(main_id), False)
                    else:
                        printErrorMessage(
                            "The Item ID passed isn't a valid int."
                        )
                elif arg1 == "-l-p":
                    granted_temp_playableapproved = True

                    main_link = arg2
                    url = getLink(main_link)
                    if not (url == None):
                        run(url, False)
                    else:
                        printErrorMessage(
                            "The link passed isn't a valid link."
                        )
                else:
                    printErrorMessage(
                        "Error while getting asset info: Invalid Mode."
                    )
            elif arg1 == "-p":
                granted_temp_playableapproved = True
                loop()
            else:
                printErrorMessage(
                    "Error while getting asset info: Invalid Mode."
                )

    def loop():
        generatedSettings = {"id": 0}

        def fulfillVariables():
            inputs = [input("Enter your Roblox Item ID or Command to use: ")]

            if inputs[0] == "exit":
                exit()
            elif inputs[0] == "quit":
                quit()
            elif inputs[0] == "enablePlayable()":
                with open("RobloxInGameUGCTracerPlayableEnabled", "w") as f:
                    f.write("Hello! Delete this if you want to disable Playable Mode for Efaz's Roblox In-Game UGC Tracer! Thank you :)")
                printSuccessMessage("Successfully created file: RobloxInGameUGCTracerPlayableEnabled! If you want to disable the mode, please delete the file from the directory Python said it was given. Thank you :)")
                fulfillVariables()
            else:
                inputs[0] = getLink(inputs[0])
                if testIfInt(inputs[0]) == True:
                    generatedSettings["id"] = int(inputs[0])

                    printSuccessMessage("Input Passed Tests")
                    printSuccessMessage("Results:")
                    printMainMessage("Item ID: " + str(generatedSettings["id"]))

                    c = input("Confirm? (y/n): ")
                    if not c.lower() == "y":
                        fulfillVariables()
                else:
                    printErrorMessage("Input Failed Tests")
                    printErrorMessage("Results:")
                    printErrorMessage(f"False (Item ID)")
                    printMainMessage("Restarting Form..")
                    fulfillVariables()
            
        fulfillVariables()
        run(generatedSettings["id"], True)
        loop()
    if len(sys.argv) > 1:
        argumentHandler(sys.argv)
    else:
        loop()