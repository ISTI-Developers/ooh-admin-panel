// import React from "react";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Modal } from "flowbite-react";
import { FaInfoCircle, FaArrowLeft } from "react-icons/fa";
import { useStations } from "~contexts/LRTContext";
import ContractTable from "~components/contractTable";
import { useImageUrl } from "~/misc/useImageUrl";
import { useLRTapi } from "~contexts/LRT.api";

const TrainAssets = ({ onBackTrain }) => {
  const handgrips = useImageUrl("handgrips.jpg");
  const overheadpanels = useImageUrl("overheadpanels.png");
  const seatdividersticker = useImageUrl("seatdividersticker.jpg");
  const seatdividersticker2 = useImageUrl("seatdividersticker2.png");
  const trainwrap = useImageUrl("trainwrap.jpg");
  const twoseaterwrap = useImageUrl("twoseaterwrap.jpg");
  const { attachedContract, trainAssets, setTrainAssets, trainSpecs, refreshAllTrainAssets, refreshTrainSpecs } =
    useStations();
  const { updateTrainAsset, updateAssetSpecs } = useLRTapi();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [detailModal, setDetailModal] = useState(false);
  const [bookModal, setBookModal] = useState(false);
  const [editModal, setEditModal] = useState(false);

  const [qty, setQty] = useState(0);
  const [avlbl, setAvlbl] = useState(0);
  const [ood, setOod] = useState(0);
  const [bkd, setBkd] = useState(0);

  const headers = ["Assets", "Available", "Out of Order", "Booked", attachedContract ? "Contracts" : "Actions"];

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    mediaRental: selectedAsset?.media_rental ?? "",
    rateCard: selectedAsset?.ratecard ?? "",
    prodCost: selectedAsset?.prod_cost ?? "",
    minDuration: selectedAsset?.min_duration_months ?? "",
    vatExclusive: selectedAsset?.vat_exclusive ?? false,
    stations: selectedAsset?.stations ?? "",
    size: selectedAsset?.size ?? "",
    notes: selectedAsset?.notes ?? "",
  });
  useEffect(() => {
    if (selectedAsset) {
      setFormData({
        mediaRental: selectedAsset.media_rental || "",
        rateCard: selectedAsset.ratecard || "",
        prodCost: selectedAsset.prod_cost || "",
        minDuration: selectedAsset.min_duration_months || "",
        vatExclusive: selectedAsset.vat_exclusive || false,
        size: selectedAsset.size || "",
        notes: selectedAsset.notes || "",
      });
    }
  }, [selectedAsset]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    const confirmSave = window.confirm("Are you sure you want to save the changes?");
    if (!confirmSave) {
      return;
    }
    const updatedFormData = {
      ...formData,
      vat_exclusive: formData.vatExclusive === "true" ? true : false,
      media_rental: parseFloat(formData.mediaRental),
      ratecard: parseFloat(formData.rateCard),
      prod_cost: parseFloat(formData.prodCost),
      min_duration_months: parseInt(formData.minDuration),
    };

    try {
      await updateAssetSpecs(selectedAsset.asset_id, updatedFormData);
      console.log("Update successful!");
      alert("Asset details updated successfully!");
    } catch (error) {
      console.error("Update failed:", error);
      alert("Failed to update asset details. Please try again.");
    } finally {
      setIsEditing(false);
    }
  };

  const handleDetailModal = (asset) => {
    const matchedSpec = trainSpecs.find((spec) => spec.asset_id === asset.asset_id);
    setSelectedAsset(matchedSpec || asset);
    setDetailModal(true);
  };

  const updateTrain = async () => {
    try {
      const response = await updateTrainAsset(selectedAsset.asset_id, avlbl, ood);
      if (response && response.data) {
        setTrainAssets((prev) =>
          prev.map((asset) =>
            asset.asset_id === selectedAsset.asset_id
              ? { ...asset, available: response.data.available, out_of_order: response.data.out_of_order }
              : asset
          )
        );
        setAvlbl(response.data.available);
        setOod(response.data.out_of_order);
      }
      alert("Update successful");
    } catch (error) {
      console.error("Update failed:", error);
      alert("Update failed. Please try again.");
    } finally {
      setEditModal(false);
    }
  };

  const refresh = async () => {
    setLoading(true);
    try {
      await refreshAllTrainAssets();
      await refreshTrainSpecs();
    } catch {
      setError("Failed to load train assets data.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    refresh();
  }, []);

  if (error) return <p>Error: {error}</p>;
  return (
    <div className="container rounded-lg">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBackTrain}
          className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-200 rounded-lg shadow-sm hover:bg-gray-300 active:scale-95 transition"
        >
          <FaArrowLeft />
          Back
        </button>{" "}
        <div className="flex gap-3">
          {/* Refresh Button */}
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
      <h2 className="text-xl font-bold text-blue-500 mb-4">TRAIN ASSETS</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left bg-white rounded-lg shadow-md border-collapse">
          <thead className="text-gray-700 text-sm font-semibold">
            <tr>
              {headers.map((head, index) => (
                <th key={index} className="px-6 py-3">
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {trainAssets.map((item, index) => (
              <tr key={index}>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <span className="capitalize">{item.asset_name}</span>
                    <div className="relative group">
                      <FaInfoCircle className="text-blue-500 cursor-pointer" onClick={() => handleDetailModal(item)} />
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">{item.available}</td>
                <td className="px-6 py-4">{item.out_of_order}</td>
                <td className="px-6 py-4">{item.booked}</td>
                {attachedContract ? (
                  <td className="px-6 py-4">
                    <button
                      className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-full"
                      onClick={() => {
                        setBookModal(true), setAvlbl(item.available), setSelectedAsset(item);
                      }}
                    >
                      Book
                    </button>
                  </td>
                ) : (
                  <td className="px-6 py-4">
                    <button
                      className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-full"
                      onClick={() => {
                        setEditModal(true),
                          setAvlbl(item.available),
                          setOod(item.out_of_order),
                          setBkd(item.booked),
                          setSelectedAsset(item);
                      }}
                    >
                      Edit
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Flowbite Modal */}
      <Modal show={detailModal} onClose={() => setDetailModal(false)} sizing="md">
        <Modal.Header className="capitalize">{selectedAsset?.asset_name || "Asset Details"}</Modal.Header>
        <Modal.Body>
          {selectedAsset ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <p>
                  <strong>Media Rental:</strong>
                  {isEditing ? (
                    <input
                      type="number"
                      name="mediaRental"
                      value={formData.mediaRental}
                      onChange={handleInputChange}
                      className="border rounded-md p-1"
                    />
                  ) : (
                    `₱${Number(formData.mediaRental).toLocaleString()}`
                  )}
                </p>
                <p>
                  <strong>Rate Card:</strong>
                  {isEditing ? (
                    <input
                      type="number"
                      name="rateCard"
                      value={formData.rateCard}
                      onChange={handleInputChange}
                      className="border rounded-md p-1"
                    />
                  ) : (
                    `₱${Number(formData.rateCard).toLocaleString()}`
                  )}
                </p>
                <p>
                  <strong>Production Cost:</strong>
                  {isEditing ? (
                    <input
                      type="number"
                      name="prodCost"
                      value={formData.prodCost}
                      onChange={handleInputChange}
                      className="border rounded-md p-1"
                    />
                  ) : (
                    `₱${Number(formData.prodCost).toLocaleString()}`
                  )}
                </p>
                <p>
                  <strong>Min Duration:</strong>
                  {isEditing ? (
                    <input
                      type="number"
                      name="minDuration"
                      value={formData.minDuration}
                      onChange={handleInputChange}
                      className="border rounded-md p-1"
                    />
                  ) : (
                    `${formData.minDuration} months`
                  )}
                </p>
                <p>
                  <strong>VAT Exclusive:</strong>
                  {isEditing ? (
                    <select
                      name="vatExclusive"
                      value={formData.vatExclusive}
                      onChange={handleInputChange}
                      className="border rounded-md p-1"
                    >
                      <option value={true}>Yes</option>
                      <option value={false}>No</option>
                    </select>
                  ) : formData.vatExclusive ? (
                    "Yes"
                  ) : (
                    "No"
                  )}
                </p>
                <p>
                  <strong>Size:</strong>
                  {isEditing ? (
                    <input
                      type="text"
                      name="size"
                      value={formData.size}
                      onChange={handleInputChange}
                      className="border rounded-md p-1"
                    />
                  ) : (
                    formData.size || "N/A"
                  )}
                </p>
                <p>
                  <strong>Notes:</strong>
                  {isEditing ? (
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      className="border rounded-md p-1"
                    />
                  ) : (
                    formData.notes || "N/A"
                  )}
                </p>
              </div>
              <div className="flex justify-center">
                {(() => {
                  const assetImages = {
                    3: overheadpanels,
                    4: [seatdividersticker, seatdividersticker2],
                    5: twoseaterwrap,
                    6: handgrips,
                    7: trainwrap,
                  };
                  const imageSrc = assetImages[selectedAsset.asset_id];
                  return Array.isArray(imageSrc) ? (
                    <div className="space-y-2">
                      {imageSrc.map((src, index) => (
                        <img
                          key={index}
                          src={src}
                          alt={`Asset ${index + 1}`}
                          className="w-full h-auto rounded-lg shadow-md"
                        />
                      ))}
                    </div>
                  ) : (
                    <img src={imageSrc} alt="Asset" className="w-full h-auto rounded-lg shadow-md" />
                  );
                })()}
              </div>
            </div>
          ) : (
            <p>No asset details available.</p>
          )}
        </Modal.Body>
        <Modal.Footer className="flex justify-end">
          <button
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            onClick={() => {
              setDetailModal(false), setIsEditing(false);
            }}
          >
            Close
          </button>
          {!attachedContract && (
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              onClick={() => setIsEditing((prev) => !prev)}
            >
              {isEditing ? "Cancel" : "Edit"}
            </button>
          )}

          {isEditing && (
            <button className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600" onClick={handleSave}>
              Save
            </button>
          )}
        </Modal.Footer>
      </Modal>
      {bookModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <div className="flex justify-between items-center">
              <h2 className="text-blue-600 font-bold text-lg capitalize">{selectedAsset.asset_name}</h2>
            </div>
            <label className="block mt-4 font-medium">Set</label>
            <div className="flex items-center mt-1">
              <button className="px-3 py-1 border rounded-l bg-gray-200" onClick={() => setQty(qty > 0 ? qty - 1 : 0)}>
                -
              </button>
              <span className="px-4 border-t border-b">{qty}</span>
              <button
                className="px-3 py-1 border rounded-r bg-gray-200"
                onClick={() => setQty(qty < avlbl ? qty + 1 : avlbl)}
              >
                +
              </button>
            </div>
            {attachedContract && (
              <>
                <ContractTable
                  selectedContract={attachedContract}
                  setIsModalOpen={setBookModal}
                  asset_id={selectedAsset.asset_id}
                  qty={qty}
                  avlbl={avlbl}
                  setTrainAssets={setTrainAssets}
                  setQty={setQty}
                />
              </>
            )}
          </div>
        </div>
      )}
      {editModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <div className="flex justify-between items-center">
              <h2 className="text-blue-600 font-bold text-lg capitalize">{selectedAsset.asset_name} (Edit Mode)</h2>
              <button onClick={() => setEditModal(false)}>Exit</button>
            </div>

            <label className="block mt-4 font-medium">
              Total Trains with {selectedAsset.asset_name}: {avlbl + ood + bkd}
            </label>

            <label className="block mt-4 font-medium">Set Available</label>
            <div className="flex items-center mt-1">
              <button
                className="px-3 py-1 border rounded-l bg-gray-200"
                onClick={() => setAvlbl(avlbl > 0 ? avlbl - 1 : 0)} // Decrease freely
              >
                -
              </button>
              <span className="px-4 border-t border-b">{avlbl}</span>
              <button
                className="px-3 py-1 border rounded-r bg-gray-200"
                onClick={() => setAvlbl(avlbl + 1)} // Increase freely
              >
                +
              </button>
            </div>

            <label className="block mt-4 font-medium">Set Out of Order</label>
            <div className="flex items-center mt-1">
              <button
                className="px-3 py-1 border rounded-l bg-gray-200"
                onClick={() => {
                  if (ood > 0) {
                    setOod(ood - 1);
                    setAvlbl(avlbl + 1); // Restore to Available when OOD decreases
                  }
                }}
              >
                -
              </button>
              <span className="px-4 border-t border-b">{ood}</span>
              <button
                className="px-3 py-1 border rounded-r bg-gray-200"
                onClick={() => {
                  setOod(ood + 1);
                  if (avlbl > 0) {
                    setAvlbl(avlbl - 1);
                  } // Reduce Available when OOD increases
                }}
              >
                +
              </button>
            </div>

            <button
              onClick={updateTrain}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-full mt-4 w-full"
            >
              Update
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
TrainAssets.propTypes = {
  onBackTrain: PropTypes.func,
};
export default TrainAssets;
