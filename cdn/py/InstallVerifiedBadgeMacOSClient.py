import os
import platform
import json
import sys

os.system("cls" if os.name == "nt" else "clear")
    
main_os = platform.system()
dir = "/Applications/Roblox.app"

def printMainMessage(mes):
    print(f"\x1b[38;2;255;255;255m{mes}\033[38;5;231m")

def printErrorMessage(mes):
    print(f"\x1b[38;2;255;0;0m{mes}\033[38;5;231m")

def printSuccessMessage(mes):
    print(f"\x1b[38;2;0;255;0m{mes}\033[38;5;231m")

def printWarnMessage(mes):
    print(f"\x1b[38;2;255;75;0m{mes}\033[38;5;231m")

if __name__ == "__main__":
    printWarnMessage("-----------")
    printWarnMessage("Welcome to Fake Verified Badge Setup for macOS!")
    printWarnMessage("Made by Efaz from efaz.dev!")
    printWarnMessage("v1.0.0")
    printWarnMessage("-----------")
    printMainMessage("Entering Setup..")
    def getUserId():
        if main_os == "Darwin": 
            printMainMessage("Please input your User ID! This can be found on your profile in the URL: https://www.roblox.com/users/XXXXXXX/profile")
            id = input("> ")
            if id.isnumeric():
                return id
            elif id == "exit":
                printMainMessage("Ending installation..")
                exit()
            else:
                printWarnMessage("Let's try again!")
                return getUserId()
        elif main_os == "Windows":
            printWarnMessage("In order to get the verified badge, use Bloxstrap instead.")
            return None
        else:
            printErrorMessage("Please run this script on macOS.")
            return None
    id = getUserId()
    if id:
        printMainMessage("Would you like install FPS Unlocker for Mac? [y/n]")
        installFPSUnlocker = input("> ").lower() == "y"
        fpsCap = None
        useVulkan = False
        def getFPSCap():
            printMainMessage("Enter a FPS Cap [Put nothing for no cap]")
            cap = input("> ")
            if cap.isnumeric():
                return cap
            elif cap == "exit":
                printMainMessage("Ending installation..")
                exit()
            else:
                return None
        if installFPSUnlocker == True:
            fpsCap = getFPSCap()
            printMainMessage("Would you like to use Vulkan Rendering? (It will remove the cap fully but may cause issues) [y/n]")
            useVulkan = input("> ").lower() == "y"

        printMainMessage("Would you like to continue with the installation? [y/n]")
        printErrorMessage("WARNING! This will force-quit any open Roblox windows! Please close them in order to prevent data loss!")
        if input("> ").lower() == "y":
            printMainMessage(f"Closing any open Roblox Windows..")
            os.system("killall -9 RobloxPlayer")
            printMainMessage(f"Installing Verified Badge for User ID: {str(id)}")
            generated_json = {}
            if installFPSUnlocker == True:
                printMainMessage(f"Installing FPS Unlocker")
                if fpsCap == None:
                    generated_json = { 
                        "DFIntTaskSchedulerTargetFps": 99999, 
                        "FStringWhitelistVerifiedUserId": str(id),
                        "FFlagDebugGraphicsDisableMetal": "true", 
                        "FFlagDebugGraphicsPreferVulkan": str(useVulkan)
                    }
                else:
                    generated_json = { 
                        "DFIntTaskSchedulerTargetFps": int(fpsCap), 
                        "FStringWhitelistVerifiedUserId": str(id),
                        "FFlagDebugGraphicsDisableMetal": "true", 
                        "FFlagDebugGraphicsPreferVulkan": str(useVulkan)
                    }
            else:
                generated_json = { 
                    "FStringWhitelistVerifiedUserId": str(id)
                }
            if not os.path.exists(f"{dir}/Contents/MacOS/ClientSettings"):
                os.mkdir(f"{dir}/Contents/MacOS/ClientSettings")
                printSuccessMessage(f"Created {dir}/Contents/MacOS/ClientSettings..")
            else:
                printWarnMessage(f"Client Settings is already created. Skipping Folder Creation..")
            printMainMessage("Writing ClientAppSettings.json")
            with open(f"{dir}/Contents/MacOS/ClientSettings/ClientAppSettings.json", "w") as f:
                f.write(json.dumps(generated_json))
            printSuccessMessage("DONE!")
            printSuccessMessage("Your verified badge should be installed if the User ID you provided matches!")
            printSuccessMessage("Please know that you'll have to use this script again after every Roblox update/reinstall! Also, it only shows if you play a game, not in the home menu!")
            printMainMessage("Would you like to open Roblox?")
            if input("> ").lower() == "y":
                os.system(f"open -a {dir}")
        else:
            printMainMessage("Ending installation..")
            exit()