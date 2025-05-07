import React, { Fragment } from "react";
import { EntryExitButton, ParapetBookButton } from "./buttons/bookButtons";
import { STATUS, SIZE } from "~misc/generalAssets";

const Parapets = ({ direction = "SOUTH", parapetData = [], entryExitIndexes = [], onClick }) => {
  const isSouthBound = direction === "SOUTH";

  return (
    <>
      {/* NORTHBOUND label + icon above buttons */}
      {parapetData.length > 0 && !isSouthBound && (
        <div className="flex flex-col items-center mb-1">
          <div className="text-gray-500 text-sm uppercase tracking-wide">Parapets</div>
          <div className="text-gray-500 text-lg">▼</div>
        </div>
      )}

      {/* Parapet button row */}
      <div className={`flex ${isSouthBound ? "items-end" : "items-start"} justify-center gap-1`}>
        {parapetData.map((parapet, index) => (
          <Fragment key={parapet.asset_id}>
            <ParapetBookButton
              text={
                parapet.asset_status === STATUS.BLOCKED
                  ? ""
                  : parapet.asset_status === STATUS.TAKEN
                  ? parapet.owner
                  : parapet.owner === ""
                  ? parapet.asset_id
                  : parapet.owner
              }
              isBlocked={parapet.asset_status === STATUS.BLOCKED}
              isDisabled={parapet.asset_status === STATUS.TAKEN}
              isLargeParapet={parapet.asset_size === SIZE.LARGE}
              isPending={parapet.asset_status === STATUS.PENDING}
              widthLabel={parapet.asset_dimension_width}
              heightLabel={parapet.asset_dimension_height}
              onClick={() => onClick(parapet)}
            />
            {entryExitIndexes.includes(index) && <EntryExitButton key={`entry-exit-button-${index}`} />}
          </Fragment>
        ))}
      </div>

      {/* SOUTHBOUND label + icon below buttons */}
      {parapetData.length > 0 && isSouthBound && (
        <div className="flex flex-col items-center mt-1">
          <div className="text-gray-500 text-lg">▲</div>
          <div className="text-gray-500 text-sm uppercase tracking-wide">Parapets</div>
        </div>
      )}
    </>
  );
};

export default Parapets;
