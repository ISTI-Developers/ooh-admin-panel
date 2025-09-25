import PropTypes from "prop-types";
import { IoArrowForwardSharp, IoArrowBackSharp } from "react-icons/io5";
import railtracks from "../assets/railtracks.png";
export const RouteDisplay = ({ SouthBound, NorthBound, handleSouth, handleNorth }) => {
  return (
    <div className="w-full">
      <div className="relative my-5 w-full">
        {/* Repeating track strip */}
        <div
          className="w-full h-24 bg-repeat-x"
          style={{
            backgroundImage: `url(${railtracks})`,
            backgroundSize: "auto 100%", // keep height small; repeat along X
            backgroundPosition: "center",
          }}
        />

        {/* SouthBound button (left) */}
        {SouthBound && (
          <button
            onClick={handleSouth}
            className="absolute left-4 top-1/2 -translate-y-1/2 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 font-bold shadow-md hover:bg-neutral-100"
          >
            <IoArrowBackSharp />
            <span className="truncate">{SouthBound} Station</span>
          </button>
        )}

        {/* NorthBound button (right) */}
        {NorthBound && (
          <button
            onClick={handleNorth}
            className="absolute right-4 top-1/2 -translate-y-1/2 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 font-bold shadow-md hover:bg-neutral-100"
          >
            <span className="truncate">{NorthBound} Station</span>
            <IoArrowForwardSharp />
          </button>
        )}
      </div>
    </div>
  );
};

RouteDisplay.propTypes = {
  SouthBound: PropTypes.string,
  NorthBound: PropTypes.string,
  handleSouth: PropTypes.func,
  handleNorth: PropTypes.func,
};
