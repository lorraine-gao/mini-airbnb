import React from 'react';
import { Typography, Box } from '@mui/material';

const ReviewList = ({ reviews }) => (
  <Box>
    <Typography variant="body1">
     ⬇️ Review: {reviews.length}
    </Typography>
    {reviews.map((review, index) => (
      <Typography key={index} variant="body2">
        Review {index + 1}: {review.content}
      </Typography>
    ))}
  </Box>
);

export default ReviewList;
