import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  conversationId: {
    type: String,
    required: true
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // Reference to the User model
    required: true
  },
  recipientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // Reference to the User model
    required: true
  },
  message: {
    type: String,
    required: true,
    maxlength: 500
  },
  status: {
    type: String,
    enum: ['sent', 'delivered', 'read'],
    default: 'sent'
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// messageSchema.pre("save", function (next) {
//   if (!this.conversationId) {
//     this.conversationId = [String(this.senderId), String(this.recipientId)].sort().join(':');
//     console.log("conversationId:", this.conversationId);
//   }
//   next();
// });

const Message = mongoose.model('Message', messageSchema);
export default Message;