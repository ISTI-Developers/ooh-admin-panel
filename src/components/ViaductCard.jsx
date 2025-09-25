import PropTypes from "prop-types";
import { FaTrash } from "react-icons/fa";
import { useStations } from "~contexts/LRTContext";
export const ViaductCard = ({ viaduct, onDetailsClick, deleteViaduct }) => {
  const { attachedContract } = useStations();
  return (
    <div
      className={`relative cursor-pointer bg-white rounded-lg shadow-md p-4 transition-opacity ${
        viaduct.is_booked ? "opacity-50" : "hover:shadow-lg"
      }`}
    >
      {/* "BOOKED" Stamp */}
      {viaduct.is_booked === 1 && (
        <div className="absolute top-3 right-3 bg-green-500 text-white font-bold text-lg px-4 py-1 rounded rotate-12">
          {viaduct.brand ? viaduct.brand : "BOOKED"}
        </div>
      )}

      {/* Image */}
      <img
        className="w-full h-40 rounded-md mb-3 object-cover"
        src={viaduct.picture}
        alt=""
        onClick={() => onDetailsClick(viaduct)}
      />

      {/* Viaduct Info */}
      <h3 className="text-lg font-bold">{viaduct.viaduct_name}</h3>
      <p className="text-gray-600">{viaduct.asset_direction}</p>

      {/* Details Button (Disabled if booked) */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => onDetailsClick(viaduct)}
          className={`text-blue-500 mt-2 inline-block ${
            viaduct.is_booked ? "opacity-50" : "hover:underline"
          }`}
          // disabled={viaduct.is_booked}
        >
          Details →
        </button>
        {!attachedContract && (
          <button className="text-red-500" onClick={deleteViaduct}>
            <FaTrash />
          </button>
        )}
      </div>
    </div>
  );
};

ViaductCard.propTypes = {
  viaduct: PropTypes.shape({
    picture: PropTypes.string,
    viaduct_name: PropTypes.string,
    asset_direction: PropTypes.string,
    is_booked: PropTypes.number,
    brand: PropTypes.string,
  }).isRequired,
  onDetailsClick: PropTypes.func,
  deleteViaduct: PropTypes.func,
};
