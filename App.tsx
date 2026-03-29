import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, SafeAreaView, Dimensions, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Location from 'expo-location';
import { Magnetometer } from 'expo-sensors';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';

const GOOGLE_URL = "https://script.google.com/macros/s/AKfycbzpbZICE4tLFTlwTQxSyVe_2q3H7SW5qHG74MUymTA1-qs_4UNnDCyvPcIxoVsK9prGUg/exec";
const { width } = Dimensions.get('window');

export default function App() {
  const [sessionId, setSessionId] = useState('');
  const [myId, setMyId] = useState('');
  const [inputCode, setInputCode] = useState('');
  const [myLoc, setMyLoc] = useState(null);
  const [friendLoc, setFriendLoc] = useState(null);
  const [heading, setHeading] = useState(0);
  const [distance, setDistance] = useState('--');

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      Location.watchPositionAsync({ accuracy: Location.Accuracy.High, distanceInterval: 1 }, (loc) => {
        setMyLoc({ lat: loc.coords.latitude, lon: loc.coords.longitude });
      });

      Magnetometer.addListener((data) => {
        let angle = Math.atan2(data.y, data.x) * (180 / Math.PI);
        if (angle < 0) angle = angle + 360;
        setHeading(Math.round(angle));
      });
      Magnetometer.setUpdateInterval(100);
    })();
  }, []);

  useEffect(() => {
    const timer = setInterval(sync, 4000);
    return () => clearInterval(timer);
  }, [sessionId, myLoc]);

  const sync = async () => {
    if (!sessionId || !myLoc) return;
    try {
      const url = `${GOOGLE_URL}?sala=${sessionId}&userId=${myId}&lat=${myLoc.lat}&lon=${myLoc.lon}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.friend_data) {
        setFriendLoc(data.friend_data);
        calculateMetrics(data.friend_data);
      }
    } catch (e) {}
  };

  const calculateMetrics = (fLoc) => {
    if (!myLoc || !fLoc) return;
    const R = 6371;
    const dLat = (fLoc.lat - myLoc.lat) * Math.PI / 180;
    const dLon = (fLoc.lon - myLoc.lon) * Math.PI / 180;
    const a = Math.sin(dLat/2)**2 + Math.cos(myLoc.lat*Math.PI/180)*Math.cos(fLoc.lat*Math.PI/180)*Math.sin(dLon/2)**2;
    const d = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    setDistance(d < 1 ? (d * 1000).toFixed(0) + 'm' : d.toFixed(2) + 'km');
  };

  const animatedStyle = useAnimatedStyle(() => {
    // Cálculo simplificado de bearing para la flecha
    return { transform: [{ rotate: withSpring('0deg') }] }; 
  });

  if (!sessionId) {
    return (
      <View style={styles.setup}>
        <Text style={styles.title}>PARTY POINTER</Text>
        <TouchableOpacity style={styles.btn} onPress={() => { setSessionId(Math.floor(1000+Math.random()*9000).toString()); setMyId('u1'); }}>
          <Text style={styles.btnText}>CREAR SALA</Text>
        </TouchableOpacity>
        <TextInput style={styles.input} placeholder="CÓDIGO" placeholderTextColor="#444" keyboardType="numeric" onChangeText={setInputCode} />
        <TouchableOpacity style={[styles.btn, {backgroundColor:'#222'}]} onPress={() => { setSessionId(inputCode); setMyId('u2'); }}>
          <Text style={styles.btnText}>UNIRSE</Text>
        </TouchableOpacity>
        <StatusBar style="light" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.app}>
      <Text style={styles.roomText}>SALA: {sessionId}</Text>
      <View style={styles.radar}>
        <Animated.View style={[styles.arrow, animatedStyle]} />
      </View>
      <Text style={styles.distText}>{distance}</Text>
      <TouchableOpacity style={styles.abort} onPress={() => setSessionId('')}>
        <Text style={{color:'#f44', fontWeight:'900'}}>ABORTAR</Text>
      </TouchableOpacity>
      <StatusBar style="light" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  setup: { flex: 1, backgroundColor: '#050010', alignItems: 'center', justifyContent: 'center', padding: 20 },
  app: { flex: 1, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 32, fontWeight: '900', color: '#fff', marginBottom: 50 },
  btn: { backgroundColor: '#7000ff', padding: 20, borderRadius: 20, width: '100%', alignItems: 'center', marginVertical: 10 },
  btnText: { color: '#fff', fontWeight: '900' },
  input: { width: '100%', padding: 20, backgroundColor: '#111', borderRadius: 20, color: '#fff', textAlign: 'center', fontSize: 24, marginVertical: 20 },
  radar: { width: width*0.8, height: width*0.8, borderRadius: width*0.4, borderWidth: 2, borderColor: '#7000ff22', alignItems: 'center', justifyContent: 'center' },
  arrow: { width: 0, height: 0, borderLeftWidth: 15, borderLeftColor: 'transparent', borderRightWidth: 15, borderRightColor: 'transparent', borderBottomWidth: 50, borderBottomColor: '#00d2ff' },
  distText: { fontSize: 60, fontWeight: '900', color: '#fff', marginTop: 30 },
  roomText: { position: 'absolute', top: 60, color: '#444', fontWeight: '900' },
  abort: { marginTop: 50 }
});
