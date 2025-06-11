// Socket receive/send logic

import { useEffect } from "react";
import { fetchUsername } from "./useFetchUsername";

export default function useSocketMessages(currentUserId, friend, socket, setMessages) {
    const friendUsername = fetchUsername(friend);

    useEffect(() => {
            if (!socket) {
                console.warn("Socket not ready yet.");
                return;
            }

            console.log("ReadAllMessages emitted - start")
            socket.emit("messageReadUponChatOpen", { userId: currentUserId, friendId: friend })
            console.log("ReadAllMessages emitted - stop")
    
            const handleIncomingMessage = (incomingMessage) => {
                // Emit delivery acknowledgement after receiving message
                console.log("Friend selected now: " + friend)
                console.log("Delivered emitted - start")
                socket.emit("messageDelivered", incomingMessage._id)
                console.log("Delivered emitted - stop")

                // console.log("Received message:", incomingMessage); // Confirm message received
                if ( friend == incomingMessage.senderId ) {
                    console.log("Friend selected now: " + friend)
                    console.log("Read emitted - start")
                    socket.emit("messageRead", incomingMessage._id);
                    console.log("Read emitted - stop")
                    setMessages((prev) => [...prev, { ...incomingMessage, type: "received", senderUsername: friendUsername }]);
                }
            };

            // ✅ Message has been marked as delivered (ACK from server)
            const handleMessageDeliveredAck = ({ messageId }) => {
                setMessages((prev) =>
                    prev.map((msg) =>
                        msg._id === messageId ? { ...msg, status: "delivered" } : msg
                    )
                );
            };

            // ✅ Message(s) have been marked as read (ACK from server)
            const handleMessagesRead = ({ messageId }) => {
                setMessages((prev) =>
                    prev.map((msg) =>
                        msg._id === messageId ? { ...msg, status: "read" } : msg
                    )
                );
            };

            const handleMessageReadUponChatOpen = ({ messageIds }) => {
                if (!Array.isArray(messageIds)) return;

                setMessages(prev =>
                    prev.map(msg =>
                        messageIds.includes(msg._id)
                            ? { ...msg, status: "read" }
                            : msg
                    )
                );
            };
    
            socket.on("receiveMessage", handleIncomingMessage);
            socket.on("messageDeliveredAck", handleMessageDeliveredAck);
            socket.on("messagesRead", handleMessagesRead);
            socket.on("messageReadUponChatOpen", handleMessageReadUponChatOpen);
            console.log("🧲 Socket listeners added");
    
            // 🧹 Cleanup on unmount
            return () => {
                socket.off("receiveMessage", handleIncomingMessage);
                socket.off("messageDeliveredAck", handleMessageDeliveredAck);
                socket.off("messagesRead", handleMessagesRead);
                socket.off("messageReadUponChatOpen", handleMessageReadUponChatOpen);
                console.log("🚿 Socket listeners removed");
            };
    }, [friend, socket, setMessages]);
}