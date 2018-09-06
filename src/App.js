import {connect, html} from "./store";
import HUD from "./HUD";

function App({view}) {
    switch (view) {
        case "playing":
            return HUD();
    }
}

export default connect(App);
