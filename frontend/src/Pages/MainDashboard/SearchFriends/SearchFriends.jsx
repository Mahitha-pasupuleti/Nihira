import { useEffect, useState } from "react"
import useDebounce from "../hooks/useDebounce";
import Cookies from "universal-cookie";
import { getFriends } from "./getFriends";
import "./SearchFriends.css";

export default function SearchFriends({ friend, setFriend }) {
    const [name, setName] = useState("");
    const [friendResults, setFriendResults] = useState([]);
    const debouncedName = useDebounce(name, 300)

    const cookies = new Cookies();
    const token = cookies.get("Authorization");

    useEffect(() => {
        if ( !debouncedName.trim() ) {
            setFriendResults([]);
            return;
        }

        const fetchFriends = async () => {
            const results = await getFriends(debouncedName, token);
            setFriendResults(results);
        }

        fetchFriends();
    }, [debouncedName, token]);

    const clearSearch = () => {
        setName("");
        setFriendResults([]);
    }

    return (
    <div className="search-friends-container">
      <div className="search-friends-input-wrapper">
        <input 
          type="text" 
          placeholder="Search a friend..."
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button onClick={clearSearch}>X</button>
      </div>

      <div className="search-friends-results">
        {friendResults.length === 0 && debouncedName && <p>No users found.</p>}
        {friendResults.map((friend) => (
          <div 
            key={friend._id}
            onClick={() => {
              setFriend(friend._id);
              clearSearch();
            }}
          >
            {friend.username}
          </div>
        ))}
      </div>
    </div>
  );
}