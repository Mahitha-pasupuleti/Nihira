
import SearchFriends from "../SearchFriends/SearchFriends";
import "./Sidebar.css";

export default function Sidebar({ friend, setFriend }) {
    return (
        <div>
            <SearchFriends friend={friend} setFriend={setFriend}  />
            {/* RecentConversations component here */}
        </div>
    );
}