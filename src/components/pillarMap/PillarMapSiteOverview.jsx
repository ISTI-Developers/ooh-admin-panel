import { useState } from "react";
import { useStations } from "~contexts/LRTContext";
import classNames from "classnames";
import { Button } from "flowbite-react";
import ContractTable from "~components/contractTable";
import { useLRTapi } from "~contexts/LRT.api";
import { useImageUrl } from "~/misc/useImageUrl";

function PillarMapSiteOverview() {
  const Pillar = useImageUrl("Pillar.jpg");
  const { selectedPillar, assetContracts, attachedContract, setSelectedPillar, setPillars } = useStations();
  const { updateExternal } = useLRTapi();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [brand, setBrand] = useState("");
  const [brandModalOpen, setBrandModalOpen] = useState(false);
  const contractedPillar = assetContracts
    .filter((cp) => cp.pillar_id !== null && cp.pillar_id !== undefined)
    .map((cp) => cp.pillar_id);

  const handleBookPillar = async (id, isBooked, brand) => {
    try {
      await updateExternal(id, isBooked, brand);
      alert(isBooked === 1 ? "Pillar booked successfully!" : "Pillar unbooked successfully!");
      setPillars((prev) => prev.map((v) => (v.id === id ? { ...v, is_booked: isBooked, brand } : v)));
      setSelectedPillar((prev) => (prev && prev.id === id ? { ...prev, is_booked: isBooked, brand } : prev));
    } catch (e) {
      console.error("Update failed:", e);
    } finally {
      setBrandModalOpen(false);
      setBrand("");
    }
  };
  const isBooked = Number(selectedPillar?.is_booked) === 1;
  const contractedIds = Array.isArray(contractedPillar) ? contractedPillar.map((id) => String(id)) : [];
  const isContracted = selectedPillar?.id != null ? contractedIds.includes(String(selectedPillar.id)) : false;

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
          <div className="flex flex-col gap-4">
            {isBooked && (
              <div className="absolute top-3 right-3 bg-green-500 text-white font-bold text-lg px-4 py-1 rounded rotate-12 z-10">
                {selectedPillar.brand ? selectedPillar.brand : "BOOKED"}
              </div>
            )}

            <div
              className={classNames("space-y-4", {
                "opacity-50": isBooked,
              })}
            >
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

            {isContracted ? null : attachedContract ? (
              <Button onClick={() => setIsModalOpen(true)}>BOOK VIADUCT</Button>
            ) : isBooked ? (
              <Button onClick={() => handleBookPillar(selectedPillar.id, 0, null)}>Unbook Viaduct?</Button>
            ) : (
              <Button
                onClick={() => {
                  setBrand(selectedPillar.brand ?? "");
                  setBrandModalOpen(true);
                }}
              >
                Book Viaduct without contract?
              </Button>
            )}
          </div>
        )}
      </div>
      {brandModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div role="dialog" aria-modal="true" className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900">Book Pillar without contract</h3>
            <p className="mt-1 text-sm text-gray-600">Please specify the Brand for this booking.</p>

            <label className="mt-4 block text-sm font-medium text-gray-700" htmlFor="brand">
              Brand
            </label>
            <input
              id="brand"
              type="text"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="e.g., Coca-Cola"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleBookPillar(selectedPillar.id, 1, brand);
                }
              }}
            />

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
                onClick={() => {
                  setBrandModalOpen(false);
                  setBrand("");
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="rounded-md bg-green-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-60"
                onClick={() => handleBookPillar(selectedPillar.id, 1, brand)}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
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
