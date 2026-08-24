(function () {
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
    const list = {
        "main": ["main_group", "hide_group_main", true, "Main"]
    };
    const listArray = [
        ["main_group", "hide_group_main", true, "Main"]
    ];
    window.addEventListener("load", async function () {
        try {
            const auth_res = await fetch('https://db.efaz.dev/api/auth/authenticated', {
                'credentials': "include",
                'headers': {
                    'cookie': document.cookie
                }
            });
            const auth_json = await auth_res.json();
            if (auth_json.success == true) {
                if (auth_json.account_info.verified == true) {
                    document.getElementById("title1").innerHTML = "Hello @" + auth_json.account_info.username + " <img src=\"https://cdn.efaz.dev/png/checkmark.png\" height=\"25\" width=\"25\">";
                } else {
                    document.getElementById("title1").innerHTML = "Hello @" + auth_json.account_info.username + '';
                }
                
                const efaz_chain_res = await fetch("https://db.efaz.dev/api/auth/user-has-efaz-chain", {
                    "credentials": "include",
                    "headers": {
                        "cookie": document.cookie
                    }
                })
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

                const store_items_res = await fetch("https://db.efaz.dev/api/payment/store", {
                    "credentials": "include",
                    "headers": {
                        "cookie": document.cookie
                    }
                })
                const store_items_json = await store_items_res.json();
                if (store_items_json["success"] == true) {
                    if (store_items_json["data"].length > 0) {
                        let buttonArray = `<button class="" id="hide_group_main" onclick="window.hide_group('main')">Main</button> `;
                        let count = 0;
                        for (const [index, element] of store_items_json["data"].entries()) {
                            if (element["product_name"]) {
                                let us_dollar_format = new Intl.NumberFormat("en-US", {
                                    style: "currency",
                                    currency: "USD",
                                });
                                let product_id = element["id"];
                                let product_name = element["product_name"];
                                let product_description = element["description"];
                                let product_price = us_dollar_format.format(element["price"]);

                                let html_content = `<group id="item_${product_id}" style="display: none;">
                <h2 id="item_${product_id}_title">${product_name}</h2>
                <p id="item_${product_id}_description">${product_description}</p>
                <m id="item_${product_id}_price">Price: ${product_price}</m>`;
                                if (element["owned"] == false) {
                                    html_content = html_content + `<button class="center" buy="buy_button" onclick="window.create_session('${product_id}')">Buy Now!</button></group>`;
                                } else {
                                    html_content = html_content + `<button class="center" buy="buy_button">Owned!</button></group>`;
                                }
                                let button_html_content = `<button class="" id="hide_group_${product_id}" onclick="window.hide_group('item_${product_id}')">${product_name}</button> `;
                                list[`item_${product_id}`] = [`item_${product_id}`, `hide_group_${product_id}`, true, product_name];
                                listArray.push([`item_${product_id}`, `hide_group_${product_id}`, true, product_name]);
                                buttonArray = buttonArray + button_html_content;
                                document.getElementById("main_menu").innerHTML = document.getElementById("main_menu").innerHTML + html_content;
                                count++;
                                if (count == store_items_json["data"].length) {
                                    document.getElementById("main_menu").innerHTML = document.getElementById("main_menu").innerHTML + `<p id="hidegrouplist"></p>`;
                                    document.getElementById("hidegrouplist").innerHTML = buttonArray;
                                }
                            }
                        }
                    } else {
                        document.getElementById("main_menu").innerHTML = document.getElementById("main_menu").innerHTML + `<p id="hidegrouplist">No Items Available. :(</p>`;
                    }
                } else {
                    window.location.replace("https://db.efaz.dev/login");
                }
            } else {
                window.location.replace("https://db.efaz.dev/login");
            }
        } catch (err) {
            console.error(err);
            window.location.replace("https://db.efaz.dev/servererror");
        }
    });
    function hide_group(group_name) {
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
    async function create_session(itemId) {
        document.getElementById("main_menu").style = "display: none;";
        document.getElementById("holdOn").style = "";
        await get_captcha(async function (_0x42e2f4) {
            const xcerf_res = await fetch("https://db.efaz.dev/api/auth/account-xcsrftoken", {
                "method": "POST",
                "credentials": "include"
            })
            const xcerf_json = await xcerf_res.json();
            if (xcerf_json.success == true) {
                const token = xcerf_json.token;
                const session_res = await fetch("https://db.efaz.dev/api/payment/generate-session", {
                    "method": "POST",
                    "credentials": "include",
                    "headers": {
                        "X-Csrf-Token": token,
                        "cookie": document.cookie
                    },
                    "body": `{"c_captcha": "${_0x42e2f4[0x1]}", "itemId": "${itemId}"}`
                })
                const session_json = await session_res.json();
                if (session_json["success"] == true) {
                    window.location.replace(session_json["generated_url"]);
                } else {
                    window.location.reload();
                }
            }
        }, task_key);
    }
    window.hide_group = hide_group;
    window.create_session = create_session;
})();