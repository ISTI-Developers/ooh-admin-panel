import { useState } from "react";
import PropTypes from "prop-types";
import StationAssets from "./StationAssets";
import TrainAssets from "./TrainAssets";
import { FaArrowLeft } from "react-icons/fa";
import ExternalAssets from "./ExternalAssets";

const LRTAssets = ({ onBack }) => {
  const [selectedAsset, setSelectedAsset] = useState(null);

  const assetsData = [
    {
      title: "STATION ASSETS",
      items: ["Ticket Booth", "Parapets", "Backlit", "Elevators"],
      status: "active",
      component: <StationAssets onBackStations={() => setSelectedAsset(null)} />,
    },
    {
      title: "TRAIN ASSETS",
      items: ["Train Wrap", "Overhead Panel", "Hand Grip", "Seat Divider Sticker", "Two Seat Sticker"],
      status: "active",
      component: <TrainAssets onBackTrain={() => setSelectedAsset(null)} />,
    },
    {
      title: "EXTERNAL ASSETS",
      items: ["Pillars", "Viaducts"],
      status: "active",
      component: <ExternalAssets onBackExternal={() => setSelectedAsset(null)} />,
    },
  ];

  return (
    <>
      {selectedAsset ? (
        <>{selectedAsset}</>
      ) : (
        <>
          {/* Back Button */}
          <div className="mb-4">
            <button onClick={onBack} className="flex items-center px-4 py-2 rounded hover:bg-gray-400">
              <FaArrowLeft />
              Back
            </button>
          </div>

          {/* Asset Selection Cards */}
          <div className="container flex items-center justify-center">
            <div className="flex space-x-6">
              {assetsData.map((asset, index) => (
                <div
                  onClick={() => asset.status === "active" && setSelectedAsset(asset.component)}
                  key={index}
                  className={`flex flex-col justify-between p-6 rounded-lg shadow-md w-64 text-center cursor-pointer ${
                    asset.status === "inactive"
                      ? "bg-blue-100 opacity-50 filter blur-sm pointer-events-none"
                      : "bg-blue-100 hover:bg-blue-200 transition"
                  }`}
                >
                  <div>
                    <h2 className="font-bold text-lg mb-2">{asset.title}</h2>
                    <ul className="text-sm text-gray-700">
                      {asset.items.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="text-blue-500 font-medium mt-4 inline-block">Select</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
};

LRTAssets.propTypes = {
  onBack: PropTypes.func,
};
export default LRTAssets;
