import { Outlet, Navigate } from "react-router-dom";
import Cookies from "universal-cookie";

export default function PublicRoutes() {
    const cookies = new Cookies();
    const auth = cookies.get("isAuthenticated");
    console.log("auth " + auth);
    return auth ? <Navigate to="/mainDashboard" /> : <Outlet />;
}
