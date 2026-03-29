import { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, set, update } from 'firebase/database';

// ⚠️ NOTA: El usuario debe reemplazar estos valores con su config real de Firebase Console.
const firebaseConfig = {
  apiKey: "REEMPLAZAR_POR_API_KEY",
  authDomain: "amigo-pointer.firebaseapp.com",
  databaseURL: "https://amigo-pointer-default-rtdb.firebaseio.com",
  projectId: "amigo-pointer",
  storageBucket: "amigo-pointer.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export const useSync = (sessionId: string, myId: string) => {
    const [friendLocation, setFriendLocation] = useState<{lat: number, lon: number} | null>(null);

    // Actualizar mi posición en Firebase
    const updateMyLocation = async (lat: number, lon: number) => {
        if (!sessionId) return;
        const myRef = ref(db, `sessions/${sessionId}/${myId}`);
        await set(myRef, { lat, lon, timestamp: Date.now() });
    };

    // Escuchar la posición del amigo
    useEffect(() => {
        if (!sessionId) return;
        const friendId = myId === 'user1' ? 'user2' : 'user1';
        const friendRef = ref(db, `sessions/${sessionId}/${friendId}`);

        const unsubscribe = onValue(friendRef, (snapshot) => {
            const data = snapshot.val();
            if (data) setFriendLocation({ lat: data.lat, lon: data.lon });
        });

        return () => unsubscribe();
    }, [sessionId]);

    return { updateMyLocation, friendLocation };
};
