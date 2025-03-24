/* eslint-disable react/prop-types */
import { Label, Select, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { useFunction } from "~/misc/functions";
import { format, getYear } from "date-fns";
const SearchAndFilter = ({ query, setQuery }) => {
  const { capitalize } = useFunction();
  const [filter, setFilter] = useState("available");
  const [month, setMonth] = useState(0);

  const filterKeys = ["all", "available", "booked", "month"];
  const months = Array.from({ length: 12 }, (_, index) =>
    format(new Date(getYear(new Date()), index), "MMMM")
  );

  const onQueryInput = (e) => {
    setQuery(e.target.value);
  };

  useEffect(() => {
    setQuery("show", filter, month);
  }, [filter, month]);

  return (
    <div className="px-1 flex gap-4 items-center">
      <TextInput
        type="search"
        sizing="sm"
        value={query.search}
        placeholder="Enter atleast 3 characters to search..."
        onChange={onQueryInput}
        className="min-w-[300px]"
      />
      <div className="flex gap-4 items-center">
        <Label htmlFor="filter" value="Show: " />
        <Select
          id="filter"
          sizing="sm"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          {filterKeys.map((key) => {
            return (
              <option key={key} value={key}>
                {capitalize(key, "_")}
              </option>
            );
          })}
        </Select>
        {filter === "month" && (
          <div className="flex items-center gap-4">
            <Label htmlFor={filter} value={`${capitalize(filter, "_")}:`} />
            <Select
              id="sort"
              value={month}
              sizing="sm"
              onChange={(e) => setMonth(parseInt(e.target.value))}
            >
              {months.map((key, index) => {
                return (
                  <option key={key} value={index}>
                    {capitalize(key, "_")}
                  </option>
                );
              })}
            </Select>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchAndFilter;
