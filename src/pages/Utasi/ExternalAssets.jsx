import { useState } from "react";
import PropTypes from "prop-types";
import { FaArrowLeft } from "react-icons/fa";
import { useStations } from "~contexts/LRTContext";
import { imageMap, imageMap2 } from "./utasi.const";
import ContractTable from "~components/contractTable";
import { useLRTapi } from "~contexts/LRT.api";
// import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";

const ViaductCard = ({ viaduct, onDetailsClick }) => {
  return (
    <div className={`relative bg-white rounded-lg shadow-md p-4 transition-opacity ${viaduct.isBooked ? "opacity-50 pointer-events-none" : "hover:shadow-lg"}`}>
      {/* "BOOKED" Stamp */}
      {viaduct.isBooked && <div className="absolute top-3 right-3 bg-green-500 text-white font-bold text-lg px-4 py-1 rounded rotate-12">BOOKED</div>}

      {/* Image */}
      <img className="w-full h-40 rounded-md mb-3 object-cover" src={viaduct.picture} alt="" />

      {/* Viaduct Info */}
      <h3 className="text-lg font-bold">{viaduct.viaduct_name}</h3>
      <p className="text-gray-600">{viaduct.asset_direction}</p>

      {/* Details Button (Disabled if booked) */}
      <button
        onClick={() => onDetailsClick(viaduct)}
        className={`text-blue-500 mt-2 inline-block ${viaduct.isBooked ? "opacity-50 cursor-not-allowed" : "hover:underline"}`}
        disabled={viaduct.isBooked}
      >
        Details →
      </button>
    </div>
  );
};

ViaductCard.propTypes = {
  viaduct: PropTypes.shape({
    picture: PropTypes.string,
    viaduct_name: PropTypes.string,
    asset_direction: PropTypes.string,
    isBooked: PropTypes.bool,
  }).isRequired,
  onDetailsClick: PropTypes.func,
};

