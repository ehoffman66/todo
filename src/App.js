import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ReactGA from 'react-ga';
import HomePage from './pages/HomePage';
import LandingPage from './pages/LandingPage';


ReactGA.initialize(process.env.REACT_APP_GA_TRACKING_ID);

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_SERVER_URL}/api/current_user`, {
            credentials: 'include', // Include credentials
        })
            .then(res => {
                if (res.status === 200) {
                    setIsAuthenticated(true);
                    isAuthenticated(true);
                } else if (res.status === 401) {
                    setIsAuthenticated(false);
                    isAuthenticated(true);
                }
            })

            .catch(err => console.error(err));
    }, [isAuthenticated]);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_SERVER_URL}/api/current_user`, {
            credentials: 'include', // Include credentials
        })
            .then(res => res.json())
            .then(data => setIsAuthenticated(!!data))
            .catch(err => console.error(err));
    }, []);

    return (
        <Router>
            <Routes>
                <Route path='/all' element={<HomePage />} />
                <Route path='/' element={<LandingPage />} />
            </Routes>
        </Router>
    );
}

export default App;