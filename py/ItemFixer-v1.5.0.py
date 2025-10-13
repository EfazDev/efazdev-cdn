import json
import os
import platform
import requests

ROBLOX_API_URL = "https://users.roblox.com/v1/users/authenticated"
session = requests.Session()
count = 0

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

printWarnMessage("Welcome to Roblox Item Fixer!")
printWarnMessage("Script Version 1.5.0")
printWarnMessage("")
printWarnMessage("This script allows you to fixed bugged Roblox Items that are off-sale and can't be put on-sale!")
printWarnMessage("Please know we are not responsible for any phishing/hacking attacks on your ROBLOX account.")
printWarnMessage("Made by @efazdev on Discord (efaz.dev)")
printWarnMessage("")
printWarnMessage("Console: ")

def testIfInt(value):
    try:
        int(value)
        return True
    except Exception as e:
        return False
    
def testVerificationOfUser(cookie):
    session.cookies[".ROBLOSECURITY"] = cookie
    session.headers["accept"] = "application/json"
    session.headers["Content-Type"] = "application/json"
    user_data = session.get(ROBLOX_API_URL).json()
    if user_data.get("name"):
        username = user_data["name"]
        userid = user_data["id"]
        return {
            "success": True,
            "username": username,
            "userId": userid
        }
    else:
        return {
            "success": False,
            "username": "None",
            "userId": 0
        }

def loop():
    generatedSettings = {
        "cookie": "",
        "id": 0,
        "price": 0
    }

    def rbx_request(session, method, url, **kwargs):
        request = session.request(method, url, **kwargs)
        method = method.lower()
        if (
            (method == "post")
            or (method == "put")
            or (method == "patch")
            or (method == "delete")
        ):
            if "X-CSRF-TOKEN" in request.headers:
                session.headers["X-CSRF-TOKEN"] = request.headers["X-CSRF-TOKEN"]
                if request.status_code == 403:  # Request failed, send it again
                    request = session.request(method, url, **kwargs)
        return request

    def fulfillVariables():
        inputs = [
            input("Enter your Roblox Item ID to use: "),
            input("Enter your price to set it to: "),
            input("Enter your Roblox Security Cookie Here (YOUR COOKIE IS SECURE BETWEEN YOU AND ROBLOX): ")
        ]
        cookieInfo = testVerificationOfUser(inputs[2])
        if testIfInt(inputs[0]) == True and testIfInt(inputs[1]) == True and cookieInfo["success"] == True:
            generatedSettings["id"] = inputs[0]
            generatedSettings["price"] = inputs[1]
            generatedSettings["cookie"] = inputs[2]

            printSuccessMessage("Inputs Passed Tests")
            printSuccessMessage("Results:")
            printMainMessage(f"Roblox Username: {cookieInfo['username']} ({cookieInfo['userId']})")
            printMainMessage("Item ID: " + str(generatedSettings["id"]))
            printMainMessage("Price: " + str(generatedSettings["price"]))

            c = input("Confirm? (y/n): ")
            if not c.lower() == "y":
                fulfillVariables()
        else:
            printErrorMessage("Inputs Failed Tests")
            printErrorMessage("Results:")
            if testIfInt(inputs[0]) == True:
                printSuccessMessage(f"True (Item ID)")
            else:
                printErrorMessage(f"False (Item ID)")

            if testIfInt(inputs[1]) == True:
                printSuccessMessage(f"True (Price)")
            else:
                printErrorMessage(f"False (Price)")

            if cookieInfo['success'] == True:
                printSuccessMessage(f"True (Roblox Cookie)")
            else:
                printErrorMessage(f"False (Roblox Cookie)")
            printMainMessage("Restarting Form..")
            fulfillVariables()
         
    fulfillVariables()

    apiLink = "https://itemconfiguration.roblox.com/v1/assets/" + str(generatedSettings["id"]) + "/release"

    body = {
        "priceConfiguration": {"priceInRobux": generatedSettings["price"]},
        "saleStatus": "OnSale",
        "releaseConfiguration": {"saleAvailabilityLocations": [0, 1]},
    }

    printMainMessage("Requests Ready to send. Send Now? (y/n):")
    sendrequest = input(">> ")
    if sendrequest.lower() == "y":
        def main():
            global count
            printMainMessage("Sending Request to https://itemconfiguration.roblox.com:443/v1/assets/" + str(generatedSettings["id"]) + "/release..")
            res = rbx_request(session=session, method="POST", url=apiLink, data=json.dumps(body))
            count = count + 1
            if res.status_code == 200 or res.status_code == 204:
                printSuccessMessage("Success! Your Item should be on sale for " + str(generatedSettings["price"]) + " Robux!")
                printSuccessMessage("Response Code: " + str(res.status_code))
                printSuccessMessage("Response: " + res.text)
                printSuccessMessage("Try again with another item? (y/n):")
                if input(">> ").lower() == "y":
                    loop()
                else:
                    printWarnMessage("Script Ended")
                    exit()
            else:
                printErrorMessage("Error while sending a request to Roblox's Server:")
                printErrorMessage("Response Code: " + str(res.status_code))
                printErrorMessage("Response: " + res.text)
                if count > 3:
                    printWarnMessage("Do you want to refill the info again? (y/n):")
                    if input(">> ").lower() == "y":
                        loop()
                    else:
                        printWarnMessage("Would you like to retry the request again? (y/n):")
                        if input(">> ").lower() == "y":
                            main()
                        else:
                            printWarnMessage("Script Ended")
                            exit()
                else:
                    printWarnMessage("Would you like to retry the request again? (y/n):")
                    if input(">> ").lower() == "y":
                        main()
                    else:
                        printWarnMessage("Script Ended")
                        exit()
        main()
    else:
        printWarnMessage("Script Ended")
        exit()
loop()