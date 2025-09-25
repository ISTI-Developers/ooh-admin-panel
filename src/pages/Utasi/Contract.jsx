import { useEffect, useState, useMemo } from "react";
import { parseISO, format } from "date-fns";
import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";
import { Button, Table, TextInput } from "flowbite-react";
import ContractDetailsModal from "~components/ContractDetailsModal";
import Pagination from "~components/Pagination";
import { useLRTapi } from "~contexts/LRT.api";
import { useStations } from "~contexts/LRTContext";
import LandingPage from "./LandingPage";
import { SWS, NWS, SES, NES, SBS, NBS } from "./utasi.const";

const Contract = () => {
  const {
    setAttachedContract,
    pillars,
    contracts,
    fetchContracts,
    pagination,
    queryAllStationsData,
    setPagination,
    updateParapetStatus,
  } = useStations();
  const { getContractFromAsset, unTagContract, updateExternal, getExternalAssetSpecs } = useLRTapi();
  const [editField, setEditField] = useState(null);
  const [editedDates, setEditedDates] = useState({});
  const [modal, setModal] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);
  const [externalAssetSpecs, setExternalAssetSpecs] = useState([]);

  const [contractFromAsset, setContractFromAsset] = useState([]);
  const [selectAsset, setSelectAsset] = useState(null);
  const [deletingContractId, setDeletingContractId] = useState(null);
  const [search, setSearch] = useState("");

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const deleteContract = async (matchedContract, trainAssetId) => {
    const isConfirmed = window.confirm("Are you sure you want to untag this contract?");
    if (!isConfirmed) return;
    setDeletingContractId(matchedContract.contract_id);
    try {
      const result = await unTagContract(
        matchedContract.contract_id,
        matchedContract.backlit_id,
        matchedContract.ticketbooth_id,
        matchedContract.stairs_id,
        trainAssetId,
        matchedContract.quantity
      );
      if (matchedContract.asset_id === 1) {
        await updateParapetStatus(matchedContract.station_id, matchedContract.asset_facing, 1, "AVAILABLE");
      }
      if (matchedContract.asset_id === 8) {
        await updateExternal(matchedContract.viaduct_id, 0, null);
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

  const matchedContracts = contractFromAsset
    ? contractFromAsset.filter((c) => c.asset_sales_order_code === selectedContract?.SalesOrderCode)
    : [];

  const refreshContract = async () => {
    const contracts = await getContractFromAsset();
    setContractFromAsset(contracts.data);
  };

  const filteredContracts = useMemo(() => {
    if (!search.trim()) return contracts;

    return contracts.filter((contract) =>
      Object.values(contract).some((val) => String(val).toLowerCase().includes(search.toLowerCase()))
    );
  }, [contracts, search]);

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

  useEffect(() => {
    fetchContracts(pagination.page, pagination.limit, search);
    refreshContract();
  }, [pagination.page, search]);

  // 5. Effects
  useEffect(() => {
    const fetchExternal = async () => {
      const data = await getExternalAssetSpecs(8);
      setExternalAssetSpecs(data.data);
    };
    fetchExternal();
  }, []);
  return (
    <>
      {selectAsset ? (
        <LandingPage
          backToContracts={() => {
            setSelectAsset(false), setAttachedContract(null), refreshContract();
          }}
        />
      ) : (
        <>
          <div className="p-4 bg-white rounded-lg container">
            <h2 className="text-xl font-bold mb-4">Contracts</h2>
            <div className="overflow-x-auto flex flex-col mx-auto gap-3">
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                itemsPerPage={pagination.limit}
                setItemsPerPage={(limit) => {
                  setPagination((prev) => ({ ...prev, page: 1, limit }));
                  fetchContracts(1, limit); // reset to page 1 when rows per page changes
                }}
                onPageChange={(page) => {
                  setPagination((prev) => ({ ...prev, page }));
                  fetchContracts(page, pagination.limit);
                }}
                totalCount={pagination.totalCount}
              />
              <div className="flex items-center gap-2 opacity-60">
                <label htmlFor="search" className="text-sm font-medium">
                  Search:
                </label>
                <TextInput
                  id="search"
                  type="text"
                  placeholder="Type to search..."
                  sizing="sm"
                  className="w-64"
                  value={search}
                  onChange={handleSearch}
                />
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
                  {filteredContracts.map((contract, index) => {
                    const matchCount =
                      contractFromAsset?.filter((c) => c.asset_sales_order_code === contract.SalesOrderCode).length ||
                      0;
                    return (
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
                          <span className="ml-2 inline-block rounded-full bg-blue-100 text-blue-800 text-xs px-2 py-0.5 font-medium">
                            {matchCount}
                          </span>
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
                              {/* <button type="button" onClick={() => setEditField({ index, field: "DateRef1" })}>
                                <AiFillEdit />
                              </button> */}
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
                              {/* <button type="button" onClick={() => setEditField({ index, field: "DateRef2" })}>
                                <AiFillEdit />
                              </button> */}
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
                    );
                  })}
                </Table.Body>
              </Table>

              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                itemsPerPage={pagination.limit}
                setItemsPerPage={(limit) => {
                  setPagination((prev) => ({ ...prev, page: 1, limit }));
                  fetchContracts(1, limit); // reset to page 1 when rows per page changes
                }}
                onPageChange={(page) => {
                  setPagination((prev) => ({ ...prev, page }));
                  fetchContracts(page, pagination.limit);
                }}
                totalCount={pagination.totalCount}
              />
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
                  const asset = externalAssetSpecs?.find((a) => a.id === matchedContract.viaduct_id);
                  const pillar = pillars?.find((p) => p.id === matchedContract.pillar_id);
                  const stationWithBacklit = queryAllStationsData?.find((station) =>
                    station.backlits?.some((b) => b.asset_id === matchedContract.backlit_id)
                  );
                  const backlit = stationWithBacklit?.backlits?.find((b) => b.asset_id === matchedContract.backlit_id);
                  const stationWithParapets = queryAllStationsData?.find(
                    (a) => a.station_id === matchedContract.station_id
                  );

                  const stationWithTicketBooth = queryAllStationsData?.find((station) =>
                    station.ticketbooths?.some((b) => b.asset_id === matchedContract.ticketbooth_id)
                  );
                  const ticketBooth = stationWithTicketBooth?.ticketbooths?.find(
                    (b) => b.asset_id === matchedContract.ticketbooth_id
                  );

                  const stationWithStairs = queryAllStationsData?.find((station) =>
                    station.stairs?.some((b) => b.asset_id === matchedContract.stairs_id)
                  );
                  const stairs = stationWithStairs?.stairs?.find((b) => b.asset_id === matchedContract.stairs_id);
                  return (
                    <div className="flex justify-between items-center" key={matchedContract.contract_id}>
                      <div className="flex flex-col space-y-1">
                        {/* Tagged Asset and Quantity */}
                        <p className="capitalize">
                          <strong>Tagged Asset:</strong> {matchedContract.asset_name || "N/A"}
                          {matchedContract.quantity && (
                            <span className="ml-2 inline-block rounded-full bg-blue-100 text-blue-800 text-xs px-2 py-0.5 font-medium">
                              {matchedContract.quantity}
                            </span>
                          )}
                        </p>
                        {/* Station Name and Facing */}
                        {matchedContract.asset_name === "parapet" && (
                          <p className="capitalize">
                            {stationWithParapets.station_name}{" "}
                            {matchedContract.asset_facing === "SB"
                              ? "South Bound"
                              : matchedContract.asset_facing === "NB"
                              ? "North Bound"
                              : ""}
                          </p>
                        )}
                        {/* Generic Display Lines */}
                        {[asset?.viaduct_name, pillar?.viaduct_name, pillar?.asset_direction]
                          .filter(Boolean)
                          .map((line, idx) => (
                            <p key={idx} className="capitalize">
                              {line}
                            </p>
                          ))}
                        {/* Backlit Station Info */}
                        {(stationWithBacklit?.station_name || backlit?.asset_distinction) && (
                          <p className="capitalize">
                            {stationWithBacklit?.station_name || ""} {backlit?.asset_distinction || ""}
                          </p>
                        )}

                        {/* Ticketbooth Station Info */}
                        {(stationWithTicketBooth?.station_name || ticketBooth?.asset_distinction) && (
                          <p className="capitalize">
                            {stationWithTicketBooth?.station_name || ""} {ticketBooth?.asset_distinction || ""}
                          </p>
                        )}

                        {/* Stairs Station Info */}
                        {(stationWithStairs?.station_name || stairs?.asset_distinction) && (
                          <p className="capitalize">
                            {stationWithStairs?.station_name || ""}{" "}
                            {(() => {
                              const labels = { SWS, NWS, SES, NES, SBS, NBS };
                              const label = labels[stairs.asset_distinction];
                              return label || stairs.asset_direction || "Middle Stairs";
                            })()}
                          </p>
                        )}

                        {selectedContract?.DateRef1 &&
                          format(new Date(selectedContract.DateRef1), "yyyy-MM-dd") !==
                            format(new Date(matchedContract.asset_date_start), "yyyy-MM-dd") && (
                            <p className="capitalize text-gray-700 mb-2">
                              <strong>Adjusted Start Date:</strong>{" "}
                              {format(parseISO(matchedContract.asset_date_start), "MMMM dd, yyyy")}
                            </p>
                          )}
                        {selectedContract?.DateRef2 &&
                          format(new Date(selectedContract.DateRef2), "yyyy-MM-dd") !==
                            format(new Date(matchedContract.asset_date_end), "yyyy-MM-dd") && (
                            <p className="capitalize text-gray-700">
                              <strong>Adjusted End Date:</strong>{" "}
                              {format(parseISO(matchedContract.asset_date_end), "MMMM dd, yyyy")}
                            </p>
                          )}
                      </div>
                      <Button
                        color="red"
                        onClick={() => {
                          const trainAssetId =
                            matchedContract.asset_id >= 3 && matchedContract.asset_id <= 7
                              ? matchedContract.asset_id
                              : null;
                          deleteContract(matchedContract, trainAssetId);
                        }}
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
