import axios from "axios";
// import { tokenService } from '../utils/tokenService';

export const api = axios.create({
  baseURL: import.meta.env.VITE_SBP_BACKEND_BASE_URL || "http://localhost:8082",
  withCredentials: true,
});


 // Сurrently commented, needs to be tested

// api.interceptors.request.use((config) => {
//   const token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbkBleGFtcGxlLmNvbSIsImlhdCI6MTc4NDc4NzQ5MywiZXhwIjoxNzg0NzkxMDkzfQ.jHOOgDZgrLoPbBRvLV2xwuUs-SsiQRT1-dIdo8tatAo";

//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }

//   return config;
// });
