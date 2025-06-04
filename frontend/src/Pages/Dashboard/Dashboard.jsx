
// import sendingMessage from "./sendingMessage";
// import DisplayMessages from "./DisplayMessages";

import { useEffect, useRef, useState } from "react";
import { useContext } from "react";
import SocketContext from "../../Contexts/Socket/SocketContext";
import Cookies from "universal-cookie"; 
import MainNav from "../Navigations/NavAfterLogin/MainNav";
import "./Dashboard.css";

// get AccessToken from UserLogin
// implement sending and recieving messages from server
// send request to socket.io to connect
export default function MainDashboard() {

    const [messageInput, setMessageInput] = useState("");
    const [messages, setMessages] = useState([]);
    const [friend, setFriend] = useState("");

    const socket = useContext(SocketContext);
    const cookies = new Cookies();
    const token = cookies.get("Authorization");

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
    }, [socket]);


    const sendProps = () => {
        const outgoingMessage = {
            "senderId": cookies.get("objectId"),
            "recipientId": friend,
            "message": messageInput
        }
        socket.emit("sendMessage", outgoingMessage);
       
        setMessages( (prev) => [...prev, { ...outgoingMessage, type: "sent" } ] )
        
        setMessageInput("");
    }

    return (
        <>
        <MainNav />
        <div className="App">
            <div className="typeMessage">
                <input type="text" placeholder="Write Your Message" value={messageInput} onChange={(e)=>setMessageInput(e.target.value)} />
                <br />
                <label for="chooseFriend">Choose a friend:</label>
                <select id="chooseFriend" name="chooseFriend" value={friend} onChange={(e)=>setFriend(e.target.value)} >
                    <option value="">Select a friend</option>
                    <option value="683f38d078a15614164b9578">A</option>
                    <option value="683f3c4a78a15614164b9588">B</option>
                    <option value="683f7b107b43023d464f9fee">C</option>
                    <option value="683f7b257b43023d464f9ff9">D</option>
                    <option value="683f7b3b7b43023d464fa004">E</option>
                    <option value="683f7b557b43023d464fa00f">F</option>
                </select>
                <br />
                <button onClick={ sendProps }>Send</button>
            </div>

            <hr />

            <div className="messages">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={msg.type === "sent" ? "sent-message" : "received-message"}>
                        <strong>{msg.senderId}</strong>: {msg.message}
                    </div>
                ))}
            </div>

        </div>
        </>
    )

}