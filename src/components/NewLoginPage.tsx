
import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {
  defaultErrorMessage,
  emailLabel,
  emptyFieldMessage,
  error401Message,
  error404Message,
  forgot_Password_Link,
  form_Heading,
  invalidEmailMessage,
  loginBtn,
  loginSuccessMessage,
  main_Heading,
  newUser,
  passwordLabel,
  sub_Heading,
} from '../constants';
import { Icon } from 'react-native-paper';
import { NavigationProp } from '@react-navigation/native';
import { isValidEmail } from './common Functions/validation';
import { showToast } from './common Functions/ShowErrorToast';


function NewLoginPage({ navigation }: { navigation: NavigationProp<any> }): React.JSX.Element {
  const [inputFields, setInputFields] = React.useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = React.useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

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

  const handleLoginPress = async() => {
    // Check if email and password are not empty and email is in correct format
    if (inputFields.email.trim() === '' || inputFields.password.trim() === '') {
      showToast(emptyFieldMessage);
      return;
    } else if (!isValidEmail(inputFields.email)) {
      showToast(invalidEmailMessage);
      return;
    } else {
      try {
        const response = await fetch('http://192.168.1.22:9001/login', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: inputFields.email,
        password: inputFields.password,
      }),
    });

        switch (response.status) {
          case 200:
            showToast(loginSuccessMessage);
            // navigate('/table');
            return;
          case 401:
            showToast(error401Message);
           return;
          case 404:
            showToast(error404Message);
           return;
          default:
            showToast(defaultErrorMessage);
        }
      } catch (error) {
        console.error('Error during login:', error);
      }
      showToast(defaultErrorMessage);
    }
  };

  const handleRgisterPress = ()=>{
    navigation.navigate('Register');
  };
  return (
    <View style={styles.container}>
      <View style={styles.upperPart}>
        <Text style={styles.mainHeading}>{main_Heading}</Text>
        <Text style={styles.subHeading}>{sub_Heading}</Text>
      </View>
      <View style={styles.lowerPart}>
        <Text style={styles.formHeading}>{form_Heading}</Text>
        <Text style={styles.inputLabel}>{emailLabel}</Text>
        <TextInput
          style={styles.input}
          value={inputFields.email}
          onChangeText={handleEmailChange}
        />
        <Text style={styles.inputLabel}>{passwordLabel}</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            value={inputFields.password}
            onChangeText={handlePasswordChange}
            secureTextEntry={!showPassword}
          />
        <TouchableOpacity onPress={toggleShowPassword} style={styles.icon}>
  <Icon
    size={23}
    source={showPassword ? 'eye-off' : 'eye'}
    color="rgb(65,65,65)"
  />
</TouchableOpacity >
        </View>
        <Text style={styles.forgotPasswordText}>{forgot_Password_Link}</Text>
        <TouchableOpacity style={styles.btn} onPress={handleLoginPress}>
          <Text style={styles.btnText}>{loginBtn}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.registerBtn} onPress={handleRgisterPress}>
          <Text style={styles.newUserbtnText}>{newUser}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: 'rgb(34,84,211)',
  },
  upperPart: {
    height: '35%',
    justifyContent: 'center',
  },
  lowerPart: {
    height: '65%',
    backgroundColor: 'rgb(255,255,255)',
    borderWidth: 0,
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
  },
  mainHeading: {
    textAlign: 'center',
    color: 'rgb(255,255,255)',
    fontSize: 40,
    fontWeight: '300',
  },
  subHeading: {
    textAlign: 'center',
    color: 'rgb(255,255,255)',
    fontSize: 18,
  },
  formHeading: {
    textAlign: 'center',
    color: 'rgb(0,0,0)',
    fontSize: 40,
    marginTop: 18,
    marginBottom: 35,
  },
  inputLabel: {
    marginLeft: 25,
    color: 'rgb(0,0,0)',
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '400',
  },
  forgotPasswordText: {
    marginRight: 25,
    textAlign: 'right',
    fontSize: 15,
    marginBottom: 40,
  },
  btn: {
    height: 40,
    backgroundColor: 'rgb(34,84,211)',
    justifyContent: 'center',
    marginHorizontal: 50,
    borderWidth: 0,
    borderRadius: 10,
  },
  input: {
    height: 45,
    backgroundColor: 'rgb(244,244,244)',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 0,
    borderRadius: 8,
    fontSize: 16,
    marginHorizontal: 25,
    marginBottom: 14,
  },
  btnText: {
    textAlign: 'center',
    color: 'rgb(255,255,255)',
    fontSize: 20,
    fontWeight: '400',
  },
  passwordContainer: {
    height: 45,
    backgroundColor: 'rgb(244,244,244)',
    paddingHorizontal: 15,
    borderWidth: 0,
    borderRadius: 8,
    marginHorizontal: 25,
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  passwordInput:{
    flex: 1,
    color: '#333',
    paddingVertical: 10,
    paddingRight: 10,
    fontSize: 16,
  },
  icon:{
    marginLeft: 10,
  },
  registerBtn:{
    height: 40,
    backgroundColor: 'rgb(255,255,255)',
    justifyContent: 'center',
    marginHorizontal: 50,
    borderWidth: 1,
    borderRadius: 10,
    marginVertical:10,
  },
  newUserbtnText:{
    textAlign: 'center',
    color: 'rgb(0,0,0)',
    fontSize: 16,
    fontWeight: '400',
  },
});
export default NewLoginPage;
