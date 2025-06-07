import { useEffect, useState } from "react"
import useDebounce from "../hooks/useDebounce";
import Cookies from "universal-cookie";
import { getFriends } from "./getFriends";

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
        <>
            <div>
                <input 
                    type="text" 
                    placeholder="Search a friend..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <button onClick={clearSearch}>X</button>
            </div>

            <div>
                {friendResults.length === 0 && debouncedName && <p>No users found.</p>}
                {friendResults.map((friend) => (
                <div 
                    key={friend._id}
                    onClick={() => {
                        setFriend(friend._id); // Start conversation
                        clearSearch();         // Optional: reset search input + results
                    }}
                    style={{ cursor: "pointer", padding: "6px", borderBottom: "1px solid #ccc" }}
                >
                    {friend.username}
                </div>
                ))}
            </div>
        </>
    )
}