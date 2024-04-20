//@ts-nocheck
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Platform, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { Icon } from 'react-native-paper';
import { another, choose, clickBtn, getAnImageHeading, imageText, selectedImage, uploadFailureMessage, uploadImageBtn } from './constants';
import { imagePostUrl } from './Urls';
import { CustomModal } from './SuccessModal';
import { showToast } from '../common Functions/ShowErrorToast';

//Function to create form data for post api
const createFormData = (image, body = {}) => {
  const data = new FormData();

  data.append('myfile', {
    name: image.assets[0].fileName, 
    type: 'multipart/formdata',
    uri: Platform.OS === 'ios' ? image.uri.replace('file://', '') : image.assets[0].uri,
  });

//   Object.keys(body).forEach((key) => {
//     data.append(key, body[key]);
//   });

  return data;
};

const ImageForm = () => {
  const [image, setImage] = React.useState(null);
  const [modalVisible, setModalVisible] = React.useState(false);

  const navigation = useNavigation();

  //Function to select file from device
  const handleChooseImage = () => {
    launchImageLibrary({ noData: true, mediaType:'photo' }, (response) => {
      if (response) {
        setImage(response);
      }
    });
  };

  //Function to open camera
  const handleCamera = () =>{
    launchCamera({ noData: true, mediaType:'photo' }, handleResponse);
  }

  //Function to handle camera response
  const handleResponse = (response) => {
    if (response.didCancel) {
      console.log('User cancelled image picker');
    } else if (response.error) {
      console.log('Image picker error: ', response.error);
    } else {
      setImage(response);
    }
  };

  //Function to upload image to server
  const handleUploadImage = () => {
    console.log(image)
    fetch(imagePostUrl, {
      method: 'POST',
      body: createFormData(image),
      headers: { authtoken: 'allow' },
    })
      .then((response) => response.json())
      .then((response) => {
        console.log('response', response);
        if(response.status === "Success"){
          setModalVisible(true);
            setImage(null);
        }else{
          showToast(uploadFailureMessage,'warning');
        }
      })
      .catch((error) => {
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
        <TouchableOpacity style={styles.backIconContainer} onPress={()=>{navigation.goBack()}}>
      <Icon
      source={'arrow-left-bold-circle'}
      size={35}
      color='rgb(120,120,120)'
      />
      </TouchableOpacity>
      <Text style={styles.title}>{image ? selectedImage :getAnImageHeading}</Text>
      {image && (
        <>
          <Image
            source={{ uri: image.uri || image.assets[0].uri }}
            style={styles.video}
          />
          <TouchableOpacity onPress={handleUploadImage} style={styles.button}>
            <Text style={styles.buttonText}>{uploadImageBtn}</Text>
          </TouchableOpacity>
        </>
      )}
      <TouchableOpacity onPress={handleChooseImage} style={styles.button}>
        <Text style={styles.buttonText}>{choose} {image && another} {imageText}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleCamera} style={styles.button}>
        <Text style={styles.buttonText}>{clickBtn}</Text>
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
});

export default ImageForm;















