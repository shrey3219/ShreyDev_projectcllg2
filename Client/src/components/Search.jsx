import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextInput } from 'flowbite-react';
import { AiOutlineSearch } from 'react-icons/ai';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        setIsLoading(false);
        return;
      }
      filterResults();
    }, 300); 

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const fetchSearchResults = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`http://localhost:3000/api/file`);
      return response.data;
    } catch (error) {
      console.error('Error fetching search results:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const filterResults = async () => {
    const files = await fetchSearchResults();
    const filteredFiles = files.filter(file =>
      file.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(filteredFiles);
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div>
      <TextInput
        type="text"
        placeholder="Search files..."
        rightIcon={AiOutlineSearch}
          className='hidden lg:inline'
        value={searchQuery}
        onChange={handleSearch}
      />
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {searchResults.map(file => (
            <li key={file.id}>{file.title}</li>
          ))}
          {searchResults.length === 0 && searchQuery.trim() !== '' && (
            <p>No results found.</p>
          )}
        </ul>
      )}
    </div>
  );
};

export default Search;



