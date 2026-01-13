export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const mockTickets = [
    {
      _id: 'ticket_1',
      title: 'AC Repair',
      description: 'AC not cooling properly',
      status: 'ASSIGNED',
      priority: 'HIGH',
      appliance: 'Air Conditioner',
      issue: 'Not cooling',
      address: '123 Main St, Jakarta',
      timeSlot: 'morning',
      urgency: 'urgent',
      serviceCategory: 'Repair',
      customer: {
        _id: 'customer_1',
        name: 'John Customer',
        phone: '9876543210'
      },
      createdAt: '2024-01-01T10:00:00Z'
    },
    {
      _id: 'ticket_2',
      title: 'Washing Machine Service',
      description: 'Regular maintenance required',
      status: 'IN_PROGRESS',
      priority: 'MEDIUM',
      appliance: 'Washing Machine',
      issue: 'Maintenance',
      address: '456 Oak Ave, Jakarta',
      timeSlot: 'afternoon',
      urgency: 'normal',
      serviceCategory: 'Maintenance',
      customer: {
        _id: 'customer_2',
        name: 'Jane Smith',
        phone: '9876543211'
      },
      createdAt: '2024-01-02T14:00:00Z'
    }
  ];

  return res.status(200).json(mockTickets);
}