import React from 'react';
import { MdClose } from 'react-icons/md';

const Checkbox = ({ item, checked, onChange }) => {
    return (
        <div className="my-2 flex items-center font-bold">
            <input
                type="checkbox"
                checked={checked}
                onChange={onChange}
                className="mr-2"
            />
            <p className="text-left" style={{ fontSize: '1.2em', textDecoration: checked ? 'line-through' : 'none' }}>
                {item}
            </p>
        </div>
    );
};

export default Checkbox;