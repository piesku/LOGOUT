import Block from "./Block";
import Line from "./Line";
import code_anim from "./anim_code";
import "./anim_glitch";

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
                "Tracking",
                "0.02 13.27 1.03",
                "2.98 91.34 12.81",
                "0.18 63.06 22.84",
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
