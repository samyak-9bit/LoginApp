import { Toast } from "react-native-toast-notifications";

export const showToast = (message:string) => {
  Toast.show(message);
};

// export const showToast = (message: string) => {
//  console.log(message);
// };
