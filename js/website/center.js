/* 
EfazDev Website 🍊
Centralized JavaScript
*/

const redirect = (url) => window.location.href = url;
const home = () => redirect("/");
const redirectPrivacy = () => redirect("/privacy");
const redirectTOS = () => redirect("/tos");
const redirectTwitter = () => redirect("https://x.efaz.dev");
const redirectX = () => redirect("https://x.efaz.dev");
const redirectDiscord = () => redirect("https://discord.efaz.dev");
const redirectYouTube = () => redirect("https://youtube.efaz.dev");
const redirectProjects = () => redirect("/projects");
const redirectToPython = () => redirect("https://www.python.org/downloads/");
const redirectDashboard = () => redirect("https://dashboard.efaz.dev/");
const redirectAPIStatus = () => redirect("https://status.efaz.dev");
const redirectToItemTryoutGame = () => redirect("https://www.roblox.com/games/15910786450/Efazs-Item-Tryout");
const redirectToDonationPage = () => redirect("https://donate.efaz.dev");
const togglePortraitMenu = (force) => {
    const elements = [
        document.getElementById("main_menu"),
        document.querySelector(".topbar-ui"),
        document.querySelector(".portrait-ui")
    ];
    elements.forEach(el => el && el.classList.toggle("portrait-menu-enabled", force));
};
const openPortraitMenu = () => togglePortraitMenu(true);
const exitPortraitMenu = () => togglePortraitMenu(false);
const destroyFooter = () => {
    const footer = document.getElementById("main_footer");
    if (footer) {
        footer.remove();
        window.localStorage.setItem("destroyFooter", "true");
    }
};
function generateHTMLDom(code) {
    const temp_div = document.createElement("div");
    temp_div.innerHTML = code.trim();
    return temp_div.firstElementChild;
}
async function loopThroughArrayAsync(array, callback) {
    if (!array || typeof array !== "object") return;
    if (Array.isArray(array)) {
        for (let i = 0; i < array.length; i++) {
            await callback(i, array[i]);
        } 
    } else if (array && typeof array === "object") {
        for (const [key, value] of Object.entries(array)) {
            await callback(key, value);
        }
    }
}
async function loopThroughArrayParallel(array, callback) {
    if (!array || typeof array !== "object") return;
    let promises = [];
    if (Array.isArray(array)) {
        promises = array.map((value, index) => callback(index, value));
    } else {
        promises = Object.entries(array).map(([key, value]) => callback(key, value));
    }
    await Promise.allSettled(promises);
}
function loopThroughArray(array, callback) {
    if (!array || typeof array !== "object") return;
    if (Array.isArray(array)) {
        array.forEach((value, index) => callback(index, value));
    } else if (array && typeof array === "object") {
        for (const [key, value] of Object.entries(array)) {
            callback(key, value);
        }
    }
}
async function fetchAPI(endpoint) {
    try {
        const res = await fetch(`https://api.efaz.dev/api${endpoint}`, { mode: "cors" });
        return await res.json();
    } catch (error) {
        console.error("API Fetch Error:", error);
        return { success: false };
    }
};
const GetProjects = () => fetchAPI("/projects");
const GetTopProjects = () => fetchAPI("/projects/top");
const GetOtherProjects = () => fetchAPI("/projects/other");
const GetPaidProjects = () => fetchAPI("/projects/paid");
const launchProjectList = async (project_list, target_ul) => {
    if (!project_list?.success) {
        target_ul.innerHTML = '<p class="description project-list-text" style="color: #ff0000;">Failed to load. Please try again later!</p>';
        return;
    }
    const html = project_list.response
        .filter(v => v.showInProjectsPage !== false)
        .map((v, i) => {
            const buttonText = v.buttonText?.ProjectsPage || "View Project";
            const index = i + 1;
            const discontinuedText = v.discontinued ? ` - <span style="color: #ff0000;">Discontinued in ${v.dateDiscontinued}</span>` : "";
            return `<div>
                <p class="description project-list-text">
                    <span class="main-font">${index}. ${v.name}</span> - ${v.description}${discontinuedText}
                </p>
                <button onclick="redirect('${v.url}')" class="center norm-button">
                    <span>${buttonText}</span>
                </button>
            </div>`;
        }).join("");
    target_ul.innerHTML = html;
}
document.addEventListener("DOMContentLoaded", () => {
    // Compile HTML
    const topbar = generateHTMLDom(`
        <div class="topbar-ui">
            <div class="topbar">
                <div class="wrapper">
                    <div class="topbar-wrapper">
                        <a rel="noopener noreferrer" class="link topbar-title-link" href="https://www.efaz.dev/">
                            <img height="40" width="40" src="https://cdn.efaz.dev/png/logo.png">
                            <p class="topbar-title">EfazDev</p>
                        </a>
                        <div class="listOnRight topbar-buttons">
                            <button onclick="redirect('/')">Home</button>
                            <button onclick="redirect('/projects')">Projects</button>
                            <button onclick="redirect('https://dashboard.efaz.dev/')">Dashboard</button>
                            <button onclick="redirect('https://status.efaz.dev')">API Status</button>
                        </div>
                        <button onclick="openPortraitMenu()" class="portrait-toggle">
                            <img id="img" src="https://cdn.efaz.dev/svg/menu.svg">
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `);
    const portrait = generateHTMLDom(`
        <div class="portrait-ui" onclick="if(event.target === this) exitPortraitMenu()">
            <div class="portrait-wrapper">
                <a rel="noopener noreferrer" class="link portrait-title-link" href="https://www.efaz.dev/">
                    <img height="40" width="40" src="https://cdn.efaz.dev/png/logo.png">
                    <p class="portrait-title">EfazDev</p>
                </a>
                <div class="portrait-buttons">
                    <button onclick="redirect('/')">Home</button>
                    <button onclick="redirect('/projects')">Projects</button>
                    <button onclick="redirect('https://dashboard.efaz.dev/')">Dashboard</button>
                    <button onclick="redirect('https://status.efaz.dev')">API Status</button>
                    <button onclick="exitPortraitMenu()">Exit Menu</button>
                </div>
            </div>
        </div>
    `);
    const footer = generateHTMLDom(`
        <div class="footer" id="main_footer">
            <br>
            <a rel="noopener noreferrer" class="link footer-link">
                <img height="40" width="40" src="https://cdn.efaz.dev/png/logo.png">
                <p class="description">© Copyright ${new Date().getFullYear()} EfazDev. All rights reserved</p>
            </a>
            <ul>
                <button onclick="redirect('/privacy')" style="background-color: #ff4b00;" class="norm-button">
                    <img src="https://cdn.efaz.dev/png/orange_info_vector.png" style="float: left;" height="30px" width="30px">
                    <span>Privacy Policy</span>
                </button>
                <button onclick="redirect('/tos')" style="background-color: #ff4b00;" class="norm-button">
                    <img src="https://cdn.efaz.dev/png/orange_info_vector.png" height="30px" width="30px">
                    <span>Terms of Service</span>
                </button>
                <button onclick="redirect('https://x.efaz.dev')" style="background-color: #000000;" class="norm-button">
                    <img src="https://cdn.efaz.dev/png/x_logo.png" height="30px" width="30px">
                    <span>X</span>
                </button>
                <button onclick="redirect('https://discord.efaz.dev')" style="background-color: #5c53fd;" class="norm-button">
                    <img src="https://cdn.efaz.dev/png/discord_logo.png" height="30px" width="30px">
                    <span>Discord</span>
                </button>
                <button onclick="redirect('https://youtube.efaz.dev')" style="background-color: #ff0000;" class="norm-button">
                    <img src="https://cdn.efaz.dev/png/youtube_logo.png" height="30px" width="30px">
                    <span>YouTube</span>
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