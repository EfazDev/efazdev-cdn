import requests
import json
import time
import os
import re

def _validateEmail(email_address: str):
    regex = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b'
    if re.match(regex, email_address):
        return True
    else:
        return False

class VerifyAllRobloxAccountsViaEmails:
    class InvalidEmailError(Exception):
        "Provided email address was invalid."
        pass
    email_address = ""

    def __init__(self, email: str):
        if self.validateEmail(email):
            self.email_address = email
        else:
            raise self.InvalidEmailError("Provided email address was invalid.")

    def scanMessage(self, mess):
        if mess == "Challenge is required to authorize the request":
            return "This user already has email address verified on this account."
        elif mess == "Too many requests":
            return "Try using a new network or IP"
        elif mess == "Invalid Email Address":
            return "Email Validation"
        else:
            return "Request Error"

    def changeEmail(self, new_email):
        if self.validateEmail(new_email):
            self.email_address = new_email
        else:
            raise self.InvalidEmailError("Provided email address was invalid.")

    def validateCookie(self, cookie: str):
        cookieDictionary = {".ROBLOSECURITY": cookie}
        resp = requests.get(
            "https://users.roblox.com/v1/users/authenticated", cookies=cookieDictionary
        )
        new_json = resp.json()
        if new_json.get("name"):
            return {"success": True, "response": new_json}
        else:
            return {"success": False}

    def validateEmail(self, email: str):
        return _validateEmail(email)

    def sendEmails(self, listOfRobloxCookies: list, notifierCallback: callable):
        if len(listOfRobloxCookies) > 20:
            return {
                "success": False,
                "message": "More than 20 cookies were given in the list.",
            }
        elif len(listOfRobloxCookies) < 1:
            return {"success": False, "message": "No Cookies were given"}
        elif not self.validateEmail(self.email_address):
            return {"success": False, "message": "Invalid Email Address"}

        successRate = 0
        successCookies = []
        failedRate = 0
        failedCookies = []
        failedMessages = []
        email_address = self.email_address

        for accountCookie in listOfRobloxCookies:
            account_info = self.validateCookie(accountCookie)
            if account_info["success"] == True:
                cookies = {}
                cookies[".ROBLOSECURITY"] = accountCookie
                data = "emailAddress=" + email_address + "&password="
                headers = {"Content-Type": "application/x-www-form-urlencoded"}

                def rbx_request(url):
                    request = requests.post(
                        url=url, data=data, headers=headers, cookies=cookies
                    )

                    if request.status_code == 429:
                        request = rbx_request(url)
                    elif "X-CSRF-TOKEN" in request.headers:
                        headers["X-CSRF-TOKEN"] = request.headers["X-CSRF-TOKEN"]
                        if request.status_code == 403:
                            request = requests.post(
                                url=url, data=data, headers=headers, cookies=cookies
                            )

                    return request

                res = rbx_request("https://accountsettings.roblox.com/v1/email")
                jsonFor = res.json()
                if jsonFor.get("errors"):
                    for error in jsonFor["errors"]:
                        failedMessages.append(
                            {
                                "message": f"{error['message']} ({self.scanMessage(error['message'])})",
                                "cookie": accountCookie,
                                "userInfo": account_info["response"],
                            }
                        )
                        failedRate = failedRate + 1
                        notifierCallback(
                            {
                                "failed": True,
                                "cookie": accountCookie,
                                "message": f"{error['message']} ({self.scanMessage(error['message'])})",
                                "cookieValid": True,
                                "userInfo": account_info["response"],
                            }
                        )
                    failedCookies.append(
                        {"cookie": accountCookie, "userInfo": account_info["response"]}
                    )
                else:
                    print("Successfully sent email! Check your mailbox!")
                    successRate = successRate + 1
                    successCookies.append(
                        {"cookie": accountCookie, "userInfo": account_info["response"]}
                    )
                    notifierCallback(
                        {
                            "failed": False,
                            "cookie": accountCookie,
                            "message": "Successfully sent email! Check your mailbox to fully verify the account!",
                            "cookieValid": True,
                            "userInfo": account_info["response"],
                        }
                    )
            else:
                failedMessages.append(
                    {
                        "message": "Invalid Cookie (Validation Error)",
                        "cookie": accountCookie,
                        "userInfo": {},
                    }
                )
                failedRate = failedRate + 1
                failedCookies.append({"cookie": accountCookie, "userInfo": {}})
                notifierCallback(
                    {
                        "failed": True,
                        "cookie": accountCookie,
                        "message": "Cookie given was invalid. Please give a valid cookie, skipped.",
                        "cookieValid": False,
                        "userInfo": {},
                    }
                )
            time.sleep(1)

        return {
            "success": True,
            "email": email_address,
            "successRate": successRate,
            "successCookies": successCookies,
            "failedRate": failedRate,
            "failedCookies": failedCookies,
            "failedMessages": failedMessages,
            "listOfCookies": listOfRobloxCookies,
        }

