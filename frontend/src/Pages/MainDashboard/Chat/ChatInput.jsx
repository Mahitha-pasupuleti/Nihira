
export default function ChatInput({ messageInput, setMessageInput, onSend }) {
    return (
    <div className="chat-input">
        <input
            type="text"
            placeholder="Write Your Message"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
        />
        <button onClick={onSend}>Send</button>
    </div>
    )
}