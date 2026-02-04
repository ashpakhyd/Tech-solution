'use client';

import { useForm } from 'react-hook-form';
import { useGetTicketQuery, useUpdateTicketStatusMutation, useAddCommentMutation, useGetCommentsQuery } from '../../../store/apiSlice';
import { useParams, useRouter } from 'next/navigation';
import { useState, useRef } from 'react';

export default function TicketDetail() {
  const { id } = useParams();
  const router = useRouter();
  const { register, handleSubmit, watch, setValue, reset } = useForm({
    defaultValues: { message: '', isInternal: false }
  });
  
  const { data: ticket, isLoading } = useGetTicketQuery(id);
  const { data: comments } = useGetCommentsQuery(id);
  const [updateStatus] = useUpdateTicketStatusMutation();
  const [addComment] = useAddCommentMutation();
  const [showComments, setShowComments] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [pendingStatus, setPendingStatus] = useState(null);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const otpRefs = useRef([]);

  const message = watch('message');
  const isInternal = watch('isInternal');

  const showToast = (message, type = 'error') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  const clearOtpModal = () => {
    setShowOtpModal(false);
    setPendingStatus(null);
    setOtp(['', '', '', '', '', '']);
  };

  const handleStatusUpdate = async (status, otpCode = null) => {
    try {
      setIsUpdatingStatus(true);
      const payload = { id, status };
      if (otpCode && otpCode.length === 6) {
        if (status === 'COMPLETED') {
          payload.finalOTP = otpCode;
        } else {
          payload.customerOtp = otpCode;
        }
      }
      await updateStatus(payload).unwrap();
      clearOtpModal();
      showToast('Status updated successfully!', 'success');
    } catch (error) {
      console.error('Status update failed:', error);
      const errorMessage = error?.data?.message || 'Failed to update status. Please try again.';
      showToast(errorMessage, 'error');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleStartWork = () => {
    setPendingStatus('IN_PROGRESS');
    setShowOtpModal(true);
  };

  const handleMarkComplete = () => {
    setPendingStatus('COMPLETED');
    setShowOtpModal(true);
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpSubmit = () => {
    const otpCode = otp.join('').trim();
    if (otpCode.length === 6 && pendingStatus) {
      handleStatusUpdate(pendingStatus, otpCode);
    }
  };

  const onSubmit = async (data) => {
    if (!data.message.trim()) return;
    
    try {
      await addComment({ id, message: data.message, isInternal: data.isInternal }).unwrap();
      reset({ message: '', isInternal: false });
    } catch (error) {
      console.error('Comment failed:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="container safe-area flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="container safe-area pb-20">
      {/* Header */}
      <div className="px-6 py-4 bg-white border-b border-gray-100">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={() => router.back()} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
            <svg className="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z"/>
            </svg>
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold">{ticket?.title}</h1>
            <p className="text-sm text-secondary">Ticket #{ticket?._id?.slice(-6)}</p>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
            ticket?.status === 'ASSIGNED' ? 'bg-yellow-100 text-yellow-800' :
            ticket?.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
            'bg-green-100 text-green-800'
          }`}>
            {ticket?.status?.replace('_', ' ')}
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Ticket Overview */}
        <div className="card p-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-2">{ticket?.appliance} Service</h3>
              <p className="text-secondary mb-3">{ticket?.description}</p>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z"/>
                  </svg>
                  <span className="text-secondary">{ticket?.timeSlot}</span>
                </div>
                <div className={`px-2 py-1 rounded text-xs font-medium ${
                  ticket?.priority === 'HIGH' ? 'bg-red-100 text-red-800' :
                  ticket?.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {ticket?.priority} Priority
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Information */}
        <div className="card p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-red-600" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"/>
            </svg>
            Customer Details
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-secondary">Name</span>
              <span className="font-medium">{ticket?.customer?.name}</span>
            </div>
            {ticket?.status !== 'COMPLETED' && (
              <div className="flex justify-between">
                <span className="text-secondary">Phone</span>
                <a href={`tel:${ticket?.customer?.phone}`} className="font-medium text-red-600">
                  {ticket?.customer?.phone}
                </a>
              </div>
            )}
            {ticket?.status !== 'COMPLETED' && (
              <div className="flex justify-between">
                <span className="text-secondary">Address</span>
                <span className="font-medium text-right flex-1 ml-4">{ticket?.address}</span>
              </div>
            )}
            {ticket?.houseDetails && ticket?.status !== 'COMPLETED' && (
              <div className="flex justify-between">
                <span className="text-secondary">House Details</span>
                <span className="font-medium text-right flex-1 ml-4">{ticket?.houseDetails}</span>
              </div>
            )}
          </div>
        </div>

        {/* Location Map */}
        {ticket?.latitude && ticket?.longitude && ticket?.status !== 'COMPLETED' && (
          <div className="card p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-red-600" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,2C15.31,2 18,4.66 18,7.95C18,12.41 12,19 12,19S6,12.41 6,7.95C6,4.66 8.69,2 12,2M12,6A2,2 0 0,0 10,8A2,2 0 0,0 12,10A2,2 0 0,0 14,8A2,2 0 0,0 12,6Z"/>
              </svg>
              Location
            </h3>
            <div className="relative">
              <div className="w-full h-32 bg-gray-200 rounded-lg overflow-hidden mb-3">
                <iframe
                  src={`https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${ticket.latitude},${ticket.longitude}&zoom=15`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Location Map"
                ></iframe>
              </div>
              <button
                onClick={() => window.open(`https://www.google.com/maps?q=${ticket.latitude},${ticket.longitude}`, '_blank')}
                className="btn btn-primary w-full text-sm py-2"
              >
                Open in Maps
              </button>
            </div>
          </div>
        )}

        {/* Service Details */}
        <div className="card p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-red-600" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,2A2,2 0 0,1 14,4C14,4.74 13.6,5.39 13,5.73V7H14A4,4 0 0,1 18,11V12H16V11A2,2 0 0,0 14,9H13V10.27C13.6,10.61 14,11.26 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10C12.74,10 13.39,10.4 13.73,11H14A4,4 0 0,1 18,15V16H16V15A2,2 0 0,0 14,13H13.73C13.39,13.6 12.74,14 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10V9H11A2,2 0 0,0 9,11V12H7V11A4,4 0 0,1 11,7H12V5.73C11.4,5.39 11,4.74 11,4A2,2 0 0,1 12,2Z"/>
            </svg>
            Service Information
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-secondary text-sm">Appliance</span>
              <p className="font-medium">{ticket?.appliance}</p>
            </div>
            <div>
              <span className="text-secondary text-sm">Issue</span>
              <p className="font-medium">{ticket?.issue}</p>
            </div>
            <div>
              <span className="text-secondary text-sm">Category</span>
              <p className="font-medium">{ticket?.serviceCategory}</p>
            </div>
            <div>
              <span className="text-secondary text-sm">Service Type</span>
              <p className="font-medium capitalize">{ticket?.serviceType?.toLowerCase()}</p>
            </div>
            <div>
              <span className="text-secondary text-sm">Urgency</span>
              <p className="font-medium capitalize">{ticket?.urgency}</p>
            </div>
            <div>
              <span className="text-secondary text-sm">Time Slot</span>
              <p className="font-medium capitalize">{ticket?.timeSlot}</p>
            </div>
          </div>
        </div>

        {/* Technician Info */}
        {ticket?.technician && (
          <div className="card p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-red-600" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16,4C18.11,4 19.8,5.69 19.8,7.8C19.8,9.91 18.11,11.6 16,11.6C13.89,11.6 12.2,9.91 12.2,7.8C12.2,5.69 13.89,4 16,4M16,13.2C18.67,13.2 24,14.53 24,17.2V20H8V17.2C8,14.53 13.33,13.2 16,13.2M8,12A4,4 0 0,0 12,8A4,4 0 0,0 8,4A4,4 0 0,0 4,8A4,4 0 0,0 8,12M8,13C5.33,13 0,14.34 0,17V20H6V17.2C6,15.69 6.67,14.26 8,13Z"/>
              </svg>
              Assigned Technician
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-secondary">Name</span>
                <span className="font-medium">{ticket?.technician?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary">Phone</span>
                <a href={`tel:${ticket?.technician?.phone}`} className="font-medium text-red-600">
                  {ticket?.technician?.phone}
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Ticket Timeline */}
        <div className="card p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-red-600" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z"/>
            </svg>
            Timeline
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-secondary">Created</span>
              <span className="font-medium">{new Date(ticket?.createdAt).toLocaleDateString()} at {new Date(ticket?.createdAt).toLocaleTimeString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary">Last Updated</span>
              <span className="font-medium">{new Date(ticket?.updatedAt).toLocaleDateString()} at {new Date(ticket?.updatedAt).toLocaleTimeString()}</span>
            </div>
          </div>
        </div>

        {/* Attachments */}
        {ticket?.attachments?.length > 0 && (
          <div className="card p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-red-600" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
              </svg>
              Attachments ({ticket?.attachments?.length})
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {ticket?.attachments?.map((attachment, index) => (
                <div key={attachment._id || index} className="relative">
                  {attachment.type?.startsWith('image/') ? (
                    <div className="relative group">
                      <img
                        src={attachment.url}
                        alt={attachment.name}
                        className="w-full h-24 object-cover rounded-lg border border-gray-200 cursor-pointer"
                        onClick={() => window.open(attachment.url, '_blank')}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-all cursor-pointer flex items-center justify-center"
                           onClick={() => window.open(attachment.url, '_blank')}>
                        <svg className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z"/>
                        </svg>
                      </div>
                    </div>
                  ) : (
                    <div 
                      className="w-full h-24 bg-gray-100 rounded-lg border border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors"
                      onClick={() => window.open(attachment.url, '_blank')}
                    >
                      <svg className="w-8 h-8 text-gray-400 mb-1" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                      </svg>
                      <span className="text-xs text-gray-500 text-center px-1">{attachment.name?.slice(0, 15)}...</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Status Actions */}
        <div className="card p-6">
          <h3 className="font-semibold mb-4">Update Status</h3>
          <div className="flex gap-3">
            {ticket?.status === 'ASSIGNED' && (
              <button
                onClick={handleStartWork}
                disabled={isUpdatingStatus}
                className="btn btn-primary flex-1 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isUpdatingStatus && pendingStatus === 'IN_PROGRESS' ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Starting...
                  </>
                ) : (
                  'Start Work'
                )}
              </button>
            )}
            {ticket?.status === 'IN_PROGRESS' && (
              <button
                onClick={handleMarkComplete}
                disabled={isUpdatingStatus}
                className="btn btn-primary flex-1 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isUpdatingStatus && pendingStatus === 'COMPLETED' ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Completing...
                  </>
                ) : (
                  'Mark Complete'
                )}
              </button>
            )}
            {ticket?.status === 'COMPLETED' && (
              <div className="flex items-center justify-center py-3 text-green-600 font-medium">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z"/>
                </svg>
                Task Completed
              </div>
            )}
          </div>
        </div>

        {/* Comments Section */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Comments ({comments?.length || 0})</h3>
            <button
              onClick={() => setShowComments(!showComments)}
              className="text-red-600 text-sm font-medium"
            >
              {showComments ? 'Hide' : 'Show'} Comments
            </button>
          </div>

          {/* Add Comment Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="mb-4">
            <textarea
              {...register('message')}
              placeholder="Add a comment..."
              className="w-full p-3 border border-gray-200 rounded-lg resize-none mb-3"
              rows={3}
            />
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm">
                <input
                  {...register('isInternal')}
                  type="checkbox"
                  className="rounded"
                />
                <span className="text-secondary">Internal Note</span>
              </label>
              <button
                type="submit"
                disabled={!message?.trim()}
                className="btn btn-primary disabled:opacity-50"
              >
                Add Comment
              </button>
            </div>
          </form>

          {/* Comments List */}
          {showComments && (
            <div className="space-y-3 border-t pt-4">
              {comments?.map((comment) => (
                <div key={comment._id} className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium text-sm">{comment.user?.name}</span>
                    <div className="flex items-center gap-2">
                      {comment.isInternal && (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                          Internal
                        </span>
                      )}
                      <span className="text-xs text-secondary">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm">{comment.message}</p>
                </div>
              )) || (
                <p className="text-secondary text-sm text-center py-4">No comments yet</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* OTP Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-6">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-4 text-center">Enter OTP</h3>
            <p className="text-sm text-secondary text-center mb-6">
              Enter 6-digit OTP to {pendingStatus === 'IN_PROGRESS' ? 'start work' : 'mark complete'}
            </p>
            
            <div className="flex justify-center gap-2 mb-6">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (otpRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  className="w-10 h-10 text-center text-lg font-bold border-2 border-gray-300 rounded-lg focus:border-red-600 focus:outline-none"
                />
              ))}
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={clearOtpModal}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-lg font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleOtpSubmit}
                disabled={otp.join('').length !== 6 || isUpdatingStatus}
                className="flex-1 btn btn-primary disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isUpdatingStatus ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Verifying...
                  </>
                ) : (
                  'Verify'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-4 left-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
          toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{toast.message}</span>
            <button
              onClick={() => setToast({ show: false, message: '', type: '' })}
              className="ml-2 text-white hover:text-gray-200"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}