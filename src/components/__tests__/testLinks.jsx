import { HiUsers, HiViewGrid } from "react-icons/hi";
import { FaUserGear } from "react-icons/fa6";
import { DiGoogleAnalytics } from "react-icons/di";
import { CgWebsite } from "react-icons/cg";
import { TbChecks } from "react-icons/tb";
import { IoMdSwitch, IoIosTrain } from "react-icons/io";
import { FaFileContract } from "react-icons/fa";

export const testLinks = {
  "": [
    {
      title: "dashboard",
      link: "",
      icon: HiViewGrid,
    },
  ],
  sites_management: [
    {
      title: "sites",
      link: "/sites",
      icon: CgWebsite,
    },
    {
      title: "availability",
      link: "/availability",
      icon: TbChecks,
    },
    {
      title: "analytics",
      link: "/analytics",
      icon: DiGoogleAnalytics,
    },
  ],
  utasi: [
    {
      title: "contracts",
      link: "/contracts",
      icon: FaFileContract,
    },
    {
      title: "assets",
      link: "/assets",
      icon: IoIosTrain,
    },
    {
      title: "asset_availability",
      link: "/asset_availability",
      icon: IoIosTrain,
    },
    {
      title: "expired_contracts",
      link: "/expired_contracts",
      icon: FaFileContract,
    },
  ],
  system: [
    {
      title: "users",
      link: "/users",
      icon: HiUsers,
    },
    {
      title: "roles",
      link: "/roles",
      icon: FaUserGear,
    },
    {
      title: "modules",
      link: "/modules",
      icon: IoMdSwitch,
    },
  ],
};
