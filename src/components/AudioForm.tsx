//@ts-nocheck
import { NavigationProp } from '@react-navigation/native';
import React, { useState } from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import AudioRecorderPlayer, {
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  AudioEncoderAndroidType,
  AudioSourceAndroidType,
} from 'react-native-audio-recorder-player';
import { Platform, PermissionsAndroid } from 'react-native';
import RNFS from 'react-native-fs';
import {pick} from 'react-native-document-picker';

const createFormData = (audioPath,audioName, body = {}) => {
  console.log(audioPath);
  const data = new FormData();
  data.append('myfile', {
    name: audioName,
    type: 'multipart/formdata',   
    uri: Platform.OS === 'ios' ? audioPath.replace('file://', '') : `file:////data/user/0/com.myawesomeproject/cache/${audioName}`, // Remove 'file://' prefix for iOS
  });

  // Object.keys(body).forEach((key) => {
  //   data.append(key, body[key]);
  // });

  return data;
};

const AudioForm = ({ navigation }: { navigation: NavigationProp<any> }): React.JSX.Element => {
  const [audio, setAudio] = useState({
    isLoggingIn: false,
    recordSecs: 0,
    recordTime: '00:00:00',
    currentPositionSec: 0,
    currentDurationSec: 0,
    playTime: '00:00:00',
    duration: '00:00:00',
  });
  const [audioPath,setAudioPath] = useState('');
  const [audioName,setAudioName] = useState('');
  const [fileResponse, setFileResponse] = useState([]);

  const audioRecorderPlayer = new AudioRecorderPlayer();
  audioRecorderPlayer.setSubscriptionDuration(0.09);

  const requestStoragePermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message: 'App needs access to storage to save audio files.',
          buttonPositive: 'OK',
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Storage permission granted');
      } else {
        console.log('Storage permission denied');
      }
    } catch (err) {
      console.error('Failed to request storage permission:', err);
    }
  };
  
  const getCacheDirectory = () => {
    if (Platform.OS === 'ios') {
      return `${RNFS.LibraryDirectoryPath}/Caches`;
    } else {
      return RNFS.CachesDirectoryPath;
    }
  };
  
  const startRecording = async () => {
    try {
      await requestStoragePermission(); // Request storage permission
      const timestamp = Date.now();
      const name = `audio_${timestamp}.m4a`;
      setAudioName(name);
      const path = `${getCacheDirectory()}/audio_${timestamp}.m4a`;
      console.log('Recording path:', path);
      setAudioPath(path);
      const audioSet = {
        AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
        AudioSourceAndroid: AudioSourceAndroidType.MIC,
        AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
        AVNumberOfChannelsKeyIOS: 2,
        AVFormatIDKeyIOS: AVEncodingOption.aac,
      };
      const uri = await audioRecorderPlayer.startRecorder(path, audioSet);
      console.log(`Recording started. URI: ${uri}`);
      audioRecorderPlayer.addRecordBackListener((e) => {
        setAudio((prevAudio) => ({
          ...prevAudio,
          recordSecs: e.current_position,
          recordTime: audioRecorderPlayer.mmssss(Math.floor(e.current_position)),
        }));
      });
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = async () => {
    try {
      const result = await audioRecorderPlayer.stopRecorder();
      audioRecorderPlayer.removeRecordBackListener();
      setAudio((prevAudio) => ({  
        ...prevAudio,
        recordSecs: 0,
      }));
      console.log("Stopped Recording", result);
    } catch (error) {
      console.error('Error stopping recording:', error);
    }
  };

  const onStartPlay = async () => {
    try {
      console.log('onStartPlay');
      const cacheDirectory = getCacheDirectory();
      const timestamp = Date.now();
      const path = `${cacheDirectory}/audio_${timestamp}.m4a`; // Construct the correct file path
      console.log('Playback path:', path);
      const msg = await audioRecorderPlayer.startPlayer(audioPath); // Start playback using the correct path
      console.log('Playback message:', msg);
      audioRecorderPlayer.setVolume(1.0);
      audioRecorderPlayer.addPlayBackListener((e) => {
        if (e.current_position === e.duration) {
          console.log('finished');
          audioRecorderPlayer.stopPlayer();
        }
        setAudio((prevAudio) => ({
          ...prevAudio,
          currentPositionSec: e.current_position,
          currentDurationSec: e.duration,
          playTime: audioRecorderPlayer.mmssss(Math.floor(e.current_position)),
          duration: audioRecorderPlayer.mmssss(Math.floor(e.duration)),
        }));
      });
    } catch (error) {
      console.error('Error starting playback:', error);
    }
  };

  const uploadRecording = () => {
    fetch(`http://192.168.1.22:9001/blob/audios`, {
      method: 'POST',
      body: createFormData(audioPath, audioName),
      headers: { authtoken: 'allow' },
    })
    .then((response) => response.json())
    .then((response) => {
      console.log('response', response);
      if(response.status === "Success"){
        alert('Audio uploaded successfully!');
        setAudioName('');
        setAudioPath('');
    }
    })
    .catch((error) => {
      console.log('error', error);
    });
  };
  
  const deviceUpload = async () => {
    try {
      const response = await pick({
       mode:'open',

      });
      setFileResponse(response);
      console.log(response);
    } catch (err) {
      console.warn(err);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎵 Let's Record Some Magic 🎵</Text>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText} onPress={startRecording}>
          Start Recording
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText} onPress={stopRecording}>
          Stop Recording
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText} onPress={uploadRecording}>
          Upload Recording
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText} onPress={deviceUpload()}>
          Choose from Device
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#333',
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 6,
    marginBottom: 20,
    width: '65%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default AudioForm;
