import React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import SearchForm from '../components/2.3/SearchForm.jsx';
import LandingListingBoxAndCards from '../components/2.3/LandingListingBoxAndCards.jsx';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5005';

const LandingPage = (props) => {
  const [listings, setListings] = React.useState([]); // 用于存储获取到的列表数据
  const [searchTerm, setSearchTerm] = React.useState('');
  const [allListings, setAllListings] = React.useState([]);
  const [minBedrooms, setMinBedrooms] = React.useState('');
  const [maxBedrooms, setMaxBedrooms] = React.useState('');
  const [minPrice, setMinPrice] = React.useState('');
  const [maxPrice, setMaxPrice] = React.useState('');
  const [startDate, setStartDate] = React.useState(null);
  const [endDate, setEndDate] = React.useState(null);
  const [nights, setNights] = React.useState(1);

  React.useEffect(() => {
    // 定义异步函数获取数据
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/listings`);
        const data = await response.json();
        const listingsWithDetails = await Promise.all(data.listings.map(async (listing) => {
          const detailResponse = await fetch(`${API_BASE_URL}/listings/${listing.id}`);
          const detailData = await detailResponse.json();
          return { ...listing, ...detailData.listing };
        }));
        const responseBookings = await fetch(`${API_BASE_URL}/bookings`, {
          method: 'GET',
          body: JSON.stringify(),
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-type': 'application/json',
          }
        });
        const dataBookings = await responseBookings.json();
        let sortedData = listingsWithDetails.filter(listing => listing.published);
        if (localStorage.getItem('token')) {
          sortedData = sortedData.map(listing => {
            const isPriority = dataBookings.bookings.some(booking =>
              booking.owner === localStorage.getItem('name') &&
              booking.listingId.toString() === listing.id.toString() &&
              (booking.status === 'accepted' || booking.status === 'pending')
            );
            return { ...listing, isPriority };
          });
          sortedData.sort((a, b) => {
            if (a.isPriority && !b.isPriority) return -1;
            if (!a.isPriority && b.isPriority) return 1;
            return a.title.localeCompare(b.title);
          });
        } else {
          sortedData = sortedData.sort((a, b) => a.title.localeCompare(b.title));
        }
        setAllListings(sortedData);
        setListings(sortedData);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };
    fetchData();
  }, []);
  const handleSearch = () => {
    if (startDate && endDate) {
      const diffTime = Math.abs(endDate - startDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setNights(diffDays);
    }
    const filtered = allListings.filter(listing => {
      return (!minBedrooms || listing.metadata.numberOfBedrooms >= minBedrooms) &&
            (!maxBedrooms || listing.metadata.numberOfBedrooms <= maxBedrooms) &&
            (!minPrice || listing.price >= minPrice) &&
            (!maxPrice || listing.price <= maxPrice) &&
            (!startDate || listing.availability.some(availability => {
              const start = new Date(availability.start);
              const end = new Date(availability.end);
              return startDate >= start && endDate <= end;
            }));
    });
    setListings(filtered);
  };
  const handleClear = () => {
    setSearchTerm('');
    setMinBedrooms('');
    setMaxBedrooms('');
    setMinPrice('');
    setMaxPrice('');
    setStartDate(null);
    setEndDate(null);
    setListings(allListings);
  };
  const calculateAverageScore = (reviews) => {
    if (reviews.length === 0) return 0;
    const totalScore = reviews.reduce((total, review) => total + review.score, 0);
    return totalScore / reviews.length;
  };
  const sortByRatingHighToLow = () => {
    const sorted = [...listings].sort((a, b) => calculateAverageScore(b.reviews) - calculateAverageScore(a.reviews));
    setListings(sorted);
  };
  const sortByRatingLowToHigh = () => {
    const sorted = [...listings].sort((a, b) => calculateAverageScore(a.reviews) - calculateAverageScore(b.reviews));
    setListings(sorted);
  };
  const filteredListings = searchTerm
    ? listings.filter(listing => {
      return listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (listing.address && listing.address.toLowerCase().includes(searchTerm.toLowerCase()));
    })
    : listings;

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <SearchForm
        searchTerm={searchTerm} setSearchTerm={setSearchTerm}
        minBedrooms={minBedrooms} setMinBedrooms={setMinBedrooms}
        maxBedrooms={maxBedrooms} setMaxBedrooms={setMaxBedrooms}
        minPrice={minPrice} setMinPrice={setMinPrice}
        maxPrice={maxPrice} setMaxPrice={setMaxPrice}
        startDate={startDate} setStartDate={setStartDate}
        endDate={endDate} setEndDate={setEndDate}
        handleSearch={handleSearch} handleClear={handleClear}
        sortByRatingHighToLow={sortByRatingHighToLow}
        sortByRatingLowToHigh={sortByRatingLowToHigh}/>
        <LandingListingBoxAndCards filteredListings={filteredListings} nights={nights} />
      </LocalizationProvider>
    </>
  );
}

export default LandingPage;
