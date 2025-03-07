import Template from "~components/template";
import { useState, useEffect } from "react";
import AssetDetailCard from "~/components/details";
import { useStations } from "~/contexts/LRTContext";
import ContractTable from "~components/contractTable";
import { FaArrowLeft } from "react-icons/fa";
import PropTypes from "prop-types";

const StationAssets = ({ onBackStations }) => {
  const {
    queryAllStationsData,
    querySpecs,
    updateParapetStatus,
    attachContract,
    attachedContract,
    // queryAssetContracts
  } = useStations();
  const [currentStationId, setCurrentStationId] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const [bound, setBound] = useState("");

  const handleSubmit = async (e) => {
    setIsPending(true);
    e.preventDefault();
    try {
      const contractData = {
        assetSalesOrderCode: selectedContract.SalesOrderCode,
        assetDateStart: selectedContract.DateRef1,
        assetDateEnd: selectedContract.DateRef2,
        stationId: currentStation.station_id,
        assetId: 1,
      };
      const response = await attachContract(contractData);
      const response2 = await updateParapetStatus(currentStation.station_id, bound, 1, "TAKEN");
      console.log("Contract attached successfully:", response);
      console.log("Contract attached successfully:", response2);
    } catch (error) {
      console.error("Failed to attach contract:", error);
    } finally {
      setIsModalOpen(false);
      setIsPending(false);
    }
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

  const updateToPending = async () => {
    setIsPending(true);
    try {
      const response = await updateParapetStatus(currentStation.station_id, bound, 1, "PENDING");
      alert("Updated to pending");
      console.log(response);
      window.location.reload();
    } catch (e) {
      console.error("Error updating to pending:", e);
    } finally {
      setIsModalOpen1(false);
      setIsPending(false);
    }
  };

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
        <div className="space-x-2">
          <button
            className={`text-white font-bold py-2 px-2 rounded-lg transition-all duration-200 ease-in-out ${
              isPending ? "bg-gray-400 cursor-not-allowed opacity-70" : "bg-blue-500 hover:bg-blue-600  shadow-md hover:shadow-lg focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            }`}
            onClick={() => setIsModalOpen(true)}
            disabled={isPending}
          >
            {isPending ? <span className="animate-spin">⏳</span> : `Final Contract`}
          </button>
        </div>
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
      <div className="flex justify-between">
        <div className="flex container">
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
          <div className="flex flex-col">
            {currentStation.details[0]?.details?.map((detail, index) => (
              <AssetDetailCard key={index} station_id={currentStation.station_id} station_name={currentStation.station_name} detail={detail} />
            ))}
          </div>
        )}
      </div>
      {/* Modal */}
      {isModalOpen && (
        <div className="fixed z-50 inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-lg font-bold mb-4">Anong bound?</h2>
            <div>
              <input type="radio" id="sb" name="bound" value="SB" onChange={() => setBound("SB")} />
              <label htmlFor="sb"> {currentStation?.station_name} South Bound</label>
            </div>
            <div>
              <input type="radio" id="nb" name="bound" value="NB" onChange={() => setBound("NB")} />
              <label htmlFor="nb"> {currentStation?.station_name} North Bound</label>
            </div>
            <br />
            <h1 className="font-bold">Selected Contract</h1>
            {/* Contract Details Table */}
            {selectedContract && (
              <ContractTable
                code={selectedContract.SalesOrderCode || "N/A"}
                reference={selectedContract.ReferenceNo || "N/A"}
                orderDate={selectedContract.SalesOrderDate || "N/A"}
                projDesc={selectedContract.ProjectDesc || "N/A"}
                dateStart={selectedContract.DateRef1 || "N/A"}
                dateEnd={selectedContract.DateRef2 || "N/A"}
              />
            )}

            {/* Close Modal Button */}
            <div className={`mt-4 flex ${selectedContract ? "justify-between" : "justify-end"}`}>
              {selectedContract && (
                <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600" onClick={handleSubmit}>
                  Booked!
                </button>
              )}

              <button
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                onClick={() => {
                  setIsModalOpen(false);
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {isModalOpen1 && (
        <div className="fixed z-50 inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4">Anong bound?</h2>
            <div>
              <input type="radio" id="sb" name="bound" value="SB" onChange={() => setBound("SB")} />
              <label htmlFor="sb"> {currentStation?.station_name} South Bound</label>
            </div>
            <div>
              <input type="radio" id="nb" name="bound" value="NB" onChange={() => setBound("NB")} />
              <label htmlFor="nb"> {currentStation?.station_name} North Bound</label>
            </div>
            {/* Close Modal Button */}
            <div className="mt-4 flex justify-between">
              <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600" onClick={updateToPending}>
                Book
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                onClick={() => {
                  setIsModalOpen1(false);
                }}
              >
                Close
              </button>
            </div>
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
