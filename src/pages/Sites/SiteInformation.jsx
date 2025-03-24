/* eslint-disable react/prop-types */
import { Button, FileInput, Label, Select, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { RiExternalLinkFill } from "react-icons/ri";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSites } from "~/contexts/SiteContext";
import { useFunction } from "~/misc/functions";
import Title from "~components/Title";
import MapPicker from "./MapPicker";
import { mainButtonTheme } from "~/misc/themes";
import { useServices } from "~/contexts/ServiceContext";
import { format } from "date-fns";

function SiteInformation() {
  const { id } = useParams();
  const { retrieveSite, insertSite, updateSite, doReload, reload } = useSites();
  const { setAlert } = useServices();

  const [site, setSite] = useState();
  const [dimensions, setDimensions] = useState({
    length: "",
    width: "",
  });
  const [address, setAddress] = useState("");
  const [file, setFile] = useState(null);
  const [unit, setUnit] = useState("");
  const [center, setCenter] = useState(null);
  const navigate = useNavigate();

  const isEditable = /edit|add/.test(window.location.pathname);
  const details = ["segments", "type", "price", "board_facing"];
  const location = ["city", "region"];

  const handleChange = (e) => {
    // console.log(e.target.id, e.target.value);
    setSite((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };
  const onFileChange = (evt) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      // Access image contents from reader result
      const mediaContent = e.target.result;
      setSite((info) => {
        return {
          ...info,
          imageURL: mediaContent,
        };
      });
      setFile(evt.target.files[0]);
    };
    reader.readAsDataURL(evt.target.files[0]);
  };
  const handleMapChange = (lat, lng) => {
    setSite((prev) => {
      return {
        ...prev,
        latitude: lat,
        longitude: lng,
      };
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      ...site,
      size: `${dimensions.length}${unit} x ${dimensions.width}${unit}`,
    };

    data.site_code = format(new Date(), "MMMMMddyyHms");
    data.site_name = data.name;
    data.long = data.longitude;
    data.lat = data.latitude;
    data.imageURL =
      "https://img.freepik.com/free-psd/blank-billboard-mockup_53876-12218.jpg";
    delete data.name;
    delete data.longitude;
    delete data.latitude;
    const response = await insertSite(data);
    console.log(response);
    if (response?.success) {
      setAlert({
        isOn: true,
        type: "success",
        message: "Created a new site successfully.",
      });
      doReload((prevState) => (prevState += 1));

      navigate(`/sites`);
    }
  };
  const handleUpdate = async (e) => {
    e.preventDefault();
    const data = {
      ...site,
      size: `${dimensions.length}${unit} x ${dimensions.width}${unit}`,
    };

    data.site_name = data.name;
    data.long = data.longitude;
    data.lat = data.latitude;
    delete data.name;
    delete data.longitude;
    delete data.latitude;
    delete data.facing;
    delete data.access_type;
    // console.log(data);
    const response = await updateSite(data);
    // console.log(response);

    if (response?.success) {
      setAlert({
        isOn: true,
        type: "success",
        message: "Site information updated successfully",
      });
      doReload((prevState) => (prevState += 1));

      navigate(`/sites`);
    }
  };

  useEffect(() => {
    const setup = async () => {
      if (id) {
        const response = await retrieveSite(id);
        setSite(response);
        let dimensions = response.size;
        let units = response.size;
        dimensions = dimensions.match(/\d+/g);
        setDimensions({
          length: dimensions[0],
          width: dimensions[1],
        });
        setUnit(
          units
            .split(/\s+/)[0]
            .match(/[a-zA-Z]/g)
            .join("")
        );
        setCenter({
          lat: parseFloat(response.latitude),
          lng: parseFloat(response.longitude),
        });
      } else {
        setSite({
          site_code: "",
          name: "",
          site_owner: "",
          size: "",
          segments: "",
          type: "",
          price: "",
          board_facing: "",
          facing: "",
          access_type: "public",
          imageURL: null,
          city: "",
          region: "",
          latitude: "",
          longitude: "",
          ideal_view: "",
        });
      }
    };
    setup();
  }, [id, retrieveSite, reload]);
  return (
    site && (
      <div className="bg-white p-6 flex flex-col gap-4 shadow-lg">
        <Link to={`/sites`} className="underline">
          &#60; Back to sites
        </Link>
        {!isEditable && <Title>{site.id}</Title>}
        <form
          className="flex flex-col gap-4"
          encType="multipart/form-data"
          onSubmit={id ? handleUpdate : handleSubmit}
        >
          <div className="flex flex-col gap-1">
            {site.imageURL && (
              <img src={site.imageURL} alt="" className="w-full xl:w-1/3" />
            )}
            {isEditable && (
              <>
                <Label htmlFor="file" value="Billboard Photo" />
                <FileInput id="file" accept=".webp" onChange={onFileChange} />
              </>
            )}
          </div>
          <p className="font-bold uppercase">Basic Information</p>
          <div className="grid grid-cols-2 grid-rows-4 grid-flow-col gap-4">
            {["name", "site_owner"].map((detail) => {
              return (
                <FormGroup
                  key={detail}
                  isEditable={isEditable}
                  site={site}
                  item={detail}
                  onChange={handleChange}
                />
              );
            })}
            {/* <MultiFieldFormGroup
              isEditable={isEditable}
              site={dimensions}
              items={["length", "width"]}
              name="size"
              onChange={(e) => {
                setDimensions((dim) => {
                  return {
                    ...dim,
                    [e.target.id]: e.target.value,
                  };
                });
              }}
            /> */}
            <div className="flex items-center gap-4">
              <Label className="whitespace-nowrap w-1/4">Size</Label>
              {isEditable ? (
                <>
                  {["length", "width"].map((item) => {
                    return (
                      <TextInput
                        id={item}
                        key={item}
                        value={dimensions[item]}
                        className="w-2/5"
                        required
                        onChange={(e) => {
                          setDimensions((dim) => {
                            return {
                              ...dim,
                              [e.target.id]: e.target.value,
                            };
                          });
                        }}
                      />
                    );
                  })}
                  <Select
                    id="unit"
                    className="1/5"
                    onChange={(e) => {
                      setUnit(e.target.value);
                      if (unit === "ft" && e.target.value === "m") {
                        setDimensions((dim) => {
                          return {
                            length: dim.length / 3.281,
                            width: dim.width / 3.281,
                          };
                        });
                      }
                      if (unit === "m" && e.target.value === "ft") {
                        setDimensions((dim) => {
                          return {
                            length: dim.length * 3.281,
                            width: dim.width * 3.281,
                          };
                        });
                      }
                    }}
                  >
                    <option value="ft" selected={unit === "ft"}>
                      ft (Feet)
                    </option>
                    <option value="m" selected={unit === "m"}>
                      m (Meters)
                    </option>
                  </Select>
                  {/* <TextInput
                    id="unit"
                    value={unit}
                    className="w-1/2"
                    required
                    onChange={(e) => {
                      setUnit(e.target.value);
                    }}
                  /> */}
                </>
              ) : (
                <p className="w-3/4">
                  {[
                    ...["length", "width"].map((item) => {
                      return dimensions[item] + unit;
                    }),
                  ].join(" x ")}
                </p>
              )}
            </div>
            {details.map((detail) => {
              return (
                <FormGroup
                  key={detail}
                  isEditable={isEditable}
                  site={site}
                  item={detail}
                  onChange={handleChange}
                />
              );
            })}
          </div>
          <p className="font-bold uppercase">Location Information</p>
          <div className="grid grid-cols-2 grid-rows-4 grid-flow-col gap-4">
            {location.map((detail) => {
              return (
                <SelectGroup
                  key={detail}
                  item={detail}
                  site={site}
                  isEditable={isEditable}
                  onChange={handleChange}
                />
              );
            })}
            <MultiFieldFormGroup
              isEditable={isEditable}
              site={site}
              items={["latitude", "longitude"]}
              name="coordinates"
              onChange={handleChange}
            />
            <FormGroup
              key={"ideal_view"}
              isEditable={isEditable}
              site={site}
              item={"ideal_view"}
              onChange={handleChange}
            />
            {id || center ? (
              <MapPicker
                isEditable={isEditable}
                center={center}
                setCenter={setCenter}
                onChange={setAddress}
                handleMapChange={handleMapChange}
                item={address}
              />
            ) : (
              <MapPicker
                isEditable={isEditable}
                center={{
                  lat: 14.556289599266941,
                  lng: 121.00485772896641,
                }}
                setCenter={setCenter}
                onChange={setAddress}
                item={address}
              />
            )}
          </div>
          <div className="flex items-center  justify-end">
            {!isEditable && (
              <Button
                as={Link}
                type="submit"
                to="./edit"
                color="transparent"
                className="text-white bg-yellow-300 hover:bg-yellow-500 rounded-md transition-all"
                theme={mainButtonTheme}
              >
                Edit Site
              </Button>
            )}
          </div>
          {isEditable && (
            <div className="flex gap-4 justify-end">
              {id && (
                <Button as={Link} type="button" to={`../${id}`} color="gray">
                  Cancel
                </Button>
              )}
              <Button
                type="submit"
                color="transparent"
                className="text-white bg-secondary-500 hover:bg-secondary rounded-md transition-all"
                theme={mainButtonTheme}
              >
                {id ? "Save Changes" : "Submit"}
              </Button>
            </div>
          )}
        </form>
      </div>
    )
  );
}
const FormGroup = ({ isEditable, site, item, onChange }) => {
  const { capitalize } = useFunction();
  return (
    <div className="flex items-center gap-2">
      <Label htmlFor={item} className="whitespace-nowrap w-1/4">
        {capitalize(item, "_")}
      </Label>
      {isEditable ? (
        <TextInput
          id={item}
          value={site[item]}
          className="w-full"
          required
          onChange={onChange}
        />
      ) : item === "ideal_view" ? (
        <a
          href={site[item]}
          target="_blank"
          rel="noreferrer"
          className="p-2 w-3/4 text-secondary underline flex items-center"
        >
          Visit Link <RiExternalLinkFill />
        </a>
      ) : (
        <p className="p-2 w-3/4">
          {item !== "price"
            ? site[item]
            : Intl.NumberFormat("en-PH", {
                style: "currency",
                currency: "PHP",
              }).format(site[item])}
        </p>
      )}
    </div>
  );
};

const SelectGroup = ({ isEditable, site, item, onChange }) => {
  const { regionList: region } = useFunction();
  const { cities: city } = useSites();
  const options = {
    city: city,
    region: region,
  };
  return (
    <div className="flex items-center gap-2">
      <Label htmlFor={item} className="whitespace-nowrap w-1/4 capitalize">
        {item}
      </Label>
      {isEditable ? (
        // <TextInput
        //   id={detail}
        //   value={site[detail]}
        //   className="w-full"
        //   required
        //   onChange={handleChange}
        // />
        <Select id={item} className="w-full" onChange={onChange}>
          <option
            disabled
            className="capitalize"
            selected={site[item] === ""}
          >{`Select ${item}`}</option>
          {options[item].map((opt) => {
            return (
              <option
                key={opt}
                value={opt}
                selected={site[item] === opt}
                className="capitalize"
              >
                {opt}
              </option>
            );
          })}
        </Select>
      ) : (
        <p className="p-2 w-3/4">{site[item]}</p>
      )}
    </div>
  );
};
const MultiFieldFormGroup = ({ isEditable, site, name, items, onChange }) => {
  const { capitalize } = useFunction();
  return (
    <div className="flex items-center gap-4">
      <Label className="whitespace-nowrap w-1/4">{capitalize(name, "_")}</Label>
      {isEditable ? (
        items.map((item) => {
          return (
            <TextInput
              id={item}
              key={item}
              value={site[item]}
              className="w-1/2"
              required
              onChange={onChange}
            />
          );
        })
      ) : (
        <p className="w-3/4">
          {[
            ...items.map((item) => {
              return site[item];
            }),
          ].join(", ")}
        </p>
      )}
    </div>
  );
};
export default SiteInformation;
