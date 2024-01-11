import React from 'react';
import { MdClose } from 'react-icons/md';

const Checkbox = ({ item, checked, onChange }) => {
    return (
        <button
            onClick={onChange}
            className="my-2 flex items-center font-bold"
            role="checkbox"
            aria-checked={checked}
        >
            <div className="mr-2.5 grid h-5 w-5 place-items-center rounded-[5px] bg-white outline outline-5 outline-black">
                {checked && <MdClose className="h-4 w-4" style={{ transform: 'scale(1.5)' }} />}
            </div>
            <p style={{ fontSize: '1.2em', textDecoration: checked ? 'line-through solid 5px' : 'none' }}>{item}</p>
        </button>
    );
};

export default Checkbox;