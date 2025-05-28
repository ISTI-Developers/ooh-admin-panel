import PropTypes from "prop-types";
import { TicketBoothBookButton } from "./buttons/bookButtons";
import { STATUS } from "~misc/generalAssets";
const TicketBooth = ({ direction = "SOUTH", activeSpots = [], ticketBoothData = [], onClick, icon = "▲" }) => {
  const isSouthBound = direction === "SOUTH";
  return (
    <div className="grid grid-cols-5 gap-5">
      {Array.from({ length: 5 }).map((_, index) => {
        const position = index + 1;
        const booth = ticketBoothData.find((b) => b.position_index === position);
        return activeSpots.includes(position) ? (
          <div className="flex flex-col justify-center items-center" key={booth?.asset_id ?? position}>
            {!isSouthBound && (
              <>
                <div className="text-gray-500 text-sm uppercase tracking-wide">Ticket Booth</div>
                <div className="text-gray-500 text-lg">{icon}</div>
              </>
            )}
            {isSouthBound && (
              <div className="text-gray-500 text-sm uppercase tracking-wide">{booth?.remarks && booth?.remarks}</div>
            )}
            <TicketBoothBookButton isDisabled={booth.asset_status === STATUS.TAKEN} onClick={() => onClick(booth)} />
            {!isSouthBound && (
              <div className="text-gray-500 text-sm uppercase tracking-wide">{booth?.remarks && booth?.remarks}</div>
            )}

            {isSouthBound && (
              <>
                <div className="text-gray-500 text-lg">{icon}</div>
                <div className="text-gray-500 text-sm uppercase tracking-wide">Ticket Booth</div>
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
TicketBooth.propTypes = {
  direction: PropTypes.string,
  activeSpots: PropTypes.arrayOf(PropTypes.number),
  onClick: PropTypes.func,
  icon: PropTypes.node,
  ticketBoothData: PropTypes.array,
};

export default TicketBooth;
