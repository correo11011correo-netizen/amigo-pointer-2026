import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { ArrowUp } from 'lucide-react-native';

interface CompassProps {
    rotation: number; // Rotación final calculada
    distance: string;
    status: 'NEAR' | 'FAR' | 'VERY_FAR';
}

export const Compass: React.FC<CompassProps> = ({ rotation, distance, status }) => {
    
    // Animación suave para la rotación de la flecha
    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ rotate: withSpring(`${rotation}deg`) }],
        };
    });

    const getStatusColor = () => {
        if (status === 'NEAR') return '#4ade80'; // Verde
        if (status === 'FAR') return '#facc15';  // Amarillo
        return '#f87171'; // Rojo
    };

    return (
        <View style={styles.container}>
            <View style={[styles.outerCircle, { borderColor: getStatusColor() }]}>
                <Animated.View style={[styles.arrowContainer, animatedStyle]}>
                    <ArrowUp size={80} color={getStatusColor()} strokeWidth={3} />
                </Animated.View>
                
                <View style={styles.centerDot} />
            </View>
            
            <View style={styles.infoBox}>
                <Text style={[styles.distanceText, { color: getStatusColor() }]}>{distance}</Text>
                <Text style={styles.statusLabel}>{status === 'NEAR' ? '¡ESTÁ CERCA!' : 'BUSCANDO...'}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    outerCircle: {
        width: 280,
        height: 280,
        borderRadius: 140,
        borderWidth: 4,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.05)',
    },
    arrowContainer: {
        width: 100,
        height: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },
    centerDot: {
        position: 'absolute',
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#333',
    },
    infoBox: {
        marginTop: 40,
        alignItems: 'center',
    },
    distanceText: {
        fontSize: 48,
        fontWeight: '900',
        fontFamily: 'monospace',
    },
    statusLabel: {
        fontSize: 16,
        color: '#666',
        letterSpacing: 2,
        fontWeight: 'bold',
        marginTop: 5,
    }
});
