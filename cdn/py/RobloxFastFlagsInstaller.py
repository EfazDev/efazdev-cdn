import os
import platform
import json
import sys

os.system("cls" if os.name == "nt" else "clear")
    
main_os = platform.system()
dir = "/Applications/Roblox.app"
beforeClientServices = "/Contents/MacOS/"

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
    printWarnMessage("Welcome to Roblox Fast Flags Setup for macOS!")
    printWarnMessage("Made by Efaz from efaz.dev!")
    printWarnMessage("v1.0.0")
    printWarnMessage("-----------")
    printMainMessage("Entering Setup..")
    def getUserId():
        if main_os == "Darwin": 
            printMainMessage("Please input your User ID! This can be found on your profile in the URL: https://www.roblox.com/users/XXXXXXXX/profile")
            printMainMessage("This will be used for items that require a User ID.")
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
            printWarnMessage("In order to use fast flags, use Bloxstrap instead.")
            return None
        else:
            printErrorMessage("Please run this script on macOS.")
            return None
    id = getUserId()
    if id:
        # Based JSON
        generated_json = {}

        # FPS Unlocker
        printMainMessage("Would you like to use an FPS Unlocker? [y/n]")
        installFPSUnlocker = input("> ").lower() == "y"
        def getFPSCap():
            printMainMessage("Enter a FPS Cap [Click Enter/Return for no cap]")
            cap = input("> ")
            if cap.isnumeric():
                return cap
            elif cap == "exit":
                printMainMessage("Ending installation..")
                exit()
            else:
                return None
        if installFPSUnlocker == True:
            # FPS Cap
            fpsCap = getFPSCap()

            # Roblox Vulkan Rendering
            printMainMessage("Would you like to use Vulkan Rendering? (It will remove the cap fully but may cause issues) [y/n]")
            useVulkan = input("> ").lower() == "y"

            generated_json["FFlagDebugGraphicsDisableMetal"] =  "true"
            if fpsCap == None:
                generated_json["DFIntTaskSchedulerTargetFps"] = 99999
            else:
                generated_json["DFIntTaskSchedulerTargetFps"] = int(fpsCap)

            if useVulkan == True:
                generated_json["FFlagDebugGraphicsPreferVulkan"] = str(useVulkan)

        # Verified Badge
        printMainMessage("Would you like to use a verified badge during Roblox Games? [y/n]")
        installVerifiedBadge = input("> ").lower() == "y"
        if installVerifiedBadge == True:
            generated_json["FStringWhitelistVerifiedUserId"] = str(id)

        # Accessory Adjustments
        printMainMessage("Would you like to install an accessory adjustments fast flag? (It may depend on your current version of Roblox.) [y/n]")
        installAccessoryAdjust = input("> ").lower() == "y"
        if installAccessoryAdjust == True:
            generated_json["FFlagAccessoryAdjustmentEnabled2"] = "true"
            generated_json["FFlagHumanoidDescriptionUseInstances5"] = "true"
            generated_json["FFlagEnableNonUAPAccessoryAdjustment"] = "true"
            generated_json["FFlagAXAvatarFetchResultCamelCase"] = "true"
            generated_json["FFlagAccessoryAdjustmentEnabled3"] = "true"
            generated_json["FFlagAXAccessoryAdjustment"] = "true"
            generated_json["FFlagAXAccessoryAdjustmentIXPEnabled"] = "true"
            generated_json["FFlagAXAccessoryAdjustmentIXPEnabledForAll"] = "true"

        # Custom Fast Flags
        def custom():
            def loop():
                key = input("Enter Key Value: ")
                if key == "exit":
                    return {"success": False, "key": "", "value": ""}
                value = input("Enter Value Value: ")
                if value == "exit":
                    return {"success": False, "key": "", "value": ""}
                if value.isnumeric():
                    isNum = input("Would you like this value to be a number value or do you want to keep it as a string? [y/n]")
                    if isNum == True:
                        value = int(value)
                return {"success": True, "key": key, "value": value}
            completeLoop = loop()
            if completeLoop["success"] == True:
                generated_json[completeLoop["key"]] = completeLoop["value"]
                printMainMessage("Would you like to add more fast flags? [y/n]")
                more = input("> ").lower() == "y"
                if more == True:
                    custom()
        printMainMessage("Would you like to use custom fast flags? [y/n]")
        installCustom = input("> ").lower() == "y"
        if installCustom == True:
            custom()

        # Installation
        printMainMessage("Settings are now finished and now ready for setup!")
        printMainMessage("Would you like to continue with the fast flag installation? [y/n]")
        printErrorMessage("WARNING! This will force-quit any open Roblox windows! Please close them in order to prevent data loss!")
        if input("> ").lower() == "y":
            printMainMessage(f"Closing any open Roblox windows..")
            os.system("killall -9 RobloxPlayer")
            printMainMessage(f"Generating Client Settings Folder..")
            if not os.path.exists(f"{dir}{beforeClientServices}ClientSettings"):
                os.mkdir(f"{dir}{beforeClientServices}ClientSettings")
                printSuccessMessage(f"Created {dir}{beforeClientServices}ClientSettings..")
            else:
                printWarnMessage(f"Client Settings is already created. Skipping Folder Creation..")
            printMainMessage("Writing ClientAppSettings.json")
            with open(f"{dir}{beforeClientServices}ClientSettings/ClientAppSettings.json", "w") as f:
                f.write(json.dumps(generated_json))
            printSuccessMessage("DONE!")
            printSuccessMessage("Your fast flags should be installed!")
            printSuccessMessage("Please know that you'll have to use this script again after every Roblox update/reinstall! Also, it only shows if you play a game, not in the home menu!")
            printSuccessMessage(f"If you like to update your fast flags, go to: {dir}{beforeClientServices}ClientSettings/ClientAppSettings.json")
            printMainMessage("Would you like to open Roblox? [y/n]")
            if input("> ").lower() == "y":
                os.system(f"open -a {dir}")
        else:
            printMainMessage("Ending installation..")
            exit()
else:
    class RobloxFastFlagsInstaller():
        def installFastFlagsJSON(self, generated_json):
            os.system("killall -9 RobloxPlayer")
            if not os.path.exists(f"{dir}{beforeClientServices}ClientSettings"):
                os.mkdir(f"{dir}{beforeClientServices}ClientSettings")
            with open(f"{dir}{beforeClientServices}ClientSettings/ClientAppSettings.json", "w") as f:
                f.write(json.dumps(generated_json))
        def openRoblox(self):
            os.system(f"open -a {dir}")