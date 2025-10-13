/* 

Efaz's Roblox Extension
By: EfazDev

sync_settings.js:
    - Handle saving configurations from files
    - Handle loading configurations from files

*/

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

window.addEventListener("load", async () => {
    let system_settings = await fetch(chrome.runtime.getURL("settings.json")).then((re) => { if (re.ok) { return re.json(); } else { return {}; } });
    let extensions = system_settings["extensions"]
    let load_btn = document.getElementById("load_settings")
    if (load_btn) {
        load_btn.addEventListener('click', async () => {
            try {
                const [fileHandle] = await window.showOpenFilePicker();
                if (fileHandle) {
                    const permission = await fileHandle.requestPermission();
                    if (permission === "granted") {
                        const file = await fileHandle.getFile();
                        let contents = await file.text();
                        contents = JSON.parse(contents);
                        if (typeof (contents) == "object") {
                            if (Array.isArray(contents) == false) {
                                let scanned = {};
                                let ext_setting_manifest = {}
                                let passed = false;
                                await loopThroughArrayAsync(extensions, async (_, ext) => {
                                    scanned[ext] = contents[ext];
                                    ext_setting_manifest[ext] = await fetch(chrome.runtime.getURL(ext + "/settings.json")).then((re) => { if (re.ok) { return re.json(); } else { return {}; } });
                                    passed = true;
                                })
                                if (passed == true) {
                                    /* Apply Settings */
                                    await loopThroughArrayAsync(scanned, async (ext, data) => {
                                        let mani = ext_setting_manifest[ext];
                                        let storaged = chrome.storage.sync;
                                        if (mani["typeOfStorage"]) {
                                            storaged = chrome.storage[mani["typeOfStorage"]];
                                        }
                                        storaged.set({ [ext]: data })
                                    })
                                    alert("Successfully loaded settings!")
                                } else {
                                    alert("There was an issue trying to load configuration file! Code: -3")
                                }
                            } else {
                                alert("There was an issue trying to load configuration file! Code: -2")
                            }
                        } else {
                            alert("There was an issue trying to load configuration file! Code: -1")
                        }
                    }
                }
            } catch (error) {
                if (!(error.toString() && error.toString().includes("aborted"))) {
                    console.warn(error);
                    alert("There was an issue trying to load configuration file!")
                }
            }
        });
    }
    let save_btn = document.getElementById("save_settings");
    if (save_btn) {
        save_btn.addEventListener('click', async () => {
            try {
                let scanned = {};
                let ext_setting_manifest = {};
                let passed = false;
                await loopThroughArrayAsync(extensions, async (_, ext) => {
                    ext_setting_manifest[ext] = await fetch(chrome.runtime.getURL(ext + "/settings.json")).then((re) => { if (re.ok) { return re.json(); } else { return {}; } });
                    passed = true;
                });

                if (passed === true) {
                    // Pull settings for each extension from storage
                    await loopThroughArrayAsync(ext_setting_manifest, async (ext, mani) => {
                        let storaged = chrome.storage.sync;
                        if (mani["typeOfStorage"]) {
                            storaged = chrome.storage[mani["typeOfStorage"]];
                        }
                        await new Promise(resolve => {
                            storaged.get([ext], (data) => {
                                scanned[ext] = data[ext] || {};
                                resolve();
                            });
                        });
                    });
                    const json = JSON.stringify(scanned, null, 4);
                    const fileHandle = await window.showSaveFilePicker({
                        suggestedName: "efaz_bundled_extension_settings.json",
                        types: [
                            {
                                description: "JSON Files",
                                accept: { "application/json": [".json"] }
                            }
                        ]
                    });
                    const writable = await fileHandle.createWritable();
                    await writable.write(json);
                    await writable.close();
                    alert("Successfully saved settings!")
                } else {
                    alert("There was an issue trying to save configuration file! Code: -2")
                }
            } catch (error) {
                if (!(error.toString() && error.toString().includes("aborted"))) {
                    console.warn(error);
                    alert("There was an issue trying to save configuration file! Code: -1")
                }
            }
        });
    }
})