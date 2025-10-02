import React, { useContext, useState } from "react";
import PropTypes from "prop-types";
import { useLRTapi } from "./LRT.api";
const StationContext = React.createContext();

export function useStations() {
  return useContext(StationContext);
}

export function StationProvider({ children }) {
  const {
    retrieveAllStationDetails,
    retrieveSpecifications,
    retrieveContracts,
    getContractFromAsset,
    getExternalAssetSpecs,
    getTrainAssets,
    getTrainAssetsSpecs,
  } = useLRTapi();

  const [stationData, setStationData] = useState([]);
  const [specs, setSpecs] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, totalPages: 0 });

  const [assetContracts, setAssetContracts] = useState([]);
  const [attachedContract, setAttachedContract] = useState(null);

  const [pillars, setPillars] = useState([]);
  const [viaducts, setViaducts] = useState([]);
  const [zoom, setZoom] = useState(6);
  const [selectedPillar, setSelectedPillar] = useState(null);

  const [trainAssets, setTrainAssets] = useState([]);
  const [trainSpecs, setTrainSpecs] = useState([]);

  const refreshAllStationAssets = async () => {
    const res = await retrieveAllStationDetails();
    setStationData(res?.data || []);
  };
  const refreshSpecifications = async () => {
    const res = await retrieveSpecifications();
    setSpecs(res?.data || []);
  };
  const refreshAllTrainAssets = async () => {
    const res = await getTrainAssets();
    setTrainAssets(res?.data || []);
  };
  const refreshTrainSpecs = async () => {
    const res = await getTrainAssetsSpecs();
    setTrainSpecs(res?.data || []);
  };
  const refreshViaducts = async () => {
    const res = await getExternalAssetSpecs(8);
    setViaducts(res?.data || []);
  };
  const refreshPillars = async () => {
    const res = await getExternalAssetSpecs(9);
    setPillars(
      [
        ...res.data.map((item) => ({
          ...item,
          longitude: parseFloat(item.longitude),
          latitude: parseFloat(item.latitude),
        })),
      ] || []
    );
  };
  const refreshAssetContracts = async () => {
    const res = await getContractFromAsset();
    setAssetContracts(res?.data || []);
  };

  const fetchContracts = async (page = 1, limit = 10, search = "") => {
    const result = await retrieveContracts(page, limit, search);
    setContracts(result.data);
    setPagination(result.pagination);
  };

  const values = {
    refreshAssetContracts,
    assetContracts,
    setAssetContracts,
    refreshAllStationAssets,
    stationData,
    setStationData,
    refreshSpecifications,
    specs,
    setSpecs,
    trainAssets,
    setTrainAssets,
    trainSpecs,
    refreshAllTrainAssets,
    refreshTrainSpecs,
    fetchContracts,
    contracts,
    pagination,
    setPagination,
    attachedContract,
    setAttachedContract,
    zoom,
    setZoom,
    refreshViaducts,
    viaducts,
    setViaducts,
    refreshPillars,
    pillars,
    setPillars,
    selectedPillar,
    setSelectedPillar,
  };

  return <StationContext.Provider value={values}>{children}</StationContext.Provider>;
}

StationProvider.propTypes = {
  children: PropTypes.node,
};
