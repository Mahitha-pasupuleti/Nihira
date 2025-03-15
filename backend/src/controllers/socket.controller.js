import Message from "../models/message.model.js";

export const handleSocketEvents = (socket, io) => {

    socket.on("sendMessage", async (data) => { 
        console.log("Hi, I am inside HandleSockets")
        try {
            const newMessage = new Message({
                senderId: data.senderId,
                recipientId: data.recipientId,
                message: data.message,
                timestamp: new Date()
            });
            console.log(newMessage);
            // await newMessage.save();

            // socket is sending a new message to recipient on the event "recieveMessage"
            io.emit("receiveMessage", newMessage);

            // socket emits to itself an event?
            socket.emit("messageSent", {
                success: true,
                message: "Message sent successfully"
            });
        } catch (error) {
            console.error("Error saving message:", error);
            socket.emit("messageSent", {
                success: false,
                error: "Failed to send message"
            });
        }
    })

}


