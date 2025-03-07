import Cookies from "js-cookie";
const server = window.location.hostname.includes("localhost")
  ? "http://localhost:20601"
  : "https://oohplatformapi.retailgate.tech:20601";

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
  parapets: server + "/utasi/parapets",
  assets: server + "/utasi/asset",
  stations: server + "/utasi/stations",
  contracts: server + "/utasi/contracts",
  trains: server + "/utasi/train",
};
