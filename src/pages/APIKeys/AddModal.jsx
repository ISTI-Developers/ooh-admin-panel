/* eslint-disable react/prop-types */
import { addDays } from "date-fns";
import { Button, Label, Modal, Select, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { useAPIs } from "~contexts/APIContext";
import { mainButtonTheme } from "~misc/themes";

const AddModal = ({ open, onOpenChange }) => {
  const { generateAPIKey, addNewAPIKey, setRefresh } = useAPIs();
  const [data, setData] = useState({
    name: "",
    date_generated: new Date(),
    expiration: 60,
  });
  const [newAPI, setNewAPI] = useState("");
  const [keyVisible, setKeyVisibility] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    const newKey = {
      label: data.name,
      date_generated: data.date_generated.toISOString(),
      expiration:
        data.expiration === 0
          ? null
          : addDays(data.date_generated, data.expiration),
      key: newAPI,
    };

    const response = await addNewAPIKey(newKey);

    if (response.success) {
      setRefresh((prev) => (prev += 1));
      onOpenChange(false);
    }
  };

  useEffect(() => {
    const setup = async () => {
      const response = await generateAPIKey();
      setNewAPI(response.key);
    };
    setup();
  }, [open]);
  return (
    <Modal.Body>
      <div className="text-xs flex flex-col gap-2">
        <p>
          Generate a new API key. It will be shown only once — copy and store it
          securely.
        </p>
        <p>
          To use it, add it to your request headers as:
          <code className="bg-gray-200 px-1">x-api-key: YOUR_API_KEY_HERE</code>
        </p>
      </div>
      <form onSubmit={onSubmit} className="py-4 space-y-4">
        <div>
          <Label>Name</Label>
          <TextInput
            value={data.name}
            sizing="sm"
            onChange={(e) =>
              setData((prev) => {
                return { ...prev, name: e.target.value };
              })
            }
          />
        </div>
        <div>
          <Label>API Key</Label>
          <div className="flex border pr-4 rounded-md overflow-hidden bg-zinc-50">
            <input
              type={keyVisible ? "text" : "password"}
              value={newAPI}
              placeholder={
                newAPI.length === 0 ? "Generating key..." : "API Key"
              }
              className="w-full border-none text-xs bg-transparent disabled:bg-zinc-50 disabled:text-zinc-400"
              disabled
            />
            <button
              type="button"
              onClick={() => setKeyVisibility((prev) => !prev)}
              className="bg-zinc-50"
            >
              {keyVisible ? <BsEyeSlash /> : <BsEye />}
            </button>
          </div>
        </div>
        <div>
          <Label>Expiration</Label>
          <Select
            value={data.expiration}
            onChange={(e) =>
              setData((prev) => {
                return {
                  ...prev,
                  expiration: Number(e.target.value),
                };
              })
            }
          >
            <option value={30}>30 days</option>
            <option value={60}>60 days</option>
            <option value={360}>6 months</option>
            <option value={360}>1 year</option>
            <option value={0}>No expiration (Not recommended)</option>
          </Select>
        </div>
        <div className="flex justify-end gap-4 w-full pt-4">
          <Button
            color="transparent"
            type="submit"
            className="text-white bg-secondary-500 hover:bg-secondary rounded-md transition-all ml-auto"
            theme={mainButtonTheme}
          >
            Save
          </Button>
        </div>
      </form>
    </Modal.Body>
  );
};

export default AddModal;
