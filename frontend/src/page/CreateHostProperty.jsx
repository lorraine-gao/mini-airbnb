import React from 'react';
import { useNavigate } from 'react-router-dom';

import CreatePropertyForm from '../components/HostProperty/CreatePropertyForm.jsx';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5005';

const CreateHostProperty = (props) => {
  const [title, setTitle] = React.useState('');
  const [address, setAddress] = React.useState('');
  const [price, setPrice] = React.useState(0);
  const [thumbnail, setThumbnail] = React.useState('');
  const [propertyType, setPropertyType] = React.useState('');
  const [numberOfBathrooms, setNumberOfBathrooms] = React.useState(0);
  const [totalBeds, setTotalBeds] = React.useState(0);
  const [amenities, setAmenities] = React.useState('');

  const [numberOfBedrooms, setNumberOfBedrooms] = React.useState(0);
  const [bedroomsDetails, setBedroomsDetails] = React.useState([]);

  React.useEffect(() => {
    setBedroomsDetails(new Array(numberOfBedrooms).fill({ bedNumber: 1, bedType: '' }));
  }, [numberOfBedrooms]);

  const handleBedroomsChange = (event) => {
    const newNumberOfBedrooms = Number(event.target.value);
    // 检查是否为负数
    if (newNumberOfBedrooms < 0) {
      alert('Number of bedrooms cannot be negative.'); // 显示错误消息
      return; // 不更新状态，直接返回
    }
    setNumberOfBedrooms(newNumberOfBedrooms);
  };

  //  upload thumbnail image(base64 encoded)
  const handleThumbnailChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnail(reader.result);
      };
      reader.readAsDataURL(file);
    }
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

  const metadata = {
    propertyType,
    numberOfBathrooms,
    numberOfBedrooms,
    totalBeds,
    amenities
  };

  const navigate = useNavigate();

  const submit = async () => {
    event.preventDefault();
    // console.log('提交床位总数：', totalBeds);
    if (!title.trim() || !address.trim() || !propertyType.trim() || !amenities.trim() || !thumbnail.trim()) {
      alert('Title, address, property type, amenities and thumbnail are required.');
      return;
    }
    const response = await fetch(`${API_BASE_URL}/listings/new`, {
      method: 'POST',
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
  }

  return (
    <>
    <CreatePropertyForm
      title={title} setTitle={setTitle}
      address={address} setAddress={setAddress}
      price={price} setPrice={setPrice}
      handleThumbnailChange={handleThumbnailChange}
      propertyType={propertyType} setPropertyType={setPropertyType}
      numberOfBathrooms={numberOfBathrooms} setNumberOfBathrooms={setNumberOfBathrooms}
      numberOfBedrooms={numberOfBedrooms} handleBedroomsChange={handleBedroomsChange}
      bedroomsDetails={bedroomsDetails} handleBedroomDetailChange={handleBedroomDetailChange}
      amenities={amenities} setAmenities={setAmenities}
      submit={submit}/>
    </>
  );
}

export default CreateHostProperty;
