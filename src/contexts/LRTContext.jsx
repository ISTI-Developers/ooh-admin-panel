import React, { useContext, useEffect, useState, useMemo } from "react";
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
    updateAsset,
    updateParapetStatus,
    retrieveContracts,
    attachContract,
    getContractFromAsset,
    getTrainAssets,
    getTrainAssetsSpecs,
    getExternalAssetSpecs,
  } = useLRTapi();
  
  const [stationData, setStationData] = useState([]);
  const [specs, setSpecs] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [assetContracts, setAssetContracts] = useState([]);
  const [externalAssetSpecs, setExternalAssetSpecs] = useState([]);
  const [attachedContract, setAttachedContract] = useState(null);

  const queryExternalAssets = useMemo(() => {
    if (!externalAssetSpecs || !externalAssetSpecs.data) return [];
    return externalAssetSpecs.data;
  }, [externalAssetSpecs]);

  const queryAllStationsData = useMemo(() => {
    if (!stationData || !stationData.data) return [];
    return stationData.data;
  }, [stationData]);

  const querySpecs = useMemo(() => {
    if (!specs || !specs.data) return [];
    return specs.data;
  }, [specs]);

  const queryContracts = useMemo(() => {
    if (!contracts || !contracts.data) return [];
    return contracts.data;
  }, [contracts]);

  const queryAssetContracts = useMemo(() => {
    if (!assetContracts || !assetContracts.data) return [];
    return assetContracts.data;
  }, [assetContracts]);

  useEffect(() => {
    const setup = async () => {
      const contract = await retrieveContracts();
      const stationData = await retrieveAllStationDetails();
      const specsData = await retrieveSpecifications();
      const assetContract = await getContractFromAsset();
      const externalAssets = await getExternalAssetSpecs();
      setStationData(stationData);
      setSpecs(specsData);
      setContracts(contract);
      setAssetContracts(assetContract);
      setExternalAssetSpecs(externalAssets);
    };
    setup();
  }, []);

  const values = {
    querySpecs,
    queryAllStationsData,
    queryContracts,
    queryAssetContracts,
    queryExternalAssets,
    attachedContract,
    setAttachedContract,
    updateAsset,
    updateParapetStatus,
    attachContract,
    getTrainAssets,
    getTrainAssetsSpecs,
  };

  return <StationContext.Provider value={values}>{children}</StationContext.Provider>;
}

StationProvider.propTypes = {
  children: PropTypes.node,
};
