import React from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@mui/material';
import { useDarkMode } from '@/context/DarkModeContext';

export default function CustomTextField({ select, label, name, value, onChange, size, fullWidth, children, id }) {
  const { darkMode } = useDarkMode();
  const isDarkMode = darkMode && true;

  return (
    <TextField
      id={id}
      select={select}
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      size={size}
      fullWidth={fullWidth}
      InputProps={{
        style: {
          color: isDarkMode ? 'white' : 'black', // Warna teks (value) input
        },
      }}
      InputLabelProps={{
        style: {
          color: isDarkMode ? 'lightgray' : 'darkgray', // Warna label
        },
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          '& fieldset': {
            borderColor: isDarkMode ? 'gray' : 'lightgray', // Warna border default
          },
          '&:hover fieldset': {
            borderColor: isDarkMode ? 'lightgray' : 'gray', // Warna border saat hover
          },
          '&.Mui-focused fieldset': {
            borderColor: isDarkMode ? 'white' : 'darkgray', // Warna border saat fokus
          },
          '& .MuiSvgIcon-root': {
            color: isDarkMode ? 'white' : 'black', // Warna ikon (misalnya ikon select)
          },
        },
      }}
    >
      {select && children}
    </TextField>
  );
}

CustomTextField.propTypes = {
  select: PropTypes.bool,
  label: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  size: PropTypes.string,
  fullWidth: PropTypes.bool,
  options: PropTypes.array,
  children: PropTypes.node,
  id: PropTypes.string,
};

CustomTextField.defaultProps = {
  select: false,
  label: '',
  name: '',
  value: '',
  onChange: () => {},
  size: 'small',
  fullWidth: false,
  options: [],
  children: null,
  id: '',
};
