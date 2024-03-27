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
import Toast from 'react-native-toast-message';
import LoggedInPage from './components/LoggedInPage';
import RegistrationPage from './components/RegistrationPage';

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name="Login" component={NewLoginPage} />
          <Stack.Screen name="Register" component={RegistrationPage} />
          <Stack.Screen name="Welcome" component={LoggedInPage} />
        </Stack.Navigator>
        {/* <NewLoginPage /> */}
        {/* <LoggedInPage /> */}

        <Toast visibilityTime={3000} />
      </NavigationContainer>
    </PaperProvider>
  );
}

export default App;
