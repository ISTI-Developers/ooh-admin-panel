import Cookies from "js-cookie";
const server = window.location.hostname.includes("localhost")
  ? "http://localhost:20601"
  : "https://ooh.unmg.com.ph:8000";

export const headers = {
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${Cookies.get("token")}`,
  },
};

export const endpoints = {
  roles: server + "/user/roles",
  modules: server + "/user/modules",
  users: server + "/user",
  sites: server + "/dashboard/sites",
  batch: server + "/dashboard/batch",
  landmarks: server + "/dashboard/landmarks",
  assets: server + "/utasi/asset",
  contracts: server + "/utasi/contracts",
  stations: server + "/utasi/stations",
  trains: server + "/utasi/train",
  parapets: server + "/utasi/parapets",
  availability: server + "/utasi/availability",
  specs: server + "/utasi/specs",
};
