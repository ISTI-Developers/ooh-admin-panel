import { format } from "date-fns";
const MatchedContract = (matchedContract, handleSelectedModal) => {
  return (
    <div>
      <div className="space-y-3 text-sm text-gray-800">
        <div className="flex justify-between">
          <span className="font-medium text-gray-600">Sales Order Code:</span>
          <span className="text-gray-900">{matchedContract.asset_sales_order_code}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium text-gray-600">Start Date:</span>
          <span className="text-gray-900">{format(new Date(matchedContract.asset_date_start), "MMMM dd, yyyy")}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium text-gray-600">End Date:</span>
          <span className="text-gray-900">{format(new Date(matchedContract.asset_date_end), "MMMM dd, yyyy")}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium text-gray-600">Owner:</span>
          <span className="text-gray-900">{matchedContract.brand_owner} </span>
        </div>
        <div className="pt-4 text-right">
          <button
            onClick={handleSelectedModal}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default MatchedContract;
