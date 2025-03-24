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

    const matches = data.filter(({ ideal_view, ...obj }) => {
      for (let key in obj) {
        if (obj[key]) {
          const valueAsString = obj[key].toString();

          if (valueAsString.toLowerCase().includes(lowerCaseQuery)) {
            return true; // Match found
          }
        }
      }
      return false; // No matches found in any key
    });

    // console.log(matches);
    setResults(matches); // Update the results state with the filtered matches
  }

  return {
    results,
    searchTerm,
  };
}

export default useSearch;
