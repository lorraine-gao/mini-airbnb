import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { Typography, Box, CardMedia, Card, CardActions, Button } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import ReviewForm from '../components/2.4/ReviewForm.jsx';
import ListingInfo from '../components/2.4/ListingDatilsInfo.jsx';
import BookingForm from '../components/2.4/BookingForm.jsx';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5005';

const ListingDetails = () => {
  const { listingId, nights } = useParams();
  const [listing, setListing] = React.useState(null);
  const [startDate, setStartDate] = React.useState(null);
  const [endDate, setEndDate] = React.useState(null);
  const [hasVisited, setHasVisited] = React.useState(false);
  const [previousBooking, setPreviousBooking] = React.useState(null);
  const [allPreviousBooking, setAllPreviousBooking] = React.useState(null);
  const [review, setReview] = React.useState('');
  const [rating, setRating] = React.useState(0);
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchListingDetails = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/listings/${listingId}`);
        const data = await response.json();
        if (localStorage.getItem('token')) {
          const responseBookings = await fetch(`${API_BASE_URL}/bookings`, {
            method: 'GET',
            body: JSON.stringify(),
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-type': 'application/json',
            }
          });
          const dataBookings = await responseBookings.json();
          console.log(dataBookings);
          const acceptedBookings = dataBookings.bookings.filter(booking => booking.status === 'accepted');
          const propertyBookings = acceptedBookings.filter(booking => booking.listingId === listingId);
          const userBookings = propertyBookings.filter(booking => booking.owner === localStorage.getItem('name'));
          if (userBookings.length > 0) {
            setHasVisited(true);
            setPreviousBooking(userBookings);
          }
          const propertyMyBookings = dataBookings.bookings.filter(booking => booking.listingId === listingId);
          const allMyBookings = propertyMyBookings.filter(booking => booking.owner === localStorage.getItem('name'));
          if (allMyBookings.length > 0) {
            setAllPreviousBooking(allMyBookings);
          }
        }
        setListing(data.listing);
      } catch (error) {
        console.error('Error fetching listing details: ', error);
      }
    };
    fetchListingDetails();
  }, [listingId]);
  const formatDateTime = (dateTimeStr) => {
    const date = new Date(dateTimeStr);
    return date.toLocaleString();
  };
  const handleBooking = async () => {
    if (!startDate || !endDate) {
      alert('Please select a start date and an end date.');
      return;
    }
    if (startDate < new Date()) {
      alert('Start date must be in the future.');
      return;
    }
    let isAvailable = false;
    listing.availability.forEach((availability) => {
      const start = new Date(availability.start);
      const end = new Date(availability.end);
      if (startDate >= start && endDate <= end) {
        isAvailable = true;
      }
    });
    if (!isAvailable) {
      alert('The selected dates are not available.');
      return;
    }
    const dateRange = { start: startDate, end: endDate };
    const totalNights = (endDate - startDate) / (1000 * 60 * 60 * 24);
    const totalPrice = Number(totalNights) * listing.price;
    console.log(totalNights);
    const response = await fetch(`${API_BASE_URL}/bookings/new/${listingId}`, {
      method: 'POST',
      body: JSON.stringify({
        dateRange,
        totalPrice
      }
      ),
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-type': 'application/json',
      }
    });
    const data = await response.json();
    if (data.error) {
      alert(data.error);
    } else {
      navigate('/');
      alert('Booking is Pending...')
    }
  };

  const handleReview = async () => {
    if (!review || !rating) {
      alert('Please leave a review and rate the property.');
      return;
    }
    const reviewObject = {
      score: Number(rating),
      content: review
    };
    const response = await fetch(`${API_BASE_URL}/listings/${listingId}/review/${previousBooking[0].id}`, {
      method: 'PUT',
      body: JSON.stringify({
        review: reviewObject
      }),
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-type': 'application/json',
      }
    });
    const data = await response.json();
    if (data.error) {
      alert(data.error);
    } else {
      alert('Review Submitted!');
      navigate('/');
    }
  };
  const goToPreviousImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : images.length - 1
    );
  };
  const goToNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex < images.length - 1 ? prevIndex + 1 : 0
    );
  };
  if (!listing) {
    return <Typography variant="h5">Loading...</Typography>;
  }
  const images = [listing.thumbnail, ...(listing.metadata?.propertyImages || [])];
  return (
    <Box sx = {{ width: '100%' }} >
      {/* <Button onClick={() => navigate('/')}>Back</Button> */}
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Card>
          <CardActions sx={{ gap: 1 }}>
            <Button onClick={goToPreviousImage} size='small'>
              {'<<<'}
            </Button>
            <CardMedia
              sx={{ maxHeight: 300, maxWidth: 200 }}
              component="img"
              image={images[currentImageIndex]}
              alt={listing.title}
            />
            <Button onClick={goToNextImage} size='small'>
              {'>>>'}
            </Button>
          </CardActions>
          <ListingInfo
            listing={listing}
            nights={nights}
            allPreviousBooking={allPreviousBooking}
            formatDateTime={formatDateTime}
          />
          <BookingForm
            startDate={startDate}
            endDate={endDate}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            handleBooking={handleBooking}
          />
          <ReviewForm
            hasVisited={hasVisited}
            review={review}
            rating={rating}
            setReview={setReview}
            setRating={setRating}
            handleReview={handleReview}
          />
        </Card>
      </LocalizationProvider>
    </Box>
  );
};

export default ListingDetails;
