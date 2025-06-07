
export default function ChatHeader({ friend, setFriend }) {
    return (
        <div className="chat-header">
            <label htmlFor="chooseFriend">Choose a friend:</label>
            <select id="chooseFriend" value={friend} onChange={(e) => setFriend(e.target.value)}>
                <option value="">Select a friend</option>
                <option value="683f38d078a15614164b9578">A</option>
                <option value="683f3c4a78a15614164b9588">B</option>
                <option value="683f7b107b43023d464f9fee">C</option>
                <option value="683f7b257b43023d464f9ff9">D</option>
                <option value="683f7b3b7b43023d464fa004">E</option>
                <option value="683f7b557b43023d464fa00f">F</option>
            </select>
        </div>
    )
}