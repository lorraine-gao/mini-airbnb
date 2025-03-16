import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Login from './page/Login';
import Register from './page/Register';
import LandingPage from './page/LandingPage';
import HostProperty from './page/HostProperty';
import CreateHostProperty from './page/CreateHostProperty';
import EditHostProperty from './page/EditHostProperty';
import ListingDetails from './page/ListingDetails';
import ViewBookingRequest from './page/ViewBookingRequest';
import GlobalAppBar from './components/GlobalAppBar';

// 登陆了才可以作为guest book peoperty, leave review, and as host to manager lising
const PageList = () => {
  const [token, setToken] = React.useState(null);

  React.useEffect(() => {
    const checktoken = localStorage.getItem('token');
    if (checktoken) {
      setToken(checktoken);
    }
  }, []);

  return (
    <>
      <GlobalAppBar token={token} setToken={setToken}/>
      <br />
      <Routes>
        <Route path="/" element={<LandingPage token={token} setToken={setToken}/>} />
        <Route path="/register" element={<Register token={token} setToken={setToken} />} />
        <Route path="/login" element={<Login token={token} setToken={setToken} />} />
        <Route path="/host" element={<HostProperty token={token} />} />
        <Route path="/createhostproperty" element={<CreateHostProperty token={token} />} />
        <Route path="/edititem/:id" element={<EditHostProperty token={token}/>} />
        <Route path="listing/:listingId/:nights" element={<ListingDetails token={token}/>} />
        <Route path="/viewbookingrequest/:id" element={<ViewBookingRequest token={token}/>} />
      </Routes>
      <br />
      <br />
    </>
  );
}

export default PageList;
