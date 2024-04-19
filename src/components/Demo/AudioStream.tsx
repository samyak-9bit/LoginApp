//@ts-nocheck
import React from 'react';
import { StyleSheet, TouchableOpacity, View, Text} from 'react-native';
import { NavigationProp} from '@react-navigation/native';
import LiveAudioStream from 'react-native-live-audio-stream';
import { Buffer } from 'buffer';
import { start, stop } from './constants';
import { audioStreamUrl } from './Urls';

function AudioStream({ navigation }: { navigation: NavigationProp<any> }): React.JSX.Element {

    const options = {
        sampleRate: 32000,  // default is 44100 but 32000 is adequate for accurate voice recognition
        channels: 1,        // 1 or 2, default 1
        bitsPerSample: 16,  // 8 or 16, default 16
        audioSource: 6,     // android only (see below)
        bufferSize: 4096    // default is 2048
      };

    LiveAudioStream.init(options);

    LiveAudioStream.on('data', data => {
      var chunk = Buffer.from(data, 'base64');
      sendBufferToServer(chunk);
    });

    const sendBufferToServer = (buffer) => {
      fetch(audioStreamUrl, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/octet-stream' // Set content type as binary
          },
          body: buffer
      })
      .then(response => {
          console.log('Buffer sent successfully:', response);
      })
      .catch(error => {
          console.error('Error sending buffer:', error);
      });
  };

    const startRecording=()=>{
      LiveAudioStream.start();
    }

    const stopRecording=()=>{
      LiveAudioStream.stop();
    }

    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.button} onPress={()=>startRecording()}><Text>{start}</Text></TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.stopButton]} onPress={()=>stopRecording()}><Text>{stop}</Text></TouchableOpacity>
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    button: {
      backgroundColor: '#3498db',
      padding: 10,
      borderRadius: 5,
      marginVertical: 10,
    },
    stopButton: {
      backgroundColor: '#e74c3c',
    },
  });

export default AudioStream;



//@ts-nocheck
// 


// // import React from 'react';
// // import { View, Button, Platform } from 'react-native';
// // import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
// // import Video from 'react-native-video';


// // const SERVER_URL = 'http://10.0.2.2:3000';

// // const createFormData = (video, body = {}) => {
// //   const data = new FormData();

// //   data.append('video', {
// //     name: video.assets[0].fileName,
// //     type: video.assets[0].type,
// //     uri: Platform.OS === 'ios' ? video.uri.replace('file://', '') : video.assets[0].uri,
// //   });

// //   Object.keys(body).forEach((key) => {
// //     data.append(key, body[key]);
// //   });

// //   return data;
// // };
// // const AudioStream = () => {
// //   const [video, setVideo] = React.useState(null);

// //   const handleChooseVideo = () => {
// //     launchImageLibrary({ noData: true, mediaType:'video' }, (response) => {
// //       console.log('response after selecting from gallery:',response);
// //       if (response) {
// //         setVideo(response);
// //         console.log('Video state after selecting from gallery:',video);
// //       }
// //     });
// //   };

// //   const handleCamera = () =>{
// //     launchCamera({ noData: true, mediaType:'video' }, (response) => {
// //         console.log('response after selecting from gallery:',response);
// //         if (response) {
// //           setVideo(response);
// //           console.log('Video state after selecting from gallery:',video);
// //         }
// //       });
// //   }

// //   const handleUploadVideo = () => {
// //     fetch(`${SERVER_URL}/api/upload`, {
// //       method: 'POST',
// //       body: createFormData(video, { userId: '123' }),
// //     })
// //       .then((response) => response.json())
// //       .then((response) => {
// //         console.log('response', response);
// //       })
// //       .catch((error) => {
// //         console.log('error', error);
// //       });
// //   };

// //   return (
// //     <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
// //       {video && (
// //         <>
// //           {/* <Video
// //                 source={{ uri: video.uri }}
// //                 style={{ flex: 1 }}
// //                 controls
// //               /> */}
// //           <Button title="Upload Video" onPress={handleUploadVideo} />
// //         </>
// //       )}
// //       <Button title="Choose Video" onPress={handleChooseVideo} />
// //       <Button title="Record now" onPress={handleCamera} />
// //     </View>
// //   );
// // };

// // export default AudioStream;