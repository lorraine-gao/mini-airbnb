import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';

const FilterForm = styled(Box)({
  width: '100%',
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  border: '1px solid lightgray',
  boxSizing: 'border-box',
  padding: '10px',
  gap: '10px',
});

export default FilterForm;
