import React from 'react';
import Card from './Card';
import Checkbox from './Checkbox';
import Badge from './Badge';

const SettingsCard = ({ cardColor, hideCompleted, setHideCompleted, colorOptions, setCardColor }) => {
  return (
    <Card 
      backgroundColor={cardColor}
      heading={<span className="text-2xl">SETTINGS</span>} 
      paragraph={
        <>
          <div className="flex items-center">
            <Checkbox 
              item={hideCompleted} 
              checked={hideCompleted} 
              onChange={() => setHideCompleted(!hideCompleted)} 
              className="text-5xl"
            />
            <span className="ml-2">Hide Completed</span>
          </div>
          <div>
            <label>Card Color</label>
            <div className="flex flex-wrap justify-start items-center space-x-2 space-y-2">
              {colorOptions.map(color => (
                <Badge 
                  key={color} 
                  badgeColor={color}
                  badgeText=''
                  isSelected={cardColor === color}
                  onClick={setCardColor}
                />
              ))}
            </div>
          </div>
        </>
      }
      size="xl:w-full"
    />
  );
};

export default SettingsCard;