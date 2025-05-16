import PropTypes from "prop-types";

const AssetDetailCard = ({ station_id, detail }) => {
  if (detail.asset_name === "parapet") {
    detail.asset_name = "Parapet Wrap";
  } else if (detail.asset_name === "backlit") {
    if ([20, 19, 17, 16, 14, 13, 12, 11, 10, 1].includes(station_id)) {
      detail.asset_name = "Station Static Backlit (Premium)";
    } else if ([18, 15, 8, 7, 6, 5, 2].includes(station_id)) {
      detail.asset_name = "Station Static Backlit (Standard)";
    } else {
      detail.asset_name = "Station Static Backlit";
    }
  }

  return (
    <div className="w-full max-w-sm rounded-lg overflow-hidden shadow-lg bg-white p-6">
      {detail.asset_name && <h2 className="text-blue-700 font-bold text-xl mb-2">{detail.asset_name.toUpperCase()}</h2>}

      {detail.media_rental && (
        <p>
          <strong>Media Rental:</strong> <span className="text-blue-700">₱{detail.media_rental.toLocaleString()}</span>
        </p>
      )}
      {detail.ratecard && (
        <p>
          <strong>Ratecard:</strong> <span className="text-blue-700">₱{detail.ratecard.toLocaleString()}</span>
        </p>
      )}
      {detail.prod_cost && (
        <p>
          <strong>Production Cost:</strong> ₱{detail.prod_cost.toLocaleString()}
        </p>
      )}
      {detail.min_duration_months && (
        <p>
          <strong>Min Duration (Months):</strong> {detail.min_duration_months}
        </p>
      )}
      {typeof detail.vat_exclusive !== "undefined" && (
        <p>
          <strong>VAT Exclusive:</strong> {detail.vat_exclusive ? "Yes" : "No"}
        </p>
      )}
      {detail.size && (
        <p>
          <strong>Size:</strong> {detail.size}
        </p>
      )}
      {detail.notes && (
        <p>
          <strong>Notes:</strong> {detail.notes}
        </p>
      )}
    </div>
  );
};

export default AssetDetailCard;

AssetDetailCard.propTypes = {
  station_id: PropTypes.number,
  station_name: PropTypes.string,
  detail: PropTypes.shape({
    asset_name: PropTypes.string,
    media_rental: PropTypes.number,
    ratecard: PropTypes.number,
    prod_cost: PropTypes.number,
    min_duration_months: PropTypes.number,
    vat_exclusive: PropTypes.bool,
    size: PropTypes.string,
    notes: PropTypes.string,
  }),
};
