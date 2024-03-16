import React from 'react';
import Button from '../components/common/Button.tsx';
import { FaGoogle } from 'react-icons/fa';

const LandingPage = () => {

    return (
        <div className='flex flex-col items-center justify-center h-screen bg-purple-300'>
            <h1 className='mb-0 leading-none' style={{ fontFamily: 'Kanit', fontSize: '15rem' }}>Brutal</h1>
            <h1 className='mt-0 mb-4 leading-none' style={{ fontFamily: 'Kanit', fontSize: '20rem' }}>Tasks</h1>
            <p className='mb-8 text-xl'>Conquer Your Day, The Brutal Way</p>
            <Button onClick={() => (window.location.href = `${process.env.REACT_APP_SERVER_URL}/auth/google`)} color="bc95d4">
                <FaGoogle className='mr-2' /> Login
            </Button>
        </div>
    );
};

export default LandingPage; 