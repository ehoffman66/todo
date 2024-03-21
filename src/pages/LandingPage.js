import React, { useState } from 'react';
import Button from '../components/common/Button.tsx';
import Card from '../components/common/Card.tsx';
import { FaGoogle } from 'react-icons/fa';

const LandingPage = () => {
    const [showAbout, setShowAbout] = useState(false);

    const handleAboutClick = () => {
        setShowAbout(!showAbout);
    };

    return (
        <div className='flex flex-col items-center justify-center h-screen bg-purple-300 px-4 sm:px-0'>
            <style>
                {`
                    @media (max-width: 640px) {
                        .title {
                            font-size: 7rem;
                        }
                        .subtitle {
                            font-size: 8rem;
                        }
                    }
                    @media (min-width: 641px) {
                        .title {
                            font-size: 10rem;
                        }
                        .subtitle {
                            font-size: 15rem;
                        }
                    }
                `}
            </style>
            <h1 className='mb-0 leading-none title' style={{ fontFamily: 'Kanit' }}>Brutal</h1>
            <h1 className='mt-0 mb-4 leading-none subtitle' style={{ fontFamily: 'Kanit' }}>Tasks</h1>
            <p className='mb-8 text-2xl md:text-3xl lg:text-4xl'>Conquer Your Day, The Brutal Way</p>
            <nav className='mb-8'>
                <button onClick={() => {}} className='mr-4'>Home</button>
                <button onClick={handleAboutClick}>About</button>
            </nav>
            {showAbout && (
                <div className='mt-4 mb-4 w-full max-w-xl mx-auto'>
                    <Card 
                        heading="About Brutal Tasks" 
                        paragraph="Welcome to Brutal Task! We're all about getting things done, and we mean business. With Brutal Tasks, you can organize your to-dos, prioritize them like a boss, and focus on one task at a time to smash your goals. Whether you're a student battling assignment deadlines, a professional wrestling with project milestones, or just someone who loves the sweet victory of a completed task list, Brutal Tasks is your ally. So gear up, prepare for a productivity boost, and conquer your day, the Brutal Way!" 
                        showDivider={true} 
                    />
                </div>
            )}
            <Button onClick={() => (window.location.href = `${process.env.REACT_APP_SERVER_URL}/auth/google`)} color="bc95d4">
                <FaGoogle className='mr-2' /> Login
            </Button>
        </div>
    );
};

export default LandingPage;