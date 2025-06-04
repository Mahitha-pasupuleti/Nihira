// onlineUsers.js

export const onlineUsers = new Map(); // userId -> socketId

export const addUser = (userId, socketId) => {
  onlineUsers.set(userId, socketId);
};

export const removeUserBySocketId = (socketId) => {
  for (const [userId, sId] of onlineUsers.entries()) {
    if (sId === socketId) {
      onlineUsers.delete(userId);
      break;
    }
  }
};

export const getSocketId = (userId) => {
  return onlineUsers.get(userId);
};

export const getUserIdBySocketId = (socketId) => {
  for (const [userId, sId] of onlineUsers.entries()) {
    if (sId === socketId) return userId;
  }
  return null;
};

export const listOnlineUsers = () => {
  return Array.from(onlineUsers.entries());
};