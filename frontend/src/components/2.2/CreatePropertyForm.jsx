import React from 'react';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import BedroomDetail from './BedroomDetail.jsx';

const CreatePropertyForm = ({
  title, setTitle,
  address, setAddress,
  price, setPrice,
  handleThumbnailChange,
  propertyType, setPropertyType,
  numberOfBathrooms, setNumberOfBathrooms,
  numberOfBedrooms, handleBedroomsChange,
  bedroomsDetails, handleBedroomDetailChange,
  amenities, setAmenities,
  submit
}) => {
  return (
    <Box
      component="form"
      sx={{
        '& .MuiTextField-root': { m: 1, width: '25ch' },
      }}
      noValidate
      autoComplete="off"
    >
      <TextField
        id = "outlined-basic-title"
        label="Title"
        required
        value={title}
        onChange={(e) => setTitle(e.target.value)}
    /><br/>
      <TextField
        id="outlined-basic-address"
        label="Address"
        required
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      /><br/>
      <TextField
        id="outlined-basic-price"
        label="Price(per night)"
        InputLabelProps={{
          shrink: true,
        }}
        type="number"
        value={price}
        onChange={(e) => setPrice(Number(e.target.value))}
      /><br/>
      <TextField
        id="outlined-basic-thumbnail"
        label="Thumbnail"
        type="file"
        InputLabelProps={{
          shrink: true,
        }}
        onChange={handleThumbnailChange}
      /><br/>
      <TextField
        id="outlined-basic-propertyType"
        label="Property Type"
        required
        value={propertyType}
        onChange={(e) => setPropertyType(e.target.value)}
      /><br/>
      <TextField
        label="Number of bathrooms"
        type="number"
        InputLabelProps={{
          shrink: true,
        }}
        value={numberOfBathrooms}
        onChange={(e) => setNumberOfBathrooms(Number(e.target.value))}
      /><br/>
      <TextField
        id="outlined-basic-bedrooms"
        label="Number of bedrooms"
        type="number"
        InputLabelProps={{
          shrink: true,
        }}
        value={numberOfBedrooms}
        onChange={handleBedroomsChange}
      /><br/>
      {/* 卧室细节部分 */}
      {bedroomsDetails.map((bedroom, index) => (
        <BedroomDetail
          key={index}
          index={index}
          bedroom={bedroom}
          handleBedroomDetailChange={handleBedroomDetailChange}
        />
      ))}
      <TextField
        id="outlined-basic-amenities"
        label="Amenities"
        required
        value={amenities}
        onChange={(e) => setAmenities(e.target.value)}
      /><br/>
      <Button
        id="outlined-basic-submit"
        sx={{ marginLeft: '25px' }}
        variant="outlined"
        type="button"
        onClick={submit}
      >Submit</Button>
    </Box>
  );
};

export default CreatePropertyForm;
