// Import the helper that merges several reducers into one root reducer.
import { combineReducers } from "redux";
// Import the reducer that owns the candidate slice of state.
import { dCandidate } from "./dCandidate";

// The store state is shaped as { dCandidate: { list: [] } }.
export const reducers = combineReducers({
  dCandidate,
});
