import Template from "~components/template";
import { useState, useEffect, useRef } from "react";
import AssetDetailCard from "~/components/details";
import { useStations } from "~/contexts/LRTContext";
import ContractTable from "~components/contractTable";
import { FaArrowLeft } from "react-icons/fa";
import PropTypes from "prop-types";
import html2canvas from "html2canvas";
import { Modal, Button } from "flowbite-react";
import {
  sb_ticketBooth_top,
  sb_ticketBooth_mid,
  sb_ticketBooth_bot,
  nb_ticketBooth_top,
  nb_ticketBooth_mid,
  nb_ticketBooth_bot,
} from "./utasi.const";
import { useLRTapi } from "~contexts/LRT.api";
const StationAssets = ({ onBackStations }) => {
  const { stationData, specs, attachedContract, assetContracts, refreshAllStationAssets, refreshSpecifications } =
    useStations();
  const { updateParapetStatus } = useLRTapi();
  const [currentStationId, setCurrentStationId] = useState(null);
  const [selectedContract, setSelectedContract] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookParapets, setBookParapets] = useState(false);
  const [bound, setBound] = useState(null);
  const [loading, setLoading] = useState(false);
  const componentRef = useRef();

  const refresh = async () => {
    setLoading(true);
    try {
      await refreshAllStationAssets();
      await refreshSpecifications();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const takeScreenshot = () => {
    html2canvas(componentRef.current).then((canvas) => {
      const link = document.createElement("a");
      link.download = currentStation?.station_name + ".png";
      link.href = canvas.toDataURL();
      link.click();
    });
  };
  useEffect(() => {
    if (stationData.length > 0 && !currentStationId) {
      setCurrentStationId(stationData[0]?.station_id);
    }
    setSelectedContract(attachedContract);
  }, [attachedContract, currentStationId, stationData]);

  const handleNextStation = () => {
    const currentIndex = stationData.findIndex((station) => station.station_id === currentStationId);
    if (currentIndex !== -1) {
      const nextIndex = (currentIndex + 1) % stationData.length;
      setCurrentStationId(stationData[nextIndex].station_id);
    }
  };

  const handlePreviousStation = () => {
    const currentIndex = stationData.findIndex((station) => station.station_id === currentStationId);
    if (currentIndex !== -1) {
      const prevIndex = (currentIndex - 1 + stationData.length) % stationData.length;
      setCurrentStationId(stationData[prevIndex].station_id);
    }
  };

  const mergedStations = stationData.map((station) => ({
    ...station,
    details: specs.filter((spec) => spec.station_id === station.station_id),
  }));

  const currentStation = mergedStations.find((station) => station.station_id === currentStationId);
  if (!currentStation) return <div>Loading...</div>;

  const needsTag = (facing) => {
    const hasParapet = currentStation.parapets?.some((p) => p.asset_distinction.startsWith(facing));
    const isTagged = assetContracts.some(
      (contract) =>
        contract.asset_facing === facing &&
        contract.station_id === currentStationId &&
        contract.asset_name === "parapet"
    );
    return hasParapet && !isTagged;
  };
  const getParapetsByBound = (bound) => {
    if (!bound) return [];

    return currentStation.parapets?.filter((p) => p.asset_distinction.startsWith(bound)) || [];
  };

  const hasAvailableParapet = (bound) => getParapetsByBound(bound).some((p) => p.asset_status === "AVAILABLE");

  const hasParapets = (bound) => getParapetsByBound(bound).length > 0;

  const sbNeedsTag = needsTag("SB");
  const nbNeedsTag = needsTag("NB");

  const shouldShowTagButton = (sbNeedsTag || nbNeedsTag) && attachedContract;
  const showBookButton = !attachedContract;

  const bookParapetsWithNoContract = async (e) => {
    e.preventDefault();
    const confirm = window.confirm("Are you sure you want to book this parapet?");
    if (!confirm) return;
    try {
      await updateParapetStatus(currentStation?.station_id, bound, 1, "TAKEN");
      alert("Parapets updated succesfully.");
      setBookParapets(false);
      setBound(null);
      await refreshAllStationAssets();
    } catch (error) {
      console.error("Failed to update a bound parapet:", error);
      alert("Failed to update a bound parapet. Please try again.");
    }
  };

  const unBookParapetsWithNoContract = async (e) => {
    e.preventDefault();
    const confirm = window.confirm("Are you sure you want to unbook this parapet?");
    if (!confirm) return;
    try {
      const response = await updateParapetStatus(currentStation?.station_id, bound, 1, "AVAILABLE");
      console.log(response);
      alert("Parapets updated succesfully.");
      setBookParapets(false);
      await refreshAllStationAssets();
    } catch (error) {
      console.error("Failed to update a bound parapet:", error);
      alert("Failed to update a bound parapet. Please try again.");
    }
  };

  return (
    <div className="container">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        {/* Left cluster: Back + Station select */}
        <div className="flex items-center gap-3">
          <button
            onClick={onBackStations}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-200 rounded-lg shadow-sm hover:bg-gray-300 active:scale-95 transition"
          >
            <FaArrowLeft className="text-gray-600" />
            <span className="font-medium">Back</span>
          </button>

          <select
            name="station"
            id="station-select"
            value={currentStationId}
            onChange={(e) => setCurrentStationId(parseInt(e.target.value, 10))}
            className="py-2 px-4 rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50"
          >
            {stationData.map((station) => (
              <option key={station.station_id} value={station.station_id}>
                {station.station_name}
              </option>
            ))}
          </select>
        </div>

        {/* Right cluster: Actions */}
        <div className="flex items-center gap-3">
          {/* Refresh */}
          <button
            onClick={refresh}
            disabled={loading}
            className={`px-4 py-2 rounded-lg font-semibold shadow-md transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed text-white"
                : "bg-blue-600 hover:bg-blue-700 active:scale-95 text-white"
            }`}
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>

          {/* Tag parapet (conditional) */}
          {shouldShowTagButton && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 text-white font-semibold rounded-lg shadow-md bg-blue-600 hover:bg-blue-700 active:scale-95 transition"
            >
              Tag parapet
            </button>
          )}

          {/* Book parapets (conditional) */}
          {showBookButton && (
            <button
              onClick={() => setBookParapets(true)}
              className="px-4 py-2 text-white font-semibold rounded-lg shadow-md bg-blue-600 hover:bg-blue-700 active:scale-95 transition"
            >
              Book parapets
            </button>
          )}

          {/* Screenshot (only when NO attached contract, per your earlier logic) */}
          {!attachedContract && (
            <button
              onClick={takeScreenshot}
              className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 active:scale-95 transition"
            >
              📸 Take Screenshot
            </button>
          )}
        </div>
      </div>

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
          sbTop={currentStation.ticketbooths?.filter((b) => b.row_category === sb_ticketBooth_top)}
          sbMid={currentStation.ticketbooths?.filter((b) => b.row_category === sb_ticketBooth_mid)}
          sbBelow={currentStation.ticketbooths?.filter((b) => b.row_category === sb_ticketBooth_bot)}
          nbTop={currentStation.ticketbooths?.filter((b) => b.row_category === nb_ticketBooth_top)}
          nbMid={currentStation.ticketbooths?.filter((b) => b.row_category === nb_ticketBooth_mid)}
          nbBelow={currentStation.ticketbooths?.filter((b) => b.row_category === nb_ticketBooth_bot)}
          sbStairs={
            currentStation.stairs?.filter((s) => s.asset_distinction.includes("W") || s.asset_distinction === "SBS") ||
            []
          }
          nbStairs={
            currentStation.stairs?.filter((s) => s.asset_distinction.includes("E") || s.asset_distinction === "NBS") ||
            []
          }
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

      <Modal
        show={bookParapets}
        onClose={() => {
          setBookParapets(false);
          setBound(null);
        }}
        dismissible
      >
        <Modal.Header>
          <h2 className="text-xl font-semibold text-gray-800">Choose a Bound</h2>
        </Modal.Header>
        <Modal.Body>
          <div className="space-y-4">
            {hasParapets("SB") && (
              <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-300 hover:bg-gray-100 transition">
                <input
                  type="radio"
                  id="sb"
                  name="bound"
                  value="SB"
                  onChange={() => setBound("SB")}
                  className="accent-blue-600 w-4 h-4"
                />
                <label htmlFor="sb" className="text-gray-700 text-base cursor-pointer">
                  {currentStation?.station_name} <span className="font-medium">South Bound</span>
                </label>
              </div>
            )}
            {hasParapets("NB") && (
              <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-300 hover:bg-gray-100 transition">
                <input
                  type="radio"
                  id="nb"
                  name="bound"
                  value="NB"
                  onChange={() => setBound("NB")}
                  className="accent-blue-600 w-4 h-4"
                />
                <label htmlFor="nb" className="text-gray-700 text-base cursor-pointer">
                  {currentStation?.station_name} <span className="font-medium">North Bound</span>
                </label>
              </div>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer className="flex justify-between">
          <div className="flex gap-2">
            {bound && hasParapets(bound) && hasAvailableParapet(bound) && (
              <Button
                onClick={bookParapetsWithNoContract}
                className="text-white font-medium rounded-lg transition bg-green-500 hover:bg-green-600 focus:ring-4 focus:ring-green-300"
              >
                Book
              </Button>
            )}
            {bound && hasParapets(bound) && !hasAvailableParapet(bound) && (
              <Button
                onClick={unBookParapetsWithNoContract}
                className="text-white font-medium rounded-lg transition bg-green-500 hover:bg-green-600 focus:ring-4 focus:ring-green-300"
              >
                Unbook
              </Button>
            )}
          </div>
          <Button
            onClick={() => {
              setBookParapets(false);
              setBound(null);
            }}
            className={`text-white font-medium rounded-lg transition bg-red-500 hover:bg-red-600 focus:ring-4 focus:ring-red-300`}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
StationAssets.propTypes = {
  onBackStations: PropTypes.func,
};
export default StationAssets;
