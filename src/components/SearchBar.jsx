import React, { useState, useEffect } from 'react';
import { TextField, InputAdornment } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

const SearchBar = ({ placeholder = 'Search...', onChange, delay = 300, ...props }) => {
  const [value, setValue] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      onChange(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, onChange, delay]);

  return (
    <TextField
      size="small"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder={placeholder}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon fontSize="small" />
          </InputAdornment>
        )
      }}
      {...props}
    />
  );
};

export default SearchBar;
