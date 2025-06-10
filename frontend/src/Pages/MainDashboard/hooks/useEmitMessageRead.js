
import { useEffect } from "react";
import SearchFriends from "../SearchFriends/SearchFriends";

export default function useEmitMessageRead({ friend, socket, userId }) {
        if (!socket || !friend || !userId) return;

        try {
            console.log(`📩 Emitting messageRead: ${userId} -> ${friend}`);
            socket.emit("messageRead", { userId, friendId: friend });
        } catch (error) {
            console.error("❌ Error emitting messageRead:", error);
        }

        // Cleanup function (optional here, since we're not adding a listener)
        return () => {
            // Nothing to clean up unless you had socket.on() listeners
        };
}