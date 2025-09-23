const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const session = require('express-session');
const bcrypt = require('bcrypt');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors({
    origin: ['http://localhost:3001', 'http://localhost:3002'],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'autoperks-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false, // Set to true in production with HTTPS
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Serve static files for client and admin
app.use('/client', express.static(path.join(__dirname, '../client/build')));
app.use('/admin', express.static(path.join(__dirname, '../admin/build')));

// Mock database - in production this would be MongoDB/PostgreSQL
const users = [
    { id: 1, email: 'client@test.com', password: '$2b$10$hash1', role: 'client' },
    { id: 2, email: 'admin@autoperks.com', password: '$2b$10$hash2', role: 'admin' }
];

const bookings = [];
const services = [
    { id: 1, name: 'Car Wash', price: 25, duration: 30 },
    { id: 2, name: 'Full Detail', price: 150, duration: 180 },
    { id: 3, name: 'Oil Change', price: 45, duration: 45 }
];

// Client API Routes
app.post('/api/client/login', async (req, res) => {
    const { email, password } = req.body;
    
    const user = users.find(u => u.email === email && u.role === 'client');
    if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Simulate password check (in real app, use bcrypt.compare)
    if (password === 'client123') {
        req.session.userId = user.id;
        req.session.role = user.role;
        res.json({ message: 'Login successful', user: { id: user.id, email: user.email, role: user.role } });
    } else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
});

app.get('/api/services', (req, res) => {
    res.json(services);
});

app.post('/api/bookings', (req, res) => {
    if (!req.session.userId || req.session.role !== 'client') {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const { serviceId, date, time } = req.body;
    const booking = {
        id: bookings.length + 1,
        userId: req.session.userId,
        serviceId,
        date,
        time,
        status: 'pending',
        createdAt: new Date()
    };
    
    bookings.push(booking);
    res.json({ message: 'Booking created', booking });
});

// Admin API Routes - Fixed password validation logic
app.post('/api/admin/login', async (req, res) => {
    const { email, password } = req.body;
    
    // Input validation
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }
    
    console.log('Admin login attempt:', { email, password: '***' }); // Don't log actual password
    
    const admin = users.find(u => u.email === email && u.role === 'admin');
    if (!admin) {
        console.log('Admin not found');
        return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Fixed: Using proper comparison operator for password validation
    if (password === 'admin123') {
        req.session.userId = admin.id;
        req.session.role = admin.role;
        console.log('Admin login successful');
        res.json({ 
            message: 'Login successful', 
            user: { id: admin.id, email: admin.email, role: admin.role } 
        });
    } else {
        console.log('Invalid password');
        res.status(401).json({ error: 'Invalid credentials' });
    }
});

app.get('/api/admin/bookings', (req, res) => {
    if (!req.session.userId || req.session.role !== 'admin') {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const bookingsWithDetails = bookings.map(booking => ({
        ...booking,
        service: services.find(s => s.id === booking.serviceId),
        user: users.find(u => u.id === booking.userId)
    }));
    
    res.json(bookingsWithDetails);
});

app.put('/api/admin/bookings/:id', (req, res) => {
    if (!req.session.userId || req.session.role !== 'admin') {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const bookingId = parseInt(req.params.id);
    const { status, technicianId } = req.body;
    
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) {
        return res.status(404).json({ error: 'Booking not found' });
    }
    
    booking.status = status;
    if (technicianId) booking.technicianId = technicianId;
    
    res.json({ message: 'Booking updated', booking });
});

// Logout route
app.post('/api/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: 'Could not log out' });
        }
        res.json({ message: 'Logged out successfully' });
    });
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve client app
app.get('/client/*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

// Serve admin app
app.get('/admin/*', (req, res) => {
    res.sendFile(path.join(__dirname, '../admin/build/index.html'));
});

// Default route
app.get('/', (req, res) => {
    res.json({ 
        message: 'AutoPerks API Server',
        endpoints: {
            client: '/client',
            admin: '/admin',
            api: '/api'
        }
    });
});

app.listen(PORT, () => {
    console.log(`AutoPerks server running on port ${PORT}`);
    console.log(`Client portal: http://localhost:${PORT}/client`);
    console.log(`Admin portal: http://localhost:${PORT}/admin`);
});

module.exports = app;