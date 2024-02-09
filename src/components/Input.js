import React from 'react';

interface InputProps {
    value: string;
    setValue: React.Dispatch<React.SetStateAction<string>>;
    placeholder: string;
    type?: string;
    size?: string;
}

const Input: React.FC<InputProps> = ({ value, setValue, placeholder, type = 'text', size = '500px' }) => {
    return (
        <input
            className="text-left mr-[20px] rounded-md border-2 border-black p-[10px] font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] outline-none transition-all focus:translate-x-[3px] focus:translate-y-[3px] focus:shadow-none"
            style={{ width: size }}
            type={type}
            name="text"
            id="text"
            placeholder={placeholder}
            value={value}
            onChange={(e) => {
                setValue(e.target.value);
            }}
            aria-label={placeholder}
        />
    );
};

export default Input;