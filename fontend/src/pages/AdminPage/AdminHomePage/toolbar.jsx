import React from 'react';

const UserInfoToolbar = ({ userName = 'User', role = '', onClick = () => {} }) => (
    <div className="flex items-center justify-end h-[45px] bg-white px-6 shadow-md" onClick={onClick}>
        <div className="flex items-center space-x-3 cursor-pointer hover:bg-gray-100 p-2 rounded transition">
            {/* Tên và Vai trò */}
            <div className="text-right">
                <span className="block text-sm font-semibold text-gray-800">{userName}</span>
                <span className="block text-xs text-gray-500">{role}</span>
            </div>
            {/* Avatar Placeholder */}
            <div className="w-9 h-9 bg-[#FFC419] rounded-full flex items-center justify-center text-white font-bold text-sm">
                {userName ? userName[0] : 'U'}
            </div>
        </div>
    </div>
);

export default UserInfoToolbar;
