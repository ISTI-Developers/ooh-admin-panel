import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import useSearch from "~/hooks/useSearchWithNumerals";
import { endpoints, headers } from "./endpoints";
import axios from "axios";
import { format } from "date-fns";

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

  const retrieveAreas = async () => {
    try {
      const response = await axios.get(endpoints.sites + "/areas", {
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
    let mappedAdditionalData = [];
    const mappedData = data
      .map((item) => {
        const {
          size_height,
          size_unit,
          size_width,
          structure,
          address,
          ...rest
        } = item;

        return rest;
      })
      .map((item) => Object.values(item));

    if (data[0].structure) {
      mappedAdditionalData = data.map((item) => [
        item.structure,
        item.site_code,
        item.city,
        item.address,
      ]);
    }
    // const response = {
    //   data: { success: true },
    // };
    // return response.data
    try {
      const response = await axios.post(
        endpoints.batch,
        [mappedData, mappedAdditionalData],
        {
          ...headers,
        }
      );
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
    const matchSites = tempSites.filter((site) => {
      return site.site.startsWith(pre);
    });

    // console.log(matchSites.length);

    if (matchSites.length > 0) {
      return matchSites[matchSites.length - 1].site.match(/\d+/);
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

  const insertAvailableSites = async (data) => {
    try {
      const response = await axios.post(endpoints.sites + "/available", data, {
        ...headers,
      });
      return response.data;
      // return response.data;
    } catch (e) {
      console.log(e);
      return e.response.statusText;
    }
  };

  const deleteBooking = async (booking) => {
    const currentSite = sites.find((s) => s.site_code === booking.site_id);
    if (!currentSite) return;

    const bookingData = {
      account_executive: booking.account_executive,
      address: currentSite.address,
      area: currentSite.city,
      booking_status: "CANCELLED",
      end: format(new Date(booking.date_to), "MMM dd, yyyy"),
      facing: currentSite.board_facing,
      monthly_rate: Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP",
      }).format(booking.monthly_rate),
      old_client: booking.old_client,
      owner: currentSite.site_owner,
      remarks: booking.remarks,
      site: booking.site_id,
      site_rental: Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP",
      }).format(booking.site_rental ?? 0),
      size: currentSite.size,
      srp: Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP",
      }).format(booking.srp),
      start: format(new Date(booking.date_from), "MMM dd, yyyy"),
    };
    const webhookData = {
      payload: {
        app_id: "cli_a7d1c046a9385003",
        app_secret: "OUKjhSpo4hHvJXd2Sf6k4eLRqEltfv4b",
      },
      type: "url_verification",
      token: "tlBCMBcSK2OoJ2klJV2yefuk0rxHlD0N",
      booking_data: JSON.stringify(bookingData),
    };

    try {
      const api = `/booking?id=${booking.site_booking_id}`;
      const response = await axios.delete(endpoints.sites + api, {
        params: webhookData,
        ...headers,
      });
      if (response.data) {
        return response.data;
      }
    } catch (e) {
      console.log(e);
    }
  };

  const getSiteBooking = async (id = null) => {
    try {
      const api = id ? `/booking?id=${id}` : `/booking`;
      const response = await axios.get(endpoints.sites + api, {
        ...headers,
      });
      if (response.data) {
        return response.data;
      }
    } catch (e) {
      console.log(e);
    }
  };
  const insertSiteBooking = async (site, data) => {
    const currentSite = sites.find((s) => s.site_code === site.site);

    if (!currentSite) return;
    const insertData = {
      ...data,
      site: site.site,
    };
    const values = Object.values(insertData);

    insertData.srp = Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(insertData.srp);
    insertData.monthly_rate = Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(insertData.monthly_rate);
    insertData.site_rental = Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(insertData.site_rental ?? 0);
    insertData.start = format(new Date(insertData.start), "MMM dd, yyyy");
    insertData.end = format(new Date(insertData.end), "MMM dd, yyyy");
    const webhookData = {
      payload: {
        app_id: "cli_a7d1c046a9385003",
        app_secret: "OUKjhSpo4hHvJXd2Sf6k4eLRqEltfv4b",
      },
      type: "url_verification",
      token: "tlBCMBcSK2OoJ2klJV2yefuk0rxHlD0N",
      bookingData: JSON.stringify({
        ...insertData,
        address: site.address,
        area: currentSite.city,
        facing: currentSite.board_facing,
        owner: currentSite.site_owner,
        size: currentSite.size,
      }),
    };
    try {
      const insertResponse = await axios.post(
        endpoints.sites + "/booking",
        values,
        {
          ...headers,
        }
      );
      const acknowledgement = insertResponse.data;

      if (acknowledgement.success) {
        const response = await axios.post(
          endpoints.sites + "/notify",
          webhookData,
          { ...headers }
        );
        if (response.data.status) {
          console.log(response.data);
          return acknowledgement;
        }
      }
    } catch (e) {
      console.log(e);
      return e.response;
    }
  };

  useEffect(() => {
    const setup = async () => {
      const response = await retrieveSites();
      setSites(response);
      setCities([...new Set(response.map((site) => site.city))]);
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
    retrieveAreas,
    retrieveSites,
    deleteBooking,
    getLastSiteCode,
    getSiteBooking,
    insertSiteBooking,
    getAvailableSites,
    insertMultipleSites,
    insertAvailableSites,
    getAddressInformation,
  };

  return <SiteContext.Provider value={values}>{children}</SiteContext.Provider>;
}

SiteProvider.propTypes = {
  children: PropTypes.node,
};
