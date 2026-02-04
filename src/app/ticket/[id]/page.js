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
  const otpRefs = useRef([]);

  const message = watch('message');
  const isInternal = watch('isInternal');

  const handleStatusUpdate = async (status, otpCode = null) => {
    try {
      const payload = { id, status };
      if (otpCode && otpCode.length === 6) {
        payload.customerOtp = otpCode;
      }
      await updateStatus(payload).unwrap();
      setShowOtpModal(false);
      setPendingStatus(null);
      setOtp(['', '', '', '', '', '']);
    } catch (error) {
      console.error('Status update failed:', error);
      console.error('Error details:', error.data); // More detailed error
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
            <div className="flex justify-between">
              <span className="text-secondary">Phone</span>
              <a href={`tel:${ticket?.customer?.phone}`} className="font-medium text-red-600">
                {ticket?.customer?.phone}
              </a>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary">Address</span>
              <span className="font-medium text-right flex-1 ml-4">{ticket?.address}</span>
            </div>
          </div>
        </div>

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
              <span className="text-secondary text-sm">Urgency</span>
              <p className="font-medium capitalize">{ticket?.urgency}</p>
            </div>
          </div>
        </div>

        {/* Status Actions */}
        <div className="card p-6">
          <h3 className="font-semibold mb-4">Update Status</h3>
          <div className="flex gap-3">
            {ticket?.status === 'ASSIGNED' && (
              <button
                onClick={handleStartWork}
                className="btn btn-primary flex-1"
              >
                Start Work
              </button>
            )}
            {ticket?.status === 'IN_PROGRESS' && (
              <button
                onClick={handleMarkComplete}
                className="btn btn-primary flex-1"
              >
                Mark Complete
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
                onClick={() => setShowOtpModal(false)}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-lg font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleOtpSubmit}
                disabled={otp.join('').length !== 6}
                className="flex-1 btn btn-primary disabled:opacity-50"
              >
                Verify
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}