import requests
import platform
import os

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

if __name__ == "__main__":
    ROBLOX_API_URL = "https://users.roblox.com/v1/users/authenticated"
    session = requests.Session()
    count = 0

    printWarnMessage("Welcome to Efaz's Cookie Destroyer!")
    printWarnMessage("Script v1.0.0")
    printWarnMessage("")
    printWarnMessage("This script allows you to destroy a cookie from Roblox's Server!")
    printWarnMessage("Made by @efazdev on Discord (efaz.dev)")
    printWarnMessage("")
    printWarnMessage("Console: ")

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
        
    def loop(cookie):
        generatedSettings = {
            "cookie": ""
        }

        def rbx_request(session, method, url, **kwargs):
            request = session.request(method, url, **kwargs)
            method = method.lower()
            if ((method == "post") or (method == "put") or (method == "patch") or (method == "delete")):
                if "X-CSRF-TOKEN" in request.headers:
                    session.headers["X-CSRF-TOKEN"] = request.headers["X-CSRF-TOKEN"]
                    if request.status_code == 403:  # Request failed, send it again
                        request = session.request(method, url, **kwargs)
            return request

        def fulfillVariables(cookieGiven):
            inputs = ""

            if inputs == "":
                inputs = input("Enter the Roblox Security Cookie to destroy: ")
            else:
                inputs = cookieGiven

            cookieInfo = testVerificationOfUser(inputs)
            if cookieInfo["success"] == True:
                generatedSettings["cookie"] = inputs
                printSuccessMessage("Cookie Passed Tests!")
                printMainMessage("")
                printSuccessMessage("Results:")
                printMainMessage(f"Roblox Username: {cookieInfo['username']} ({cookieInfo['userId']})")

                c = input("Confirm? (y/n): ")
                if not c.lower() == "y":
                    fulfillVariables(generatedSettings["cookie"])
            else:
                printErrorMessage("Cookie Failed Tests")
                printErrorMessage("Results: False")
                printMainMessage("Restarting Form..")
                fulfillVariables("")
            
        fulfillVariables(cookie)

        printMainMessage("Requests Ready to send. Send Now? (y/n):")
        sendrequest = input(">> ")
        if sendrequest.lower() == "y":
            def main():
                global count
                apiLink = "https://auth.roblox.com/v1/logout"
                printMainMessage("Sending Request to https://auth.roblox.com:443/v1/logout..")
                res = rbx_request(session=session, method="POST", url=apiLink)
                count = count + 1
                if res.status_code == 200 or res.status_code == 204:
                    printSuccessMessage("Success! This cookie should be invalidated!")
                    printSuccessMessage("Response Code: " + str(res.status_code))
                    printSuccessMessage("Response: " + res.text)
                    printSuccessMessage("Try again with another cookie? (y/n):")
                    if input(">> ").lower() == "y":
                        loop("")
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
                            loop("")
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
    loop("")
else:
    printMainMessage("Activated Cookie Destroyer API")
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
        
    def roblox_request(session, method, url, **kwargs):
        request = session.request(method, url, **kwargs)
        method = method.lower()
        if ((method == "post") or (method == "put") or (method == "patch") or (method == "delete")):
            if "X-CSRF-TOKEN" in request.headers:
                session.headers["X-CSRF-TOKEN"] = request.headers["X-CSRF-TOKEN"]
                if request.status_code == 403:
                    request = session.request(method, url, **kwargs)
        return request
        
    def get_xcerf_token(cookie):
        url = "https://auth.roblox.com/v1/usernames/validate"
        body = {
            "username": "e",
            "birthday": "2023-07-28T21:12:18.215Z",
            "context": 0
        }
        request = session.request("POST", url, json=body)
        if "X-CSRF-TOKEN" in request.headers:
            session.headers["X-CSRF-TOKEN"] = request.headers["X-CSRF-TOKEN"]
            if request.status_code == 403:  # Request failed, send it again
                return {
                    "token": request.headers["X-CSRF-TOKEN"],
                    "success": True
                }
        else:
            return {
                "token": None,
                "success": False
            }
        
        
    def destroyCookie(cookie):
        test = testVerificationOfUser(cookie)
        if test["success"] == True:
            xcerftoken = get_xcerf_token(cookie)
            if xcerftoken["success"] == True:
                xcerftoken = xcerftoken["token"]
                apiLink = "https://auth.roblox.com/v1/logout"

                session = requests.session()
                session.cookies[".ROBLOSECURITY"] = cookie
                session.headers["accept"] = "application/json"
                session.headers["Content-Type"] = "application/json"
                res = roblox_request(session=session, method="POST", url=apiLink)
                if res.status_code == 200 or res.status_code == 204:
                    return {
                        "success": True,
                        "message": "Cookie has been successfully destroyed!",
                        "httpcode": res.status_code
                    }
                else:
                    return {
                        "success": False,
                        "message": "Server returned an unexpected response.",
                        "httpcode": res.status_code
                    }
            else:
                return {
                    "success": False,
                    "message": "X-CERF-TOKEN couldn't be generated.",
                    "httpcode": 403
                }
        else:
            return {
                "success": False,
                "message": "Cookie is invalid or doesn't exist in Roblox's servers.",
                "httpcode": 404
            }