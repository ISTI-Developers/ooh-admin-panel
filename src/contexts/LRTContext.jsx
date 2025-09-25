import React, { useContext, useEffect, useState, useMemo } from "react";
import PropTypes from "prop-types";
import { useLRTapi } from "./LRT.api";
import { useFunction } from "~misc/functions";
const StationContext = React.createContext();

export function useStations() {
  return useContext(StationContext);
}

export function StationProvider({ children }) {
  const {
    retrieveAllStationDetails,
    retrieveSpecifications,
    updateAsset,
    updateParapetStatus,
    retrieveContracts,
    getContractFromAsset,
    getTrainAssets,
    getTrainAssetsSpecs,
    getExternalAssetSpecs,
  } = useLRTapi();

  const [stationData, setStationData] = useState([]);
  const [specs, setSpecs] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, totalPages: 0 });

  const [assetContracts, setAssetContracts] = useState([]);
  const [attachedContract, setAttachedContract] = useState(null);

  const { toUnderscored } = useFunction();
  const [pillars, setPillars] = useState([]);
  const [zoom, setZoom] = useState(6);
  const [query, setQuery] = useState("");
  const [selectedPillar, setSelectedPillar] = useState(null);

  const queryResults = useMemo(() => {
    if (!pillars) return [];

    if (query.length < 4) return pillars;
    const normalizedQuery = toUnderscored(query.toLowerCase());

    const includesQuery = (item) =>
      [item.site ?? item.site_code, item.region, item.city, item?.address]
        .map((field) => toUnderscored(field?.toLowerCase() ?? ""))
        .some((field) => field.includes(normalizedQuery));

    return pillars.filter(includesQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, pillars]);

  const queryAllStationsData = useMemo(() => {
    if (!stationData || !stationData.data) return [];
    return stationData.data;
  }, [stationData]);

  const querySpecs = useMemo(() => {
    if (!specs || !specs.data) return [];
    return specs.data;
  }, [specs]);

  const queryAssetContracts = useMemo(() => {
    if (!assetContracts || !assetContracts.data) return [];
    return assetContracts.data;
  }, [assetContracts]);

  const fetchContracts = async (page = 1, limit = 10, search = "") => {
    const result = await retrieveContracts(page, limit, search);
    setContracts(result.data);
    setPagination(result.pagination);
  };

  useEffect(() => {
    const setup = async () => {
      const stationData = await retrieveAllStationDetails();
      setStationData(stationData);
      const specsData = await retrieveSpecifications();
      setSpecs(specsData);
      const assetContract = await getContractFromAsset();
      setAssetContracts(assetContract);

      const data = await getExternalAssetSpecs(9); 
      setPillars([
        ...data.data.map((item) => ({
          ...item,
          longitude: parseFloat(item.longitude),
          latitude: parseFloat(item.latitude),
        })),
      ]);
    };
    setup();
  }, []);
  const values = {
    querySpecs,
    queryAllStationsData,
    stationData,
    setStationData,
    contracts,
    fetchContracts,
    pagination,
    setPagination,
    queryAssetContracts,
    attachedContract,
    setAttachedContract,
    updateAsset,
    updateParapetStatus,
    getTrainAssets,
    getTrainAssetsSpecs,
    zoom,
    pillars,
    setPillars,
    queryResults,
    selectedPillar,
    setZoom,
    setQuery,
    setSelectedPillar,
  };

  return <StationContext.Provider value={values}>{children}</StationContext.Provider>;
}

StationProvider.propTypes = {
  children: PropTypes.node,
};
