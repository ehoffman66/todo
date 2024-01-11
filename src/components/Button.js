import React from 'react';

type Props = {
    children: React.ReactNode;
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
    className?: string;
};

const Button: React.FC<Props> = ({ children, onClick, className }) => {
    return (
        <button
                aria-label="Click to perform an action"
                onClick={onClick}
                className={`flex cursor-pointer items-center rounded-md border-2 border-black bg-[#bc95d4] px-2 py-1 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none ${className}`}
        >
                {children}
        </button>
    );
};

export default Button;