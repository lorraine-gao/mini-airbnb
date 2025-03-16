import React from 'react';
import { Box, Card, Typography, Button } from '@mui/material';

const ViewBookingHistory = ({ item, formatDateTime, acceptBooking, declineBooking }) => (
  <Box key={item.id}>
    <Card>
      <Typography variant="h6">Name of booker: {item.owner}</Typography>
      <Typography variant="h6">
        Book date range: from {formatDateTime(item.dateRange.start)} to {formatDateTime(item.dateRange.end)}
      </Typography>
      <Typography variant="h6">Total price: {item.totalPrice}</Typography>
      {item.status === 'pending' && (
        <>
          <Button variant="outlined" type="button" onClick={() => acceptBooking(item.id)}>Accept</Button>
          <Button variant="outlined" type="button" onClick={() => declineBooking(item.id)}>Decline</Button>
        </>
      )}
      {item.status === 'accepted' && (
        <Button variant="outlined" disabled>Have Accepted</Button>
      )}
      {item.status === 'declined' && (
        <Button variant="outlined" disabled>Have Declined</Button>
      )}
    </Card>
    <br />
  </Box>
);

export default ViewBookingHistory;
