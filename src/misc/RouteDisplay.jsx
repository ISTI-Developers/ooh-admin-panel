import PropTypes from "prop-types";
import { IoArrowForwardSharp, IoArrowBackSharp } from "react-icons/io5";

export const RouteDisplay = ({
  SouthBound,
  NorthBound,
  handleSouth,
  handleNorth,
}) => {
  return (
    <div className="w-full">
      <hr className="h-[3px] bg-black border-none my-5" />
      <div className="flex justify-evenly items-center my-5">
        <div>
          {SouthBound ? (
            <>
              <button
                className="flex items-center space-x-2"
                onClick={handleSouth}
              >
                <IoArrowBackSharp />
                <span className="font-bold">{SouthBound}</span>
              </button>
            </>
          ) : (
            <></>
          )}
        </div>
        <div>
          {NorthBound ? (
            <>
              <button
                className="flex items-center space-x-2"
                onClick={handleNorth}
              >
                <span className="font-bold">{NorthBound}</span>
                <IoArrowForwardSharp />
              </button>
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
      <hr className="h-[3px] bg-black border-none my-5" />
    </div>
  );
};

RouteDisplay.propTypes = {
  SouthBound: PropTypes.string,
  NorthBound: PropTypes.string,
  handleSouth: PropTypes.func,
  handleNorth: PropTypes.func,
};
