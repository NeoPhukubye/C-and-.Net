// Import the Redux store factory, middleware helper and enhancer composer.
import { createStore, applyMiddleware, compose } from "redux";
// Import the thunk middleware so actions can return functions.
import { thunk } from "redux-thunk";
// Import the combined reducers that make up the store state.
import { reducers } from "../reducers";

// Create the single application store and enable thunk middleware.
export const store = createStore(reducers, compose(applyMiddleware(thunk)));
