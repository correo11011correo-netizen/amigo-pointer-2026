import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useGPS } from './hooks/useGPS';
import { useSync } from './hooks/useSync';
import { Compass } from './components/Compass';
import { getDistance, getBearing, formatDistance } from './utils/geoUtils';

export default function App() {
    const [sessionId, setSessionId] = useState('');
    const [myId, setMyId] = useState<'user1' | 'user2' | null>(null);
    const [inputCode, setInputCode] = useState('');
    
    const { location, heading, errorMsg } = useGPS();
    const { updateMyLocation, friendLocation } = useSync(sessionId, myId || 'user1');

    // Efecto para actualizar mi ubicación en la nube cada vez que cambia
    useEffect(() => {
        if (location && sessionId && myId) {
            updateMyLocation(location.coords.latitude, location.coords.longitude);
        }
    }, [location, sessionId, myId]);

    const createSession = () => {
        const code = Math.floor(1000 + Math.random() * 9000).toString();
        setSessionId(code);
        setMyId('user1');
    };

    const joinSession = () => {
        if (inputCode.length === 4) {
            setSessionId(inputCode);
            setMyId('user2');
        }
    };

    // Cálculo final para la Brújula
    let rotation = 0;
    let distanceStr = "--";
    let status: 'NEAR' | 'FAR' | 'VERY_FAR' = 'VERY_FAR';

    if (location && friendLocation) {
        const { latitude: lat1, longitude: lon1 } = location.coords;
        const { lat: lat2, lon: lon2 } = friendLocation;

        const distKm = getDistance(lat1, lon1, lat2, lon2);
        const bearing = getBearing(lat1, lon1, lat2, lon2);
        
        // La rotación es el Rumbo al amigo MENOS mi orientación actual
        rotation = (bearing - heading + 360) % 360;
        distanceStr = formatDistance(distKm);

        if (distKm < 0.05) status = 'NEAR';
        else if (distKm < 0.5) status = 'FAR';
        else status = 'VERY_FAR';
    }

    if (!sessionId) {
        return (
            <SafeAreaView style={styles.container}>
                <Text style={styles.title}> AMIGO-POINTER</Text>
                <Text style={styles.subtitle}>2026 EDITION</Text>
                
                <TouchableOpacity style={styles.button} onPress={createSession}>
                    <Text style={styles.buttonText}>CREAR SALA</Text>
                </TouchableOpacity>

                <View style={styles.divider} />

                <TextInput 
                    style={styles.input} 
                    placeholder="CÓDIGO DE 4 DÍGITOS" 
                    placeholderTextColor="#666"
                    keyboardType="number-pad"
                    maxLength={4}
                    onChangeText={setInputCode}
                />
                
                <TouchableOpacity style={[styles.button, { backgroundColor: '#333' }]} onPress={joinSession}>
                    <Text style={styles.buttonText}>UNIRSE A AMIGO</Text>
                </TouchableOpacity>
                
                <StatusBar style="auto" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.sessionLabel}>SALA ACTIVA: {sessionId}</Text>
                <Text style={styles.roleLabel}>{myId === 'user1' ? 'LÍDER' : 'SEGUIDOR'}</Text>
            </View>

            <Compass rotation={rotation} distance={distanceStr} status={status} />

            <TouchableOpacity style={styles.exitButton} onPress={() => setSessionId('')}>
                <Text style={styles.exitButtonText}>SALIR</Text>
            </TouchableOpacity>
            
            <StatusBar style="auto" />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: '900',
        letterSpacing: 4,
    },
    subtitle: {
        fontSize: 14,
        color: '#888',
        marginBottom: 60,
        letterSpacing: 2,
    },
    button: {
        backgroundColor: '#000',
        paddingVertical: 20,
        paddingHorizontal: 40,
        borderRadius: 15,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    divider: {
        height: 1,
        backgroundColor: '#eee',
        width: '100%',
        marginVertical: 40,
    },
    input: {
        width: '100%',
        height: 60,
        borderWidth: 2,
        borderColor: '#eee',
        borderRadius: 15,
        textAlign: 'center',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    header: {
        position: 'absolute',
        top: 60,
        alignItems: 'center',
    },
    sessionLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
    },
    roleLabel: {
        fontSize: 12,
        color: '#888',
        marginTop: 5,
        letterSpacing: 2,
    },
    exitButton: {
        marginTop: 60,
        padding: 10,
    },
    exitButtonText: {
        color: '#ff4444',
        fontWeight: 'bold',
        fontSize: 14,
    }
});
