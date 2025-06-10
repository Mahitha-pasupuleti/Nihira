// Socket receive/send logic

import { useEffect } from "react";

export default function useSocketMessages(friend, socket, setMessages) {
    useEffect(() => {
            if (!socket) {
                console.warn("Socket not ready yet.");
                return;
            }
    
            const handleIncomingMessage = (incomingMessage) => {
                console.log("Received message:", incomingMessage); // Confirm message received
                setMessages((prev) => [...prev, { ...incomingMessage, type: "received" }]);

                // Emit delivery acknowledgement after receiving message
                socket.emit("messageDelivered", incomingMessage._id)

                // If the friend sent the messages is the one we are chatting with, mark message as read
                console.log(friend + " : " + incomingMessage.senderId)
                if ( friend == incomingMessage.senderId ) {
                    socket.emit("messageRead", { userId: incomingMessage.recipientId, friendId: incomingMessage.senderId });
                }
            };
    
            socket.on("receiveMessage", handleIncomingMessage);
            console.log("Listener added for receiveMessage");
    
            return () => {
                socket.off("receiveMessage", handleIncomingMessage);
                console.log("Listener removed for receiveMessage");
            };
    }, [friend, socket, setMessages]);
}