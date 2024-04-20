
import React from 'react';
import { ActivityIndicator, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Checkbox, Icon } from 'react-native-paper';
import { defaultErrorMessage, doubleRegisterMessage, emailLabel, emptyFieldMessage, error404Message, existingUserBtn, firstName, invalidEmailMessage, passwordLabel, passwordMismatchMessage, reEnterPasswordLabel, registerBtn, registerSuccessMessage, register_Heading, superUserLabel, weakPasswordMessage } from '../constants';
import { NavigationProp } from '@react-navigation/native';
import { isStrongPassword, isValidEmail } from './common Functions/validation';
import { showToast } from './common Functions/ShowErrorToast';

function RegistrationPage({ navigation }: { navigation: NavigationProp<any> }): React.JSX.Element {
  const [inputFields, setInputFields] = React.useState({
    name: '',
    email: '',
    password: '',
    isSuperUser: false,
  });

  const [reEnterPassword, setReEnterPassword] = React.useState('');
  const [loading, setLoading]  = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  //Function to toggle show and hide password
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  //Handle input change
  const handleChange = (name: string, value: string) => {
    setInputFields({
      ...inputFields,
      [name]: value,
    });
  };

  //Handle re-Enter password input
  const handleReEnterPasswordChange = (text: string) => {
    setReEnterPassword(text);
  };


  //Functiopn to handle super user checkbox
  const handleSuperUserChange = () => {
    setInputFields({
      ...inputFields,
      isSuperUser: !inputFields.isSuperUser,
    });
  };


//Function to handle registration
  const handleRegisterPress = async() => {
    if (
        inputFields.name.trim() === '' ||
        inputFields.email.trim() === '' ||
        inputFields.password.trim() === '' ||
        reEnterPassword.trim() === ''
    ) {
        showToast(emptyFieldMessage,'warning');
        return;
    } else if (!isValidEmail(inputFields.email)) {
        showToast(invalidEmailMessage,'warning');
        return;
    } else if (!isStrongPassword(inputFields.password)) {
        showToast(weakPasswordMessage,'warning');
        return;
    } else if (inputFields.password !== reEnterPassword) {
        showToast(passwordMismatchMessage,'warning');
        return;
    } else {
        setLoading(true);
        try {
          const response = await fetch('http://192.168.1.22:9001/askdb/entity/users', {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: inputFields.name,
              email: inputFields.email,
              password: inputFields.password,
              isSuperUser: inputFields.isSuperUser,
            }),
          });
        
          const responseData = await response.json(); 
        
          switch (response.status) {
            case 200:
            case 201:
              showToast(registerSuccessMessage);
              setInputFields({
                name: '',
                email: '',
                password: '',
                isSuperUser: false,
              });
              setReEnterPassword('');
              break;
            case 403:
              if (responseData.errorCode === 11000) {
                showToast(doubleRegisterMessage,'warning');
              }
              break;
            case 409:
              showToast(doubleRegisterMessage,'warning');
              break;
            case 404:
              showToast(error404Message,'warning');
              break;
            default:
              showToast(defaultErrorMessage,'warning');
          }
        } catch (error) {
          console.error('Error during registering:', error);
          showToast(defaultErrorMessage,'warning');
        } finally {
          setLoading(false);
        }
        }
};
//Function to handle login press
  const handleLoginPress = ()=>{
    navigation.navigate('Login');
    setInputFields({
      name: '',
      email: '',
      password: '',
      isSuperUser: false,
    });
  };
  return (
    <View style={styles.container}>
      <View style={styles.upperPart}>
        {/* <Text style={styles.mainHeading}>{main_Heading}</Text>
        <Text style={styles.subHeading}>{sub_Heading}</Text> */}
      </View>
      <View style={styles.lowerPart}>
      <Text style={[styles.formHeading,loading?styles.formHeadingWhenSpinner:null]}>{register_Heading}</Text>
      {loading && <ActivityIndicator size="large" color='rgb(34,84,211)'/>}
      <Text style={styles.inputLabel}>{firstName}</Text>
        <TextInput
          style={styles.input}
        //   placeholder="First Name"
          value={inputFields.name}
          onChangeText={(text) => handleChange('name', text)}
        />

        {/* <Text style={styles.inputLabel}>{lastName}</Text>
        <TextInput
          style={styles.input}
        //   placeholder="Last Name"
          value={inputFields.lastname}
          onChangeText={(text) => handleChange('lastname', text)}
        /> */}

        <Text style={styles.inputLabel}>{emailLabel}</Text>
        <TextInput
          style={styles.input}
        //   placeholder="Email"
          value={inputFields.email}
          onChangeText={(text) => handleChange('email', text)}
        />
        <Text style={styles.inputLabel}>{passwordLabel}</Text>
        {/* <TextInput
          style={styles.input}
        //   placeholder="Password"
          secureTextEntry
          value={inputFields.password}
          onChangeText={(text) => handleChange('password', text)}
        /> */}

<View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            value={inputFields.password}
            onChangeText={(text) => handleChange('password', text)}
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
        <Text style={styles.inputLabel}>{reEnterPasswordLabel}</Text>
        <TextInput
          style={styles.input}
        //   placeholder="Re-enter Password"
          secureTextEntry
          value={reEnterPassword}
          onChangeText={handleReEnterPasswordChange}
        />

        <View style={styles.checkboxContainer}>
          <Checkbox
            status={inputFields.isSuperUser ? 'checked' : 'unchecked'}
            onPress={handleSuperUserChange}
            color="rgb(34,84,211)"
          />
           <Text style={styles.checkBoxLabel}>{superUserLabel}</Text>
        </View>

        <TouchableOpacity style={[styles.btn, loading?styles.disabledBtn:null]} onPress={handleRegisterPress} disabled={loading}>
        <Text style={[styles.btnText,loading?styles.disabledBtnText:null]}>{registerBtn}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.registerBtn,loading?styles.disabledRegisterBtn:null]} onPress={handleLoginPress} disabled={loading}>
          <Text style={[styles.newUserbtnText,loading?styles.disabledRegisterBtnText:null]}>{existingUserBtn}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: 'rgb(34,84,211)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 35,
