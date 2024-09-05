import os
import platform
import json
import subprocess
import time
import threading

main_os = platform.system()

# If your Roblox installation is inside of an another folder or on an extra hard drive, you may edit the following here.
macOS_dir = "/Applications/Roblox.app"
macOS_beforeClientServices = "/Contents/MacOS/"
windows_dir = f"{os.getenv('LOCALAPPDATA')}\\Roblox"
# If your Roblox installation is inside of an another folder or on an extra hard drive, you may edit the following here.

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

class Main():
    # System Functions
    def __init__(self):
        self.__main_os__ = main_os
    # System Functions

    def printLog(self, m):
        if __name__ == "__main__":
            printMainMessage(m)
        else:
            print(m)
    def readPListFile(self, path):
        if os.path.exists(path) and path.endswith(".plist"):
            import plistlib
            with open(path, "rb") as f:
                plist_data = plistlib.load(f)
            return plist_data
        else:
            return {}
                
    def endRoblox(self):
        if self.getIfRobloxIsOpen():
            if self.__main_os__ == "Darwin":
                os.system("killall -9 RobloxPlayer")
            elif self.__main_os__ == "Windows":
                os.system("taskkill /IM RobloxPlayerBeta.exe /F")
            else:
                self.printLog("RobloxFastFlagsInstaller is only supported for macOS and Windows.")
    def getIfRobloxIsOpen(self, installer=False):
        if self.__main_os__ == "Windows":
            process = subprocess.Popen(["tasklist"], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        elif self.__main_os__ == "Darwin":
            process = subprocess.Popen(["ps", "aux"], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        else:
            self.printLog("RobloxFastFlagsInstaller is only supported for macOS and Windows.")
            return

        output, _ = process.communicate()
        process_list = output.decode("utf-8")

        if main_os == "Darwin":
            if installer == False:
                if process_list.rfind("/RobloxPlayer") == -1:
                    return False
                else:
                    return True
            else:
                if process_list.rfind("/RobloxPlayerInstaller") == -1:
                    return False
                else:
                    return True
        else:
            if installer == False:
                if process_list.rfind("RobloxPlayerBeta.exe") == -1:
                    return False
                else:
                    return True
            else:
                if process_list.rfind("RobloxPlayerInstaller.exe") == -1:
                    return False
                else:
                    return True
    def getLatestClientVersion(self, debug=False):
        # Mac: https://clientsettingscdn.roblox.com/v2/client-version/MacPlayer
        # Windows: https://clientsettingscdn.roblox.com/v2/client-version/WindowsPlayer

        try:
            import requests
        except Exception as e:
            import pip
            printMainMessage("This application is requesting for the latest Roblox version but needs a module. Would you like to install it? (y/n)")
            if isYes(input("> ")) == True:
                pip.main(["install", "requests"])
                printSuccessMessage("Successfully installed modules!")
            else:
                printErrorMessage("Returning back to application.")
                return {"success": False, "message": "User rejected need of module."}
            
        if self.__main_os__ == "Darwin":
            if debug == True: printDebugMessage("Sending Request to Roblox Servers..") 
            res = requests.get("https://clientsettingscdn.roblox.com/v2/client-version/MacPlayer")
            if res.ok:
                jso = res.json()
                if jso.get("clientVersionUpload") and jso.get("version"):
                    if debug == True: printDebugMessage(f"{res.text}")
                    return {"success": True, "client_version": jso.get("clientVersionUpload"), "short_version": jso.get("version")}
                else:
                    if debug == True: printDebugMessage(f"Something went wrong: {res.text}")
                    return {"success": False, "message": "Something went wrong."}
            else:
                if debug == True: printDebugMessage(f"Something went wrong: {res.text}")
                return {"success": False, "message": "Something went wrong."}
        elif self.__main_os__ == "Windows":
            if debug == True: printDebugMessage("Sending Request to Roblox Servers..") 
            res = requests.get("https://clientsettingscdn.roblox.com/v2/client-version/WindowsPlayer")
            if res.ok:
                jso = res.json()
                if jso.get("clientVersionUpload") and jso.get("version"):
                    if debug == True: printDebugMessage(f"{res.text}")
                    return {"success": True, "client_version": jso.get("clientVersionUpload"), "short_version": jso.get("version")}
                else:
                    if debug == True: printDebugMessage(f"Something went wrong: {res.text}")
                    return {"success": False, "message": "Something went wrong."}
            else:
                if debug == True: printDebugMessage(f"Something went wrong: {res.text}")
                return {"success": False, "message": "Something went wrong."}
        else:
            self.printLog("RobloxFastFlagsInstaller is only supported for macOS and Windows.")
            return {"success": False, "message": "OS not compatible."}
    def getCurrentClientVersion(self):
        if self.__main_os__ == "Darwin":
            if os.path.exists(f"{macOS_dir}/Contents/Info.plist"):
                read_plist = self.readPListFile(f"{macOS_dir}/Contents/Info.plist")
                if read_plist.get("CFBundleShortVersionString"):
                    return {"success": True, "isClientVersion": False, "version": read_plist["CFBundleShortVersionString"]}
                else:
                    return {"success": False, "message": "Something went wrong."}
            else:
                return {"success": False, "message": "Roblox not installed."}
        elif self.__main_os__ == "Windows":
            res = self.getRobloxInstallFolder()
            if res:
                return {"success": True, "isClientVersion": True, "version": os.path.dirname(res)}
            else:
                return {"success": False, "message": "Roblox not installed."}
        else:
            self.printLog("RobloxFastFlagsInstaller is only supported for macOS and Windows.")
            return {"success": False, "message": "OS not compatible."}
    def installFastFlagsJSON(self, fastflagJSON: object, askForPerms=False, merge=True, flat=False, endRobloxInstances=True, debug=False):
        if __name__ == "__main__":
            if self.__main_os__ == "Darwin":
                if endRobloxInstances == True:
                    printMainMessage(f"Closing any open Roblox windows..")
                    self.endRoblox()
                printMainMessage(f"Generating Client Settings Folder..")
                if not os.path.exists(f"{macOS_dir}{macOS_beforeClientServices}ClientSettings"):
                    os.mkdir(f"{macOS_dir}{macOS_beforeClientServices}ClientSettings")
                    printSuccessMessage(f"Created {macOS_dir}{macOS_beforeClientServices}ClientSettings..")
                else:
                    printWarnMessage(f"Client Settings is already created. Skipping Folder Creation..")
                printMainMessage("Writing ClientAppSettings.json")
                if merge == True:
                    if os.path.exists("FastFlagConfiguration.json"):
                        try:
                            printMainMessage("Reading Previous Client App Settings..")
                            with open(f"FastFlagConfiguration.json", "r") as f:
                                merge_json = json.loads(f.read())
                            merge_json.update(fastflagJSON)
                            fastflagJSON = merge_json
                        except Exception as e:
                            printErrorMessage(f"Something went wrong while trying to generate a merged JSON: {str(e)}")
                    elif os.path.exists(f"{macOS_dir}{macOS_beforeClientServices}ClientSettings/ClientAppSettings.json"):
                        try:
                            printMainMessage("Reading Previous Client App Settings..")
                            with open(f"{macOS_dir}{macOS_beforeClientServices}ClientSettings/ClientAppSettings.json", "r") as f:
                                merge_json = json.loads(f.read())
                            merge_json.update(fastflagJSON)
                            fastflagJSON = merge_json
                        except Exception as e:
                            printErrorMessage(f"Something went wrong while trying to generate a merged JSON: {str(e)}")
                set_location = f"{macOS_dir}{macOS_beforeClientServices}ClientSettings/ClientAppSettings.json"
                if os.path.exists("FastFlagConfiguration.json"):
                    set_location = "FastFlagConfiguration.json"
                with open(set_location, "w") as f:
                    if flat == True:
                        json.dump(fastflagJSON, f)
                    else:
                        json.dump(fastflagJSON, f, indent=4)
                printSuccessMessage("DONE!")
                if set_location == "FastFlagConfiguration.json":
                    printSuccessMessage("Your fast flags was successfully saved into your Fast Flag Settings!")
                    printSuccessMessage(f"If you like to update your fast flags, go to: {set_location}")
                else:
                    printSuccessMessage("Your fast flags should be installed!")
                    printSuccessMessage("Please know that you'll have to use this script again after every Roblox update/reinstall! Also, it only shows if you play a game, not in the home menu!")
                    printSuccessMessage(f"If you like to update your fast flags, go to: {set_location}")
                if __name__ == "__main__":
                    printMainMessage("Would you like to open Roblox? (y/n)")
                    if input("> ").lower() == "y":
                        self.openRoblox()
            elif self.__main_os__ == "Windows":
                printMainMessage(f"Closing any open Roblox windows..")
                self.endRoblox()
                printMainMessage(f"Finding latest Roblox Version..")
                most_recent_roblox_version_dir = self.getRobloxInstallFolder(f"{windows_dir}\\Versions")
                if most_recent_roblox_version_dir:
                    printMainMessage(f"Found version: {most_recent_roblox_version_dir}")
                    printMainMessage(f"Generating Client Settings Folder..")
                    if not os.path.exists(f"{most_recent_roblox_version_dir}ClientSettings"):
                        os.mkdir(f"{most_recent_roblox_version_dir}ClientSettings")
                        printSuccessMessage(f"Created {most_recent_roblox_version_dir}ClientSettings..")
                    else:
                        printWarnMessage(f"Client Settings is already created. Skipping Folder Creation..")
                    printMainMessage("Writing ClientAppSettings.json")
                    if merge == True:
                        if os.path.exists("FastFlagConfiguration.json"):
                            try:
                                printMainMessage("Reading Previous Client App Settings..")
                                with open(f"FastFlagConfiguration.json", "r") as f:
                                    merge_json = json.loads(f.read())
                                merge_json.update(fastflagJSON)
                                fastflagJSON = merge_json
                            except Exception as e:
                                printErrorMessage(f"Something went wrong while trying to generate a merged JSON: {str(e)}")
                        elif os.path.exists(f"{most_recent_roblox_version_dir}ClientSettings\\ClientAppSettings.json"):
                            try:
                                printMainMessage("Reading Previous Client App Settings..")
                                with open(f"{most_recent_roblox_version_dir}ClientSettings\\ClientAppSettings.json", "r") as f:
                                    merge_json = json.loads(f.read())
                                merge_json.update(fastflagJSON)
                                fastflagJSON = merge_json
                            except Exception as e:
                                printErrorMessage(f"Something went wrong while trying to generate a merged JSON: {str(e)}")
                    
                    set_location = f"{most_recent_roblox_version_dir}ClientSettings\\ClientAppSettings.json"
                    if os.path.exists("FastFlagConfiguration.json"):
                        set_location = "FastFlagConfiguration.json"
                    with open(set_location, "w") as f:
                        if flat == True:
                            json.dump(fastflagJSON, f)
                        else:
                            json.dump(fastflagJSON, f, indent=4)
                    printSuccessMessage("DONE!")
                    if set_location == "FastFlagConfiguration.json":
                        printSuccessMessage("Your fast flags was successfully saved into your Fast Flag Settings!")
                        printSuccessMessage(f"If you like to update your fast flags, go to: {set_location}")
                    else:
                        printSuccessMessage("Your fast flags should be installed!")
                        printSuccessMessage("Please know that you'll have to use this script again after every Roblox update/reinstall! Also, it only shows if you play a game, not in the home menu!")
                        printSuccessMessage(f"If you like to update your fast flags, go to: {set_location}")
                    if __name__ == "__main__":
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
            if self.__main_os__ == "Darwin":
                if endRobloxInstances == True:
                    self.endRoblox()
                    if debug == True: printDebugMessage("Ending Roblox Instances..")
                if not os.path.exists(f"{macOS_dir}{macOS_beforeClientServices}ClientSettings"):
                    os.mkdir(f"{macOS_dir}{macOS_beforeClientServices}ClientSettings")
                    if debug == True: printDebugMessage("Created ClientSettings folder..")
                if merge == True:
                    if os.path.exists(f"{macOS_dir}{macOS_beforeClientServices}ClientSettings/ClientAppSettings.json"):
                        try:
                            with open(f"{macOS_dir}{macOS_beforeClientServices}ClientSettings/ClientAppSettings.json", "r") as f:
                                merge_json = json.loads(f.read())
                            merge_json.update(fastflagJSON)
                            fastflagJSON = merge_json
                            if debug == True: printDebugMessage("Merged JSON.")
                        except Exception as e:
                            self.printLog(f"Something went wrong while trying to generate a merged JSON: {str(e)}")
                with open(f"{macOS_dir}{macOS_beforeClientServices}ClientSettings/ClientAppSettings.json", "w") as f:
                    if flat == True:
                        json.dump(fastflagJSON, f)
                    else:
                        json.dump(fastflagJSON, f, indent=4)
                if debug == True: printDebugMessage("Saved ClientAppSettings.json")
            elif self.__main_os__ == "Windows":
                self.endRoblox()
                if debug == True: printDebugMessage("Ending Roblox Instances..")
                most_recent_roblox_version_dir = self.getRobloxInstallFolder(f"{windows_dir}\\Versions")
                if most_recent_roblox_version_dir:
                    if not os.path.exists(f"{most_recent_roblox_version_dir}ClientSettings"):
                        os.mkdir(f"{most_recent_roblox_version_dir}ClientSettings")
                        if debug == True: printDebugMessage("Created ClientSettings folder..")
                    if merge == True:
                        if os.path.exists(f"{most_recent_roblox_version_dir}ClientSettings\\ClientAppSettings.json"):
                            try:
                                with open(f"{most_recent_roblox_version_dir}ClientSettings\\ClientAppSettings.json", "r") as f:
                                    merge_json = json.loads(f.read())
                                merge_json.update(fastflagJSON)
                                fastflagJSON = merge_json
                                if debug == True: printDebugMessage("Merged JSON.")
                            except Exception as e:
                                self.printLog(f"Something went wrong while trying to generate a merged JSON: {str(e)}")
                    with open(f"{most_recent_roblox_version_dir}ClientSettings\\ClientAppSettings.json", "w") as f:
                        if flat == True:
                            json.dump(fastflagJSON, f)
                        else:
                            json.dump(fastflagJSON, f, indent=4)
                    if debug == True: printDebugMessage("Saved ClientAppSettings.json")
                else:
                    self.printLog("Roblox couldn't be found.")
            else:
                self.printLog("RobloxFastFlagsInstaller is only supported for macOS and Windows.")
    def getRobloxInstallFolder(self, versions_dir=f"{windows_dir}\\Versions"): # Thanks ChatGPT :)
        if self.__main_os__ == "Windows":
            versions = [os.path.join(versions_dir, folder) for folder in os.listdir(versions_dir) if os.path.isdir(os.path.join(versions_dir, folder))]
            formatted = []
            if not versions:
                return None
            for fold in versions:
                if os.path.isdir(fold):
                    if os.path.exists(f"{fold}\\RobloxPlayerLauncher.exe"):
                        formatted.append(f"{fold}\\")
            if len(formatted) > 0:
                latest_folder = max(formatted, key=os.path.getmtime)
                return latest_folder
            else:
                return None
        elif self.__main_os__ == "Darwin":
            return f"{macOS_dir}/"
        else:
            self.printLog("RobloxFastFlagsInstaller is only supported for macOS and Windows.")
    def openRoblox(self, forceQuit=False, makeDupe=False, startData="", debug=False):
        if self.getIfRobloxIsOpen():
            if forceQuit == True:
                self.endRoblox()
                if debug == True: printDebugMessage("Ending Roblox Instances..")
        if self.__main_os__ == "Darwin":
            if makeDupe == True:
                com = f"open --new -a '{macOS_dir}{macOS_beforeClientServices}RobloxPlayer' {startData}"
                if debug == True: printDebugMessage("Running Roblox Player Unix Executable..")
                subprocess.Popen(com, shell=True)
            else:
                if debug == True: printDebugMessage("Running Roblox.app..")
                subprocess.Popen(f"open -a {macOS_dir} {startData}", shell=True)
        elif self.__main_os__ == "Windows":
            most_recent_roblox_version_dir = self.getRobloxInstallFolder(f"{windows_dir}\\Versions")
            if most_recent_roblox_version_dir:
                os.system(f"start {most_recent_roblox_version_dir}RobloxPlayerBeta.exe")
                self.printLog("Started Roblox..")
            else:
                self.printLog("Roblox couldn't be found.")
        else:
            self.printLog("RobloxFastFlagsInstaller is only supported for macOS and Windows.")
    def installRoblox(self, forceQuit=True, debug=False, disableRobloxAutoOpen=True):
        if self.getIfRobloxIsOpen():
            if forceQuit == True:
                self.endRoblox()
                if debug == True: printDebugMessage("Ending Roblox Instances..")
        if self.__main_os__ == "Darwin":
            def waitForRobloxEnd():
                if disableRobloxAutoOpen == True:
                    time.sleep(2)
                    if self.getIfRobloxIsOpen():
                        self.endRoblox()
            if self.getIfRobloxIsOpen(installer=True):
                if debug == True: printDebugMessage("Installer is already opened. Waiting for installation to end..")
                while True:
                    if not self.getIfRobloxIsOpen(installer=True):
                        break
                    else:
                        time.sleep(1)
                
                threading.Thread(target=waitForRobloxEnd).start()
            else:
                if debug == True: printDebugMessage("Running RobloxPlayerInstaller.app..")
                subprocess.run([f"{macOS_dir}{macOS_beforeClientServices}RobloxPlayerInstaller.app/Contents/MacOS/RobloxPlayerInstaller"], shell=True)
                threading.Thread(target=waitForRobloxEnd).start()
                
        elif self.__main_os__ == "Windows":
            most_recent_roblox_version_dir = self.getRobloxInstallFolder(f"{windows_dir}\\Versions")
            if most_recent_roblox_version_dir:
                os.system(f"start {most_recent_roblox_version_dir}RobloxPlayerInstaller.exe")
                self.printLog("Started Roblox Installer..")
            else:
                self.printLog("Roblox Installer couldn't be found.")
        else:
            self.printLog("RobloxFastFlagsInstaller is only supported for macOS and Windows.")

if __name__ == "__main__":
    os.system("cls" if os.name == "nt" else "clear")
    if main_os == "Windows":
        printWarnMessage("-----------")
        printWarnMessage("Welcome to Roblox Fast Flags Setup!")
    elif main_os == "Darwin":
        printWarnMessage("-----------")
        printWarnMessage("Welcome to Roblox Fast Flags Setup for macOS!")
    else:
        printErrorMessage("Please run this script on macOS/Windows.")
        exit()
    printWarnMessage("Made by Efaz from efaz.dev!")
    printWarnMessage("v1.2.0")
    printWarnMessage("-----------")
    printWarnMessage("Entering Setup..")
    if main_os == "Windows":
        if not os.path.exists(windows_dir):
            printErrorMessage("The Roblox Website App Path doesn't exist. Please install Roblox from your web browser in order to use!")
            exit()
    elif main_os == "Darwin":
        if not os.path.exists(macOS_dir):
            printErrorMessage("The Roblox Website App Path doesn't exist. Please install Roblox from your web browser in order to use!")
            exit()
    handler = Main()

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
        
    def isYes(text):
        return text.lower() == "y" or text.lower() == "yes"
    
    def isNo(text):
        return text.lower() == "n" or text.lower() == "no"
    
    def isRequestClose(text):
        return text.lower() == "exit" or text.lower() == "exit()"
    
    id = getUserId()
    if id:
        # Based JSON
        generated_json = {}

        # FPS Unlocker
        printWarnMessage("--- FPS Unlocker ---")
        printMainMessage("Would you like to use an FPS Unlocker? (y/n)")
        installFPSUnlocker = input("> ")
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
        if isYes(installFPSUnlocker) == True:
            # FPS Cap
            fpsCap = getFPSCap()

            # Roblox Vulkan Rendering
            printWarnMessage("- Roblox Vulkan Rendering -")
            printMainMessage("Would you like to use Vulkan Rendering? (It will remove the cap fully but may cause issues) (y/n)")
            useVulkan = input("> ")
            generated_json["FFlagTaskSchedulerLimitTargetFpsTo2402"] = "false"

            if main_os == "Darwin":
                generated_json["FFlagDebugGraphicsDisableMetal"] =  "true"

            if fpsCap == None:
                generated_json["DFIntTaskSchedulerTargetFps"] = 99999
            else:
                generated_json["DFIntTaskSchedulerTargetFps"] = int(fpsCap)

            if isYes(useVulkan) == True:
                generated_json["FFlagDebugGraphicsPreferVulkan"] = "true"
            elif isNo(useVulkan) == True:
                generated_json["FFlagDebugGraphicsPreferVulkan"] = "false"
            elif isRequestClose(useVulkan) == True:
                printMainMessage("Ending installation..")
                exit()
        elif isRequestClose(installFPSUnlocker) == True:
            printMainMessage("Ending installation..")
            exit()
        elif isNo(installFPSUnlocker) == True:
            generated_json["FFlagDebugGraphicsPreferVulkan"] = "false"
            generated_json["DFIntTaskSchedulerTargetFps"] = 60
            generated_json["FFlagDebugGraphicsDisableMetal"] = "false"

            # Roblox FPS Unlocker
            printWarnMessage("- Roblox FPS Unlocker -")
            printMainMessage("Would you like the Roblox FPS Unlocker in your settings? (This may not work depending on your Roblox client version.) (y/n)")
            robloxFPSUnlocker = input("> ")
            if isYes(robloxFPSUnlocker) == True:
                generated_json["FFlagGameBasicSettingsFramerateCap5"] = "true"
                generated_json["DFIntTaskSchedulerTargetFps"] = 0
            elif isRequestClose(robloxFPSUnlocker) == True:
                printMainMessage("Ending installation..")
                exit()

        # Verified Badge
        printWarnMessage("--- Verified Badge ---")
        printMainMessage("Would you like to use a verified badge during Roblox Games? (y/n)")
        installVerifiedBadge = input("> ")
        if isYes(installVerifiedBadge) == True:
            generated_json["FStringWhitelistVerifiedUserId"] = str(id)
        elif isRequestClose(installVerifiedBadge) == True:
            printMainMessage("Ending installation..")
            exit()
        elif isNo(installVerifiedBadge) == True:
            generated_json["FStringWhitelistVerifiedUserId"] = ""

        # Accessory Adjustments
        printWarnMessage("--- Accessory Adjustments ---")
        printMainMessage("Would you like to install an accessory adjustments fast flag? (It may depend on your current version of Roblox.) (y/n)")
        installAccessoryAdjust = input("> ")
        if isYes(installAccessoryAdjust) == True:
            generated_json["FFlagAccessoryAdjustmentEnabled2"] = "true"
            generated_json["FFlagHumanoidDescriptionUseInstances5"] = "true"
            generated_json["FFlagEnableNonUAPAccessoryAdjustment"] = "true"
            generated_json["FFlagAXAvatarFetchResultCamelCase"] = "true"
            generated_json["FFlagAccessoryAdjustmentEnabled3"] = "true"
            generated_json["FFlagAXAccessoryAdjustment"] = "true"
            generated_json["FFlagAXAccessoryAdjustmentIXPEnabled"] = "true"
            generated_json["FFlagAXAccessoryAdjustmentIXPEnabledForAll"] = "true"
        elif isRequestClose(installAccessoryAdjust) == True:
            printMainMessage("Ending installation..")
            exit()

        # Rename Charts to Discover
        printWarnMessage("--- Replace Charts ---")
        printMainMessage("Would you like to rename Charts back to Discover (may work)? (y/n)")
        installRenameCharts = input("> ")
        if isYes(installRenameCharts) == True:
            generated_json["FFlagLuaAppChartsPageRenameIXP"] = "true"
        elif isRequestClose(installRenameCharts) == True:
            printMainMessage("Ending installation..")
            exit()

        if main_os == "Windows":
            # Enable Developer Tools
            printWarnMessage("--- Enable Developer Tools ---")
            printMainMessage("Would you like to enable Developer Tools inside of the Roblox App (when website frame is opened) (Ctrl+Shift+I)? (y/n)")
            installEnableDeveloper = input("> ")
            if isYes(installEnableDeveloper) == True:
                generated_json["FFlagDebugEnableNewWebView2DevTool"] = "true"
            elif isRequestClose(installEnableDeveloper) == True:
                printMainMessage("Ending installation..")
                exit()
        
        if False: # This FFlag is no longer in service :(
            # Remove Builder Font
            printWarnMessage("--- Remove Builder Font ---")
            printMainMessage("Would you like to remove the Builder font and revert it back to the original font on your client? (This may not work anymore!!) (y/n)")
            installRemoveBuilder = input("> ")
            if isYes(installRemoveBuilder) == True:
                generated_json["FFlagEnableNewFontNameMappingABTest2"] = "false"
            elif isRequestClose(installRemoveBuilder) == True:
                printMainMessage("Ending installation..")
                exit()
            elif isNo(installRemoveBuilder) == True:
                generated_json["FFlagEnableNewFontNameMappingABTest2"] = "true"

        # Display FPS
        printWarnMessage("--- Display FPS ---")
        printMainMessage("Would you like your client to display the FPS? (y/n)")
        installFPSViewer = input("> ")
        if isYes(installFPSViewer) == True:
            generated_json["FFlagDebugDisplayFPS"] = "true"
        elif isRequestClose(installFPSViewer) == True:
            printMainMessage("Ending installation..")
            exit()
        elif isNo(installFPSViewer) == True:
            generated_json["FFlagDebugDisplayFPS"] = "false"

        # Disable Ads
        printWarnMessage("--- Disable Ads ---")
        printMainMessage("Would you like your client to disable ads? (y/n)")
        installRemoveAds = input("> ")
        if isYes(installRemoveAds) == True:
            generated_json["FFlagAdServiceEnabled"] = "false"
        elif isRequestClose(installRemoveAds) == True:
            printMainMessage("Ending installation..")
            exit()
        elif isNo(installRemoveAds) == True:
            generated_json["FFlagAdServiceEnabled"] = "true"

        # Enable Genre System
        printWarnMessage("--- Enable New Genre System Under Making ---")
        printMainMessage("Would you like to enable the new genre system in beta? (y/n)")
        installGenreSystem = input("> ")
        if isYes(installGenreSystem) == True:
            generated_json["FFlagLuaAppGenreUnderConstruction"] = "false"
        elif isRequestClose(installGenreSystem) == True:
            printMainMessage("Ending installation..")
            exit()
        elif isNo(installGenreSystem) == True:
            generated_json["FFlagLuaAppGenreUnderConstruction"] = "true"

        # Enable Freecam
        printWarnMessage("--- Enable Freecam ---")
        printMainMessage("Would you like to enable freecam on the Roblox client (only works if you're a Roblox Developer or Star Creator)? (y/n)")
        installFreecam = input("> ")
        if isYes(installFreecam) == True:
            generated_json["FFlagLoadFreecamModule"] = "true"
        elif isRequestClose(installFreecam) == True:
            printMainMessage("Ending installation..")
            exit()
        elif isNo(installFreecam) == True:
            generated_json["FFlagLoadFreecamModule"] = "false"

        # Enable Text Size Scaling
        printWarnMessage("--- Enable Text Size Scaling ---")
        printMainMessage("Would you like to enable the text size scaling in beta? (y/n)")
        installTextSizeScale = input("> ")
        if isYes(installTextSizeScale) == True:
            generated_json["FFlagEnablePreferredTextSizeScale"] = "true"
            generated_json["FFlagEnablePreferredTextSizeSettingInMenus2"] = "true"
        elif isRequestClose(installTextSizeScale) == True:
            printMainMessage("Ending installation..")
            exit()
        elif isNo(installTextSizeScale) == True:
            generated_json["FFlagEnablePreferredTextSizeScale"] = "false"
            generated_json["FFlagEnablePreferredTextSizeSettingInMenus2"] = "false"

        # Darker Mode
        printWarnMessage("--- Darker Mode ---")
        printMainMessage("Would you like to enable Darker mode on your client? (y/n)")
        installDarkerMode = input("> ")
        if isYes(installDarkerMode) == True:
            generated_json["FFlagLuaAppUseUIBloxColorPalettes1"] = "true"
            generated_json["FFlagUIBloxUseNewThemeColorPalettes"] = "true"
        elif isRequestClose(installDarkerMode) == True:
            printMainMessage("Ending installation..")
            exit()
        elif isNo(installDarkerMode) == True:
            generated_json["FFlagLuaAppUseUIBloxColorPalettes1"] = "false"
            generated_json["FFlagUIBloxUseNewThemeColorPalettes"] = "false"

            # Blue Mode
            # printWarnMessage("--- Blue Mode ---")
            # printMainMessage("Would you like to enable the original Blue theme on the client? (y/n)")
            # installBlueTheme = input("> ")
            # if isYes(installBlueTheme) == True:
            #     generated_json["FFlagLuaAppEnableFoundationColors"] = "true"
            # elif isRequestClose(installBlueTheme) == True:
            #     printMainMessage("Ending installation..")
            #     exit()
            # elif isNo(installBlueTheme) == True:
            #     generated_json["FFlagLuaAppEnableFoundationColors"] = "false"

        # Custom Disconnect Message
        printWarnMessage("--- Custom Disconnect Message ---")
        printMainMessage("Would you like to use your own disconnect message? (y/n)")
        installCustomDisconnect = input("> ")
        if isYes(installCustomDisconnect) == True:
            generated_json["FFlagReconnectDisabled"] = "true"
            generated_json["FStringReconnectDisabledReason"] = input("Enter Disconnect Message: ")
        elif isRequestClose(installCustomDisconnect) == True:
            printMainMessage("Ending installation..")
            exit()
        elif isNo(installCustomDisconnect) == True:
            generated_json["FFlagReconnectDisabled"] = "false"
            generated_json["FStringReconnectDisabledReason"] = ""

        # Ability to Hide UI
        printWarnMessage("--- Hide UI ---")
        printMainMessage("Would you like to enable the ability to hide GUIs? (y/n)")
        installHideUI = input("> ")
        if isYes(installHideUI) == True:
            generated_json["DFIntCanHideGuiGroupId"] = input("Enter a group ID that you're in: ")
            if main_os == "Windows":
                printMainMessage("Combinations for hiding:")
                printMainMessage("Ctrl+Shift+B = Toggles BillboardGuis and SurfaceGuis")
                printMainMessage("Ctrl+Shift+C = Toggles PlayerGui")
                printMainMessage("Ctrl+Shift+G = Toggles CoreGui")
                printMainMessage("Ctrl+Shift+N = Toggles GUIs that appear above players")
            elif main_os == "Darwin":
                printMainMessage("Combinations for hiding:")
                printMainMessage("Command+Shift+B = Toggles BillboardGuis and SurfaceGuis")
                printMainMessage("Command+Shift+C = Toggles PlayerGui")
                printMainMessage("Command+Shift+G = Toggles CoreGui")
                printMainMessage("Command+Shift+N = Toggles GUIs that appear above players")
            else:
                printMainMessage("Ending installation..")
                exit()
        elif isRequestClose(installHideUI) == True:
            printMainMessage("Ending installation..")
            exit()
        elif isNo(installHideUI) == True:
            generated_json["DFIntCanHideGuiGroupId"] = ""

        # Quick Connect
        printWarnMessage("--- Quick Connect ---")
        printMainMessage("Would you like to install Quick Connect on your client? (y/n)")
        printErrorMessage("WARNING! This can be buggy and may cause issues on your Roblox experience!!!")
        installQuickConnect = input("> ")
        if isYes(installQuickConnect) == True:
            generated_json["FFlagEnableQuickGameLaunch"] = "true"
        elif isRequestClose(installQuickConnect) == True:
            printMainMessage("Ending installation..")
            exit()
        elif isNo(installQuickConnect) == True:
            generated_json["FFlagEnableQuickGameLaunch"] = "false"

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
                more = input("> ")
                if isYes(more) == True:
                    custom()
        printMainMessage("Would you like to use custom fast flags? (y/n)")
        installCustom = input("> ")
        if isYes(installCustom) == True:
            custom()
        elif isRequestClose(installCustom) == True:
            printMainMessage("Ending installation..")
            exit()

        # Installation Mode
        printWarnMessage("--- Installation Mode ---")
        printMainMessage("[y/yes] = Install/Reinstall Flags")
        printMainMessage("[n/no/(*)] = Cancel Install")
        printMainMessage("[j/json] = Get JSON Settings")
        printMainMessage("[nm/no-merge] = Don't Merge Settings with Previous Settings")
        printMainMessage("[f/flat] = Flat JSON Install")
        printMainMessage("[fnm/flat-no-merge] = Flat-No-Merge Install")
        printMainMessage("[r/reset] = Reset Settings")
        select_mode = input("> ")
        if isYes(select_mode) == True:
            printMainMessage("Selected Mode: Install/Reinstall Flags")
        elif select_mode.lower() == "j" or select_mode.lower() == "json":
            printMainMessage("Selected Mode: Get JSON Settings")
        elif select_mode.lower() == "nm" or select_mode.lower() == "no-merge":
            printMainMessage("Selected Mode: Don't Merge Settings with Previous Settings")
        elif select_mode.lower() == "f" or select_mode.lower() == "flat":
            printMainMessage("Selected Mode: Flat JSON Install")
        elif select_mode.lower() == "fnm" or select_mode.lower() == "flat-no-merge":
            printMainMessage("Selected Mode: Flat-No-Merge Install")
        elif select_mode.lower() == "r" or select_mode.lower() == "reset":
            printMainMessage("Selected Mode: Reset Settings")
        else:
            printMainMessage("Ending installation..")
            exit()

        # Installation
        if not (select_mode.lower() == "j" or select_mode.lower() == "json"):
            printWarnMessage("--- Installation Ready! ---")
            printMainMessage("Settings are now finished and now ready for setup!")
            printMainMessage("Would you like to continue with the fast flag installation? (y/n)")
            printErrorMessage("WARNING! This will force-quit any open Roblox windows! Please close them now before continuing in order to prevent data loss!")
            install_now = input("> ")
            if isYes(install_now) == True:
                if isYes(select_mode) == True:
                    handler.installFastFlagsJSON(generated_json)
                elif select_mode.lower() == "j" or select_mode.lower() == "json":
                    printMainMessage("Generated JSON:")
                    printMainMessage(json.dumps(generated_json))
                    exit()
                elif select_mode.lower() == "nm" or select_mode.lower() == "no-merge":
                    handler.installFastFlagsJSON(generated_json, merge=False)
                elif select_mode.lower() == "f" or select_mode.lower() == "flat":
                    handler.installFastFlagsJSON(generated_json, flat=True)
                elif select_mode.lower() == "fnm" or select_mode.lower() == "flat-no-merge":
                    handler.installFastFlagsJSON(generated_json, merge=False, flat=True)
                elif select_mode.lower() == "r" or select_mode.lower() == "reset":
                    handler.installFastFlagsJSON({})
                else:
                    printMainMessage("Ending installation..")
                    exit()
            else:
                printMainMessage("Ending installation..")
                exit()