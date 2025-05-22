try:
    import json
    import shutil
    import subprocess
    import os
except Exception as e:
    print(
        f"\033[38;5;196m{'Something went wrong trying to use provided python modules!'}\033[0m"
    )

def printMainMessage(mes):
    print(f"\033[38;5;255m{mes}\033[0m")
def printErrorMessage(mes):
    print(f"\033[38;5;196m{mes}\033[0m")
def printSuccessMessage(mes):
    print(f"\033[38;5;82m{mes}\033[0m")
def printWarnMessage(mes):
    print(f"\033[38;5;202m{mes}\033[0m")
def printYellowMessage(mes):
    print(f"\033[38;5;226m{mes}\033[0m")
def printDebugMessage(mes):
    print(f"\033[38;5;226m{mes}\033[0m")
def isYes(text):
    return text.lower() == "y" or text.lower() == "yes"
def isNo(text):
    return text.lower() == "n" or text.lower() == "no"
def isRequestClose(text):
    return text.lower() == "exit" or text.lower() == "exit()"

# Preparing Generation
printWarnMessage("--- Preparing Generation ---")
current_path_location = os.path.join(os.path.dirname(os.path.abspath(__file__)), "../")
extension_path = os.path.join(current_path_location, "chromeExtension")
extensions_folder = os.path.join(current_path_location, "..")
printMainMessage(f"Python File Location: {current_path_location}")
printMainMessage(f"Bundle Extension Location: {extension_path}")
printMainMessage(f"Extensions Location: {extensions_folder}")

# Clearing Existing Extensions
printWarnMessage("--- Clearing Existing Extensions ---")
for i in os.listdir(extension_path):
    if os.path.isdir(os.path.join(extension_path, i)):
        printMainMessage(f"Clearing {i} Extension..")
        shutil.rmtree(os.path.join(extension_path, i), ignore_errors=True)

# Finding Available Extensions
printWarnMessage("--- Finding Available Extensions ---")
extensions_added = []
for i in os.listdir(extensions_folder):
    if not (i == "dev.efaz.bundled_extension" or i == "dev.efaz.example_extension" or i == "versions" or i == "dev.efaz.efaz_roblox_theme") and os.path.isdir(os.path.join(extensions_folder, i)) and not os.path.islink(os.path.join(extensions_folder, i)):
        printMainMessage(f"Copying {i} Extension..")
        shutil.copytree(
            os.path.join(extensions_folder, i, "chromeExtension"),
            os.path.join(extension_path, i),
            dirs_exist_ok=True,
        )
        extensions_added.append(i)
printMainMessage(f"Extensions: {json.dumps(extensions_added)}")

# Updating Bundle Information
printWarnMessage("--- Updating Bundle Information ---")
printMainMessage("Opening Settings JSON..")
with open(os.path.join(extension_path, "settings.json"), "r") as f:
    se = json.load(f)
printMainMessage("Opening Manifest JSON..")
with open(os.path.join(extension_path, "manifest.json"), "r") as f:
    ma = json.load(f)
mans = {}
ses = {}
for i in extensions_added:
    printMainMessage(f"Opening JSONs for {i}..")
    with open(f"{extension_path}/{i}/manifest.json", "r") as f:
        mans[i] = json.load(f)
    with open(f"{extension_path}/{i}/settings.json", "r") as f:
        ses[i] = json.load(f)
content_scripts = []
content_css = []
web_accessible_resources = []
manifest_permissions = ["storage"]
for a, v in mans.items():
    if v.get("content_scripts"):
        for i in v.get("content_scripts"):
            js = i.get("js", [])
            css = i.get("css", [])
            jss = []
            csss = []
            for e in js:
                if e.find(f"{a}/") == -1:
                    jss.append(f"{a}/{e}")
                else:
                    jss.append(f"{e}")
            for e in css:
                if e.find(f"{a}/") == -1:
                    csss.append(f"{a}/{e}")
                else:
                    csss.append(f"{e}")
            content_scripts = content_scripts + jss
            content_css = content_css + csss
