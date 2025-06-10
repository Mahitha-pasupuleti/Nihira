import { useContext, useEffect, useState } from "react";
import Cookies from "universal-cookie";
import SocketContext from "../../Contexts/Socket/SocketContext";
import MainNav from "../Navigations/NavAfterLogin/MainNav";

import ChatHeader from "./Chat/ChatHeader";
import ChatBox from "./Chat/ChatBox";
import ChatInput from "./Chat/ChatInput";
import useMessages from "./hooks/useMessages";
import useSocketMessages from "./hooks/useSocketMessages";
import useEmitMessageRead from "./hooks/useEmitMessageRead";

import "./MainDashboard.css";
import SearchFriends from "./SearchFriends/SearchFriends";
import Sidebar from "./Sidebar.jsx/Sidebar";
import { fetchUsername } from "./hooks/useFetchUsername";

export default function MainDashboard() {
    const socket = useContext(SocketContext);

    const cookies = new Cookies();
    const token = cookies.get("Authorization");
    const currentUserId = cookies.get("objectId");
    const currentUsername = fetchUsername(currentUserId);

    const [friend, setFriend] = useState(currentUserId);
    const [messageInput, setMessageInput] = useState("");

    const {messages, setMessages, hasMore, page, fetchMessages} = useMessages(token, currentUserId);

    useSocketMessages(friend, socket, setMessages);

    useEffect(() => {
        if ( friend ) {
            fetchMessages( friend, false );
        }
    }, [friend])

    useEffect(() => {
        if ( !friend || !socket ) return;
        useEmitMessageRead({ friend, socket, userId: currentUserId });
    }, [friend, socket])

    const onSend = () => {
        if ( !friend ) return;
        const outgoingMessage = {
            "senderId": currentUserId,
            "recipientId": friend,
            "message": messageInput
        }
        socket.emit("sendMessage", outgoingMessage);
        setMessages( (prev) => [...prev, { ...outgoingMessage, type: "sent", senderUsername: currentUsername } ] )
        setMessageInput("");
    }

    const handleScroll = (event) => {
        console.log("Scrolling")
        const { scrollTop } = event.target;
        if (scrollTop < 10 && hasMore) {
            console.log("Loading more messages brooooo!")
            fetchMessages(friend, true);
        }
    };

    return (
    <>
        <MainNav />
        <div className="chat-container">
        <Sidebar friend={friend} setFriend={setFriend} />
        {/* <ChatHeader friend={friend} setFriend={setFriend} /> */}
        <ChatBox messages={messages} onScroll={handleScroll} />
        <ChatInput
            messageInput={messageInput}
            setMessageInput={setMessageInput}
            onSend={onSend}
        />
        </div>
    </>
    );

}