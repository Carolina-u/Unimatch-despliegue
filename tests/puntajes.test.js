const { calcularPuntajes, obtenerAreaPrincipal } = require('../utils/puntajes');

describe('Pruebas del Test Vocacional', () => {
    
    const puntajesPorOpcion = {
        1: [{ id_area: 1, puntaje: 5 }, { id_area: 6, puntaje: 4 }],
        2: [{ id_area: 1, puntaje: 4 }, { id_area: 2, puntaje: 5 }, { id_area: 6, puntaje: 5 }],
        3: [{ id_area: 2, puntaje: 5 }, { id_area: 3, puntaje: 4 }]
    };

    describe('calcularPuntajes', () => {
        test('debe calcular suma correcta para una opción', () => {
            const resultado = calcularPuntajes([1], puntajesPorOpcion);
            expect(resultado[1]).toBe(5);
            expect(resultado[6]).toBe(4);
        });

        test('debe calcular suma correcta para múltiples opciones', () => {
            const resultado = calcularPuntajes([1, 2], puntajesPorOpcion);
            expect(resultado[1]).toBe(9);   // 5 + 4
            expect(resultado[2]).toBe(5);
            expect(resultado[6]).toBe(9);   // 4 + 5
        });
    });

    describe('obtenerAreaPrincipal', () => {
        test('debe identificar el área con mayor puntaje', () => {
            const puntajes = { 1: 25, 2: 40, 3: 15 };
            const areaPrincipal = obtenerAreaPrincipal(puntajes);
            expect(areaPrincipal).toBe(2);
        });

        test('debe retornar null si no hay puntajes', () => {
            expect(obtenerAreaPrincipal({})).toBeNull();
        });
    });
});