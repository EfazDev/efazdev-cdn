try:
    import json
    import requests
    import time
    import datetime
    import os
except Exception as e:
    print(f"\033[38;5;196m{'Please run \"pip install requests\" in order to run this script!'}\033[0m")

def printMainMessage(mes): print(f"\033[38;5;255m{mes}\033[0m")
def printErrorMessage(mes): print(f"\033[38;5;196m{mes}\033[0m")
def printSuccessMessage(mes): print(f"\033[38;5;82m{mes}\033[0m")
def printWarnMessage(mes): print(f"\033[38;5;202m{mes}\033[0m")
def printYellowMessage(mes): print(f"\033[38;5;226m{mes}\033[0m")
def printDebugMessage(mes): print(f"\033[38;5;226m{mes}\033[0m")
def isYes(text): return text.lower() == "y" or text.lower() == "yes"
def isNo(text): return text.lower() == "n" or text.lower() == "no"
def isRequestClose(text): return text.lower() == "exit" or text.lower() == "exit()"

printWarnMessage("--- Preparing Regeneration ---")
current_path_location = os.path.dirname(os.path.abspath(__file__))
approved_users_path = os.path.join(current_path_location, "approved_users.json")

try:
    with open(approved_users_path) as f:
        approved = json.load(f)
        printMainMessage("Loaded Currently Approved Users.")
        printMainMessage(f"Approved Users Path: {approved_users_path}")
except Exception as e:
    printErrorMessage("Uh oh! There was an error trying to read your approved users JSON file!")
    exit()

try:
    generated = {}
    generated_filtered_json = {}
    for i in approved.keys():
        printWarnMessage(f"--- User ID: {i} ---")
        try:
            e = approved[i]
            start_time = datetime.datetime.now(datetime.UTC).timestamp()
            def user_data_scan():
                res = requests.get(f"https://users.roblox.com/v1/users/{str(i)}")
                if res.ok:
                    jso = res.json()
                    if jso.get("name"):
                        return jso
                    else:
                        time.sleep(1)
                        return user_data_scan()
                else:
                    time.sleep(1)
                    return user_data_scan()
            def scan():
                res = requests.get(f"https://groups.roblox.com/v1/users/{str(i)}/groups/roles?includeLocked=true&includeNotificationPreferences=true")
                if res.ok:
                    jso = res.json()
                    if jso.get("data"):
                        return jso["data"]
                    else:
                        print(f"Something went wrong scanning groups for this user! Returning blank: {jso}")
                        return []
                else:
                    if res.status_code == 429:
                        time.sleep(1)
                        return scan()
                    else:
                        print(f"Something went wrong scanning groups for this user! Returning blank: {res.status_code}")
                        return []
            res = scan()
            user_data = user_data_scan()
            generated[str(i)] = []
            generated_filtered_json[i] = {}
            owned_group_names = []
            for r in res:
                if r.get("group"):
                    if r["group"].get("owner"):
                        if str(r["group"]["owner"].get("userId")) == i:
                            generated[str(i)].append(r["group"])
                            owned_group_names.append(r["group"]["name"])
            generated_filtered_json[i]["name"] = user_data["name"]
            generated_filtered_json[i]["id"] = user_data["id"]
            generated_filtered_json[i]["displayName"] = user_data["displayName"]
            if not (approved[i].get("hexColor")):
                generated_filtered_json[i]["hexColor"] = "#0066ff"
            else:
                generated_filtered_json[i]["hexColor"] = approved[i].get("hexColor")
            generated_filtered_json[i]["approve_groups"] = generated[str(i)]
            generated_filtered_json[i]["scan_timestamp"] = int(datetime.datetime.now(datetime.UTC).timestamp())
            generated_filtered_json[i]["scan_duration"] = round(datetime.datetime.now(datetime.UTC).timestamp() - start_time, 2)
            printMainMessage(f"Name: {generated_filtered_json[i]['displayName']} [@{generated_filtered_json[i]['name']}]")
            printMainMessage(f"User ID: {generated_filtered_json[i]['id']}")
            printMainMessage(f"Groups: {', '.join(owned_group_names)}")
            printMainMessage(f"Color: {generated_filtered_json[i]['hexColor']}")
            printMainMessage(f"Scan Duration: {generated_filtered_json[i]['scan_duration']}s")
        except Exception as e:
            printErrorMessage(f"Unable to scan ID: {i} | Error: {str(e)}")

    printWarnMessage(f"--- Finishing up ---")
    printMainMessage("Finalizing Save..")
    with open(approved_users_path, "w") as f:
        json.dump(generated_filtered_json, f, indent=4)
        printSuccessMessage(f"Successfully generated an approved users JSON file containing {len(generated_filtered_json.keys())} users!")
        printSuccessMessage(f"File Location: {approved_users_path}")
        printSuccessMessage("In order to use this JSON file, install Efaz's Roblox Verified Badge Add-on from the Chrome Webstore and then set this as the Approved JSON! [Enable Customized Approval JSON in order for it to work]")
except Exception as e:
    printErrorMessage("Uh oh! There was an error generating an approved users JSON file!")
    printErrorMessage(f"Exception: {str(e)}")
input("> ")