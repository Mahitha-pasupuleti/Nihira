// Socket receive/send logic

import { useEffect } from "react";
import { fetchUsername } from "./useFetchUsername";

export default function useSocketMessages(friend, socket, setMessages) {
    const friendUsername = fetchUsername(friend);

    useEffect(() => {
            if (!socket) {
                console.warn("Socket not ready yet.");
                return;
            }
    
            const handleIncomingMessage = (incomingMessage) => {
                console.log("Received message:", incomingMessage); // Confirm message received
                if ( friend == incomingMessage.senderId ) {
                    setMessages((prev) => [...prev, { ...incomingMessage, type: "received", senderUsername: friendUsername  }]);
                }

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