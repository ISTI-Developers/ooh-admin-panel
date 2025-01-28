import classNames from "classnames";
import { Table } from "flowbite-react";
import { useEffect, useMemo, useState } from "react";
import { useSites } from "~/contexts/SiteContext";
import { useFunction } from "~/misc/functions";
import Loader from "~components/Loader";
import Title from "~components/Title";
import SiteItem from "~components/availability/SiteItem";

function SiteAvailability() {
  const { capitalize } = useFunction();
  const { getAvailableSites, sites } = useSites();
  const [availableSites, setAvailableSites] = useState([]);

  const headers = [
    "structure",
    "address",
    "site",
    "brand",
    "end_date",
    "days_vacant",
    "remaining_days",
  ];

  useEffect(() => {
    const setup = async () => {
      const response = await getAvailableSites();
      // setAvailableSites(response);
      if (response && sites) {
        const data = response.map((item) => {
          const site = sites.find((site) => site.unis_code === item.site_code);

          const updatedData = {
            ...item,
            adjusted_end_date: null,
            remarks: "",
          };

          if (site) {
            updatedData.site_id = site.site;
          }

          return updatedData;
        });
        setAvailableSites(data);
      }
    };
    setup();
  }, [sites]);

  const groupedSites = useMemo(() => {
    return availableSites.reduce((acc, site) => {
      const key = site.area;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(site);
      return acc;
    }, {});
  }, [availableSites]);
  return (
    <>
      <div className="w-full flex flex-col gap-2 overflow-hidden">
        <div className="flex flex-col gap-4">
          <Title>Site Availability</Title>
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
              </Table.Head>
              <Table.Body>
                {Object.keys(groupedSites).map((key, index) => {
                  const currentSites = groupedSites[key];
                  return (
                    <>
                      <Table.Row key={index} className="text-xs bg-default-300 hover:bg-default-300 sticky top-14 z-[1]">
                        <Table.Cell
                          colSpan={headers.length + 1}
                          className="text-black font-semibold"
                        >
                          {key}
                        </Table.Cell>
                      </Table.Row>
                      {currentSites.map((site, index) => {
                        return (
                          <SiteItem
                            site={site}
                            setSite={setAvailableSites}
                            key={index}
                          />
                        );
                      })}
                    </>
                  );
                })}
                {/* {availableSites.length !== 0 ? (
                  availableSites.map((site, index) => {
                    return (
                      <SiteItem
                        site={site}
                        setSite={setAvailableSites}
                        key={index}
                      />
                    );
                  })
                ) : (
                  <Table.Row>
                    {new Array(headers.length + 1)
                      .fill("1rem")
                      .map((item, index) => {
                        return (
                          <Table.Cell key={index}>
                            <Loader height={item} />
                          </Table.Cell>
                        );
                      })}
                  </Table.Row>
                )} */}

                {/* <pre>{JSON.stringify(groupedSites, 0, 2)}</pre> */}
              </Table.Body>
            </Table>
          </div>
        </div>
      </div>
    </>
  );
}

export default SiteAvailability;
