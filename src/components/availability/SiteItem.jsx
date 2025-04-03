/* eslint-disable react/prop-types */
import {
  Badge,
  Button,
  Datepicker,
  Label,
  Modal,
  Select,
  Spinner,
  Table,
  Textarea,
  TextInput,
} from "flowbite-react";
import classNames from "classnames";
import { differenceInDays, format } from "date-fns";
import { AiFillEdit } from "react-icons/ai";
import { useEffect, useMemo, useState } from "react";
import { mainButtonTheme } from "~/misc/themes";
import { useServices } from "~/contexts/ServiceContext";
import { useUsers } from "~/contexts/UserContext";
import { useSites } from "~/contexts/SiteContext";
import { useFunction } from "~/misc/functions";
const SiteItem = ({ site, setSite }) => {
  const { insertSiteBooking, doReload } = useSites();
  const { currentUserRole, setAlert } = useServices();
  const [onEdit, setOnEdit] = useState(false);
  const [currentSite, setCurrentSite] = useState(null);
  const [onBook, setOnBook] = useState(false);
  const [proceed, setProceed] = useState(true);
  const [adjustmentReason, setAdjustmentReason] = useState(
    site.adjustment_reason ?? ""
  );
  const [date, setDate] = useState(site.adjusted_end_date ?? site.end_date);

  const onDateChange = () => {
    setSite((prev) => {
      const contracts = [...prev];
      const currentSite = contracts.find((item) => item.site === site.site);

      currentSite.adjusted_end_date = new Date(date).toISOString();
      currentSite.adjustment_reason = adjustmentReason;
      currentSite.modified = 1;

      return contracts;
    });
    setOnEdit(false);
  };

  const onClearDate = () => {
    setSite((prev) => {
      const contracts = [...prev];
      const currentSite = contracts.find((item) => item.site === site.site);

      delete currentSite.adjusted_end_date;
      delete currentSite.adjustment_reason;
      currentSite.modified = 1;
      return contracts;
    });
    setDate(site.end_date);
    setAdjustmentReason("");
  };

  const onBookSubmit = async (information) => {
    setProceed(false);
    information.start = new Date(information.start).toISOString();
    information.end = new Date(information.end).toISOString();
    
    information.site_rental = parseInt(siteRentals);
    information.old_client = site.product;
    const response = await insertSiteBooking(site.site, information);
    console.log(response);
    if (response.success) {
      setOnBook(false);
      setOnEdit(false);
      setProceed(true);
      setAlert({
        isOn: true,
        type: "success",
        message: `Booking created!`,
      });
      doReload((prev) => (prev += 1));
    } else {
      setAlert({
        isOn: true,
        type: "failure",
        message: response,
      });
    }
  };

  const hasAccess = useMemo(() => {
    if (!currentUserRole) return false;

    const access = currentUserRole.access;
    const availabilityAccess = access.find(
      (module) => module.name === "Availability"
    );
    if (availabilityAccess) {
      return availabilityAccess.permissions[2];
    }

    return false;
  }, [currentUserRole]);

  const onRemarksChange = (e) => {
    setSite((prev) =>
      prev.map((item) =>
        item === site ? { ...item, remarks: e.target.value } : item
      )
    );
  };

  const newRemainingDays = useMemo(() => {
    if (site.adjusted_end_date) {
      return differenceInDays(new Date(site.adjusted_end_date), new Date());
    }
    return site.remaining_days;
  }, [site.adjusted_end_date, site.remaining_days]);

  const siteRentals = useMemo(() => {
    let rental = 0;
    if (site.net_contract_amount) {
      switch (site.payment_term_id) {
        case 1:
          rental = site.net_contract_amount;
          break;
        case 2:
        case 5:
          rental = site.net_contract_amount / 12;
          break;
        case 3:
          rental = site.net_contract_amount / 6;
          break;
        case 4:
          rental = site.net_contract_amount / 3;
      }
    }
    return rental;
  }, []);

  return (
    <>
      {!proceed && (
        <div className="fixed top-0 left-0 w-dvw h-dvh bg-[#00000020] z-50 pointer-events-auto flex flex-col gap-2 items-center justify-center">
          <Spinner size="xl" />
          <p className="font-semibold text-cyan-600">Creating booking...</p>
        </div>
      )}
      <Table.Row
        id={site.site}
        className={classNames(
          "text-xs",
          site.adjusted_end_date
            ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
            : "",
          site.contract_changed
            ? "bg-green-100 text-green-700 hover:bg-green-200"
            : ""
        )}
      >
        <Table.Cell className="font-bold">{site.structure}</Table.Cell>
        <Table.Cell className="max-w-[300px]">{site.address}</Table.Cell>
        <Table.Cell>{site.site}</Table.Cell>
        <Table.Cell>
          {siteRentals === 0
            ? "---"
            : Intl.NumberFormat("en-PH", {
                style: "currency",
                currency: "PHP",
              }).format(siteRentals)}
        </Table.Cell>
        <Table.Cell className="max-w-[150px]">{site.product}</Table.Cell>
        <Table.Cell className={classNames("whitespace-nowrap")}>
          {site.adjusted_end_date || site.end_date ? (
            <div className="relative group">
              {format(
                new Date(site.adjusted_end_date ?? site.end_date),
                "MMM. dd, yyyy"
              )}
              {!site.days_vacant && hasAccess && (
                <button
                  type="button"
                  onClick={() => {
                    setOnEdit(true);
                    setCurrentSite(site);
                  }}
                  className="absolute right-0 top-0 opacity-0 text-lg pointer-events-none group-hover:pointer-events-auto group-hover:opacity-100"
                >
                  <AiFillEdit />
                </button>
              )}
            </div>
          ) : (
            "---"
          )}
        </Table.Cell>
        <Table.Cell className="text-center max-w-[50px]">
          {newRemainingDays ?? "---"}
        </Table.Cell>
        <Table.Cell className="text-center max-w-[50px]">
          {site.days_vacant ?? "---"}
        </Table.Cell>
        <Table.Cell className="">
          {hasAccess ? (
            <Textarea
              className="min-h-[35px] bg-transparent shadow"
              onChange={onRemarksChange}
              value={site.remarks}
            />
          ) : site.remarks ? (
            <p className="p-2 rounded-md">{site.remarks}</p>
          ) : (
            "---"
          )}
        </Table.Cell>
        <Table.Cell align="center">
          {newRemainingDays <= 60 || !newRemainingDays ? (
            <Button
              className="text-white bg-secondary-500 hover:bg-secondary rounded-lg px-4 transition-all"
              size="xs"
              theme={mainButtonTheme}
              onClick={() => setOnBook(true)}
            >
              Book
            </Button>
          ) : (
            <Badge className="w-fit p-2 px-4 rounded-lg" color="success">
              Booked
            </Badge>
          )}
        </Table.Cell>
      </Table.Row>
      {currentSite && (
        <Modal
          show={onEdit}
          size="xl"
          dismissible
          onClose={() => setOnEdit(false)}
        >
          <Modal.Header>
            <p className="font-bold">Override Date | {currentSite.site}</p>
          </Modal.Header>
          <Modal.Body>
            <div className="grid grid-cols-2 gap-4">
              <Label value="Original date:" />
              <p className="text-sm p-2 border-gray-100">
                {format(new Date(currentSite.end_date), "MMMM d, yyyy")}
              </p>
              <Label id="date" value="Updated date:" />
              <input
                type="date"
                id="date"
                min={format(new Date(currentSite.end_date), "yyyy-MM-dd")}
                value={format(new Date(date), "yyyy-MM-dd")}
                onChange={(e) => setDate(e.target.value)}
                className=" rounded-md border-gray-100 shadow"
              />
              <Label id="date" value="Adjustment reason:" />
              <Textarea
                id="reason"
                onChange={(e) => setAdjustmentReason(e.target.value)}
                value={adjustmentReason}
                className="bg-white shadow border-gray-100 resize-none h-[100px]"
                required
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <div className="flex justify-end gap-4 w-full">
              {currentSite.adjusted_end_date && (
                <Button
                  size="sm"
                  color=""
                  type="button"
                  className="px-2 text-red-400 mr-auto"
                  onClick={onClearDate}
                >
                  Clear
                </Button>
              )}
              <Button
                size="sm"
                color="success"
                className="px-2"
                onClick={onDateChange}
              >
                Save
              </Button>
              <Button size="sm" color="gray" onClick={() => setOnEdit(false)}>
                Cancel
              </Button>
            </div>
          </Modal.Footer>
        </Modal>
      )}
      <BookingModal
        onBook={onBook}
        setOnBook={setOnBook}
        site={site}
        proceed={proceed}
        onBookSubmit={onBookSubmit}
      />
    </>
  );
};

