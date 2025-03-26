import React from 'react';
import TextField from '@mui/material/TextField';

const BedroomDetail = ({ index, bedroom, handleBedroomDetailChange }) => {
  return (
    <div>
      <TextField
        id={`bed-number-${index}`}
        label={`Bed number in bedroom ${index + 1}`}
        type="number"
        value={bedroom.bedNumber}
        onChange={(e) => handleBedroomDetailChange(index, 'bedNumber', Number(e.target.value))}
      />
      <TextField
        id={`bed-type-${index}`}
        label={`Bed type in bedroom ${index + 1}`}
        type="text"
        value={bedroom.bedType}
        onChange={(e) => handleBedroomDetailChange(index, 'bedType', e.target.value)}
      />
    </div>
  );
};

export default BedroomDetail;
