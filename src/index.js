import HUD from "./HUD";
import "./game";

let store = createStore(state => state);
store.attach(HUD, document.querySelector("#root"));
