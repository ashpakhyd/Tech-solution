export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const mockNotifications = [
    {
      _id: 'notification_1',
      title: 'New Job Assigned',
      message: 'You have been assigned ticket AC Repair',
      type: 'TICKET_ASSIGNED',
      isRead: false,
      createdAt: '2024-01-01T10:00:00Z'
    },
    {
      _id: 'notification_2',
      title: 'Job Completed',
      message: 'Customer rated your service 5 stars',
      type: 'RATING_RECEIVED',
      isRead: true,
      createdAt: '2024-01-02T14:00:00Z'
    }
  ];

  return res.status(200).json(mockNotifications);
}