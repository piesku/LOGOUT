import {attach, dispatch} from "./store";
import App from "./App";
import "./game";
import "./anim_glitch";

attach(App, document.querySelector("#root"));
window.dispatch = dispatch;
