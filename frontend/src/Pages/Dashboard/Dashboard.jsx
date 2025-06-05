
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
    const [hasMore, setHasMore] = useState(false);
    const [page, setPage] = useState(1);

    const socket = useContext(SocketContext);
    const cookies = new Cookies();
    const token = cookies.get("Authorization");
    const messagesRef = useRef(null);
    const currentUserId = cookies.get("objectId");


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


    useEffect(() => {
        if (!friend) {
            console.warn("Friend is not yet selected");
            return;
        }

        const fetchMessages = async () => {
            try {
                const response = await fetch("http://localhost:8000/api/v1/communications/conversation", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: token
                    },
                    body: JSON.stringify({
                        userId: currentUserId,
                        friendId: friend,
                        page: 1,
                        pageSize: 25
                    })
                })

                const conversation = await response.json();
                const processedMessages = conversation.data.messages.map(msg => ({
                    ...msg,
                    type: msg.senderId === currentUserId ? "sent" : "received"
                }))
                setMessages( processedMessages );
                setHasMore( conversation.data.hasMore )
                setPage(1);

            } catch (error) {
                console.error("Error loading messages:", error);
            }
        }

        fetchMessages();
    }, [friend])


    // useEffect(() => {
    //     if (messagesRef.current) {
    //         messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    //     }
    // }, [messages]);

    
    useEffect(() => {
        if (!messagesRef.current) return;

        const { scrollTop, scrollHeight, clientHeight } = messagesRef.current;
        const isNearBottom = scrollHeight - scrollTop - clientHeight < 50; // threshold

        if (isNearBottom) {
            messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
        }
    }, [messages]);


    const handleScroll = async () => {
        if ( !hasMore || !friend || !messagesRef.current ) return;

        if ( messagesRef.current.scrollTop === 0 ) {
            try {
                const nextPage = page + 1;
                const response = await fetch("http://localhost:8000/api/v1/communications/conversation", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: token,
                    },
                    body: JSON.stringify({
                        userId: currentUserId,
                        friendId: friend,
                        page: nextPage,
                        pageSize: 25
                    })
                })

                const conversation = await response.json();
                const processedMessages = conversation.data.messages.map(msg => ({
                    ...msg,
                    type: msg.senderId === currentUserId ? "sent" : "received"
                }))

                setMessages(prev => [...processedMessages, ...prev]);
                setHasMore( conversation.data.hasMore )
                setPage(nextPage)

            } catch (error) {
                console.error("Error loading more messages:", error);
            }
        }
    }


    const sendProps = () => {
        if ( !friend ) return;
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
                <label htmlFor="chooseFriend">Choose a friend:</label>
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

            <div className="messages" ref={messagesRef} onScroll={handleScroll}>
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