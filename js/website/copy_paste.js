/* Assist Copy Blocks */

window.addEventListener("load", () => {
    let found_copy_blocks = document.querySelectorAll(".copy-block");
    loopThroughArrayAsync(Array.from(found_copy_blocks), (i, copy_block) => {
        let copy_block_text = copy_block.querySelector("#copy-block-content").innerText
        let new_btn = document.createElement("button")
        new_btn.innerHTML = "<img id='img' src='https://cdn.efaz.dev/svg/clipboard.svg'>"
        new_btn.setAttribute("class", "copy-block-btn")
        new_btn.addEventListener("click", () => {
            navigator.clipboard.writeText(copy_block_text)
            new_btn.querySelector("#img").src = "https://cdn.efaz.dev/svg/checkmark_green.svg"
            setTimeout(() => {
                new_btn.querySelector("#img").src = "https://cdn.efaz.dev/svg/clipboard.svg"
            }, 1000)
        })
        copy_block.appendChild(new_btn)
    })
});