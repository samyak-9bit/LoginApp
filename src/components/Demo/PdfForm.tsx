//@ts-nocheck
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Platform, Text, TouchableOpacity, StyleSheet } from 'react-native';
import {pick,types} from 'react-native-document-picker';
import { Icon } from 'react-native-paper';
import { another, choose, fileText, getADocText, selectedDocText, uploadFailureMessage, uploadFileBtn } from './constants';
import { documentPostUrl } from './Urls';
import { CustomModal } from './SuccessModal';
import { showToast } from '../common Functions/ShowErrorToast';

const createFormData = (file, body = {}) => {
    const data = new FormData();
  
    if (file.length > 0) {
      data.append('myfile', {
        name: file[0].name,
        type: 'multipart/formdata',
        uri: Platform.OS === 'ios' ? file[0].uri.replace('file://', '') : file[0].uri,
      });
    }
  
    // Object.keys(body).forEach((key) => {
    //   data.append(key, body[key]);
    // });
  
    return data;
  };
  

const PdfForm = () => {
  const [file, setFile] = React.useState([]);
  const [modalVisible, setModalVisible] = React.useState(false);
  const navigation = useNavigation();
  

  const handleChooseFile = async() => {
    try {
        const response = await pick({
         mode:'open',
         type: [types.pdf, types.doc, types.docx,types.plainText, types.xls, types.ppt, types.pptx],
        });
        setFile(response);
        console.log(response);
      } catch (err) {
        console.warn(err);
      }
  };


  const handleUploadFile = () => {
    console.log(file)
    fetch(documentPostUrl, {
      method: 'POST',
      body: createFormData(file),
      headers: { authtoken: 'allow' },
    })
      .then((response) => response.json())
      .then((response) => {
        console.log('response', response);
      if(response.status === "Success"){
          // alert('Document uploaded successfully!');
          setModalVisible(true);
          setFile([]);
      }else{
        showToast(uploadFailureMessage,'warning');
      }
      })
      .catch((error) => {
        console.log('error', error);
        showToast(uploadFailureMessage,'warning');
      });
  };

  return (
    <View style={styles.container}>

      <CustomModal
        visible={modalVisible} 
        onDismiss={()=>{setModalVisible(false)}} 
        contentContainerStyle={{ backgroundColor: 'white', padding: 20 }} 
        buttonText="Show"
        buttonStyle={{ marginTop: 30 }}
      />
      <TouchableOpacity style={styles.backIconContainer} onPress={()=>{navigation.goBack()}}>
      <Icon
      source={'arrow-left-bold-circle'}
      size={35}
      color='rgb(120,120,120)'
      />
      </TouchableOpacity>
      <Text style={styles.title}>{file.length>0 ?  selectedDocText : getADocText}</Text>
      {file.length>0 && (
        <>
          <Text
            style={[styles.fileHeading, {maxWidth: 200}]}
            numberOfLines={2}
            ellipsizeMode="tail">
            {file[0].name}
          </Text>

          <TouchableOpacity onPress={handleUploadFile} style={styles.button}>
            <Text style={styles.buttonText}>{uploadFileBtn}</Text>
          </TouchableOpacity>
        </>
      )}
      <TouchableOpacity onPress={handleChooseFile} style={styles.button}>
        <Text style={styles.buttonText}>{choose} {file.length>0 && another} {fileText}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical:5,
  },
  backIconContainer:{
position:'absolute',
top:5,
left:5
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    fontWeight: 'bold',
    marginTop: 15
  },
  video: {
    flex: 1,
    width: '100%',
    height: 270,
    marginVertical: 20,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    width: '80%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign:'center',
  },
  fileHeading:{
    marginBottom:15,
    fontSize:22,
    fontWeight:'500',
    color:'black'
  }
});

export default PdfForm;
















