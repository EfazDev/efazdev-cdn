try:
    import json
    import shutil
    import subprocess
    import os
except Exception as e:
    print(f"\033[38;5;196m{'Something went wrong trying to use provided python modules!'}\033[0m")

def printMainMessage(mes): print(f"\033[38;5;255m{mes}\033[0m")
def printErrorMessage(mes): print(f"\033[38;5;196m{mes}\033[0m")
def printSuccessMessage(mes): print(f"\033[38;5;82m{mes}\033[0m")
def printWarnMessage(mes): print(f"\033[38;5;202m{mes}\033[0m")
def printYellowMessage(mes): print(f"\033[38;5;226m{mes}\033[0m")
def printDebugMessage(mes): print(f"\033[38;5;226m{mes}\033[0m")
def isYes(text): return text.lower() == "y" or text.lower() == "yes"
def isNo(text): return text.lower() == "n" or text.lower() == "no"
def isRequestClose(text): return text.lower() == "exit" or text.lower() == "exit()"

printWarnMessage("--- Preparing Generation ---")
current_path_location = os.path.join(os.path.dirname(os.path.abspath(__file__)), "../")
extension_path = os.path.join(current_path_location, "chromeExtension")
extensions_folder = os.path.join(current_path_location, "..")
printMainMessage(f"Python File Location: {current_path_location}")
printMainMessage(f"Bundle Extension Location: {extension_path}")
printMainMessage(f"Extensions Location: {extensions_folder}")
printWarnMessage("--- Zipping Available Extensions ---")
extensions_added = []
for i in os.listdir(extensions_folder):
    if not (i == "dev.efaz.bundled_extension" or i == "versions") and os.path.isdir(os.path.join(extensions_folder, i)) and not os.path.islink(os.path.join(extensions_folder, i)):
        printMainMessage(f"Zipping {i} Extension..")
        if os.path.exists(os.path.join(extensions_folder, i, "zip", "chromeExtension.zip")): os.remove(os.path.join(extensions_folder, i, "zip", "chromeExtension.zip"))
        if os.path.exists(os.path.join(extensions_folder, i, "zip", "firefoxExtension.zip")): os.remove(os.path.join(extensions_folder, i, "zip", "firefoxExtension.zip"))
        if os.path.exists(os.path.join(extensions_folder, i, "chromeExtension")):
            subprocess.run(
                f'zip -r ../zip/chromeExtension.zip ./ -x "*.git*" -x "*.DS_Store" -x "__MACOSX*" -x "__pycache*"',
                cwd=os.path.join(extensions_folder, i, "chromeExtension"),
                shell=True,
            )
        if os.path.exists(os.path.join(extensions_folder, i, "firefoxExtension")):
            subprocess.run(
                f'zip -r ../zip/firefoxExtension.zip ./ -x "*.git*" -x "*.DS_Store" -x "__MACOSX*" -x "__pycache*"',
                cwd=os.path.join(extensions_folder, i, "firefoxExtension"),
                shell=True,
            )
        extensions_added.append(i)
printSuccessMessage("SUCCESS!")
printSuccessMessage("Successfully recreated ZIP files from existing extensions made!")
printSuccessMessage(f"Extensions Path: {extensions_folder}")
printSuccessMessage(f"Chrome Extensions: {', '.join(extensions_added)}")