/**
 *  AMIGO-POINTER 2026 | GeoUtils
 * Cálculos matemáticos para navegación GPS y brújula.
 */

// Fórmula de Haversine para calcular la distancia en kilómetros
export const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radio de la Tierra en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distancia en km
};

// Cálculo del Rumbo (Bearing) entre dos puntos
export const getBearing = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const l1 = lat1 * Math.PI / 180;
    const l2 = lat2 * Math.PI / 180;
    const dl = (lon2 - lon1) * Math.PI / 180;

    const y = Math.sin(dl) * Math.cos(l2);
    const x = Math.cos(l1) * Math.sin(l2) -
              Math.sin(l1) * Math.cos(l2) * Math.cos(dl);
    
    let brng = Math.atan2(y, x);
    brng = brng * 180 / Math.PI;
    return (brng + 360) % 360; // Rumbo en grados (0-360)
};

// Formatear distancia para que sea legible
export const formatDistance = (km: number): string => {
    if (km < 1) return `${(km * 1000).toFixed(0)}m`;
    return `${km.toFixed(2)}km`;
};
