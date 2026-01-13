'use client';

import { useGetMyTicketsQuery, useGetProfileQuery, useGetNotificationsQuery } from '../store/apiSlice';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import { useState } from 'react';

export default function Home() {
  const { token } = useSelector((state) => state.auth);
  const { data: tickets, error, isLoading } = useGetMyTicketsQuery(undefined, {
    skip: !token,
  });
  const { data: profile } = useGetProfileQuery(undefined, {
    skip: !token,
  });
  const { data: notifications } = useGetNotificationsQuery(undefined, {
    skip: !token,
  });
  
  const [searchQuery, setSearchQuery] = useState('');

  if (!token) {
    return (
      <div className="container safe-area flex items-center justify-center">
        <div className="text-center px-6">
          <h1 className="text-2xl font-bold mb-4">Welcome</h1>
          <p className="text-secondary mb-8">Please sign in to continue</p>
          <Link href="/login" className="btn btn-primary">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  const completedTickets = tickets?.filter(t => t.status === 'COMPLETED').length || 0;
  const totalTickets = tickets?.length || 0;
  const completionRate = totalTickets > 0 ? Math.round((completedTickets / totalTickets) * 100) : 0;
  const unreadNotifications = notifications?.filter(n => !n.isRead).length || 0;

  const filteredTickets = tickets?.filter(ticket => 
    ticket.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ticket.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ticket.customer?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="container safe-area pb-20">
      {/* Header */}
      <div className="px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="avatar">
              <span>{profile?.name?.charAt(0) || 'T'}</span>
            </div>
            <div>
              <p className="text-sm text-secondary">Hello!</p>
              <h1 className="text-xl font-bold">{profile?.name || 'Technician'}</h1>
            </div>
          </div>
          <Link href="/alerts" className="relative">
            <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21,19V20H3V19L5,17V11C5,7.9 7.03,5.17 10,4.29C10,4.19 10,4.1 10,4A2,2 0 0,1 12,2A2,2 0 0,1 14,4C14,4.1 14,4.19 14,4.29C16.97,5.17 19,7.9 19,11V17L21,19M14,21A2,2 0 0,1 12,23A2,2 0 0,1 10,21"/>
              </svg>
              {unreadNotifications > 0 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-bold">{unreadNotifications}</span>
                </div>
              )}
            </div>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="search-bar mb-6">
          <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
          <input 
            type="text" 
            placeholder="Search tickets, customers..." 
            className="flex-1 bg-transparent border-0 outline-0"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Work Status Card */}
        <div className="gradient-card p-6 mb-6">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h2 className="text-xl font-bold mb-2">Your Work Report</h2>
              <p className="text-white/80 text-sm mb-4">Track your daily progress and completed tasks</p>
              <Link href="/tickets" className="bg-white text-red-600 px-6 py-2 rounded-full font-semibold text-sm inline-block">
                View Details
              </Link>
            </div>
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-white/30 flex items-center justify-center relative">
                <span className="text-2xl font-bold">{completionRate}%</span>
                <svg className="absolute inset-0 w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    fill="none"
                    stroke="rgba(255,255,255,0.3)"
                    strokeWidth="4"
                  />
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    fill="none"
                    stroke="white"
                    strokeWidth="4"
                    strokeDasharray={`${(completionRate / 100) * 175.9} 175.9`}
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Your Tickets Section */}
      <div className="px-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Your Tickets</h3>
          <Link href="/tickets" className="text-primary text-sm font-semibold">
            View All
          </Link>
        </div>

        {isLoading && (
          <div className="flex justify-center py-12">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            Error loading tickets
          </div>
        )}
        
        <div className="space-y-4 mb-6">
          {(searchQuery ? filteredTickets : tickets?.slice(0, 3))?.map((ticket) => (
            <Link key={ticket._id} href={`/ticket/${ticket._id}`}>
              <div className="card p-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                    <svg className="w-6 h-6 text-red-600" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">{ticket.title}</h4>
                    <p className="text-secondary text-sm mb-2">{ticket.description}</p>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        ticket.status === 'ASSIGNED' ? 'bg-yellow-100 text-yellow-800' :
                        ticket.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {ticket.status}
                      </span>
                      <span className="text-xs text-secondary">
                        {ticket.customer?.name}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-secondary">
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </p>
                    <p className={`text-xs font-medium ${
                      ticket.priority === 'HIGH' ? 'text-red-600' :
                      ticket.priority === 'MEDIUM' ? 'text-yellow-600' :
                      'text-green-600'
                    }`}>
                      {ticket.priority}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          )) || (
            <div className="text-center py-12">
              <p className="text-secondary">No tickets found</p>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="card p-4 text-center">
            <div className="text-2xl font-bold text-primary mb-1">{totalTickets}</div>
            <div className="text-sm text-secondary">Total Tickets</div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">{completedTickets}</div>
            <div className="text-sm text-secondary">Completed</div>
          </div>
        </div>

        {/* Recent Notifications */}
        {notifications?.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Recent Alerts</h3>
              <Link href="/alerts" className="text-primary text-sm font-semibold">
                View All
              </Link>
            </div>
            <div className="space-y-3">
              {notifications.slice(0, 2).map((notification) => (
                <div key={notification._id} className="card p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                      <svg className="w-4 h-4 text-red-600" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M21,19V20H3V19L5,17V11C5,7.9 7.03,5.17 10,4.29C10,4.19 10,4.1 10,4A2,2 0 0,1 12,2A2,2 0 0,1 14,4C14,4.1 14,4.19 14,4.29C16.97,5.17 19,7.9 19,11V17L21,19M14,21A2,2 0 0,1 12,23A2,2 0 0,1 10,21"/>
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{notification.title}</h4>
                      <p className="text-secondary text-xs">{notification.message}</p>
                    </div>
                    {!notification.isRead && (
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
