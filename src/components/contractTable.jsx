import { format } from "date-fns";
import PropTypes from "prop-types";
import { AiFillEdit, AiOutlineCheck, AiOutlineClose } from "react-icons/ai";
import { useState } from "react";
import { useStations } from "~contexts/LRTContext";
import { useLRTapi } from "~contexts/LRT.api";
import { Table } from "flowbite-react";

const ContractTable = ({
  selectedContract,
  station,
  station_id,
  setIsModalOpen,
  asset_id,
  sbNeedsTag,
  nbNeedsTag,
  matchedContract,
  selectedBacklit,
  selectedTB,
  selectedStairs,
  qty,
  avlbl,
  setTrainAssets,
  setQty,
  viaduct_id,
  setSelectedViaduct,
  setExternalAssetSpecs,
  setAssetContracts,
  pillar_id,
}) => {
  const [editField, setEditField] = useState(null);
  const [editedDates, setEditedDates] = useState({});
  const { attachContract, updateParapetStatus, trainAssetBook, getExternalAssetSpecs, getContractFromAsset } =
    useLRTapi();
  const { attachedContract, updateAsset } = useStations();
  const [bound, setBound] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDateChange = (index, field, value) => {
    setEditedDates((prev) => ({
      ...prev,
      [`${index}-${field}`]: value,
    }));
  };
  const saveDate = (index, field) => {
    console.log(`Saving ${field}:`, editedDates[`${index}-${field}`]);
    setEditField(null);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const confirm = window.confirm("Are you sure you want to attach this contract?");
    if (!confirm) return;
    setLoading(true);
    try {
      if (asset_id === 1) {
        const contractData = {
          assetSalesOrderCode: selectedContract?.SalesOrderCode ?? "",
          assetDateStart: editedDates[`${0}-DateRef1`] ?? selectedContract?.DateRef1,
          assetDateEnd: editedDates[`${0}-DateRef2`] ?? selectedContract?.DateRef2,
          stationId: station?.station_id ?? "",
          assetId: 1,
          assetFacing: bound,
        };
        const response = await attachContract(contractData);
        const response2 = await updateParapetStatus(station?.station_id, bound, 1, "TAKEN");
        console.log("Contract attached successfully:", response, response2);
      }
      alert("Contract attached successfully.");
    } catch (error) {
      console.error("Failed to attach contract:", error);
      alert("Failed to attach contract. Please try again.");
    } finally {
      setIsModalOpen(false);
      setLoading(false);
    }
  };
  const bookBackLit = async () => {
    if (!selectedBacklit) return;
    setLoading(true);
    try {
      await updateAsset(selectedBacklit.asset_id, {
        asset_status: "TAKEN",
      });
      const contractData = {
        assetSalesOrderCode: selectedContract.SalesOrderCode,
        assetDateStart: editedDates[`${0}-DateRef1`] ?? selectedContract?.DateRef1,
        assetDateEnd: editedDates[`${0}-DateRef2`] ?? selectedContract?.DateRef2,
        stationId: station_id,
        assetId: 2,
        assetFacing: selectedBacklit.asset_distinction.includes("SB") ? "SB" : "NB",
        backlitId: selectedBacklit.asset_id,
      };
      await attachContract(contractData);
      alert("Updated successfully!");
    } catch (error) {
      console.error("Error updating asset:", error);
      alert("Failed to update asset.");
    } finally {
      setLoading(false);
    }
  };
  const bookTicketBooth = async () => {
    if (!selectedTB) return;
    setLoading(true);
    try {
      await updateAsset(selectedTB.asset_id, {
        asset_status: "TAKEN",
      });
      const contractData = {
        assetSalesOrderCode: selectedContract.SalesOrderCode,
        assetDateStart: editedDates[`${0}-DateRef1`] ?? selectedContract?.DateRef1,
        assetDateEnd: editedDates[`${0}-DateRef2`] ?? selectedContract?.DateRef2,
        stationId: station_id,
        assetId: 10,
        assetFacing: selectedTB.asset_distinction.includes("SB") ? "SB" : "NB",
        ticketBoothId: selectedTB.asset_id,
      };
      await attachContract(contractData);
      alert("Updated successfully!");
    } catch (error) {
      console.error("Error updating asset:", error);
      alert("Failed to update asset.");
    } finally {
      setLoading(false);
    }
  };
  const bookStairs = async () => {
    if (!selectedStairs) return;
    setLoading(true);
    try {
      await updateAsset(selectedStairs.asset_id, {
        asset_status: "TAKEN",
      });
      const contractData = {
        assetSalesOrderCode: selectedContract.SalesOrderCode,
        assetDateStart: editedDates[`${0}-DateRef1`] ?? selectedContract?.DateRef1,
        assetDateEnd: editedDates[`${0}-DateRef2`] ?? selectedContract?.DateRef2,
        stationId: station_id,
        assetId: 11,
        stairsId: selectedStairs.asset_id,
      };
      await attachContract(contractData);
      alert("Updated successfully!");
    } catch (error) {
      console.error("Error updating asset:", error);
      alert("Failed to update asset.");
    } finally {
      setLoading(false);
    }
  };
  const bookTrain = async (e) => {
    e.preventDefault();
    if (qty <= 0 || qty > avlbl) {
      alert(`Invalid quantity! Must be between 1 and ${avlbl}.`);
      return;
    }
    const confirmed = window.confirm(`Confirm booking ${qty} asset(s)?`);
    if (!confirmed) return;
    try {
      const contractData = {
        assetSalesOrderCode: selectedContract.SalesOrderCode,
        assetDateStart: editedDates[`${0}-DateRef1`] ?? selectedContract?.DateRef1,
        assetDateEnd: editedDates[`${0}-DateRef2`] ?? selectedContract?.DateRef2,
        assetId: asset_id,
        quantity: qty,
      };
      const response2 = await attachContract(contractData);
      if (response2) {
        const response = await trainAssetBook(asset_id, qty);
        console.log("Train asset updated:", response);
      }
      console.log("Booking successful:", response2);

      setTrainAssets((prev) =>
        prev.map((asset) =>
          asset.asset_id === asset_id
            ? { ...asset, booked: asset.booked + qty, available: asset.available - qty }
            : asset
        )
      );
    } catch (error) {
      console.error("Booking failed:", error);
      alert("Booking failed. Please try again.");
    } finally {
      setIsModalOpen(false);
      setQty(0);
    }
  };
  const bookViaduct = async () => {
    const isConfirmed = window.confirm("Are you sure you want to book this viaduct?");
    if (!isConfirmed) return;

    setLoading(true);
    try {
      const contractData = {
        assetSalesOrderCode: selectedContract.SalesOrderCode,
        assetDateStart: editedDates[`${0}-DateRef1`] ?? selectedContract?.DateRef1,
        assetDateEnd: editedDates[`${0}-DateRef2`] ?? selectedContract?.DateRef2,
        assetId: asset_id,
        viaductId: viaduct_id,
      };

      const response = await attachContract(contractData);
      alert(response.message || "Booking successful!");
    } catch (error) {
      console.error("Booking failed:", error);
      alert("Booking failed. Please try again.");
    } finally {
      setLoading(false);
      setIsModalOpen(false);
      setSelectedViaduct(null);

      // Refresh external assets and contract data
      const data = await getExternalAssetSpecs(8);
      setExternalAssetSpecs(data.data);
      const assetContract = await getContractFromAsset();
      setAssetContracts(assetContract.data);
    }
  };
  const bookPillar = async () => {
    const confirmed = window.confirm("Are you sure you want to book this pillar?");
    if (!confirmed) return;
    try {
      const contractData = {
        assetSalesOrderCode: selectedContract.SalesOrderCode,
        assetDateStart: editedDates[`${0}-DateRef1`] ?? selectedContract?.DateRef1,
        assetDateEnd: editedDates[`${0}-DateRef2`] ?? selectedContract?.DateRef2,
        assetId: asset_id,
        pillarId: pillar_id,
      };
      const response = await attachContract(contractData);
      console.log("Booking successful:", response);
      window.alert("Pillar successfully booked.");
    } catch (error) {
      console.error("Booking failed:", error);
      window.alert("Booking failed. Please try again.");
    } finally {
      setIsModalOpen(false);
    }
  };
  return (
    <div>
      {asset_id === 1 && (
        <>
          <h2 className="text-lg font-bold mb-4">Choose a bound?</h2>
          {sbNeedsTag && (
            <div className="flex items-center gap-1">
              <input type="radio" id="sb" name="bound" value="SB" onChange={() => setBound("SB")} />
              <label htmlFor="sb">{station?.station_name} South Bound</label>
            </div>
          )}
          {nbNeedsTag && (
            <div className="flex items-center gap-1">
              <input type="radio" id="nb" name="bound" value="NB" onChange={() => setBound("NB")} />
              <label htmlFor="nb">{station?.station_name} North Bound</label>
            </div>
          )}
          <br />
        </>
      )}

      <h1 className="font-bold">Selected Contract</h1>
      <Table className="border border-gray-300 w-full text-sm">
        <Table.Body>
          <Table.Row>
            <Table.Cell className="border px-4 py-2 font-medium">Sales Order Code:</Table.Cell>
            <Table.Cell className="border px-4 py-2">{selectedContract.SalesOrderCode || "N/A"}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell className="border px-4 py-2 font-medium">Reference No:</Table.Cell>
            <Table.Cell className="border px-4 py-2">{selectedContract.ReferenceNo || "N/A"}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell className="border px-4 py-2 font-medium">Sales Order Date:</Table.Cell>
            <Table.Cell className="border px-4 py-2">
              {format(new Date(selectedContract.SalesOrderDate), "MMMM dd, yyyy") || "N/A"}
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell className="border px-4 py-2 font-medium">Project Description:</Table.Cell>
            <Table.Cell className="border px-4 py-2">{selectedContract.ProjectDesc || "N/A"}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell className="border px-4 py-2 font-medium">Start Date:</Table.Cell>
            <Table.Cell className="border px-4 py-2">
              {editField?.field === "DateRef1" ? (
                <div className="relative group space-x-2 flex">
                  <input
                    type="date"
                    value={editedDates[`0-DateRef1`] || format(new Date(selectedContract.DateRef1), "yyyy-MM-dd")}
                    onChange={(e) => handleDateChange(0, "DateRef1", e.target.value)}
                  />
                  {/* <Datepicker
                    value={editedDates[`0-DateRef1`] || format(new Date(selectedContract.DateRef1), "yyyy-MM-dd")}
                    onSelectedDateChanged={(date) => handleDateChange(0, "DateRef1", format(date, "yyyy-MM-dd"))}
                    defaultDate={new Date(selectedContract.DateRef1)}
                  /> */}
                  <button type="button" onClick={() => saveDate(0, "DateRef1")}>
                    <AiOutlineCheck className="text-lg" />
                  </button>
                  <button type="button" onClick={() => setEditField(null)}>
                    <AiOutlineClose className="text-lg" />
                  </button>
                </div>
              ) : (
                <div>
                  {editedDates[`${0}-DateRef1`]
                    ? format(new Date(editedDates[`${0}-DateRef1`]), "MMMM dd, yyyy")
                    : selectedContract.DateRef1
                    ? format(new Date(selectedContract.DateRef1), "MMMM dd, yyyy")
                    : "N/A"}

                  <button type="button" onClick={() => setEditField({ index: 0, field: "DateRef1" })}>
                    <AiFillEdit />
                  </button>
                </div>
              )}
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell className="border px-4 py-2 font-medium">End Date (Available after):</Table.Cell>
            <Table.Cell className="border px-4 py-2">
              {editField?.field === "DateRef2" ? (
                <div className="relative group space-x-2">
                  <input
                    type="date"
                    value={editedDates[`0-DateRef2`] || format(new Date(selectedContract.DateRef2), "yyyy-MM-dd")}
                    onChange={(e) => handleDateChange(0, "DateRef2", e.target.value)}
                  />
                  <button type="button" onClick={() => saveDate(0, "DateRef2")}>
                    <AiOutlineCheck className="text-lg" />
                  </button>
                  <button type="button" onClick={() => setEditField(null)}>
                    <AiOutlineClose className="text-lg" />
                  </button>
                </div>
              ) : (
                <>
                  {editedDates[`${0}-DateRef2`]
                    ? format(new Date(editedDates[`${0}-DateRef2`]), "MMMM dd, yyyy")
                    : selectedContract.DateRef2
                    ? format(new Date(selectedContract.DateRef2), "MMMM dd, yyyy")
                    : "N/A"}
                  <button type="button" onClick={() => setEditField({ index: 0, field: "DateRef2" })}>
                    <AiFillEdit />
                  </button>
                </>
              )}
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
      {/* Close Modal Button */}
      <div className={`mt-4 flex ${selectedContract ? "justify-between" : "justify-end"}`}>
        {asset_id === 1 && selectedContract && (
          <button
            disabled={!bound || loading}
            onClick={handleSubmit}
            className={`px-4 py-2 rounded-lg text-white transition-colors ${
              !bound ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"
            }`}
          >
            Parapet
          </button>
        )}

        {asset_id === 2 && !matchedContract && attachedContract && (
          <button
            onClick={bookBackLit}
            disabled={loading}
            className="px-4 py-2 bg-green-500 text-white rounded disabled:bg-gray-400"
          >
            {loading ? "Tagging..." : "Confirm"}
          </button>
        )}
        {[3, 4, 5, 6, 7].includes(asset_id) && (
          <button onClick={bookTrain} className="px-4 py-2 bg-green-500 text-white rounded disabled:bg-gray-400">
            Book
          </button>
        )}

        {asset_id === 8 && (
          <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-700" onClick={bookViaduct}>
            {loading ? "Tagging..." : "Confirm"}
          </button>
        )}
        {asset_id === 9 && (
          <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-700" onClick={bookPillar}>
            Confirm
          </button>
        )}
        {asset_id === 10 && !matchedContract && attachedContract && (
          <button
            onClick={bookTicketBooth}
            disabled={loading}
            className="px-4 py-2 bg-green-500 text-white rounded disabled:bg-gray-400"
          >
            {loading ? "Tagging..." : "Confirm"}
          </button>
        )}
        {asset_id === 11 && !matchedContract && attachedContract && (
          <button
            onClick={bookStairs}
            disabled={loading}
            className="px-4 py-2 bg-green-500 text-white rounded disabled:bg-gray-400"
          >
            {loading ? "Tagging..." : "Confirm"}
          </button>
        )}
        <button
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          onClick={() => {
            setIsModalOpen(false);
            setBound("");
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
};

ContractTable.propTypes = {
  selectedContract: PropTypes.object,
  station: PropTypes.object,
  station_id: PropTypes.number,
  setIsModalOpen: PropTypes.func,
  asset_id: PropTypes.number,
  sbNeedsTag: PropTypes.bool,
  nbNeedsTag: PropTypes.bool,
  matchedContract: PropTypes.bool,
  selectedBacklit: PropTypes.object,
  selectedTB: PropTypes.object,
  selectedStairs: PropTypes.object,
  qty: PropTypes.number,
  avlbl: PropTypes.number,
  setTrainAssets: PropTypes.func,
  setQty: PropTypes.func,
  viaduct_id: PropTypes.number,
  setSelectedViaduct: PropTypes.func,
  setExternalAssetSpecs: PropTypes.func,
  setAssetContracts: PropTypes.func,
  pillar_id: PropTypes.number,
};
export default ContractTable;
