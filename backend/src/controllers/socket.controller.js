import Message from "../models/message.model.js";

const onlineUsers = new Map();

export const handleSocketEvents = async (socket, io) => {

    socket.on("register", async (userId) => {
        onlineUsers.set(userId, socket.id);
        socket.userId = userId;

        const undelivered = await Message.updateMany(
            { recipientId: userId, status: 'sent' },
            { $set: { status: 'delivered' } }
        )

        console.log(`✅ ${userId} registered with socket ${socket.id}`);
        console.log(`✅ ${undelivered.modifiedCount} messages auto-delivered to ${userId}`);
    })

    // Handles message delivery status update (DELIVERED)
    socket.on("messageDelivered", async (messageId) => {
        try {
            await Message.findByIdAndUpdate(messageId, { status: 'delivered' });
            console.log(`✅ Message ${messageId} marked as delivered`);
        } catch (err) {
            console.error("❌ Failed to update message as delivered:", err);
        }
    });


    socket.on("messageRead", async ({ userId, friendId }) => {
        try {
            const converseId = [userId, friendId].sort().join(':');
            console.log("userId : " + userId + " friendId : " + friendId + " converseId : " + converseId);
            const deliveredToRead = await Message.updateMany(
                {
                    conversationId: converseId,
                    recipientId: userId, // only mark messages that were *received* by the user
                    status: 'delivered'
                },
                { $set: { status: 'read' } }
            );
            console.log(`✅ ${deliveredToRead.modifiedCount} messages marked as read for conversation ${converseId}`);
        } catch (err) {
            console.error("❌ Failed to update messages as read:", err);
        }
    });


    socket.on("sendMessage", async (data) => { 
        console.log("Hi, I am inside HandleSockets")
        try {
            const newMessage = new Message({
                conversationId: [ data.senderId.toString(), data.recipientId.toString() ].sort().join(':'),
                senderId: data.senderId,
                recipientId: data.recipientId,
                message: data.message,
                timestamp: new Date()
            });

            console.log(newMessage);

            console.log("Saving message...");
            await newMessage.save();
            console.log("Message saved.");

            // commented so every chat message is not saved, uncomment to save chat messages

            const recipientSocketId = onlineUsers.get(data.recipientId);
            console.log(recipientSocketId)
            console.log(data.recipientId)

            // socket is sending a new message to recipient on the event "recieveMessage" if he is online
            if ( recipientSocketId ) {
                io.to(recipientSocketId).emit("receiveMessage", newMessage);
            }

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


