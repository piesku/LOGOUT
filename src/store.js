import {createStore} from "./innerself";
import reducer from "./reducer";

export const {attach, connect, dispatch, html} = createStore(reducer);
