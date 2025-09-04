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
  const { queryAllStationsData, querySpecs, attachedContract, queryAssetContracts } = useStations();
  const { updateParapetStatus } = useLRTapi();
  const [currentStationId, setCurrentStationId] = useState(null);
  const [selectedContract, setSelectedContract] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookParapets, setBookParapets] = useState(false);
  const [bound, setBound] = useState(null);
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
    } catch (error) {
      console.error("Failed to update a bound parapet:", error);
      alert("Failed to update a bound parapet. Please try again.");
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
        <div className="flex gap-2">
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
        </div>
        <div className="flex gap-2">
          {shouldShowTagButton && (
            <div className="space-x-2">
              <button
                className={`text-white font-bold py-2 px-2 rounded-lg transition-all duration-200 ease-in-out 
                bg-blue-500 hover:bg-blue-600 shadow-md hover:shadow-lg focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
                onClick={() => setIsModalOpen(true)}
              >
                Tag a parapet
              </button>
            </div>
          )}
          {showBookButton && (
            <div className="space-x-2">
              <button
                className={`text-white font-bold py-2 px-2 rounded-lg transition-all duration-200 ease-in-out 
                bg-blue-500 hover:bg-blue-600 shadow-md hover:shadow-lg focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
                onClick={() => setBookParapets(true)}
              >
                Book parapets
              </button>
            </div>
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
