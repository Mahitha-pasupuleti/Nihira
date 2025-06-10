import { useRef, useEffect } from "react";

// Message list + scroll handling
export default function ChatBox({ messages, onScroll }) {
    const messagesRef = useRef(null);

    useEffect(() => {
        if (messagesRef.current) {
            messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
        }
    }, [messages]);

    return (
    <div className="messages" ref={messagesRef} onScroll={onScroll}>
      {messages.map((msg, idx) => (
        <div
          key={idx}
          className={`message-bubble ${msg.type === "sent" ? "sent-message" : "received-message"}`}
        >
          <strong>{msg.senderUsername}</strong>:<br />{msg.message}
        </div>
      ))}
    </div>
  );
}