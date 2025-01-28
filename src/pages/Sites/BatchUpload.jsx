import {
  Accordion,
  Button,
  FileInput,
  Modal,
  Select,
  Table,
  TextInput,
} from "flowbite-react";
import template from "../../assets/template.xlsx";
import Title from "~components/Title";
import { useEffect, useMemo, useState } from "react";
import * as XLSX from "xlsx";
import { FaArrowsRotate, FaTrash } from "react-icons/fa6";
import PropTypes from "prop-types";
import { useFunction } from "~/misc/functions";
import classNames from "classnames";
import {
  HiOutlineExclamationCircle,
  HiOutlineInformationCircle,
} from "react-icons/hi";
import { mainButtonTheme } from "~/misc/themes";
import { useServices } from "~/contexts/ServiceContext";
import { useSites } from "~/contexts/SiteContext";
import { Link, useNavigate } from "react-router-dom";

function BatchUpload() {
  const [data, setData] = useState(null);
  const [id, setId] = useState(null);
  const [upload, toggleUpload] = useState(false);
  const { setAlert, getInitials, setLoading } = useServices();
  const { doReload, getLastSiteCode, insertMultipleSites } = useSites();
  const navigate = useNavigate();

  const onRowDeletion = () => {
    setData((currentData) => {
      const tempData = [...currentData];
      tempData.splice(id, 1);
      return tempData;
    });

    setId(null);
  };

  // function approximateSizeInBytes(arr) {
  //   // Convert the array to a JSON string
  //   const jsonString = JSON.stringify(arr);

  //   // Calculate the length of the string in bytes
  //   const bytes = new TextEncoder().encode(jsonString).length;

  //   // Convert bytes to kilobytes (KB) or megabytes (MB)
  //   const kilobytes = bytes / 1024;
  //   // const megabytes = kilobytes / 1024;

  //   return kilobytes;
  // }
  const onUpload = async () => {
    let lastIndex = 0;
    const uploadData = data.map((item) => {
      const siteOwnerInitial = getInitials(item.site_owner);

      // Get the current site codes for this site owner initial
      let currentIndex = getLastSiteCode(siteOwnerInitial);

      // Set current index as last index if last index is not 0
      if (lastIndex !== 0) {
        currentIndex = lastIndex;
      }

      // Increment currentIndex for this item's new site code
      currentIndex++;
      lastIndex = String(currentIndex).padStart(4, "0");

      // Create the new code for this item
      const newCode = `${siteOwnerInitial}${lastIndex}`;
      item.type = item.type.toLowerCase();

      return {
        site_code: newCode,
        site: newCode,
        area: item.area,
        city: item.city,
        region: item.region,
        ...item,
        size: `${item.size_width}${item.size_unit} x ${item.size_height}${item.size_unit}`,
        imageURL:
          "https://img.freepik.com/free-psd/blank-billboard-mockup_53876-12218.jpg",
      };
    });
    toggleUpload(false);
    setLoading(true);

    // console.log(uploadData);
    const response = await insertMultipleSites(uploadData);
    // console.log(response);
    if (response?.success) {
      setLoading(false);
      setAlert({
        isOn: true,
        type: "success",
        message: "Batch upload success!",
      });
      doReload((prevState) => (prevState += 1));
      setTimeout(() => navigate(`/sites`), 1000);
    } else {
      setLoading(false);
      setAlert({
        isOn: true,
        type: "failure",
        message: response,
      });
    }
  };
  return (
    <>
      <Title>Batch Upload</Title>
      <Link to={`/sites`} className="underline">
        &#60; Back to sites
      </Link>
      <div className="bg-white p-4 w-full flex flex-col gap-4 overflow-x-auto">
        <Accordion flush>
          <Accordion.Panel>
            <Accordion.Title>Instructions</Accordion.Title>
            <Accordion.Content>
              <ol className="ml-4 list-decimal">
                <li>
                  Download the{" "}
                  <a
                    href={template}
                    className="underline text-secondary"
                    target="_blank"
                    rel="noreferrer"
                    download={"Batch Upload Template"}
                  >
                    template attached
                  </a>{" "}
                  and fill in all required details. Ensure no cells are left
                  empty.
                </li>
                <li>Upload the completed file below.</li>
                <li>
                  NOTE: The system only accepts up to <strong>100 rows</strong>.
                  For the ideal view, please enter the google maps street view
                  link.
                </li>
                <li>
                  Once uploaded, thoroughly review for any errors before saving.
                  Do not close the tab or the browser while the file is not
                  finished uploading yet.
                </li>
              </ol>
            </Accordion.Content>
          </Accordion.Panel>
        </Accordion>
        <FileUpload setData={setData} />
        {data ? (
          <>
            {data.length > 0 && (
              <>
                <p>Rows: {data.length}</p>
                <div className="w-full overflow-x-auto overflow-y-auto max-h-[500px] border rounded-md">
                  <DataTable data={data} setData={setData} setId={setId} />
                </div>
                <Button
                  color="transparent"
                  onClick={() => toggleUpload(true)}
                  className="text-white  bg-secondary hover:bg-secondary-hover w-fit rounded-md transition-all ml-auto"
                  theme={mainButtonTheme}
                >
                  Upload
                </Button>
              </>
            )}
          </>
        ) : (
          <div className="bg-slate-100 p-4 rounded-md text-center font-semibold text-slate-400">
            Please upload a file
          </div>
          // console.log(data)
        )}
      </div>
      <Modal
        show={id !== null}
        size="md"
        popup
        dismissible
        onClose={() => setId(null)}
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center flex flex-col items-center gap-2 px-2">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-3 text-main-500 text-center">
              Are you sure you want to delete this row?
            </h3>
            <div className="flex justify-center gap-4 w-full">
              <Button color="failure" onClick={onRowDeletion}>
                Yes, proceed
              </Button>
              <Button color="gray" onClick={() => setId(null)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      <Modal
        show={upload}
        size="md"
        popup
        dismissible
        onClose={() => toggleUpload(false)}
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center flex flex-col items-center gap-2 px-2">
            <HiOutlineInformationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-3 text-main-500 text-center">
              Upload these sites?
            </h3>
            <div className="flex justify-center gap-4 w-full">
              <Button
                color="transparent"
                className="text-white bg-secondary hover:bg-secondary-hover w-fit rounded-md transition-all"
                theme={mainButtonTheme}
                onClick={onUpload}
              >
                Yes, proceed
              </Button>
              <Button color="gray" onClick={() => toggleUpload(null)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

// function DataTable({ data, setData, setId }) {
//   const { batchUploadHeaders, toSpaced, capitalize } = useFunction();

//   const onChange = (e, rowIndex, fieldName) => {
//     const { value } = e.target;

//     setData((prevData) => {
//       return prevData.map((row, index) => {
//         if (index === rowIndex) {
//           return {
//             ...row,
//             [fieldName]: value,
//           };
//         }
//         return row;
//       });
//     });
//   };

//   return (
//     data && (
//       <Table className="w-full overflow-x-auto bg-white" hoverable>
//         <Table.Head>
//           <Table.HeadCell>#</Table.HeadCell>
//           {batchUploadHeaders.map((header) => {
//             return (
//               <Table.HeadCell key={header.name} className="sticky top-0">
//                 {toSpaced(header.name)}
//               </Table.HeadCell>
//             );
//           })}
//           <Table.HeadCell className="sticky top-0"></Table.HeadCell>
//         </Table.Head>
//         <Table.Body>
//           {data.map((item, key) => {
//             return (
//               <Table.Row key={key} className="divide-x">
//                 <Table.Cell>{key + 1}</Table.Cell>
//                 {batchUploadHeaders.map((field) => {
//                   return (
//                     <Table.Cell
//                       key={`${key}_${field.name}`}
//                       className="whitespace-nowrap"
//                     >
//                       {field.options ? (
//                         <Select
//                           sizing="sm"
//                           id={field.name}
//                           onChange={(e) => onChange(e, key, field.name)}
//                           className={classNames(
//                             "w-full",
//                             field.name === "region"
//                               ? "min-w-[250px]"
//                               : "min-w-[100px]"
//                           )}
//                         >
//                           <option
//                             selected={
//                               !item[field.name] || item[field.name] === ""
//                             }
//                           >
//                             {`select a ${field.name}`}
//                           </option>
//                           {field.options.map((option) => {
//                             return (
//                               <option
//                                 key={option}
//                                 value={option}
//                                 selected={
//                                   option.toLowerCase() ===
//                                   item[field.name]?.toLowerCase()
//                                 }
//                               >
//                                 {field.name === "size_unit"
//                                   ? option
//                                   : capitalize(option)}
//                               </option>
//                             );
//                           })}
//                         </Select>
//                       ) : (
//                         <TextInput
//                           id={field.name}
//                           className="w-full min-w-[175px]"
//                           onChange={(e) => onChange(e, key, field.name)}
//                           sizing="sm"
//                           value={item[field.name]}
//                         />
//                       )}
//                     </Table.Cell>
//                   );
//                 })}
//                 <Table.Cell>
//                   <button className="text-red-400" onClick={() => setId(key)}>
//                     <FaTrash />
//                   </button>
//                 </Table.Cell>
//               </Table.Row>
//             );
//           })}
//         </Table.Body>
//       </Table>
//     )
//   );
// }
function DataTable({ data, setData, setId }) {
  const { batchUploadHeaders, toSpaced, capitalize } = useFunction();
  const { setLoading } = useServices();
  // Memoize the table rows generation
  const tableRows = useMemo(() => {
    const onChange = (e, rowIndex, fieldName) => {
      const { value } = e.target;

      setData((prevData) => {
        return prevData.map((row, index) => {
          if (index === rowIndex) {
            return {
              ...row,
              [fieldName]: value,
            };
          }
          return row;
        });
      });
    };
    if (!data) return []; // Handle initial or null data

    return data.map((item, key) => (
      <Table.Row key={key} className="divide-x">
        <Table.Cell>{key + 1}</Table.Cell>
        {batchUploadHeaders.map((field) => {
          return (
            <Table.Cell
              key={`${key}_${field.name}`}
              className="whitespace-nowrap"
            >
              {field.options ? (
                <Select
                  sizing="sm"
                  id={field.name}
                  onChange={(e) => onChange(e, key, field.name)}
                  className={classNames(
                    "w-full",
                    field.name === "region" ? "min-w-[250px]" : "min-w-[175px]"
                    // field.name === "region" &&
                    //   !field.options.includes(item[field.name]) &&
                    //   "ring-2 ring-red-400 rounded-lg"
                  )}
                >
                  <option
                    selected={!item[field.name] || item[field.name] === ""}
                    disabled
                  >
                    {`select a ${field.name}`}
                  </option>
                  {field.options.map((option) => {
                    return (
                      <option
                        key={option}
                        value={option}
                        selected={
                          option?.toLowerCase() ===
                          item[field.name]?.toLowerCase()
                        }
                      >
                        {field.name === "size_unit"
                          ? option
                          : capitalize(option)}
                      </option>
                    );
                  })}
                </Select>
              ) : (
                <TextInput
                  id={field.name}
                  className="w-full min-w-[175px]"
                  onChange={(e) => onChange(e, key, field.name)}
                  sizing="sm"
                  value={item[field.name]}
                />
              )}
            </Table.Cell>
          );
        })}
        <Table.Cell>
          <button className="text-red-400" onClick={() => setId(key)}>
            <FaTrash />
          </button>
        </Table.Cell>
      </Table.Row>
    ));
  }, [data, setData, batchUploadHeaders, capitalize, setId]);

  useEffect(() => {
    setLoading(false);
  }, [setLoading]);
  return (
    <Table className="w-full overflow-x-auto bg-white animate-fade" hoverable>
      <Table.Head>
        <Table.HeadCell className="sticky top-0 z-[2]">#</Table.HeadCell>
        {batchUploadHeaders.map((header) => {
          return (
            <Table.HeadCell key={header.name} className="sticky top-0 z-[2]">
              {toSpaced(header.name)}
            </Table.HeadCell>
          );
        })}
        <Table.HeadCell className="sticky top-0 z-[2]"></Table.HeadCell>
      </Table.Head>
      <Table.Body>{tableRows}</Table.Body>
    </Table>
  );
}

function FileUpload({ setData }) {
  const { getAddressInformation } = useSites();
  const {
    batchUploadHeaders,
    locationMap,
    findClosestLocations,
    retrieveIdealViewCoordinates,
  } = useFunction();
  const [file, setFile] = useState(null);
  const { setLoading, setProgress, setAlert } = useServices();
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = async (event) => {
      const data = event.target.result;
      const processedData = processExcelData(data);

      if (processedData.length > 100) {
        setAlert({
          isOn: true,
          type: "failure",
          message:
            "File uploaded exceeded the row limit of 100. Please adjust your file.",
        });
        // setFile(null);
        return;
      }
      setFile(file);
      setLoading(true);

      const sitesData = [];

      const processItem = async (item) => {
        try {
          const address = await getAddressInformation(
            item.latitude,
            item.longitude
          );
          const [city, region] = address.filter(
            (component) =>
              component.types.includes("locality") ||
              component.types.includes("administrative_area_level_1")
          );

          // const city =
          //   address.city ||
          //   address.town ||
          //   address.state ||
          //   address.state_district ||
          //   address.village ||
          //   address.county;
          if (batchUploadHeaders[0].options) {
            if (!batchUploadHeaders[0].options.includes(city.long_name)) {
              batchUploadHeaders[0].options.push(city.long_name);
            }
          }

          const latLng = retrieveIdealViewCoordinates(item.ideal_view);
          const areas = findClosestLocations(latLng);
          let area_code;
          if (areas) {
            area_code = areas.map(({ ID }) => ID);
            area_code = area_code.join("_");
          } else {
            area_code = "N-A";
          }

          // console.log(area_code);
          return {
            ...item,
            // city: city,
            // region: address.region,
            area: area_code,
            city: locationMap[city.long_name]
              ? locationMap[city.long_name]
              : city.long_name,
            region: locationMap[region.long_name]
              ? locationMap[region.long_name]
              : region.long_name,
          };
        } catch (e) {
          console.log(e);
        }
      };

      // Loop through processedData with a delay of 1 second between iterations
      for (let i = 0; i < processedData.length; i++) {
        const item = processedData[i];
        // sitesData.push(item);
        const processedItem = await processItem(item);
        // console.log(processedItem);

        sitesData.push(processedItem);
        const progress = ((i + 1) / processedData.length) * 100;
        // console.log(progress);
        setProgress(progress);
        // Wait for 1 second before processing the next item
        // await new Promise((resolve) => setTimeout(resolve, 20));
      }

      setData(sitesData);
      setProgress(0);
    };
    reader.readAsArrayBuffer(file);
  };
  const processExcelData = (data) => {
    const workbook = XLSX.read(data, { type: "binary" });
    const sheetName = workbook.SheetNames[0]; // Assuming data is in the first sheet
    const sheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    // Convert array of arrays to array of objects
    const headers = jsonData[0];
    const formattedData = jsonData.slice(1).map((row) => {
      return headers.reduce((obj, header, index) => {
        obj[header] = row[index];
        return obj;
      }, {});
    });
    return formattedData;
  };
  return (
    <>
      <div className="flex items-center gap-4 p-4 border-4 rounded border-dashed">
        {!file ? (
          <>
            <label htmlFor="file" className="font-semibold">
              Upload the completed template here:
            </label>
            <FileInput
              id="file"
              onChange={handleFileChange}
              accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            />
          </>
        ) : (
          <>
            <label htmlFor="file" className="font-semibold">
              Selected file:
            </label>
            <p id="file" className="">
              {file.name}
            </p>
            <Button
              size="xs"
              color="gray"
              onClick={() => {
                setFile(null);
                setData(null);
              }}
            >
              <div className="flex gap-2 items-center">
                <FaArrowsRotate />
                <span>Change file</span>
              </div>
            </Button>
          </>
        )}
      </div>
    </>
  );
}

FileUpload.propTypes = {
  setData: PropTypes.func,
};
DataTable.propTypes = {
  data: PropTypes.array,
  setData: PropTypes.func,
  setId: PropTypes.func,
};
export default BatchUpload;
