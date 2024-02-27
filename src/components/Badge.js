import React from 'react';

export default function Badge({ badgeText, onClick, isSelected, badgeColor }) {
    const handleClick = () => {
        onClick(badgeColor);
    };

    return (
        <div
            className={`text-left my-1 w-min rounded-full border-2 border-black px-3 py-1.5 text-sm font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all ${
                isSelected ? 'translate-x-[3px] translate-y-[3px] shadow-none' : 'hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none'
            } cursor-pointer`}
            style={{ backgroundColor: badgeColor }}
            onClick={handleClick}
        >
            {badgeText}
        </div>
    );
}
