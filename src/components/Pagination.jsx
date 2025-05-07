import PropTypes from "prop-types";
import { Button, Select } from "flowbite-react";

const Pagination = ({ currentPage, totalPages, onPageChange, itemsPerPage, setItemsPerPage, totalCount }) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex justify-center items-center space-x-2">
        <Button color="gray" onClick={() => onPageChange(Math.max(currentPage - 1, 1))} disabled={currentPage === 1}>
          Prev
        </Button>

        <span className="text-sm font-medium">
          Page {currentPage} of {totalPages}
        </span>

        {/* Add total count display here */}
        {totalCount !== 0 && <span className="text-sm font-medium">| Total {totalCount} items</span>}

        <Button
          color="gray"
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <label htmlFor="limit" className="text-sm">
          Rows per page:
        </label>
        <Select
          id="limit"
          className="px-2 py-1 text-sm"
          value={itemsPerPage}
          onChange={(e) => setItemsPerPage(Number(e.target.value))}
        >
          <option value="10">10</option>
          <option value="25">25</option>
          <option value="50">50</option>
        </Select>
      </div>
    </div>
  );
};

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  itemsPerPage: PropTypes.number.isRequired,
  setItemsPerPage: PropTypes.func.isRequired,
  totalCount: PropTypes.number.isRequired, // Added totalCount prop type
};

export default Pagination;
