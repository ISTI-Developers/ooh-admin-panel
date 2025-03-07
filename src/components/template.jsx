import { useState, useRef, Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import { BacklitBookButton, ParapetBookButton, EntryExitButton } from "./buttons/bookButtons";
import { SIZE, STATUS } from "~misc/generalAssets";
import { RouteDisplay } from "~misc/RouteDisplay";
import Legend from "./legend";
import backlitPic from "../assets/backlit_pic.jpg";
import { useStations } from "~/contexts/LRTContext";
import ContractTable from "./contractTable";
import { format } from "date-fns";
const Template = ({ station_id, station_name, backLitsSB, backLitsNB, parapetSB, parapetNB, SBentryExitButton, NBentryExitButton, southBound, northBound, handleSouthClick, handleNorthClick }) => {
  const { updateAsset, queryContracts, attachContract, queryAssetContracts, attachedContract } = useStations();
  const [selectedImage, setSelectedImage] = useState(null);
  const imageRef = useRef(null);
  const [selectedParapet, setSelectedParapet] = useState(null);
  const [selectedBacklit, setSelectedBacklit] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);

  const handleParapetClick = (parapet) => {
    setSelectedParapet(parapet);
    setSelectedStatus(parapet.asset_status);
    setSelectedSize(parapet.asset_size);
    setWidth(parapet.asset_dimension_width);
    setHeight(parapet.asset_dimension_height);
  };
  const handleBacklitClick = (backlit) => {
    setSelectedBacklit(backlit);
    setSelectedStatus(backlit.asset_status);
  };
  const closeModal = () => {
    setSelectedParapet(null);
  };
  const closeModal1 = () => {
    setSelectedBacklit(null);
  };
  const updateParapetButton = async () => {
    if (!selectedParapet) return;

    setLoading(true);
    try {
      const response = await updateAsset(selectedParapet.asset_id, {
        asset_status: selectedStatus,
        asset_size: selectedSize,
        asset_dimension_width: width,
        asset_dimension_height: height,
      });

      // alert("Parapet updated successfully!");
      console.log(response.data);
      // window.location.reload();
    } catch (error) {
      console.error("Error updating parapet:", error);
      alert("Failed to update parapet.");
    } finally {
      setLoading(false);
      setSelectedParapet(null);
    }
  };

  const updateBacklitButton = async () => {
    if (!selectedBacklit) return;
    setLoading(true);
    try {
      await updateAsset(selectedBacklit.asset_id, {
        asset_status: selectedStatus,
      });
      const contractData = {
        assetSalesOrderCode: selectedContract.SalesOrderCode,
        assetDateStart: selectedContract.DateRef1,
        assetDateEnd: selectedContract.DateRef2,
        stationId: station_id,
        assetId: 2,
        assetFacing: "SB",
        id: selectedBacklit.asset_id,
      };
      await attachContract(contractData);
      alert("Updated successfully!");
      // window.location.reload();
    } catch (error) {
      console.error("Error updating asset:", error);
      alert("Failed to update asset.");
    } finally {
      setLoading(false);
    }
  };
  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
  };
  const matchedContract = queryAssetContracts.find((contract) => contract.id === selectedBacklit?.asset_id);

  useEffect(() => {
    setSelectedContract(attachedContract);
  }, [attachedContract]);
  return (
    <div className="container">
      <header className="flex justify-center items-center mb-5">
        <h1 className="text-2xl font-bold text-center">{station_name} Station</h1>
      </header>
      <hr className="h-[3px] bg-black border-none" />
      <div>
        <h1 className="text-2xl font-bold text-center">SOUTH BOUND</h1>
        <div className="flex justify-evenly gap-1 mb-5">
          {backLitsSB.map((sbBackLit) => {
            return (
              <BacklitBookButton
                key={sbBackLit.asset_id}
                text={sbBackLit.asset_sales_order_code === "" ? sbBackLit.asset_id : sbBackLit.asset_sales_order_code}
                isDisabled={sbBackLit.asset_status === STATUS.TAKEN ? true : false}
                onClick={() => handleBacklitClick(sbBackLit)}
              />
            );
          })}
        </div>
        <div className="flex items-end justify-center gap-1">
          {parapetSB.map((parapet, index) => (
            <Fragment key={parapet.asset_id}>
              <ParapetBookButton
                text={parapet.asset_status === STATUS.BLOCKED ? "" : parapet.asset_status === STATUS.TAKEN ? parapet.owner : parapet.owner === "" ? parapet.asset_id : parapet.owner}
                isBlocked={parapet.asset_status === STATUS.BLOCKED ? true : false}
                isDisabled={parapet.asset_status === STATUS.TAKEN ? true : false}
                isLargeParapet={parapet.asset_size === SIZE.LARGE}
                isPending={parapet.asset_status === STATUS.PENDING ? true : false}
                widthLabel={parapet.asset_dimension_width}
                heightLabel={parapet.asset_dimension_height}
                onClick={() => handleParapetClick(parapet)}
              />
              {SBentryExitButton.includes(index) && <EntryExitButton key={`entry-exit-button-${index}`} />}
            </Fragment>
          ))}
        </div>
        <div className="w-full flex justify-center my-4">
          <RouteDisplay SouthBound={southBound} NorthBound={northBound} handleNorth={handleNorthClick} handleSouth={handleSouthClick} />
        </div>
        <div className="flex items-start justify-center gap-1">
          {parapetNB.map((parapet, index) => (
            <Fragment key={parapet.asset_id}>
              <ParapetBookButton
                text={parapet.asset_status === STATUS.BLOCKED ? "" : parapet.asset_status === STATUS.TAKEN ? parapet.owner : parapet.owner === "" ? parapet.asset_id : parapet.owner}
                isBlocked={parapet.asset_status === STATUS.BLOCKED ? true : false}
                isDisabled={parapet.asset_status === STATUS.TAKEN ? true : false}
                isLargeParapet={parapet.asset_size === SIZE.LARGE}
                isPending={parapet.asset_status === STATUS.PENDING ? true : false}
                widthLabel={parapet.asset_dimension_width}
                heightLabel={parapet.asset_dimension_height}
                onClick={() => handleParapetClick(parapet)}
              />
              {NBentryExitButton.includes(index) && <EntryExitButton key={`entry-exit-button-${index}`} />}
            </Fragment>
          ))}
        </div>

        <div className="flex justify-evenly gap-1 mt-5">
          {backLitsNB.map((nbBackLit) => {
            return (
              <BacklitBookButton
                key={nbBackLit.asset_id}
                text={nbBackLit.asset_sales_order_code === "" ? nbBackLit.asset_id : nbBackLit.asset_sales_order_code}
                isDisabled={nbBackLit.asset_status === STATUS.TAKEN ? true : false}
                onClick={() => setSelectedImage(backlitPic)}
              />
            );
          })}
        </div>
      </div>
      <h1 className="text-2xl font-bold text-center">NORTH BOUND</h1>
      <hr className="h-[3px] bg-black border-none" />
      <Legend />
      {selectedImage && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div ref={imageRef} className="relative">
            <img src={selectedImage} alt="Parapet" className="rounded-lg shadow-lg" />
          </div>
        </div>
      )}
      {selectedParapet && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-lg relative w-80">
            <h2 className="text-lg font-bold mb-2">{station_name}</h2>
            <h2 className="text-lg font-bold mb-2">{selectedParapet.asset_distinction} Parapet Details</h2>

            <label className="block text-sm font-medium">Asset Status:</label>
            <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="w-full p-2 border rounded mb-3">
              {Object.values(STATUS).map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>

            <label className="block text-sm font-medium">Asset Size:</label>
            <select value={selectedSize} onChange={(e) => setSelectedSize(e.target.value)} className="w-full p-2 border rounded mb-3">
              {Object.values(SIZE).map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <label className="block text-sm font-medium">Width:</label>
            <input type="text" value={width} onChange={(e) => setWidth(e.target.value)} className="w-full p-2 border rounded mb-3" />

            <label className="block text-sm font-medium">Height:</label>
            <input type="text" value={height} onChange={(e) => setHeight(e.target.value)} className="w-full p-2 border rounded mb-3" />

            <div className="flex justify-between">
              <button onClick={updateParapetButton} disabled={loading} className="px-4 py-2 bg-green-500 text-white rounded disabled:bg-gray-400">
                {loading ? "Updating..." : "Update"}
              </button>

              <button onClick={closeModal} className="px-4 py-2 bg-red-500 text-white rounded">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {selectedBacklit && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-lg relative w-2/5">
            <h2 className="text-lg font-bold mb-2">{station_name}</h2>
            <h2 className="text-lg font-bold mb-2">{selectedBacklit.asset_distinction} Backlit Details</h2>

            <label className="block text-sm font-medium">Asset Status:</label>
            <select value={selectedStatus} onChange={handleStatusChange} className="w-full p-2 border rounded mb-3">
              {Object.values(STATUS).map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>

            {matchedContract ? (
              <>
                <div className="space-y-2 text-sm mb-5 text-gray-700">
                  <p>
                    <span className="font-semibold">Sales Order Code: </span> {matchedContract.asset_sales_order_code}
                  </p>
                  <p>
                    <span className="font-semibold">Start Date: </span>
                    {format(new Date(matchedContract.asset_date_start), "MMMM dd, yyyy")}
                  </p>
                  <p>
                    <span className="font-semibold">End Date: </span>
                    {format(new Date(matchedContract.asset_date_end), "MMMM dd, yyyy")}
                  </p>
                </div>
              </>
            ) : (
              selectedContract && (
                <>
                  <h1 className="font-bold">Selected Contract</h1>
                  <ContractTable
                    code={selectedContract.SalesOrderCode || "N/A"}
                    reference={selectedContract.ReferenceNo || "N/A"}
                    orderDate={selectedContract.SalesOrderDate || "N/A"}
                    projDesc={selectedContract.ProjectDesc || "N/A"}
                    dateStart={selectedContract.DateRef1 || "N/A"}
                    dateEnd={selectedContract.DateRef2 || "N/A"}
                  />
                </>
              )
            )}
            <div className="flex justify-between">
              <button onClick={updateBacklitButton} disabled={loading} className="px-4 py-2 bg-green-500 text-white rounded disabled:bg-gray-400">
                {loading ? "Updating..." : "Update"}
              </button>
              <button onClick={closeModal1} className="px-4 py-2 bg-red-500 text-white rounded">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

Template.propTypes = {
  station_id: PropTypes.number.isRequired,
  station_name: PropTypes.string.isRequired,
  backLitsSB: PropTypes.array,
  backLitsNB: PropTypes.array,
  parapetSB: PropTypes.array,
  parapetNB: PropTypes.array,
  SBentryExitButton: PropTypes.array,
  NBentryExitButton: PropTypes.array,
  southBound: PropTypes.string,
  northBound: PropTypes.string,
  handleSouthClick: PropTypes.func,
  handleNorthClick: PropTypes.func,
  onParapetClick: PropTypes.func,
};

export default Template;
