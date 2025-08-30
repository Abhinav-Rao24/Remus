import React, { useState, useRef } from 'react';
import { LuUser, LuUpload, LuTrash } from 'react-icons/lu';

const ProfilePhotoSelector = ({ image, setImage }) => {
    const inputRef = useRef(null);
    const [previewURL, setPreviewURL] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            const url = URL.createObjectURL(file);
            setPreviewURL(url);
        }
    };

    const handleRemoveImage = () => {
        setImage(null);
        setPreviewURL(null);
    };

    const onChooseFile = () => {
        inputRef.current.click();
    };

    return (
        <div className='flex justify-center mb-6'>
            <input
                type="file"
                accept="image/*"
                ref={inputRef}
                onChange={handleFileChange}
                className='hidden'
            />

            {!image ? (
                <div className='w-20 h-20 flex items-center justify-center bg-purple-50 rounded-full relative cursor-pointer'>
                    <LuUser className='text-4xl text-purple-500' />
                    <button
                        type='button'
                        className='w-8 h-8 flex items-center justify-center bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-full absolute bottom-0 right-0'
                        onClick={onChooseFile}
                    >
                        <LuUser />
                    </button>
                </div>
            ) : (
                <div className='relative'>
                    <img
                        src={previewURL}
                        alt="profile"
                        className='w-20 h-20 object-cover rounded-full'
                    />
                    <button
                        type='button'
                        className='absolute top-0 right-0 bg-white rounded-full p-1'
                        onClick={handleRemoveImage}
                    >
                        <LuTrash />
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProfilePhotoSelector;