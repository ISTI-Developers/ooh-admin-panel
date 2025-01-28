import { Table, Textarea } from "flowbite-react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { format } from "date-fns";
import { AiFillEdit, AiOutlineCheck, AiOutlineClose } from "react-icons/ai";
import { useState } from "react";

const SiteItem = ({ site, setSite }) => {
  const [onEdit, setOnEdit] = useState(false);
  const [date, setDate] = useState(site.adjusted_end_date ?? site.end_date);

  const onDateChange = () => {
    setSite((prev) => {
      const currentSite = prev.find((item) => item.site === site.site);

      currentSite.adjusted_end_date = date;

      return [...prev];
    });
    setOnEdit(false);
  };
  return (
    <Table.Row id={site.site_id} className="text-xs">
      <Table.Cell className="text-black font-semibold">
        {site.structure}
      </Table.Cell>
      <Table.Cell className="max-w-[300px]">{site.address}</Table.Cell>
      <Table.Cell>{site.site}</Table.Cell>
      <Table.Cell className="max-w-[150px]">{site.product}</Table.Cell>
      <Table.Cell className={classNames("whitespace-nowrap")}>
        {onEdit ? (
          <>
            <div className="relative group space-x-2">
              <input
                type="date"
                value={format(new Date(date), "yyyy-MM-dd")}
                onChange={(e) => setDate(e.target.value)}
              />
              <button type="button" onClick={onDateChange}>
                <AiOutlineCheck className="text-lg" />
              </button>
              <button type="button" onClick={() => setOnEdit(false)}>
                <AiOutlineClose className="text-lg" />
              </button>
            </div>
          </>
        ) : (
          <div className="relative group">
            {format(
              new Date(site.adjusted_end_date ?? site.end_date),
              "MMM. dd, yyyy"
            )}
            <button
              type="button"
              onClick={() => setOnEdit(true)}
              className="absolute right-0 top-0 opacity-0 text-lg pointer-events-none group-hover:pointer-events-auto group-hover:opacity-100"
            >
              <AiFillEdit />
            </button>
          </div>
        )}
      </Table.Cell>
      <Table.Cell className="text-center max-w-[50px]">
        {site.days_vacant ?? "---"}
      </Table.Cell>
      <Table.Cell className="text-center max-w-[50px]">
        {site.remaining_days ?? "---"}
      </Table.Cell>
      <Table.Cell className="">
        <Textarea className="min-h-[35px]" />
      </Table.Cell>
    </Table.Row>
  );
};

SiteItem.propTypes = {
  site: PropTypes.shape({
    site_id: PropTypes.string.isRequired,
    structure: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    site: PropTypes.string.isRequired,
    product: PropTypes.string.isRequired,
    adjusted_end_date: PropTypes.string,
    end_date: PropTypes.string.isRequired,
    days_vacant: PropTypes.number.isRequired,
    remaining_days: PropTypes.number.isRequired,
  }).isRequired,
  setSite: PropTypes.func.isRequired,
};
SiteItem.propTypes = {
  site: PropTypes.shape({
    site_id: PropTypes.string.isRequired,
    structure: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    site: PropTypes.string.isRequired,
    product: PropTypes.string.isRequired,
    adjusted_end_date: PropTypes.string,
    end_date: PropTypes.string.isRequired,
    days_vacant: PropTypes.number.isRequired,
    remaining_days: PropTypes.number.isRequired,
  }).isRequired,
};

export default SiteItem;
