import React from 'react';
import Card from './Card';

const TitleCard = ({ cardColor }) => {
    return (
        <div className='mb-4'>
            <Card
                backgroundColor={cardColor}
                heading={
                    <div className='text-left'>
                        <div className='text-5xl font-kanit'>Brutal</div>
                        <div className='text-7xl font-kanit'>Tasks</div>
                    </div>
                }
                showDivider={false}
            />
        </div>
    );
};

export default TitleCard;