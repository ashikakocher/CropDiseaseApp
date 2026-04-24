import axios from "axios";

const API = axios.create({
  baseURL: "http://api.crop.vibrantick.org"})

export default API;