//@ts-nocheck
import React from 'react';
import { View, Platform, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';


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

  const handleChooseImage = () => {
    launchImageLibrary({ noData: true, mediaType:'photo' }, (response) => {
      if (response) {
        setImage(response);
      }
    });
  };

  const handleCamera = () =>{
    launchCamera({ noData: true, mediaType:'photo' }, handleResponse);
  }

  const handleResponse = (response) => {
    if (response.didCancel) {
      console.log('User cancelled image picker');
    } else if (response.error) {
      console.log('Image picker error: ', response.error);
    } else {
      setImage(response);
    }
  };

  const handleUploadImage = () => {
    console.log(image)
    fetch(`http://192.168.1.22:9001/blob/photos`, {
      method: 'POST',
      body: createFormData(image),
      headers: { authtoken: 'allow' },
    })
      .then((response) => response.json())
      .then((response) => {
        console.log('response', response);
        if(response.status === "Success"){
            alert('Image uploaded successfully!');
            setImage(null);
        }
      })
      .catch((error) => {
        console.log('error', error);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Get me an Image!</Text>
      {image && (
        <>
          <Image
            source={{ uri: image.uri || image.assets[0].uri }}
            style={styles.video}
          />
          <TouchableOpacity onPress={handleUploadImage} style={styles.button}>
            <Text style={styles.buttonText}>Upload Image</Text>
          </TouchableOpacity>
        </>
      )}
      <TouchableOpacity onPress={handleChooseImage} style={styles.button}>
        <Text style={styles.buttonText}>Choose {image && 'Another'} Image</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleCamera} style={styles.button}>
        <Text style={styles.buttonText}>Click now</Text>
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















