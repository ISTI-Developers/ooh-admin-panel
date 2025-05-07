import { useState, useEffect, useMemo } from "react";
import { Table, Select } from "flowbite-react";
import { Datepicker } from "flowbite-react";
import { parse, isAfter, isBefore, format, addYears } from "date-fns";
import { useLRTapi } from "~contexts/LRT.api";
import { useStations } from "~contexts/LRTContext";
import Pagination from "~components/Pagination";
import { TextInput } from "flowbite-react";

const AssetAvailability = () => {
  // 1. Utilities
  const formatDate = (isoDate) => {
    return format(new Date(isoDate), "MMMM dd, yyyy");
  };
  // 2. Custom Hooks
  const { retrieveParapetsAvailability, retrieveBacklitsAvailability, getTrainAssets } = useLRTapi();
  const { pillars, queryExternalAssets, queryAssetContracts } = useStations();
  // 3. State Initialization
  const today = new Date();
  const oneYearFromToday = addYears(today, 1);
  const [fromDate, setFromDate] = useState(formatDate(today));
  const [toDate, setToDate] = useState(formatDate(oneYearFromToday));
  const [selectedAsset, setSelectedAsset] = useState("parapets");
  const [parapets, setParapets] = useState([]);
  const [backlits, setBacklits] = useState([]);
  const [trainAssets, setTrainAssets] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");

  // 4. Derived Data
  const parsedFromDate = parse(fromDate, "MMMM d, yyyy", new Date());
  const parsedToDate = parse(toDate, "MMMM d, yyyy", new Date());
  // const enrichAssetsWithContracts = (assets, assetKey, contractKey) => {
  //   return assets.map((asset) => {
  //     const relatedContracts = queryAssetContracts.filter((contract) => contract[contractKey] === asset[assetKey]);
  //     return {
  //       ...asset,
  //       contracts: relatedContracts,
  //     };
  //   });
  // };
  // const enrichAssetsWithContracts1 = (assets, contracts) => {
  //   return assets.map((asset) => {
  //     const relatedContracts = contracts.filter(
  //       (contract) =>
  //         contract.station_id === asset.station_id &&
  //         contract.asset_id === asset.asset_id &&
  //         contract.asset_facing === asset.asset_prefix
  //     );

  //     return {
  //       ...asset,
  //       contracts: relatedContracts,
  //     };
  //   });
  // };
  const enrichAssetsWithContracts = (assets, contracts, matchKeys) => {
    return assets.map((asset) => {
      const relatedContracts = contracts.filter((contract) =>
        matchKeys.every(({ assetKey, contractKey }) => contract[contractKey] === asset[assetKey])
      );
      return {
        ...asset,
        contracts: relatedContracts,
      };
    });
  };

  // const enrichedTrain = enrichAssetsWithContracts(trainAssets, "asset_id", "asset_id");
  // const enrichedParapets = enrichAssetsWithContracts1(parapets, queryAssetContracts);
  // const enrichedBacklits = enrichAssetsWithContracts(backlits, "id", "backlit_id");
  // const enrichedExternalAssets = enrichAssetsWithContracts(queryExternalAssets, "id", "viaduct_id");
  // const enrichedPillars = enrichAssetsWithContracts(pillars, "id", "pillar_id");
  const enrichedTrain = enrichAssetsWithContracts(trainAssets, queryAssetContracts, [
    { assetKey: "asset_id", contractKey: "asset_id" },
  ]);

  const enrichedParapets = enrichAssetsWithContracts(parapets, queryAssetContracts, [
    { assetKey: "station_id", contractKey: "station_id" },
    { assetKey: "asset_id", contractKey: "asset_id" },
    { assetKey: "asset_prefix", contractKey: "asset_facing" },
  ]);

  const enrichedBacklits = enrichAssetsWithContracts(backlits, queryAssetContracts, [
    { assetKey: "id", contractKey: "backlit_id" },
  ]);

  const enrichedExternalAssets = enrichAssetsWithContracts(queryExternalAssets, queryAssetContracts, [
    { assetKey: "id", contractKey: "viaduct_id" },
  ]);

  const enrichedPillars = enrichAssetsWithContracts(pillars, queryAssetContracts, [
    { assetKey: "id", contractKey: "pillar_id" },
  ]);

  const trainAssetNames = enrichedTrain.map((item) => item.asset_name.replace(/[\s-]+/g, ""));
  const assetMap = useMemo(
    () => ({
      parapets: {
        name: "Parapets",
        data: enrichedParapets,
      },
      backlits: {
        name: "Backlits",
        data: enrichedBacklits,
      },
      viaducts: {
        name: "Viaducts",
        data: enrichedExternalAssets,
      },
      pillars: {
        name: "Pillars",
        data: enrichedPillars,
      },
      overheadpanels: {
        name: "Overhead Panels",
        data: [enrichedTrain[0]],
      },
      seatdividersticker: {
        name: "Seat Divider Sticker",
        data: [enrichedTrain[1]],
      },
      twoseaterwrap: {
        name: "Two Seater Wrap",
        data: [enrichedTrain[2]],
      },
      handgrips: {
        name: "Hand Grips",
        data: [enrichedTrain[3]],
      },
      trainwrapexternal: {
        name: "Train Wrap External",
        data: [enrichedTrain[4]],
      },
    }),
    [enrichedParapets, enrichedBacklits, enrichedExternalAssets, enrichedPillars, enrichedTrain]
  );

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
  };

  const assetTypes = Object.keys(assetMap);

  const dataToPaginate = useMemo(() => {
    return assetMap[selectedAsset]?.data || [];
  }, [assetMap, selectedAsset]); // Memoize dataToPaginate based on assetMap and selectedAsset

  const filteredContracts = useMemo(() => {
    if (!search.trim()) return dataToPaginate;

    return dataToPaginate.filter((contract) =>
      Object.values(contract).some((val) => String(val).toLowerCase().includes(search.toLowerCase()))
    );
  }, [dataToPaginate, search]);

  const filteredData = filteredContracts.filter((item) => {
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

      const trainAssetsRes = await getTrainAssets();
      setTrainAssets(trainAssetsRes.data);
    };
    fetchParapets();
  }, []);
  return (
    <div className=" flex flex-col p-4 bg-white rounded-lg container gap-3">
      <div>
        <h2 className="text-xl font-bold mb-4">Availability</h2>
        <div className="flex gap-2">
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
              defaultDate={new Date(toDate)}
              onSelectedDateChanged={(date) => {
                setToDate(formatDate(date));
              }}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Asset Selection */}
        <div className="flex items-center gap-3">
          <h5 className="text-sm font-medium text-gray-600">Select an Asset</h5>
          <Select
            value={selectedAsset}
            onChange={(e) => {
              const selectedType = e.target.value;
              setSelectedAsset(selectedType);
              setCurrentPage(1);
            }}
            className="min-w-[180px]"
          >
            {assetTypes.map((type) => (
              <option key={type} value={type}>
                {assetMap[type].name}
              </option>
            ))}
          </Select>
        </div>
        <div className="flex items-center gap-2 opacity-60 cursor-not-allowed">
          <label htmlFor="search" className="text-sm font-medium text-gray-600">
            Search:
          </label>
          <TextInput
            id="search"
            type="text"
            placeholder="Type to search..."
            sizing="sm"
            className="w-64 bg-gray-100 text-gray-500"
            value={search}
            onChange={handleSearch}
          />
        </div>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
        totalCount={trainAssetNames.includes(selectedAsset) ? paginatedData[0]?.contracts?.length : filteredData.length}
      />

      {dataToPaginate && dataToPaginate.length > 0 ? (
        <div className="space-y-8">
          {trainAssetNames.includes(selectedAsset) ? (
            paginatedData.map((data, index) => (
              <div key={index}>
                <h2 className="capitalize">{data.asset_name}</h2>
                <p>
                  Available: <strong>{data.available}</strong> | Booked: <strong>{data.booked}</strong> | Out of Order:{" "}
                  <strong>{data.out_of_order}</strong> | Total Trains:{" "}
                  <strong>{data.booked + data.available + data.out_of_order}</strong>
                </p>
                {data.booked === 0 ? (
                  <>All trains available</>
                ) : (
                  <Table className="table-fixed w-full">
                    <Table.Head>
                      <Table.HeadCell className="text-center">Contract</Table.HeadCell>
                      <Table.HeadCell className="text-center">Quantity</Table.HeadCell>
                      <Table.HeadCell className="text-center">Available After</Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="divide-y">
                      {data.contracts.map((contract, idx) => (
                        <Table.Row
                          key={idx}
                          className="bg-white dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
                        >
                          <Table.Cell className="capitalize text-center">{contract.asset_sales_order_code}</Table.Cell>
                          <Table.Cell className="capitalize text-center">{contract.quantity}</Table.Cell>
                          <Table.Cell className="text-center">
                            {contract.contracts?.[0]?.asset_date_end
                              ? formatDate(contract.contracts[0].asset_date_end)
                              : contract.asset_date_end
                              ? formatDate(contract.asset_date_end)
                              : "Available Now"}
                          </Table.Cell>
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table>
                )}
              </div>
            ))
          ) : (
            // General asset types
            <Table className="table-fixed w-full">
              <Table.Head>
                <Table.HeadCell className="text-center">
                  {selectedAsset === "viaducts"
                    ? "Viaduct Name"
                    : selectedAsset === "pillars"
                    ? "Pillar Name"
                    : "Station"}
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
                      {data.asset_name ? `${data.asset_name}` : data.asset_type}
                    </Table.Cell>
                    <Table.Cell className="text-center">
                      {selectedAsset === "parapets"
                        ? data.asset_prefix === "NB"
                          ? "North Bound"
                          : "South Bound"
                        : data.asset_distinction || data.asset_direction}
                    </Table.Cell>
                    <Table.Cell className="text-center">
                      {data.contracts?.[0]?.asset_date_end
                        ? formatDate(data.contracts[0].asset_date_end)
                        : data.asset_date_end
                        ? formatDate(data.asset_date_end)
                        : "Available Now"}
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          )}
        </div>
      ) : (
        <span className="sr-only">Loading...</span>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
        totalCount={trainAssetNames.includes(selectedAsset) ? paginatedData[0]?.contracts?.length : filteredData.length}
      />
    </div>
  );
};

export default AssetAvailability;
