import mongoose from "mongoose";

const groupMessageSchema = new mongoose.Schema({
  groupId: { type: String, ref: "Group", required: true },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  senderUsername: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const GroupMessage = mongoose.model('GroupMessage', groupMessageSchema);
export default GroupMessage;