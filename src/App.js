import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ReactGA from 'react-ga';
import HomePage from './pages/HomePage';

ReactGA.initialize(process.env.REACT_APP_GA_TRACKING_ID);

function App() {
    return (
        <Router>
            <Routes>
                <Route
                    path='*'
                    element={
                        <HomePage />
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;
