import request from 'supertest';
import app from '../app';
import { Server } from 'http';

let server: Server;

beforeAll((done) => {
    server = app.listen(4000, () => {
        console.log('Test server running on port 4000');
        done();
    });
});

afterAll((done) => {
    server.close(() => {
        console.log('Test server closed');
        done();
    });
});

describe('GET /', () => {
    it('should return Hello World', async () => {
        const response = await request(app).get('/');
        expect(response.status).toBe(200);
        expect(response.text).toBe('Hello World!');
    });
});
