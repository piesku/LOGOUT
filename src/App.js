import {connect, html} from "./store";
import Story from "./Story";
import {intro, outro} from "./content";
import {get_system_status} from "./Status";
import {START} from "./actions";
import HUD from "./HUD";

function App({view, systems}) {
    switch (view) {
        case "intro":
            return Story(intro);
        case "diag": {
            let offlines = get_system_status(systems);
            let wasd = offlines.pop();
            let diagnostic = [
                "Running analysis…\n",
                ...offlines,
                `\n${wasd}`,
                `\n<button onclick="dispatch(${START});event.stopPropagation()">Initiate recovery sequence</button>`
            ].join("\n");
            return Story(diagnostic);
        }
        case "play":
            return HUD();
        case "outro":
            return Story(outro);
    }
}

export default connect(App);
