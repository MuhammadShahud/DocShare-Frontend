import React from 'react';
import { SafeAreaView } from 'react-native';
import { Provider } from 'react-redux';
import AppNavigation from './src/Navigation';
import { store } from './src/Store/store';
import { Settings } from 'react-native-fbsdk-next';
Settings.initializeSDK();

const App = () => {

  return (
    <Provider store={store}>
      <AppNavigation />
    </Provider>

  );
};

export default App;
