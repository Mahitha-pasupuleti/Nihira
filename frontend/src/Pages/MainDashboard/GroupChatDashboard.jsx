import React, { useState, useEffect, useContext } from "react";
import SocketContext from "../../Contexts/Socket/SocketContext";
import Cookies from "universal-cookie";
import useSocketGroupMessages from "./hooks/useSocketGroupMessages";
import { fetchUsername } from "./hooks/useFetchUsername";

import ChatBox from "./Chat/ChatBox";
import ChatInput from "./Chat/ChatInput";
import MainNav from "../Navigations/NavAfterLogin/MainNav";
import useGroupMessages from "./hooks/useGroupMessages";
import "./GroupChatDashboard.css";

// Default public rooms
const defaultRooms = [
  { _id: "room_general", name: "General" },
  { _id: "room_tech_talk", name: "Tech Talk" },
  { _id: "room_random", name: "Random" },
  { _id: "room_project_chat", name: "Project Chat" },
  { _id: "room_announcements", name: "Announcements" }
];

export default function GroupChatDashboard() {
  const socket = useContext(SocketContext);
  const cookies = new Cookies();
  const token = cookies.get("Authorization");
  const currentUserId = cookies.get("objectId");
  
  const [currentUsername, setCurrentUsername] = useState("");

    useEffect(() => {
    fetchUsername(currentUserId)
        .then(username => setCurrentUsername(username))
        .catch(err => console.error(err));
    }, [currentUserId]);

  console.log(currentUsername);

  const [selectedRoomId, setSelectedRoomId] = useState(defaultRooms[0]._id);
  const [messageInput, setMessageInput] = useState("");

  const { roomMessages, setRoomMessages, fetchRoomMessages } = useGroupMessages(token, currentUserId, socket);

  // Setup group socket listener once
  useSocketGroupMessages(socket, currentUserId, setRoomMessages);

  // Join / leave room & fetch messages
    useEffect(() => {
        if (!socket || !selectedRoomId) return;

        socket.emit("joinGroup", { groupId: selectedRoomId, userId: currentUserId });
        fetchRoomMessages(selectedRoomId); // fetch only once per room

        return () => {
            socket.emit("leaveGroup", { groupId: selectedRoomId, userId: currentUserId });
        };
    }, [selectedRoomId, socket]);


  const onSend = () => {
    if (!selectedRoomId || !messageInput.trim()) return;

    const outgoingMessage = {
      groupId: selectedRoomId,
      senderId: currentUserId,
      senderUsername: currentUsername,
      message: messageInput,
      timestamp: new Date()
    };

    // Emit to backend
    socket.emit("sendGroupMessage", outgoingMessage);

    // Append locally for immediate feedback
    // setRoomMessages((prev) => {
    //   const prevMsgs = prev[selectedRoomId] || [];
    //   return {
    //     ...prev,
    //     [selectedRoomId]: [...prevMsgs, outgoingMessage]
    //   };
    // });

    setMessageInput("");
  };

  return (
    <>
      <MainNav />
      <div className="group-chat-container">
        {/* Room list */}
        <div className="room-sidebar">
          <h3>Public Rooms</h3>
          {defaultRooms.map((room) => (
            <div
              key={room._id}
              className={`room-item ${selectedRoomId === room._id ? "active" : ""}`}
              onClick={() => setSelectedRoomId(room._id)}
            >
              # {room.name}
            </div>
          ))}
        </div>

        {/* Chat area */}
        <div className="chat-area">
          <div className="chat-header">
            <h2>
              {selectedRoomId
                ? defaultRooms.find((r) => r._id === selectedRoomId)?.name
                : "Select a Room"}
            </h2>
          </div>

          <ChatBox messages={roomMessages[selectedRoomId] || []} />
          <ChatInput
            messageInput={messageInput}
            setMessageInput={setMessageInput}
            onSend={onSend}
          />
        </div>
      </div>
    </>
  );
}