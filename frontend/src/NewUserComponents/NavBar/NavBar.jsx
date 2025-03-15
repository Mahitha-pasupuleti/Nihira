import { NavLink } from "react-router-dom"
import "./Navbar.css";

export default function NavBar() {

    return (
        <nav className="navbar">
            <ul className="nav-list">
                <li>
                    <NavLink to="/" className="nav-link">HomePage</NavLink>
                </li>
                <li>
                    <NavLink to="/SignUp_Login" className="nav-link">SignUp/Login</NavLink>
                </li>
            </ul>
        </nav>
    )
}