import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import PageList from './PageList';
import { useEffect } from 'react';

const API_BASE_URL = process.env.REACT_APP_API_URL

const App = () => {
  useEffect(() => {
    const pingServer = () => {
      fetch(`${API_BASE_URL}/ping`)
        .then(() => console.log('Server pinged successfully'))
        .catch(() => console.log('Failed to ping server'));
    };

    pingServer();

    const interval = setInterval(pingServer, 10 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Router>
        <PageList />
      </Router>
    </>
  );
};

export default App;
