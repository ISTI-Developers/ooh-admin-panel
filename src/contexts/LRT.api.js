import { endpoints, headers } from "./endpoints";
import axios from "axios";

const retrieveAllStationDetails = async () => {
  try {
    const response = await axios.get(endpoints.stations + "/details", headers);
    return response.data;
  } catch (error) {
    console.error("Error retrieving station details:", error.message);
    throw error;
  }
};

const retrieveSpecifications = async () => {
  try {
    const response = await axios.get(endpoints.stations + "/specs", headers);
    return response.data;
  } catch (error) {
    console.error("Error retrieving specifications data:", error);
    throw error;
  }
};
const updateAsset = async (id, data) => {
  try {
    const response = await axios.put(`${endpoints.assets}/${id}`, data, headers);
    return response.data;
  } catch (e) {
    console.error("Update failed:", e.response?.data || e.message);
    throw e;
  }
};
const updateParapetStatus = async (station_id, asset_distinction, asset_id, status) => {
  try {
    const response = await axios.put(
      endpoints.parapets + "/status/update",
      {
        station_id,
        asset_distinction,
        asset_id,
        status,
      },
      headers
    );
    console.log("Parapet status updated:", response.data.message);
  } catch (error) {
    if (error.response) {
      console.error("Error response:", error.response.data.message);
    } else {
      console.error("Error message:", error.message);
    }
  }
};
const retrieveContracts = async () => {
  try {
    const response = await axios.get(endpoints.contracts, headers);
    return response.data;
  } catch (error) {
    console.error("Error retrieving contracts:", error.message);
    throw error;
  }
};

const attachContract = async (contractData) => {
  try {
    const response = await axios.post(`${endpoints.contracts}/attach`, contractData, headers);

    return response.data;
  } catch (error) {
    console.error("Error attaching contract:", error.response?.data || error.message);
    throw error;
  }
};

const getContractFromAsset = async () => {
  try {
    const response = await axios.get(`${endpoints.stations}/contracts`, headers);
    return response.data;
  } catch (error) {
    console.error("Error attaching contract:", error.response?.data || error.message);
    throw error;
  }
};
const getTrainAssets = async () => {
  try {
    const response = await axios.get(`${endpoints.trains}/assets`, headers);
    return response.data;
  } catch (error) {
    console.error("Error attaching contract:", error.response?.data || error.message);
    throw error;
  }
};
const getTrainAssetsSpecs = async () => {
  try {
    const response = await axios.get(`${endpoints.trains}/assetsSpecs`, headers);
    return response.data;
  } catch (error) {
    console.error("Error fetching train assets specs:", error.response?.data || error.message);
    throw error;
  }
};
const getExternalAssetSpecs = async () => {
  try {
    const response = await axios.get(`${endpoints.trains}/external/specs`, headers);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching external specs:",
      error.response ? `Status: ${error.response.status}, Data: ${JSON.stringify(error.response.data)}` : error.message
    );
    throw error;
  }
};
const trainAssetBook = async (id, qty) => {
  try {
    const response = await axios.put(`${endpoints.trains}/assets/book/${id}`, { qty }, { headers });
    return response.data;
  } catch (error) {
    console.error(
      "Error booking train asset:",
      error.response ? `Status: ${error.response.status}, Data: ${JSON.stringify(error.response.data)}` : error.message
    );
    throw error;
  }
};

const updateTrainAsset = async (id, avlbl, ood) => {
  try {
    const response = await axios.put(`${endpoints.trains}/assets/edit/${id}`, { avlbl, ood }, { headers });
    return response.data;
  } catch (error) {
    console.error(
      "Error booking train asset:",
      error.response ? `Status: ${error.response.status}, Data: ${JSON.stringify(error.response.data)}` : error.message
    );
    throw error;
  }
};

export const useLRTapi = () => {
  return {
    retrieveAllStationDetails,
    retrieveSpecifications,
    updateAsset,
    updateParapetStatus,
    retrieveContracts,
    attachContract,
    getContractFromAsset,
    getTrainAssets,
    getTrainAssetsSpecs,
    getExternalAssetSpecs,
    trainAssetBook,
    updateTrainAsset,
  };
};
