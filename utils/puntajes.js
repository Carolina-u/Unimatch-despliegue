function calcularPuntajes(opcionesSeleccionadas, puntajesPorOpcion) {
    const puntajesPorArea = {};
    
    opcionesSeleccionadas.forEach(opcionId => {
        const puntajes = puntajesPorOpcion[opcionId] || [];
        puntajes.forEach(p => {
            if (!puntajesPorArea[p.id_area]) {
                puntajesPorArea[p.id_area] = 0;
            }
            puntajesPorArea[p.id_area] += p.puntaje;
        });
    });
    
    return puntajesPorArea;
}

function obtenerAreaPrincipal(puntajesPorArea) {
    const areas = Object.entries(puntajesPorArea);
    if (areas.length === 0) return null;
    const areaPrincipal = areas.reduce((max, actual) => actual[1] > max[1] ? actual : max)[0];
return parseInt(areaPrincipal);
}

module.exports = { calcularPuntajes, obtenerAreaPrincipal };