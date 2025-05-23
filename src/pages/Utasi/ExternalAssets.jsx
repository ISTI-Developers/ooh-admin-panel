import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { FaArrowLeft } from "react-icons/fa";
import { useStations } from "~contexts/LRTContext";
import { imageMap, imageMap2 } from "./utasi.const";
import ContractTable from "~components/contractTable";
import { useLRTapi } from "~contexts/LRT.api";
import PillarMapLocation from "~components/pillarMap/PillarMapLocation";
import { ViaductCard } from "~components/ViaductCard";
import { Modal, Button } from "flowbite-react";
import viad from "~assets/viad.jpg";
const ExternalAssets = ({ onBackExternal }) => {
  // 1. Hooks & Dependencies
  const { attachedContract } = useStations();
  const { getExternalAssetSpecs, getContractFromAsset, addViaduct, deleteViaduct } = useLRTapi();

  // 2. State Initialization
  const [selectedViaduct, setSelectedViaduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViaduct, setIsViaduct] = useState(true);
  const [externalAssetSpecs, setExternalAssetSpecs] = useState([]);
  const [assetContracts, setAssetContracts] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);

  const [form, setForm] = useState({
    viaductName: "",
    direction: "",
    assetDirection: "",
    mediaRental: "",
    prodCost: "",
    size: "",
    vatExclusive: false,
  });
  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

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

  const effects = async () => {
    const data = await getExternalAssetSpecs(8);
    setExternalAssetSpecs(data.data);

    const assetContract = await getContractFromAsset();
    setAssetContracts(assetContract.data);
  };

  // 5. Effects
  useEffect(() => {
    effects();
  }, []);
  const handleSave = async () => {
    const confirm = window.confirm("Are you sure you want to attach this contract?");
    if (!confirm) return;
    const payload = {
      asset_name: form.direction ? form.viaductName + " - " + form.direction : form.viaductName,
      asset_id: 8,
      asset_direction: form.assetDirection,
      media_rental: parseFloat(form.mediaRental),
      prod_cost: parseFloat(form.prodCost),
      vat_exclusive: form.vatExclusive,
      size: form.size,
    };

    try {
      await addViaduct(payload);
      setShowAddForm(false);
    } catch (error) {
      console.error("Add failed:", error);
    } finally {
      effects();
    }
  };
  const handleDeleteViaduct = async (id, spec_id) => {
    const confirm = window.confirm("Are you sure you want to delete this viaduct?");
    if (!confirm) return;
    try {
      await deleteViaduct(id, spec_id);
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      effects();
    }
  };
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
          <div className="grid grid-cols-4 gap-6">
            {externalAssetsWithImages.map((viaduct) => (
              <ViaductCard
                key={viaduct.id}
                viaduct={{
                  ...viaduct,
                  picture: imageMap[viaduct.id] || viad,
                  isBooked: contractedViaduct.includes(viaduct.id),
                }}
                onDetailsClick={handleDetailsClick}
                deleteViaduct={() => handleDeleteViaduct(viaduct.id, viaduct.spec_id)}
              />
            ))}
            {!attachedContract && (
              <div
                onClick={() => setShowAddForm(true)}
                className="relative cursor-pointer bg-white rounded-lg shadow-md p-8 flex flex-col items-center justify-center border-2 border-dashed border-green-400 hover:shadow-lg transition hover:bg-green-50"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                <span className="mt-2 text-green-600 font-medium">Add New Viaduct</span>
              </div>
            )}
          </div>
          <Modal show={showAddForm} onClose={() => setShowAddForm(false)}>
            <Modal.Header>Add New Viaduct</Modal.Header>
            <Modal.Body>
              <div className="space-y-4">
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">Viaduct Name</label>
                    <input
                      type="text"
                      value={form.viaductName}
                      onChange={(e) => handleChange("viaductName", e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500"
                    />
                  </div>

                  <div className="w-40">
                    <label className="block text-sm font-medium text-gray-700">Direction</label>
                    <select
                      value={form.direction}
                      onChange={(e) => handleChange("direction", e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500"
                    >
                      <option value="" disabled>
                        Select a Direction
                      </option>
                      <option value="SB">South Bound</option>
                      <option value="NB">North Bound</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Asset Direction</label>
                  <input
                    type="text"
                    value={form.assetDirection}
                    onChange={(e) => handleChange("assetDirection", e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Media Rental (₱/unit/month)</label>
                  <input
                    type="number"
                    value={form.mediaRental}
                    onChange={(e) => handleChange("mediaRental", e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Production Cost (₱/unit)</label>
                  <input
                    type="number"
                    value={form.prodCost}
                    onChange={(e) => handleChange("prodCost", e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Size Approx.</label>
                  <input
                    type="text"
                    value={form.size}
                    onChange={(e) => handleChange("size", e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div className="flex items-center space-x-2 mt-4">
                  <input
                    id="isActive"
                    type="checkbox"
                    checked={form.vatExclusive}
                    onChange={(e) => handleChange("vatExclusive", e.target.value)}
                    className="rounded border-gray-300 text-green-600 shadow-sm focus:ring-green-500"
                  />
                  Vat Exclusive?
                </div>
              </div>
            </Modal.Body>

            <Modal.Footer>
              <Button color="success" onClick={handleSave}>
                Save Asset
              </Button>

              <Button color="gray" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
            </Modal.Footer>
          </Modal>

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
                <button
                  className="bg-green-400 text-white font-bold py-2 px-4 rounded-md mt-4 w-full hover:bg-green-700"
                  onClick={() => setIsModalOpen(true)}
                >
                  BOOK VIADUCT
                </button>
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

                {attachedContract && (
                  <ContractTable
                    selectedContract={attachedContract}
                    asset_id={selectedViaduct.asset_id}
                    viaduct_id={selectedViaduct.id}
                    setIsModalOpen={setIsModalOpen}
                    setSelectedViaduct={setSelectedViaduct}
                    setExternalAssetSpecs={setExternalAssetSpecs}
                    setAssetContracts={setAssetContracts}
                  />
                )}
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
