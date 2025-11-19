import { useState, useEffect, useMemo } from "react";
import { Table, Select, Datepicker } from "flowbite-react";
import { parse, isAfter, isBefore, format, addYears, differenceInDays, parseISO } from "date-fns";
import { useLRTapi } from "~contexts/LRT.api";
import { useStations } from "~contexts/LRTContext";
import Pagination from "~components/Pagination";
import { TextInput } from "flowbite-react";
import { SWS, NWS, SES, NES, SBS, NBS } from "./utasi.const";

const AssetAvailability = () => {
  // 1. Utilities
  const formatDate = (isoDate) => {
    return format(new Date(isoDate), "MMMM dd, yyyy");
  };
  // 2. Custom Hooks
  const {
    retrieveParapetsAvailability,
    retrieveBacklitsAvailability,
    retrieveTicketboothsAvailability,
    retrieveStairsAvailability,
    getTrainAssets,
  } = useLRTapi();
  const { pillars, assetContracts, refreshViaducts, viaducts, refreshPillars, refreshAssetContracts } = useStations();
  // 3. State Initialization
  const today = new Date();
  const oneYearFromToday = addYears(today, 1);
  const [fromDate, setFromDate] = useState(formatDate(today));
  const [toDate, setToDate] = useState(formatDate(oneYearFromToday));
  const [selectedAsset, setSelectedAsset] = useState("parapets");
  const [parapets, setParapets] = useState([]);
  const [backlits, setBacklits] = useState([]);
  const [ticketbooths, setTicketbooths] = useState([]);
  const [stairs, setStairs] = useState([]);
  const [trainAssets, setTrainAssets] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");

  // 4. Derived Data
  const parsedFromDate = parse(fromDate, "MMMM d, yyyy", new Date());
  const parsedToDate = parse(toDate, "MMMM d, yyyy", new Date());

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

  const enrichedTrain = enrichAssetsWithContracts(trainAssets, assetContracts, [
    { assetKey: "asset_id", contractKey: "asset_id" },
  ]);

  const enrichedParapets = enrichAssetsWithContracts(parapets, assetContracts, [
    { assetKey: "station_id", contractKey: "station_id" },
    { assetKey: "asset_id", contractKey: "asset_id" },
    { assetKey: "asset_prefix", contractKey: "asset_facing" },
  ]);

  const enrichedBacklits = enrichAssetsWithContracts(backlits, assetContracts, [
    { assetKey: "id", contractKey: "backlit_id" },
  ]);

  const enrichedTicketBooths = enrichAssetsWithContracts(ticketbooths, assetContracts, [
    { assetKey: "id", contractKey: "ticketbooth_id" },
  ]);

  const enrichedStairs = enrichAssetsWithContracts(stairs, assetContracts, [
    { assetKey: "id", contractKey: "stairs_id" },
  ]);

  const enrichedExternalAssets = enrichAssetsWithContracts(viaducts, assetContracts, [
    { assetKey: "id", contractKey: "viaduct_id" },
  ]);
  const enrichedPillars = enrichAssetsWithContracts(pillars, assetContracts, [
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
      ticketbooths: {
        name: "Ticket Booths",
        data: enrichedTicketBooths,
      },
      stairs: {
        name: "Stairs",
        data: enrichedStairs,
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
    [
      enrichedParapets,
      enrichedBacklits,
      enrichedTicketBooths,
      enrichedStairs,
      enrichedExternalAssets,
      enrichedPillars,
      enrichedTrain,
    ]
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
    const hasContractInRange = item.contracts?.some((contract) => {
      const endDate = contract.asset_date_end;
      if (!endDate) return false;
      const contractEndDate = new Date(endDate);
      return isAfter(contractEndDate, parsedFromDate) && isBefore(contractEndDate, parsedToDate);
    });

    // If no contracts, include the item
    if (!item.contracts || item.contracts.length === 0) return true;

    return hasContractInRange;
  });

  const getPaginatedData = (data) => {
    const start = (currentPage - 1) * itemsPerPage;
    return data.slice(start, start + itemsPerPage);
  };

  const paginatedData = getPaginatedData(filteredData);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  // 5. Effect Hook
  useEffect(() => {
    const fetchAssets = async () => {
      const parapetRes = await retrieveParapetsAvailability();
      setParapets(parapetRes.data);

      const backlitRes = await retrieveBacklitsAvailability();
      setBacklits(backlitRes.data);

      const TBRes = await retrieveTicketboothsAvailability();
      setTicketbooths(TBRes.data);

      const stairsRes = await retrieveStairsAvailability();
      setStairs(stairsRes.data);

      const trainAssetsRes = await getTrainAssets();
      setTrainAssets(trainAssetsRes.data);

      await refreshViaducts();
      await refreshPillars();
      await refreshAssetContracts();
    };
    fetchAssets();
  }, []);
  // Prime IDs
  const primeIDs = [20, 19, 17, 12, 10];
  const primeBacklits = backlits.filter((b) => primeIDs.includes(b.station_id));
  const nonPrimeBacklits = backlits.filter((b) => !primeIDs.includes(b.station_id));
  const primeTB = ticketbooths.filter((b) => primeIDs.includes(b.station_id));
  const nonPrimeTB = ticketbooths.filter((b) => !primeIDs.includes(b.station_id));

  const computeStats = (items) => {
    const total = items.length;
    const booked = items.filter((i) => i.asset_status === "TAKEN").length;
    const occupancy = total > 0 ? ((booked / total) * 100).toFixed(2) + "%" : "0%";
    return { total, booked, occupancy };
  };

  const primeStats = computeStats(primeBacklits);
  const primeStatsTB = computeStats(primeTB);

  const primeStationNames = [...new Set(primeBacklits.map((i) => i.station_name))];
  const primeTable = [
    {
      assets: "Backlits",
      total: primeStats.total,
      booked: primeStats.booked,
      occupancy: primeStats.occupancy,
    },
    {
      assets: "Ticketbooths",
      total: primeStatsTB.total,
      booked: primeStatsTB.booked,
      occupancy: primeStatsTB.occupancy,
    },
  ];
  const nonPrimeStats = computeStats(nonPrimeBacklits);
  const nonPrimeStatsTB = computeStats(nonPrimeTB);

  const nonPrimeTable = [
    {
      assets: "Backlits",
      total: nonPrimeStats.total,
      booked: nonPrimeStats.booked,
      occupancy: nonPrimeStats.occupancy,
    },
    {
      assets: "Ticketbooths",
      total: nonPrimeStatsTB.total,
      booked: nonPrimeStatsTB.booked,
      occupancy: nonPrimeStatsTB.occupancy,
    },
  ];
  const allStars = computeStats(stairs);
  const stairsTable = [
    {
      assets: "Stairs",
      total: allStars.total,
      booked: allStars.booked,
      occupancy: allStars.occupancy,
    },
  ];
  return (
    <div className=" flex flex-col p-4 bg-white rounded-lg container gap-3">
      <>
        {/* PRIME SITES TABLE */}
        {/* Header with station names */}
        <h2 className="font-bold text-lg mb-2">Prime Sites: {primeStationNames.join(", ")}</h2>

        <table className="table-auto w-full border mb-6">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">Assets</th>
              <th className="p-2">Total</th>
              <th className="p-2">Booked</th>
              <th className="p-2">Occupancy</th>
            </tr>
          </thead>
          <tbody>
            {primeTable.map((row, i) => (
              <tr key={i} className="border">
                <td className="p-2 text-center">{row.assets}</td>
                <td className="p-2 text-center">{row.total}</td>
                <td className="p-2 text-center">{row.booked}</td>
                <td className="p-2 text-center">{row.occupancy}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* NON-PRIME SITES TABLE */}
        <table className="table-auto w-full mt-6 border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">Assets</th>
              <th className="p-2">Total</th>
              <th className="p-2">Booked</th>
              <th className="p-2">Occupancy</th>
            </tr>
          </thead>
          <tbody>
            {nonPrimeTable.map((row, i) => (
              <tr key={i} className="border">
                <td className="p-2 text-center">{row.assets}</td>
                <td className="p-2 text-center">{row.total}</td>
                <td className="p-2 text-center">{row.booked}</td>
                <td className="p-2 text-center">{row.occupancy}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2 className="font-bold text-lg mb-2">TRAIN ASSETS</h2>
        <table>
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">Asset</th>
              <th className="p-2">Total</th>
              <th className="p-2">Booked</th>
              <th className="p-2">Occupancy</th>
            </tr>
          </thead>
          <tbody>
            {trainAssets.map((row, i) => {
              const total = row.available + row.booked;
              const occupancy = total > 0 ? (row.booked / total) * 100 : 0;
              return (
                <tr key={i} className="border">
                  <td className="p-2 text-center capitalize">{row.asset_name}</td>
                  <td className="p-2 text-center">{total}</td>
                  <td className="p-2 text-center">{row.booked}</td>
                  <td className="p-2 text-center">{occupancy.toFixed(2)}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <h2 className="font-bold text-lg mb-2">STAIRS</h2>
        <table className="table-auto w-full mt-6 border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">Assets</th>
              <th className="p-2">Total</th>
              <th className="p-2">Booked</th>
              <th className="p-2">Occupancy</th>
            </tr>
          </thead>
          <tbody>
            {stairsTable.map((row, i) => (
              <tr key={i} className="border">
                <td className="p-2 text-center">{row.assets}</td>
                <td className="p-2 text-center">{row.total}</td>
                <td className="p-2 text-center">{row.booked}</td>
                <td className="p-2 text-center">{row.occupancy}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
      <div>
        <h2 className="text-xl font-bold mb-4">Availability</h2>
        <div className="flex gap-2">
          <div>
            From:
            <Datepicker
              value={fromDate}
              // minDate={today}
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
          {trainAssetNames.includes(selectedAsset)
            ? paginatedData.map((data, index) => (
                <div key={index}>
                  <h2 className="capitalize">{data.asset_name}</h2>
                  <p>
                    Available: <strong>{data.available}</strong> | Booked: <strong>{data.booked}</strong> | Out of
                    Order: <strong>{data.out_of_order}</strong> | Total Trains:{" "}
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
                            <Table.Cell className="capitalize text-center">
                              {contract.asset_sales_order_code}
                            </Table.Cell>
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
            : null}
        </div>
      ) : (
        <p className="text-gray-500 italic">No records found.</p>
      )}
      {dataToPaginate && dataToPaginate.length > 0 && !trainAssetNames.includes(selectedAsset) && (
        <Table className="table-fixed w-full">
          <Table.Head>
            <Table.HeadCell className="text-center">
              {selectedAsset === "viaducts" ? "Viaduct Name" : selectedAsset === "pillars" ? "Pillar Name" : "Station"}
            </Table.HeadCell>
            <Table.HeadCell className="text-center">Asset</Table.HeadCell>
            <Table.HeadCell className="text-center">Facing</Table.HeadCell>
            <Table.HeadCell className="text-center">Owner</Table.HeadCell>
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
                    : selectedAsset === "stairs"
                    ? (() => {
                        const labels = { SWS, NWS, SES, NES, SBS, NBS };
                        const label = labels[data.asset_distinction];
                        return label ? label : data.asset_direction || "Middle Stairs";
                      })()
                    : data.asset_distinction || data.asset_direction}
                </Table.Cell>

                <Table.Cell className="text-center">
                  {data.contracts?.[0]?.brand_owner ??
                    data.remarks ??
                    (data.brand && data.brand !== "" ? data.brand : "N/A")}
                </Table.Cell>
                <Table.Cell className="text-center">
                  {(() => {
                    const endDate = data.contracts?.[0]?.asset_date_end || data.asset_date_end;
                    if (endDate) {
                      const end = parseISO(endDate);
                      const today = new Date();
                      const daysLeft = differenceInDays(end, today);
                      return `${formatDate(endDate)} (${daysLeft} days left)`;
                    }
                    if (
                      data.is_booked === 1 ||
                      (["backlits", "stairs", "ticketbooths"].includes(selectedAsset) &&
                        data.asset_status === "TAKEN") ||
                      (selectedAsset === "parapets" && data.availability_status === "Currently Unavailable")
                    ) {
                      return "Currently Unavailable";
                    }
                    return "Available Now";
                  })()}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
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
