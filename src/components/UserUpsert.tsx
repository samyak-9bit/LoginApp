import React from 'react';
import { ActivityIndicator, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Checkbox, Icon } from 'react-native-paper';
import { addUserBtn, addUserHeading, defaultErrorMessage, doubleRegisterMessage, editFailureMessage, editSuccessMessage, editUserBtn, editUserHeading, emailLabel, emptyFieldMessage, error404Message, firstName, invalidEmailMessage, main_Heading, passwordLabel, passwordMismatchMessage, reEnterPasswordLabel, registerSuccessMessage, sub_Heading, superUserLabel, weakPasswordMessage } from '../constants';
import { isStrongPassword, isValidEmail } from './common Functions/validation';
import { showToast } from './common Functions/ShowErrorToast';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { useNavigation } from '@react-navigation/native';

type UserProps = NativeStackScreenProps<RootStackParamList, "UserUpsert">

function UserUpsert({route}: UserProps): React.JSX.Element{
      const [inputFields, setInputFields] = React.useState({
        name: '',
        email: '',
        password: '',
        isSuperUser: false,
      });
      
      const [reEnterPassword, setReEnterPassword] = React.useState('');
      const [loading, setLoading]  = React.useState(false);
      const [editMode,setEditMode] = React.useState(false);
      const [showPassword, setShowPassword] = React.useState(false);
      const navigation = useNavigation();
      const {user} = route.params;

      React.useEffect(() => {
        if (user.userId.trim() !== '') {
            setEditMode(true);
            setInputFields({
              name: user.name,
              email: user.email,
              password: user.password,
              isSuperUser: false,
            })
            setReEnterPassword(user.password)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[user.userId]);
      
    
      const handleChange = (name: string, value: string) => {
        setInputFields({
          ...inputFields,
          [name]: value,
        });
      };

      const toggleShowPassword = () => {
        setShowPassword(!showPassword);
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
              const response = await fetch(Platform.OS==='android'?'http://10.0.2.2:5000/register':'http://localhost:5000/register', {
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
              console.error('Error during fetching data:', error);
              showToast(defaultErrorMessage,'warning');
            } finally {
              setLoading(false);
            }
            }
    };

    const handleEditPress=async()=>{
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
          const response = await fetch('http://192.168.1.22:9001/askdb/entity/users/'+user.userId, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: inputFields.name,
              email: inputFields.email,
              password: inputFields.password,
              isSuperUser: inputFields.isSuperUser,
            }),
          });
          if(response.status===200){
            showToast(editSuccessMessage);
          }else{
            showToast(editFailureMessage,'warning');
          }
        } catch (error) {
          console.error('Error during fetching data:', error);
          showToast(defaultErrorMessage,'warning');
        } finally {
          setLoading(false);
        }
        }
    }
    
    return(
        <View style={styles.container}>
        <TouchableOpacity onPress={()=>{navigation.goBack()}} style={styles.backIcon}>
          <Icon
          color='rgb(255,255,255)'
          size={24}
          source='arrow-left'
          />
          </TouchableOpacity>
        <View style={styles.upperPart}>
        <Text style={styles.mainHeading}>{main_Heading}</Text>
        <Text style={styles.subHeading}>{sub_Heading}</Text>
        </View>
        <View style={styles.lowerPart}>
        <Text style={[styles.formHeading,loading?styles.formHeadingWhenSpinner:null]}>{editMode?editUserHeading:addUserHeading}</Text>
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
  
          <TouchableOpacity style={[styles.btn, loading?styles.disabledBtn:null]} onPress={editMode? handleEditPress : handleRegisterPress} disabled={loading}>
          <Text style={[styles.btnText,loading?styles.disabledBtnText:null]}>{editMode?editUserBtn:addUserBtn}</Text>
          </TouchableOpacity>

        </View>
      </View>
    )
}
const styles = StyleSheet.create({
  topbar: {
    backgroundColor: 'rgb(34,84,211)',
  },
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
        height: '18%',
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
      backIcon:{
        padding:3,
      }
    });
    
export default UserUpsert;





