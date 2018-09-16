import {Component} from "./cervus/core";
import {ACTIVATE} from "./actions";

export default
class PowerUp extends Component {
    activate() {
        this.entity.game.remove(this.entity);
        dispatch(ACTIVATE, this.system);
    }
}
