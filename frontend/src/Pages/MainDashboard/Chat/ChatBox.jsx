import { useRef, useEffect } from "react";
import "./ChatBox.css"; 

// Message list + scroll handling
export default function ChatBox({ messages, onScroll }) {
    const messagesRef = useRef(null);

    useEffect(() => {
        if (messagesRef.current) {
            messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
        }
    }, [messages]);

    const getStatusIcon = (status) => {
        switch (status) {
            case "sent":
                return <span className="tick sent">✔</span>
            case "delivered":
                return <span className="tick delivered">✔✔</span>;
            case "read":
                return <span className="tick read">✔✔</span>;
            default:
                return null;
        }
    };

    return (
    <div className="messages" ref={messagesRef} onScroll={onScroll}>
      {messages.map((msg, idx) => (
        <div
          key={idx}
          className={`message-bubble ${msg.type === "sent" ? "sent-message" : "received-message"}`}
        >
            <div className="message-content">
                <strong>{msg.senderUsername}</strong>:<br />{msg.message}
            </div>
            {msg.type === "sent" && (
                <div className="status">{ getStatusIcon(msg.status) }</div>
            )}
        </div>
      ))}
    </div>
  );
}