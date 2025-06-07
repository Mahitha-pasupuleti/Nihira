// Socket receive/send logic

import { useEffect } from "react";

export default function useSocketMessages(socket, setMessages) {
    useEffect(() => {
            if (!socket) {
                console.warn("Socket not ready yet.");
                return;
            }
    
            const handleIncomingMessage = (incomingMessage) => {
                console.log("Received message:", incomingMessage); // Confirm message received
                setMessages((prev) => [...prev, { ...incomingMessage, type: "received" }]);
            };
    
            socket.on("receiveMessage", handleIncomingMessage);
            console.log("Listener added for receiveMessage");
    
            return () => {
                socket.off("receiveMessage", handleIncomingMessage);
                console.log("Listener removed for receiveMessage");
            };
    }, [socket, setMessages]);
}