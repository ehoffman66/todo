import React from 'react';
import { MdClose } from 'react-icons/md';

const Checkbox = ({ id, item, checked, onChange, style }) => {
    return (
        <div className='my-2 flex items-center font-bold'>
            <button
                onClick={() => onChange(id)}
                className='flex-shrink-0 mr-2.5 grid place-items-center rounded-[5px] bg-white outline outline-5 outline-black h-5 w-5 sm:h-5 sm:w-5'
                role='checkbox'
                aria-checked={checked}
            >
                {checked && <MdClose className='h-4 w-4' style={{ transform: 'scale(1.5)' }} />}
            </button>
            <div className='text-left' style={{ fontSize: '1.2em', textDecoration: checked ? 'line-through' : 'none' }}>
                {item}
            </div>
        </div>
    );
};

export default Checkbox;