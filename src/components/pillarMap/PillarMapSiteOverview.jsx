import { useState, useEffect } from "react";
import { useStations } from "~contexts/LRTContext";
import classNames from "classnames";
import { Button } from "flowbite-react";
import ContractTable from "~components/contractTable";
import Pillar from "~assets/Pillar.jpg";
import { useLRTapi } from "~contexts/LRT.api";
function PillarMapSiteOverview(props) {
  const { selectedPillar, attachedContract, queryAssetContracts } = useStations();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const contractedPillar = queryAssetContracts
    .filter((cp) => cp.pillar_id !== null && cp.pillar_id !== undefined)
    .map((cp) => cp.pillar_id);
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

            <div className="space-y-4">
              <div>
                <p className="text-lg font-semibold text-gray-800">Pillar Overview</p>
                <hr className="border-gray-300" />
              </div>

              <div className="flex flex-col gap-3">
                <img
                  src={selectedPillar.imageURL ? selectedPillar.imageURL : Pillar}
                  alt="Pillar Visual"
                  className="w-full rounded-lg shadow-sm object-cover"
                />

                <div className="space-y-1 text-sm text-gray-700">
                  <p className="font-semibold text-base">{selectedPillar.viaduct_name}</p>
                  <p>{selectedPillar.asset_direction}</p>
                  <p>
                    Media Rental:{" "}
                    <span className="font-medium">₱{Number(selectedPillar.media_rental).toLocaleString()}</span>
                  </p>
                  <p>
                    1X Prod Cost:{" "}
                    <span className="font-medium">₱{Number(selectedPillar.prod_cost).toLocaleString()}</span>
                  </p>

                  <p>
                    Size: <span className="font-medium">{selectedPillar.size}</span>
                  </p>
                  <p>
                    Min Duration: <span className="font-medium">{selectedPillar.min_duration_months} months</span>
                  </p>
                  {selectedPillar.notes && <p className="italic text-gray-500">{selectedPillar.notes}</p>}
                  {selectedPillar.vat_exclusive && (
                    <p className="text-xs text-red-500 font-medium">**Rates are exclusive of VAT</p>
                  )}
                </div>
              </div>
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
            {attachedContract && (
              <ContractTable
                selectedContract={attachedContract}
                setIsModalOpen={setIsModalOpen}
                asset_id={selectedPillar.asset_id}
                pillar_id={selectedPillar.id}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}

PillarMapSiteOverview.propTypes = {};

export default PillarMapSiteOverview;
