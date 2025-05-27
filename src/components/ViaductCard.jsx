import PropTypes from "prop-types";
import { FaTrash } from "react-icons/fa";
import { useStations } from "~contexts/LRTContext";
export const ViaductCard = ({ viaduct, onDetailsClick, deleteViaduct }) => {
  const { attachedContract } = useStations();
  return (
    <div
      className={`relative cursor-pointer bg-white rounded-lg shadow-md p-4 transition-opacity ${
        viaduct.isBooked ? "opacity-50 pointer-events-none" : "hover:shadow-lg"
      }`}
    >
      {/* "BOOKED" Stamp */}
      {viaduct.isBooked && (
        <div className="absolute top-3 right-3 bg-green-500 text-white font-bold text-lg px-4 py-1 rounded rotate-12">
          BOOKED
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
            viaduct.isBooked ? "opacity-50 cursor-not-allowed" : "hover:underline"
          }`}
          disabled={viaduct.isBooked}
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
    isBooked: PropTypes.bool,
  }).isRequired,
  onDetailsClick: PropTypes.func,
  deleteViaduct: PropTypes.func,
};
