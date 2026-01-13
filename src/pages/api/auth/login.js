export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { phone, password } = req.body;

  if (!phone || !password) {
    return res.status(400).json({ message: 'Phone and password required' });
  }

  if (phone === '1234567890' && password === 'password123') {
    return res.status(200).json({
      token: 'mock_jwt_token_' + Date.now()
    });
  }

  return res.status(401).json({ message: 'Invalid credentials' });
}