for a, v in mans.items():
    if v.get("web_accessible_resources"):
        for i in v.get("web_accessible_resources"):
            resou = i.get("resources", [])
            resourcess = []
            for e in resou:
                if e.find(f"{a}/") == -1:
                    resourcess.append(f"{a}/{e}")
                else:
                    resourcess.append(f"{e}")
            web_accessible_resources = web_accessible_resources + resourcess
for a, v in ses.items():
    v["bundleAssociatedName"] = a
for a, v in mans.items():
    if v.get("permissions"):
        for i in v.get("permissions"):
            if not (i in manifest_permissions):
                manifest_permissions.append(i)
se["extensions"] = extensions_added
ma["content_scripts"] = [
    {
        "all_frames": True,
        "js": content_scripts,
        "css": content_css,
        "matches": ["*://*.roblox.com/*"],
        "run_at": "document_start",
    }
]
ma["web_accessible_resources"] = [
    {
        "matches": ["*://*.roblox.com/*"],
        "resources": web_accessible_resources,
        "use_dynamic_url": True,
    }
]
ma["permissions"] = manifest_permissions
printMainMessage(f"Manifest Permissions: {json.dumps(manifest_permissions)}")
printMainMessage(f"Content Scripts/CSS: {json.dumps(content_scripts)} + {json.dumps(content_css)}")
printMainMessage(f"Web Accessible Resources: {json.dumps(web_accessible_resources)}")
printMainMessage("Saving Settings JSON..")
with open(os.path.join(extension_path, "settings.json"), "w") as f:
    json.dump(se, f, indent=4)
printMainMessage("Saving Manifest JSON..")
with open(os.path.join(extension_path, "manifest.json"), "w") as f:
    json.dump(ma, f, indent=4)
    
# Configuring Mini Extensions
printWarnMessage("--- Configuring Mini Extensions ---")
ex_name_replace_key = "{extension_name_this_is_replace_when_building_bundle_with_folder_name_if_youre_wondering}"
for i in extensions_added:
    printMainMessage(f"Configuring {i}..")
    with open(f"{extension_path}/{i}/settings.js", "w") as f:
        f.write("// This file was used for the mini extensions but since this extension is currently being used for bundle extension, it's cleared with this message.")
    for q in os.listdir(f"{extension_path}/{i}/"):
        if os.path.isfile(f"{extension_path}/{i}/{q}") and q.endswith(".js"):
            with open(f"{extension_path}/{i}/{q}", "r") as f:
                fi_f = f.read()
            fi_f = fi_f.replace(ex_name_replace_key, i)
            with open(f"{extension_path}/{i}/{q}", "w") as f:
                f.write(fi_f)

# Final Touches
printWarnMessage("--- Making Final Touches ---")
for i in extensions_added:
    printMainMessage(f"Saving JSONs for {i}..")
    with open(f"{extension_path}/{i}/org_manifest.json", "w") as f:
        json.dump(mans[i], f, indent=4)
    with open(f"{extension_path}/{i}/settings.json", "w") as f:
        json.dump(ses[i], f, indent=4)
    os.remove(f"{extension_path}/{i}/manifest.json")

if not (os.name == "nt"):
    printMainMessage("Creating Bundle ZIP File..")
    if os.path.exists(
        os.path.join(current_path_location, "zip", "chromeExtension.zip")
    ):
        os.remove(os.path.join(current_path_location, "zip", "chromeExtension.zip"))
    a = subprocess.run(
        f'zip -r ../zip/chromeExtension.zip ./ -x "*.git*" -x "*.DS_Store" -x "__MACOSX*" -x "__pycache*"',
        cwd=extension_path,
        shell=True,
    )
    if a.returncode == 0: 
        printMainMessage("Ziping has succeeded!")
    else:
        printErrorMessage(f"Uh oh! Ziping has failed due to an error! Status Code: {a.returncode}")

# Done!
printSuccessMessage("SUCCESS!")
printSuccessMessage("Successfully recreated bundle from existing extensions made in folder!")
printSuccessMessage(f"Exported from Path: {extensions_folder}")
printSuccessMessage(f"Chrome Extension Bundle: {extension_path}")
printSuccessMessage(f"Extensions: {', '.join(extensions_added)}")
