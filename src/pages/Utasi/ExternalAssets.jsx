import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { FaArrowLeft } from "react-icons/fa";
import { useStations } from "~contexts/LRTContext";
import { useUtasiImages } from "./utasi.const";
import ContractTable from "~components/contractTable";
import { useLRTapi } from "~contexts/LRT.api";
import PillarMapLocation from "~components/pillarMap/PillarMapLocation";
import { ViaductCard } from "~components/ViaductCard";
import { Modal, Button } from "flowbite-react";
import { useImageUrl } from "~/misc/useImageUrl";

const ExternalAssets = ({ onBackExternal }) => {
  const viad = useImageUrl("viad.jpg");
  const { imageMap, imageMap2 } = useUtasiImages();
  // 1. Hooks & Dependencies
  const {
    attachedContract,
    refreshAssetContracts,
    assetContracts,
    refreshPillars,
    refreshViaducts,
    viaducts,
    setViaducts,
  } = useStations();
  const { addViaduct, deleteViaduct, updateExternal } = useLRTapi();

  // 2. State Initialization
  const [selectedViaduct, setSelectedViaduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViaduct, setIsViaduct] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [brand, setBrand] = useState("");
  const [brandModalOpen, setBrandModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
  const externalAssetsWithImages = viaducts.map((asset) => ({
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
  const refresh = async () => {
    setLoading(true);
    try {
      await refreshViaducts();
      await refreshAssetContracts();
      await refreshPillars();
    } catch {
      setError("Failed to load train assets data.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    refresh();
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
      refresh();
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
      refresh();
    }
  };
  const handleBookViaduct = async (id, isBooked, brand) => {
    try {
      await updateExternal(id, isBooked, brand);
      alert(isBooked === 1 ? "Viaduct booked successfully!" : "Viaduct unbooked successfully!");
      setViaducts((prev) => prev.map((v) => (v.id === id ? { ...v, is_booked: isBooked, brand } : v)));
      setSelectedViaduct((prev) => (prev && prev.id === id ? { ...prev, is_booked: isBooked, brand } : prev));
    } catch (e) {
      console.error("Update failed:", e);
    } finally {
      setBrandModalOpen(false);
      setBrand("");
      refresh();
    }
  };

  const isBooked = Number(selectedViaduct?.is_booked) === 1;

  // Normalize ids to strings to avoid "1" vs 1 mismatches
  const contractedIds = Array.isArray(contractedViaduct) ? contractedViaduct.map((id) => String(id)) : [];
  const isContracted = selectedViaduct?.id != null ? contractedIds.includes(String(selectedViaduct.id)) : false;

  if (error) return <p>Error: {error}</p>;
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
        <div className="flex gap-2">
          <button
            onClick={onBackExternal}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-200 rounded-lg shadow-sm hover:bg-gray-300 active:scale-95 transition"
          >
            <FaArrowLeft />
            Back
          </button>
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
        </div>
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
              {isContracted ? null : attachedContract ? (
                <Button className="rounded-md mt-4 w-full" onClick={() => setIsModalOpen(true)}>
                  BOOK VIADUCT
                </Button>
              ) : isBooked ? (
                <Button
                  className="rounded-md mt-4 w-full"
                  onClick={() => handleBookViaduct(selectedViaduct.id, 0, null)}
                >
                  Unbook Viaduct?
                </Button>
              ) : (
                <Button
                  className="rounded-md mt-4 w-full"
                  onClick={() => {
                    setBrand(selectedViaduct.brand ?? "");
                    setBrandModalOpen(true);
                  }}
                >
                  Book Viaduct without contract?
                </Button>
              )}
            </div>
          )}
          {brandModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
              <div role="dialog" aria-modal="true" className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
                <h3 className="text-lg font-semibold text-gray-900">Book Viaduct without contract</h3>
                <p className="mt-1 text-sm text-gray-600">Please specify the Brand for this booking.</p>

                <label className="mt-4 block text-sm font-medium text-gray-700" htmlFor="brand">
                  Brand
                </label>
                <input
                  id="brand"
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="e.g., Coca-Cola"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleBookViaduct(selectedViaduct.id, 1, brand);
                    }
                  }}
                />

                <div className="mt-6 flex justify-end gap-2">
                  <button
                    type="button"
                    className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => {
                      setBrandModalOpen(false);
                      setBrand("");
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="rounded-md bg-green-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-60"
                    onClick={() => handleBookViaduct(selectedViaduct.id, 1, brand)}
                  >
                    Continue
                  </button>
                </div>
              </div>
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
