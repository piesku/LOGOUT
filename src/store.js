import createStore from "./innerself";
import with_logger from "./innerself/logger";
import reducer from "./reducer";

export const {attach, connect, dispatch, html} =
    createStore(with_logger(reducer));
