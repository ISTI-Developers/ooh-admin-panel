import { useState, useEffect } from "react";
import { Table, Select } from "flowbite-react";
import { Datepicker } from "flowbite-react";
import { useLRTapi } from "~contexts/LRT.api";
import { useStations } from "~contexts/LRTContext";
import Pagination from "~components/Pagination";
import { parse, isAfter, isBefore } from "date-fns";

const AssetAvailability = () => {
  // 1. Utilities
  const formatDate = (isoDate) => {
    return new Date(isoDate).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // 2. Custom Hooks
  const { retrieveParapetsAvailability, retrieveBacklitsAvailability } = useLRTapi();
  const { pillars, queryExternalAssets, queryAssetContracts } = useStations();

  // 3. State Initialization
  const today = new Date();
  const [fromDate, setFromDate] = useState(formatDate(today));
  const [toDate, setToDate] = useState(formatDate(today));

  const [selectedAsset, setSelectedAsset] = useState("parapets");
  const [parapets, setParapets] = useState([]);
  const [backlits, setBacklits] = useState([]);

  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // 4. Derived Data
  const parsedFromDate = parse(fromDate, "MMMM d, yyyy", new Date());
  const parsedToDate = parse(toDate, "MMMM d, yyyy", new Date());

  const enrichedExternalAssets = queryExternalAssets.map((asset) => {
    const relatedContracts = queryAssetContracts.filter((contract) => contract.viaduct_id === asset.id);

    return {
      ...asset,
      contracts: relatedContracts, // an array of matching contracts
    };
  });
  const dataToPaginate =
    selectedAsset === "backlits"
      ? backlits
      : selectedAsset === "parapets"
      ? parapets
      : selectedAsset === "viaducts"
      ? enrichedExternalAssets
      : selectedAsset === "pillars"
      ? pillars
      : [];

  const filteredData = dataToPaginate.filter((item) => {
    const endDate = item.contracts?.[0]?.asset_date_end;
    if (!endDate) return true; // If no contract, it's available now, include it

    const contractEndDate = new Date(endDate);
    return isAfter(contractEndDate, parsedFromDate) && isBefore(contractEndDate, parsedToDate);
  });

  const getPaginatedData = (data) => {
    const start = (currentPage - 1) * itemsPerPage;
    return data.slice(start, start + itemsPerPage);
  };

  const paginatedData = getPaginatedData(filteredData);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // 5. Effect Hook
  useEffect(() => {
    const fetchParapets = async () => {
      const parapetRes = await retrieveParapetsAvailability();
      setParapets(parapetRes.data);

      const backlitRes = await retrieveBacklitsAvailability();
      setBacklits(backlitRes.data);
    };
    fetchParapets();
  }, []);

  return (
    <div className="container flex flex-col mx-auto gap-3">
      <div>
        Availability
        <div className="flex">
          <div>
            From:
            <Datepicker
              value={fromDate}
              minDate={today}
              onSelectedDateChanged={(date) => {
                const formatted = formatDate(date);
                setFromDate(formatted);
                if (date > new Date(toDate)) {
                  setToDate(formatted);
                }
              }}
            />
          </div>
          <div>
            To:
            <Datepicker
              value={toDate}
              minDate={new Date(fromDate)}
              onSelectedDateChanged={(date) => {
                setToDate(formatDate(date));
              }}
            />
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => {
            setSelectedAsset("parapets"), setCurrentPage(1);
          }}
          className={`px-4 py-2 rounded ${selectedAsset === "parapets" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          Parapets
        </button>
        <button
          onClick={() => {
            setSelectedAsset("backlits"), setCurrentPage(1);
          }}
          className={`px-4 py-2 rounded ${selectedAsset === "backlits" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          Backlits
        </button>
        <button
          onClick={() => {
            setSelectedAsset("viaducts"), setCurrentPage(1);
          }}
          className={`px-4 py-2 rounded ${selectedAsset === "viaducts" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          Viaducts
        </button>
        <button
          onClick={() => {
            setSelectedAsset("pillars"), setCurrentPage(1);
          }}
          className={`px-4 py-2 rounded ${selectedAsset === "pillars" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          Pillars
        </button>
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

        <div className="flex items-center gap-2">
          <label htmlFor="limit" className="text-sm">
            Rows per page:
          </label>
          <Select
            id="limit"
            className="px-2 py-1 text-sm"
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
          </Select>
        </div>
      </div>
      {dataToPaginate ? (
        <Table className="table-fixed w-full">
          <Table.Head>
            <Table.HeadCell className="text-center">
              {selectedAsset === "viaducts" ? "Viaduct Name" : selectedAsset === "pillars" ? "Pillar Name" : "Station"}
            </Table.HeadCell>
            <Table.HeadCell className="text-center">Asset</Table.HeadCell>
            <Table.HeadCell className="text-center">Facing</Table.HeadCell>
            <Table.HeadCell className="text-center">Available After</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {paginatedData.map((data, index) => (
              <Table.Row
                key={index}
                className="bg-white dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                <Table.Cell className="text-center">
                  {selectedAsset === "viaducts" || selectedAsset === "pillars"
                    ? data.viaduct_name
                    : data.station_name || data.viaduct_name}
                </Table.Cell>
                <Table.Cell className="capitalize text-center">
                  {data.asset_name ? `${data.asset_name}s` : data.asset_type}
                </Table.Cell>
                <Table.Cell className="text-center">
                  {selectedAsset === "parapets"
                    ? data.asset_prefix === "NB"
                      ? "North Bound"
                      : "South Bound"
                    : data.asset_distinction || data.asset_direction}
                </Table.Cell>
                <Table.Cell className="text-center">
                  {data.contracts && data.contracts.length > 0
                    ? formatDate(data.contracts[0]?.asset_date_end)
                    : "Available Now"}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      ) : (
        <span className="sr-only">Loading...</span>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

        <div className="flex items-center gap-2">
          <label htmlFor="limit" className="text-sm">
            Rows per page:
          </label>
          <Select
            id="limit"
            className="px-2 py-1 text-sm"
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default AssetAvailability;
