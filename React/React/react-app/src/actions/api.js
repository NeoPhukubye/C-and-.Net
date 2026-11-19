// Import axios, which is used for every HTTP call to the .NET API.
import axios from "axios";

// Allow the API origin to be overridden at build time; default to the dev proxy path.
const baseUrl = import.meta.env.VITE_API_BASE_URL || "/api/";

// Create one axios instance so every request shares the same defaults.
const http = axios.create({
  // All request paths are resolved against this base.
  baseURL: baseUrl,
  // Give up on slow requests instead of hanging forever.
  timeout: 10000,
  // Ask the API to send and receive JSON.
  headers: { "Content-Type": "application/json" },
});

// Convert failed responses into a single readable error message.
http.interceptors.response.use(
  // Successful responses pass straight through.
  (response) => response,
  (error) => {
    // Prefer the problem details returned by ASP.NET, then the axios message.
    const message =
      error.response?.data?.title ||
      error.message ||
      "The request could not be completed.";
    // Reject with a plain Error so callers only deal with messages.
    return Promise.reject(new Error(message));
  }
);

// Export the API groups used by the actions.
export default {
  dCandidate(path = "DCandidate/") {
    // Return the CRUD helpers for the candidate resource.
    return {
      // GET the whole list.
      fetchAll: () => http.get(path),
      // GET one record by id.
      fetchById: (id) => http.get(`${path}${id}`),
      // POST a new record.
      create: (newRecord) => http.post(path, newRecord),
      // PUT the changed values for an existing record.
      update: (id, updatedRecord) => http.put(`${path}${id}`, updatedRecord),
      // DELETE a record by id.
      delete: (id) => http.delete(`${path}${id}`),
    };
  },
};
