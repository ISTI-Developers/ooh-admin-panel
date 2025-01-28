import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";

import useSearch from "~/hooks/useSearch";

import axios from "axios";
import { endpoints, headers } from "./endpoints";

// Create a context for the UserProvider component
const UserContext = React.createContext();

// Custom hook to access the UserContext
export function useUsers() {
  return useContext(UserContext);
}

// UserProvider component
export function UserProvider({ children }) {
  const [users, setUsers] = useState(); // State to store the users
  const [user, setUser] = useState(null); // State to store the current user
  const [module, setModule] = useState(""); // State to store the current module
  const { searchTerm, results } = useSearch(users); // Custom hook to handle search functionality
  const [reload, doReload] = useState(0); // State to trigger a reload of the users data

  // Function to retrieve a single user by ID
  const retrieveUser = async (id) => {
    try {
      const response = await axios.get(endpoints.users, {
        params: {
          id: id,
        },
        ...headers,
      });
      return response.data;
    } catch (e) {
      console.log(e);
    }
  };

  // Function to retrieve all users
  const retrieveUsers = async () => {
    try {
      const response = await axios.get(endpoints.users, {
        ...headers,
      });
      return response.data;
    } catch (e) {
      console.log(e);
    }
  };

  // Function to create a new user
  const createUser = async (data) => {
    try {
      const response = await axios.post(endpoints.users, data, {
        ...headers,
      });
      return response.data;
    } catch (e) {
      console.log(e);
    }
  };

  // Function to update a user by ID
  const updateUser = async (id, data) => {
    try {
      const response = await axios.put(endpoints.users, data, {
        params: {
          id: id,
        },
        ...headers,
      });
      return response.data;
    } catch (e) {
      console.log(e);
    }
  };

  // Function to update the status of a user by ID and key
  const updateUserStatus = async (id, key, status) => {
    try {
      const response = await axios.patch(
        endpoints.users,
        { [key]: status },
        {
          params: {
            id: id,
            key: key,
          },
          ...headers,
        }
      );
      return response.data;
    } catch (e) {
      console.log(e);
    }
  };

  // Define the values to be passed to the UserContext.Provider
  const values = {
    user,
    users,
    results,
    module,
    setUser,
    setUsers,
    doReload,
    setModule,
    searchTerm,
    createUser,
    updateUser,
    retrieveUser,
    retrieveUsers,
    updateUserStatus,
  };

  // Fetch the users data on component mount and whenever the reload state changes
  useEffect(() => {
    const setup = async () => {
      const response = await retrieveUsers();
      setUsers(response.filter((res) => res.status !== "deleted"));
    };
    setup();
  }, [reload]);

  // Render the UserContext.Provider with the provided children
  return <UserContext.Provider value={values}>{children}</UserContext.Provider>;
}

// Prop types for the UserProvider component
UserProvider.propTypes = {
  children: PropTypes.node,
};
