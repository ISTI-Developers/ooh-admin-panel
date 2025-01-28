import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import useSearch from "~/hooks/useSearchWithNumerals";
import { endpoints, headers } from "./endpoints";
import axios from "axios";
import addresses from "../misc/output.json";

const SiteContext = React.createContext();

export function useSites() {
  return useContext(SiteContext);
}

export function SiteProvider({ children }) {
  const [sites, setSites] = useState();
  const [cities, setCities] = useState([]);
  const [site, setSite] = useState(null);
  const [module, setModule] = useState("");
  const { searchTerm, results } = useSearch(sites);
  const [reload, doReload] = useState(0);

  const retrieveSites = async () => {
    try {
      const response = await axios.get(endpoints.sites, {
        ...headers,
      });
      if (response.data) {
        return response.data;
      }
    } catch (e) {
      console.log(e);
    }
  };
  const retrieveSite = async (id) => {
    try {
      const response = await axios.get(endpoints.sites, {
        params: {
          id: id,
        },
        ...headers,
      });
      return response.data;
    } catch (e) {
      console.log(e);
    }
  };
  const insertSite = async (data) => {
    try {
      const response = await axios.post(endpoints.sites, data, {
        ...headers,
      });
      return response.data;
    } catch (e) {
      console.log(e);
    }
  };
  const insertMultipleSites = async (data) => {
    const mappedData = data
      .map((item) => {
        const { size_height, size_unit, size_width, ...rest } = item;

        return rest;
      })
      .map((item) => Object.values(item));

    // console.log(mappedData);
    // const response = {
    //   data: { success: true },
    // };
    // return response.data
    try {
      const response = await axios.post(endpoints.batch, mappedData, {
        ...headers,
      });
      return response.data;
      // return response.data;
    } catch (e) {
      console.log(e);
      return e.response.statusText;
    }
  };
  const updateSite = async (data) => {
    try {
      const response = await axios.put(endpoints.sites, data, {
        ...headers,
      });
      return response.data;
    } catch (e) {
      console.log(e);
    }
  };
  const deleteSite = async (id) => {
    try {
      const response = await axios.patch(
        endpoints.sites,
        { id: id },
        {
          ...headers,
        }
      );
      return response.data;
    } catch (e) {
      console.log(e);
    }
  };

  const getLastSiteCode = (pre) => {
    if (!pre) return;
    //sample: pre = UN, site.id = UN10293
    const tempSites = [...sites.sort((a, b) => a.site_id - b.site_id)];
    // console.log(tempSites);
    const matchSites = tempSites.filter((site) =>
      site.site_code.startsWith(pre)
    );

    if (matchSites.length > 0) {
      return matchSites[matchSites.length - 1].site_code.match(/\d+/);
    } else {
      return 0;
    }
  };
  const getAddressInformation = async (lat, lng) => {
    try {
      // const geocodeAPI = `https://nominatim.openstreetmap.org/reverse.php`;
      const geocodeAPI = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyCJK4xNqR28XgzEMDWDsHKcLyMPV04E6qE`;
      const response = await fetch(geocodeAPI);
      const data = await response.json();
      if (data.status === "OK") {
        return data.results[0].address_components;
      } else {
        throw new Error(data.error_message || "Geocoding request failed");
      }
      // const response = await axios.get(geocodeAPI, {
      //   ...headers,
      //   params: {
      //     lat: lat,
      //     lon: lng,
      //     zoom: 18,
      //     format: "jsonv2",
      //     // latlng: `${lat},${lng}`,
      //     // key: "AIzaSyCJK4xNqR28XgzEMDWDsHKcLyMPV04E6qE",
      //   },
      // });
      // return response.data;
    } catch (e) {
      console.log(e);
    }
  };
  const getAvailableSites = async () => {
    try {
      const response = await axios.get(endpoints.sites + "/available", {
        ...headers,
      });
      if (response.data) {
        return response.data;
      }
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    const setup = async () => {
      const response = await retrieveSites();
      const data = response.map((item) => {
        const site = addresses.find((site) => site.site === item.site);
        return {
          ...item,
          address: site ? site.address : null,
          unis_code: site?.site_id ?? item.site,
        };
      });
      setSites(data);
      // console.log(data);
      setCities([...new Set(data.map((site) => site.city))]);
    };
    setup();
  }, [reload]);

  const values = {
    site,
    cities,
    sites,
    results,
    module,
    reload,
    setSite,
    setSites,
    doReload,
    setModule,
    searchTerm,
    insertSite,
    updateSite,
    deleteSite,
    retrieveSite,
    retrieveSites,
    getLastSiteCode,
    getAvailableSites,
    insertMultipleSites,
    getAddressInformation,
  };

  return <SiteContext.Provider value={values}>{children}</SiteContext.Provider>;
}

SiteProvider.propTypes = {
  children: PropTypes.node,
};
