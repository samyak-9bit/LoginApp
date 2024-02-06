/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';

import {View} from 'react-native';
import {PaperProvider} from 'react-native-paper';
import NewLoginPage from './components/NewLoginPage';

function App(): React.JSX.Element {
  return (
    <PaperProvider>
      <View>
        <NewLoginPage />
      </View>
    </PaperProvider>
  );
}

export default App;
