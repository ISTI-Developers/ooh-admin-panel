import React from "react";
// import BacklitBookButton from "./BacklitBookButton";
import { BacklitBookButton } from "./buttons/bookButtons";
import { STATUS } from "~misc/generalAssets";
const Backlits = ({ direction = "SOUTH", backlitData = [], onClick, icon = "▲" }) => {
  const isSouthBound = direction === "SOUTH";

  return (
    <div className={`flex justify-evenly gap-1 ${!isSouthBound ? "mt-5" : ""}`}>
      {backlitData.map((item) => (
        <div key={item.asset_id} className="flex flex-col justify-center items-center">
          {!isSouthBound && (
            <>
              <div className="text-gray-500 text-sm uppercase tracking-wide">Backlit</div>
              <div className="text-gray-500 text-lg">{icon}</div>
            </>
          )}

          <BacklitBookButton
            text={item.asset_sales_order_code === "" ? item.asset_id : item.asset_sales_order_code}
            isDisabled={item.asset_status === STATUS.TAKEN}
            onClick={() => onClick(item)}
          />

          {isSouthBound && (
            <>
              <div className="text-gray-500 text-lg">{icon}</div>
              <div className="text-gray-500 text-sm uppercase tracking-wide">Backlit</div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default Backlits;
