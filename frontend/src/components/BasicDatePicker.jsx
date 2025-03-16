import React from 'react';
import { DatePicker } from '@mui/x-date-pickers';
import TextField from '@mui/material/TextField';

const BasicDatePicker = ({ label, value, onChange }) => {
  return (
    <DatePicker
      label={label}
      value={value}
      onChange={onChange}
      textField={(params) => <TextField {...params} />}
    />
  );
};

export default BasicDatePicker;
