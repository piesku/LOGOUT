import {Component} from "./cervus/core";
import {ACTIVATE} from "./actions";

export default
class PowerUp extends Component {
    trigger() {
        this.entity.game.remove(this.entity);
        dispatch(ACTIVATE, this.system);
    }
}
