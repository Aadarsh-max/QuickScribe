import React from 'react';
import { getInitials } from '../../utils/helper';

const Profile = ({ userInfo, onLogout }) => {
  return (
    <div className='flex items-center gap-3'>
      <div className='w-12 h-12 flex items-center justify-center rounded-full text-indigo-700 dark:text-purple-300 font-semibold bg-indigo-100 dark:bg-purple-950'>
        {getInitials(userInfo?.fullName)}
      </div>

      <div>
        <p className='text-sm font-medium text-black'>
          {userInfo?.fullName}
        </p>
        <button
          className='text-sm text-black hover:underline'
          onClick={onLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
