/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useContext, useState } from "react";
import { endpoints, headers } from "./endpoints";
import axios from "axios";

const APIContext = createContext();

export function useAPIs() {
  return useContext(APIContext);
}

export function APIProvider({ children }) {
  const [refresh, setRefresh] = useState(0);
  const retrieveAPIs = async () => {
    try {
      const response = await axios.get(endpoints.api, {
        ...headers,
      });
      if (response.data) {
        return response.data;
      }
    } catch (e) {
      console.log(e);
    }
  };

  const generateAPIKey = async () => {
    try {
      const response = await axios.post(
        endpoints.api + "/get",
        {},
        {
          ...headers,
        }
      );
      if (response.data) {
        setRefresh((prev) => (prev = prev + 1));
        return response.data;
      }
    } catch (e) {
      console.log(e);
    }
  };
  const addNewAPIKey = async (data) => {
    try {
      const response = await axios.post(endpoints.api + "/new", data, {
        ...headers,
      });
      if (response.data) {
        setRefresh((prev) => (prev = prev + 1));
        return response.data;
      }
    } catch (e) {
      console.log(e);
    }
  };
  const deleteAPIKey = async (id) => {
    try {
      const response = await axios.delete(endpoints.api + "/" + id, {
        ...headers,
      });
      if (response.data) {
        setRefresh((prev) => (prev = prev + 1));
        return response.data;
      }
    } catch (e) {
      console.log(e);
    }
  };

  const values = {
    refresh,
    setRefresh,
    retrieveAPIs,
    generateAPIKey,
    addNewAPIKey,
    deleteAPIKey,
  };

  return <APIContext.Provider value={values}>{children}</APIContext.Provider>;
}
