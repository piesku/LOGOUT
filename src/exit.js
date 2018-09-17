import {Component} from "./cervus/core";
import {EXIT} from "./actions";

export default
class Exit extends Component {
    trigger() {
        this.entity.game.remove(this.entity);
        dispatch(EXIT);
    }
}
