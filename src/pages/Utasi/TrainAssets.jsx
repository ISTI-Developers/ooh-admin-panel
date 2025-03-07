// import React from "react";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Modal } from "flowbite-react";
import { FaInfoCircle, FaArrowLeft } from "react-icons/fa";
import { useStations } from "~contexts/LRTContext";
import ContractTable from "~components/contractTable";
import handgrips from "../../assets/handgrips.jpg";
import overheadpanels from "../../assets/overheadpanels.jpg";
import seatdividersticker from "../../assets/seatdividersticker.jpg";
import seatdividersticker2 from "../../assets/seatdividersticker2.png";
import trainwrap from "../../assets/trainwrap.jpg";
import twoseaterwrap from "../../assets/twoseaterwrap.jpg";
import { useLRTapi } from "~contexts/LRT.api";
const TrainAssets = ({ onBackTrain }) => {
  const { getTrainAssets, getTrainAssetsSpecs, attachedContract } = useStations();
  const { trainAssetBook, attachContract, updateTrainAsset } = useLRTapi();
  const [trainAssets, setTrainAssets] = useState([]);
  const [assetSpecs, setAssetSpecs] = useState([]);
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

  const [bookedAsset, setBookedAsset] = useState(null);

  const headers = ["Assets", "Available", "Out of Order", "Booked", attachedContract ? "Contracts" : "Actions"];

  const handleDetailModal = (asset) => {
    const matchedSpec = assetSpecs.find((spec) => spec.asset_id === asset.asset_id);
    setSelectedAsset(matchedSpec || asset);
    setDetailModal(true);
  };

  const bookTrain = async (e) => {
    if (qty <= 0 || qty > avlbl) {
      alert(`Invalid quantity! Must be between 1 and ${avlbl}.`);
      return;
    }
    e.preventDefault();

    try {
      const contractData = {
        assetSalesOrderCode: attachedContract.SalesOrderCode,
        assetDateStart: attachedContract.DateRef1,
        assetDateEnd: attachedContract.DateRef2,
        assetId: bookedAsset,
        quantity: qty,
      };
      const response = await trainAssetBook(bookedAsset, qty);
      const response2 = await attachContract(contractData);
      console.log("Booking successful:", response);
      console.log("Booking 2 successful:", response2);
      setTrainAssets((prev) => prev.map((asset) => (asset.asset_id === bookedAsset ? { ...asset, booked: asset.booked + qty, available: asset.available - qty } : asset)));
    } catch (error) {
      console.error("Booking failed:", error);
      alert("Booking failed. Please try again.");
    } finally {
      setBookModal(false);
      setQty(0);
    }
  };
  const updateTrain = async () => {
    try {
      const response = await updateTrainAsset(selectedAsset.asset_id, avlbl, ood);
      if (response && response.data) {
        setTrainAssets((prev) => prev.map((asset) => (asset.asset_id === selectedAsset.asset_id ? { ...asset, available: response.data.available, out_of_order: response.data.out_of_order } : asset)));
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [trainAssets, assetSpecs] = await Promise.all([getTrainAssets(), getTrainAssetsSpecs()]);
        setTrainAssets(trainAssets.data);
        setAssetSpecs(assetSpecs.data);
      } catch (err) {
        setError(err.response?.data || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [getTrainAssets, getTrainAssetsSpecs]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  return (
    <div className="container rounded-lg">
      <div className="mb-4">
        <button onClick={onBackTrain} className="flex items-center px-4 py-2 rounded hover:bg-gray-400">
          <FaArrowLeft />
          Back
        </button>
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
                        setBookModal(true), setAvlbl(item.available), setSelectedAsset(item), setBookedAsset(item.asset_id);
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
                        setEditModal(true), setAvlbl(item.available), setOod(item.out_of_order), setBkd(item.booked), setSelectedAsset(item);
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
                  <strong>Media Rental:</strong> ₱{Number(selectedAsset.media_rental).toLocaleString()}
                </p>
                <p>
                  <strong>Rate Card:</strong> ₱{Number(selectedAsset.ratecard).toLocaleString()}
                </p>
                <p>
                  <strong>Production Cost:</strong> ₱{Number(selectedAsset.prod_cost).toLocaleString()}
                </p>
                <p>
                  <strong>Min Duration:</strong> {selectedAsset.min_duration_months} months
                </p>
                <p>
                  <strong>VAT Exclusive:</strong> {selectedAsset.vat_exclusive ? "Yes" : "No"}
                </p>
                <p>
                  <strong>Size:</strong> {selectedAsset.size || "N/A"}
                </p>
                <p>
                  <strong>Notes:</strong> {selectedAsset.notes || "N/A"}
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
                        <img key={index} src={src} alt={`Asset ${index + 1}`} className="w-full h-auto rounded-lg shadow-md" />
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
          <button className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600" onClick={() => setDetailModal(false)}>
            Close
          </button>
        </Modal.Footer>
      </Modal>
      {bookModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <div className="flex justify-between items-center">
              <h2 className="text-blue-600 font-bold text-lg capitalize">{selectedAsset.asset_name}</h2>
              <button onClick={() => setBookModal(false)}>Exit</button>
            </div>
            <label className="block mt-4 font-medium">Set</label>
            <div className="flex items-center mt-1">
              <button className="px-3 py-1 border rounded-l bg-gray-200" onClick={() => setQty(qty > 0 ? qty - 1 : 0)}>
                -
              </button>
              <span className="px-4 border-t border-b">{qty}</span>
              <button className="px-3 py-1 border rounded-r bg-gray-200" onClick={() => setQty(qty < avlbl ? qty + 1 : avlbl)}>
                +
              </button>
            </div>
            {attachedContract && (
              <>
                <h1 className="font-bold">Selected Contract</h1>
                <ContractTable
                  code={attachedContract.SalesOrderCode || "N/A"}
                  reference={attachedContract.ReferenceNo || "N/A"}
                  orderDate={attachedContract.SalesOrderDate || "N/A"}
                  projDesc={attachedContract.ProjectDesc || "N/A"}
                  dateStart={attachedContract.DateRef1 || "N/A"}
                  dateEnd={attachedContract.DateRef2 || "N/A"}
                />
              </>
            )}
            <button onClick={bookTrain} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-full mt-4 w-full">
              Book
            </button>
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

            {/* Total Trains Calculation */}
            <label className="block mt-4 font-medium">
              Total Trains with {selectedAsset.asset_name}: {avlbl + ood + bkd}
            </label>

            {/* Set Available Quantity */}
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

            {/* Set Out of Order (Auto-Adjusts Available) */}
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

            <button onClick={updateTrain} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-full mt-4 w-full">
              Book
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
