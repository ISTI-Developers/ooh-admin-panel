import { useStations } from "~contexts/LRTContext";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { AiFillEdit, AiOutlineCheck, AiOutlineClose } from "react-icons/ai";
import { Button, Table, Select } from "flowbite-react";
import LandingPage from "./LandingPage";
import { useLRTapi } from "~contexts/LRT.api";
import ContractDetailsModal from "~components/ContractDetailsModal";
import Pagination from "~components/Pagination";
const Contract = () => {
  const { setAttachedContract, queryExternalAssets, pillars, contracts, fetchContracts, pagination } = useStations();
  const { getContractFromAsset, unTagContract } = useLRTapi();
  const [editField, setEditField] = useState(null);
  const [editedDates, setEditedDates] = useState({});
  const [modal, setModal] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);
  const [contractFromAsset, setContractFromAsset] = useState([]);
  const [selectAsset, setSelectAsset] = useState(null);
  const [deletingContractId, setDeletingContractId] = useState(null);

  const deleteContract = async (id) => {
    const isConfirmed = window.confirm("Are you sure you want to untag this contract?");
    if (!isConfirmed) return;
    setDeletingContractId(id);
    try {
      const result = await unTagContract(id);
      alert("Contract successfully untagged.");
      yeet();
      return result;
    } catch (error) {
      console.error("Error deleting contract:", error);
      alert("An error occurred while untagging the contract.");
    } finally {
      setDeletingContractId(null);
    }
  };

  const matchedContracts = contractFromAsset
    ? contractFromAsset.filter((c) => c.asset_sales_order_code === selectedContract?.SalesOrderCode)
    : [];

  const yeet = async () => {
    const contracts = await getContractFromAsset();
    setContractFromAsset(contracts.data);
  };
  useEffect(() => {
    fetchContracts(pagination.page, pagination.limit);
    const fetch = async () => {
      try {
        yeet();
      } catch (error) {
        console.error(error);
      }
    };
    fetch();
  }, [pagination.page]);

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
  return (
    <>
      {selectAsset ? (
        <LandingPage
          backToContracts={() => {
            setSelectAsset(false), setAttachedContract(null), yeet();
          }}
        />
      ) : (
        <>
          <div className="p-4 bg-white rounded-lg container">
            <h2 className="text-xl font-bold mb-4">Contracts</h2>
            <div className="overflow-x-auto">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-2">
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  onPageChange={(page) => fetchContracts(page, pagination.limit)}
                />

                <div className="flex items-center gap-2">
                  <label htmlFor="limit" className="text-sm">
                    Rows per page:
                  </label>
                  <Select
                    id="limit"
                    className="px-2 py-1 text-sm"
                    value={pagination.limit}
                    onChange={(e) => fetchContracts(1, Number(e.target.value))}
                  >
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                  </Select>
                </div>
              </div>
              <Table className="w-full table-auto border-collapse bg-white rounded-lg shadow-md">
                <Table.Head className="text-gray-700">
                  <Table.HeadCell className="p-3 text-left font-bold">Code</Table.HeadCell>
                  <Table.HeadCell className="p-3 text-left font-bold">Start Date</Table.HeadCell>
                  <Table.HeadCell className="p-3 text-left font-bold">End Date</Table.HeadCell>
                  <Table.HeadCell className="p-3 text-left font-bold">Remarks</Table.HeadCell>
                  <Table.HeadCell className="p-3 text-left font-bold">Add/Tag Assets</Table.HeadCell>
                </Table.Head>
                <Table.Body>
                  {contracts.map((contract, index) => (
                    <Table.Row
                      key={index}
                      className={`hover:bg-gray-100 cursor-pointer ${
                        selectedContract === contract ? "bg-blue-100" : ""
                      }`}
                    >
                      <Table.Cell
                        className="p-3"
                        onClick={() => {
                          setModal(true);
                          setSelectedContract(contract);
                        }}
                      >
                        {contract.SalesOrderCode}
                      </Table.Cell>
                      <Table.Cell className="p-3 flex items-center">
                        {editField?.index === index && editField?.field === "DateRef1" ? (
                          <div className="relative group space-x-2">
                            <input
                              type="date"
                              value={
                                editedDates[`${index}-DateRef1`] || format(new Date(contract.DateRef1), "yyyy-MM-dd")
                              }
                              onChange={(e) => handleDateChange(index, "DateRef1", e.target.value)}
                            />
                            <button type="button" onClick={() => saveDate(index, "DateRef1")}>
                              <AiOutlineCheck className="text-lg" />
                            </button>
                            <button type="button" onClick={() => setEditField(null)}>
                              <AiOutlineClose className="text-lg" />
                            </button>
                          </div>
                        ) : (
                          <>
                            {contract.DateRef1 ? format(new Date(contract.DateRef1), "MMMM dd, yyyy") : "N/A"}
                            <button type="button" onClick={() => setEditField({ index, field: "DateRef1" })}>
                              <AiFillEdit />
                            </button>
                          </>
                        )}
                      </Table.Cell>
                      <Table.Cell className="p-3">
                        {editField?.index === index && editField?.field === "DateRef2" ? (
                          <div className="relative group space-x-2">
                            <input
                              type="date"
                              value={
                                editedDates[`${index}-DateRef2`] || format(new Date(contract.DateRef2), "yyyy-MM-dd")
                              }
                              onChange={(e) => handleDateChange(index, "DateRef2", e.target.value)}
                            />
                            <button type="button" onClick={() => saveDate(index, "DateRef2")}>
                              <AiOutlineCheck className="text-lg" />
                            </button>
                            <button type="button" onClick={() => setEditField(null)}>
                              <AiOutlineClose className="text-lg" />
                            </button>
                          </div>
                        ) : (
                          <>
                            {contract.DateRef2 ? format(new Date(contract.DateRef2), "MMMM dd, yyyy") : "N/A"}
                            <button type="button" onClick={() => setEditField({ index, field: "DateRef2" })}>
                              <AiFillEdit />
                            </button>
                          </>
                        )}
                      </Table.Cell>
                      <Table.Cell className="p-3">{contract.Remarks}</Table.Cell>
                      <Table.Cell
                        className="p-3 text-blue-500 cursor-pointer hover:underline"
                        onClick={() => {
                          setSelectAsset(true);
                          setAttachedContract(contract);
                        }}
                      >
                        Add/Tag Assets
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-2">
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  onPageChange={(page) => fetchContracts(page, pagination.limit)}
                />

                <div className="flex items-center gap-2">
                  <label htmlFor="limit" className="text-sm">
                    Rows per page:
                  </label>
                  <Select
                    id="limit"
                    className="px-2 py-1 text-sm"
                    value={pagination.limit}
                    onChange={(e) => fetchContracts(1, Number(e.target.value))}
                  >
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                  </Select>
                </div>
              </div>
            </div>
            <ContractDetailsModal
              open={modal}
              onClose={() => {
                setModal(false);
                setSelectedContract(null);
              }}
              contract={selectedContract}
            >
              <div className="space-y-4 text-gray-700 mt-3 dark:text-gray-300">
                {matchedContracts.map((matchedContract) => {
                  const asset = queryExternalAssets?.find((a) => a.id === matchedContract.viaduct_id);
                  const pillar = pillars?.find((p) => p.id === matchedContract.pillar_id);
                  return (
                    <div className="flex justify-between items-center" key={matchedContract.contract_id}>
                      <div className="flex flex-col">
                        <p className="capitalize">
                          <strong>Tagged Asset:</strong> {matchedContract.asset_name || "N/A"}
                        </p>
                        <p className="capitalize">{asset?.viaduct_name || ""}</p>
                        <p className="capitalize">{pillar?.viaduct_name || ""}</p>
                        <p className="capitalize">{pillar?.asset_direction || ""}</p>
                      </div>
                      <Button
                        color="red"
                        onClick={() => deleteContract(matchedContract.contract_id)}
                        disabled={deletingContractId === matchedContract.contract_id}
                        className="text-sm font-medium text-white bg-red-600 rounded-lg transition"
                      >
                        {deletingContractId === matchedContract.contract_id ? "Untagging..." : "Untag Asset"}
                      </Button>
                    </div>
                  );
                })}
              </div>
            </ContractDetailsModal>
          </div>
        </>
      )}
    </>
  );
};

export default Contract;
