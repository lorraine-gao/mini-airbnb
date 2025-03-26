import React from 'react';
import { Typography } from '@mui/material';

const ViewBookingItemInfo = ({ listing, bookings, currentYear, calculateDuration, calculateBookedDays, calculateTotalProfit, formatDateTime }) => (
  <>
    <Typography variant="h6">This property post on: {formatDateTime(listing.postedOn)}</Typography>
    {listing.postedOn && (
      <Typography variant="h6">
        Has been published for {calculateDuration(listing.postedOn)}
      </Typography>
    )}
    <Typography variant="h6">
      Booked days in this year: {calculateBookedDays(bookings, currentYear)}
    </Typography>
    <Typography variant="h6">
      Total profit in this year: ${calculateTotalProfit(bookings, currentYear)}
    </Typography>
  </>
);

export default ViewBookingItemInfo;
