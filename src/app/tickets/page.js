'use client';

import { useGetMyTicketsQuery } from '../../store/apiSlice';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import { useState } from 'react';
import { 
  MdAir, 
  MdLocalLaundryService, 
  MdKitchen, 
  MdTv, 
  MdMicrowave,
  MdOutlineWaterDrop,
  MdElectricalServices,
  MdBuild,
  MdLightbulb,
  MdElectricBolt,
  MdOutlineKitchen
} from 'react-icons/md';

export default function Tickets() {
  const { token } = useSelector((state) => state.auth);
  const { data: tickets, error, isLoading } = useGetMyTicketsQuery(undefined, {
    skip: !token,
  });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');

  const getApplianceIcon = (appliance) => {
    const iconClass = "w-6 h-6 text-red-600";
    const applianceLower = appliance?.toLowerCase() || '';
    
    // Appliances Repair
    if (applianceLower.includes('washing machine')) {
      return <MdLocalLaundryService className={iconClass} />;
    }
    if (applianceLower.includes('refrigerator')) {
      return <MdKitchen className={iconClass} />;
    }
    if (applianceLower.includes('microwave')) {
      return <MdMicrowave className={iconClass} />;
    }
    if (applianceLower.includes('dishwasher')) {
      return <MdOutlineKitchen className={iconClass} />;
    }
    if (applianceLower.includes('air conditioner')) {
      return <MdAir className={iconClass} />;
    }
    if (applianceLower.includes('television')) {
      return <MdTv className={iconClass} />;
    }
    
    // Electrician
    if (applianceLower.includes('wiring') || applianceLower.includes('installation')) {
      return <MdElectricalServices className={iconClass} />;
    }
    if (applianceLower.includes('electrical repair')) {
      return <MdElectricBolt className={iconClass} />;
    }
    if (applianceLower.includes('lighting')) {
      return <MdLightbulb className={iconClass} />;
    }
    if (applianceLower.includes('fan')) {
      return <MdElectricalServices className={iconClass} />;
    }
    
    return <MdBuild className={iconClass} />;
  };

  // Filter tickets based on search and filters
  const filteredTickets = tickets?.filter(ticket => {
    const matchesSearch = 
      ticket.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.customer?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.appliance?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === 'ALL' || ticket.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  }) || [];

  const statusCounts = {
    ALL: tickets?.length || 0,
    ASSIGNED: tickets?.filter(t => t.status === 'ASSIGNED').length || 0,
    IN_PROGRESS: tickets?.filter(t => t.status === 'IN_PROGRESS').length || 0,
    COMPLETED: tickets?.filter(t => t.status === 'COMPLETED').length || 0,
  };

  return (
    <div className="container safe-area pb-20">
      {/* Header */}
      <div className="px-6 py-6">
        <h1 className="text-2xl font-bold mb-6">My Tickets</h1>

        {/* Search Bar */}
        <div className="search-bar mb-4">
          <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
          <input 
            type="text" 
            placeholder="Search tickets, customers, appliances..." 
            className="flex-1 bg-transparent border-0 outline-0"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex gap-2 mb-4 overflow-x-auto">
          {Object.entries(statusCounts).map(([status, count]) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                statusFilter === status
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'
              }`}
            >
              {status.replace('_', ' ')} ({count})
            </button>
          ))}
        </div>

        {/* Priority Filter */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {['ALL', 'HIGH', 'MEDIUM', 'LOW'].map((priority) => (
            <button
              key={priority}
              onClick={() => setPriorityFilter(priority)}
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                priorityFilter === priority
                  ? 'bg-orange-100 text-orange-800'
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'
              }`}
            >
              {priority}
            </button>
          ))}
        </div>

        {/* Results Count */}
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-secondary">
            {filteredTickets.length} of {tickets?.length || 0} tickets
          </p>
          {(searchQuery || statusFilter !== 'ALL' || priorityFilter !== 'ALL') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('ALL');
                setPriorityFilter('ALL');
              }}
              className="text-sm text-primary font-semibold"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="px-6">
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
        
        {!isLoading && filteredTickets.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
              </svg>
            </div>
            <p className="text-secondary text-lg mb-2">No tickets found</p>
            <p className="text-secondary text-sm">
              {searchQuery || statusFilter !== 'ALL' || priorityFilter !== 'ALL'
                ? 'Try adjusting your filters'
                : 'No tickets assigned yet'
              }
            </p>
          </div>
        )}
        
        <div className="space-y-4">
          {filteredTickets.map((ticket) => (
            <Link key={ticket._id} href={`/ticket/${ticket._id}`}>
              <div className="card p-4 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                    {getApplianceIcon(ticket.appliance)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-base truncate pr-2">{ticket.title}</h4>
                      <span className={`px-2 py-1 text-xs rounded-full font-medium flex-shrink-0 ${
                        ticket.priority === 'HIGH' ? 'bg-red-100 text-red-800' :
                        ticket.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {ticket.priority}
                      </span>
                    </div>
                    
                    <p className="text-secondary text-sm mb-3 line-clamp-2">{ticket.description}</p>
                    
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                        ticket.status === 'ASSIGNED' ? 'bg-yellow-100 text-yellow-800' :
                        ticket.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {ticket.status.replace('_', ' ')}
                      </span>
                      <span className="text-xs text-secondary">
                        {ticket.appliance}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-secondary">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"/>
                        </svg>
                        <span>{ticket.customer?.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19,19H5V8H19M16,1V3H8V1H6V3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3H18V1M17,12H12V17H17V12Z"/>
                        </svg>
                        <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}