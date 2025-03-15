import Cookies from "universal-cookie"; 
import SocketContext from "../../Contexts/Socket/SocketContext";
import { useContext } from "react";

export default function sendingMessage({ message, setMessage }) {
    const cookies = new Cookies();
    const socket = useContext(SocketContext);

    console.log(cookies.get("Authorization"));

    // send authorization to server
    socket.emit("sendMessage", {
        "senderId": cookies.get("objectId"),
        "recipientId": "67bd293d4ebc2b9e33a69687",
        "message": message
    });

    setMessage("");

    return (
        <></>
    )
}