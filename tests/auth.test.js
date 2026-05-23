const request = require('supertest');
const express = require('express');

// Simulación del servidor para pruebas
const app = express();
app.use(express.json());

// Simulación del endpoint de login
app.post('/api/login-admin', (req, res) => {
    const { correo, contrasena } = req.body;
    
    // Credenciales correctas de prueba
    if (correo === 'admin@test.com' && contrasena === '123456') {
        res.json({ 
            token: 'fake-jwt-token-12345', 
            rol: 1, 
            nombre: 'Admin Test', 
            mensaje: 'Login exitoso' 
        });
    } 
    // Credenciales de editor
    else if (correo === 'editor@test.com' && contrasena === '123456') {
        res.json({ 
            token: 'fake-jwt-token-67890', 
            rol: 2, 
            nombre: 'Editor Test', 
            mensaje: 'Login exitoso' 
        });
    }
    else {
        res.status(401).json({ mensaje: 'Usuario no encontrado o inactivo' });
    }
});

describe('Pruebas de Autenticación - Login', () => {
    
    test('debe retornar token con credenciales de SuperAdmin correctas', async () => {
        const response = await request(app)
            .post('/api/login-admin')
            .send({ correo: 'admin@test.com', contrasena: '123456' });
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('token');
        expect(response.body).toHaveProperty('rol', 1);
        expect(response.body).toHaveProperty('nombre', 'Admin Test');
        expect(response.body).toHaveProperty('mensaje', 'Login exitoso');
    });

    test('debe retornar token con credenciales de Editor correctas', async () => {
        const response = await request(app)
            .post('/api/login-admin')
            .send({ correo: 'editor@test.com', contrasena: '123456' });
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('token');
        expect(response.body).toHaveProperty('rol', 2);
    });

    test('debe retornar 401 con credenciales incorrectas', async () => {
        const response = await request(app)
            .post('/api/login-admin')
            .send({ correo: 'invalido@test.com', contrasena: 'wrongpass' });
        
        expect(response.status).toBe(401);
        expect(response.body.mensaje).toBe('Usuario no encontrado o inactivo');
    });

    test('debe retornar 401 si falta el correo', async () => {
        const response = await request(app)
            .post('/api/login-admin')
            .send({ contrasena: '123456' });
        
        expect(response.status).toBe(401);
    });
});