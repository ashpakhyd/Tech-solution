import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: 'https://backend-ticket-assigning-tool.onrender.com/api',
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    headers.set('content-type', 'application/json');
    return headers;
  },
});

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: ['Ticket', 'User', 'Comment', 'Rating', 'Notification'],
  refetchOnMountOrArgChange: true,
  refetchOnFocus: true,
  refetchOnReconnect: true,
  endpoints: (builder) => ({
    // Auth APIs
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    getProfile: builder.query({
      query: () => '/auth/me',
      providesTags: ['User'],
      pollingInterval: 30000, // Refresh every 30 seconds
    }),
    
    // Ticket APIs
    getMyTickets: builder.query({
      query: () => '/tickets/my',
      providesTags: ['Ticket'],
      pollingInterval: 10000, // Refresh every 10 seconds
    }),
    getTicket: builder.query({
      query: (id) => `/tickets/${id}`,
      providesTags: (result, error, id) => [{ type: 'Ticket', id }],
      pollingInterval: 5000, // Refresh every 5 seconds
    }),
    updateTicketStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/tickets/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['Ticket'],
    }),
    
    // Comment APIs
    addComment: builder.mutation({
      query: ({ id, message, isInternal }) => ({
        url: `/tickets/${id}/comment`,
        method: 'POST',
        body: { message, isInternal },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Comment', id }, 'Ticket'],
    }),
    getComments: builder.query({
      query: (id) => `/tickets/${id}/comments`,
      providesTags: (result, error, id) => [{ type: 'Comment', id }],
      pollingInterval: 3000, // Refresh every 3 seconds
    }),
    
    // Attachment API
    uploadAttachment: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/tickets/${id}/attachment`,
        method: 'POST',
        body: formData,
        formData: true,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Ticket', id }],
    }),
    
    // Rating APIs
    getMyRatings: builder.query({
      query: () => '/technician/ratings',
      providesTags: ['Rating'],
      pollingInterval: 60000, // Refresh every minute
    }),
    
    // Notification APIs
    getNotifications: builder.query({
      query: () => '/notifications',
      providesTags: ['Notification'],
      pollingInterval: 5000, // Refresh every 5 seconds
    }),
    markNotificationRead: builder.mutation({
      query: (id) => ({
        url: `/notifications/${id}/read`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Notification'],
    }),
  }),
});

export const {
  useLoginMutation,
  useGetProfileQuery,
  useGetMyTicketsQuery,
  useGetTicketQuery,
  useUpdateTicketStatusMutation,
  useAddCommentMutation,
  useGetCommentsQuery,
  useUploadAttachmentMutation,
  useGetMyRatingsQuery,
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
} = apiSlice;