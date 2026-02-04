'use client';

import { useGetMyTicketsQuery, useGetProfileQuery } from '../../store/apiSlice';
import { useRouter } from 'next/navigation';

export default function WorkReport() {
  const { data: tickets } = useGetMyTicketsQuery();
  const { data: profile } = useGetProfileQuery();
  const router = useRouter();

  const completedTickets = tickets?.filter(t => t.status === 'COMPLETED').length || 0;
  const inProgressTickets = tickets?.filter(t => t.status === 'IN_PROGRESS').length || 0;
  const assignedTickets = tickets?.filter(t => t.status === 'ASSIGNED').length || 0;
  const totalTickets = tickets?.length || 0;
  const completionRate = totalTickets > 0 ? Math.round((completedTickets / totalTickets) * 100) : 0;

  return (
    <div className="container safe-area pb-20">
      {/* Header */}
      <div className="px-6 py-4 bg-white border-b border-gray-100">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
            <svg className="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z"/>
            </svg>
          </button>
          <div>
            <h1 className="text-xl font-bold">Work Report</h1>
            <p className="text-sm text-secondary">{profile?.name}</p>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Overview Card */}
        <div className="gradient-card p-6">
          <h2 className="text-xl font-bold mb-4 text-white">Performance Overview</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">{totalTickets}</div>
              <div className="text-white/80 text-sm">Total Tickets</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">{completionRate}%</div>
              <div className="text-white/80 text-sm">Success Rate</div>
            </div>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-300"
              style={{ width: `${completionRate}%` }}
            ></div>
          </div>
        </div>

        {/* Status Breakdown */}
        <div className="card p-6">
          <h3 className="font-semibold mb-4">Ticket Status Breakdown</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <span>Completed</span>
              </div>
              <span className="font-semibold">{completedTickets}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                <span>In Progress</span>
              </div>
              <span className="font-semibold">{inProgressTickets}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                <span>Assigned</span>
              </div>
              <span className="font-semibold">{assignedTickets}</span>
            </div>
          </div>
        </div>

        {/* Recent Completed Tickets */}
        {completedTickets > 0 && (
          <div className="card p-6">
            <h3 className="font-semibold mb-4">Recently Completed</h3>
            <div className="space-y-3">
              {tickets?.filter(t => t.status === 'COMPLETED').slice(0, 5).map((ticket) => (
                <div key={ticket._id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                  <div>
                    <p className="font-medium text-sm">{ticket.title}</p>
                    <p className="text-xs text-secondary">{ticket.customer?.name}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-green-600 font-medium">Completed</div>
                    <div className="text-xs text-secondary">
                      {new Date(ticket.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Performance Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="card p-4 text-center">
            <div className="text-2xl font-bold text-primary mb-1">{completedTickets}</div>
            <div className="text-sm text-secondary">Jobs Done</div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">{inProgressTickets}</div>
            <div className="text-sm text-secondary">Active Jobs</div>
          </div>
        </div>
      </div>
    </div>
  );
}