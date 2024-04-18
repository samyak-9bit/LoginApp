//@ts-nocheck
import React from 'react';
import { View, Platform, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Video from 'react-native-video';

const createFormData = (video, body = {}) => {
  const data = new FormData();

  data.append('myfile', {
    name: video.assets[0].fileName,
    type: 'multipart/formdata',
    uri: Platform.OS === 'ios' ? video.uri.replace('file://', '') : video.assets[0].uri,
  });

  // Object.keys(body).forEach((key) => {
  //   data.append(key, body[key]);
  // });

  return data;
};

const VideoUpload = () => {
  const [video, setVideo] = React.useState(null);

  const handleChooseVideo = () => {
    launchImageLibrary({ noData: true, mediaType:'video' }, (response) => {
      if (response) {
        setVideo(response);
      }
    });
  };

  const handleCamera = () =>{
    launchCamera({ noData: true, mediaType:'video' }, handleResponse);
  }

  const handleResponse = (response) => {
    if (response.didCancel) {
      console.log('User cancelled image picker');
    } else if (response.error) {
      console.log('Image picker error: ', response.error);
    } else {
      setVideo(response);
    }
  };

  const handleUploadVideo = () => {
    console.log(video)
    fetch(`http://192.168.1.22:9001/blob/videos`, {
      method: 'POST',
      body: createFormData(video),
      headers: { authtoken: 'allow' },
    })
      .then((response) => response.json())
      .then((response) => {
        console.log('response', response);
        if(response.status === "Success"){
          alert('Video uploaded successfully!');
          setVideo(null);
      }
      })
      .catch((error) => {
        console.log('error', error);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Get me a Video!</Text>
      {video && (
        <>
          <Video
            source={{ uri: video.uri || video.assets[0].uri }}
            style={styles.video}
            controls
          />
          <TouchableOpacity onPress={handleUploadVideo} style={styles.button}>
            <Text style={styles.buttonText}>Upload Video</Text>
          </TouchableOpacity>
        </>
      )}
      <TouchableOpacity onPress={handleChooseVideo} style={styles.button}>
        <Text style={styles.buttonText}>Choose {video && 'Another'} Video</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleCamera} style={styles.button}>
        <Text style={styles.buttonText}>Record now</Text>
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

export default VideoUpload;


















// import {NavigationProp} from '@react-navigation/native';
// import React, {useEffect, useRef, useState, useCallback} from 'react';
// import {
//   ActivityIndicator,
//   StyleSheet,
//   View,
//   Text,
//   TouchableOpacity,
//   Alert,
//   Linking,
//   Platform,
// } from 'react-native';
// import {Camera, CameraDevice} from 'react-native-vision-camera';
// import Video from 'react-native-video';
// import Permissions, {PERMISSIONS} from 'react-native-permissions';
// import {CameraRoll} from '@react-native-camera-roll/camera-roll';
// import axios from 'axios';

// function VideoUpload({
//   navigation,
// }: {
//   navigation: NavigationProp<any>;
// }): React.JSX.Element {
//   const [device, setDevice] = useState<CameraDevice | undefined>(undefined);
//   const [isRecording, setIsRecording] = useState(false);
//   const [isRecorded, setIsRecorded] = useState(false);
//   const [videoPath, setVideoPath] = useState('');
//   const [hasPermission, setHasPermission] = useState<boolean>(false);

//   const camera = useRef<Camera>(null);

//   const openSettingsAlert = useCallback(({title}: {title: string}) => {
//     Alert.alert(title, '', [
//       {
//         isPreferred: true,
//         style: 'default',
//         text: 'Open Settings',
//         onPress: () => Linking?.openSettings(),
//       },
//       {
//         isPreferred: false,
//         style: 'destructive',
//         text: 'Cancel',
//         onPress: () => {},
//       },
//     ]);
//   }, []);

//   const checkAndroidPermissions = useCallback(async () => {
//     if (parseInt(Platform.Version as string, 10) >= 33) {
//       const permissions = await Permissions.checkMultiple([
//         PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
//         PERMISSIONS.ANDROID.READ_MEDIA_VIDEO,
//       ]);
//       if (
//         permissions[PERMISSIONS.ANDROID.READ_MEDIA_IMAGES] ===
//           Permissions.RESULTS.GRANTED &&
//         permissions[PERMISSIONS.ANDROID.READ_MEDIA_VIDEO] ===
//           Permissions.RESULTS.GRANTED
//       ) {
//         setHasPermission(true);
//         return;
//       }
//       const res = await Permissions.requestMultiple([
//         PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
//         PERMISSIONS.ANDROID.READ_MEDIA_VIDEO,
//       ]);
//       if (
//         res[PERMISSIONS.ANDROID.READ_MEDIA_IMAGES] ===
//           Permissions.RESULTS.GRANTED &&
//         res[PERMISSIONS.ANDROID.READ_MEDIA_VIDEO] ===
//           Permissions.RESULTS.GRANTED
//       ) {
//         setHasPermission(true);
//       }
//       if (
//         res[PERMISSIONS.ANDROID.READ_MEDIA_IMAGES] ===
//           Permissions.RESULTS.DENIED ||
//         res[PERMISSIONS.ANDROID.READ_MEDIA_VIDEO] === Permissions.RESULTS.DENIED
//       ) {
//         checkAndroidPermissions();
//       }
//       if (
//         res[PERMISSIONS.ANDROID.READ_MEDIA_IMAGES] ===
//           Permissions.RESULTS.BLOCKED ||
//         res[PERMISSIONS.ANDROID.READ_MEDIA_VIDEO] ===
//           Permissions.RESULTS.BLOCKED
//       ) {
//         openSettingsAlert({
//           title: 'Please allow access to your photos and videos from settings',
//         });
//       }
//     } else {
//       const permission = await Permissions.check(
//         PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
//       );
//       if (permission === Permissions.RESULTS.GRANTED) {
//         setHasPermission(true);
//         return;
//       }
//       const res = await Permissions.request(
//         PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
//       );
//       if (res === Permissions.RESULTS.GRANTED) {
//         setHasPermission(true);
//       }
//       if (res === Permissions.RESULTS.DENIED) {
//         checkAndroidPermissions();
//       }
//       if (res === Permissions.RESULTS.BLOCKED) {
//         openSettingsAlert({
//           title: 'Please allow access to the photo library from settings',
//         });
//       }
//     }
//   }, [openSettingsAlert]);

//   const checkGalleryPermission = useCallback(async () => {
//     if (Platform.OS === 'ios') {
//       const permission = await Permissions.check(PERMISSIONS.IOS.PHOTO_LIBRARY);
//       if (
//         permission === Permissions.RESULTS.GRANTED ||
//         permission === Permissions.RESULTS.LIMITED
//       ) {
//         setHasPermission(true);
//         return;
//       }
//       const res = await Permissions.request(PERMISSIONS.IOS.PHOTO_LIBRARY);
//       if (
//         res === Permissions.RESULTS.GRANTED ||
//         res === Permissions.RESULTS.LIMITED
//       ) {
//         setHasPermission(true);
//       }
//       if (res === Permissions.RESULTS.BLOCKED) {
//         openSettingsAlert({
//           title: 'Please allow access to the photo library from settings',
//         });
//       }
//     } else if (Platform.OS === 'android') {
//       checkAndroidPermissions();
//       console.log('Gallery Permission Granted:', hasPermission);
//     }
//   }, [checkAndroidPermissions, openSettingsAlert]);

//   useEffect(() => {
//     checkGalleryPermission();
//   }, [checkGalleryPermission]);

//   useEffect(() => {
//     checkPermission();
//     getAvailableCameraDevices();
//   }, []);

//   const checkPermission = async () => {
//     const newCameraPermission = await Camera.requestCameraPermission();
//     const newMicrophonePermission = await Camera.requestMicrophonePermission();
//     console.log('Camera Permission:', newCameraPermission);
//     console.log('Audio Permission:', newMicrophonePermission);
//   };

//   const getAvailableCameraDevices = async () => {
//     const devices = await Camera.getAvailableCameraDevices();
//     const foundDevice = devices.find(d => d.position === 'back');
//     setDevice(foundDevice);
//   };

//   const sendVideoToServer = async () => {
//     try {
//       console.log(videoPath);
//       const response = await axios.get(`file://${videoPath}`, {
//         responseType: 'blob',
//       });
//       const videoBlob = response.data;
//       console.log(videoBlob);
//       const formData = new FormData();
//       formData.append('video', videoBlob, 'my_video.mp4');

//       const uploadResponse = await axios.post(
//         'http://10.0.2.2:5000/uploadVideo',
//         formData,
//       );

//       console.log('Video uploaded successfully:', uploadResponse.data);
//     } catch (error) {
//       console.error('Error uploading video:', error);
//     }
//   };

//   const startRecording = async () => {
//     setIsRecording(true);
//     camera.current!.startRecording({
//       onRecordingFinished: async video => {
//         const path = video.path;
//         await CameraRoll.saveAsset(`file://${path}`, {
//           type: 'video',
//         });
//         setVideoPath(video.path);
//         console.log(video);
//       },
//       onRecordingError: error => console.error(error),
//     });
//   };

//   const stopRecording = async () => {
//     await camera.current!.stopRecording();
//     setIsRecording(false);
//     setIsRecorded(true);
//   };

//   if (device === undefined) return <ActivityIndicator />;

//   if (!device) {
//     return (
//       <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
//         <Text>No suitable camera device found.</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={{flex: 1}}>
//       {isRecorded ? (
//         <View style={{flex: 1}}>
//           <View style={{flex: 1}}>
//             <View
//               style={{
//                 flex: 1,
//                 justifyContent: 'center',
//                 alignItems: 'center',
//                 padding: 10,
//               }}>
//               <View
//                 style={{
//                   width: '100%',
//                   aspectRatio: 16 / 9,
//                   borderWidth: 1,
//                   borderColor: 'gray',
//                 }}>
//                 <Video source={{uri: videoPath}} style={{flex: 1}} controls />
//               </View>
//             </View>
//             <View
//               style={{
//                 height: 100,
//                 flexDirection: 'row',
//                 justifyContent: 'space-around',
//                 alignItems: 'center',
//               }}>
//               <TouchableOpacity
//                 style={{
//                   backgroundColor: '#FF0034',
//                   paddingVertical: 10,
//                   paddingHorizontal: 20,
//                   borderRadius: 5,
//                 }}
//                 onPress={() => {
//                   setIsRecorded(false);
//                   setVideoPath('');
//                 }}>
//                 <Text style={{color: 'white'}}>Go Back</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={{
//                   backgroundColor: '#FF0034',
//                   paddingVertical: 10,
//                   paddingHorizontal: 20,
//                   borderRadius: 5,
//                 }}
//                 onPress={() => {
//                   sendVideoToServer();
//                 }}>
//                 <Text style={{color: 'white'}}>Send To Server</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       ) : (
//         <View style={{flex: 1}}>
//           <Camera
//             ref={camera}
//             style={StyleSheet.absoluteFill}
//             device={device}
//             isActive={true}
//             video={true}
//             audio={true}
//           />
//           <TouchableOpacity
//             style={{
//               width: 60,
//               height: 60,
//               borderRadius: 30,
//               backgroundColor: '#FF0034',
//               position: 'absolute',
//               bottom: 50,
//               alignSelf: 'center',
//               justifyContent: 'center', // Center content vertically
//               alignItems: 'center', // Center content horizontally
//               borderWidth: 5,
//               borderColor: '#FFFFFF',
//             }}
//             onPress={() => {
//               isRecording ? stopRecording() : startRecording();
//             }}>
//             <Text style={{color: 'white'}}>
//               {isRecording ? 'Stop' : 'Start'}
//             </Text>
//           </TouchableOpacity>
//         </View>
//       )}
//     </View>
//   );
// }

// export default VideoUpload;
