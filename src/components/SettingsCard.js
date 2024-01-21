import React from 'react';
import Card from './Card';
import Checkbox from './Checkbox';
import Badge from './Badge';

const SettingsCard = ({ cardColor, hideCompleted, setHideCompleted, colorOptions, setCardColor }) => {
  return (
    <Card 
      backgroundColor={cardColor}
      heading={<span style={{ fontSize: '2em' }}>SETTINGS</span>} 
      paragraph={
        <>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Checkbox 
              item={hideCompleted} 
              checked={hideCompleted} 
              onChange={() => setHideCompleted(!hideCompleted)} 
              style={{ fontSize: '5.2em' }}
            />
            <span style={{ marginLeft: '10px' }}>Hide Completed</span>
          </div>
          <div>
            <label>Card Color</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '10px' }}>
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