// @ts-nocheck
import { io } from "socket.io-client";

const SOCKET_URL = 'http://localhost:5000';

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
        }catch(error){
            console.log("Socket not initialized", error)
        }
    }
}

const socketService = new WSSErvice();

export default socketService;