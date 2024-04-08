import {NavigationProp} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import {Camera, CameraDevice} from 'react-native-vision-camera';
import Video from 'react-native-video';

function VideoRecord({
  navigation,
}: {
  navigation: NavigationProp<any>;
}): React.JSX.Element {
  const [device, setDevice] = useState<CameraDevice | undefined>(undefined);
  const [isRecording, setIsRecording] = useState(false);
  const [isRecorded, setIsRecorded] = useState(false);
  const [videoPath, setVideoPath] = useState('');

  const camera = useRef<Camera>(null);
  

  useEffect(() => {
    checkPermission();
    getAvailableCameraDevices();
  }, []);

  const checkPermission = async () => {
    const newCameraPermission = await Camera.requestCameraPermission();
    const newMicrophonePermission = await Camera.requestMicrophonePermission();
    console.log('Camera Permission:', newCameraPermission);
    console.log('Audio Permission:', newMicrophonePermission);
  };

  const getAvailableCameraDevices = async () => {
    const devices = await Camera.getAvailableCameraDevices();
    const foundDevice = devices.find(d => d.position === 'back');
    setDevice(foundDevice);
  };

  const sendVideoToServer = async () => {
    try {
      const response = await fetch(videoPath);
      const videoBlob = await response.blob();
      
      const formData = new FormData();
      formData.append('video', videoBlob, 'my_video.mp4');
      
      const uploadResponse = await fetch('http://10.0.2.2:5000/uploadVideo', {
        method: 'POST',
        body: formData,
      });
  
      const result = await uploadResponse.json();
      console.log('Video uploaded successfully:', result);
    } catch (error) {
      console.error('Error uploading video:', error);
    }
  };


  const startRecording = async () => {
    setIsRecording(true);
    camera.current!.startRecording({
      onRecordingFinished: video => {
        setVideoPath(video.path);
        console.log(video);
      },
      onRecordingError: error => console.error(error),
    });
  };

  const stopRecording = async () => {
    await camera.current!.stopRecording();
    setIsRecording(false);
    setIsRecorded(true);
  };

  if (device === undefined) return <ActivityIndicator />;

  if (!device) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>No suitable camera device found.</Text>
      </View>
    );
  }

  return (
    <View style={{flex: 1}}>
      {isRecorded ? (
        <View style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 10 }}>
            <View style={{ width: '100%', aspectRatio: 16 / 9, borderWidth: 1, borderColor: 'gray' }}>
              <Video
                source={{ uri: videoPath }}
                style={{ flex: 1 }}
                controls
              />
            </View>
          </View>
          <View style={{ height: 100, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
            <TouchableOpacity style={{ backgroundColor: '#FF0034', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 5 }} onPress={()=>{
                setIsRecorded(false);
                setVideoPath('');
            }
        
            }>
              <Text style={{ color: 'white' }}>Go Back</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ backgroundColor: '#FF0034', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 5 }} onPress={()=>{sendVideoToServer()}}>
              <Text style={{ color: 'white' }}>Send To Server</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      
      ) : (
        <View style={{flex: 1}}>
          <Camera
            ref={camera}
            style={StyleSheet.absoluteFill}
            device={device}
            isActive={true}
            video={true}
            audio={true}
          />
          <TouchableOpacity
            style={{
              width: 60,
              height: 60,
              borderRadius: 30,
              backgroundColor: '#FF0034',
              position: 'absolute',
              bottom: 50,
              alignSelf: 'center',
              justifyContent: 'center', // Center content vertically
              alignItems: 'center', // Center content horizontally
              borderWidth: 5,
              borderColor: '#FFFFFF',
            }}
            onPress={() => {
              isRecording ? stopRecording() : startRecording();
            }}>
            <Text style={{color: 'white'}}>
              {isRecording ? 'Stop' : 'Start'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

export default VideoRecord;


