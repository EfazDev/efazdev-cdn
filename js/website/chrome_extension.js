document.addEventListener("DOMContentLoaded", async () => {
    let extension_name = window.extension_name;
    let extension_id = window.extension_id;
    let extension_description = window.extension_description;
    let extension_chrome_link = window.chrome_link;
    let extension_firefox_link = window.firefox_link;
    let you_may_message = window.you_may_message;
    let html_dom = generateHTMLDom(`
        <div class="move-left description-block">
            <p>${extension_description}</p>
            <br>
            <p>Requirements:</p>
            <ul class="list" id="requirements-list">
                <li>Google Chrome (PC/Mac Only)</li>
            </ul>
            <p style="color: #ff0000;" id="warning-message">(WARNING: This will not show in-game or anyone elses side! Only yours and only affects on the Roblox website!)</p>
            <p>List of methods to download:</p>
            <p>1. Chrome Packed Extension</p>
            <p class="indented description">Download via the Google Chrome Web Store today!</p>
            <button onclick="redirect('${extension_chrome_link}')" class="center norm-button"><span>Download via Web Store!</span></button>
            <p>2. Firefox Packed Extension</p>
            <p class="indented description">Download via the Firefox Add-ons Store today!</p>
            <button onclick="redirect('${extension_firefox_link}')" class="center norm-button"><span>Download via Add-on Store!</span></button>
            <p>3. Chrome Unpacked Extension</p>
            <p class="indented description">Steps:</p>
            <p class="indented description">1. Download the full zip file</p>
            <p class="indented description">2. Export the folder out the zip file.</p>
            <p class="indented description">3. Go to chrome://extensions on your Chrome browser.</p>
            <p class="indented description">4. Enable Developer Mode on the top right.</p>
            <p class="indented description">5. Click Load unpacked on the left side.</p>
            <p class="indented description">6. Select the folder exported from the zip file.</p>
            <p class="indented description">7. Extension is now installed on your computer! ${you_may_message}</p>
            <p class="indented" style="color: #ff0000">[Chrome/Firefox will remove the extension after a certain time. Please use the Packed Extension method to prevent that.]</p>
            <p class="indented description">To change extension settings:</p>
            <p class="indented description">1. Press the extensions icon on the top right.</p>
            <p class="indented description">2. Scroll down and press ${extension_name}</p>
            <p class="indented description">3. Select your settings!</p>
            <p class="indented description">4. Press Save Changes.</p>
            <p class="indented description">5. Done!</p>
            <button onclick="redirect('https://cdn.efaz.dev/extensions/download?type=open-source&extension=${extension_id}&browser=chrome')" class="center norm-button"><span>Download ZIP File!</span></button>
            <br>
            <button onclick="redirect('https://cdn.efaz.dev/extensions/download?type=open-source&extension=${extension_id}&browser=firefox')" class="center norm-button"><span>Download ZIP File! (Firefox)</span></button>
        </div>
    `);
    document.getElementById("welcome-title").innerText = extension_name;
    document.getElementById("main_menu").appendChild(html_dom);
    let requirement_list = document.getElementById("requirements-list");
    let warning_message = document.getElementById("warning-message");
    if (window.custom_warning_message) {
        warning_message.innerText = window.custom_warning_message
    }
    if (window.requirements) {
        let innerHTML = ""
        await loopThroughArrayAsync(window.requirements, (_, v) => {
            innerHTML += `<li>${v}</li>`
        })
        requirement_list.innerHTML = innerHTML
    }
});