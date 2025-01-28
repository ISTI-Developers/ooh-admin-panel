/* eslint-disable react/prop-types */
import { Button, Checkbox, Table, TextInput, Textarea } from "flowbite-react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useRoles } from "~/contexts/RoleContext";
import NavigateBack from "~components/NavigateBack";
import { MdDisabledByDefault, MdModeEdit } from "react-icons/md";
import { RiCheckboxFill } from "react-icons/ri";
import { useEffect, useMemo, useState } from "react";
import { useServices } from "~/contexts/ServiceContext";
import classNames from "classnames";

function ViewRole() {
  const { id } = useParams();
  const {
    modules,
    retrieveRole,
    setRole: toggleRole,
    updateRole,
    doReload,
    createRole,
  } = useRoles();
  const location = useLocation();
  const [role, setRole] = useState(null);
  const isEditing = /edit|add/.test(location.pathname);
  const navigate = useNavigate();
  const { setAlert } = useServices();

  useEffect(() => {
    const setup = async () => {
      if (modules) {
        let response = {
          role_id: 1,
          name: "",
          description: "",
          admin: false,
          client: false,
          status: 1,
          access: [
            ...modules.map((module) => {
              return {
                module_id: module.module_id,
                name: module.name,
                is_parent: module.is_parent,
                permissions: [false, false, false, false],
                status: module.status,
                view: module.view,
              };
            }),
          ],
        };
        if (id) {
          response = await retrieveRole(id);
          if (response) {
            const missingAccess = modules.filter(
              (module) =>
                !response.access.some(
                  (acc) => acc.module_id === module.module_id
                )
            );

            response.access = [
              ...response.access,
              ...missingAccess.map((module) => ({
                module_id: module.module_id,
                name: module.name,
                is_parent: module.is_parent,
                permissions: [false, false, false, false],
                status: module.status,
                view: module.view,
              })),
            ];
          }
        }
        setRole(response);
      }
    };
    setup();
  }, [id, modules, retrieveRole]);

  const handleChange = (e) => {
    setRole((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };
  const handleUpdateRole = async () => {
    const tempRole = { ...role };
    const ID = tempRole.role_id;
    delete tempRole.role_id;
    const response = await updateRole(ID, tempRole);

    if (response?.success) {
      setAlert({
        isOn: true,
        type: "success",
        message: "Role information updated successfully",
      });
      doReload((prevState) => (prevState += 1));

      navigate(`/roles/${role.role_id}`);
    }
  };
  const handleAddRole = async () => {
    const response = await createRole(role);
    if (response?.success) {
      setAlert({
        isOn: true,
        type: "success",
        message: "New role has been created successfully",
      });
      doReload((prevState) => (prevState += 1));

      navigate(`/roles/${response.role_id}`);
    } else {
      console.log(response);
    }
  };

  const Label = ({ children }) => {
    return (
      <p className="text-xs uppercase font-medium xl:font-bold text-main-300">
        {children}
      </p>
    );
  };

  const modulesByView = useMemo(() => {
    if (!role) return { admin: [], client: [] };

    return role.access.reduce(
      (acc, module) => {
        if (module.view === "admin") {
          acc.admin.push(module);
        } else {
          acc.client.push(module);
        }
        return acc;
      },
      { admin: [], client: [] }
    );
  }, [role]);
  return (
    role && (
      <>
        <NavigateBack to={"/roles"} />
        <div className="relative flex flex-col gap-4 bg-white p-4 rounded-md shadow-md">
          <div className="flex flex-col gap-2">
            {isEditing ? (
              <>
                <Label>Role Name</Label>
                <TextInput
                  id="name"
                  value={role.name}
                  className="w-fit"
                  onChange={handleChange}
                />
              </>
            ) : (
              <p className="font-semibold uppercase text-lg">{role.name}</p>
            )}
            {isEditing ? (
              <>
                <Label>Description</Label>
                <Textarea
                  id="description"
                  className="w-full max-w-sm lg:max-w-lg resize-none"
                  value={role.description}
                  onChange={handleChange}
                  color="gray"
                />
              </>
            ) : (
              <p className="indent-6">{role.description}</p>
            )}
          </div>
          <div className="absolute top-0 right-0 p-4 flex items-center gap-4">
            {!isEditing ? (
              <>
                <Link
                  to={`/roles/${role.role_id}/edit`}
                  className="flex items-center gap-2 text-sm bg-yellow-100 text-yellow-600 p-2.5 px-4 rounded-lg font-semibold"
                >
                  <MdModeEdit />
                  Edit Role
                </Link>
                {role.name.toLowerCase() !== "superadmin" && (
                  <Button
                    color="transparent"
                    className="bg-red-100 text-red-600"
                    onClick={() => toggleRole(role)}
                  >
                    Deactivate Role
                  </Button>
                )}
              </>
            ) : (
              <>
                <Button
                  color="transparent"
                  className="bg-green-200 text-green-600"
                  onClick={() =>
                    location.pathname.includes("edit")
                      ? handleUpdateRole()
                      : handleAddRole()
                  }
                >
                  Save Changes
                </Button>
              </>
            )}
          </div>
          <hr />
          <div className="flex flex-col gap-4">
            <Label>Permissions</Label>
            <Table>
              <Table.Head>
                <Table.HeadCell className="w-1/2">Module</Table.HeadCell>
                <Table.HeadCell align="center">View</Table.HeadCell>
                <Table.HeadCell align="center">Add</Table.HeadCell>
                <Table.HeadCell align="center">Edit</Table.HeadCell>
                <Table.HeadCell align="center">Delete</Table.HeadCell>
                {isEditing && (
                  <Table.HeadCell align="center">All</Table.HeadCell>
                )}
              </Table.Head>
              <Table.Body className="divide-y">
                {Object.keys(modulesByView).map((view) => {
                  const viewModules = modulesByView[view];
                  return (
                    <>
                      <Table.Row>
                        <Table.Cell className="capitalize font-bold">
                          {view}
                        </Table.Cell>
                        <Table.Cell align="center">
                          {isEditing ? (
                            <Checkbox
                              value={role[view]}
                              checked={role[view]}
                              onChange={(e) => {
                                const updatedRole = { ...role };
                                const { access } = updatedRole;
                                access.forEach((acc) => {
                                  if (acc.view === view) {
                                    acc.permissions = acc.permissions.map(
                                      (_, i) =>
                                        i === 0 ? e.target.checked : false
                                    );
                                  }
                                });
                                updatedRole[view] = e.target.checked;

                                setRole(updatedRole);
                              }}
                            />
                          ) : (
                            PermissionCheck(role[view])
                          )}
                        </Table.Cell>
                      </Table.Row>
                      {viewModules.map((module) => {
                        const { permissions } = module;
                        return (
                          <Table.Row key={module.module_id}>
                            <Table.Cell
                              className={classNames(
                                "capitalize pl-14 font-semibold",
                                { "pl-28": !module.is_parent }
                              )}
                            >
                              {module.name}
                            </Table.Cell>
                            {permissions.map((perm, permIndex) => {
                              return (
                                <Table.Cell align="center" key={permIndex}>
                                  {isEditing ? (
                                    <Checkbox
                                      value={perm}
                                      checked={perm}
                                      disabled={perm === null || !role[view]}
                                      onChange={(e) => {
                                        const updatedRole = { ...role };
                                        const { access } = updatedRole;
                                        const { permissions } = access.find(
                                          (acc) =>
                                            acc.module_id === module.module_id
                                        );
                                        permissions[permIndex] =
                                          e.target.checked;

                                        setRole(updatedRole);
                                      }}
                                    />
                                  ) : (
                                    PermissionCheck(perm)
                                  )}
                                </Table.Cell>
                              );
                            })}
                            {isEditing && (
                              <Table.Cell align="center">
                                {isEditing ? (
                                  <Checkbox
                                    value={permissions.every((perm) => perm)}
                                    checked={permissions.every((perm) => perm)}
                                    disabled={!role[view]}
                                    onChange={(e) => {
                                      const updatedRole = { ...role };
                                      const { access } = updatedRole;
                                      const { permissions } = access.find(
                                        (acc) =>
                                          acc.module_id === module.module_id
                                      );
                                      permissions.forEach(
                                        (_, index) =>
                                          (permissions[index] =
                                            e.target.checked)
                                      );

                                      setRole(updatedRole);
                                    }}
                                  />
                                ) : (
                                  PermissionCheck(
                                    permissions.every((perm) => perm)
                                  )
                                )}
                              </Table.Cell>
                            )}
                          </Table.Row>
                        );
                      })}
                    </>
                  );
                })}
              </Table.Body>
            </Table>
          </div>
        </div>
      </>
    )
  );
}

const PermissionCheck = (status) => {
  return status ? (
    <RiCheckboxFill className="text-xl text-green-400" />
  ) : (
    <MdDisabledByDefault className="text-xl text-slate-400" />
  );
};

export default ViewRole;
