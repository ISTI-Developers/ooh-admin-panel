import { format } from "date-fns";
import { Modal, Button } from "flowbite-react";
import PropTypes from "prop-types";

const ContractDetailsModal = ({ open, onClose, contract, children }) => {
  if (!contract) return null;

  return (
    <Modal show={open} onClose={onClose}>
      <Modal.Header>Contract Details - {contract.SalesOrderCode || "N/A"}</Modal.Header>
      <Modal.Body>
        <div className="space-y-4 text-gray-700 dark:text-gray-300">
          <p>
            <strong>Sales Order Date:</strong>{" "}
            {contract.SalesOrderDate ? format(new Date(contract.SalesOrderDate), "MMMM dd, yyyy") : "N/A"}
          </p>
          <p>
            <strong>Total Amount:</strong>{" "}
            {contract.TotalAmount ? `₱${Number(contract.TotalAmount).toLocaleString()}` : "N/A"}
          </p>
          <p>
            <strong>Project Code:</strong> {contract.ProjectCode || "N/A"}
          </p>
          <p>
            <strong>Project Description:</strong> {contract.ProjectDesc || "N/A"}
          </p>
          <p>
            <strong>Stock Name:</strong> {contract.StockName || "N/A"}
          </p>
          <p>
            <strong>Quantity:</strong> {contract.Qty || "N/A"}
          </p>
          <p>
            <strong>Unit Price:</strong>{" "}
            {contract.unitprice ? `₱${Number(contract.unitprice).toLocaleString()}` : "N/A"}
          </p>
          <p>
            <strong>Net Amount:</strong>{" "}
            {contract.NetAmount ? `₱${Number(contract.NetAmount).toLocaleString()}` : "N/A"}
          </p>
        </div>
        {children}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onClose}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};
ContractDetailsModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  contract: PropTypes.object,
  children: PropTypes.node,
};

export default ContractDetailsModal;
