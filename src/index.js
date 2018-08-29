import store from "./store";
import HUD from "./HUD";
import "./game";

store.attach(HUD, document.querySelector("#root"));
window.dispatch = store.dispatch;
