// tests/backup.test.js
const request = require('supertest');
const express = require('express');

const app = express();

// Simulación de backup
app.get('/api/admin/backup', (req, res) => {
    const backupSQL = `-- BACKUP SIMULADO
CREATE TABLE universidad (...);
INSERT INTO universidad VALUES (1, 'Unal', 'Bogotá');`;
    
    res.setHeader('Content-Type', 'application/sql');
    res.setHeader('Content-Disposition', 'attachment; filename=backup.sql');
    res.send(backupSQL);
});

app.post('/api/admin/restaurar-backup', (req, res) => {
    res.json({ mensaje: 'Backup restaurado exitosamente', tablas_restauradas: 5 });
});

describe('Pruebas de Backup y Restauración', () => {

    test('GET /api/admin/backup - debe generar un archivo SQL descargable', async () => {
        const response = await request(app).get('/api/admin/backup');
        
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toContain('application/sql');
        expect(response.headers['content-disposition']).toContain('attachment');
        expect(response.text).toContain('CREATE TABLE');
    });

    test('POST /api/admin/restaurar-backup - debe restaurar la base de datos', async () => {
        const response = await request(app)
            .post('/api/admin/restaurar-backup')
            .send({});
        
        expect(response.status).toBe(200);
        expect(response.body.mensaje).toBe('Backup restaurado exitosamente');
        expect(response.body).toHaveProperty('tablas_restauradas');
    });
});