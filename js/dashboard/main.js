(function () {
    let currentLogOutMode = "";
    const task = function () {
        class Task {
            #key;
            #count;
            constructor() {
                this.#key = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
                    const r = Math.random() * 0x10 | 0x0;
                    const v = c == "x" ? r : r & 0x3 | 0x8;
                    return v.toString(0x10);
                });
                this.#count = 0x1;
            }
            ["get_key"]() {
                return this.#count == 0x1 ? (this.#count = 0x0, this.#key) : null;
            }
            ["validateToken"](token) {
                return token == this.#key;
            }
        }
        return new Task();
    }();
    const task_key = task.get_key();
    window.addEventListener("load", async function () {
        try {
            const auth_res = await fetch("https://db.efaz.dev/api/auth/authenticated", {
                "credentials": "include",
                "headers": {
                    "cookie": document.cookie
                }
            });
            const auth_json = await auth_res.json();
            if (auth_json.success == true) {
                if (auth_json.account_info.verified == true) {
                    document.getElementById("title1").innerHTML = "Hello @" + auth_json.account_info.username + " <img src=\"https://cdn.efaz.dev/png/checkmark.png\" height=\"25\" width=\"25\">";
                } else {
                    document.getElementById("title1").innerHTML = "Hello @" + auth_json.account_info.username + "";
                }

                const efaz_chain_res = await fetch("https://db.efaz.dev/api/auth/user-has-efaz-chain", {
                    "credentials": "include",
                    "headers": {
                        "cookie": document.cookie
                    }
                });
                const efaz_chain_json = await efaz_chain_res.json();
                if (efaz_chain_json["success"] == true) {
                    if (efaz_chain_json["owned"] == true) {
                        document.getElementById("title1").innerHTML = document.getElementById("title1").innerHTML + " <img src=\"https://cdn.efaz.dev/png/efaz_chain.png\" height=\"25\" width=\"25\">!";
                    } else {
                        document.getElementById("title1").innerHTML = document.getElementById("title1").innerHTML + "!";
                    }
                } else {
                    window.location.replace("https://db.efaz.dev/login");
                }

                const roblox_account_res = await fetch("https://db.efaz.dev/api/auth/user-has-roblox-account", {
                    "credentials": "include",
                    "headers": {
                        "cookie": document.cookie
                    }
                });
                const roblox_account_json = await roblox_account_res.json();
                if (roblox_account_json.success == true) {
                    if (roblox_account_json.verified == true) {
                        if (roblox_account_json.usernameAvailable == true) {
                            document.getElementById("currentRobloxAccount").innerHTML = `Your Current Account linked: ${roblox_account_json.username} (${roblox_account_json.userId})! <a id=\"verifyNowLink\" href=\"https://db.efaz.dev/roblox-verification/redirect\">Change Account!</a>`;
                        } else {
                            document.getElementById("currentRobloxAccount").innerHTML = `Your Current Account ID linked: ${roblox_account_json.userId}! <a id=\"verifyNowLink\" href=\"https://db.efaz.dev/roblox-verification/redirect\">Change Account!</a>`;
                        }
                    }
                } else {
                    window.location.replace("https://db.efaz.dev/login");
                }

                const security_key_res = await fetch("https://db.efaz.dev/api/auth/user-has-security-key", {
                    "credentials": "include",
                    "headers": {
                        "cookie": document.cookie
                    }
                });
                const security_key_json = await security_key_res.json();
                if (security_key_json.success == true) {
                    if (security_key_json.verified == true) {
                        document.getElementById("accountSecurityKey").innerHTML = "2FA Set-up Completed: Yes!";
                    } else {
                        document.getElementById("accountSecurityKey").innerHTML = "2FA Set-up Completed: No! <a id=\"secureNowLink\" href=\"https://db.efaz.dev/security-key\">Set-up 2FA Now!</a>";
                    }
                } else {
                    window.location.replace("https://db.efaz.dev/login");
                }

                const email_res = await fetch("https://db.efaz.dev/api/auth/user-has-email-address", {
                    "credentials": "include",
                    "headers": {
                        "cookie": document.cookie
                    }
                });
                const email_json = await email_res.json();
                if (email_json.success == true) {
                    if (email_json.verified == true) {
                        document.getElementById("accountEmailAddress").innerHTML = `Verified Email: Yes! (${email_json.email_address})`;
                    } else {
                        document.getElementById("accountEmailAddress").innerHTML = `Verified Email: No! <a id="addEmailNowLink" href="https://db.efaz.dev/email-verification">Verify Email Verification Now!</a>`;
                    }
                } else {
                    window.location.replace("https://db.efaz.dev/login");
                }

                const api_key_res = await fetch("https://db.efaz.dev/api/payment/api-key", {
                    "credentials": "include",
                    "headers": {
                        "cookie": document.cookie
                    }
                });
                const api_key_json = await api_key_res.json();
                const api_key = api_key_json.api_key;
                document.getElementById("efazdevAPIKey").innerHTML = `API Key: ${api_key}`;

                const owned_items_res = await fetch("https://db.efaz.dev/api/payment/owned", {
                    "credentials": "include",
                    "headers": {
                        "cookie": document.cookie,
                        "X-EfazDev-Key": api_key
                    }
                });
                const owned_items_json = await owned_items_res.json();
                if (owned_items_json.success == true) {
                    if (owned_items_json.data.length > 0) {
                        var items_owned = [];
                        for (const [index, element] of owned_items_json.data.entries()) {
                            if (element["name"]) {
                                items_owned.push(element["name"]);
                            }
                        }
                        document.getElementById("paidOwnedItems").innerHTML = `Owned Items: ${items_owned.join(", ")}!`;

                        const downloadables_res = await fetch("https://db.efaz.dev/api/payment/downloadables", {
                            "credentials": "include",
                            "headers": {
                                "cookie": document.cookie
                            }
                        });
                        const downloadables_json = await downloadables_res.json();
                        if (downloadables_json.success == true) {
                            if (downloadables_json.data.length > 0) {
                                var items_owned = [];
                                for (const [index, element] of downloadables_json.data.entries()) {
                                    if (element["html_content"]) {
                                        items_owned.push(element["html_content"]);
                                    }
                                }
                                document.getElementById("downloadableLinks").innerHTML = `Downloadables: ${items_owned.join(", ")}`;
                            } else {
                                document.getElementById("downloadableLinks").innerHTML = `Downloadables: None!`;
                            }
                        } else {
                            document.getElementById("downloadableLinks").innerHTML = `Downloadables: None!`;
                        }
                    } else {
                        document.getElementById("paidOwnedItems").innerHTML = `Owned Items: None!`;
                    }
                } else {
                    document.getElementById("paidOwnedItems").innerHTML = `Owned Items: None!`;
                }
            } else {
                window.location.replace("https://db.efaz.dev/login");
            }
        } catch (err) {
            console.error(err);
            window.location.replace("https://db.efaz.dev/servererror");
        }
    });
    const list = {
        "roblox": ["roblox_group", "hide_group_roblox", true, "Roblox Account Details"],
        "account_info": ["account_details", "hide_group_account", true, "EfazDev Account Details"],
        "paid_projects": ["paid_projects", "hide_paid", true, "Paid Projects"],
        "report": ["report_system", "hide_reporting", true, "Reporting System"],
        "main": ["main_group", "hide_group_main", true, "Main"]
    };
    const listArray = [
        ["main_group", "hide_group_main", true, "Main"],
        ["roblox_group", "hide_group_roblox", true, "Roblox Account Details"],
        ["account_details", "hide_group_account", true, "EfazDev Account Details"],
        ["report_system", "hide_reporting", true, "Reporting System"],
        ["paid_projects", "hide_paid", true, "Paid Projects"]
    ];
    window.hide_group = function(group_name) {
        for (a_e_q = 0x0; a_e_q < listArray.length; a_e_q++) {
            let group_inf = listArray[a_e_q];
            document.getElementById(group_inf[0x0]).style = "display: none;";
        }
        if (list[group_name]) {
            const group_inf = list[group_name];
            document.getElementById(group_inf[0x0]).style = "";
            document.getElementById(group_inf[0x1]).innerHTML = group_inf[0x3];
        } else {
            console.log("Group Object not found.");
        }
    }
    async function get_captcha(callback_a, token) {
        if (task.validateToken(token)) {
            await turnstile.render(`#invis`, {
                sitekey: "0x4AAAAAAAL7YK_aJBt5iMM6",
                callback: function (token) {
                    callback_a(["Cloudflare", token]);
                },
            });
        } else {
            return callback_a(["None", ""]);
        }
    }
    async function confirmLogOut(confirmed) {
        if (confirmed == true) {
            var log_out_url = "";
            if (currentLogOutMode == "all") {
                log_out_url = "https://db.efaz.dev/api/auth/log-out-all-sessions";
            } else {
                if (currentLogOutMode == "this") {
                    log_out_url = "https://db.efaz.dev/api/auth/log-out";
                } else {
                    return ["stop it"];
                }
            }
            document.getElementById("main_menu").style = "display: none;";
            document.getElementById("confirmLogOut").style = "display: none;";
            await get_captcha(async function (captcha_res) {
                const xcerf_res = await fetch("https://db.efaz.dev/api/auth/account-xcsrftoken", {
                    "method": "POST",
                    "credentials": "include"
                });
                const xcerf_json = await xcerf_res.json();
                if (xcerf_json.success == true) {
                    const xcerf_token = xcerf_json.token;
                    await fetch(log_out_url, {
                        "method": "POST",
                        "credentials": "include",
                        "headers": {
                            "x-csrf-token": xcerf_token,
                            "cookie": document.cookie
                        },
                        "body": "{\"c_captcha\": \"" + captcha_res[1] + "\"}"
                    });
                    window.location.reload();
                }
            }, task_key);
        } else {
            document.getElementById("main_menu").style = "";
            document.getElementById("confirmLogOut").style = "display: none;";
        }
    }
    function logOut(mode) {
        currentLogOutMode = mode;
        document.getElementById("main_menu").style = "display: none;";
        document.getElementById("confirmLogOut").style = "";
        if (mode == "all") {
            document.getElementById("logOutMessage").innerHTML = "Are you sure you want to logout all sessions? (This will include this session too)";
            document.getElementById("log_out").innerHTML = "Log out all sessions!";
        } else {
            document.getElementById("logOutMessage").innerHTML = "Are you sure you want to logout now?";
            document.getElementById("log_out").innerHTML = "Log out!";
        }
        window.hide_group("main");
    }
    window.logOut = logOut;
    window.confirmLogOut = confirmLogOut;
})();