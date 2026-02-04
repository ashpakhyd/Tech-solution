'use client';

import { useGetNotificationsQuery, useMarkNotificationReadMutation } from '../../store/apiSlice';
import { useState } from 'react';

export default function Alerts() {
  const { data: notifications, isLoading } = useGetNotificationsQuery();
  const [markAsRead] = useMarkNotificationReadMutation();
  const [loadingIds, setLoadingIds] = useState(new Set());

  const handleMarkRead = async (id) => {
    try {
      setLoadingIds(prev => new Set(prev).add(id));
      await markAsRead(id).unwrap();
    } catch (error) {
      console.error('Mark read failed:', error);
    } finally {
      setLoadingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
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
                    disabled={loadingIds.has(notification._id)}
                    className="text-xs text-primary px-2 py-1 rounded border border-primary disabled:opacity-50 flex items-center gap-1"
                  >
                    {loadingIds.has(notification._id) ? (
                      <>
                        <div className="w-3 h-3 border border-primary border-t-transparent rounded-full animate-spin"></div>
                        Loading...
                      </>
                    ) : (
                      'Mark Read'
                    )}
                  </button>
                )}
              </div>
              <p className="text-secondary text-sm mb-2">
                {notification.message}
              </p>
              <span className="text-xs text-secondary">
                {new Date(notification.createdAt).toLocaleDateString()} {new Date(notification.createdAt).toLocaleTimeString()}
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