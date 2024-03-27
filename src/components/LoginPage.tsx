
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {
  emailPlaceholder,
  forgotPasswordLink,
  mainHeading,
  passwordPlaceholder,
  rememberMeCheck,
  signInBtn,
  signInWithGoogleBtn,
  signUpLink,
  signUpText,
  subHeading,
} from '../constants';
import {TextInput, DefaultTheme, Checkbox} from 'react-native-paper';


function LoginPage(): React.JSX.Element {
  const [inputFields, setInputFields] = React.useState({
    email: '',
    password: '',
  });
  const [rememberMe, setRememberMe] = React.useState(false);

  const handleEmailChange = (text: string) => {
    setInputFields(prevInputFields => ({
      ...prevInputFields,
      email: text,
    }));
  };

  const handlePasswordChange = (text: string) => {
    setInputFields(prevInputFields => ({
      ...prevInputFields,
      password: text,
    }));
  };

  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      placeholder: '#636364', // Custom color for the placeholder text
    },
  };
  return (
    <View style={styles.container}>
      <Text style={styles.mainHeading}>{mainHeading}</Text>
      <Text style={styles.subHeading}>{subHeading}</Text>
      <TextInput
        mode="outlined"
        label="Email"
        autoCapitalize="none"
        placeholder={emailPlaceholder}
        value={inputFields.email}
        onChangeText={handleEmailChange}
        style={styles.inputEmailBox}
        placeholderTextColor={theme.colors.placeholder}
      />
      <TextInput
        mode="outlined"
        label="Password"
        secureTextEntry={true}
        placeholder={passwordPlaceholder}
        value={inputFields.password}
        onChangeText={handlePasswordChange}
        style={styles.inputPasswordBox}
        placeholderTextColor={theme.colors.placeholder}
      />

      {/* <TextInput
        autoCapitalize="none"
        placeholder={emailPlaceholder}
        value={inputFields.email}
        onChangeText={handleEmailChange}
        style={styles.inputEmailBox}
        placeholderTextColor={theme.colors.placeholder}
      /> */}
      <View style={styles.checkboxContainer}>
        <View style={styles.checkboxSubContainer}>
          <Checkbox
            status={rememberMe ? 'checked' : 'unchecked'}
            onPress={() => setRememberMe(!rememberMe)}
          />
          <Text style={styles.checkboxText}>{rememberMeCheck}</Text>
        </View>
        <Text style={styles.checkboxText}>{forgotPasswordLink}</Text>
      </View>

      <TouchableOpacity style={styles.signInButton}>
      <Text style={styles.signInButtonText}>{signInBtn}</Text>
    </TouchableOpacity>


    <TouchableOpacity style={styles.signInGoogleButton}>
        <Text style={styles.signInGoogleButtonText}>{signInWithGoogleBtn}</Text>
    </TouchableOpacity>

    <View style={styles.signUpLink}>
        <Text style={styles.signUp}>{signUpText} </Text><Text style={styles.signLink}>{signUpLink}</Text>
    </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
   marginTop:100,
    marginHorizontal: 18,
  },
  mainHeading: {
    color: '#030303',
    textAlign: 'center',
    fontFamily: 'Poppins',
    fontSize: 34,
    fontStyle: 'normal',
    fontWeight: '600',
    // lineHeight: 'normal',
    letterSpacing: 1.02,
    textTransform: 'uppercase',
    paddingLeft: 2,
  },
  subHeading: {
    color: '#636364',
    textAlign: 'center',
    fontFamily: 'Poppins',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '600',
    // lineHeight: 'normal',
    letterSpacing: 0.42,
    paddingLeft: 2,
  },
  inputEmailBox: {
    marginTop: 25,
    marginBottom: 18,
    fontFamily: 'Poppins',
  },
  inputPasswordBox: {
    fontFamily: 'Poppins',
  },
  checkboxContainer: {
    marginVertical:18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  checkboxSubContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signInButton:{
    // width: 196.2294, // equivalent to 19.62294rem in pixels
    height: 42.5116, // equivalent to 2.58194rem in pixels
    borderRadius: 12,
    backgroundColor: 'rgb(34,84,211)',
    shadowColor: 'rgb(93, 127, 214)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    borderWidth: 0, // Setting border to 0 to achieve "border: none"
    color: '#FFF',
    textAlign: 'center',
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    lineHeight: 14, // Adjust as needed
    justifyContent: 'center',
    alignItems: 'center',
  },
  signInButtonText:{
    color: '#FFF',
    fontWeight: '500',
    fontSize:16,
    letterSpacing: 0.02625,
  },
  signInGoogleButton:{
    // width: 196.2294, // equivalent to 19.62294rem in pixels
    height: 42.5116, // equivalent to 2.58194rem in pixels
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.25)',
    backgroundColor: 'rgba(234, 69, 76, 0.00)',
    shadowColor: 'rgba(0, 0, 0, 0.25)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    color: '#000',
    textAlign: 'center',
    fontFamily: 'Poppins',
    // equivalent to 0.875rem in pixels
    fontStyle: 'normal',
    lineHeight: 14, // Adjust as needed
    letterSpacing: 0.02625,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  signInGoogleButtonText:{
    color: '#000',
    fontWeight: '600',
    fontSize: 16,

  },
  signUpLink:{
    marginTop:12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'center',
  },
  signUp:{
    color: '#595959',
    textAlign: 'center',
    fontFamily: 'Poppins',
    fontSize: 14, // equivalent to 0.725rem in pixels
    fontStyle: 'normal',
    fontWeight: '500',
    letterSpacing: 0.01875,
  },
  signLink:{
    color: 'rgb(34, 84, 211)',
    fontFamily: 'Poppins',
    fontSize: 14, // equivalent to 0.725rem in pixels
    fontStyle: 'normal',
    fontWeight: '500',
    letterSpacing: 0.01875,
  },
  checkboxText:{
    color: '#000',
    fontFamily: 'Poppins',
    fontSize: 14, // equivalent to 0.75rem in pixels
    fontStyle: 'normal',
    fontWeight: '600',
    letterSpacing: 0.0225,



  },
});

export default LoginPage;
