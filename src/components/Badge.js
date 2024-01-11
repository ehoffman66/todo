import React from 'react';

export default function Badge({ badgeText, onClick, isSelected }) {
    const handleClick = () => {
        onClick(badgeText);
    };

    return (
        <div 
            className={`w-min rounded-full border-2 border-black bg-[#bc95d4] px-3 py-1.5 text-sm font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all ${isSelected ? 'translate-x-[3px] translate-y-[3px] shadow-none' : 'hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none'} cursor-pointer`}
            onClick={handleClick}
        >
            {badgeText}
        </div>
    )
}