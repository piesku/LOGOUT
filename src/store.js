import createStore from "./innerself";
//import with_logger from "./innerself/logger";
import reducer from "./reducer";

export let {attach, connect, dispatch, html} =
    //createStore(with_logger(reducer));
    createStore(reducer);
