// Import the HTTP helper that knows the API base URL.
import api from "./api";

// Every action type the reducer understands.
export const ACTION_TYPES = {
  CREATE: "CREATE",
  UPDATE: "UPDATE",
  DELETE: "DELETE",
  FETCH_ALL: "FETCH_ALL",
};

// Simple email pattern shared by the form validation.
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Normalise the form values into the shape the API expects.
const toCandidatePayload = (data) => ({
  // Trim the text fields so whitespace-only values are rejected by the API.
  fullName: (data.fullName ?? "").trim(),
  email: (data.email ?? "").trim(),
  mobile: (data.mobile ?? "").trim(),
  address: (data.address ?? "").trim(),
  bloodGroup: (data.bloodGroup ?? "").trim(),
  // The form keeps age as a string, so convert it to a number.
  age: Number.parseInt(data.age, 10) || 0,
});

// Turn any thrown value into a predictable Error object.
const toError = (err) => {
  // Prefer the API problem details, then a generic network message.
  const message =
    err?.response?.data?.title ||
    err?.message ||
    "Something went wrong. Please try again.";
  return new Error(message);
};

// Fetch every candidate and store the result.
export const fetchAll = () => async (dispatch) => {
  try {
    // Ask the API for the full list.
    const { data } = await api.dCandidate().fetchAll();

    // Replace the store list with the response.
    dispatch({
      type: ACTION_TYPES.FETCH_ALL,
      payload: data,
    });
  } catch (err) {
    // Rethrow so the calling component can show the error.
    throw toError(err);
  }
};

// Create a candidate and append it to the store.
export const create = (data, onSuccess) => async (dispatch) => {
  try {
    // Post the normalised payload and keep the record the server returns.
    const { data: created } = await api
      .dCandidate()
      .create(toCandidatePayload(data));

    // Append the created record to the list.
    dispatch({
      type: ACTION_TYPES.CREATE,
      payload: created,
    });

    // Let the caller reset the form or show a toast.
    if (onSuccess) {
      onSuccess();
    }
  } catch (err) {
    throw toError(err);
  }
};

// Update an existing candidate by id.
export const update = (id, data, onSuccess) => async (dispatch) => {
  // Build the payload once so the request and reducer stay in sync.
  const payload = toCandidatePayload(data);

  try {
    // PUT the new values to the API.
    await api.dCandidate().update(id, payload);

    // Replace the matching record in the store.
    dispatch({
      type: ACTION_TYPES.UPDATE,
      payload: { ...payload, id },
    });

    if (onSuccess) {
      onSuccess();
    }
  } catch (err) {
    throw toError(err);
  }
};

// Delete a candidate by id.
export const Delete = (id, onSuccess) => async (dispatch) => {
  try {
    // Remove the record on the server first.
    await api.dCandidate().delete(id);

    // Then remove it from the store.
    dispatch({
      type: ACTION_TYPES.DELETE,
      payload: id,
    });

    if (onSuccess) {
      onSuccess();
    }
  } catch (err) {
    throw toError(err);
  }
};
