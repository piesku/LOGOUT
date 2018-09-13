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
        case "diag":
            let status = [
                "Running analysis...\n",
                ...get_system_status(systems),
                `\n<button onclick="dispatch(${START})">Initiate recovery sequence</button>`
            ].join("\n");
            return Story(status);
        case "play":
            return HUD();
        case "outro":
            return Story(outro);
    }
}

export default connect(App);
