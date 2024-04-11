/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect } from 'react';
import {PaperProvider} from 'react-native-paper';
import NewLoginPage from './components/NewLoginPage';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
// import LoginPage from './components/LoginPage';
import LoggedInPage from './components/LoggedInPage';
import RegistrationPage from './components/RegistrationPage';
import { ToastProvider } from 'react-native-toast-notifications';
import UsersPage from './components/UsersPage';
import UserUpsert from './components/UserUpsert';
import socketService from './utils/socketService';
import VideoUpload from './components/VideoUpload';
import AudioStream from './components/AudioStream';

export type RootStackParamList = {
  Users: undefined;
  UserUpsert: { user:
                    { userId: string,
                      name: string,
                      email: string,
                      password: string,                     
                    } };
  Register: undefined;
  Welcome: undefined;
  Login: undefined;
  VideoScreen: undefined;
  ImageUpload: undefined;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();


export const AppContext = React.createContext({
  isSignedIn: false,
  setIsSignedIn: (value: boolean) => {}, 
});


function App(): React.JSX.Element {

  const [isSignedIn, setIsSignedIn] = React.useState(false)

  const appContextValue = React.useMemo(
    () => ({
      isSignedIn,
      setIsSignedIn,
    }),
    [isSignedIn]
  )

  // useEffect(() => {
  //   const socket = io('http://localhost:5000'); // Replace with your server address
    
  //   socket.on('connect', () => {
  //     console.log('Connected to server');
  //   });

  //   socket.on('message', (data) => {
  //     console.log('Received message:', data);
  //   });

  //   return () => {
  //     socket.disconnect();
  //   };
  // }, []);

  useEffect(()=>{
    socketService.initializeSocket();
  },[])

  return (
    <AppContext.Provider value={appContextValue}>
    <PaperProvider>
      <ToastProvider placement='top'>
      <NavigationContainer>
        <RootStack.Navigator screenOptions={{headerShown: false}}>
          {isSignedIn?(
            <>
           <RootStack.Screen name="Users" component={UsersPage}/>
           <RootStack.Screen name="UserUpsert" component={UserUpsert}/>
           <RootStack.Screen name="Welcome" component={LoggedInPage} />
           </>
          ):(
            <>
                 <RootStack.Screen name="ImageUpload" component={AudioStream}/> 
            <RootStack.Screen name="VideoScreen" component={VideoUpload}/>
          <RootStack.Screen name="Login" component={NewLoginPage} />
          <RootStack.Screen name="Register" component={RegistrationPage} />
          </>
          )}
        
        
          
        </RootStack.Navigator>
        {/* <NewLoginPage /> */}
        {/* <LoggedInPage /> */}
      </NavigationContainer>
      </ToastProvider>
    </PaperProvider>
    </AppContext.Provider>
  );
}

export default App;
