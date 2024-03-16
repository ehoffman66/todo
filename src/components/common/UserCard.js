import React from 'react';
import Card from './Card.tsx';
import Avatar from './Avatar.tsx';
import Button from './Button.tsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { FaGoogle } from 'react-icons/fa';

const UserCard = ({ user, handleLogout, cardColor }) => {
    return (
        <Card
            backgroundColor={cardColor}
            heading={<span className='text-2xl'>USER</span>}
            paragraph={
                user ? (
                    <div className='flex flex-col items-center'>
                        <div className='flex items-center space-x-4'>
                            <Avatar imageUrl={user.picture} />
                            <div>
                                <p className='text-lg'>{user.firstName}</p>
                                <p className='text-lg'>{user.lastName}</p>
                            </div>
                        </div>
                        <Button onClick={handleLogout} className='mt-4' color={cardColor}>
                            <FontAwesomeIcon icon={faSignOutAlt} style={{ marginRight: '10px' }} /> Logout
                        </Button>
                    </div>
                ) : (
                    <div className='flex justify-center'>
                        <Button onClick={() => (window.location.href = `${process.env.REACT_APP_SERVER_URL}/auth/google`)} color={cardColor}>
                            <FaGoogle className='mr-2' /> Login
                        </Button>
                    </div>
                )
            }
        />
    );
};

export default UserCard;
