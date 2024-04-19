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
import AudioStream from './components/Demo/AudioStream';
import WelcomePage from './components/Demo/WelcomePage';
import AudioForm from './components/Demo/AudioForm';
import ImageForm from './components/Demo/ImageForm';
import VideoForm from './components/Demo/VideoForm';
import PdfForm from './components/Demo/PdfForm';
import AudioFromDevice from './components/Demo/AudioFromDevice';
import SelectionPage from './components/Demo/SelectionPage';
import QuestionAnswer from './components/Demo/QuestionAnswer';

export type RootStackParamList = {
  Users: undefined;
  UserUpsert: { user:
                    { userId: string,
                      name: string,
                      email: string,
                      password: string,                     
                    } };
  Register: undefined;
  LoggedIn: undefined;
  Login: undefined;
  VideoForm: undefined;
  AudioStream: undefined;
  AudioForm: undefined;
  Welcome: undefined;
  ImageForm:undefined;
  PdfForm:undefined;
  AudioFromDevice:undefined;
  Select:undefined;
  QuestionAnswer:undefined;
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
           <RootStack.Screen name="LoggedIn" component={LoggedInPage} />
           </>
          ):(
            <>
          <RootStack.Screen name="Welcome" component={WelcomePage}/>
          <RootStack.Screen name="Select" component={SelectionPage}/>
          <RootStack.Screen name="AudioForm" component={AudioForm}/>
          <RootStack.Screen name="PdfForm" component={PdfForm}/>
          <RootStack.Screen name="VideoForm" component={VideoForm}/>
          <RootStack.Screen name="ImageForm" component= {ImageForm}/>
          <RootStack.Screen name="AudioStream" component={AudioStream}/> 
          <RootStack.Screen name="Login" component={NewLoginPage} />
          <RootStack.Screen name="Register" component={RegistrationPage} />
          <RootStack.Screen name="AudioFromDevice" component={AudioFromDevice} />
          <RootStack.Screen name="QuestionAnswer" component={QuestionAnswer} />
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
