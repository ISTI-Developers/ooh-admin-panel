import classNames from "classnames";
import { Button, Modal, Table } from "flowbite-react";
import { useEffect, useMemo, useState } from "react";
import { useSites } from "~/contexts/SiteContext";
import { useFunction } from "~/misc/functions";
import { mainButtonTheme } from "~/misc/themes";
import Title from "~components/Title";
import SiteItem from "~components/availability/SiteItem";
import SearchAndFilter from "./SearchAndFilter";
import { differenceInDays, format, getYear } from "date-fns";
import { useServices } from "~/contexts/ServiceContext";

function SiteAvailability() {
  const { currentUserRole } = useServices();
  const { capitalize } = useFunction();
  const { getAvailableSites, insertAvailableSites, getSiteBooking } =
    useSites();
  const [availableSites, setAvailableSites] = useState([]);
  const [modal, toggleModal] = useState(false);
  const [query, setQuery] = useState({
    search: "",
    show: {
      key: "available",
      condition: 0,
    },
  });
  const [bookings, setBookings] = useState([]);

  const eligibleSites = useMemo(() => {
    return availableSites.filter((site) => site.modified) ?? [];
  }, [availableSites]);

  const handleSubmit = async () => {
    const updatedAvailableSites = eligibleSites.map((contract) => [
      contract.site,
      contract.product,
      contract.end_date,
      contract.adjusted_end_date,
      contract.adjustment_reason,
      contract.remarks,
      contract.contract_no,
    ]);

    const response = await insertAvailableSites(updatedAvailableSites);
    console.log(response);
  };

  const handleUpdateQuery = (...params) => {
    if (params.length === 1) {
      setQuery((prev) => ({
        ...prev,
        search: params[0],
      }));
    } else {
      setQuery((prev) => ({
        ...prev,
        [params[0]]: {
          key: params[1],
          condition: params[2],
        },
      }));
    }
  };

  const headers = [
    "structure",
    "address",
    "site",
    "site rental",
    "brand",
    "end_date",
    "remaining_days",
    "days_vacant",
  ];

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

  useEffect(() => {
    const setup = async () => {
      const response = await getAvailableSites();
      const res = await getSiteBooking();
      setBookings(res);
      setAvailableSites(response);
    };
    setup();
  }, []);

  const filteredSites = useMemo(() => {
    const { search, show } = query;
    const keys = [
      "structure",
      "area",
      "city_name",
      "address",
      "site",
      "brand",
      "product",
    ];
    const queryLower = search.toLowerCase();
    let rawSites =
      search.length > 2
        ? availableSites.filter((site) =>
            keys.some((key) =>
              site[key]?.toString().toLowerCase().includes(queryLower)
            )
          )
        : availableSites;

    rawSites = rawSites.map((site) => {
      const hasBooking = bookings.find(
        (booking) => booking.site_id === site.site
      );
      if (hasBooking) {
        delete site.adjusted_end_date;
        return {
          ...site,
          product: hasBooking.client,
          end_date: hasBooking.date_to,
          remaining_days: differenceInDays(
            new Date(hasBooking.date_to),
            new Date()
          ),
          days_vacant: null,
        };
      }
      if (site.adjusted_end_date) {
        return {
          ...site,
          remaining_days: differenceInDays(
            new Date(site.adjusted_end_date),
            new Date()
          ),
        };
      }
      return site;
    });

    switch (show.key) {
      case "available":
        rawSites = rawSites.filter(
          (site) => site.remaining_days <= 60 || !site.end_date
        );
        break;
      case "booked":
        rawSites = rawSites.filter((site) => site.remaining_days > 60);
        break;
      case "month":
        {
          const selectedMonth = format(
            new Date(getYear(new Date()), show.condition),
            "MMMM"
          );
          rawSites = rawSites.filter((site) => {
            const end_date = site.adjusted_end_date ?? site.end_date;
            return (
              format(new Date(end_date), "MMMM") === selectedMonth ||
              !site.end_date
            );
          });
        }
        break;
    }

    return rawSites;
  }, [availableSites, query]);

  return (
    <>
      <div className="w-full flex flex-col gap-2 overflow-hidden">
        <div className="flex flex-col gap-4">
          <Title>Site Availability</Title>
          <SearchAndFilter query={query} setQuery={handleUpdateQuery} />
          <div className="px-2 font-semibold flex justify-between items-center">
            <p>
              Site count: <span>{filteredSites.length}</span>
            </p>
            {hasAccess ? (
              <Button
                color="transparent"
                className="text-white bg-secondary-500 hover:bg-secondary rounded-md transition-all"
                theme={mainButtonTheme}
                onClick={() => toggleModal(true)}
                disabled={eligibleSites.length === 0}
              >
                Save Changes
              </Button>
            ) : (
              <></>
            )}
          </div>
          <div className="max-h-[70vh] rounded-md overflow-y-auto">
            <Table hoverable>
              <Table.Head>
                {headers.map((header, index) => (
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
                <Table.HeadCell className="text-main-300 sticky top-0 z-[2]">
                  Remarks
                </Table.HeadCell>
                <Table.HeadCell
                  align="center"
                  className="text-main-300 sticky top-0 z-[2]"
                >
                  Action
                </Table.HeadCell>
              </Table.Head>
              <Table.Body>
                {filteredSites.map((site, index) => {
                  return (
                    <SiteItem
                      site={site}
                      setSite={setAvailableSites}
                      key={index}
                    />
                  );
                })}
              </Table.Body>
            </Table>
          </div>
        </div>
      </div>
      <Modal
        show={modal}
        size="sm"
        popup
        onClose={() => toggleModal(false)}
        dismissible
      >
        <Modal.Header />
        <Modal.Body className="pt-4">
          Do you want to save these changes?
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end gap-4 w-full">
            <Button size="sm" color="success" onClick={() => handleSubmit()}>
              Yes, proceed
            </Button>
            <Button size="sm" color="gray" onClick={() => toggleModal(false)}>
              No, cancel
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default SiteAvailability;
