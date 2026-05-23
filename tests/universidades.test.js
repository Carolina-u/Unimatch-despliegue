// tests/universidades.test.js
const request = require('supertest');
const express = require('express');

const app = express();
app.use(express.json());

// Base de datos simulada
let universidades = [
    { id_universidad: 1, nombre: 'Universidad Nacional', ciudad: 'Bogotá', departamento: 'Cundinamarca', estado_nombre: 'Activa' },
    { id_universidad: 2, nombre: 'Universidad de Antioquia', ciudad: 'Medellín', departamento: 'Antioquia', estado_nombre: 'Activa' }
];

// Simulación de endpoints
app.get('/api/universidades', (req, res) => {
    res.json(universidades);
});

app.get('/api/universidades/:id', (req, res) => {
    const uni = universidades.find(u => u.id_universidad === parseInt(req.params.id));
    if (!uni) return res.status(404).json({ mensaje: 'No encontrada' });
    res.json(uni);
});

app.post('/api/admin/universidades', (req, res) => {
    const { nombre, ciudad, departamento } = req.body;
    if (!nombre || !ciudad || !departamento) {
        return res.status(400).json({ mensaje: 'Faltan campos obligatorios' });
    }
    const nueva = { id_universidad: universidades.length + 1, ...req.body, estado_nombre: 'Activa' };
    universidades.push(nueva);
    res.json({ mensaje: 'Universidad creada exitosamente', id: nueva.id_universidad });
});

app.put('/api/admin/universidades/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = universidades.findIndex(u => u.id_universidad === id);
    if (index === -1) return res.status(404).json({ mensaje: 'No encontrada' });
    universidades[index] = { ...universidades[index], ...req.body };
    res.json({ mensaje: 'Universidad actualizada exitosamente' });
});

app.delete('/api/admin/universidades/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = universidades.findIndex(u => u.id_universidad === id);
    if (index === -1) return res.status(404).json({ mensaje: 'No encontrada' });
    universidades.splice(index, 1);
    res.json({ mensaje: 'Universidad eliminada exitosamente' });
});

describe('Pruebas de CRUD - Universidades', () => {

    test('GET /api/universidades - debe listar todas las universidades', async () => {
        const response = await request(app).get('/api/universidades');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
    });

    test('GET /api/universidades/:id - debe obtener una universidad por ID', async () => {
        const response = await request(app).get('/api/universidades/1');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('nombre', 'Universidad Nacional');
    });

    test('POST /api/admin/universidades - debe crear una nueva universidad', async () => {
        const nueva = {
            nombre: 'Universidad del Valle',
            ciudad: 'Cali',
            departamento: 'Valle del Cauca'
        };
        const response = await request(app)
            .post('/api/admin/universidades')
            .send(nueva);
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id');
        expect(response.body.mensaje).toBe('Universidad creada exitosamente');
    });

    test('POST /api/admin/universidades - debe fallar si faltan campos', async () => {
        const incompleta = { nombre: 'Universidad Incompleta' };
        const response = await request(app)
            .post('/api/admin/universidades')
            .send(incompleta);
        
        expect(response.status).toBe(400);
        expect(response.body.mensaje).toBe('Faltan campos obligatorios');
    });

    test('PUT /api/admin/universidades/:id - debe actualizar una universidad', async () => {
        const actualizada = { nombre: 'Universidad Nacional de Colombia' };
        const response = await request(app)
            .put('/api/admin/universidades/1')
            .send(actualizada);
        
        expect(response.status).toBe(200);
        expect(response.body.mensaje).toBe('Universidad actualizada exitosamente');
    });

    test('DELETE /api/admin/universidades/:id - debe eliminar una universidad', async () => {
        const response = await request(app).delete('/api/admin/universidades/2');
        expect(response.status).toBe(200);
        expect(response.body.mensaje).toBe('Universidad eliminada exitosamente');
    });
});