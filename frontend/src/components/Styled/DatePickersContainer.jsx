// DatePickersContainer.js
import { styled } from '@mui/material/styles';

const DatePickersContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1), // 调整为适合的间距

  // 媒体查询：宽度至少为400px时改为水平布局
  [theme.breakpoints.up('400')]: {
    flexDirection: 'row',
    justifyContent: 'space-around', // 子元素周围分配相同的空间
    gap: theme.spacing(4),
  },
}));

export default DatePickersContainer;
