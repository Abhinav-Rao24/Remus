import React, { useState } from 'react';
import {FaRegEye, FaRegEyeSlash} from 'react-icons/fa6';



const Input = ({
    value, onChange, label, placeholder, type}) => {
        const [showPassword, setShowPassword] = useState(false);

        const toggleShowPassword = () => {
            setShowPassword(!showPassword);
        };
  return <div>
    <label className=" block text-[13px] font-medium mb-1 ">{label}</label>
    <div className='relative'>
        <input 
        type={type==="password" ? (showPassword ? 'text' : 'password') : type} 
        placeholder={placeholder}
        className='w-full border border-gray-300 rounded-md px-3 py-1 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-100'
        value={value}
        onChange={(e)=> onChange(e)}
        />

        {type === 'password' && (
            <span
                className='absolute right-2 top-1/2 -translate-y-1/2 text-blue-500 cursor-pointer'
                onClick={toggleShowPassword}
            >
                {showPassword ? (
                    <FaRegEyeSlash size={18} />
                ) : (
                    <FaRegEye size={18} />
                )}
            </span>
        )}
    </div>
  </div>
};

export default Input;