import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { FaArrowLeft } from "react-icons/fa";
import { useStations } from "~contexts/LRTContext";
import { imageMap, imageMap2 } from "./utasi.const";
import ContractTable from "~components/contractTable";
import { useLRTapi } from "~contexts/LRT.api";
import { Button } from "flowbite-react";
import PillarMapLocation from "~components/pillarMap/PillarMapLocation";
import { ViaductCard } from "~components/ViaductCard";

const ExternalAssets = ({ onBackExternal }) => {
  // 1. Hooks & Dependencies
  const { attachedContract } = useStations();
  const { attachContract, getExternalAssetSpecs, getContractFromAsset } = useLRTapi();

  // 2. State Initialization
  const [selectedViaduct, setSelectedViaduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViaduct, setIsViaduct] = useState(true);
  const [isBooking, setIsBooking] = useState(false);
  const [externalAssetSpecs, setExternalAssetSpecs] = useState([]);
  const [assetContracts, setAssetContracts] = useState([]);

  // 3. Derived Data
  const contractedViaduct = assetContracts.filter((cv) => cv.viaduct_id != null).map((cv) => cv.viaduct_id);

  const externalAssetsWithImages = externalAssetSpecs.map((asset) => ({
    ...asset,
    picture: imageMap[asset.id] || null,
    picture2: imageMap2[asset.id] || null,
  }));

  const notes = selectedViaduct?.notes || "";
  const [firstPart, ...rest] = notes.split(",");

  // 4. Functions
  const handleDetailsClick = (viaduct) => {
    setSelectedViaduct(viaduct);
  };

  const bookViaduct = async () => {
    const isConfirmed = window.confirm("Are you sure you want to book this viaduct?");
    if (!isConfirmed) return;

    setIsBooking(true);
    try {
      const contractData = {
        assetSalesOrderCode: attachedContract.SalesOrderCode,
        assetDateStart: attachedContract.DateRef1,
        assetDateEnd: attachedContract.DateRef2,
        assetId: selectedViaduct.asset_id,
        viaductId: selectedViaduct.id,
      };

      const response = await attachContract(contractData);
      alert(response.message || "Booking successful!");
    } catch (error) {
      console.error("Booking failed:", error);
      alert("Booking failed. Please try again.");
    } finally {
      setIsBooking(false);
      setIsModalOpen(false);
      setSelectedViaduct(null);

      // Refresh external assets and contract data
      const data = await getExternalAssetSpecs(8);
      setExternalAssetSpecs(data.data);

      const assetContract = await getContractFromAsset();
      setAssetContracts(assetContract.data);
    }
  };

  // 5. Effects
  useEffect(() => {
    const fetchExternalAssets = async () => {
      const data = await getExternalAssetSpecs(8);
      setExternalAssetSpecs(data.data);

      const assetContract = await getContractFromAsset();
      setAssetContracts(assetContract.data);
    };

    fetchExternalAssets();
  }, []);

  return (
    <div className="container p-6">
      <div className="flex justify-between mb-4">
        <div className="flex space-x-2">
          <Button
            color="none"
            onClick={() => setIsViaduct(true)}
            className={`rounded-full px-4 ${
              isViaduct
                ? "bg-green-500 text-white"
                : "border border-green-500 text-green-500 bg-transparent hover:bg-green-100"
            }`}
          >
            Viaduct
          </Button>
          <Button
            color="none"
            onClick={() => setIsViaduct(false)}
            className={`rounded-full px-4 ${
              !isViaduct
                ? "bg-green-500 text-white"
                : "border border-green-500 text-green-500 bg-transparent hover:bg-green-100"
            }`}
          >
            Pillar
          </Button>
        </div>

        <button onClick={onBackExternal} className="flex items-center px-4 py-2 rounded hover:bg-gray-400">
          <FaArrowLeft />
          Back
        </button>
      </div>
      {isViaduct ? (
        <>
          <div className="grid grid-cols-4 gap-6  bg-gray-100">
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

          {selectedViaduct && (
            <div className="w-1/3 bg-white shadow-lg p-6 fixed right-0 top-0 h-full z-50 flex flex-col overflow-y-auto">
              <button className="self-end text-gray-600 hover:text-black" onClick={() => setSelectedViaduct(null)}>
                ✖
              </button>

              {selectedViaduct.viaduct_name && (
                <h3 className="text-lg font-bold text-green-400">{selectedViaduct.viaduct_name}</h3>
              )}
              <p className="text-sm text-gray-600 italic">*LRT-1 Line</p>
              {selectedViaduct.asset_direction && (
                <p className="text-sm text-gray-600 italic">*{selectedViaduct.asset_direction}</p>
              )}

              {selectedViaduct.viaduct_name &&
                (selectedViaduct.viaduct_name.includes("SB") ? (
                  <p className="text-sm text-gray-600 italic">*Southbound</p>
                ) : selectedViaduct.viaduct_name.includes("NB") ? (
                  <p className="text-sm text-gray-600 italic">*Northbound</p>
                ) : null)}

              {selectedViaduct.media_rental && (
                <p className="mt-3 font-bold text-gray-800">
                  MEDIA RENTAL:{" "}
                  <span className="font-normal">
                    ₱{Number(selectedViaduct.media_rental).toLocaleString()}/UNIT / MONTH
                  </span>
                </p>
              )}

              {selectedViaduct.prod_cost && (
                <p className="font-bold text-gray-800">
                  1X PROD. COST:{" "}
                  <span className="font-normal">₱{Number(selectedViaduct.prod_cost).toLocaleString()} PER UNIT</span>
                </p>
              )}

              {selectedViaduct.size && (
                <p className="font-bold text-gray-800">
                  SIZE APPROX.: <span className="font-normal">{selectedViaduct.size}</span>
                </p>
              )}

              {selectedViaduct.id === 1 && firstPart && firstPart.includes(":") && (
                <p className="font-bold text-gray-800">
                  {firstPart.split(":")[0]}: <span className="font-normal">{firstPart.split(":")[1]}</span>
                </p>
              )}

              {selectedViaduct.min_duration_months && (
                <p className="text-sm text-gray-600">*Minimum of {selectedViaduct.min_duration_months} months</p>
              )}

              {selectedViaduct.id !== 1 && firstPart && <p className="text-sm text-gray-600">**{firstPart}</p>}

              {selectedViaduct.id === 1 && <p className="text-sm text-gray-600">**Rates are exclusive of VAT</p>}

              {selectedViaduct.picture && (
                <img className="w-full rounded-md" src={selectedViaduct.picture} alt="Viaduct" />
              )}

              {rest.length > 0 && <p className="text-sm text-green-600">{rest.join(",")}</p>}
              {attachedContract ? (
                <>
                  <button
                    className="bg-green-400 text-white font-bold py-2 px-4 rounded-md mt-4 w-full hover:bg-green-700"
                    onClick={() => setIsModalOpen(true)}
                  >
                    BOOK VIADUCT
                  </button>
                </>
              ) : (
                <></>
              )}
            </div>
          )}

          {isModalOpen && (
            <div className="fixed inset-0 z-[50] flex items-center justify-center bg-black bg-opacity-50">
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

                <div className="mt-4 flex justify-end space-x-2">
                  <button className="bg-gray-300 px-4 py-2 rounded-md" onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </button>
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-700"
                    onClick={bookViaduct}
                  >
                    {isBooking ? "Booking..." : "Confirm"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          <PillarMapLocation />
        </>
      )}
    </div>
  );
};
ExternalAssets.propTypes = {
  onBackExternal: PropTypes.func,
};
export default ExternalAssets;
