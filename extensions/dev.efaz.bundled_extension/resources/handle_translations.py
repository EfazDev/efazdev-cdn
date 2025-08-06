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
printWarnMessage("--- Finding Available Extensions ---")
extensions_added = []
for i in os.listdir(extensions_folder):
    if not (i == "dev.efaz.bundled_extension" or i == "dev.efaz.example_extension" or i == "versions" or i == "dev.efaz.efaz_roblox_theme") and os.path.isdir(os.path.join(extensions_folder, i)) and not os.path.islink(os.path.join(extensions_folder, i)): extensions_added.append(i)
printMainMessage(f"Extensions: {json.dumps(extensions_added)}")
printWarnMessage("--- Handling Translations ---")
locales = {}
for i in extensions_added + ["dev.efaz.bundled_extension"]:
    printMainMessage(f"Opening JSONs for {i}..")
    for lo in os.listdir(f"{extensions_folder}/{i}/chromeExtension/_locales"):
        if os.path.isdir(f"{extensions_folder}/{i}/chromeExtension/_locales/{lo}"):
            with open(f"{extensions_folder}/{i}/chromeExtension/_locales/{lo}/messages.json", "r") as f: locales[f"{i}|{lo}"] = json.load(f)
translations = {}
for lo in os.listdir(f"{extension_path}/_locales"):
    if os.path.isdir(f"{extension_path}/_locales/{lo}"):
        with open(f"{extension_path}/_locales/{lo}/messages.json", "r") as f: translations[lo] = json.load(f)
for i, v in locales.items():
    s = i.split("|")[1]
    if not (translations.get(s) == None):
        for e, k in v.items():
            if not translations[s].get(e): translations[s][e] = k
for i, v in translations.items():
    if os.path.exists(f"{extensions_folder}/{i}/chromeExtension/messages.json"):
        with open(f"{extensions_folder}/{i}/chromeExtension/messages.json", "w") as f: json.dump(v, f, indent=4, ensure_ascii=False)
for i, v in locales.items():
    s = i.split("|")
    if s[0] == "dev.efaz.bundled_extension": continue
    printMainMessage(f"Handling locale {s[1]} for {s[0]}")
    m = {}
    for e, k in v.items():
        if e.startswith("dev_efaz") and not e.startswith(s[0].replace(".", "_")): continue
        m[e] = k
    if locales.get(f"dev.efaz.bundled_extension|{s[1]}"):
        for e, k in locales[f"dev.efaz.bundled_extension|{s[1]}"].items():
            if e.startswith("dev_efaz") and not e.startswith(s[0].replace(".", "_")): continue
            m[e] = k
    if not os.path.exists(f"{extensions_folder}/{s[0]}/chromeExtension/_locales/{s[1]}"): os.makedirs(f"{extensions_folder}/{s[0]}/chromeExtension/_locales/{s[1]}")
    with open(f"{extensions_folder}/{s[0]}/chromeExtension/_locales/{s[1]}/messages.json", "w") as f: json.dump(m, f, indent=4, ensure_ascii=False)
printSuccessMessage("SUCCESS!")
printSuccessMessage("Successfully updated translation files from existing extensions made!")
printSuccessMessage(f"Extensions Path: {extensions_folder}")
printSuccessMessage(f"Chrome Extensions: {', '.join(extensions_added)}")