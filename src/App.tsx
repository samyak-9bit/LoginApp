/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {PaperProvider} from 'react-native-paper';
import NewLoginPage from './components/NewLoginPage';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
// import LoginPage from './components/LoginPage';
import LoggedInPage from './components/LoggedInPage';
import RegistrationPage from './components/RegistrationPage';
import { ToastProvider } from 'react-native-toast-notifications';

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
  return (
    <PaperProvider>
      <ToastProvider placement='top'>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name="Login" component={NewLoginPage} />
          <Stack.Screen name="Register" component={RegistrationPage} />
          <Stack.Screen name="Welcome" component={LoggedInPage} />
        </Stack.Navigator>
        {/* <NewLoginPage /> */}
        {/* <LoggedInPage /> */}
      </NavigationContainer>
      </ToastProvider>
    </PaperProvider>
  );
}

export default App;
