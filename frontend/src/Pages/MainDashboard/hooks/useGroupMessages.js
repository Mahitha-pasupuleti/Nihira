import { useState, useCallback, useEffect } from "react";

export default function useGroupMessages(token, currentUserId, socket) {
  const [roomMessages, setRoomMessages] = useState({}); // { roomId: [messages] }
  const [hasMore, setHasMore] = useState({}); // { roomId: boolean }
  const [page, setPage] = useState({}); // { roomId: number }

  // Fetch messages from backend (pagination)
  const fetchRoomMessages = useCallback(
    async (roomId, isPaginated = false) => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/v1/communications/groupConversation`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
            body: JSON.stringify({
              groupId: roomId,
              page: isPaginated ? (page[roomId] || 1) + 1 : 1,
              pageSize: 20,
            }),
          }
        );

        const result = await response.json();
        const data = result.data;

        if (!data || !Array.isArray(data.messages)) return;

        const processedMessages = [...data.messages]
        .reverse()
        .map((msg) => ({
            ...msg,
            type: msg.senderId === currentUserId ? "sent" : "received",
            senderUsername: msg.senderUsername || msg.senderId // fallback if name missing
        }));


        setRoomMessages((prev) => ({
          ...prev,
          [roomId]: isPaginated
            ? [...processedMessages, ...(prev[roomId] || [])] // older messages at top
            : processedMessages, // initial load: oldest first, newest last
        }));

        setHasMore((prev) => ({
          ...prev,
          [roomId]: data.hasMore || false,
        }));

        setPage((prev) => ({
          ...prev,
          [roomId]: isPaginated ? (prev[roomId] || 1) + 1 : 1,
        }));
      } catch (err) {
        console.error("Error fetching group messages:", err);
      }
    },
    [token, currentUserId, page]
  );

  // Listen for incoming socket messages
  useEffect(() => {
    if (!socket) return;

    const handleIncoming = (msg) => {
      setRoomMessages((prev) => {
        const prevMsgs = prev[msg.groupId] || [];

        if (prevMsgs.some((m) => m._id === msg._id)) return prev;

        // Append new messages at the bottom
        return {
          ...prev,
          [msg.groupId]: [...prevMsgs, { ...msg, type: msg.senderId === currentUserId ? "sent" : "received" }],
        };
      });
    };

    socket.on("receiveGroupMessage", handleIncoming);

    return () => {
      socket.off("receiveGroupMessage", handleIncoming);
    };
  }, [socket, currentUserId]);

  return { roomMessages, setRoomMessages, fetchRoomMessages, hasMore, page };
}