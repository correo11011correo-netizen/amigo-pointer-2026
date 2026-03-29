import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, SafeAreaView, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Location from 'expo-location';
import { Magnetometer } from 'expo-sensors';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';

const GOOGLE_URL = "https://script.google.com/macros/s/AKfycbzpbZICE4tLFTlwTQxSyVe_2q3H7SW5qHG74MUymTA1-qs_4UNnDCyvPcIxoVsK9prGUg/exec";
const { width } = Dimensions.get('window');

export default function MainApp() {
  const [sessionId, setSessionId] = useState('');
  const [myId, setMyId] = useState('');
  const [inputCode, setInputCode] = useState('');
  const [myLoc, setMyLoc] = useState(null);
  const [friendLoc, setFriendLoc] = useState(null);
  const [filteredHeading, setFilteredHeading] = useState(0);
  const [distance, setDistance] = useState('--');
  const [accuracy, setAccuracy] = useState(0);

  const EMA_ALPHA = 0.2;

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      
      Location.watchPositionAsync({ 
        accuracy: Location.Accuracy.High, 
        distanceInterval: 1 
      }, (loc) => {
        setMyLoc({ lat: loc.coords.latitude, lon: loc.coords.longitude });
        setAccuracy(loc.coords.accuracy || 0);
      });

      Magnetometer.addListener((data) => {
        let heading = Math.atan2(data.y, data.x) * (180 / Math.PI);
        if (heading < 0) heading += 360;
        
        setFilteredHeading(prev => {
          let diff = heading - prev;
          if (diff > 180) diff -= 360;
          if (diff < -180) diff += 360;
          return (prev + EMA_ALPHA * diff + 360) % 360;
        });
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
      }
    } catch (e) {}
  };

  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  };

  const getBearing = (lat1, lon1, lat2, lon2) => {
    const l1 = lat1 * Math.PI / 180, l2 = lat2 * Math.PI / 180, dl = (lon2 - lon1) * Math.PI / 180;
    const y = Math.sin(dl) * Math.cos(l2), x = Math.cos(l1) * Math.sin(l2) - Math.sin(l1) * Math.cos(l2) * Math.cos(dl);
    return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
  };

  const angle = (myLoc && friendLoc) ? (getBearing(myLoc.lat, myLoc.lon, friendLoc.lat, friendLoc.lon) - filteredHeading + 360) % 360 : 0;
  const distKm = (myLoc && friendLoc) ? getDistance(myLoc.lat, myLoc.lon, friendLoc.lat, friendLoc.lon) : 0;

  const animatedStyle = useAnimatedStyle(() => {
    return { transform: [{ rotate: `${angle}deg` }] }; 
  });

  if (!sessionId) {
    return (
      <View style={styles.setup}>
        <Text style={styles.title}>PARTY POINTER</Text>
        <TouchableOpacity style={styles.btn} onPress={() => { setSessionId(Math.floor(1000+Math.random()*9000).toString()); setMyId('u1'); }}>
          <Text style={styles.btnText}>NEW SESSION</Text>
        </TouchableOpacity>
        <TextInput style={styles.input} placeholder="0000" placeholderTextColor="#444" keyboardType="numeric" onChangeText={setInputCode} />
        <TouchableOpacity style={[styles.btn, {backgroundColor:'#111', borderWidth:1, borderColor:'#333'}]} onPress={() => { setSessionId(inputCode); setMyId('u2'); }}>
          <Text style={styles.btnText}>JOIN CONNECTION</Text>
        </TouchableOpacity>
        <StatusBar style="light" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.app}>
      <Text style={styles.accText}>ACCURACY: {accuracy.toFixed(0)}m</Text>
      <Text style={styles.roomText}>NET_ID: {sessionId}</Text>
      <View style={styles.radar}>
        <Animated.View style={[styles.arrow, animatedStyle]} />
      </View>
      <Text style={styles.distText}>{distKm < 1 ? (distKm * 1000).toFixed(0) : distKm.toFixed(2)}</Text>
      <Text style={styles.unitText}>{distKm < 1 ? 'METERS' : 'KILOMETERS'}</Text>
      <TouchableOpacity style={styles.abort} onPress={() => setSessionId('')}>
        <Text style={{color:'#f44', fontWeight:'900', letterSpacing:2}}>ABORT SESSION</Text>
      </TouchableOpacity>
      <StatusBar style="light" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  setup: { flex: 1, backgroundColor: '#050010', alignItems: 'center', justifyContent: 'center', padding: 20 },
  app: { flex: 1, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 32, fontWeight: '900', color: '#fff', marginBottom: 50, letterSpacing:-1 },
  btn: { backgroundColor: '#7000ff', padding: 20, borderRadius: 20, width: '100%', alignItems: 'center', marginVertical: 10 },
  btnText: { color: '#fff', fontWeight: '900', letterSpacing:1 },
  input: { width: '100%', padding: 20, backgroundColor: '#000', borderWidth:2, borderColor:'#111', borderRadius: 20, color: '#fff', textAlign: 'center', fontSize: 32, fontWeight:'900', marginVertical: 20 },
  radar: { width: width*0.8, height: width*0.8, borderRadius: width*0.4, borderWidth: 2, borderColor: '#7000ff11', alignItems: 'center', justifyContent: 'center', backgroundColor:'#050010' },
  arrow: { width: 0, height: 0, borderLeftWidth: 18, borderLeftColor: 'transparent', borderRightWidth: 18, borderRightColor: 'transparent', borderBottomWidth: 60, borderBottomColor: '#00d2ff', shadowColor:'#00d2ff', shadowRadius:15, shadowOpacity:0.8 },
  distText: { fontSize: 80, fontWeight: '900', color: '#fff', marginTop: 30, letterSpacing:-4 },
  unitText: { color: '#00d2ff', fontWeight: '800', letterSpacing:5, fontSize:12 },
  roomText: { position: 'absolute', top: 60, left: 20, color: '#222', fontWeight: '900', fontSize:12 },
  accText: { position: 'absolute', top: 60, right: 20, color: '#444', fontWeight: '900', fontSize:10 },
  abort: { marginTop: 60, padding:10 }
});