const ExternalAssets = ({ onBackExternal }) => {
  const { queryExternalAssets, attachedContract, queryAssetContracts } = useStations();
  const { attachContract } = useLRTapi();
  const [selectedViaduct, setSelectedViaduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const contractedViaduct = queryAssetContracts.filter((cv) => cv.viaduct_id !== null && cv.viaduct_id !== undefined).map((cv) => cv.viaduct_id);

  const handleDetailsClick = (viaduct) => {
    setSelectedViaduct(viaduct);
  };
  const externalAssetsWithImages = queryExternalAssets.map((asset) => ({
    ...asset,
    picture: imageMap[asset.id] || null,
    picture2: imageMap2[asset.id] || null,
  }));
  const notes = selectedViaduct?.notes || "";
  const [firstPart, ...rest] = notes.split(",");

  const bookViaduct = async () => {
    try {
      const contractData = {
        assetSalesOrderCode: attachedContract.SalesOrderCode,
        assetDateStart: attachedContract.DateRef1,
        assetDateEnd: attachedContract.DateRef2,
        assetId: selectedViaduct.asset_id,
        viaductId: selectedViaduct.id,
      };
      const response2 = await attachContract(contractData);
      console.log("Booking 2 successful:", response2);
    } catch (error) {
      console.error("Booking failed:", error);
      alert("Booking failed. Please try again.");
    } finally {
      setIsModalOpen(false);
    }
  };
  return (
    <div>
      <div className="mb-4">
        <button onClick={onBackExternal} className="flex items-center px-4 py-2 rounded hover:bg-gray-400">
          <FaArrowLeft />
          Back
        </button>
      </div>
      <div className="grid grid-cols-4 gap-6 p-6 bg-gray-100">
        {externalAssetsWithImages.map((viaduct) => (
          <ViaductCard
            key={viaduct.id}
            viaduct={{
              ...viaduct,
              picture: imageMap[viaduct.id] || null,
              isBooked: contractedViaduct.includes(viaduct.id),
            }}
            onDetailsClick={handleDetailsClick}
          />
        ))}
      </div>
      {/* Sidebar */}
      {selectedViaduct && (
        <div className="w-1/3 bg-white shadow-lg p-6 fixed right-0 top-0 h-full z-50 flex flex-col overflow-y-auto">
          {/* Close Button */}
          <button className="self-end text-gray-600 hover:text-black" onClick={() => setSelectedViaduct(null)}>
            ✖
          </button>

          {/* Viaduct Name */}
          {selectedViaduct.viaduct_name && <h3 className="text-lg font-bold text-green-400">{selectedViaduct.viaduct_name}</h3>}

          {/* Asset Direction */}
          <p className="text-sm text-gray-600 italic">*LRT-1 Line</p>
          {selectedViaduct.asset_direction && <p className="text-sm text-gray-600 italic">*{selectedViaduct.asset_direction}</p>}

          {/* SB or NB Check */}
          {selectedViaduct.viaduct_name &&
            (selectedViaduct.viaduct_name.includes("SB") ? (
              <p className="text-sm text-gray-600 italic">*Southbound</p>
            ) : selectedViaduct.viaduct_name.includes("NB") ? (
              <p className="text-sm text-gray-600 italic">*Northbound</p>
            ) : null)}

          {/* MEDIA RENTAL */}
          {selectedViaduct.media_rental && (
            <p className="mt-3 font-bold text-gray-800">
              MEDIA RENTAL: <span className="font-normal">₱{Number(selectedViaduct.media_rental).toLocaleString()}/UNIT / MONTH</span>
            </p>
          )}

          {/* PROD. COST */}
          {selectedViaduct.prod_cost && (
            <p className="font-bold text-gray-800">
              1X PROD. COST: <span className="font-normal">₱{Number(selectedViaduct.prod_cost).toLocaleString()} PER UNIT</span>
            </p>
          )}

          {/* SIZE */}
          {selectedViaduct.size && (
            <p className="font-bold text-gray-800">
              SIZE APPROX.: <span className="font-normal">{selectedViaduct.size}</span>
            </p>
          )}

          {/* NO. OF UNITS - Extracted from Notes */}
          {selectedViaduct.id === 1 && firstPart && firstPart.includes(":") && (
            <p className="font-bold text-gray-800">
              {firstPart.split(":")[0]}: <span className="font-normal">{firstPart.split(":")[1]}</span>
            </p>
          )}

          {/* Minimum Duration */}
          {selectedViaduct.min_duration_months && <p className="text-sm text-gray-600">*Minimum of {selectedViaduct.min_duration_months} months</p>}

          {/* VAT Note */}
          {selectedViaduct.id !== 1 && firstPart && <p className="text-sm text-gray-600">**{firstPart}</p>}

          {selectedViaduct.id === 1 && <p className="text-sm text-gray-600">**Rates are exclusive of VAT</p>}

          {/* Image 1 */}
          {selectedViaduct.picture && <img className="w-full rounded-md" src={selectedViaduct.picture} alt="Viaduct" />}

          {/* Remaining Notes */}
          {rest.length > 0 && <p className="text-sm text-green-600">{rest.join(",")}</p>}

          {/* Image 2 */}

          {/* {selectedViaduct.picture2 && <img className="w-full rounded-md" src={selectedViaduct.picture2} alt="Viaduct Map" />} */}
          {/* <APIProvider apiKey={"AIzaSyCJK4xNqR28XgzEMDWDsHKcLyMPV04E6qE"}>
            <div className="relative w-full h-[500px] border">
              <Map center={center} zoom={15} mapId="" streetViewControl={false} mapTypeControl={false} fullscreenControl={false}>
                <Marker position={center} />
              </Map>
            </div>
          </APIProvider> */}

          {/* Book Button */}
          <button className="bg-green-400 text-white font-bold py-2 px-4 rounded-md mt-4 w-full hover:bg-green-700" onClick={() => setIsModalOpen(true)}>
            BOOK VIADUCT
          </button>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-lg font-bold">Book Viaduct</h2>
            <p className="mt-2">Are you sure you want to proceed with the booking?</p>

            <h2 className="text-lg font-bold">Selected Contract</h2>
            {attachedContract && (
              <ContractTable
                code={attachedContract.SalesOrderCode || "N/A"}
                reference={attachedContract.ReferenceNo || "N/A"}
                orderDate={attachedContract.SalesOrderDate || "N/A"}
                projDesc={attachedContract.ProjectDesc || "N/A"}
                dateStart={attachedContract.DateRef1 || "N/A"}
                dateEnd={attachedContract.DateRef2 || "N/A"}
              />
            )}

            {/* Buttons */}
            <div className="mt-4 flex justify-end space-x-2">
              <button className="bg-gray-300 px-4 py-2 rounded-md" onClick={() => setIsModalOpen(false)}>
                Cancel
              </button>
              <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-700" onClick={bookViaduct}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
ExternalAssets.propTypes = {
  onBackExternal: PropTypes.func,
};
export default ExternalAssets;
