import React from 'react';
import { Typography, Box } from '@mui/material';

const AvailabilityList = ({ availability, formatDateTime }) => (
  <Box>
    <Typography variant="body1">
    ⬇️ Availibity: {availability.length}
    </Typography>
    {availability.map((avail, index) => (
      <Typography key={index} variant="body2">
        Time Slot {index + 1}: from {formatDateTime(avail.start)} to {formatDateTime(avail.end)}
      </Typography>
    ))}
  </Box>
);

export default AvailabilityList;
