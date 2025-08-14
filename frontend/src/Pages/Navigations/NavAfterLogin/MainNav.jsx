
import { Link } from "react-router-dom";
import "../Navbar.css";

export default function MainNav() {
    return (
        <nav>
            <Link to="/mainDashboard">MainDasboard </Link>
            <Link to="/groupChat">GroupChatDasboard </Link>
            {/* <Link to="/dashboard">Dasboard</Link> */}
            <Link to="/logout">Logout</Link>
        </nav>
    );
};