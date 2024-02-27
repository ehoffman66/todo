import React from 'react';

type Props = {
    children: React.ReactNode,
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => void,
    className?: string,
    color?: string,
    style?: React.CSSProperties, // Add style here
};

const Button: React.FC<Props> = ({ children, onClick, className, color, style }) => {
    return (
        <button
            aria-label='Click to perform an action'
            onClick={onClick}
            className={`flex cursor-pointer items-center rounded-md border-2 border-black px-2 py-1 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none ${className}`}
            style={{ backgroundColor: color || '#bc95d4', ...style }}
        >
            {children}
        </button>
    );
};

export default Button;
