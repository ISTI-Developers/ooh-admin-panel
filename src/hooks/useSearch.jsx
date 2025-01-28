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

    // Filter the data based on the search term
    const matches = data.filter((obj) => {
      // Check each key in the object
      for (let key in obj) {
        // Check if the value of the key contains the query string
        if (obj[key].toString().toLowerCase().includes(lowerCaseQuery)) {
          return true; // If there's a match, return true
        }
      }
      return false; // If no match found, return false
    });

    setResults(matches); // Update the results state with the filtered matches
  }

  return {
    results,
    searchTerm,
  };
}

export default useSearch;
