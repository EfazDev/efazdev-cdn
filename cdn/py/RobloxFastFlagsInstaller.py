import os
import platform
import json

os.system("cls" if os.name == "nt" else "clear")
main_os = platform.system()

# If your Roblox installation is inside of an another folder or on an extra hard drive, you may edit the following here.
macOS_dir = "/Applications/Roblox.app"
macOS_beforeClientServices = "/Contents/MacOS/"

windows_dir = f"{os.getenv('LOCALAPPDATA')}\Roblox"
# If your Roblox installation is inside of an another folder or on an extra hard drive, you may edit the following here.

def printMainMessage(mes):
    print(f"\x1b[38;2;255;255;255m{mes}\033[38;5;231m")

def printErrorMessage(mes):
    print(f"\x1b[38;2;255;0;0m{mes}\033[38;5;231m")

def printSuccessMessage(mes):
    print(f"\x1b[38;2;0;255;0m{mes}\033[38;5;231m")

def printWarnMessage(mes):
    print(f"\x1b[38;2;255;75;0m{mes}\033[38;5;231m")

class RobloxFastFlagsInstaller():
    # System Functions
    def printLog(self, m):
        if __name__ == "__main__":
            printMainMessage(m)
        else:
            print(m)
    def get_latest_roblox_version(self, versions_dir): # Thanks ChatGPT :)
        if main_os == "Windows":
            versions = [os.path.join(versions_dir, folder) for folder in os.listdir(versions_dir) if os.path.isdir(os.path.join(versions_dir, folder))]
            formatted = []
            if not versions:
                return None
            for fold in versions:
                if os.path.isdir(fold):
                    if os.path.exists(f"{fold}\RobloxPlayerLauncher.exe"):
                        formatted.append(f"{fold}\\")
            if len(formatted) > 0:
                latest_folder = max(formatted, key=os.path.getmtime)
                return latest_folder
            else:
                return None
        elif main_os == "Darwin":
            return f"{macOS_dir}/"
        else:
            self.printLog("RobloxFastFlagsInstaller is only supported for macOS and Windows.")
    # System Functions
                
    def endRoblox(self):
        if main_os == "Darwin":
            os.system("killall -9 RobloxPlayer")
        elif main_os == "Windows":
            os.system("taskkill /IM RobloxPlayerBeta.exe /F")
        else:
            self.printLog("RobloxFastFlagsInstaller is only supported for macOS and Windows.")
    def installFastFlagsJSON(self, fastflagJSON: object, askForPerms=False):
        if __name__ == "__main__":
            if main_os == "Darwin":
                printMainMessage(f"Closing any open Roblox windows..")
                self.endRoblox()
                printMainMessage(f"Generating Client Settings Folder..")
                if not os.path.exists(f"{macOS_dir}{macOS_beforeClientServices}ClientSettings"):
                    os.mkdir(f"{macOS_dir}{macOS_beforeClientServices}ClientSettings")
                    printSuccessMessage(f"Created {macOS_dir}{macOS_beforeClientServices}ClientSettings..")
                else:
                    printWarnMessage(f"Client Settings is already created. Skipping Folder Creation..")
                printMainMessage("Writing ClientAppSettings.json")
                with open(f"{macOS_dir}{macOS_beforeClientServices}ClientSettings/ClientAppSettings.json", "w") as f:
                    f.write(json.dumps(fastflagJSON))
                printSuccessMessage("DONE!")
                printSuccessMessage("Your fast flags should be installed!")
                printSuccessMessage("Please know that you'll have to use this script again after every Roblox update/reinstall! Also, it only shows if you play a game, not in the home menu!")
                printSuccessMessage(f"If you like to update your fast flags, go to: {macOS_dir}{macOS_beforeClientServices}ClientSettings/ClientAppSettings.json")
                printMainMessage("Would you like to open Roblox? (y/n)")
                if input("> ").lower() == "y":
                    self.openRoblox()
            elif main_os == "Windows":
                printMainMessage(f"Closing any open Roblox windows..")
                self.endRoblox()
                printMainMessage(f"Finding latest Roblox Version..")
                most_recent_roblox_version_dir = self.get_latest_roblox_version(f"{windows_dir}\Versions")
                if most_recent_roblox_version_dir:
                    printMainMessage(f"Found version: {most_recent_roblox_version_dir}")
                    printMainMessage(f"Generating Client Settings Folder..")
                    if not os.path.exists(f"{most_recent_roblox_version_dir}ClientSettings"):
                        os.mkdir(f"{most_recent_roblox_version_dir}ClientSettings")
                        printSuccessMessage(f"Created {most_recent_roblox_version_dir}ClientSettings..")
                    else:
                        printWarnMessage(f"Client Settings is already created. Skipping Folder Creation..")
                    printMainMessage("Writing ClientAppSettings.json")
                    with open(f"{most_recent_roblox_version_dir}ClientSettings\ClientAppSettings.json", "w") as f:
                        f.write(json.dumps(fastflagJSON))
                    printSuccessMessage("DONE!")
                    printSuccessMessage("Your fast flags should be installed!")
                    printSuccessMessage("Please know that you'll have to use this script again after every Roblox update/reinstall! Also, it only shows if you play a game, not in the home menu!")
                    printSuccessMessage(f"If you like to update your fast flags, go to: {most_recent_roblox_version_dir}ClientSettings\ClientAppSettings.json")
                    printMainMessage("Would you like to open Roblox? (y/n)")
                    if input("> ").lower() == "y":
                        self.openRoblox()
                else:
                    printErrorMessage("Roblox couldn't be found.")
            else:
                printErrorMessage("RobloxFastFlagsInstaller is only supported for macOS and Windows.")
        else:
            if askForPerms == True:
                self.printLog("Would you like to continue with the Roblox Fast Flag installation? (y/n)")
                self.printLog("WARNING! This will force-quit any open Roblox windows! Please close them in order to prevent data loss!")
                if not (input("> ").lower() == "y"):
                    self.printLog("Stopped installation..")
                    return
            if main_os == "Darwin":
                self.endRoblox()
                if not os.path.exists(f"{macOS_dir}{macOS_beforeClientServices}ClientSettings"):
                    os.mkdir(f"{macOS_dir}{macOS_beforeClientServices}ClientSettings")
                with open(f"{macOS_dir}{macOS_beforeClientServices}ClientSettings/ClientAppSettings.json", "w") as f:
                    f.write(json.dumps(fastflagJSON))
            elif main_os == "Windows":
                self.endRoblox()
                most_recent_roblox_version_dir = self.get_latest_roblox_version(f"{windows_dir}\Versions")
                if most_recent_roblox_version_dir:
                    if not os.path.exists(f"{most_recent_roblox_version_dir}ClientSettings"):
                        os.mkdir(f"{most_recent_roblox_version_dir}ClientSettings")
                    with open(f"{most_recent_roblox_version_dir}ClientSettings\ClientAppSettings.json", "w") as f:
                        f.write(json.dumps(fastflagJSON))
                else:
                    self.printLog("Roblox couldn't be found.")
            else:
                self.printLog("RobloxFastFlagsInstaller is only supported for macOS and Windows.")
    def openRoblox(self):
        if main_os == "Darwin":
            os.system(f"open -a {macOS_dir}")
        elif main_os == "Windows":
            most_recent_roblox_version_dir = self.get_latest_roblox_version(f"{windows_dir}\Versions")
            if most_recent_roblox_version_dir:
                os.system(f"start {most_recent_roblox_version_dir}RobloxPlayerBeta.exe")
                self.printLog("Started Roblox..")
            else:
                self.printLog("Roblox couldn't be found.")
        else:
            self.printLog("RobloxFastFlagsInstaller is only supported for macOS and Windows.")

