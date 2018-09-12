import {Component} from "./innerself";
import {connect, html} from "./store";
import Story from "./Story";

// No more than 55 chars per line.
// Any HTML must be on a single line.
const text = `
<div class="big">LOGOUT</div>

In 2018, people live their lives in virtual reality.
Most never leave the community clusters assigned
to them at birth. A handful of lucky ones migrate
to premium clusters which boast 100% uptime.

You are not one of the lucky ones.

The community VR cluster you've spent your life in
has had a critical failure. The reboot has reset
the entire world. Most systems are still offline
but there should be a way to bring them up online.

Find the exit and log out into the reality.

<button onclick="dispatch('START')">Initiate recovery sequence</button>
`;

export default
function Intro() {
    return Story(text);
}
