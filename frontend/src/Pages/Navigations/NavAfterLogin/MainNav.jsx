
import { Link } from "react-router-dom";

export default function MainNav() {
    return (
        <nav>
            <Link to="/mainDashboard">MainDasboard</Link>
            {/* <Link to="/dashboard">Dasboard</Link> */}
            <Link to="/logout">Logout</Link>
        </nav>
    );
};