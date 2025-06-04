import { useEffect, useState } from "react";

// get messages from socket, listen on "receiveMessage" event and display them on div
function DisplayMessages(socket) {

    // console.log(socket)

    // const [messages, setMessages] = useState([]);

    // // socket.on listener only gets created once, more listerners wont be created
    // // each time this page re-renders. Only once the listener is created during page
    // // mount and listener removes once apge unmounts
    // useEffect( () => {
    //     const messageHandler = (data) => {
    //         // React updater function
    //         setMessages( (prevMessages) => [...prevMessages, data.message] );
    //     };

    //     socket.on("receiveMessage", messageHandler);

    //     return () => {
    //         socket.off("receiveMessage", messageHandler);
    //     };
    // }, [socket]);

    return (
        <div className="displayMessages">
            {/* { messages.map((msg, index) => (
                <p key={index}>{msg}</p>
            ))} */}
        </div>
    )
}

export default DisplayMessages;