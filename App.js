import React, { useEffect } from 'react';
import * as Updates from 'expo-updates';
import MainApp from './src/MainApp';

export default function App() {
  
  useEffect(() => {
    async function onFetchUpdateAsync() {
      try {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          await Updates.reloadAsync();
        }
      } catch (error) {
        console.log(`Update Error: ${error}`);
      }
    }
    if (!__DEV__) { onFetchUpdateAsync(); }
  }, []);

  return (
    <MainApp />
  );
}
