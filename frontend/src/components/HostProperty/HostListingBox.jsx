import React from 'react';
import HostListingCard from './HostListingCard.jsx'; // 确保正确导入 ListingCard 组件
import ListingsBox from '../Styled/ListingsBox.jsx';

const HostListingsBox = ({ listings, edit, calculateRating, fetchData, deleteproperty, cancelPublish, viewBookingRequest }) => (
  <ListingsBox>
    {listings.map((item) => (
      <HostListingCard
        key={item.id}
        item={item}
        edit={edit}
        deleteproperty={deleteproperty}
        cancelPublish={cancelPublish}
        viewBookingRequest={viewBookingRequest}
        calculateRating={calculateRating}
        fetchData={fetchData}
      />
    ))}
  </ListingsBox>
);

export default HostListingsBox;
