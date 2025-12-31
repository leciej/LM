import axios from "axios";

export const http = axios.create({
  baseURL: "http://10.0.2.2:5000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});
