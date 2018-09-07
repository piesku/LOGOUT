import {connect, html} from "./store";
import Intro from "./Intro";
import HUD from "./HUD";

function App({view}) {
    switch (view) {
        case "intro":
            return Intro();
        case "playing":
            return HUD();
    }
}

export default connect(App);
