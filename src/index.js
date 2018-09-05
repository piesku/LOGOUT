import {attach, dispatch} from "./store";
import HUD from "./HUD";
import "./game";

attach(HUD, document.querySelector("#root"));
window.dispatch = dispatch;
