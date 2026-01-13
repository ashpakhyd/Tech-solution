export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  return res.status(200).json({
    _id: 'tech_123',
    name: 'John Technician',
    phone: '1234567890',
    role: 'TECHNICIAN',
    isActive: true,
    isVerified: true
  });
}