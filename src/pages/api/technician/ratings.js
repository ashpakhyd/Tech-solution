export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const mockRatings = [
    {
      _id: 'rating_1',
      rating: 5,
      feedback: 'Excellent service, very professional',
      customer: {
        name: 'John Customer'
      },
      createdAt: '2024-01-01T10:00:00Z'
    },
    {
      _id: 'rating_2',
      rating: 4,
      feedback: 'Good work, on time',
      customer: {
        name: 'Jane Smith'
      },
      createdAt: '2024-01-02T14:00:00Z'
    }
  ];

  return res.status(200).json(mockRatings);
}