import React from 'react';
import Card from './Card';

const TitleCard = ({ cardColor }) => {
    return (
        <div className='mb-4'>
            <Card
                backgroundColor={cardColor}
                heading={
                    <div className='sm:text-left text-center'>
                        <span className='text-6xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-kanit'>Brutal</span>
                        <span className='hidden sm:inline'> </span>
                        <span className='text-7xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-7xl font-kanit'>Tasks</span>
                    </div>
                }
                showDivider={false}
            />
        </div>
    );
};

export default TitleCard;