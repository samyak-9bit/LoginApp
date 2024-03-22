/* eslint-disable prettier/prettier */
import Toast from 'react-native-toast-message';

export const showToast = (message: string) => {
  Toast.show({
    type: 'error',
    text1: message,
  });
};
