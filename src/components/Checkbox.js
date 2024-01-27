import React from 'react';
import { MdClose } from 'react-icons/md';

const Checkbox = ({ item, checked, onChange }) => {
    return (
        <div className="my-2 flex items-center font-bold">
            <button
                onClick={onChange}
                className="mr-2.5 grid h-5 w-5 place-items-center rounded-[5px] bg-white outline outline-5 outline-black"
                role="checkbox"
                aria-checked={checked}
            >
                {checked && <MdClose className="h-4 w-4" style={{ transform: 'scale(1.5)' }} />}
            </button>
            <p className="text-left" style={{ fontSize: '1.2em', textDecoration: checked ? 'line-through' : 'none' }}>
                {item}
            </p>
        </div>
    );
};

export default Checkbox;