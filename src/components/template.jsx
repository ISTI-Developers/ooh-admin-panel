import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { SIZE, STATUS } from "~misc/generalAssets";
import { RouteDisplay } from "~misc/RouteDisplay";
import Legend from "./legend";
import { useStations } from "~/contexts/LRTContext";
import ContractTable from "./contractTable";
import { format } from "date-fns";
import Backlits from "./Backlits";
import Parapets from "./Parapets";
import TicketBooth from "./TicketBooth";
import Stairs from "./Stairs";
import { SWS, NWS, SES, NES, SBS, NBS } from "../pages/Utasi/utasi.const";
const Template = ({
  station_id,
  station_name,
  backLitsSB,
  backLitsNB,
  parapetSB,
  parapetNB,
  SBentryExitButton,
  NBentryExitButton,
  southBound,
  northBound,
  handleSouthClick,
  handleNorthClick,
  sbTop,
  sbMid,
  sbBelow,
  nbTop,
  nbMid,
  nbBelow,
  sbStairs,
  nbStairs,
}) => {
  const { updateAsset, queryAssetContracts, attachedContract, allContracts } = useStations();
  const [selectedParapet, setSelectedParapet] = useState(null);
  const [selectedBacklit, setSelectedBacklit] = useState(null);
  const [selectedTB, setSelectedTB] = useState(null);
  const [selectedStairs, setSelectedStairs] = useState(null);

  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpentb, setIsModalOpentb] = useState(false);
  const [isModalOpenStairs, setIsModalOpenStairs] = useState(false);

  const handleParapetClick = (parapet) => {
    setSelectedParapet(parapet);
    setSelectedStatus(parapet.asset_status);
    setSelectedSize(parapet.asset_size);
    setWidth(parapet.asset_dimension_width);
    setHeight(parapet.asset_dimension_height);
  };
  const handleBacklitClick = (backlit) => {
    setSelectedBacklit(backlit);
    setSelectedStatus(backlit.asset_status);
    setIsModalOpen(true);
  };
  const handleTicketBoothClick = (tb) => {
    setSelectedTB(tb);
    setSelectedStatus(tb.asset_status);
    setIsModalOpentb(true);
  };
  const handleStairsClick = (stair) => {
    setSelectedStairs(stair);
    setSelectedStatus(stair.asset_status);
    setIsModalOpenStairs(true);
  };
  const closeModal = () => {
    setSelectedParapet(null);
  };
  const handleSelectedBacklitModal = () => {
    setIsModalOpen(false);
  };
  const handleSelectedTBModal = () => {
    setIsModalOpentb(false);
  };
  const handleSelectedStairsModal = () => {
    setIsModalOpenStairs(false);
  };
  const updateParapetButton = async () => {
    if (!selectedParapet) return;
    setLoading(true);
    try {
      const response = await updateAsset(selectedParapet.asset_id, {
        asset_status: selectedStatus,
        asset_size: selectedSize,
        asset_dimension_width: width,
        asset_dimension_height: height,
      });

      // alert("Parapet updated successfully!");
      console.log(response.data);
      // window.location.reload();
    } catch (error) {
      console.error("Error updating parapet:", error);
      alert("Failed to update parapet.");
    } finally {
      setLoading(false);
      setSelectedParapet(null);
    }
  };

  const editBacklit = async () => {
    if (!selectedBacklit) return;
    setLoading(true);
    try {
      await updateAsset(selectedBacklit.asset_id, {
        asset_status: selectedStatus,
      });
      alert("Updated successfully!");
    } catch (error) {
      console.error("Error updating asset:", error);
      alert("Failed to update asset.");
    } finally {
      setLoading(false);
    }
  };
  const editTB = async () => {
    if (!selectedTB) return;
    setLoading(true);
    try {
      await updateAsset(selectedTB.asset_id, {
        asset_status: selectedStatus,
      });
      alert("Updated successfully!");
    } catch (error) {
      console.error("Error updating asset:", error);
      alert("Failed to update asset.");
    } finally {
      setLoading(false);
    }
  };
  const editStair = async () => {
    if (!selectedStairs) return;
    setLoading(true);
    try {
      await updateAsset(selectedStairs.asset_id, {
        asset_status: selectedStatus,
      });
      alert("Updated successfully!");
    } catch (error) {
      console.error("Error updating asset:", error);
      alert("Failed to update asset.");
    } finally {
      setLoading(false);
    }
  };
  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
  };
  const matchedContract = queryAssetContracts?.find((contract) => contract.backlit_id === selectedBacklit?.asset_id);
  const matchedContractFinal = allContracts?.find(
    (contract) => contract.SalesOrderCode === matchedContract?.asset_sales_order_code
  );
  const matchedContractTB = queryAssetContracts?.find((contract) => contract.ticketbooth_id === selectedTB?.asset_id);
  const matchedContractFinalTB = allContracts?.find(
    (contract) => contract.SalesOrderCode === matchedContractTB?.asset_sales_order_code
  );
  const matchedContractStairs = queryAssetContracts?.find(
    (contract) => contract.stairs_id === selectedStairs?.asset_id
  );
  const matchedContractFinalStairs = allContracts?.find(
    (contract) => contract.SalesOrderCode === matchedContractStairs?.asset_sales_order_code
  );

  const updatedBacklitsNB = backLitsNB.map((backlit) => {
    const matchedContract = queryAssetContracts?.find((contract) => contract.backlit_id === backlit.asset_id);
    const matchedContractFinal = allContracts?.find(
      (contract) => contract.SalesOrderCode === matchedContract?.asset_sales_order_code
    );
    return {
      ...backlit,
      asset_text: matchedContractFinal?.DebtorName || null,
    };
  });

  const updatedBacklitsSB = backLitsSB.map((backlit) => {
    const matchedContract = queryAssetContracts?.find((contract) => contract.backlit_id === backlit.asset_id);
    const matchedContractFinal = allContracts?.find(
      (contract) => contract.SalesOrderCode === matchedContract?.asset_sales_order_code
    );
    return {
      ...backlit,
      asset_text: matchedContractFinal?.DebtorName || null,
    };
  });
