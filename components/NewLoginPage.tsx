/* eslint-disable prettier/prettier */
import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { forgot_Password_Link, form_Heading, loginBtn, main_Heading, passwordLabel, sub_Heading, userNameLabel } from '../constants';
import { Icon } from 'react-native-paper';

function NewLoginPage(): React.JSX.Element {
    const [inputFields, setInputFields] = React.useState({
       userName: '',
        password: '',
      });

      const handleUserNameChange = (text: string) => {
        setInputFields(prevInputFields => ({
          ...prevInputFields,
         userName: text,
        }));
      };

      const handlePasswordChange = (text: string) => {
        setInputFields(prevInputFields => ({
          ...prevInputFields,
          password: text,
        }));
      };

    return (
        <View style={styles.container}>
            <View style={styles.upperPart}>
                <Text style={styles.mainHeading}>{main_Heading}</Text>
                <Text style={styles.subHeading}>{sub_Heading}</Text>
                <Icon
            size={50}
            source="eye-off"
            />
            </View>
            <View style={styles.lowerPart}>
                <Text style={styles.formHeading} >{form_Heading}</Text>
                <Text style={styles.inputLabel}>{userNameLabel}</Text>
                <TextInput style={styles.input}
                value={inputFields.userName}
                onChangeText={handleUserNameChange}
                />
                <Text style={styles.inputLabel}>{passwordLabel}</Text>
                <TextInput style={styles.input}
                value={inputFields.password}
                onChangeText={handlePasswordChange}
                />
                <Text style={styles.forgotPasswordText}>{forgot_Password_Link}</Text>
               <Pressable style={styles.btn}><Text style={styles.btnText}>{loginBtn}</Text></Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
container:{
    height: '100%',
    backgroundColor:'rgb(34,84,211)',
},
upperPart:{
    height:'40%',
    justifyContent:'center',
},
lowerPart:{
    height:'60%',
    backgroundColor:'rgb(255,255,255)',
    borderWidth: 0,
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
},
mainHeading:{
    textAlign:'center',
    color:'rgb(255,255,255)',
    fontSize:40,
    fontWeight:'300',
},
subHeading:{
    textAlign:'center',
    color:'rgb(255,255,255)',
    fontSize:18,
},
formHeading:{
    textAlign:'center',
    color:'rgb(0,0,0)',
    fontSize:40,
    marginTop:18,
    marginBottom:35,
},
input: {
    height: 45,
    backgroundColor: 'rgb(244,244,244)',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 0,
    borderRadius: 8,
    fontSize: 16,
    marginHorizontal:25,
    marginBottom:14,
},
inputLabel:{
    marginLeft:25,
    color:'rgb(0,0,0)',
    fontSize:16,
    marginBottom:8,
    fontWeight:'400',
},
forgotPasswordText:{
    marginRight:25,
    textAlign:'right',
    fontSize:15,
    marginBottom:60,
},
btn:{
    height: 40,
    backgroundColor:'rgb(34,84,211)',
    justifyContent:'center',
    marginHorizontal:50,
    borderWidth:0,
    borderRadius:10,
},
btnText:{
    textAlign:'center',
    color:'rgb(255,255,255)',
    fontSize:20,
    fontWeight:'400',
},
});
export default NewLoginPage;
