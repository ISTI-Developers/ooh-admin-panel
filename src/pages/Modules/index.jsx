import { Button, Label, Modal, Radio, Table, TextInput } from "flowbite-react";
import { PiArrowBendDownRightBold } from "react-icons/pi";
import { useMemo, useState } from "react";
import { useRoles } from "~/contexts/RoleContext";
import { useServices } from "~/contexts/ServiceContext";
import { mainButtonTheme } from "~/misc/themes";
import Title from "~components/Title";

function Modules() {
  const { modules, toggleModuleStatus, createModule, doReload } = useRoles();
  const { setAlert } = useServices();
  const [module, setModule] = useState(null);
  const [view, setView] = useState("client");
  const [name, setName] = useState("");
  const [modal, toggleModal] = useState(false);

  const updateModule = async () => {
    if (module) {
      console.log(!module.status);
      await toggleModuleStatus(module.module_id, !module.status);
      doReload((prev) => (prev = prev + 1));
      setModule(null);
      setAlert({
        isOn: true,
        type: "success",
        message: `Module status updated successfully`,
      });
    }
  };

  const addModule = async () => {
    const newModule = {
      name: name,
      is_parent: true,
      view: view,
    };
    const response = await createModule(newModule);
    if (response) {
      doReload((prev) => (prev = prev + 1));
      toggleModal(false);
      setAlert({
        isOn: true,
        type: "success",
        message: `New module added successfully`,
      });
    }
  };

  const modulesWithChildren = useMemo(() => {
    if (!modules) return [];

    return modules.reduce((acc, module) => {
      if (module.is_parent) {
        acc.push(module);
      }
      const children = modules.filter((m) => m.parent_id === module.module_id);

      if (children.length) {
        acc[acc.length - 1].children = children;
      }
      return acc;
    }, []);
  }, [modules]);

  return (
    <>
      <div className="w-full flex flex-col gap-4 max-h-[calc(100vh-96px)] overflow-y-auto">
        <div className="flex items-center gap-4">
          <Title>Modules Management</Title>
          <Button
            onClick={() => toggleModal(true)}
            color="transparent"
            className="text-white bg-secondary-500 hover:bg-secondary rounded-md transition-all ml-auto"
            theme={mainButtonTheme}
          >
            Add Module
          </Button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto rounded-md shadow-lg">
          <Table hoverable>
            <Table.Head className="sticky top-0 z-10">
              <Table.HeadCell className="">Name</Table.HeadCell>
              <Table.HeadCell align="center" className="w-full">
                Actions
              </Table.HeadCell>
            </Table.Head>
            <Table.Body
              theme={{
                base: "group/body",
                cell: {
                  base: "px-4 py-2 ",
                },
              }}
            >
              {modulesWithChildren &&
                modulesWithChildren.map((module) => {
                  const children = module.children;
                  return (
                    <>
                      <Table.Row
                        key={module.id}
                        theme={{
                          hovered: "hover:bg-gray-100 dark:hover:bg-gray-600",
                        }}
                      >
                        <Table.Cell className="font-semibold">
                          {module.name}
                        </Table.Cell>
                        <Table.Cell align="center" className="w-full">
                          <div>
                            <label className="inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                value={module.status}
                                checked={module.status}
                                className="sr-only peer"
                                onChange={() => {
                                  setModule(module);
                                }}
                              />
                              <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:green-500 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-400"></div>
                            </label>
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      {children && console.log(children)}
                      {children &&
                        children.map((child) => {
                          return (
                            <Table.Row
                              key={child.module_id}
                              className="bg-gray-50"
                              theme={{
                                hovered:
                                  "hover:bg-gray-100 dark:hover:bg-gray-600",
                              }}
                            >
                              <Table.Cell className="pl-8 font-semibold">
                                <div className="flex items-center gap-2">
                                  <PiArrowBendDownRightBold />
                                  <p>{child.name}</p>
                                </div>
                              </Table.Cell>
                              <Table.Cell align="center" className="w-full">
                                <div>
                                  <label className="inline-flex items-center cursor-pointer">
                                    <input
                                      type="checkbox"
                                      value={child.status}
                                      checked={child.status}
                                      className="sr-only peer"
                                      onChange={() => {
                                        setModule(child);
                                      }}
                                    />
                                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:green-500 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-400"></div>
                                  </label>
                                </div>
                              </Table.Cell>
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
      <Modal
        show={module !== null}
        popup
        dismissible
        onClose={() => setModule(null)}
      >
        {module && (
          <>
            <Modal.Header>{module.name}</Modal.Header>
            <Modal.Body>
              <div className="flex flex-col gap-4">
                Are you sure you want to change the status of this module?
              </div>
            </Modal.Body>
            <Modal.Footer>
              <div className="flex justify-end gap-4 w-full">
                <Button color="failure" onClick={() => updateModule()}>
                  Yes, proceed
                </Button>
                <Button color="gray" onClick={() => setModule(null)}>
                  No, cancel
                </Button>
              </div>
            </Modal.Footer>
          </>
        )}
      </Modal>
      <Modal show={modal} popup dismissible onClose={() => toggleModal(false)}>
        <Modal.Header>Add New Module</Modal.Header>
        <Modal.Body>
          <div className="flex flex-col gap-4">
            <Label
              htmlFor="moduleName"
              className="block text-sm font-medium text-gray-700"
            >
              Module Name
            </Label>
            <TextInput
              id="moduleName"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <p className="font-semibold text-sm">Module View</p>
            <div className="flex gap-8">
              <RadioButton
                id="admin"
                name="view"
                value={view}
                onChange={(value) => setView(value)}
              />
              <RadioButton
                id="client"
                name="view"
                value={view}
                onChange={(value) => setView(value)}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end gap-4 w-full">
            <Button
              color="success"
              type="button"
              onClick={addModule}
              disabled={!name || !view}
            >
              Submit
            </Button>
            <Button
              color="gray"
              type="button"
              onClick={() => toggleModal(false)}
            >
              Cancel
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
}

const RadioButton = ({ id, name, value, onChange }) => {
  return (
    <div className="space-x-4">
      <Radio
        id={id}
        name={name}
        value={id}
        checked={value === id}
        onChange={(e) => onChange(e.target.value)}
      />
      <Label htmlFor={id} className="inline-flex items-center capitalize">
        {id}
      </Label>
    </div>
  );
};
export default Modules;