//   },
//   middlePart: {
//     width: '100%',
//     backgroundColor: 'rgb(255,255,255)',
//     padding: 20,
//     borderRadius: 35,
//   },
//   input: {
//     height: 40,
//     borderColor: 'gray',
//     borderWidth: 1,
//     marginBottom: 10,
//     paddingHorizontal: 10,
//     borderRadius: 8,
//   },
//   checkboxContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   btn: {
//     height: 40,
//     backgroundColor: 'rgb(34,84,211)',
//     justifyContent: 'center',
//     marginHorizontal: 50,
//     borderWidth: 0,
//     borderRadius: 10,
//   },
  container: {
    height: '100%',
    backgroundColor: 'rgb(34,84,211)',
  },
  upperPart: {
    height: '10%',
    justifyContent: 'center',
  },
  lowerPart: {
    height: '90%',
    backgroundColor: 'rgb(255,255,255)',
    borderWidth: 0,
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    paddingHorizontal: Platform.OS === 'web' ? 200:0,
  },
//   mainHeading: {
//     textAlign: 'center',
//     color: 'rgb(255,255,255)',
//     fontSize: 40,
//     fontWeight: '300',
//   },
//   subHeading: {
//     textAlign: 'center',
//     color: 'rgb(255,255,255)',
//     fontSize: 18,
//   },
  formHeading: {
    textAlign: 'center',
    color: 'rgb(0,0,0)',
    fontSize: 40,
    marginTop: 16,
    marginBottom: 22,
  },
  formHeadingWhenSpinner:{
    marginBottom: 0,
  },
  inputLabel: {
    marginLeft: 25,
    color: 'rgb(0,0,0)',
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '400',
  },
//   forgotPasswordText: {
//     marginRight: 25,
//     textAlign: 'right',
//     fontSize: 15,
//     marginBottom: 40,
//   },
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
//   passwordContainer: {
//     height: 45,
//     backgroundColor: 'rgb(244,244,244)',
//     paddingHorizontal: 15,
//     borderWidth: 0,
//     borderRadius: 8,
//     marginHorizontal: 25,
//     marginBottom: 14,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   passwordInput:{
//     flex: 1,
//     color: '#333',
//     paddingVertical: 10,
//     paddingRight: 10,
//     fontSize: 16,
//   },
//   icon:{
//     marginLeft: 10,
//   },
  checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft:18,
        marginBottom:25,
    },
  checkBoxLabel:{
    color: 'rgb(0,0,0)',
    fontSize: 15,
    fontWeight: '400',
    marginBottom: 3,
    marginRight: 5,
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
  disabledBtn: {
    backgroundColor: 'rgba(34,84,211,0.5)', 
  },
  disabledBtnText: {
    color: 'rgba(255,255,255,0.7)', 
  },
  disabledRegisterBtn: {
    backgroundColor: 'rgba(255,255,255,0.5)', 
    borderColor: 'rgba(0,0,0,0.2)',
  },
  disabledRegisterBtnText: {
    color: 'rgba(0,0,0,0.5)',
  },
});

export default RegistrationPage;
