
import { useEffect, useRef, useState } from "react";
import { useContext } from "react";
import SocketContext from "../../Contexts/Socket/SocketContext";
import Cookies from "universal-cookie"; 
import MainNav from "../Navigations/NavAfterLogin/MainNav";

// get AccessToken from UserLogin
// implement sending and recieving messages from server
// send request to socket.io to connect
export default function ChatFooter() {

    const [message, setMessage] = useState("");
    const socket = useContext(SocketContext);
    const cookies = new Cookies();
    const token = cookies.get("Authorization");

    useEffect(() => {
        console.log("I am loaded! hehehe");
    }, []);

    const sendProps = () => {
        socket.emit("sendMessage", {
            "senderId": cookies.get("objectId"),
            "recipientId": "67bd293d4ebc2b9e33a69687",
            "message": message
        });
        setMessage("");
    }

    return (
        <>
        <MainNav />
        <div className="App">
            <div className="typeMessage">
                <input type="text" placeholder="Write Your Message" value={message} onChange={(e)=>setMessage(e.target.value)} />
                <button onClick={ sendProps }>Send</button>
            </div>
        </div>
        </>
    )

}