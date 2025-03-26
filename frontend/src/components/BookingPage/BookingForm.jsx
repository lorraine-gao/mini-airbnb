import React from 'react';
import { CardActions, Button } from '@mui/material';
import BasicDatePicker from '../BasicDatePicker'; // 假设 BasicDatePicker 也是一个独立的组件

const BookingForm = ({ startDate, endDate, setStartDate, setEndDate, handleBooking }) => (
  <CardActions sx={{ gap: 5, marginLeft: '8px' }}>
    <BasicDatePicker
      label="Start Date"
      value={startDate}
      onChange={(newValue) => {
        setStartDate(newValue);
        if (newValue && endDate && newValue > endDate) {
          setEndDate(null);
        }
      }}
    />
    <BasicDatePicker
      label="End Date"
      value={endDate}
      onChange={(newValue) => {
        setEndDate(newValue);
        if (newValue && startDate && newValue < startDate) {
          setStartDate(null);
        }
      }}
    />
    <Button size="large" variant="contained" onClick={handleBooking}>BOOK NOW</Button>
  </CardActions>
);

export default BookingForm;
