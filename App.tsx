/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {View} from 'react-native';
// import {PaperProvider} from 'react-native-paper';
// import NewLoginPage from './components/NewLoginPage';
// import {NavigationContainer} from '@react-navigation/native';
// import {createNativeStackNavigator} from '@react-navigation/native-stack';
// import LoginPage from './components/LoginPage';
import Toast from 'react-native-toast-message';
import NewLoginPage from './components/NewLoginPage';

// const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
  return (
    <View>
      {/* // <NavigationContainer>
    //   <PaperProvider>
    //     <Stack.Navigator>
    //       <Stack.Screen name="Login" component={NewLoginPage} />
    //       <Stack.Screen name="OldLogin" component={LoginPage} />
    //     </Stack.Navigator> */}
      <NewLoginPage />
      <Toast visibilityTime={3000} />
      {/* //   </PaperProvider>
    // </NavigationContainer> */}
    </View>
  );
}

export default App;
