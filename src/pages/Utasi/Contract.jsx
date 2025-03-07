import { useStations } from "~contexts/LRTContext";
import { format } from "date-fns";
import { Fragment, useEffect, useState } from "react";
import { AiFillEdit, AiOutlineCheck, AiOutlineClose } from "react-icons/ai";
import { Modal, Button } from "flowbite-react";
import LandingPage from "./LandingPage";
import { useLRTapi } from "~contexts/LRT.api";
const Contract = () => {
  const { queryContracts, setAttachedContract } = useStations();
  const { getContractFromAsset } = useLRTapi();
  const [editField, setEditField] = useState(null);
  const [editedDates, setEditedDates] = useState({});
  const [modal, setModal] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);
  const [contract, setContracts] = useState([]);

  const [selectAsset, setSelectAsset] = useState(null);
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
  const matchedContracts = contract ? contract.filter((c) => c.asset_sales_order_code === selectedContract?.SalesOrderCode) : [];

  useEffect(() => {
    const fetch = async () => {
      try {
        const contracts = await getContractFromAsset();
        setContracts(contracts.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetch();
  }, [getContractFromAsset]);
  return (
    <>
      {selectAsset ? (
        <LandingPage
          backToContracts={() => {
            setSelectAsset(false), setAttachedContract(null);
          }}
        />
      ) : (
        <>
          <div className="p-4 bg-white rounded-lg container">
            <h2 className="text-xl font-bold text-blue-600 mb-4">Contracts</h2>
            <div className="overflow-x-auto">
              <table className="w-full table-auto border-collapse bg-white rounded-lg shadow-md">
                <thead className="text-gray-700">
                  <tr>
                    <th className="p-3 text-left font-bold">Code</th>
                    <th className="p-3 text-left font-bold">Start Date</th>
                    <th className="p-3 text-left font-bold">End Date</th>
                    <th className="p-3 text-left font-bold">Remarks</th>
                    <th className="p-3 text-left font-bold">Add/Tag Assets</th>
                  </tr>
                </thead>
                <tbody>
                  {queryContracts.map((contract, index) => (
                    <tr key={index} className={`hover:bg-gray-100 cursor-pointer ${selectedContract === contract ? "bg-blue-100" : ""}`}>
                      <td
                        className="p-3"
                        onClick={() => {
                          setModal(true);
                          setSelectedContract(contract);
                        }}
                      >
                        {contract.SalesOrderCode}
                      </td>
                      <td className="p-3 flex items-center">
                        {editField?.index === index && editField?.field === "DateRef1" ? (
                          <div className="relative group space-x-2">
                            <input
                              type="date"
                              value={editedDates[`${index}-DateRef1`] || format(new Date(contract.DateRef1), "yyyy-MM-dd")}
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
                      </td>
                      <td className="p-3">
                        {editField?.index === index && editField?.field === "DateRef2" ? (
                          <div className="relative group space-x-2">
                            <input
                              type="date"
                              value={editedDates[`${index}-DateRef2`] || format(new Date(contract.DateRef2), "yyyy-MM-dd")}
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
                      </td>
                      <td className="p-3">{contract.Remarks}</td>
                      <td
                        className="p-3 text-blue-500 cursor-pointer hover:underline"
                        onClick={() => {
                          setSelectAsset(true);
                          setAttachedContract(contract);
                        }}
                      >
                        Add/Tag Assets
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {selectedContract ? (
              <Modal show={modal} onClose={() => setModal(false)}>
                <Modal.Header>Contract Details - {selectedContract.SalesOrderCode || "N/A"}</Modal.Header>
                <Modal.Body>
                  <div className="space-y-4 text-gray-700 dark:text-gray-300">
                    <p>
                      <strong>Sales Order Date:</strong> {format(new Date(selectedContract.SalesOrderDate), "MMMM dd, yyyy") || "N/A"}
                    </p>
                    <p>
                      <strong>Total Amount:</strong> {selectedContract.TotalAmount ? `₱${Number(selectedContract.TotalAmount).toLocaleString()}` : "N/A"}
                    </p>
                    <p>
                      <strong>Project Code:</strong> {selectedContract.ProjectCode || "N/A"}
                    </p>
                    <p>
                      <strong>Project Description:</strong> {selectedContract.ProjectDesc || "N/A"}
                    </p>
                    <p>
                      <strong>Stock Name:</strong> {selectedContract.StockName || "N/A"}
                    </p>
                    <p>
                      <strong>Quantity:</strong> {selectedContract.Qty || "N/A"}
                    </p>
                    <p>
                      <strong>Unit Price:</strong> {selectedContract.unitprice ? `₱${Number(selectedContract.unitprice).toLocaleString()}` : "N/A"}
                    </p>
                    <p>
                      <strong>Net Amount:</strong> {selectedContract.NetAmount ? `₱${Number(selectedContract.NetAmount).toLocaleString()}` : "N/A"}
                    </p>
                  </div>
                  <div className="space-y-4 text-gray-700 dark:text-gray-300">
                    {matchedContracts.map((matchedContract) => (
                      <Fragment key={matchedContract.contract_id}>
                        <p className="capitalize">
                          <strong>Tagged Asset:</strong> {matchedContract.asset_name || "N/A"}
                        </p>
                      </Fragment>
                    ))}
                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <Button
                    onClick={() => {
                      setModal(false), setSelectedContract(null);
                    }}
                  >
                    Close
                  </Button>
                </Modal.Footer>
              </Modal>
            ) : (
              <></>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default Contract;
