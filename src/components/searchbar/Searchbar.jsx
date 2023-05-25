import React, { useState, useEffect, useRef } from "react";
import './searchbar.css'

const SearchBar = ({ onSearch, results }) => {
  const [query, setQuery] = useState("");
  const timeoutId = useRef();

  useEffect(() => {
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }

    timeoutId.current = setTimeout(() => {
      search(query);
    }, 500); 
    // eslint-disable-next-line
  }, [query]); 

  const search = async (query) => {
    if (!query) {
      return;
    }
  
    const response = await fetch(`https://deezerdevs-deezer.p.rapidapi.com/search?q=${query}`, {
      "method": "GET",
      "headers": {
        "x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
        "x-rapidapi-key": "c5ad827498msh9622c6ee8dfea59p142df3jsn218bc14da362"
      }
    });
  
    const data = await response.json();
  
    if (data && data.data) { 
      onSearch(data.data.slice(0, 4));
    } else {
      onSearch([]); 
    }
  };
  

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>
  );
};

  export default SearchBar;