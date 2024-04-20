//@ts-nocheck
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {View, Platform, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {pick, types} from 'react-native-document-picker';
import { another, audioText, choose, getAnAudioText, goBackBtnText, selectedAudioText, uploadAudioBtnText, uploadFailureMessage } from './constants';
import { audioPostUrl } from './Urls';
import { CustomModal } from './SuccessModal';
import { showToast } from '../common Functions/ShowErrorToast';

//Function to create form data for post api
const createFormData = (file, body = {}) => {
  const data = new FormData();

  if (file.length > 0) {
    data.append('myfile', {
      name: file[0].name,
      type: 'multipart/formdata',
      uri:
        Platform.OS === 'ios'
          ? file[0].uri.replace('file://', '')
          : file[0].uri,
    });
  }

  // Object.keys(body).forEach((key) => {
  //   data.append(key, body[key]);
  // });

  return data;
};


const AudioFromDevice = () => {
  const [file, setFile] = React.useState([]);
  const [modalVisible, setModalVisible] = React.useState(false);

  const navigation = useNavigation();

  //Function to handle file selection from device
  const handleChooseFile = async () => {
    try {
      const response = await pick({
        mode: 'open',
        type: types.audio,
      });
      setFile(response);
      console.log(response);
    } catch (err) {
      console.warn(err);
    }
  };

  //Function to upload file
  const handleUploadFile = () => {
    console.log(file);
    fetch(audioPostUrl, {
      method: 'POST',
      body: createFormData(file),
      headers: {authtoken: 'allow'},
    })
      .then(response => response.json())
      .then(response => {
        console.log('response', response);
        if (response.status === 'Success') {
          setModalVisible(true);
          setFile([]);
        }else{
          showToast(uploadFailureMessage,'warning');
        }
      })
      .catch(error => {
        showToast(uploadFailureMessage,'warning');
        console.log('error', error);
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
      <Text style={styles.title}>
        {file.length > 0 ? selectedAudioText : getAnAudioText }
      </Text>
      {file.length > 0 && (
        <>
          <Text
            style={[styles.fileHeading, {maxWidth: 200}]}
            numberOfLines={2}
            ellipsizeMode="tail">
            {file[0].name}
          </Text>

          <TouchableOpacity onPress={handleUploadFile} style={styles.button}>
            <Text style={styles.buttonText}>{uploadAudioBtnText}</Text>
          </TouchableOpacity>
        </>
      )}
      <TouchableOpacity onPress={handleChooseFile} style={styles.button}>
        <Text style={styles.buttonText}>
          {choose} {file.length > 0 && another} {audioText}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={()=>{navigation.goBack()}} style={styles.button}>
        <Text style={styles.buttonText}>
          {goBackBtnText}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 5,
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    fontWeight: 'bold',
    marginTop: 15,
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
    textAlign: 'center',
  },
  fileHeading: {
    marginBottom: 15,
    fontSize: 22,
    fontWeight: '500',
    color: 'black',
  },
});

export default AudioFromDevice;
