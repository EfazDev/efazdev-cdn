try:
    import json
    import shutil
    import subprocess
    import os
    import re
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
printWarnMessage("--- Generating Firefox Extensions ---")
extensions_added = []
for i in os.listdir(extensions_folder):
    if not (i == "versions") and os.path.isdir(os.path.join(extensions_folder, i)) and not os.path.islink(os.path.join(extensions_folder, i)):
        printMainMessage(f"Generating {i} Firefox Extension..")
        if os.path.exists(os.path.join(extensions_folder, i, "firefoxExtension")): shutil.rmtree(os.path.join(extensions_folder, i, "firefoxExtension"), ignore_errors=True)
        if os.path.exists(os.path.join(extensions_folder, i, "chromeExtension")):
            shutil.copytree(os.path.join(extensions_folder, i, "chromeExtension"), os.path.join(extensions_folder, i, "firefoxExtension"), dirs_exist_ok=True)
            with open(os.path.join(extensions_folder, i, "firefoxExtension", "manifest.json"), "r") as f: man = json.load(f)
            man["background"] = {"scripts": ["main.js"]}
            man.pop("content_security_policy")
            man.pop("externally_connectable")
            man.pop("sandbox")
            man["action"].pop("default_popup")
            man["browser_specific_settings"] = {
                "gecko": {
                    "id": f"{i.split('.')[-1]}@efaz.dev",
                    "strict_min_version": "109.0"
                }
            }
            for res in man["web_accessible_resources"]: res.pop("use_dynamic_url")
            with open(os.path.join(extensions_folder, i, "firefoxExtension", "manifest.json"), "w") as f: json.dump(man, f, indent=4, ensure_ascii=False)
            with open(os.path.join(extensions_folder, i, "firefoxExtension", "settings.json"), "r") as f: man2 = json.load(f)
            man2["browserMode"] = "firefox"
            with open(os.path.join(extensions_folder, i, "firefoxExtension", "settings.json"), "w") as f: json.dump(man2, f, indent=4, ensure_ascii=False)
            with open(os.path.join(extensions_folder, i, "firefoxExtension", "settings.html"), "r") as f: set_html = f.read()
            set_html = re.sub(r'html\s*\{\s*width\s*:\s*[^;]+;\s*height\s*:\s*[^;]+;\s*\}', "", set_html, flags=re.IGNORECASE)
            with open(os.path.join(extensions_folder, i, "firefoxExtension", "settings.html"), "w") as f: f.write(set_html)
            shutil.copy(os.path.join(current_path_location, "resources", "firefox_main.js"), os.path.join(extensions_folder, i, "firefoxExtension", "main.js"))
            if i == "dev.efaz.bundled_extension":
                for res in os.listdir(os.path.join(extensions_folder, i, "firefoxExtension")):
                    if os.path.isdir(os.path.join(extensions_folder, i, "firefoxExtension", res)):
                        rese = os.path.join(extensions_folder, i, "firefoxExtension", res)
                        with open(os.path.join(rese, "settings.json"), "r") as f: man2 = json.load(f)
                        man2["browserMode"] = "firefox"
                        with open(os.path.join(rese, "settings.json"), "w") as f: json.dump(man2, f, indent=4, ensure_ascii=False)
                        with open(os.path.join(rese, "settings.html"), "r") as f: set_html = f.read()
                        set_html = re.sub(r'html\s*\{\s*width\s*:\s*[^;]+;\s*height\s*:\s*[^;]+;\s*\}', "", set_html, flags=re.IGNORECASE)
                        with open(os.path.join(rese, "settings.html"), "w") as f: f.write(set_html)
                printMainMessage(f"(generating zip file for bundle extension..)")
                subprocess.run(
                    f'zip -r ../zip/firefoxExtension.zip ./ -x "*.git*" -x "*.DS_Store" -x "__MACOSX*" -x "__pycache*"',
                    cwd=os.path.join(extensions_folder, i, "firefoxExtension"),
                    shell=True,
                )
        extensions_added.append(i)
printSuccessMessage("SUCCESS!")
printSuccessMessage("Successfully recreated Firefox extensions from Chrome extensions made!")
printSuccessMessage(f"Extensions Path: {extensions_folder}")
printSuccessMessage(f"Extensions: {', '.join(extensions_added)}")