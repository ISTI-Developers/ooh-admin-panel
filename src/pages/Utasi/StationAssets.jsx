import Template from "~components/Template";
import { useState, useEffect, useRef } from "react";
import AssetDetailCard from "~/components/details";
import { useStations } from "~/contexts/LRTContext";
import ContractTable from "~components/contractTable";
import { FaArrowLeft } from "react-icons/fa";
import PropTypes from "prop-types";
import html2canvas from "html2canvas";

const StationAssets = ({ onBackStations }) => {
  const { queryAllStationsData, querySpecs, attachedContract, queryAssetContracts } = useStations();
  const [currentStationId, setCurrentStationId] = useState(null);
  const [selectedContract, setSelectedContract] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const componentRef = useRef();

  const takeScreenshot = () => {
    html2canvas(componentRef.current).then((canvas) => {
      const link = document.createElement("a");
      link.download = currentStation?.station_name + ".png";
      link.href = canvas.toDataURL();
      link.click();
    });
  };
  useEffect(() => {
    if (queryAllStationsData.length > 0 && !currentStationId) {
      setCurrentStationId(queryAllStationsData[0]?.station_id);
    }
    setSelectedContract(attachedContract);
  }, [attachedContract, currentStationId, queryAllStationsData]);

  const handleNextStation = () => {
    const currentIndex = queryAllStationsData.findIndex((station) => station.station_id === currentStationId);
    if (currentIndex !== -1) {
      const nextIndex = (currentIndex + 1) % queryAllStationsData.length;
      setCurrentStationId(queryAllStationsData[nextIndex].station_id);
    }
  };

  const handlePreviousStation = () => {
    const currentIndex = queryAllStationsData.findIndex((station) => station.station_id === currentStationId);
    if (currentIndex !== -1) {
      const prevIndex = (currentIndex - 1 + queryAllStationsData.length) % queryAllStationsData.length;
      setCurrentStationId(queryAllStationsData[prevIndex].station_id);
    }
  };

  const mergedStations = queryAllStationsData.map((station) => ({
    ...station,
    details: querySpecs.filter((spec) => spec.station_id === station.station_id),
  }));

  const currentStation = mergedStations.find((station) => station.station_id === currentStationId);
  if (!currentStation) return <div>Loading...</div>;

  const needsTag = (facing) => {
    const hasParapet = currentStation.parapets?.some((p) => p.asset_distinction.startsWith(facing));
    const isTagged = queryAssetContracts.some(
      (contract) =>
        contract.asset_facing === facing &&
        contract.station_id === currentStationId &&
        contract.asset_name === "parapet"
    );
    return hasParapet && !isTagged;
  };

  const sbNeedsTag = needsTag("SB");
  const nbNeedsTag = needsTag("NB");

  const shouldShowTagButton = (sbNeedsTag || nbNeedsTag) && attachedContract;

  return (
    <div className="container">
      <div className="mb-4">
        <button onClick={onBackStations} className="flex items-center px-4 py-2 rounded hover:bg-gray-400">
          <FaArrowLeft />
          Back
        </button>
      </div>

      <div className="flex justify-between mb-5">
        <div>
          <select
            name="station"
            id="station-select"
            value={currentStationId}
            onChange={(e) => setCurrentStationId(parseInt(e.target.value, 10))}
            className="py-2 px-4 rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50"
          >
            {queryAllStationsData.map((station) => (
              <option key={station.station_id} value={station.station_id}>
                {station.station_name}
              </option>
            ))}
          </select>
        </div>
        {!attachedContract && (
          <div>
            <button
              onClick={takeScreenshot}
              className="p-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105"
            >
              📸 Take Screenshot
            </button>
          </div>
        )}

        {shouldShowTagButton && (
          <div className="space-x-2">
            <button
              className={`text-white font-bold py-2 px-2 rounded-lg transition-all duration-200 ease-in-out 
                bg-blue-500 hover:bg-blue-600 shadow-md hover:shadow-lg focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
              onClick={() => setIsModalOpen(true)}
            >
              Tag a contract
            </button>
          </div>
        )}
      </div>
      {/* {contractStation && (
        <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-6 border border-gray-200">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Parapet South Bound Contract Details</h2>
          <div className="space-y-2 text-sm text-gray-700">
            <p>
              <span className="font-semibold">Sales Order Code: </span> {contractStation.asset_sales_order_code}
            </p>
            <p>
              <span className="font-semibold">Start Date: </span>
              {format(new Date(contractStation.asset_date_start), "MMMM dd, yyyy")}
            </p>
            <p>
              <span className="font-semibold">End Date: </span>
              {format(new Date(contractStation.asset_date_end), "MMMM dd, yyyy")}
            </p>
          </div>
        </div>
      )} */}
      <div ref={componentRef}>
        <Template
          key={currentStation.station_id}
          station_id={currentStation.station_id}
          station_name={currentStation?.station_name || "Sample Station"}
          backLitsSB={currentStation.backlits?.filter((b) => b.asset_distinction.startsWith("SB")) || []}
          backLitsNB={currentStation.backlits?.filter((b) => b.asset_distinction.startsWith("NB")) || []}
          parapetSB={currentStation.parapets?.filter((p) => p.asset_distinction.startsWith("SB")) || []}
          parapetNB={currentStation.parapets?.filter((p) => p.asset_distinction.startsWith("NB")) || []}
          SBentryExitButton={currentStation.south_ee || []}
          NBentryExitButton={currentStation.north_ee || []}
          southBound={currentStation.next_south_station || ""}
          northBound={currentStation.next_north_station || ""}
          handleSouthClick={handlePreviousStation}
          handleNorthClick={handleNextStation}
        />
      </div>

      {currentStation.details?.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {currentStation.details[0]?.details?.map((detail, index) => (
            <AssetDetailCard
              key={index}
              station_id={currentStation.station_id}
              station_name={currentStation.station_name}
              detail={detail}
            />
          ))}
        </div>
      )}
      {/* Modal */}
      {isModalOpen && (
        <div className="fixed z-50 inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            {/* Contract Details Table */}
            {selectedContract && (
              <ContractTable
                selectedContract={selectedContract}
                station={currentStation}
                setIsModalOpen={setIsModalOpen}
                asset_id={1}
                sbNeedsTag={sbNeedsTag}
                nbNeedsTag={nbNeedsTag}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};
StationAssets.propTypes = {
  onBackStations: PropTypes.func,
};
export default StationAssets;
