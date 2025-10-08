import classNames from "classnames";
import { differenceInDays, format } from "date-fns";
import {
  Badge,
  Button,
  Modal,
  Table,
  TextInput,
  Tooltip,
} from "flowbite-react";
import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { GoCircleSlash } from "react-icons/go";
import { useFunction } from "~/misc/functions";
import Title from "~components/Title";
import { APIProvider, useAPIs } from "~contexts/APIContext";
import { useServices } from "~contexts/ServiceContext";
import { mainButtonTheme } from "~misc/themes";
import AddModal from "./AddModal";

const APIKeys = () => {
  const [modal, toggleModal] = useState(false);
  return (
    <APIProvider>
      <div className="w-full flex flex-col gap-2 overflow-hidden">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between">
            <Title>API Keys</Title>
            <Button
              onClick={() => toggleModal(true)}
              color="transparent"
              className="text-white bg-secondary-500 hover:bg-secondary rounded-md transition-all ml-auto"
              theme={mainButtonTheme}
            >
              Generate New API Key
            </Button>
          </div>
          <Main />
          <Modal id="add" show={modal} onClose={() => toggleModal(false)}>
            <Modal.Header>Get New API Key</Modal.Header>
            <AddModal open={modal} onOpenChange={toggleModal} />
          </Modal>
        </div>
      </div>
    </APIProvider>
  );
};

const Main = () => {
  const { capitalize } = useFunction();
  const { retrieveAPIs, deleteAPIKey, refresh, setRefresh } = useAPIs();
  const { tooltipOptions } = useServices();

  const [apis, setAPIs] = useState(null);
  const [api, setAPI] = useState(null);
  const [action, setAction] = useState(null);
  const [passphrase, setPassphrase] = useState("");

  const onDeleteClick = async (id) => {
    const response = await deleteAPIKey(id);
    if (response.success) {
      setRefresh((prev) => (prev += 1));
      setAPI(null);
      setAction(null);
      setPassphrase("");
    }
  };

  useEffect(() => {
    console.count("render");
    const setup = async () => {
      const response = await retrieveAPIs();
      setAPIs(response);
    };

    setup();
  }, [refresh]);

  return (
    <div className="max-h-[70vh] rounded-md overflow-y-auto">
      <Table hoverable>
        <Table.Head>
          {["label", "status", "validity", "action"].map((header, index) => (
            <Table.HeadCell
              key={index}
              className={classNames(
                "text-main-300 sticky top-0 z-[2]",
                header === "remaining_days"
                  ? " max-w-[100px] text-center text-wrap"
                  : ""
              )}
            >
              {capitalize(header, "_")}
            </Table.HeadCell>
          ))}
        </Table.Head>
        <Table.Body>
          {apis ? (
            apis.map((api) => {
              return (
                <Table.Row key={api.id}>
                  <Table.Cell className="font-semibold">{api.label}</Table.Cell>
                  <Table.Cell>
                    <Badge
                      color={
                        api.expiration
                          ? differenceInDays(
                              new Date(api.expiration),
                              new Date()
                            ) > 0
                            ? "green"
                            : "red"
                          : api.status === 1
                          ? "green"
                          : "red"
                      }
                      className="w-fit"
                    >
                      {api.expiration
                        ? differenceInDays(
                            new Date(api.expiration),
                            new Date()
                          ) > 0
                          ? "ACTIVE"
                          : "EXPIRED"
                        : api.status === 1
                        ? "ACTIVE"
                        : "EXPIRED"}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <div>
                      <p>
                        {`created on ${format(
                          new Date(api.date_generated),
                          "PPP"
                        )}`}
                      </p>
                      {api.expiration
                        ? `valid until ${format(
                            new Date(api.expiration),
                            "PPP"
                          )}`
                        : `Valid until deletion`}
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex gap-4">
                      <Tooltip content="Disable" {...tooltipOptions}>
                        <button
                          type="button"
                          onClick={() => {
                            setAPI(api);
                            setAction("disable");
                          }}
                        >
                          <GoCircleSlash className="text-yellow-400" />
                        </button>
                      </Tooltip>
                      <Tooltip content="Delete" {...tooltipOptions}>
                        <button
                          type="button"
                          onClick={() => {
                            setAPI(api);
                            setAction("delete");
                          }}
                        >
                          <FaTrash className="text-red-400" />
                        </button>
                      </Tooltip>
                    </div>
                  </Table.Cell>
                </Table.Row>
              );
            })
          ) : (
            <Table.Row>
              <Table.Cell colSpan={4}>
                No keys found. Generate one now!
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
      <Modal show={api !== null} popup dismissible onClose={() => setAPI(null)}>
        {api && (
          <>
            <Modal.Header className="p-4 px-6 capitalize">
              {action} Key
            </Modal.Header>
            <Modal.Body>
              {action === "delete" ? (
                <div
                  className="flex flex-col gap-4"
                  onCopy={(e) => e.preventDefault()}
                >
                  <p className="select-none">
                    Are you sure you want to delete this key? This action cannot
                    be undone. Please enter the API key name,{" "}
                    <span
                      className="font-semibold underline text-zinc-500"
                      onCopy={(e) => e.preventDefault()}
                    >
                      {api.label}
                    </span>
                    , below to delete the key.
                  </p>
                  <TextInput
                    value={passphrase}
                    onChange={(e) => setPassphrase(e.target.value)}
                  />
                </div>
              ) : (
                <p>
                  Are you sure you want to disable this key? You may not be able
                  to use this key temporarily until you enable it.
                </p>
              )}
            </Modal.Body>
            <Modal.Footer>
              <div
                className="flex justify-end gap-4 w-full data-[match=false]:opacity-50 data-[match=false]:pointer-events-none"
                data-match={api.label === passphrase}
              >
                <Button color="failure" onClick={() => setAPI(null)}>
                  No, cancel
                </Button>
                <Button color="gray" onClick={() => onDeleteClick(api.id)}>
                  Yes, proceed
                </Button>
              </div>
            </Modal.Footer>
          </>
        )}
      </Modal>
    </div>
  );
};
export default APIKeys;
