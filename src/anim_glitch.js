// Generate glitch animations
let sheet = document.styleSheets[0];
let steps = 20;
let percent = new Intl.NumberFormat("en", {style: "percent"});
for (let i = 0; i < 20; i++) {
    sheet.insertRule(`
        @keyframes noise${i} {
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
        .glitch2.noise${i} {
            animation: noise${i} ${Math.random() * 5}s linear infinite alternate;
        }
    `);
    sheet.insertRule(`
        .glitch3.noise${i} {
            animation: noise${i} ${Math.random() * 5}s linear infinite alternate;
        }
    `);
}
