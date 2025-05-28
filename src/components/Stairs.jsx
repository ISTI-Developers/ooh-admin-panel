import PropTypes from "prop-types";
import { StairsBookButton } from "./buttons/bookButtons";
import { STATUS } from "~misc/generalAssets";
const Stairs = ({ direction = "SOUTH", activeSpots = [], stairsData = [], onClick, icon = "▲" }) => {
  const isSouthBound = direction === "SOUTH";
  return (
    <div className="grid grid-cols-5 gap-5">
      {Array.from({ length: 5 }).map((_, index) => {
        const position = index + 1;
        const stairs = stairsData.find((b) => b.position_index === position);
        return activeSpots.includes(position) ? (
          <div className="flex flex-col justify-center items-center" key={stairs?.asset_id ?? position}>
            {!isSouthBound && (
              <>
                <div className="text-gray-500 text-sm uppercase tracking-wide">Stairs</div>
                <div className="text-gray-500 text-lg">{icon}</div>
              </>
            )}
            {isSouthBound && (
              <div className="text-gray-500 text-sm uppercase tracking-wide">{stairs?.remarks && stairs?.remarks}</div>
            )}
            <StairsBookButton isDisabled={stairs.asset_status === STATUS.TAKEN} onClick={() => onClick(stairs)} />
            {!isSouthBound && (
              <div className="text-gray-500 text-sm uppercase tracking-wide">{stairs?.remarks && stairs?.remarks}</div>
            )}

            {isSouthBound && (
              <>
                <div className="text-gray-500 text-lg">{icon}</div>
                <div className="text-gray-500 text-sm uppercase tracking-wide">Stairs</div>
              </>
            )}
          </div>
        ) : (
          <div key={position}></div>
        );
      })}
    </div>
  );
};
Stairs.propTypes = {
  direction: PropTypes.string,
  activeSpots: PropTypes.arrayOf(PropTypes.number),
  onClick: PropTypes.func,
  icon: PropTypes.node,
  stairsData: PropTypes.array,
};

export default Stairs;
