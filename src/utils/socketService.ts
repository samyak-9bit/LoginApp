// @ts-nocheck
import { Platform } from "react-native";
import { io } from "socket.io-client";

const SOCKET_URL = Platform.OS==='android'?'http://10.0.2.2:5000':'http://localhost:5000';

class WSSErvice{

    initializeSocket = async ()=> {
        try{

            this.socket = io(SOCKET_URL,{
                transports:["websocket"]
            })
            console.log("Initializing Socket",this.socket);

            this.socket.on("connect",(data)=>{
                console.log("=== Socket Connected ===");
            })

            this.socket.on("disconnect",(data)=>{
                console.log("=== Socket Disconnected ===");
            })

            this.socket.on("error",(data)=>{
                console.log("=== Socket Error ===",data);
            })

            // this.socket.on("newUser",(data)=>{
            //     console.log(data);
            // })
        }catch(error){
            console.log("Socket not initialized", error)
        }
    }
}

const socketService = new WSSErvice();

export default socketService;