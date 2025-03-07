import { format } from "date-fns";
import PropTypes from "prop-types";

const ContractTable = ({ code, reference, orderDate, projDesc, dateStart, dateEnd }) => {
  return (
    <div>
      <table className="border border-gray-300 w-full text-sm">
        <tbody>
          <tr>
            <td className="border px-4 py-2 font-medium">Sales Order Code:</td>
            <td className="border px-4 py-2">{code || "N/A"}</td>
          </tr>
          <tr>
            <td className="border px-4 py-2 font-medium">Reference No:</td>
            <td className="border px-4 py-2">{reference || "N/A"}</td>
          </tr>
          <tr>
            <td className="border px-4 py-2 font-medium">Sales Order Date:</td>
            <td className="border px-4 py-2">{format(new Date(orderDate), "MMMM dd, yyyy") || "N/A"}</td>
          </tr>
          <tr>
            <td className="border px-4 py-2 font-medium">Project Description:</td>
            <td className="border px-4 py-2">{projDesc || "N/A"}</td>
          </tr>
          <tr>
            <td className="border px-4 py-2 font-medium">Start Date:</td>
            <td className="border px-4 py-2">{format(new Date(dateStart), "MMMM dd, yyyy") || "N/A"}</td>
          </tr>
          <tr>
            <td className="border px-4 py-2 font-medium">End Date (Available after):</td>
            <td className="border px-4 py-2">{format(new Date(dateEnd), "MMMM dd, yyyy") || "N/A"}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

ContractTable.propTypes = {
  code: PropTypes.string,
  reference: PropTypes.string,
  orderDate: PropTypes.string,
  projDesc: PropTypes.string,
  dateStart: PropTypes.string,
  dateEnd: PropTypes.string,
};
export default ContractTable;
