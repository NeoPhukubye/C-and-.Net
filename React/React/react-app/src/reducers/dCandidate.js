// Import the reducer that owns the candidate list.
import { ACTION_TYPES } from "../actions/dCandidate";

// State shape used before the first fetch completes.
const initialState = {
  list: [],
};

// Insert or replace a record so duplicate ids can never appear in the list.
const upsert = (list, record) => {
  // Look for an existing record with the same database id.
  const index = list.findIndex((item) => item.id === record.id);

  // Append when the record is new.
  if (index === -1) {
    return [...list, record];
  }

  // Replace in place when the record already exists.
  const next = [...list];
  next[index] = record;
  return next;
};

// Keep the list ordered the same way the API returns it.
const sortByName = (list) =>
  [...list].sort((a, b) => (a.fullName ?? "").localeCompare(b.fullName ?? ""));

// Reducer that applies candidate actions to the store.
export const dCandidate = (state = initialState, action) => {
  switch (action.type) {
    // Replace the whole list with the server response.
    case ACTION_TYPES.FETCH_ALL:
      return {
        ...state,
        list: sortByName(action.payload ?? []),
      };

    // Add the newly created record and keep the list sorted.
    case ACTION_TYPES.CREATE:
      return {
        ...state,
        list: sortByName(upsert(state.list, action.payload)),
      };

    // Replace the updated record without changing the list length.
    case ACTION_TYPES.UPDATE:
      return {
        ...state,
        list: sortByName(upsert(state.list, action.payload)),
      };

    // Drop the deleted record from the list.
    case ACTION_TYPES.DELETE:
      return {
        ...state,
        list: state.list.filter((item) => item.id !== action.payload),
      };

    // Unknown actions leave the state untouched.
    default:
      return state;
  }
};
