import { useState, useEffect } from "react";
import { Table } from "flowbite-react";
import { FaTrash } from "react-icons/fa6";
import { useLRTapi } from "~contexts/LRT.api";
import { format } from "date-fns";
const ExpiredContracts = () => {
  const { unTagContract, updateParapetStatus, getContractFromAsset } = useLRTapi();
  const [deletingContractId, setDeletingContractId] = useState(null);
  const [contractFromAsset, setContractFromAsset] = useState([]);

  const refreshContract = async () => {
    const contracts = await getContractFromAsset();
    setContractFromAsset(contracts.data);
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to start of today

  const expiredContracts = contractFromAsset.filter((item) => {
    const endDate = new Date(item.asset_date_end);
    const adjustedEndDate = new Date(item.adjusted_end_date);
    const dateToUse = adjustedEndDate === null ? adjustedEndDate : endDate;
    return dateToUse < today;
  });
  const deleteContract = async (matchedContract, trainAssetId) => {
    const isConfirmed = window.confirm("Are you sure you want to untag this contract?");
    if (!isConfirmed) return;
    setDeletingContractId(matchedContract.contract_id);
    try {
      const result = await unTagContract(
        matchedContract.contract_id,
        matchedContract.backlit_id,
        trainAssetId,
        matchedContract.quantity
      );
      if (matchedContract.asset_id === 1) {
        await updateParapetStatus(matchedContract.station_id, matchedContract.asset_facing, 1, "AVAILABLE");
      }
      alert("Contract successfully untagged.");
      refreshContract();
      return result;
    } catch (error) {
      console.error("Error deleting contract:", error);
      alert("An error occurred while untagging the contract.");
    } finally {
      setDeletingContractId(null);
    }
  };
  useEffect(() => {
    refreshContract();
  }, []);
  return (
    <div className="p-4 bg-white rounded-lg container">
      <h2 className="text-xl font-bold mb-4">Expired Contracts</h2>
      <div className="overflow-x-auto flex flex-col mx-auto gap-3">
        <Table className="w-full table-auto border-collapse bg-white rounded-lg shadow-md">
          <Table.Head className="text-gray-700">
            <Table.HeadCell className="p-3 text-left font-bold">Sales Order Code</Table.HeadCell>
            <Table.HeadCell className="p-3 text-left font-bold">Asset</Table.HeadCell>
            <Table.HeadCell className="p-3 text-left font-bold">Brand Owner (ProjectCode)</Table.HeadCell>
            <Table.HeadCell className="p-3 text-left font-bold">Start Date</Table.HeadCell>
            <Table.HeadCell className="p-3 text-left font-bold">End Date</Table.HeadCell>
            <Table.HeadCell className="p-3 text-left font-bold">Actions</Table.HeadCell>
          </Table.Head>

          <Table.Body className="divide-y divide-gray-200">
            {expiredContracts.length > 0 ? (
              expiredContracts.map((item) => (
                <Table.Row key={item.contract_id} className="hover:bg-gray-50 even:bg-gray-50 transition">
                  <Table.Cell className="px-4 py-3">{item.asset_sales_order_code}</Table.Cell>
                  <Table.Cell className="px-4 py-3 capitalize">{item.asset_name}</Table.Cell>
                  <Table.Cell className="px-4 py-3 capitalize">{item.brand_owner}</Table.Cell>

                  <Table.Cell className="px-4 py-3">
                    {item.asset_date_start && format(new Date(item.asset_date_start), "MMMM dd, yyyy")}
                  </Table.Cell>
                  <Table.Cell className="px-4 py-3">
                    {/* {contract.DateRef1 ? format(new Date(contract.DateRef1), "MMMM dd, yyyy") : "N/A"} */}

                    {item.adjusted_end_date
                      ? format(new Date(item.adjusted_end_date), "MMMM dd, yyyy")
                      : format(new Date(item.asset_date_end), "MMMM dd, yyyy")}
                  </Table.Cell>
                  <Table.Cell className="px-4 py-3">
                    <button
                      className="text-red-500"
                      onClick={() => {
                        const trainAssetId = item.asset_id >= 3 && item.asset_id <= 7 ? item.asset_id : null;
                        deleteContract(item, trainAssetId);
                      }}
                    >
                      {deletingContractId === item.contract_id ? "Untagging..." : <FaTrash />}
                    </button>
                  </Table.Cell>
                </Table.Row>
              ))
            ) : (
              <Table.Row>
                <Table.Cell colSpan={4} className="text-center py-4 text-gray-500">
                  No expired contracts with tagged asset found.
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </div>
    </div>
  );
};

export default ExpiredContracts;
