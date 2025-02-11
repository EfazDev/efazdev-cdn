/* 

Efaz's Roblox Extension
By: EfazDev

main.js:
    - Handle background scripts for the mini extensions

*/

async function loopThroughArrayAsync(array, callback) {
    var generated_keys = Object.keys(array);
    for (a = 0; a < generated_keys.length; a++) {
        var key = generated_keys[a]
        var value = array[key]
        await callback(key, value)
    }
}

self.addEventListener('install', async (event) => {
    event.waitUntil(
        new Promise(async () => {
            var ex = await fetch(chrome.runtime.getURL("./settings.json")).then((r) => {
                return r.json()
            }).then(r => {
                return r["extensions"]
            })
            await loopThroughArrayAsync(ex, (_, e) => {
                console.log("Importing " + e);
                importScripts(chrome.runtime.getURL('./' + e + '/main.js'));
            })
            console.log("Successfully imported all extension's background script!")
        })
    );
});