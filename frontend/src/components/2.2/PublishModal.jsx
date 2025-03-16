import React from 'react';
import BasicDatePicker from '../BasicDatePicker.jsx';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import DatePickersContainer from '../Styled/DatePickersContainer.jsx';

const PublishModal = ({ itemId, open, onClose, fetchData }) => {
  const token = localStorage.getItem('token');
  const [availableNumber, setAvailableNumber] = React.useState(1); // 用于存储获取到的列表数据
  const [dateRanges, setDateRanges] = React.useState([{ start: null, end: null }]);

  const handleDateRangeChange = (index, field, value) => {
    const newDateRanges = [...dateRanges];
    newDateRanges[index][field] = value;
    setDateRanges(newDateRanges);
  };

  React.useEffect(() => {
    setDateRanges(current => {
      const newRanges = current.slice(0, availableNumber);
      while (newRanges.length < availableNumber) {
        newRanges.push({ start: null, end: null });
      }
      return newRanges;
    });
  }, [availableNumber]);

  const goPublish = async (id) => {
    if (availableNumber < 1) {
      alert('Number of available date cannot be less than 1');
    }
    const availability = dateRanges.map(range => ({ start: range.start, end: range.end }));
    event.preventDefault();
    const response = await fetch(`http://localhost:5005/listings/publish/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        availability
      }),
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-type': 'application/json',
      }
    });
    const data = await response.json();
    if (data.error) {
      alert(data.error);
    } else {
      fetchData();
      onClose();
    }
  }

  return (
    <Modal
    open={open}
    onClose={onClose}
    aria-labelledby="modal-modal-title"
    aria-describedby="modal-modal-description"
    >
    <Box sx={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '80%',
      maxWidth: 500,
      bgcolor: 'background.paper',
      border: '2px solid #000',
      boxShadow: 24,
      p: 4,
      '& > *': { marginY: 1 },
    }}>
      <Typography id="modal-modal-title" variant="h6" component="h2">
        Choose the date range for your property to be available!
      </Typography><br/>
      <TextField
        id="outlined-number"
        label="Number of available date"
        type="number"
        value={availableNumber}
        onChange={(e) => setAvailableNumber(Number(e.target.value))}
        InputLabelProps={{ shrink: true }}
      /><br/>
      {dateRanges.map((range, index) => (
        <div key={index}>
          <DatePickersContainer>
          <BasicDatePicker
            label={`Start Date ${index + 1}`}
            value={range.start}
            onChange={(newValue) => handleDateRangeChange(index, 'start', newValue)}
          />
          <BasicDatePicker
            label={`End Date ${index + 1}`}
            value={range.end}
            onChange={(newValue) => handleDateRangeChange(index, 'end', newValue)}
          />
          </DatePickersContainer>
        </div>
      ))}
      <Button variant="outlined" type="button" onClick={() => goPublish(itemId)}>Publish</Button>
    </Box>
    </Modal>
  );
}

export default PublishModal;
