import { Toast } from "react-native-toast-notifications";

export const showToast = (message:string,type:string='success') => {
  Toast.show(message,{type:type});
};
