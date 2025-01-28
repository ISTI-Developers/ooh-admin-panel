import { Button, Dropdown, TextInput, Tooltip } from "flowbite-react";
import { FaArrowUpLong, FaArrowDownLong } from "react-icons/fa6";
import { defaultTextTheme, mainButtonTheme } from "~/misc/themes";
import { Link } from "react-router-dom";
import { useUsers } from "~/contexts/UserContext";
import { useFunction } from "~/misc/functions";
import PropTypes from "prop-types";
import classNames from "classnames";
function UserOptions({ user_key, setKey, direction, setDirection }) {
  const headers = [
    "first_name",
    "last_name",
    "username",
    "email_address",
    "role",
  ];
  const { searchTerm } = useUsers();
  const { capitalize } = useFunction();
  return (
    <div className="w-full flex items-center gap-4">
      <TextInput
        type="search"
        placeholder="Search"
        className="min-w-[300px]"
        //copy default theme and new configuration
        theme={{
          ...defaultTextTheme,
          field: { input: { withAddon: { off: "rounded-lg" } } },
        }}
        onChange={(e) => {
          searchTerm(e.target.value);
        }}
      />
      <Dropdown color="light" label={`Sort by: ${capitalize(user_key, "_")}`}>
        {headers.map((header) => (
          //loop to map out the the headers for dropdown options
          <Dropdown.Item key={header} onClick={() => setKey(header)}>
            {capitalize(header, "_")}
          </Dropdown.Item>
        ))}
      </Dropdown>

      <div className="flex">
        {
          //loop the ascending and descending button toggle
          [
            { to: "ASC", label: "Ascending", Icon: FaArrowUpLong },
            { to: "DESC", label: "Descending", Icon: FaArrowDownLong },
          ].map((dir) => {
            const { to, label, Icon } = dir;

            return (
              <Tooltip content={label} key={dir.to} arrow={false}>
                <button
                  className={classNames(
                    "transition-all",
                    direction === to ? "text-main text-xl" : "text-gray-400"
                  )}
                  onClick={() => setDirection(to)}
                >
                  <Icon />
                </button>
              </Tooltip>
            );
          })
        }
      </div>

      {/* Add user button */}
      <Button
        as={Link}
        to="./add"
        color="transparent"
        className="text-white bg-secondary-500 hover:bg-secondary rounded-md transition-all ml-auto"
        theme={mainButtonTheme}
      >
        Add User
      </Button>
    </div>
  );
}
UserOptions.propTypes = {
  user_key: PropTypes.string,
  setKey: PropTypes.func,
  direction: PropTypes.string,
  setDirection: PropTypes.func,
};
export default UserOptions;
