import { Toast } from "react-native-toast-notifications";

//Function to show toast
export const showToast = (message:string,type:string='success') => {
  Toast.show(message,{type:type});
};
