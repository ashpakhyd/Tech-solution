'use client';

import { useGetProfileQuery, useGetMyRatingsQuery } from '../../store/apiSlice';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';
import { useRouter } from 'next/navigation';

export default function Profile() {
  const { data: profile } = useGetProfileQuery();
  const { data: ratings } = useGetMyRatingsQuery();
  const dispatch = useDispatch();
  const router = useRouter();

  const averageRating = ratings?.length 
    ? (ratings.reduce((sum, rating) => sum + rating.rating, 0) / ratings.length).toFixed(1)
    : 0;

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      dispatch(logout());
    }
  };

  return (
    <div className="container safe-area pb-20">
      <div className="px-6 py-6">
        <h1 className="text-2xl font-bold mb-6">Profile</h1>

        {/* Profile Card */}
        <div className="card p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="avatar">
              <span>{profile?.name?.charAt(0) || 'T'}</span>
            </div>
            <div>
              <h2 className="text-xl font-bold">{profile?.name || 'Technician'}</h2>
              <p className="text-secondary">{profile?.phone}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-primary">{ratings?.length || 0}</div>
              <div className="text-sm text-secondary">Total Reviews</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-primary">{averageRating}</div>
              <div className="text-sm text-secondary">Average Rating</div>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="space-y-2">
          <button className="w-full card p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"/>
                </svg>
              </div>
              <span className="font-medium">Edit Profile</span>
            </div>
            <svg className="w-5 h-5 text-secondary" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"/>
            </svg>
          </button>

          <button className="w-full card p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8Z"/>
                </svg>
              </div>
              <span className="font-medium">Settings</span>
            </div>
            <svg className="w-5 h-5 text-secondary" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"/>
            </svg>
          </button>

          <button className="w-full card p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11,18H13V16H11V18M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,6A4,4 0 0,0 8,10H10A2,2 0 0,1 12,8A2,2 0 0,1 14,10C14,12 11,11.75 11,15H13C13,12.75 16,12.5 16,10A4,4 0 0,0 12,6Z"/>
                </svg>
              </div>
              <span className="font-medium">Help & Support</span>
            </div>
            <svg className="w-5 h-5 text-secondary" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"/>
            </svg>
          </button>

          <button 
            onClick={handleLogout}
            className="w-full card p-4 flex items-center justify-between border-red-200 hover:bg-red-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-red-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16,17V14H9V10H16V7L21,12L16,17M14,2A2,2 0 0,1 16,4V6H14V4H5V20H14V18H16V20A2,2 0 0,1 14,22H5A2,2 0 0,1 3,20V4A2,2 0 0,1 5,2H14Z"/>
                </svg>
              </div>
              <span className="font-medium text-red-600">Logout</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}