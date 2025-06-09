
import { useEffect, useContext } from "react";
import SearchFriends from "../SearchFriends/SearchFriends";
import SocketContext from "../../../Contexts/Socket/SocketContext.js";
import "./Sidebar.css";
import Cookies from "universal-cookie";

export default function Sidebar({ friend, setFriend }) {
    // const socket = useContext(SocketContext);
    // const cookies = new Cookies();
    // const userId = cookies.get("objectId");

    // useEffect(() => {
    //     if (!socket || !friend) return;

    //     try {
    //         console.log( userId + ":" + friend )
    //         socket.emit("messageRead", { userId, friend });
    //     } catch (error) {
    //         console.error("❌ Error emitting messageRead:", error);
    //     }

    //     // Cleanup function (optional here, since we're not adding a listener)
    //     return () => {
    //         // Nothing to clean up unless you had socket.on() listeners
    //     };
    // }, [friend, socket]);

    return (
        <div>
            <SearchFriends friend={friend} setFriend={setFriend}  />
            {/* RecentConversations component here */}
        </div>
    );
}