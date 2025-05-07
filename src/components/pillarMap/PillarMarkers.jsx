import { AdvancedMarker } from "@vis.gl/react-google-maps";
import PropTypes from "prop-types";
import classNames from "classnames";
import { useFunction } from "~misc/functions";
import { useStations } from "~contexts/LRTContext";

function PillarMarkers({ center, setCenter }) {
  const { offsetCoordinate } = useFunction();
  const { queryResults, setZoom, setSelectedPillar, setSelectedLandmark, selectedPillar, zoom, queryAssetContracts } =
    useStations();

  return queryResults.map((item, index) => {
    const position = { lat: item.latitude, lng: item.longitude };
    const offsetPosition = offsetCoordinate(item.latitude, item.longitude, 20);

    // Check if the coordinates are equal
    const isCentered = center.lat === offsetPosition.lat && center.lng === offsetPosition.lng;
    const size = zoom < 10 ? zoom / 4 : zoom / 8;

    // Normalize asset_direction and check for "South Bound"
    const assetDirection = item.asset_direction?.toLowerCase() || "";
    const isSouthbound = assetDirection.includes("south bound");

    const contractedPillar = queryAssetContracts
      .filter((cp) => cp.pillar_id !== null && cp.pillar_id !== undefined)
      .map((cp) => cp.pillar_id);
    const isBooked = contractedPillar.includes(item.id);

    return (
      <AdvancedMarker
        position={position}
        key={`${item.viaduct_name}_${index}`}
        onClick={(e) => {
          setZoom(18);
          const newCenter = offsetCoordinate(e.latLng.toJSON().lat, e.latLng.toJSON().lng, 20);
          setCenter(newCenter);
          setSelectedLandmark(null);
          setSelectedPillar(item);
        }}
      >
        <div
          style={{ width: `${size}rem` }}
          className={classNames(
            "transition-all duration-200",
            isCentered && item === selectedPillar ? "scale-150 z-10" : "scale-100 -z-10"
          )}
        >
          <div
            className={classNames(
              "w-full h-5",
              isSouthbound
                ? `rounded-b-full ${isBooked ? "bg-black" : "bg-red-500"} translate-y-3`
                : `rounded-t-full ${isBooked ? "bg-black" : "bg-green-500"} -translate-y-2`
            )}
          />
        </div>
      </AdvancedMarker>
    );
  });
}

PillarMarkers.propTypes = {
  list: PropTypes.array,
  center: PropTypes.object,
  setCenter: PropTypes.func,
  setZoom: PropTypes.func,
  setSite: PropTypes.func,
  site: PropTypes.object,
  zoom: PropTypes.number,
};

export default PillarMarkers;