const updatedStairsNB = nbStairs.map((stair) => {
    const matchedContract = queryAssetContracts?.find((contract) => contract.stairs_id === stair.asset_id);
    const matchedContractFinal = allContracts?.find(
      (contract) => contract.SalesOrderCode === matchedContract?.asset_sales_order_code
    );
    return {
      ...stair,
      asset_text: matchedContractFinal?.DebtorName || null,
    };
  });
  const updatedStairsSB = sbStairs.map((stair) => {
    const matchedContract = queryAssetContracts?.find((contract) => contract.stairs_id === stair.asset_id);
    const matchedContractFinal = allContracts?.find(
      (contract) => contract.SalesOrderCode === matchedContract?.asset_sales_order_code
    );
    return {
      ...stair,
      asset_text: matchedContractFinal?.DebtorName || null,
    };
  });
  useEffect(() => {
    setSelectedContract(attachedContract);
  }, [attachedContract]);

  return (
    <div>
      <header className="flex justify-center items-center mb-5">
        <h1 className="text-2xl font-bold text-center">{station_name} Station</h1>
      </header>
      <hr className="h-[3px] bg-black border-none" />
      <h1 className="text-2xl font-bold text-center">SOUTH BOUND</h1>

      <Stairs
        direction="SOUTH"
        stairsData={updatedStairsSB}
        activeSpots={sbStairs?.map((stair) => stair.position_index)}
        onClick={handleStairsClick}
        icon="▲"
      />
      <TicketBooth
        direction="SOUTH"
        ticketBoothData={sbTop}
        activeSpots={sbTop?.map((booth) => booth.position_index)}
        onClick={handleTicketBoothClick}
        icon="▲"
      />

      <Backlits direction="SOUTH" backlitData={updatedBacklitsSB} onClick={handleBacklitClick} icon="▲" />

      <TicketBooth
        direction="SOUTH"
        ticketBoothData={sbMid}
        activeSpots={sbMid?.map((booth) => booth.position_index)}
        onClick={handleTicketBoothClick}
        icon="▲"
      />

      <Parapets
        direction="SOUTH"
        parapetData={parapetSB}
        entryExitIndexes={SBentryExitButton}
        onClick={handleParapetClick}
      />

      <TicketBooth
        direction="SOUTH"
        ticketBoothData={sbBelow}
        activeSpots={sbBelow?.map((booth) => booth.position_index)}
        onClick={handleTicketBoothClick}
        icon="▲"
      />

      <div className="w-full flex justify-center my-4">
        <RouteDisplay
          SouthBound={southBound}
          NorthBound={northBound}
          handleNorth={handleNorthClick}
          handleSouth={handleSouthClick}
        />
      </div>

      <TicketBooth
        direction="NORTH"
        ticketBoothData={nbBelow}
        activeSpots={nbBelow?.map((booth) => booth.position_index)}
        onClick={handleTicketBoothClick}
        icon="▼"
      />

      <Parapets
        direction="NORTH"
        parapetData={parapetNB}
        entryExitIndexes={NBentryExitButton}
        onClick={handleParapetClick}
      />
      <TicketBooth
        direction="NORTH"
        ticketBoothData={nbMid}
        activeSpots={nbMid?.map((booth) => booth.position_index)}
        onClick={handleTicketBoothClick}
        icon="▼"
      />

      <Backlits direction="NORTH" backlitData={updatedBacklitsNB} onClick={handleBacklitClick} icon="▼" />

      <TicketBooth
        direction="NORTH"
        ticketBoothData={nbTop}
        activeSpots={nbTop?.map((booth) => booth.position_index)}
        icon="▼"
        onClick={handleTicketBoothClick}
      />
      <Stairs
        direction="NORTH"
        stairsData={updatedStairsNB}
        activeSpots={nbStairs?.map((stair) => stair.position_index)}
        onClick={handleStairsClick}
        icon="▼"
      />

      <h1 className="text-2xl font-bold text-center">NORTH BOUND</h1>
      <hr className="h-[3px] bg-black border-none" />
      <Legend />

      {selectedParapet && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-lg relative w-80">
            <h2 className="text-lg font-bold mb-2">{station_name}</h2>
            <h2 className="text-lg font-bold mb-2">{selectedParapet.asset_distinction} Parapet Details</h2>

            <label className="block text-sm font-medium">Asset Status:</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full p-2 border rounded mb-3"
            >
              {Object.values(STATUS).map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>

            <label className="block text-sm font-medium">Asset Size:</label>
            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className="w-full p-2 border rounded mb-3"
            >
              {Object.values(SIZE).map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <label className="block text-sm font-medium">Width:</label>
            <input
              type="text"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
              className="w-full p-2 border rounded mb-3"
            />

            <label className="block text-sm font-medium">Height:</label>
            <input
              type="text"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="w-full p-2 border rounded mb-3"
            />

            <div className="flex justify-between">
              <button
                onClick={updateParapetButton}
                disabled={loading}
                className="px-4 py-2 bg-green-500 text-white rounded disabled:bg-gray-400"
              >
                {loading ? "Updating..." : "Update"}
              </button>

              <button onClick={closeModal} className="px-4 py-2 bg-red-500 text-white rounded">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-xl p-6 relative">
            <div className="mb-2">
              <h2 className="text-xl font-semibold text-gray-800">{station_name}</h2>
              <h3 className="text-lg text-gray-600 mt-1">{selectedBacklit.asset_distinction} Backlit Details</h3>
            </div>

            {!attachedContract && !matchedContract && (
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Asset Status</label>
                  <select
                    value={selectedStatus}
                    onChange={handleStatusChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    {Object.values(STATUS).map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <button
                    onClick={editBacklit}
                    disabled={loading}
                    className={`px-4 py-2 rounded-md text-white transition-colors ${
                      loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
                    }`}
                  >
                    {loading ? "Editing..." : "Edit"}
                  </button>
                  <button
                    onClick={handleSelectedBacklitModal}
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}

            {matchedContractFinal ? (
              <div className="space-y-3 text-sm text-gray-800">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Sales Order Code:</span>
                  <span className="text-gray-900">{matchedContractFinal.SalesOrderCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Start Date:</span>
                  <span className="text-gray-900">
                    {format(new Date(matchedContractFinal.DateRef1), "MMMM dd, yyyy")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">End Date:</span>
                  <span className="text-gray-900">
                    {format(new Date(matchedContractFinal.DateRef2), "MMMM dd, yyyy")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Owner:</span>
                  <span className="text-gray-900">{matchedContractFinal.DebtorName} </span>
                </div>
                <div className="pt-4 text-right">
                  <button
                    onClick={handleSelectedBacklitModal}
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              selectedContract && (
                <>
                  <ContractTable
                    selectedContract={selectedContract}
                    asset_id={2}
                    matchedContract={!!matchedContract}
                    setIsModalOpen={setIsModalOpen}
                    selectedBacklit={selectedBacklit}
                    station_id={station_id}
                  />
                </>
              )
            )}
          </div>
        </div>
      )}

      {isModalOpentb && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-xl p-6 relative">
            <div className="mb-2">
              <h2 className="text-xl font-semibold text-gray-800">{station_name}</h2>
              <h3 className="text-lg text-gray-600 mt-1">{selectedTB.asset_distinction} TicketBooth Details</h3>
            </div>

            {!attachedContract && !matchedContractTB && (
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Asset Status</label>
                  <select
                    value={selectedStatus}
                    onChange={handleStatusChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    {Object.values(STATUS).map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <button
                    onClick={editTB}
                    disabled={loading}
                    className={`px-4 py-2 rounded-md text-white transition-colors ${
                      loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
                    }`}
                  >
                    {loading ? "Editing..." : "Edit"}
                  </button>
                  <button
                    onClick={handleSelectedTBModal}
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}

            {matchedContractFinalTB ? (
              <div className="space-y-3 text-sm text-gray-800">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Sales Order Code:</span>
                  <span className="text-gray-900">{matchedContractFinalTB.SalesOrderCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Start Date:</span>
                  <span className="text-gray-900">
                    {format(new Date(matchedContractFinalTB.DateRef1), "MMMM dd, yyyy")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">End Date:</span>
                  <span className="text-gray-900">
                    {format(new Date(matchedContractFinalTB.DateRef2), "MMMM dd, yyyy")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Owner:</span>
                  <span className="text-gray-900">{matchedContractFinalTB.DebtorName} </span>
                </div>
                <div className="pt-4 text-right">
                  <button
                    onClick={handleSelectedTBModal}
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              selectedContract && (
                <>
                  <ContractTable
                    selectedContract={selectedContract}
                    asset_id={10}
                    matchedContract={!!matchedContractTB}
                    setIsModalOpen={setIsModalOpentb}
                    selectedTB={selectedTB}
                    station_id={station_id}
                  />
                </>
              )
            )}
          </div>
        </div>
      )}
      {isModalOpenStairs && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-xl p-6 relative">
            <div className="mb-2">
              <h2 className="text-xl font-semibold text-gray-800">{station_name}</h2>
              <h3 className="text-lg text-gray-600 mt-1">
                {(() => {
                  const labels = { SWS, NWS, SES, NES, SBS, NBS };
                  const label = labels[selectedStairs.asset_distinction];
                  return label ? `${label} Details` : "";
                })()}
              </h3>
            </div>

            {!attachedContract && !matchedContractStairs && (
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Asset Status</label>
                  <select
                    value={selectedStatus}
                    onChange={handleStatusChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    {Object.values(STATUS).map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <button
                    onClick={editStair}
                    disabled={loading}
                    className={`px-4 py-2 rounded-md text-white transition-colors ${
                      loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
                    }`}
                  >
                    {loading ? "Editing..." : "Edit"}
                  </button>
                  <button
                    onClick={handleSelectedStairsModal}
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}

            {matchedContractFinalStairs ? (
              <div className="space-y-3 text-sm text-gray-800">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Sales Order Code:</span>
                  <span className="text-gray-900">{matchedContractFinalStairs.SalesOrderCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Start Date:</span>
                  <span className="text-gray-900">
                    {format(new Date(matchedContractFinalStairs.DateRef1), "MMMM dd, yyyy")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">End Date:</span>
                  <span className="text-gray-900">
                    {format(new Date(matchedContractFinalStairs.DateRef2), "MMMM dd, yyyy")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Owner:</span>
                  <span className="text-gray-900">{matchedContractFinalStairs.DebtorName} </span>
                </div>
                <div className="pt-4 text-right">
                  <button
                    onClick={handleSelectedStairsModal}
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              selectedContract && (
                <>
                  <ContractTable
                    selectedContract={selectedContract}
                    asset_id={11}
                    matchedContract={!!matchedContractStairs}
                    setIsModalOpen={setIsModalOpenStairs}
                    selectedStairs={selectedStairs}
                    station_id={station_id}
                  />
                </>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};

Template.propTypes = {
  station_id: PropTypes.number.isRequired,
  station_name: PropTypes.string.isRequired,
  backLitsSB: PropTypes.array,
  backLitsNB: PropTypes.array,
  parapetSB: PropTypes.array,
  parapetNB: PropTypes.array,
  SBentryExitButton: PropTypes.array,
  NBentryExitButton: PropTypes.array,
  southBound: PropTypes.string,
  northBound: PropTypes.string,
  handleSouthClick: PropTypes.func,
  handleNorthClick: PropTypes.func,
  onParapetClick: PropTypes.func,
  sbTop: PropTypes.array,
  sbMid: PropTypes.array,
  sbBelow: PropTypes.array,
  nbTop: PropTypes.array,
  nbMid: PropTypes.array,
  nbBelow: PropTypes.array,
  sbStairs: PropTypes.array,
  nbStairs: PropTypes.array,
};

export default Template;
