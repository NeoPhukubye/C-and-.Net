import axios from "axios";

const BASE_URL = "http://localhost:5159/api/DCandidate/";

export const dCandidateApi = {
  fetchAll: () => axios.get(BASE_URL),
  fetchById: (id) => axios.get(BASE_URL + id),
  create: (newRecord) => axios.post(BASE_URL, newRecord),
  update: (id, updatedRecord) => axios.put(BASE_URL + id, updatedRecord),
  delete: (id) => axios.delete(BASE_URL + id),
};