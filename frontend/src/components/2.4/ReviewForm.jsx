import React from 'react';
import { CardContent, Typography, TextField, Rating, Button } from '@mui/material';

const ReviewForm = ({ hasVisited, review, rating, setReview, setRating, handleReview }) => {
  if (!hasVisited) return null; // 如果用户没有访问过，不显示评论表单

  return (
    <CardContent >
      <Typography variant="body1">
        ⬇️ You have booked this property before! Please leave a review for this property!
      </Typography>
      <TextField
        sx={{ width: '50%' }}
        id="outlined-multiline-static"
        label="Review"
        multiline
        rows={2}
        value={review}
        onChange={(e) => setReview(e.target.value)}
      />
      <Rating
        data-testid="rating"
        name="simple-controlled"
        value={rating}
        size="large"
        onChange={(event, newValue) => {
          setRating(newValue);
        }}
      />
      <Button size="small" variant="contained" onClick={handleReview}>Submit</Button>
    </CardContent>
  );
};

export default ReviewForm;
