import { Button, Label, Select, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { MdModeEdit } from "react-icons/md";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useRoles } from "~/contexts/RoleContext";
import { useServices } from "~/contexts/ServiceContext";
import { useUsers } from "~/contexts/UserContext";
import { useFunction } from "~/misc/functions";
import { userTemplate } from "~/misc/templates";
import NavigateBack from "~components/NavigateBack";

function UserInformation() {
  const { id } = useParams();
  const location = useLocation();
  const { results: roles } = useRoles();
  const { setAlert } = useServices();
  const {
    retrieveUser,
    setUser: toggleUser,
    updateUser,
    createUser,
    doReload,
  } = useUsers();
  const { capitalize } = useFunction();
  const navigate = useNavigate();

  const isEditable = /edit|add/.test(location.pathname);

  const [user, setUser] = useState(null);

  const handleChange = (e) => {
    setUser((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };
  const handleUpdateUser = async () => {
    const tempUser = { ...user };
    const ID = user.user_id;
    delete tempUser.user_id;
    const response = await updateUser(ID, tempUser);

    if (response?.success) {
      setAlert({
        isOn: true,
        type: "success",
        message: "User information updated successfully",
      });
      doReload((prevState) => (prevState += 1));

      navigate(`/users/${user.user_id}`);
    }
  };
  const handleAddUser = async () => {
    const tempUser = { ...user };
    tempUser.status = "active";
    tempUser.password = "password";
    const response = await createUser(tempUser);
    if (response?.user_id) {
      setAlert({
        isOn: true,
        type: "success",
        message: "New user has been created successfully",
      });
      doReload((prevState) => (prevState += 1));

      navigate(`/users/${response.user_id}`);
    }
  };

  useEffect(() => {
    const setup = async () => {
      const response = id ? await retrieveUser(id) : userTemplate;
      setUser(response);
    };
    setup();
  }, []);

  return (
    user && (
      <>
        <NavigateBack to={"/users"} />
        <div className="relative bg-white flex flex-col gap-4 p-4 rounded-md shadow-md">
          <form className="grid grid-cols-1 gap-4 max-w-4xl">
            {["first_name", "last_name", "username", "email_address"].map(
              (item, index) => {
                return (
                  <FormGroup
                    isEditable={isEditable}
                    user={user}
                    item={item}
                    key={index}
                    onChange={handleChange}
                  />
                );
              }
            )}
            <div className="flex items-center gap-2 relative">
              <Label htmlFor="key" className="whitespace-nowrap w-1/4">
                Role
              </Label>
              {isEditable ? (
                <>
                  <Select
                    className="w-full"
                    id="role"
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled selected={user.role === ""}>
                      Select role
                    </option>
                    {roles
                      ?.filter((role) => role.status)
                      .map((role) => {
                        return (
                          <option
                            key={role.role_id}
                            value={role.role_id}
                            selected={role.role_id === user.role}
                          >
                            {capitalize(role.name)}
                          </option>
                        );
                      })}
                  </Select>
                </>
              ) : (
                <p className="p-2 w-full capitalize">
                  {roles?.find((role) => role.role_id === user.role)?.name}
                </p>
              )}
            </div>
            {isEditable && (
              <>
                <div className="flex items-center gap-2">
                  <Label htmlFor="key" className="whitespace-nowrap w-1/4">
                    Role Description
                  </Label>
                  <div className="w-full whitespace-nowrap bg-gray-300 p-2 px-4 rounded-lg text-gray-500">
                    {roles?.find((role) => role.role_id === user.role)
                      ? roles?.find((role) => role.role_id === user.role)
                          .description
                      : "Select a role to show its description"}
                  </div>
                </div>
              </>
            )}
          </form>
          <div className="absolute top-0 right-0 p-4 flex items-center gap-4">
            {!isEditable ? (
              <>
                <Link
                  to={`/users/${user.user_id}/edit`}
                  className="flex items-center gap-2 text-sm bg-yellow-100 text-yellow-600 p-2.5 px-4 rounded-lg font-semibold"
                >
                  <MdModeEdit />
                  Edit User
                </Link>
                <Button
                  color="transparent"
                  className="bg-red-100 text-red-600"
                  onClick={() => toggleUser(user)}
                >
                  Deactivate Role
                </Button>
              </>
            ) : (
              <>
                <Button
                  type="submit"
                  color="transparent"
                  className="bg-green-200 text-green-600"
                  onClick={(e) => {
                    e.preventDefault();
                    location.pathname.includes("edit")
                      ? handleUpdateUser()
                      : handleAddUser();
                  }}
                >
                  Save Changes
                </Button>
              </>
            )}
          </div>
        </div>
      </>
    )
  );
}
export default UserInformation;

const FormGroup = ({ isEditable, user, item, onChange }) => {
  const { capitalize } = useFunction();
  return (
    <div className="flex items-center gap-2">
      <Label htmlFor={item} className="whitespace-nowrap w-1/4">
        {capitalize(item, "_")}
      </Label>
      {isEditable ? (
        <TextInput
          id={item}
          value={user[item]}
          className="w-full"
          required
          onChange={onChange}
        />
      ) : (
        <p className="p-2 w-full">{user[item]}</p>
      )}
    </div>
  );
};
