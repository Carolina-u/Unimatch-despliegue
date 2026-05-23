const { escapeHtml, validarCorreo } = require('../utils/helpers');

describe('Pruebas de funciones auxiliares', () => {

    describe('escapeHtml - Protección XSS', () => {
        test('debe escapar etiqueta script', () => {
            const input = '<script>alert("XSS")</script>';
            const output = escapeHtml(input);
            expect(output).toBe('&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;');
        });

        test('debe retornar cadena vacía para null o undefined', () => {
            expect(escapeHtml(null)).toBe('');
            expect(escapeHtml(undefined)).toBe('');
        });

        test('debe mantener texto normal sin cambios', () => {
            const input = 'Hola mundo';
            expect(escapeHtml(input)).toBe('Hola mundo');
        });
    });

    describe('validarCorreo - Validación de emails', () => {
        test('debe aceptar correo válido', () => {
            expect(validarCorreo('admin@unimatch.com')).toBe(true);
        });

        test('debe rechazar correo sin @', () => {
            expect(validarCorreo('adminunimatch.com')).toBe(false);
        });

        test('debe rechazar correo sin dominio', () => {
            expect(validarCorreo('admin@')).toBe(false);
        });
    });
});