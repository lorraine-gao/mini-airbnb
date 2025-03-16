import React from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

const EditHostProperty = (props) => {
  const { id } = useParams(); // 从 URL 获取 id
  const location = useLocation();
  const listing = location.state.listing; // 如果 state 未定义，则防止解构错误
  // console.log(listing);
  const [title, setTitle] = React.useState(listing.title);
  const [address, setAddress] = React.useState(listing.address);
  const [price, setPrice] = React.useState(listing.price);
  const [thumbnail, setThumbnail] = React.useState(null);
  const [propertyType, setPropertyType] = React.useState(listing.metadata.propertyType);
  const [numberOfBathrooms, setNumberOfBathrooms] = React.useState(listing.metadata.numberOfBathrooms);
  const [totalBeds, setTotalBeds] = React.useState(listing.metadata.totalBeds);
  const [amenities, setAmenities] = React.useState(listing.metadata.amenities);
  const [displayImages, setDisplayImages] = React.useState([]);
  const [propertyImages, setPropertyImages] = React.useState([]);

  const [numberOfBedrooms, setNumberOfBedrooms] = React.useState(0);
  const [bedroomsDetails, setBedroomsDetails] = React.useState([]);
  React.useEffect(() => {
    setBedroomsDetails(new Array(numberOfBedrooms).fill({ bedNumber: 1, bedType: '' }));
  }, [numberOfBedrooms]);

  const handleBedroomsChange = (event) => {
    setNumberOfBedrooms(Number(event.target.value));
  };

  const handleBedroomDetailChange = (index, key, value) => {
    // 更新床位详情
    const newDetails = bedroomsDetails.map((detail, i) =>
      i === index ? { ...detail, [key]: value } : detail
    );
    setBedroomsDetails(newDetails);

    // 如果更改的是床位数量，更新总数
    if (key === 'bedNumber') {
      // 计算所有床位的总数
      const newTotalBeds = newDetails.reduce((sum, current) => sum + Number(current.bedNumber), 0);
      setTotalBeds(newTotalBeds);
    }
  };

  const handleThumbnailChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnail(reader.result); // 更新缩略图的状态
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePropertyImagesChange = (event) => {
    const files = Array.from(event.target.files);

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPropertyImages(prevImages => [...prevImages, reader.result]);
        setDisplayImages(prevDisplayImages => [...prevDisplayImages, URL.createObjectURL(file)]);
      };
      reader.readAsDataURL(file);
    });
  };

  const metadata = {
    propertyType,
    numberOfBathrooms,
    numberOfBedrooms,
    totalBeds,
    amenities,
    propertyImages
  };
  const navigate = useNavigate();
  const submit = async () => {
    event.preventDefault();
    const response = await fetch(`http://localhost:5005/listings/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        title, address, price, thumbnail, metadata
      }),
      headers: {
        Authorization: `Bearer ${props.token}`,
        'Content-type': 'application/json',
      }
    });
    const data = await response.json();
    if (data.error) {
      alert(data.error);
    } else {
      navigate('/host');
    }
  };
  return (
    <>
    <Box
      component="form"
      sx={{
        '& .MuiTextField-root': { m: 1, width: '25ch' },
      }}
      noValidate
      autoComplete="off"
    >
    <TextField
      id="outlined-multiline-flexible"
      label="Title"
      defaultValue={listing.title}
      onChange={(e) => setTitle(e.target.value)}
    /><br/>
    <TextField
      id="outlined-multiline-flexible"
      label="Address"
      defaultValue={listing.address}
      onChange={(e) => setAddress(e.target.value)}
    /><br/>
    <TextField
      id="outlined-multiline-flexible"
      label="Price(per night)"
      type="number"
      defaultValue={listing.price}
      onChange={(e) => setPrice(e.target.value)}
    /><br/>
    <Typography sx={{ mt: -1, mx: 1.5 }}>Original thumbnail:</Typography>
    <Typography sx={{ mt: 0, mx: 1.5 }}><img src={listing.thumbnail} alt="Thumbnail" width={'120px'}/><br/></Typography>
    <TextField
      id="outlined-multiline-flexible"
      label="Change thumbnail"
      type="file"
      InputLabelProps={{
        shrink: true,
      }}
      variant="outlined"
      onChange={handleThumbnailChange}
    /><br/>
    <TextField
      id="outlined-multiline-flexible"
      label="Property Type"
      defaultValue={listing.metadata.propertyType}
      // value={propertyType}
      onChange={(e) => setPropertyType(e.target.value)}
    /><br/>
    <TextField
      label="Number of bathrooms"
      type="number"
      InputLabelProps={{
        shrink: true,
      }}
      defaultValue={listing.metadata.numberOfBathrooms}
      onChange={(e) => setNumberOfBathrooms(e.target.value)}
    /><br/>
    <TextField
      id="outlined-number"
      label="Number of bedrooms"
      type="number"
      InputLabelProps={{
        shrink: true,
      }}
      defaultValue={listing.metadata.numberOfBedrooms}
      onChange={handleBedroomsChange}
    />
    {bedroomsDetails.map((bedroom, index) => (
      <div key={index}>
        <TextField
          id={`bed-number-${index}`}
          label={`Bed number in bedroom ${index + 1}`}
          type="number"
          value={bedroom.bedNumber}
          onChange={(e) =>
            handleBedroomDetailChange(index, 'bedNumber', Number(e.target.value))
          }
        />
        <TextField
          id={`bed-type-${index}`}
          label={`Bed type in bedroom ${index + 1}`}
          type="text"
          value={bedroom.bedType}
          onChange={(e) =>
            handleBedroomDetailChange(index, 'bedType', e.target.value)
          }
        />
      </div>
    ))}<br/>
    <TextField
      id="outlined-multiline-flexible"
      label="Amenities"
      defaultValue={listing.metadata.amenities}
      onChange={(e) => setAmenities(e.target.value)}
    />
    {listing.metadata.propertyImages && listing.metadata.propertyImages.length > 0
      ? <Typography sx={{ mt: -1, mx: 1.5 }}>Original property image list:</Typography>
      : <Typography sx={{ mt: -1, mx: 1.5 }}>Did not have image list yet</Typography>
    }
    <Typography sx={{ mt: 0, mx: 1.5 }}>
    {Array.isArray(listing.metadata?.propertyImages) && listing.metadata.propertyImages.map((image, index) => (
      <div key={index}>
        <img src={image} alt={`Property Image ${index}`} width={'120px'} />
        <br />
      </div>
    ))}
    </Typography>
    <TextField
      id="outlined-multiline-flexible"
      label="Upload property images"
      type="file"
      multiple
      InputLabelProps={{
        shrink: true,
      }}
      variant="outlined"
      onChange={handlePropertyImagesChange}
    />
    {displayImages && displayImages.length > 0
      ? <Typography sx={{ mt: -1, mx: 1.5 }}>The image that will be uploaded:</Typography>
      : <Typography sx={{ mt: -1, mx: 1.5 }}>You have not selected any photos. <br/>Once submitted, the original image list will be cleared.</Typography>
    }
    <Typography sx={{ mt: 0, mx: 1.5 }}>
      {displayImages.map((imageUrl, index) => (
        <div key={index}>
          <img width='120px' src={imageUrl} alt={`Property ${index}`} />
        </div>
      ))}
    </Typography>
    </Box>
    <Button sx={{
      marginLeft: '25px'
    }}variant="outlined" type="button" onClick={submit}>Submit</Button>
    </>
  )
}

export default EditHostProperty;
