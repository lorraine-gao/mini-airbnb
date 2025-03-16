import React from 'react';
import { useLocation, useParams } from 'react-router-dom';

import ViewBookingHistory from '../components/2.5/ViewBookingHistory';
import ViewBookingItemInfo from '../components/2.5/ViewBookingItemInfo';

const ViewBookingRequest = (props) => {
  const { id } = useParams(); // 从 URL 获取 id
  const [bookings, setBookings] = React.useState([]); // 用于存储获取到的列表数据
  const location = useLocation();
  const listing = location.state.listing;
  const currentYear = new Date().getFullYear();
  // console.log(listing); // 这个就是传过来，可以用poston的数据

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:5005/bookings', {
        headers: {
          Authorization: `Bearer ${props.token}` // 确保这里使用了正确的令牌
        }
      });
      const data = await response.json();
      if (response.ok) {
        console.log(data.bookings);
        const thisPropertyBooking = data.bookings.filter(booking => Number(booking.listingId) === Number(id));
        console.log(thisPropertyBooking);
        setBookings(thisPropertyBooking); // 存储获取到的列表数据
      }
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  };
  // console.log(id);
  // console.log(bookings);
  React.useEffect(() => {
    fetchData();
  }, [props.token]);

  const acceptBooking = async (id) => {
    event.preventDefault();
    const response = await fetch(`http://localhost:5005/bookings/accept/${id}`, {
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

  const declineBooking = async (id) => {
    event.preventDefault();
    const response = await fetch(`http://localhost:5005/bookings/decline/${id}`, {
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

  const calculateDuration = (postedOn) => {
    const postedDate = new Date(postedOn);
    const currentDate = new Date();
    const diff = currentDate - postedDate;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`;
  };

  const calculateBookedDays = (bookings, currentYear) => {
    return bookings.filter(booking => booking.status === 'accepted').reduce((totalDays, booking) => {
      const startDate = new Date(booking.dateRange.start);
      const endDate = new Date(booking.dateRange.end);
      return totalDays + (startDate.getFullYear() === currentYear || endDate.getFullYear() === currentYear ? Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) : 0);
    }, 0);
  };
  const calculateTotalProfit = (bookings, currentYear) => {
    return bookings.filter(booking => booking.status === 'accepted').reduce((totalProfit, booking) => {
      const startDate = new Date(booking.dateRange.start);
      const endDate = new Date(booking.dateRange.end);
      return totalProfit + (startDate.getFullYear() === currentYear || endDate.getFullYear() === currentYear ? booking.totalPrice : 0);
    }, 0).toFixed(2);
  };
  const formatDateTime = (dateTimeStr) => {
    const date = new Date(dateTimeStr);
    return date.toLocaleString();
  };
  return (
    <>
      <ViewBookingItemInfo
        listing={listing}
        bookings={bookings}
        currentYear={currentYear}
        calculateDuration={calculateDuration}
        calculateBookedDays={calculateBookedDays}
        calculateTotalProfit={calculateTotalProfit}
        formatDateTime={formatDateTime}
      />
      <hr/>
      {bookings.map((item) => (
      <ViewBookingHistory
        key={item.id}
        item={item}
        formatDateTime={formatDateTime}
        acceptBooking={acceptBooking}
        declineBooking={declineBooking}
      />
      ))}
    </>
  );
};

export default ViewBookingRequest;
