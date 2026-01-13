'use client';

import { useGetNotificationsQuery, useMarkNotificationReadMutation } from '../../store/apiSlice';

export default function Alerts() {
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
    <div className="container safe-area pb-20">
      <div className="px-6 py-6">
        <h1 className="text-2xl font-bold mb-6">Alerts</h1>
        
        {isLoading && (
          <div className="flex justify-center py-12">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        
        <div className="space-y-4">
          {notifications?.map((notification) => (
            <div 
              key={notification._id} 
              className={`card p-4 ${
                !notification.isRead ? 'border-l-4 border-l-orange-500' : ''
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold">{notification.title}</h3>
                {!notification.isRead && (
                  <button
                    onClick={() => handleMarkRead(notification._id)}
                    className="text-xs text-primary px-2 py-1 rounded border border-primary"
                  >
                    Mark Read
                  </button>
                )}
              </div>
              <p className="text-secondary text-sm mb-2">
                {notification.message}
              </p>
              <span className="text-xs text-secondary">
                {new Date(notification.createdAt).toLocaleDateString()}
              </span>
            </div>
          )) || (
            <div className="text-center py-12">
              <p className="text-secondary">No alerts</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}