if __name__ == "__main__":
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

    os.system("cls" if os.name == "nt" else 'echo "\033c\033[3J"; clear')
    version = "v1.0.0"
    hideBackgroundConsole = True
    console_logs = []

    def printBackgroundConsole(message):
        if hideBackgroundConsole == False and __name__ == "__main__":
            print(message)
            console_logs.append(message)

    printBackgroundConsole("--------")
    printBackgroundConsole("Clearing Previous Console messages..")
    printBackgroundConsole("Loading Color Module..")

    printWarnMessage("Welcome to Efaz's Roblox Account Bulk Verifier!")
    printWarnMessage(f"Script {version}")
    printWarnMessage("")
    printWarnMessage("This script allows you to bulk verify your Alternate Roblox accounts with just a cookie!")
    printWarnMessage("Please know we are not responsible for any phishing/hacking attacks on your ROBLOX account.")
    printWarnMessage("This script can't overwrite accounts with existing verified emails linked, only ones that don't.")
    printWarnMessage("Use help() for commands!")
    printWarnMessage("Made by @efazdev on Discord (efaz.dev)")
    printWarnMessage("")
    printWarnMessage("Console: ")

    def startNow():
        if os.path.exists("cookies.json"):
            with open("cookies.json", "r") as f:
                cookieJson = json.load(f)
            if cookieJson.get("roblox_cookies"):
                if isinstance(cookieJson["roblox_cookies"], list):
                    try:
                        if cookieJson["targetEmail"] == "email@emaildomain.com":
                            printErrorMessage("Please change the email address set using assignEmail().")
                            return
                        
                        new_verify_object = VerifyAllRobloxAccountsViaEmails(cookieJson["targetEmail"])
                        def callback_response(res):
                            if res["cookieValid"]:
                                printSuccessMessage(f"Successfully logged on user: {res['userInfo']['name']}")
                            if res["failed"] == True:
                                printErrorMessage(f'Error: {res["message"]}')
                            else:
                                printSuccessMessage(f'Success: {res["message"]}')

                        finished_response = new_verify_object.sendEmails(cookieJson["roblox_cookies"], callback_response)
                        if finished_response["success"]:
                            printSuccessMessage(f"Successfully finished sending emails!")
                            printSuccessMessage(f"Please check your mailbox for any emails from Roblox!")
                            printMainMessage(f"")
                            printMainMessage(f"Email Address: {finished_response['email']}")
                            printSuccessMessage(f"Success Rate: {finished_response['successRate']}")
                            printErrorMessage(f"Error Rate: {finished_response['failedRate']}")
                            cookieJson["verified_accounts"] = cookieJson["verified_accounts"].extend(finished_response["successCookies"])
                            with open("cookies.json", "w") as f:
                                json.dump(cookieJson, f, indent=4)
                        else:
                            printErrorMessage(finished_response["message"])
                    except Exception as e:
                        printErrorMessage(e)
                else:
                    printErrorMessage("Roblox Cookies is not a list.")
            else:
                printErrorMessage("Roblox Cookies Not Found.")
        else:
            with open("cookies.json", "w") as f:
                json.dump({"targetEmail": "", "roblox_cookies": ["Cookie1Here", "Cookie2Here"], "verified_accounts": []}, f, indent=4)
            printMainMessage('A new file called "cookies.json" has been created in the given python started path. Edit it with your cookies and try again.')

    def main_ui():
        command_prompt = input(">> ")
        if command_prompt == "assignEmail()":
            email_address = input("Enter your email address: ")
            if _validateEmail(email_address):
                if not os.path.exists("cookies.json"):
                    with open("cookies.json", "w") as f:
                        json.dump({"targetEmail": email_address, "roblox_cookies": ["Cookie1Here", "Cookie2Here"], "verified_accounts": []}, f, indent=4)
                    printMainMessage('A new file called "cookies.json" has been created in the given python started path. Edit it with your cookies and run startNow()!')
                else:
                    with open("cookies.json", "r") as f:
                        cookieJson = json.load(f)
                    cookieJson["targetEmail"] = email_address
                    with open("cookies.json", "w") as f:
                        json.dump(cookieJson, f, indent=4)
                printSuccessMessage(f"Set email address to: {email_address}!")
            else:
                printErrorMessage("Invalid Email Address")
        elif command_prompt == "startNow()":
            startNow()
        elif command_prompt == "generateJSON()":
            if not os.path.exists("cookies.json"):
                with open("cookies.json", "w") as f:
                    json.dump({"targetEmail": "email@emaildomain.com", "roblox_cookies": ["Cookie1Here", "Cookie2Here"], "verified_accounts": []}, f, indent=4)
                printMainMessage('A new file called "cookies.json" has been created in the given python started path. Edit it with your cookies and run startNow()!')
            else:
                printErrorMessage('"cookies.json" already exists. To prevent overwriting, process has been unauthorized.')
        elif command_prompt == "help()":
            printMainMessage("Help:")
            printMainMessage("")
            printMainMessage("startNow() - Start verifying process now!")
            printMainMessage("assignEmail() - Set target email address")
            printMainMessage("generateJSON() - Generate a cookies.json file.")
        else:
            printErrorMessage("Command not found")
        main_ui()
    main_ui()