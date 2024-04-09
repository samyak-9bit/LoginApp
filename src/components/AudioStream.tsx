// import React, { useState } from 'react';
// import { StyleSheet, TouchableOpacity, View} from 'react-native';
// import { NavigationProp} from '@react-navigation/native';
// import ImagePicker from 'react-native-image-picker'
// import LiveAudioStream from 'react-native-live-audio-stream';

// function AudioStream({ navigation }: { navigation: NavigationProp<any> }): React.JSX.Element {

//     const options = {
//         sampleRate: 32000,  // default is 44100 but 32000 is adequate for accurate voice recognition
//         channels: 1,        // 1 or 2, default 1
//         bitsPerSample: 16,  // 8 or 16, default 16
//         audioSource: 6,     // android only (see below)
//         bufferSize: 4096    // default is 2048
//       };

//     LiveAudioStream.init(options);
//     LiveAudioStream.on('data', data => {
//       // base64-encoded audio data chunks
//     });
//   return ( 
//     <View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({

// });
// export default AudioStream;
//@ts-nocheck
import React from 'react';
import { View, Image, Button, Platform } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';

const SERVER_URL = 'http://10.0.2.2:3000';

const createFormData = (photo, body = {}) => {
  const data = new FormData();

  data.append('photo', {
    name: photo.assets[0].fileName,
    type: photo.assets[0].type,
    uri: Platform.OS === 'ios' ? photo.uri.replace('file://', '') : photo.assets[0].uri,
  });

  Object.keys(body).forEach((key) => {
    data.append(key, body[key]);
  });

  return data;
};
const AudioStream = () => {
  const [photo, setPhoto] = React.useState(null);

  const handleChoosePhoto = () => {
    launchImageLibrary({ noData: true }, (response) => {
      console.log('response after selecting from gallery:',response);
      if (response) {
        setPhoto(response);
        console.log('Photo state after selecting from gallery:',photo);
      }
    });
  };

  const handleUploadPhoto = () => {
    fetch(`${SERVER_URL}/api/upload`, {
      method: 'POST',
      body: createFormData(photo, { userId: '123' }),
    })
      .then((response) => response.json())
      .then((response) => {
        console.log('response', response);
      })
      .catch((error) => {
        console.log('error', error);
      });
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      {photo && (
        <>
          <Image
            source={{ uri: photo.assets[0].uri }}
            style={{ width: 300, height: 300 }}
          />
          <Button title="Upload Photo" onPress={handleUploadPhoto} />
        </>
      )}
      <Button title="Choose Photo" onPress={handleChoosePhoto} />
    </View>
  );
};

export default AudioStream;