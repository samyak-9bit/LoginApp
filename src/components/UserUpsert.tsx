import React from 'react';
import { ActivityIndicator, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Checkbox } from 'react-native-paper';
import { addUserBtn, addUserHeading, defaultErrorMessage, doubleRegisterMessage, emailLabel, emptyFieldMessage, error404Message, firstName, invalidEmailMessage, main_Heading, passwordLabel, passwordMismatchMessage, reEnterPasswordLabel, registerSuccessMessage, sub_Heading, superUserLabel, weakPasswordMessage } from '../constants';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { isStrongPassword, isValidEmail } from './common Functions/validation';
import { showToast } from './common Functions/ShowErrorToast';

interface RouteParams {
    _id: string; // Assuming _id is a string
  }
  
interface Props {
    navigation: NavigationProp<any>;
    route: RouteProp<any, RouteParams>; // Specify the type of route.params
}

function UserUpsert(props: Props): React.JSX.Element{
      const [inputFields, setInputFields] = React.useState({
        name: '',
        email: '',
        password: '',
        isSuperUser: false,
      });
      
      const [reEnterPassword, setReEnterPassword] = React.useState('');
      const [loading, setLoading]  = React.useState(false);
      const { route } = props;
      const { _id } = route.params;
    
      const handleChange = (name: string, value: string) => {
        setInputFields({
          ...inputFields,
          [name]: value,
        });
      };
    
      const handleReEnterPasswordChange = (text: string) => {
        setReEnterPassword(text);
      };
    
    
      const handleSuperUserChange = () => {
        setInputFields({
          ...inputFields,
          isSuperUser: !inputFields.isSuperUser,
        });
      };
    
    
    
      const handleRegisterPress = async() => {
        if (
            inputFields.name.trim() === '' ||
            inputFields.email.trim() === '' ||
            inputFields.password.trim() === '' ||
            reEnterPassword.trim() === ''
        ) {
            showToast(emptyFieldMessage);
            return;
        } else if (!isValidEmail(inputFields.email)) {
            showToast(invalidEmailMessage);
            return;
        } else if (!isStrongPassword(inputFields.password)) {
            showToast(weakPasswordMessage);
            return;
        } else if (inputFields.password !== reEnterPassword) {
            showToast(passwordMismatchMessage);
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
                  break;
                case 403:
                  if (responseData.errorCode === 11000) {
                    showToast(doubleRegisterMessage);
                  }
                  break;
                case 409:
                  showToast(doubleRegisterMessage);
                  break;
                case 404:
                  showToast(error404Message);
                  break;
                default:
                  showToast(defaultErrorMessage);
              }
            } catch (error) {
              console.error('Error during registering:', error);
              showToast(defaultErrorMessage);
            } finally {
              setLoading(false);
            }
            }
    };
    
    return(
        <View style={styles.container}>
        <View style={styles.upperPart}>
        <View style={styles.upperPart}>
        <Text style={styles.mainHeading}>{main_Heading}</Text>
        <Text style={styles.subHeading}>{sub_Heading}</Text>
      </View>
        </View>
        <View style={styles.lowerPart}>
        <Text style={[styles.formHeading,loading?styles.formHeadingWhenSpinner:null]}>{addUserHeading}</Text>
        {loading && <ActivityIndicator size="large" color='rgb(34,84,211)'/>}
        <Text style={styles.inputLabel}>{firstName}</Text>
          <TextInput
            style={styles.input}
          //   placeholder="First Name"
            value={inputFields.name}
            onChangeText={(text) => handleChange('name', text)}
          />

          <Text style={styles.inputLabel}>{emailLabel}</Text>
          <TextInput
            style={styles.input}
          //   placeholder="Email"
            value={inputFields.email}
            onChangeText={(text) => handleChange('email', text)}
          />
          <Text style={styles.inputLabel}>{passwordLabel}</Text>
          <TextInput
            style={styles.input}
          //   placeholder="Password"
            secureTextEntry
            value={inputFields.password}
            onChangeText={(text) => handleChange('password', text)}
          />
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
          <Text style={[styles.btnText,loading?styles.disabledBtnText:null]}>{addUserBtn}</Text>
          </TouchableOpacity>

        </View>
      </View>
    )
}
const styles = StyleSheet.create({
      container: {
        height: '100%',
        backgroundColor: 'rgb(34,84,211)',
      },
      mainHeading: {
        textAlign: 'center',
        color: 'rgb(255,255,255)',
        fontSize: 25,
     
      },
      upperPart: {
        height: '20%',
        justifyContent: 'center',
      },
      subHeading: {
        textAlign: 'center',
        color: 'rgb(255,255,255)',
        fontSize: 15,
      },
      lowerPart: {
        height: '80%',
        backgroundColor: 'rgb(255,255,255)',
        borderWidth: 0,
        borderTopLeftRadius: 35,
        borderTopRightRadius: 35,
        paddingHorizontal: Platform.OS === 'web' ? 200:0,
      },
      formHeading: {
        textAlign: 'center',
        color: 'rgb(0,0,0)',
        fontSize: 35,
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
    
export default UserUpsert;