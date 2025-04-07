import { useMemo, useState } from "react";
import PropTypes from "prop-types";
import { useFunction } from "~misc/functions";
import { useStations } from "~contexts/LRTContext";
import classNames from "classnames";
import { Link } from "react-router-dom";
import { Badge, Button } from "flowbite-react";
import { useLRTapi } from "~contexts/LRT.api";
import ContractTable from "~components/contractTable";
function PillarMapSiteOverview(props) {
  const { toUnderscored } = useFunction();
  // const { queryAssetContracts } = useStations();
  const { attachContract } = useLRTapi();

  const { selectedPillar, attachedContract, queryAssetContracts } = useStations();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const bookPillar = async () => {
    try {
      const contractData = {
        assetSalesOrderCode: attachedContract.SalesOrderCode,
        assetDateStart: attachedContract.DateRef1,
        assetDateEnd: attachedContract.DateRef2,
        assetId: selectedPillar.asset_id,
        viaductId: selectedPillar.id,
      };
      const response2 = await attachContract(contractData);
      console.log("Booking 2 successful:", response2);
    } catch (error) {
      console.error("Booking failed:", error);
      alert("Booking failed. Please try again.");
    } finally {
      setIsModalOpen(false);
    }
  };
  const contractedPillar = queryAssetContracts
    .filter((cp) => cp.viaduct_id !== null && cp.viaduct_id !== undefined)
    .map((cp) => cp.viaduct_id);
  const isBooked = contractedPillar.includes(selectedPillar?.id);
  return (
    <>
      <div
        className={classNames(
          "absolute top-0 right-0 bg-white w-full max-w-[35%] h-full p-4 shadow-xl transition-all scrollbar-thin overflow-y-auto",
          selectedPillar !== null ? "translate-x-0" : "translate-x-[100%]",
          "flex flex-col gap-4"
        )}
      >
        {selectedPillar && (
          <div
            className={classNames("flex flex-col gap-4", {
              "opacity-50 pointer-events-none": isBooked,
            })}
          >
            {isBooked && (
              <div className="absolute top-3 right-3 bg-green-500 text-white font-bold text-lg px-4 py-1 rounded rotate-12">
                BOOKED
              </div>
            )}

            <div>
              <p className="font-semibold">Pillar Overview</p>
              <hr />
            </div>
            <div className="flex flex-col gap-2">
              <img
                src={
                  selectedPillar.imageURL
                    ? selectedPillar.imageURL
                    : "https://test-cdn.movingwalls.com/thumbnail_not_found-min.png"
                }
                alt=""
                className="w-full"
              />

              <p className="font-bold">{selectedPillar.viaduct_name}</p>
              <p className="text-xs">{selectedPillar.asset_direction}</p>
            </div>

            {attachedContract && <Button onClick={() => setIsModalOpen(true)}>Book Pillar</Button>}
          </div>
        )}
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[50]">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-lg font-bold">Book Pillar</h2>
            <p className="mt-2">Are you sure you want to proceed with the booking?</p>

            <h2 className="text-lg font-bold">Selected Contract</h2>
            {attachedContract && (
              <ContractTable
                code={attachedContract.SalesOrderCode || "N/A"}
                reference={attachedContract.ReferenceNo || "N/A"}
                orderDate={attachedContract.SalesOrderDate || "N/A"}
                projDesc={attachedContract.ProjectDesc || "N/A"}
                dateStart={attachedContract.DateRef1 || "N/A"}
                dateEnd={attachedContract.DateRef2 || "N/A"}
              />
            )}

            <div className="mt-4 flex justify-end space-x-2">
              <button className="bg-gray-300 px-4 py-2 rounded-md" onClick={() => setIsModalOpen(false)}>
                Cancel
              </button>
              <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-700" onClick={bookPillar}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

PillarMapSiteOverview.propTypes = {};

export default PillarMapSiteOverview;