const BookingModal = ({ onBook, setOnBook, site, onBookSubmit, proceed }) => {
  const { retrieveAccountExecutives } = useUsers();
  const [accounts, setAccounts] = useState([]);
  const [information, setInformation] = useState({
    srp: 0,
    booking_status: "NEW",
    client: "",
    account_executive: null,
    start: new Date(),
    end: new Date(),
    monthly_rate: 0,
    remarks: "",
  });
  const [onConfirm, setConfirm] = useState(false);

  const onInformationChange = (e) => {
    const { id, value } = e.target;
    const isNumber = ["srp", "monthly_rate"].includes(id);
    setInformation((prev) => {
      return {
        ...prev,
        [id]: isNumber ? e.target.valueAsNumber : value,
      };
    });
  };

  const canSubmit = useMemo(() => {
    return (
      information.srp !== 0 &&
      information.client !== "" &&
      information.account_executive !== null &&
      information.monthly_rate !== 0
    );
  }, [information]);

  useEffect(() => {
    const setup = async () => {
      if (!onBook) return;
      const response = await retrieveAccountExecutives();
      setAccounts(response);
    };
    setup();
  }, [onBook]);

  useEffect(() => {
    setInformation({
      srp: 0,
      booking_status: "NEW",
      client: "",
      account_executive: null,
      start: new Date(),
      end: new Date(),
      monthly_rate: 0,
      remarks: "",
    });
  }, [onBook]);
  return (
    <>
      <Modal show={onBook} size="2xl" onClose={() => setOnBook(false)}>
        <Modal.Header>
          <p className="text-base font-bold">Book {site.site}</p>
        </Modal.Header>
        <Modal.Body>
          <form className="flex flex-col gap-4">
            <BookingFormItem id="srp" label="SRP">
              <TextInput
                id="srp"
                type="number"
                min={0}
                step={0.5}
                value={information.srp}
                onChange={onInformationChange}
                className="rounded-md border-gray-100 shadow"
                required
              />
            </BookingFormItem>
            <BookingFormItem id="booking_status">
              <Select
                id="booking_status"
                className="rounded-md border-gray-100 shadow capitalize"
                required
                value={information.booking_status}
                onChange={onInformationChange}
              >
                {[
                  "NEW",
                  "RENEWAL",
                  "QUEUEING",
                  "RELOCATION",
                  "CHANGE OF CONTRACT PERIOD",
                ].map((opt) => {
                  return (
                    <option
                      value={opt}
                      key={opt}
                      className="capitalize"
                      selected={information.booking_status === opt}
                    >
                      {opt}
                    </option>
                  );
                })}
              </Select>
            </BookingFormItem>
            <BookingFormItem id="client">
              <TextInput
                id="client"
                className="rounded-md border-gray-100 shadow"
                value={information.client}
                onChange={onInformationChange}
                required
              />
            </BookingFormItem>
            <BookingFormItem id="account_executive">
              <Select
                id="account_executive"
                className="rounded-md border-gray-100 shadow"
                value={information.account_executive}
                onChange={onInformationChange}
                required
              >
                <option selected disabled>
                  --Select Account Executive--
                </option>
                {accounts.map((account) => {
                  return (
                    <option
                      key={account.full_name}
                      value={account.full_name}
                      selected={
                        information.account_executive === account.full_name
                      }
                    >
                      {account.full_name}
                    </option>
                  );
                })}
                <option
                  value="other"
                  selected={information.account_executive === "other"}
                >
                  Other
                </option>
              </Select>
            </BookingFormItem>
            <hr />
            <div className="flex flex-col gap-4">
              <Label htmlFor="" value="Term Details" />
              <BookingFormItem id="duration">
                <div className="flex items-center gap-4">
                  <input
                    type="date"
                    id="start"
                    min={format(new Date(), "yyyy-MM-dd")}
                    value={format(new Date(information.start), "yyyy-MM-dd")}
                    onChange={(e) => {
                      const date = new Date(e.target.value);
                      if (!isNaN(date)) {
                        setInformation((prev) => ({
                          ...prev,
                          start: date,
                        }));
                      }
                    }}
                    className="rounded-md border-gray-100 shadow w-full"
                  />
                  <span>to</span>
                  <input
                    type="date"
                    id="end"
                    min={format(new Date(information.start), "yyyy-MM-dd")}
                    value={format(new Date(information.end), "yyyy-MM-dd")}
                    onChange={(e) => {
                      const date = new Date(e.target.value);
                      if (!isNaN(date)) {
                        setInformation((prev) => ({
                          ...prev,
                          end: date,
                        }));
                      }
                    }}
                    className="rounded-md border-gray-100 shadow w-full"
                  />
                </div>
              </BookingFormItem>
              <BookingFormItem id="monthly_rate" label="Monthly Rate">
                <TextInput
                  id="monthly_rate"
                  type="number"
                  min={0}
                  step={0.5}
                  value={information.monthly_rate}
                  onChange={onInformationChange}
                  className="rounded-md border-gray-100 shadow"
                  required
                />
              </BookingFormItem>
            </div>
            <hr />
            <BookingFormItem id="remarks">
              <Textarea
                id="remarks"
                className="rounded-md border-gray-300 shadow max-h-[400px]"
                value={information.remarks}
                onChange={onInformationChange}
              />
            </BookingFormItem>
          </form>
          {onConfirm && (
            <Modal size="md" show dismissible onClose={() => setConfirm(false)}>
              <Modal.Header>Booking Confirmation</Modal.Header>
              <Modal.Body>
                <div className="space-y-4">
                  <p>Are you sure with these details?</p>
                  <BookingSummary information={information} site={site.site} />
                </div>
              </Modal.Body>
              <Modal.Footer>
                <div className="flex justify-end gap-4 w-full">
                  <Button
                    size="sm"
                    color="success"
                    disabled={!proceed}
                    className="px-2"
                    onClick={() => onBookSubmit(information)}
                  >
                    Proceed
                  </Button>
                  <Button
                    size="sm"
                    color="gray"
                    onClick={() => setConfirm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </Modal.Footer>
            </Modal>
          )}
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end gap-4 w-full">
            <Button
              size="sm"
              color="success"
              className="px-2"
              disabled={!canSubmit}
              onClick={() => setConfirm(true)}
            >
              Submit
            </Button>
            <Button size="sm" color="gray" onClick={() => setOnBook(false)}>
              Cancel
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

const BookingSummary = ({ information, site }) => {
  const { capitalize } = useFunction();
  return (
    <table>
      <tbody>
        <tr>
          <td className="pr-2">
            <p className="font-semibold">Site Code:</p>
          </td>
          <td className="pl-4">
            <p>{site}</p>
          </td>
        </tr>
        {Object.keys(information).map((key) => {
          return (
            <tr key={key}>
              <td className="pr-2 py-1">
                <p
                  className={classNames(
                    "font-semibold",
                    key === "srp" ? "uppercase" : ""
                  )}
                >
                  {capitalize(key, "_")}:
                </p>
              </td>
              <td className="pl-4">
                <p>
                  {information[key]
                    ? ["start", "end"].includes(key)
                      ? format(new Date(information[key]), "MMMM dd, yyyy")
                      : ["srp", "monthly_rate"].includes(key)
                      ? Intl.NumberFormat("en-PH", {
                          style: "currency",
                          currency: "PHP",
                        }).format(information[key])
                      : information[key]
                    : "---"}
                </p>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

const BookingFormItem = ({ id, label, children }) => {
  return (
    <div className="grid grid-cols-[1fr_2fr] gap-4 items-center">
      <Label
        htmlFor={id}
        value={label ? label : id.split("_").join(" ")}
        className="capitalize"
      />
      {children}
    </div>
  );
};

export default SiteItem;
