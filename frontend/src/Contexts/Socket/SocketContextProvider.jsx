import React, { useEffect, useRef, useState } from "react";
import SocketContext from "./SocketContext";
import { io } from "socket.io-client";
import Cookies from "universal-cookie"; 
import { useMemo } from "react";

const SocketContextProvider = ({ children }) => {

    const socketRef = useRef(null);
    const [socket, setSocket] = useState(null);
    const cookies = new Cookies();

    useEffect(() => {
        const token = cookies.get("Authorization");
        const userId = cookies.get("objectId");
        
        if ( !token || !userId ) return; // Wait until the cookie exists

        socketRef.current = io("http://localhost:8000", {
            extraHeaders: {
                "authorization": "Bearer " + token
            }
        })

        const currentSocket = socketRef.current;

        currentSocket.on("connect", () => {
            currentSocket.emit("register", userId);
        })
        
        setSocket(socketRef.current);

        return () => {
            socketRef.current.disconnect();
        }
    }, [cookies.get("Authorization")]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    )

}

export default SocketContextProvider;