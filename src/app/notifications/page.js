'use client';

import { useGetNotificationsQuery, useMarkNotificationReadMutation } from '../../store/apiSlice';

export default function Notifications() {
  const { data: notifications, isLoading } = useGetNotificationsQuery();
  const [markAsRead] = useMarkNotificationReadMutation();

  const handleMarkRead = async (id) => {
    try {
      await markAsRead(id).unwrap();
    } catch (error) {
      console.error('Mark read failed:', error);
    }
  };

  return (
    <div className="mobile-container min-h-screen bg-white dark:bg-black pb-16">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-center py-4">Notifications</h1>
      </header>
      
      <main className="space-y-4">
        {isLoading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          </div>
        )}
        
        <div className="space-y-3">
          {notifications?.map((notification) => (
            <div 
              key={notification._id} 
              className={`touch-friendly p-4 rounded-lg ${
                notification.isRead 
                  ? 'bg-gray-50 dark:bg-gray-800' 
                  : 'bg-blue-50 dark:bg-blue-900 border-l-4 border-blue-500'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold">{notification.title}</h3>
                {!notification.isRead && (
                  <button
                    onClick={() => handleMarkRead(notification._id)}
                    className="text-xs text-blue-500 px-2 py-1 rounded border border-blue-500"
                  >
                    Mark Read
                  </button>
                )}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {notification.message}
              </p>
              <span className="text-xs text-gray-500">
                {new Date(notification.createdAt).toLocaleDateString()}
              </span>
            </div>
          )) || (
            <div className="text-center py-8 text-gray-500">
              No notifications
            </div>
          )}
        </div>
      </main>
    </div>
  );
}