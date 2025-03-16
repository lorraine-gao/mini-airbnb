import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';

const ListingsBox = styled(Box)({
  display: 'flex',
  flexDirection: 'row',
  margin: '0 auto',
  gap: '10px',
  width: '90%',
  padding: '20px',
  justifyContent: 'flex-start',
  flexWrap: 'wrap',
});

export default ListingsBox;
