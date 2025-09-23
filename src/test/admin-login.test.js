const request = require('supertest');
const app = require('../server');

describe('Admin Login', () => {
    test('should successfully login with correct credentials', async () => {
        const response = await request(app)
            .post('/api/admin/login')
            .send({
                email: 'admin@autoperks.com',
                password: 'admin123'
            });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Login successful');
        expect(response.body.user.role).toBe('admin');
        expect(response.body.user.email).toBe('admin@autoperks.com');
    });

    test('should reject login with incorrect password', async () => {
        const response = await request(app)
            .post('/api/admin/login')
            .send({
                email: 'admin@autoperks.com',
                password: 'wrongpassword'
            });

        expect(response.status).toBe(401);
        expect(response.body.error).toBe('Invalid credentials');
    });

    test('should reject login with non-existent admin email', async () => {
        const response = await request(app)
            .post('/api/admin/login')
            .send({
                email: 'notanadmin@test.com',
                password: 'admin123'
            });

        expect(response.status).toBe(401);
        expect(response.body.error).toBe('Invalid credentials');
    });

    test('should reject login with empty credentials', async () => {
        const response = await request(app)
            .post('/api/admin/login')
            .send({
                email: '',
                password: ''
            });

        expect(response.status).toBe(401);
        expect(response.body.error).toBe('Invalid credentials');
    });
});

describe('Client Login', () => {
    test('should successfully login client with correct credentials', async () => {
        const response = await request(app)
            .post('/api/client/login')
            .send({
                email: 'client@test.com',
                password: 'client123'
            });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Login successful');
        expect(response.body.user.role).toBe('client');
    });
});