import React from 'react';
import { CardContent, Typography } from '@mui/material';
import AvailabilityList from './AvailabilityList';
import ReviewList from './ReviewList';
import BookingListInfo from './BookingListInfo';

const ListingInfo = ({ listing, nights, allPreviousBooking, formatDateTime }) => (
  <CardContent>
    <Typography gutterBottom variant="h5" component="div">
      {listing.title}
    </Typography>
    <Typography variant="body1">
      Address: {listing.address}
    </Typography>
    <Typography variant="body1">
      Amenities: {listing.metadata.amenities}
    </Typography>
    {(Number(nights) === 1) && (
      <Typography variant="body1">
        Price (per nights): ${listing.price}
      </Typography>)}
    {(Number(nights) > 1) && (
      <Typography variant="body1">
        Price (for {Number(nights)} nights): ${listing.price * Number(nights)}
      </Typography>)}
      <Typography variant="body1">AVG: {listing.reviews.reduce((total, review) => total + review.score, 0) /
                                          listing.reviews.length}⭐️</Typography>
    <Typography variant="body1">
      Property Type: {listing.metadata.propertyType}
    </Typography>
    <Typography variant="body1">
      Bedrooms: {listing.metadata.numberOfBedrooms}
    </Typography>
    <Typography variant="body1">
      Total Beds: {listing.metadata.totalBeds}
    </Typography>
    <Typography variant="body1">
      Bathrooms: {listing.metadata.numberOfBathrooms}
    </Typography>
    <AvailabilityList availability={listing.availability} formatDateTime={formatDateTime} />
    <ReviewList reviews={listing.reviews} />
    <BookingListInfo bookings={allPreviousBooking} />
  </CardContent>
);

export default ListingInfo;
