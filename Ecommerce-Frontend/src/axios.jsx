import axios from "axios";

const API = axios.create({
  baseURL: "https://shopsphere-ecommerce-1.onrender.com/api",
});
delete API.defaults.headers.common["Authorization"];
export default API;
