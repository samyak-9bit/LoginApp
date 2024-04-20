//@ts-nocheck
import { NavigationProp} from '@react-navigation/native';
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
import { Icon } from 'react-native-paper';
import { deviceBtnText, recordingHeading, startRecordingText, stopRecordingText, uploadFailureMessage, uploadRecordingText } from './constants';
import { audioPostUrl } from './Urls';
import { CustomModal } from './SuccessModal';
import { showToast } from '../common Functions/ShowErrorToast';

//Function to create form data for post api

const createFormData = (audioPath,audioName, body = {}) => {
  console.log(audioPath);
  const data = new FormData();
  data.append('myfile', {
    name: audioName,
    type: 'multipart/formdata',   
    uri: Platform.OS === 'ios' ? audioPath.replace('file://', '') : `file:////${audioPath}`, // Remove 'file://' prefix for iOS
  });

  // Object.keys(body).forEach((key) => {
  //   data.append(key, body[key]);
  // });

  return data;
};


const AudioForm = ({ navigation }: { navigation: NavigationProp<any> }): React.JSX.Element => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  const [modalVisible, setModalVisible] = useState(false);


  const audioRecorderPlayer = new AudioRecorderPlayer();
  audioRecorderPlayer.setSubscriptionDuration(0.09);

  const resetValues=()=>{
    setAudio({
      isLoggingIn: false,
      recordSecs: 0,
      recordTime: '00:00:00',
      currentPositionSec: 0,
      currentDurationSec: 0,
      playTime: '00:00:00',
      duration: '00:00:00',
    });
    setAudioPath('');
    setAudioName('');
  }

  //Function to request storage permissions
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
  
  //Function to get cache access
  const getCacheDirectory = () => {
    if (Platform.OS === 'ios') {
      return `${RNFS.LibraryDirectoryPath}/Caches`;
    } else {
      return RNFS.CachesDirectoryPath;
    }
  };
  
  //Function to start recording
  const startRecording = async () => {
    try {
      await requestStoragePermission(); 
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

  //Function to stop recording
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

  //Function to play recorded audio

  // const onStartPlay = async () => {
  //   try {
  //     console.log('onStartPlay');
  //     const msg = await audioRecorderPlayer.startPlayer(`file:////${audioPath}`); 
  //     console.log('Playback message:', msg);
  //     audioRecorderPlayer.setVolume(1.0);
  //     audioRecorderPlayer.addPlayBackListener((e) => {
  //       if (e.current_position === e.duration) {
  //         console.log('finished');
  //         audioRecorderPlayer.stopPlayer();
  //       }
  //       setAudio((prevAudio) => ({
  //         ...prevAudio,
  //         currentPositionSec: e.current_position,
  //         currentDurationSec: e.duration,
  //         playTime: audioRecorderPlayer.mmssss(Math.floor(e.current_position)),
  //         duration: audioRecorderPlayer.mmssss(Math.floor(e.duration)),
  //       }));
  //     });
  //   } catch (error) {
  //     console.error('Error starting playback:', error);
  //   }
  // };


  //Function to upload recording to server
  
  const uploadRecording = () => {
    fetch(audioPostUrl, {
      method: 'POST',
      body: createFormData(audioPath, audioName),
      headers: { authtoken: 'allow' },
    })
    .then(response => response.json())
      .then(response => {
        console.log('response', response);
        if (response.status === 'Success') {
          setModalVisible(true);
          resetValues();
        }else{
          showToast(uploadFailureMessage,'warning');
        }
      })
      .catch(error => {
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
          <Text style={styles.title}>{recordingHeading}</Text>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText} onPress={startRecording}>
             {startRecordingText}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText} onPress={stopRecording}>
              {stopRecordingText}
            </Text>
          </TouchableOpacity>
          {audioPath !== '' && (
        <TouchableOpacity style={styles.button} onPress={uploadRecording}>
          <Text style={styles.buttonText}>{uploadRecordingText}</Text>
        </TouchableOpacity>
      )}
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText} onPress={() =>
            {
            resetValues();
            navigation.navigate('AudioFromDevice');
            }}>
             {deviceBtnText}
            </Text>
          </TouchableOpacity>
    </View>
  );
}  

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
  backIconContainer:{
    position:'absolute',
    top:5,
    left:5
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