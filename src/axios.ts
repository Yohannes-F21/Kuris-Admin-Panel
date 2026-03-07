import axios from "axios";

// const url = "http://localhost:5000";
// const url = "https://kuri-backend-ub77.onrender.com";
const url = "https://api.kurimothers.com/";

const api = axios.create({
  baseURL: url,
  withCredentials: true, // ✅ Enables cookies for all requests
});

export default api;
