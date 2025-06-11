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
            console.log("Entered Delivered Emit")
            const msg = await Message.findByIdAndUpdate(messageId, { status: 'delivered' }, { new: true });

            if (!msg) {
                console.warn(`⚠️ Message with ID ${messageId} not found`);
                return;
            }

            console.log(`✅ Message ${messageId} marked as delivered`);

            // notify the sender
            const senderSocketId = onlineUsers.get(msg.senderId.toString());
            if (senderSocketId) {
                io.to(senderSocketId).emit("messageDelivered", {
                    _id: msg._id.toString(),
                    status: "delivered",
                });
            }
            console.log("Leaving Delivered Emit")
        } catch (err) {
            console.error("❌ Failed to update message as delivered:", err);
        }
    });

    socket.on("messageRead", async (messageId) => {
        try {
            console.log("Entered Read Emit")
            const msg = await Message.findByIdAndUpdate(messageId, { status: 'read' }, { new: true });

            if (!msg) {
                console.warn(`⚠️ Message with ID ${messageId} not found`);
                return;
            }

            console.log(`✅ Message ${messageId} marked as read`);

            // notify the sender
            const senderSocketId = onlineUsers.get(msg.senderId.toString());
            if (senderSocketId) {
                io.to(senderSocketId).emit("messageRead", {
                    _id: msg._id.toString(),
                    status: "read",
                });
            }
            console.log("Leaving Read Emit")
        } catch (err) {
            console.error("❌ Failed to update message as delivered:", err);
        }
    });


    socket.on("messageReadUponChatOpen", async ({ userId, friendId }) => {
        try {
            console.log("Entered ReadAllMessages Emit")
            const converseId = [userId, friendId].sort().join(':');
            console.log("userId : " + userId + " friendId : " + friendId + " converseId : " + converseId);

            // Find all delivered messages for this conversation that were received by the user
            const deliveredMessages = await Message.find({
                conversationId: converseId,
                recipientId: userId,
                status: 'delivered'
            });

            const deliveredToRead = await Message.updateMany(
                {
                    conversationId: converseId,
                    recipientId: userId, // only mark messages that were *received* by the user
                    status: 'delivered'
                },
                { $set: { status: 'read' } }
            );

            console.log(`✅ ${deliveredToRead.modifiedCount} messages marked as read for conversation ${converseId}`);

            // Notify original senders about read status
            for (const msg of deliveredMessages) {
                const senderSocketId = onlineUsers.get(msg.senderId.toString());
                if (senderSocketId) {
                    io.to(senderSocketId).emit("messageRead", {
                        _id: msg._id.toString(),
                        status: "read"
                    });
                }
            }

            console.log("Leaving ReadAllMessages Emit")

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


