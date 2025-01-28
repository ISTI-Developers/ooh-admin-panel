import { useState, useEffect } from "react";

function useSearch(data) {
  const [results, setResults] = useState(data);

  useEffect(() => {
    setResults(data); // Initialize results with the provided data
  }, [data]); // Re-run this effect whenever the data prop changes

  function searchTerm(term) {
    if (!data) return;
    // Convert query to lowercase for case-insensitive search
    const lowerCaseQuery = term.toLowerCase();

    console.log(lowerCaseQuery);

    // // Filter the data based on the search term
    const matches = data.filter(
      ({ site_id, site_code, ideal_view, ...obj }) => {
        // Iterate over all keys in the object
        for (let key in obj) {
          // Convert the value to a string
          const valueAsString = obj[key].toString();

          // Check if the value is a number
          if (!isNaN(parseFloat(valueAsString))) {
            // If it's a number, check if it matches the query
            if (valueAsString.includes(lowerCaseQuery)) {
              return true; // If there's a match, return true
            }
          } else {
            // If it's not a number, convert to lowercase and check if it matches the query
            if (valueAsString.toLowerCase().includes(lowerCaseQuery)) {
              return true; // If there's a match, return true
            }
          }
        }

        return false; // If no match found, return false
      }
    );

    // console.log(matches);
    setResults(matches); // Update the results state with the filtered matches
  }

  return {
    results,
    searchTerm,
  };
}

export default useSearch;
