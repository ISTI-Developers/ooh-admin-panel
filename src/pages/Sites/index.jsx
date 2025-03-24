import { Button, Modal, Pagination, Table, Tooltip } from "flowbite-react";
import { FaPen, FaTrash } from "react-icons/fa6";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import { useServices } from "~/contexts/ServiceContext";
import { useSites } from "~/contexts/SiteContext";
import { useFunction } from "~/misc/functions";
import Loader from "~components/Loader";
import Title from "~components/Title";
import SiteInformation from "./SiteInformation";
import { useEffect, useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import BatchUpload from "./BatchUpload";
import SiteOptions from "./SiteOptions";

function Sites() {
  return (
    <>
      <div className="w-full flex flex-col gap-2 overflow-hidden">
        <div className="flex flex-col gap-4 ">
          <Routes>
            <Route path="/*" element={<Main />} />
            <Route path="/:id" element={<SiteInformation />} />
            <Route path="/:id/edit" element={<SiteInformation />} />
            <Route path="/add" element={<SiteInformation />} />
            <Route path="/batch-add" element={<BatchUpload />} />
          </Routes>
        </div>
      </div>
      <SiteModals />
    </>
  );
}

function Main() {
  const { results: sites, setSite, setModule } = useSites();
  const { capitalize } = useFunction();
  const { tooltipOptions } = useServices();
  const headers = ["image", "name", "location", "price"];

  const [sortedItems, setSortedItems] = useState(null);
  const [itemCount, setCount] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Calculate start and end index
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const onPageChange = (page) => setCurrentPage(page);

  useEffect(() => {
    if (sites) {
      let items = [...sites];
      setCount(items.length);
      items = items.sort((a, b) => a.site_id - b.site_id);
      setSortedItems(items.reverse().slice(startIndex, endIndex));
    }
  }, [endIndex, setSite, sites, startIndex]);
  return (
    <>
      <Title>Sites Management</Title>
      <SiteOptions />
      <Table hoverable>
        <Table.Head>
          {headers.map((header, index) => (
            <Table.HeadCell key={index} className="text-main-300">
              {capitalize(header, "_")}
            </Table.HeadCell>
          ))}
          <Table.HeadCell className="text-main-300" align="center">
            Actions
          </Table.HeadCell>
        </Table.Head>
        <Table.Body>
          {sortedItems && sortedItems?.length !== 0 ? (
            sortedItems.map((site, index) => {
              return (
                <Table.Row key={index}>
                  <Table.Cell className="w-[300px]">
                    {site.imageURL ? (
                      <img
                        src={site.imageURL}
                        alt={`${site.site_code} image not found`}
                        className="w-full"
                      />
                    ) : (
                      <>---</>
                    )}
                  </Table.Cell>
                  <Table.Cell className="max-w-[250px] font-semibold">
                    <Link to={`./${site.site_code}`}>{site.site_code}</Link>
                  </Table.Cell>
                  <Table.Cell className="text-xs">
                    <p>
                      <span>City: </span>
                      <span>{site.city}</span>
                    </p>
                    <p>
                      <span>Region: </span>
                      <span>{site.region}</span>
                    </p>
                    <p>
                      <span>{site.latitude}</span>,{" "}
                      <span>{site.longitude}</span>
                    </p>
                  </Table.Cell>
                  <Table.Cell>
                    {Intl.NumberFormat("en-PH", {
                      style: "currency",
                      currency: "PHP",
                    }).format(site.price || 0)}
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex items-center justify-evenly">
                      <Tooltip content="Edit" {...tooltipOptions}>
                        <Link to={`./${site.site_code}/edit`}>
                          <FaPen className="text-lg text-yellow-300" />
                        </Link>
                      </Tooltip>
                      <Tooltip content="Delete" {...tooltipOptions}>
                        <button
                          type="button"
                          onClick={() => {
                            setSite(site);
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
              {new Array(headers.length).fill("1rem").map((item, index) => {
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
function SiteModals() {
  const { site, setSite, module, doReload, deleteSite } = useSites();
  const { setAlert } = useServices();
  const navigate = useNavigate();
  const handleSiteDeletion = async () => {
    console.log(site.site_id);
    const response = await deleteSite(site.site_id);
    console.log(response);
    if (response?.success) {
      setSite(null);
      setAlert({
        isOn: true,
        type: "success",
        message: "This site has been deleted.",
      });
      doReload((prevState) => (prevState += 1));
      navigate("/sites");
    } else {
      setAlert({
        isOn: true,
        type: "failure",
        message: `An error occurred. Please try again.`,
      });
    }
  };

  return (
    <Modal
      show={site !== null}
      size="md"
      popup
      dismissible
      onClose={() => setSite(null)}
    >
      <Modal.Header />
      <Modal.Body>
        <div className="text-center flex flex-col items-center gap-2 px-2">
          <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200" />
          <h3 className="mb-3 text-main-500 text-center">
            Are you sure you want to {module} this site?
          </h3>
          <div className="flex justify-center gap-4 w-full">
            <Button
              color={/deactivate|delete/.test(module) ? "failure" : "success"}
              onClick={() => handleSiteDeletion()}
            >
              Yes, proceed
            </Button>
            <Button color="gray" onClick={() => setSite(null)}>
              No, cancel
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default Sites;
