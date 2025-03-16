import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

import Button from '@mui/material/Button';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import HostListingsBox from '../components/2.2/HostListingBox.jsx';

const HostProperty = (props) => {
  const navigate = useNavigate();
  const [listings, setListings] = React.useState([]); // 用于存储获取到的列表数据

  const fetchData = async () => {
    try {
      const name = localStorage.getItem('name');
      const response = await fetch('http://localhost:5005/listings');
      const data = await response.json();
      const userOwnedListings = data.listings.filter(listing => listing.owner === name);
      // 为每个属于用户的列表项获取详细信息
      const listingsDetails = await Promise.all(userOwnedListings.map(async (listing) => {
        const detailResponse = await fetch(`http://localhost:5005/listings/${listing.id}`);
        const detailData = await detailResponse.json();
        return { ...detailData, id: listing.id };
      }));
      setListings(listingsDetails); // 存储获取到的列表数据
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, [props.token]);

  const edit = (id, listingData) => {
    navigate(`/edititem/${id}`, { state: { listing: listingData } });
  }

  const deleteproperty = async (id) => {
    event.preventDefault();
    // console.log('提交床位总数：', totalBeds);
    const response = await fetch(`http://localhost:5005/listings/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${props.token}`,
        'Content-type': 'application/json',
      }
    });
    const data = await response.json();
    if (data.error) {
      alert(data.error);
    } else {
      fetchData();
    }
  }

  const cancelPublish = async (id) => {
    event.preventDefault();
    const response = await fetch(`http://localhost:5005/listings/unpublish/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${props.token}`,
        'Content-type': 'application/json',
      }
    });
    const data = await response.json();
    if (data.error) {
      alert(data.error);
    } else {
      fetchData();
    }
  }
  const calculateRating = (reviews) => {
    const totalScore = reviews.reduce((acc, review) => acc + review.score, 0);
    const totalReviews = reviews.length;
    const averageScore = totalReviews ? (totalScore / totalReviews) : 0;
    return averageScore;
  }

  const viewBookingRequest = (id, listingData) => {
    navigate(`/viewbookingrequest/${id}`, { state: { listing: listingData } });
  }

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Link to="/createhostproperty"><Button variant="outlined">create a new listing</Button></Link><hr/>
        <br/>
        <HostListingsBox
        listings={listings}
        edit={edit}
        deleteproperty={deleteproperty}
        cancelPublish={cancelPublish}
        viewBookingRequest={viewBookingRequest}
        calculateRating={calculateRating}
        fetchData={fetchData}
        />
      </LocalizationProvider>
    </>
  );
}

export default HostProperty;
