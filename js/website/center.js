function home() {
    window.location.href = "/";
}
function redirect(uri) {
    window.location.href = (uri);
}
function redirectPrivacy() {
    window.location.href = ("/privacy");
}
function redirectTOS() {
    window.location.href = ("/tos");
}
function redirectTwitter() {
    window.location.href = ("https://twitter.efaz.dev");
}
function redirectDiscord() {
    window.location.href = ("https://discord.efaz.dev");
}
function redirectYouTube() {
    window.location.href = ("https://youtube.efaz.dev");
}
function redirectProjects() {
    window.location.href = ("/projects");
}
function redirectToPython() {
    window.location.href = ("https://www.python.org/downloads/");
}
function redirectDashboard() {
    window.location.href = ("https://dashboard.efaz.dev/");
}
function redirectAPIStatus() {
    window.location.href = ("https://status.efaz.dev");
}
function redirectToItemTryoutGame() {
    window.location.href = ("https://www.roblox.com/games/15910786450/Efazs-Item-Tryout");
}
function redirectToDonationGame() {
    window.location.href = ("https://donate.efaz.dev");
}
function exitPortraitMenu() {
    document.getElementById("main_menu").setAttribute("class", "");
    document.querySelector(".topbar-ui").setAttribute("class", "topbar-ui");
    document.querySelector(".portrait-ui").setAttribute("class", "portrait-ui");
}
function openPortraitMenu() {
    document.getElementById("main_menu").setAttribute("class", "portrait-menu-enabled");
    document.querySelector(".topbar-ui").setAttribute("class", "topbar-ui portrait-menu-enabled");
    document.querySelector(".portrait-ui").setAttribute("class", "portrait-ui portrait-menu-enabled");
}
function destroyFooter() {
    if (document.getElementById("main_footer")) {
        document.getElementById("main_footer").remove();
        window.localStorage.setItem("destroyFooter", "true");
    }
}
async function loopThroughArrayAsync(array, callback) {
    if (Array.isArray(array)) {
        for (let a = 0; a < array.length; a++) {
            await callback(a, array[a]);
        }
    } else if (array && typeof array === "object") {
        for (const a in array) {
            if (Object.hasOwn(array, a)) { await callback(a, array[a]); }
        }
    }
}
function generateHTMLDom(code) {
    let temp_div = document.createElement("div");
    temp_div.innerHTML = code;
    let dom = temp_div.children[0];
    temp_div.remove();
    return dom;
}
function loopThroughArray(array, callback) {
    if (Array.isArray(array)) {
        for (let a = 0; a < array.length; a++) {
            callback(a, array[a]);
        }
    } else if (array && typeof array === "object") {
        for (const a of Object.keys(array)) {
            callback(a, array[a]);
        }
    }
}
async function GetProjects() {
    return fetch("https://api.efaz.dev/api/projects", { "mode": "cors" }).then(res => {
        return res.json();
    });
}
async function GetTopProjects() {
    return fetch("https://api.efaz.dev/api/projects/top", { "mode": "cors" }).then(res => {
        return res.json();
    });
}
async function GetOtherProjects() {
    return fetch("https://api.efaz.dev/api/projects/other", { "mode": "cors" }).then(res => {
        return res.json();
    });
}
async function GetPaidProjects() {
    return fetch("https://api.efaz.dev/api/projects/paid", { "mode": "cors" }).then(res => {
        return res.json();
    });
}

document.addEventListener("DOMContentLoaded", () => {
    // Compile HTML
    let topbar = generateHTMLDom(`<div class="topbar-ui">
        <div class="topbar">
            <div class="wrapper">
                <div class="topbar-wrapper">
                    <a rel="noopener noreferrer" class="link topbar-title-link" href="https://www.efaz.dev/"
                        target="_blank"><img height="40" width="40" src="https://cdn.efaz.dev/png/logo.png">
                        <p class="topbar-title">EfazDev</p>
                    </a>

                    <div class="listOnRight topbar-buttons">
                        <button onclick="home()">Home</button>
                        <button onclick="redirectProjects()">Projects</button>
                        <button onclick="redirectDashboard()">Dashboard</button>
                        <button onclick="redirectAPIStatus()">API Status</button>
                    </div>
                    <button onclick="openPortraitMenu()" class="portrait-toggle">
                        <img id="img" src="https://cdn.efaz.dev/svg/menu.svg">
                    </button>
                </div>
            </div>
        </div>
    </div>`);
    let portrait = generateHTMLDom(`
        <div class="portrait-ui">
            <div class="portrait-wrapper">
                <a rel="noopener noreferrer" class="link portrait-title-link" href="https://www.efaz.dev/" target="_blank"><img height="40" width="40" src="https://cdn.efaz.dev/png/logo.png">
                    <p class="portrait-title">EfazDev</p>
                </a>
                <div class="portrait-buttons">
                    <button onclick="home()">Home</button>
                    <button onclick="redirectProjects()">Projects</button>
                    <button onclick="redirectDashboard()">Dashboard</button>
                    <button onclick="redirectAPIStatus()">API Status</button>
                    <button onclick="exitPortraitMenu()">Exit Menu</button>
                </div>
            </div>
        </div>
    `);
    let footer = generateHTMLDom(`
    <div class="footer" id="main_footer">
    <br>
        <a rel="noopener noreferrer" class="link footer-link">
            <img height="40" width="40" src="https://cdn.efaz.dev/png/logo.png">
            <p class="description">© Copyright 2025 EfazDev. All rights reserved</p>
        </a>
        <ul>
            <button onclick="redirectPrivacy()" style="background-color: #ff4b00;" class="norm-button">
                <img src="https://cdn.efaz.dev/png/orange_info_vector.png" style="float: left;" height="30px" width="30px"><span>Privacy Policy</span>
            </button>
            <button onclick="redirectTOS()" style="background-color: #ff4b00;" class="norm-button">
                <img src="https://cdn.efaz.dev/png/orange_info_vector.png" height="30px" width="30px"><span>Terms of Service</span>
            </button>
            <button onclick="redirectTwitter()" style="background-color: #53b0fd;" class="norm-button">
                <img src="https://cdn.efaz.dev/png/twitter_logo.png" height="30px" width="30px"><span>Twitter</span>
            </button>
            <button onclick="redirectDiscord()" style="background-color: #5c53fd;" class="norm-button">
                <img src="https://cdn.efaz.dev/png/discord_logo.png" height="30px" width="30px"><span>Discord</span>
            </button>
            <button onclick="redirectYouTube()" style="background-color: #ff0000;" class="norm-button">
                <img src="https://cdn.efaz.dev/png/youtube_logo.png" height="30px" width="30px"><span>YouTube</span>
            </button>
        </ul>
        <br>
    </div>
    `);

    // Add All Base Elements
    document.body.prepend(portrait);
    document.body.prepend(topbar);
    document.body.appendChild(footer);
});