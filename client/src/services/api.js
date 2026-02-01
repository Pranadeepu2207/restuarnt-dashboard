import axios from "axios";

const api = axios.create({
  baseURL: "https://restuarnt-dashboard.onrender.com/api"
});

export default api;
