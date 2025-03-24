import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import Cookies from "js-cookie";
import { useRoles } from "./RoleContext";

// Create a context for services
const ServiceContext = React.createContext();

// Custom hook to access services from the context
export function useServices() {
  return useContext(ServiceContext);
}

// Service provider component
export function ServiceProvider({ children }) {
  // State for alert
  const { retrieveRole, reload } = useRoles();
  const [alert, setAlert] = useState({
    isOn: false,
    type: "info",
    message: "Sample only",
  });
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentUserRole, setCurrentUserRole] = useState(null);
  // Array of conjunction words
  const conjunctionWords = [
    "and",
    "but",
    "or",
    "nor",
    "for",
    "so",
    "yet",
    "although",
    "because",
    "since",
    "unless",
    "while",
    "to",
    "at",
    "on",
    "off",
    "in",
    "of",
  ];

  // Function to capitalize text
  const capitalize = (text = "", sep = " ") => {
    const tempText = text.split(sep);
    tempText.forEach((text, index) => {
      if (!conjunctionWords.includes(text)) {
        tempText[index] = text.charAt(0).toUpperCase() + text.slice(1);
      }
    });
    return tempText.join(" ");
  };

  // Function to split text
  const split = (text) => {
    return text.split(" ").join("_");
  };

  // Function to join text
  const join = (text, sep = " ") => {
    return text.split("_").join(sep);
  };

  // Tooltip options
  const tooltipOptions = {
    placement: "top",
    animation: "duration-500",
    arrow: false,
  };

  // Function to check permission for a given path
  function CheckPermission({ path, children }) {
    const modules = currentUserRole ? currentUserRole.access : null;

    if (!modules) return null;

    // Find the module with the given path
    const permission = modules.find(
      (module) => module.name.toLowerCase() === path
    );

    // If permission exists and has view access, render children
    if (permission && permission.permissions[0] && permission.status) {
      return <>{children}</>;
    }

    return null;
  }

  // Function to check if any link in the array is viewable
  function isViewable(array) {
    const modules = currentUserRole ? currentUserRole.access : null;

    if (!modules) return false;

    // Check if any link in the array has view permission
    return array.some((link) => {
      const permission = modules.find(
        (module) => module.name.toLowerCase() === link
      );

      return permission && permission.permissions[0] && permission.status;
    });
  }

  // Function to sort items
  function sortItems(array, key, direction) {
    return array.sort((a, b) => {
      if (direction === "ASC") {
        return a[key].toLowerCase().localeCompare(b[key].toLowerCase());
      } else {
        return b[key].toLowerCase().localeCompare(a[key].toLowerCase());
      }
    });
  }

  // Function to sort by status
  function sortByStatus(array, direction) {
    return array.sort((a, b) => {
      if (a.status === "active" && b.status === "inactive") {
        return direction === "ASC" ? -1 : 1;
      }
      if (a.status === "inactive" && b.status === "active") {
        return direction === "ASC" ? 1 : -1;
      }
      return 0;
    });
  }

  // Function to sort by role
  function sortByRole(array, roles, direction) {
    return array.sort((a, b) => {
      const a_role = roles?.find((role) => role.role_id === a.role)?.name;
      const b_role = roles?.find((role) => role.role_id === b.role)?.name;
      return direction === "ASC"
        ? a_role.localeCompare(b_role)
        : b_role.localeCompare(a_role);
    });
  }

  function getInitials(str) {
    if (!str) {
      return "";
    }

    // Use regex to match the first letter of each word
    const initials = str.match(/\b[A-Za-z]/g);

    // Join the initials together
    return initials ? initials.join("").toUpperCase() : "";
  }

  useEffect(() => {
    const setup = async () => {
      let user = Cookies.get("user");
      if (!user) return;

      user = JSON.parse(user);

      const response = await retrieveRole(user.role_id);
      setCurrentUserRole(response);
      console.log("Role Fetched");
    };

    setup();
  }, [reload]);

  // Values to be provided by the context
  const values = {
    alert,
    loading,
    setLoading,
    setAlert,
    capitalize,
    split,
    join,
    tooltipOptions,
    CheckPermission,
    isViewable,
    sortItems,
    sortByStatus,
    sortByRole,
    getInitials,
    progress,
    setProgress,
    currentUserRole,
  };

  // Provide the values to the children components
  return (
    <ServiceContext.Provider value={values}>{children}</ServiceContext.Provider>
  );
}

// PropTypes for ServiceProvider component
ServiceProvider.propTypes = {
  path: PropTypes.string,
  children: PropTypes.node,
};
