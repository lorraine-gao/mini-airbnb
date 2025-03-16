import React from 'react';

import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import PublishModal from './PublishModal.jsx';
import ListingCard from '../Styled/ListingCard.jsx';

const HostListingCard = ({ item, calculateRating, fetchData, edit, deleteproperty, cancelPublish, viewBookingRequest }) => {
  const [open, setOpen] = React.useState(false);
  const [activeItemId, setActiveItemId] = React.useState(null);
  const handleOpen = (itemId) => {
    setActiveItemId(itemId);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);
  return (
    <ListingCard>
    <CardMedia component="img" image={item.listing.thumbnail} alt={item.listing.title} sx={{ maxHeight: 180 }}/>
    <CardContent>
      <Typography variant="h5">{item.listing.title}</Typography>
      <Typography variant="body1">Property Type: {item.listing.metadata.propertyType}</Typography>
      <Typography variant="body1">Total Beds: {item.listing.metadata.totalBeds}</Typography>
      <Typography variant="body1">Total Bathrooms: {item.listing.metadata.numberOfBathrooms}</Typography>
      <Typography variant="body1">SVG of reviews: {calculateRating(item.listing.reviews)} ⭐️</Typography>
      <Typography variant="body1">Number of total reviews: {item.listing.reviews.length}</Typography>
      <Typography variant="body1">Price(per night): {item.listing.price}</Typography>
      <Button size="small" type="button" onClick={() => edit(item.id, item.listing)}>Edit this property</Button>
      <Button size="small" type="button" onClick={() => deleteproperty(item.id)}>Delete this property</Button>
      {item.listing.published
        ? <Button id = "cancel-publish-button" size="small" onClick={() => cancelPublish(item.id)}>Cancel publish</Button>
        : <Button id = "publish-button" size="small" onClick={() => handleOpen(item.id)}>Publish this Property</Button>
      }
      <Button size="small" type="button" onClick={() => viewBookingRequest(item.id, item.listing)}>View booking request</Button>
      {open && item.id === activeItemId && (
        <PublishModal itemId={item.id} open={open} onClose={handleClose} fetchData={fetchData} />
      )}
    </CardContent>
    </ListingCard>
  )
};

export default HostListingCard;
