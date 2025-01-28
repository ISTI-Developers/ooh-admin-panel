import { Link, Route, Routes, useNavigate } from "react-router-dom";
import { useUsers } from "~/contexts/UserContext";
import Title from "~components/Title";
import UserOptions from "./UserOptions";
import {
  Badge,
  Button,
  Label,
  Modal,
  Pagination,
  Select,
  Table,
  Tooltip,
} from "flowbite-react";
import { useFunction } from "~/misc/functions";
import { useRoles } from "~/contexts/RoleContext";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { FaPen, FaTrash, FaUserGear } from "react-icons/fa6";
import { useServices } from "~/contexts/ServiceContext";
import Loader from "~components/Loader";
import { MdOutlineRestore, MdPersonOff } from "react-icons/md";
import UserInformation from "./UserInformation";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import classNames from "classnames";
function Users() {
  return (
    <>
      <div className="w-full flex flex-col gap-2">
        <Title>User Management</Title>
        <div className="flex flex-col gap-4">
          <Routes>
            <Route path="/*" element={<Main />} />
            <Route path="/:id" element={<UserInformation />} />
            <Route path="/:id/edit" element={<UserInformation />} />
            <Route path="/add" element={<UserInformation />} />
          </Routes>
        </div>
      </div>
      <UserModals />
    </>
  );
}

