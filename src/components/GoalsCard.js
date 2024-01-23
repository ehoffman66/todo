import React from 'react';
import Card from './Card';

const StatsCard = ({ todos, cardColor }) => {
  return (
    <Card 
      backgroundColor={cardColor}
      heading={<span style={{ fontSize: '2em' }}>GOALS</span>} 
      paragraph={
        <div>

        </div>
      }
      size="xl:w-full" 
    />
  );
};

export default StatsCard;