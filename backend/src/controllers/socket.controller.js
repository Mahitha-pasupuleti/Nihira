import Message from "../models/message.model.js";

const onlineUsers = new Map();

export const handleSocketEvents = (socket, io) => {

    socket.on("register", (userId) => {
        onlineUsers.set(userId, socket.id);
        socket.userId = userId;
        console.log(`✅ ${userId} registered with socket ${socket.id}`);
    })

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
            await newMessage.save(); // commented so every chat message is not saved, uncomment to save chat messages

            const recipientSocketId = onlineUsers.get(data.recipientId);
            console.log(recipientSocketId)
            console.log(data.recipientId)

            // socket is sending a new message to recipient on the event "recieveMessage" if he is online
            // if ( recipientSocketId ) {
                io.to(recipientSocketId).emit("receiveMessage", newMessage);
            // }

            // socket emits to itself only (socket.emit emits tot the sender only), while ( io.emit sends to reciever(.to) or broadcasts)
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


