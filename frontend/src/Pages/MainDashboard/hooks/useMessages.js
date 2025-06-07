import { useState, useCallback } from "react";

export default function useMessages(token, currentUserId) {
  const [messages, setMessages] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);

  const fetchMessages = useCallback(async (friend, isPaginated = false) => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/communications/conversation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          userId: currentUserId,
          friendId: friend,
          page: isPaginated ? page + 1 : 1,
          pageSize: 12,
        }),
      });

      const conversation = await response.json();

      const processedMessages = conversation.data.messages.map((msg) => ({
        ...msg,
        type: msg.senderId === currentUserId ? "sent" : "received",
      }));

      setMessages((prev) => isPaginated ? [...processedMessages, ...prev] : processedMessages);
      setHasMore(conversation.data.hasMore);

      if (isPaginated) {
        setPage((p) => p + 1);
      } else {
        setPage(1);
      }
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  }, [page, token, currentUserId]);

  return { messages, setMessages, hasMore, page, fetchMessages };
}