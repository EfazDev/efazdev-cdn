var loopFinished = false;

function main_swagger() {
    if (loopFinished == false) {
        let a = document.getElementsByClassName('link');
        let d = a[0];
        if (d) {
            d.href = "https://www.efaz.dev/";
            d.target = "_blank";

            let e = document.getElementsByTagName("link");
            for (let f = 0; f < e.length; f++) {
                if (e && e.href) {
                    if (e.href == "./favicon-32x32.png" || e.href == "./favicon-16x16.png") {
                        e.remove();
                    }
                }
            }

            let j = document.querySelectorAll(".version-stamp, .dark-mode-toggle, .link > svg");
            for (let k = 0; k < j.length; k++) {
                if (j[k]) {
                    j[k].remove();
                }
            }

            let m = document.createElement("img");
            m.height = "40";
            m.alt = "Swagger UI";
            d.insertBefore(m, d.firstChild);

            let b = document.createElement('link');
            b.type = 'image/png';
            b.rel = 'icon';
            b.href = 'https://cdn.efaz.dev/png/logo32.png';
            b.sizes = '32x32';
            document.getElementsByTagName('head')[0].appendChild(b);

            let c = document.createElement('link');
            c.type = 'image/png';
            c.rel = 'icon';
            c.href = 'https://cdn.efaz.dev/png/logo16.png';
            c.sizes = '16x16';
            document.getElementsByTagName('head')[0].appendChild(c);

            let g = document.createElement('p');
            g.innerHTML = "EfazDev";
            g.style = "margin: auto; width: 75%; color: white;";
            d.appendChild(g);

            loopFinished = true;
            console.log("Successfully set Custom UI!");
            document.documentElement.className = "";
        } else {
            setTimeout(main_swagger, 100);
        }
    }
}
(function () {
    window.addEventListener("load", function () {
        main_swagger();
    });

    window.addEventListener("load", function () {
        let h_a = `<div id="doc-warning"><div class="warning-close" onclick="this.parentNode.remove()">x</div><div class="warning-description">DO NOT SHARE ANY ACCOUNT COOKIES OR PRIVATE INFORMATION WHEN USING THIS.</div></div>`;
        let j_a = document.getElementsByTagName("body");
        if (j_a[0]) {
            j_a[0].innerHTML = h_a + j_a[0].innerHTML;
        }
    });
})();