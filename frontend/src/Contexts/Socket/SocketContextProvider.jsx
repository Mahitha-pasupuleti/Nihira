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
        socketRef.current = io("http://localhost:8000", {
            extraHeaders: {
                "authorization": "Bearer " + cookies.get("Authorization")
            }
        })
        
        setSocket(socketRef.current);

        return () => {
            socketRef.current.disconnect();
        }
    }, [])

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    )

}

export default SocketContextProvider;