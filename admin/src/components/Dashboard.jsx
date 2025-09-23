import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';

function Dashboard() {
  const { user, logout, bookings, loadBookings, updateBookingStatus, loading, error } = useApp();
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadBookings();
  }, []);

  const handleStatusUpdate = async (bookingId, status) => {
    const result = await updateBookingStatus(bookingId, status);
    if (result.success) {
      setMessage(`Booking ${bookingId} updated to ${status}`);
    } else {
      setMessage(result.error);
    }

    // Clear message after 3 seconds
    setTimeout(() => setMessage(''), 3000);
  };

  const handleLogout = async () => {
    await logout();
  };

  const handleRefresh = () => {
    loadBookings();
  };

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Admin Dashboard - {user?.email}</h1>
        <div>
          <button onClick={handleRefresh} className="success">
            Refresh
          </button>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>
      
      <h2>Booking Management</h2>
      
      {loading && <div>Loading bookings...</div>}
      
      {message && (
        <div className={message.includes('updated') ? 'success' : 'error'}>
          {message}
        </div>
      )}
      
      {error && <div className="error">{error}</div>}
      
      {bookings.length === 0 && !loading ? (
        <p>No bookings found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Client</th>
              <th>Service</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(booking => (
              <tr key={booking.id}>
                <td>{booking.id}</td>
                <td>{booking.user ? booking.user.email : 'Unknown'}</td>
                <td>
                  {booking.service ? booking.service.name : 'Unknown'} 
                  {booking.service && ` ($${booking.service.price})`}
                </td>
                <td>{booking.date}</td>
                <td>{booking.time}</td>
                <td>
                  <select
                    className="status-select"
                    value={booking.status}
                    onChange={(e) => handleStatusUpdate(booking.id, e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
                <td>
                  <button
                    onClick={() => handleStatusUpdate(booking.id, 'confirmed')}
                    className="success"
                    style={{ fontSize: '12px', padding: '5px 10px' }}
                  >
                    Confirm
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Dashboard;