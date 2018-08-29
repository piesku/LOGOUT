// Generate glitch animations
let sheet = document.styleSheets[0];
let steps = 20;
let percent = new Intl.NumberFormat("en", {style: "percent"});
for (let i = 0; i < 20; i++) {
    sheet.insertRule(`
        @keyframes glitch${i} {
            ${new Array(steps).fill(1).map((_, step) => `
                ${percent.format(step / steps)} {
                    clip-path: inset(
                        ${percent.format(Math.random())} 0
                        ${percent.format(Math.random())}
                    );
                }
            `).join("")}
        }
    `);
    sheet.insertRule(`
        .red.glitch${i} {
            animation: glitch${i} ${Math.random() * 5}s linear infinite alternate;
        }
    `);
    sheet.insertRule(`
        .blue.glitch${i} {
            animation: glitch${i} ${Math.random() * 5}s linear infinite alternate;
        }
    `);
}

// Generate anmiated code display
function *generateCode() {
    let lines = Cervus.shaders.fragment.toString()
        .split("\n").slice(7, -2)
        .map(line => line.trim())
        .filter(Boolean);
    let i = 0;
    while (1) {
        yield lines[i++ % lines.length];
    }
}

let code = generateCode();


// HUD Components

function Line(text) {
    // A deterministic digest function provides variety and ensures
    // subsequent renders given the same state produce the same output.
    let glitchIndex = text.length % 20;
    return html`
        <div class="line">
            <div class="glitch">
                <div class="white glitch${glitchIndex}">${text}</div>
                <div class="red glitch${glitchIndex}">${text}</div>
                <div class="blue glitch${glitchIndex}">${text}</div>
            </div>
        </div>
    `;
}

function Block(area, lines, {align = "stretch", justify = "stretch"} = {}) {
    return html`
        <div class="block ${area}"
            style="grid-area: ${area}; align-self: ${align}; justify-self: ${justify};">
            ${lines.map(Line)}
        </div>
    `;
}

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
        div.innerHTML = Line(code.next().value);
        br.appendChild(div.firstElementChild);

        // Update datetime
        let tr = root.querySelector(".tr .glitch");
        for (let child of tr.children) {
            child.textContent = (new Date()).toString();
        }
    }, 1000);
});

let store = createStore(state => state);
store.attach(HUD, root);