if __name__ == "__main__":
    if main_os == "Windows":
        printWarnMessage("-----------")
        printWarnMessage("Welcome to Roblox Fast Flags Setup by EfazDev!")
    elif main_os == "Darwin":
        printWarnMessage("-----------")
        printWarnMessage("Welcome to Roblox Fast Flags Setup by EfazDev for macOS!")
    else:
        printErrorMessage("Please run this script on macOS/Windows.")
        exit()
    printWarnMessage("Made by Efaz from efaz.dev!")
    printWarnMessage("v1.0.1")
    printWarnMessage("-----------")
    printWarnMessage("Entering Setup..")
    handler = RobloxFastFlagsInstaller()
    def getUserId():
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
    id = getUserId()
    if id:
        # Based JSON
        generated_json = {}

        # FPS Unlocker
        printWarnMessage("--- FPS Unlocker ---")
        printMainMessage("Would you like to use an FPS Unlocker? (y/n)")
        installFPSUnlocker = input("> ").lower() == "y"
        def getFPSCap():
            printWarnMessage("- FPS Cap -")
            printMainMessage("Enter the FPS cap to install on your client. (Leave blank for no cap)")
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
            printWarnMessage("- Roblox Vulkan Rendering -")
            printMainMessage("Would you like to use Vulkan Rendering? (It will remove the cap fully but may cause issues) (y/n)")
            useVulkan = input("> ").lower() == "y"

            if main_os == "Darwin":
                generated_json["FFlagDebugGraphicsDisableMetal"] =  "true"

            if fpsCap == None:
                generated_json["DFIntTaskSchedulerTargetFps"] = 99999
            else:
                generated_json["DFIntTaskSchedulerTargetFps"] = int(fpsCap)

            if useVulkan == True:
                generated_json["FFlagDebugGraphicsPreferVulkan"] = str(useVulkan)
        else:
            # Roblox FPS Unlocker
            printWarnMessage("- Roblox FPS Unlocker -")
            printMainMessage("Would you like the Roblox FPS Unlocker in your settings? (This may not work depending on your Roblox client version.) (y/n)")
            robloxFPSUnlocker = input("> ").lower() == "y"
            if robloxFPSUnlocker == True:
                generated_json["FFlagGameBasicSettingsFramerateCap4"] = "true"
                generated_json["DFIntTaskSchedulerTargetFps"] = "0"

        # Verified Badge
        printWarnMessage("--- Verified Badge ---")
        printMainMessage("Would you like to use a verified badge during Roblox Games? (y/n)")
        installVerifiedBadge = input("> ").lower() == "y"
        if installVerifiedBadge == True:
            generated_json["FStringWhitelistVerifiedUserId"] = str(id)

        # Accessory Adjustments
        printWarnMessage("--- Accessory Adjustments ---")
        printMainMessage("Would you like to install an accessory adjustments fast flag? (It may depend on your current version of Roblox.) (y/n)")
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
        
        # Remove Builder Font
        printWarnMessage("--- Remove Builder Font ---")
        printMainMessage("Would you like to remove the Builder font and revert it back to the original font on your client? (This may not work anymore!!) (y/n)")
        installRemoveBuilder = input("> ").lower() == "y"
        if installRemoveBuilder == True:
            generated_json["FFlagEnableNewFontNameMappingABTest2"] = "false"

        # Display FPS
        printWarnMessage("--- Display FPS ---")
        printMainMessage("Would you like your client to display the FPS? (y/n)")
        installRemoveBuilder = input("> ").lower() == "y"
        if installRemoveBuilder == True:
            generated_json["FFlagDebugDisplayFPS"] = "true"

        # Disable Ads
        printWarnMessage("--- Disable Ads ---")
        printMainMessage("Would you like your client to disable ads? (y/n)")
        installRemoveAds = input("> ").lower() == "y"
        if installRemoveAds == True:
            generated_json["FFlagAdServiceEnabled"] = "false"

        # Darker Mode
        printWarnMessage("--- Darker Mode ---")
        printMainMessage("Would you like to enable Darker mode on your client? (y/n)")
        installDarkerMode = input("> ").lower() == "y"
        if installDarkerMode == True:
            generated_json["FFlagLuaAppUseUIBloxColorPalettes1"] = "true"
            generated_json["FFlagUIBloxUseNewThemeColorPalettes"] = "true"

        # Custom Disconnect Message
        printWarnMessage("--- Custom Disconnect Message ---")
        printMainMessage("Would you like to use your own disconnect message? (y/n)")
        installCustomDisconnect = input("> ").lower() == "y"
        if installCustomDisconnect == True:
            generated_json["FFlagReconnectDisabled"] = "true"
            generated_json["FStringReconnectDisabledReason"] = input("Enter Disconnect Message: ")

        # Quick Connect
        printWarnMessage("--- Quick Connect ---")
        printMainMessage("Would you like to install Quick Connect on your client? (y/n)")
        printErrorMessage("WARNING! This can be buggy and may cause issues on your Roblox experience!!!")
        installQuickConnect = input("> ").lower() == "y"
        if installQuickConnect == True:
            generated_json["FFlagEnableQuickGameLaunch"] = "true"

        # Custom Fast Flags
        printWarnMessage("--- Custom Fast Flags ---")
        def custom():
            def loop():
                key = input("Enter Key Value: ")
                if key == "exit":
                    return {"success": False, "key": "", "value": ""}
                value = input("Enter Value Value: ")
                if value == "exit":
                    return {"success": False, "key": "", "value": ""}
                if value.isnumeric():
                    isNum = input("Would you like this value to be a number value or do you want to keep it as a string? (y/n)")
                    if isNum == True:
                        value = int(value)
                return {"success": True, "key": key, "value": value}
            completeLoop = loop()
            if completeLoop["success"] == True:
                generated_json[completeLoop["key"]] = completeLoop["value"]
                printMainMessage("Would you like to add more fast flags? (y/n)")
                more = input("> ").lower() == "y"
                if more == True:
                    custom()
        printMainMessage("Would you like to use custom fast flags? (y/n)")
        installCustom = input("> ").lower() == "y"
        if installCustom == True:
            custom()

        # Installation
        printWarnMessage("--- Installation Ready! ---")
        printMainMessage("Settings are now finished and now ready for setup!")
        printMainMessage("Would you like to continue with the fast flag installation? (y/n)")
        printErrorMessage("WARNING! This will force-quit any open Roblox windows! Please close them in order to prevent data loss!")
        install_now = input("> ")
        if install_now.lower() == "y":
            handler.installFastFlagsJSON(generated_json)
        elif install_now.lower() == "json()":
            printMainMessage("Generated JSON:")
            printMainMessage(json.dumps(generated_json))
            exit()
        else:
            printMainMessage("Ending installation..")
            exit()