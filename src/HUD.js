import Block from "./Block";
import Line from "./Line";
import code_anim from "./anim_code";
import "./anim_glitch";
import game from "./game";

export default
function HUD() {
    return html`
        <div class="screen layout">
            ${Block("tl", [
                "System status",
                "Grid Movement: Online",
                "Camera: Online",
                "Freelook: Offline",
                "Chromatic Vision: Offline",
            ])}
            ${Block("tm", [
                "N ----- NE ----- E",
            ], {justify: "center"})}
            ${Block("tr", [
                (new Date()).toString()
            ], {justify: "end"})}
            ${Block("ml", [
                "Active objectives",
                "1. Enhance capabilities",
                "2. Locate exit",
                "3. Init logout sequence",
            ])}
            ${Block("mr", [
                "Running analysis",
                "Assessment complete",
                "<div class=box>No threats found</div>",
            ])}
            ${Block("bl", [
                "Avatar entity matrix", "", "", "", ""
            ], {align: "end"})}
            ${Block("br", new Array(10).fill(""), {align: "end"})}
        </div>
    `;
}

let root = document.querySelector("#root");

let interval;
root.addEventListener("beforerender", function() {
    clearInterval(interval);
});
root.addEventListener("afterrender", function() {
    interval = setInterval(() => {
        let div = document.createElement("div");

        // Animate code display
        let br = root.querySelector(".br");
        br.removeChild(br.firstElementChild);
        div.innerHTML = Line(code_anim.next().value);
        br.appendChild(div.firstElementChild);

        // Update datetime
        let tr = root.querySelector(".tr .glitch");
        for (let child of tr.children) {
            child.textContent = (new Date()).toString();
        }
    }, 1000);
});

let nf = new Intl.NumberFormat("en", {minimumFractionDigits: 3, maximumFractionDigits: 3});

game.on("afterrender", function() {
    // Update local matrix display
    let bl = root.querySelector(".bl");
    let matrix = game.camera.get_component(Cervus.components.Transform).matrix;
    let values = [
        [matrix[0], matrix[4], matrix[8], matrix[12]],
        [matrix[1], matrix[5], matrix[9], matrix[13]],
        [matrix[2], matrix[6], matrix[10], matrix[14]],
        [matrix[3], matrix[7], matrix[11], matrix[15]]
    ];

    // Skip the header.
    let children = [...bl.children].slice(1);
    for (let [i, line] of children.entries()) {
        for (let child of line.querySelector(".glitch").children) {
            child.textContent = values[i].map(n => nf.format(n)).join(" ");
        }

        i++;
    }
});
