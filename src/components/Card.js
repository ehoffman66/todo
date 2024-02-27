import React from 'react';

type Props = {
    heading: string,
    paragraph: React.ReactNode,
    size: string,
    backgroundColor: string,
};

const Card = ({ heading, paragraph, size = 'w-full', backgroundColor }: Props) => {
    return (
        <div
            style={{ backgroundColor: backgroundColor }}
            className={`${size} rounded-md border-2 border-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mx-auto`}
        >
            <div className='border-b-2 border-black p-4'>
                <h2 className='text-lg'>{heading}</h2>
            </div>
            <div className='p-4'>{paragraph}</div>
        </div>
    );
};

export default Card;
