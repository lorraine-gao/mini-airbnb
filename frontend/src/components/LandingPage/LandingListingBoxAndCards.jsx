import React from 'react';
import { Link } from 'react-router-dom';
import { CardMedia, CardContent, Typography, CardActions, Button } from '@mui/material';
import ListingsBox from '../Styled/ListingsBox';
import ListingCard from '../Styled/ListingCard';

const LandingListingBoxAndCards = ({ filteredListings, nights }) => {
  return (
    <ListingsBox>
      {filteredListings.map(listing => (
        <ListingCard key={listing.id}>
          <CardMedia component="img" image={listing.thumbnail} alt={listing.title} sx={{ maxHeight: 200 }}/>
          <CardContent>
            <Typography variant="h5">{listing.title}</Typography>
            <Typography variant="body1">Owner: {listing.owner}</Typography>
            <Typography variant="body1">Price: ${listing.price}</Typography>
            {listing.reviews.length > 0
              ? <Typography variant="body1">AVG: {listing.reviews.reduce((total, review) => total + review.score, 0) / listing.reviews.length}⭐️</Typography>
              : <Typography variant="body1">AVG: No reviews yet</Typography>}
            <Typography variant="body1">Address: {listing.address}</Typography>
            <Typography variant="body1">Reviews: {listing.reviews.length}</Typography>
            <Typography variant="body1">Bedrooms: {listing.metadata.numberOfBedrooms}</Typography>
          </CardContent>
          <CardActions>
            <Link to={`/listing/${listing.id}/${nights}`}><Button data-id={listing.id}>View Details</Button></Link>
          </CardActions>
        </ListingCard>
      ))}
    </ListingsBox>
  );
};

export default LandingListingBoxAndCards;
