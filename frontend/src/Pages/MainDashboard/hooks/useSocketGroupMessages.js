import { useEffect } from "react";

export default function useSocketGroupMessages(socket, currentUserId, setRoomMessages) {
  useEffect(() => {
    if (!socket) return;

    const handleIncoming = (msg) => {
        setRoomMessages(prev => {
            const prevMsgs = prev[msg.groupId] || [];

            if (prevMsgs.some(m => m._id === msg._id)) return prev;

            return {
            ...prev,
            [msg.groupId]: [
                ...prevMsgs,
                { 
                ...msg,
                type: msg.senderId === currentUserId ? "sent" : "received",
                senderUsername: msg.senderUsername || msg.senderId
                }
            ]
            };
        });
        };

        socket.on("receiveGroupMessage", handleIncoming);
        return () => {
        socket.off("receiveGroupMessage", handleIncoming);
        };

  }, [socket, currentUserId, setRoomMessages]);
}