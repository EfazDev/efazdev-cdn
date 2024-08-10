import json
import requests
import time

with open("approved_users.json") as f:
    approved = json.loads(f.read())

generated = {}
for i in approved.keys():
    e = approved[i]
    def scan():
        res = requests.get(f"https://groups.roblox.com/v1/users/{str(e['id'])}/groups/roles?includeLocked=true&includeNotificationPreferences=true")
        if res.ok:
            jso = res.json()
            if jso.get("data"):
                return jso["data"]
            else:
                time.sleep(1)
                return scan()
        else:
            time.sleep(1)
            return scan()
    res = scan()
    generated[str(e["id"])] = []
    for r in res:
        if r.get("group"):
            if r["group"].get("owner"):
                if r["group"]["owner"].get("userId") == e["id"]:
                    generated[str(e["id"])].append(r["group"]["id"])
    q = e["id"]
    approved[i]["approve_groups"] = generated[str(q)]

with open("approved_users.json", "w") as f:
    json.dump(approved, f, indent=4)

