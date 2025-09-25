import { useState } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { Accordion } from "flowbite-react";
import { IoMdMenu } from "react-icons/io";
import { useFunction } from "~misc/functions";
import { accordion } from "~misc/themes";
import { useStations } from "~contexts/LRTContext";

function PillarMapList({ updateMapCenter }) {
  const { queryResults, setSelectedPillar, queryAssetContracts } = useStations();
  const { offsetCoordinate } = useFunction();
  const [showLocations, toggleLocations] = useState(false);

  const contractedPillar = queryAssetContracts
    .filter((cp) => cp.pillar_id !== null && cp.pillar_id !== undefined)
    .map((cp) => cp.pillar_id);
  return (
    queryResults && (
      <>
        <div
          className={classNames(
            "absolute w-full h-full top-0 left-0 z-[1] bg-white transition-all lg:relative lg:w-1/4",
            !showLocations ? "-translate-x-full lg:translate-x-0" : "translate-x-0"
          )}
        >
          <Accordion flush theme={accordion}>
            {[...new Set(queryResults.map((item) => item.asset_direction.toLowerCase()))].map((type) => (
              <Accordion.Panel key={type}>
                <Accordion.Title className="capitalize">{type}</Accordion.Title>
                <Accordion.Content>
                  <ul className="flex flex-col max-h-[375px] overflow-y-auto">
                    {queryResults
                      .filter((item) => item.asset_direction.toLowerCase() === type)
                      .map((boards, index) => {
                        const { viaduct_name, asset_type, latitude, longitude, asset_direction } = boards;
                        const isBooked = contractedPillar.includes(boards.id) || boards.is_booked === 1;
                        return (
                          <li
                            key={asset_type + index}
                            className="flex gap-2 transition-all cursor-pointer p-2 hover:bg-gray-300"
                            onClick={() => {
                              toggleLocations(false);
                              updateMapCenter(offsetCoordinate(latitude, longitude, 20), 18);
                              setSelectedPillar(boards);
                            }}
                          >
                            <div
                              className={classNames(
                                "w-10 h-5",
                                boards.asset_direction?.toLowerCase()?.includes("south bound")
                                  ? `rounded-b-full ${isBooked ? "bg-black" : "bg-red-500"}`
                                  : `rounded-t-full ${isBooked ? "bg-black" : "bg-green-500"}`
                              )}
                            />
                            <div>
                              <p className="text-xs font-semibold">{viaduct_name}</p>
                              <p className="text-[0.5rem] text-gray-500">{asset_direction}</p>
                            </div>
                          </li>
                        );
                      })}
                  </ul>
                </Accordion.Content>
              </Accordion.Panel>
            ))}
          </Accordion>
        </div>
        <button
          className={classNames(
            "absolute group top-0 left-0 z-[2] p-2 bg-[#ffffff] shadow flex items-center gap-1 lg:hidden",
            showLocations ? "opacity-50 hover:opacity-100" : "opacity-100"
          )}
          onClick={() => toggleLocations((prev) => !prev)}
        >
          <span className="hidden animate-fade group-hover:block">{!showLocations ? "Show" : "Hide"} sites</span>
          <IoMdMenu className="text-xl text-slate-700" />
        </button>
      </>
    )
  );
}

PillarMapList.propTypes = {
  updateMapCenter: PropTypes.func,
};

export default PillarMapList;
