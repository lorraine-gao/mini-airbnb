import React from 'react';
import { Typography, Box } from '@mui/material';

const BookingListInfo = ({ bookings }) => (
  <Box>
    <Typography>
      ⬇️ Your previous booking details
    </Typography>
    {bookings && bookings.length > 0 && (
      bookings.map((booking, index) => (
        <Typography key={index} variant="body1">
          Booking ID: {booking.id} || Status: {booking.status}
        </Typography>
      ))
    )}
    <Typography variant="body1">
      ----------------------------------------------------------------
    </Typography>
  </Box>
);

export default BookingListInfo;
