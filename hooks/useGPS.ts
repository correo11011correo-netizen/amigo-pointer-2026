import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { Magnetometer } from 'expo-sensors';

export const useGPS = () => {
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [heading, setHeading] = useState(0); // Orientación del teléfono (0-360)
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            // Solicitar permisos de ubicación
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permiso de ubicación denegado.');
                return;
            }

            // Suscribirse a cambios de ubicación en tiempo real
            await Location.watchPositionAsync(
                { accuracy: Location.Accuracy.High, distanceInterval: 1 },
                (loc) => setLocation(loc)
            );

            // Suscribirse al Magnetómetro (Brújula)
            Magnetometer.addListener((data) => {
                let angle = Math.atan2(data.y, data.x) * (180 / Math.PI);
                if (angle < 0) angle = angle + 360;
                setHeading(Math.round(angle));
            });

            Magnetometer.setUpdateInterval(100); // Actualizar cada 100ms
        })();

        return () => {
            Magnetometer.removeAllListeners();
        };
    }, []);

    return { location, heading, errorMsg };
};