function Main() {
  const { results: users, setUser, setModule } = useUsers();
  const { results: roles } = useRoles();
  const { capitalize } = useFunction();
  const { tooltipOptions, sortItems, sortByRole, sortByStatus } = useServices();
  const navigate = useNavigate();
  const headers = [
    "first_name",
    "last_name",
    "username",
    "email_address",
    "role",
    "status",
    "actions",
  ];

  const [sortedItems, setSortedItems] = useState(null);
  const [key, setKey] = useState("first_name");
  const [direction, setDirection] = useState("ASC");
  const [itemCount, setCount] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Calculate start and end index
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const onPageChange = (page) => setCurrentPage(page);

  useEffect(() => {
    if (users) {
      if (roles) {
        const items = [...users];
        let sortedItems = items;
        setCount(items.length);
        if (key === "role") {
          sortedItems = sortByStatus(
            sortByRole(items, roles, direction),
            direction
          );
        } else {
          sortedItems = sortByStatus(
            sortItems(items, key, direction),
            direction
          );
        }

        setSortedItems(sortedItems.slice(startIndex, endIndex));
      }
    }
  }, [users, key, direction, roles, startIndex, endIndex, sortByStatus, sortByRole, sortItems]);
  return (
    <>
      <UserOptions
        user_key={key}
        setKey={setKey}
        direction={direction}
        setDirection={setDirection}
      />
      <Table hoverable>
        <Table.Head>
          {headers.map((header, index) => (
            <Table.HeadCell key={index} className="text-main-300">
              {capitalize(header, "_")}
            </Table.HeadCell>
          ))}
        </Table.Head>
        <Table.Body>
          {sortedItems && sortedItems?.length !== 0 ? (
            sortedItems.map((user, index) => {
              return (
                <Table.Row key={index}>
                  {headers.map((key, hIndex) => {
                    return (
                      key !== "actions" &&
                      (key === "role" ? (
                        <LoadRole role_id={user[key]} index={hIndex} />
                      ) : key === "status" ? (
                        <Table.Cell key={hIndex}>
                          <Badge
                            className="w-fit uppercase"
                            color={
                              user[key] === "active" ? "success" : "failure"
                            }
                          >
                            {user[key]}
                          </Badge>
                        </Table.Cell>
                      ) : (
                        <Table.Cell
                          key={hIndex}
                          className={classNames(
                            "cursor-pointer",
                            key !== "email_address" && "capitalize"
                          )}
                          onClick={() => navigate(`/users/${user.user_id}`)}
                        >
                          {user[key]}
                        </Table.Cell>
                      ))
                    );
                  })}
                  <Table.Cell>
                    <div className="flex items-center justify-evenly">
                      {user.status !== "active" ? (
                        <FaUserGear className="text-lg text-blue-100" />
                      ) : (
                        <Tooltip content="Change Role" {...tooltipOptions}>
                          <button
                            type="button"
                            onClick={() => {
                              setUser(user);
                              setModule("reassign");
                            }}
                          >
                            <FaUserGear className="text-lg text-blue-400" />
                          </button>
                        </Tooltip>
                      )}
                      {user.status !== "active" ? (
                        <FaPen className="text-lg text-yellow-100" />
                      ) : (
                        <Tooltip content="Edit" {...tooltipOptions}>
                          <Link to={`./${user.user_id}/edit`}>
                            <FaPen className="text-lg text-yellow-300" />
                          </Link>
                        </Tooltip>
                      )}
                      {user.status === "active" ? (
                        <Tooltip content="Deactivate" {...tooltipOptions}>
                          <button
                            type="button"
                            onClick={() => {
                              setUser(user);
                              setModule("deactivate");
                            }}
                          >
                            <MdPersonOff className="text-xl text-red-400" />
                          </button>
                        </Tooltip>
                      ) : (
                        <Tooltip content="Reactivate" {...tooltipOptions}>
                          <button
                            type="button"
                            onClick={() => {
                              setUser(user);
                              setModule("reactivate");
                            }}
                          >
                            <MdOutlineRestore className="text-lg text-green-400" />
                          </button>
                        </Tooltip>
                      )}
                      <Tooltip content="Delete" {...tooltipOptions}>
                        <button
                          type="button"
                          onClick={() => {
                            setUser(user);
                            setModule("delete");
                          }}
                        >
                          <FaTrash className="text-gray-400" />
                        </button>
                      </Tooltip>
                    </div>
                  </Table.Cell>
                </Table.Row>
              );
            })
          ) : (
            <Table.Row>
              {new Array(7).fill("1rem").map((item, index) => {
                return (
                  <Table.Cell key={index}>
                    <Loader height={item} />
                  </Table.Cell>
                );
              })}
            </Table.Row>
          )}
        </Table.Body>
      </Table>
      {itemCount > itemsPerPage && (
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(itemCount / itemsPerPage)}
          onPageChange={onPageChange}
        />
      )}
    </>
  );
}
function UserModals() {
  const { user, setUser, module, updateUserStatus, doReload } = useUsers();
  const { results: roles } = useRoles();
  const { setAlert } = useServices();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);
  let role;
  const handleStatusUpdate = async (status) => {
    const response = await updateUserStatus(user.user_id, "status", status);
    if (response?.success) {
      setUser(null);
      setAlert({
        isOn: true,
        type: "success",
        message: `User has been successfully ${
          status !== "deleted"
            ? status === "active"
              ? "reactivated"
              : "deactivated"
            : "deleted"
        }`,
      });
      doReload((prevState) => (prevState += 1));
      navigate("/users");
    } else {
      setAlert({
        isOn: true,
        type: "failure",
        message: `An error occurred. Please try again.`,
      });
    }
  };
  const handleRoleUpdate = async (role) => {
    const response = await updateUserStatus(user.user_id, "role", role);
    if (response?.success) {
      setUser(null);
      setAlert({
        isOn: true,
        type: "success",
        message: `User role has been successfully changed.`,
      });
      doReload((prevState) => (prevState += 1));
      navigate("/users");
    } else {
      setAlert({
        isOn: true,
        type: "failure",
        message: `An error occurred. Please try again.`,
      });
    }
  };
  if (user) {
    if (module === "reassign") {
      role = roles.find((role) => role.role_id === user.role);
    }
  }

  return (
    <Modal
      show={user !== null}
      size={module !== "deactivate" ? "md" : "lg"}
      popup
      dismissible
      onClose={() => setUser(null)}
    >
      {module === "reassign" ? (
        <Modal.Header>Change Role</Modal.Header>
      ) : (
        <Modal.Header />
      )}
      <Modal.Body>
        <div className="text-center flex flex-col items-center gap-2 px-2">
          {module !== "reassign" ? (
            <>
              <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200" />
              <h3 className="mb-3 text-main-500 text-center">
                Are you sure you want to {module} this user?
              </h3>
              <div className="flex justify-center gap-4 w-full">
                <Button
                  color={
                    /deactivate|delete/.test(module) ? "failure" : "success"
                  }
                  onClick={() =>
                    handleStatusUpdate(
                      module === "deactivate"
                        ? "inactive"
                        : module === "reactivate"
                        ? "active"
                        : "deleted"
                    )
                  }
                >
                  Yes, proceed
                </Button>
                <Button color="gray" onClick={() => setUser(null)}>
                  No, cancel
                </Button>
              </div>
            </>
          ) : (
            user && (
              <>
                <div className="flex flex-col gap-2 w-full">
                  <div className="flex items-center gap-2">
                    <Label className="w-1/2 text-start">Current:</Label>
                    <p className="bg-gray-50 border border-gray-300 p-2 px-4 rounded-lg w-1/2 text-start text-gray-600 capitalize">
                      {role.name}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="roles" className="w-1/2 text-start">
                      Change to:{" "}
                    </Label>
                    <Select
                      id="roles"
                      className="w-1/2"
                      onChange={(e) => setSelectedRole(e.target.value)}
                    >
                      <option disabled selected={selectedRole === null}>
                        Select role
                      </option>
                      {roles.map((item) => {
                        return (
                          <option
                            key={item.role_id}
                            value={item.role_id}
                            className="capitalize"
                            disabled={item.role_id === role.role_id}
                            selected={item.role_id === selectedRole}
                          >
                            {item.name}
                          </option>
                        );
                      })}
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end gap-2 w-full">
                  <Button
                    color="blue"
                    onClick={() => handleRoleUpdate(selectedRole)}
                  >
                    Update
                  </Button>
                  <Button color="gray" onClick={() => setUser(null)}>
                    Cancel
                  </Button>
                </div>
              </>
            )
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
}
const LoadRole = ({ role_id, index }) => {
  const [role, setRole] = useState(null);
  const { retrieveRole } = useRoles();
  const { capitalize } = useFunction();

  useEffect(() => {
    const setup = async () => {
      const response = await retrieveRole(role_id);
      setRole(response);
    };
    setup();
  }, [role_id]);
  return (
    <Table.Cell key={index}>
      {role ? (
        <Link
          to={`/roles/${role.role_id}`}
          className="text-secondary-500 underline"
        >
          {capitalize(role.name)}
        </Link>
      ) : (
        <Loader height="1rem" />
      )}
    </Table.Cell>
  );
};

LoadRole.propTypes = {
  role_id: PropTypes.string,
  index: PropTypes.number,
};
export default Users;
