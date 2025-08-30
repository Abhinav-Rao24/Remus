import React, { useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';

const ProfileInfoCard = () => {
    const { user, clearUser } = useContext(UserContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        clearUser();
        navigate('/');
    };

    return (
        user &&
        <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <span className="font-medium">{user?.name || 'User'}</span>
            <button 
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
                onClick={handleLogout}
            >
                Logout
            </button>
        </div>
    );
};

export default ProfileInfoCard;