import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

function Dashboard() {
  const { user, logout, services, loadServices, createBooking, loading, error } = useApp();
  const [selectedService, setSelectedService] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadServices();
    
    // Set default date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setDate(tomorrow.toISOString().split('T')[0]);
  }, []);

  const handleBooking = async (e) => {
    e.preventDefault();
    
    if (!selectedService || !date || !time) {
      setMessage('Please fill all fields');
      return;
    }

    const result = await createBooking({
      serviceId: parseInt(selectedService),
      date,
      time
    });

    if (result.success) {
      setMessage('Booking created successfully!');
      setSelectedService('');
      setTime('');
      // Reset form but keep tomorrow's date
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setDate(tomorrow.toISOString().split('T')[0]);
    } else {
      setMessage(result.error);
    }

    // Clear message after 3 seconds
    setTimeout(() => setMessage(''), 3000);
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Welcome, {user?.email}</h1>
        <button onClick={handleLogout}>Logout</button>
      </div>
      
      <h2>Book a Service</h2>
      
      <form onSubmit={handleBooking}>
        <div className="form-group">
          <label htmlFor="service">Service:</label>
          <select
            id="service"
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            required
          >
            <option value="">Select a service</option>
            {services.map(service => (
              <option key={service.id} value={service.id}>
                {service.name} - ${service.price} ({service.duration}min)
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="date">Date:</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="time">Time:</label>
          <input
            type="time"
            id="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
        </div>
        
        <button type="submit" disabled={loading}>
          {loading ? 'Booking...' : 'Book Service'}
        </button>
      </form>
      
      {message && (
        <div className={message.includes('success') ? 'success' : 'error'}>
          {message}
        </div>
      )}
      
      {error && <div className="error">{error}</div>}
    </div>
  );
}

export default Dashboard;