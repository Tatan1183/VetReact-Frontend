import axios from "axios";

const vetSysApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // Lee la URL del .env
  headers: {
    "Content-Type": "application/json",
  },
});

export default vetSysApi;
