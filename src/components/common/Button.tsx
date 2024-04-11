import React from 'react';

type Props = {
    children: React.ReactNode,
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => void,
    className?: string,
    color?: string,
    cardColor?: string,
    style?: React.CSSProperties,
};

const Button: React.FC<Props> = ({ children, onClick, className, color, cardColor, style }) => {
    const borderColor = cardColor !== 'Black' ? 'border-black' : 'border-white'; // Change 'Black' to 'black'

    return (
        <button
            aria-label='Click to perform an action'
            onClick={onClick}
            className={`flex cursor-pointer items-center rounded-md border-2 ${borderColor} px-2 py-1 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none ${className}`}
            style={{ backgroundColor: color || '#bc95d4', ...style }}
        >
            {children}
        </button>
    );
};

export default Button;