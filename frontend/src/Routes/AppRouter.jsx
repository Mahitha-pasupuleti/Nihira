import { Route, Routes, Navigate } from "react-router-dom";
import SignUp from "../Pages/SignUp/SignUp"
import Login from '../Pages/Login/Login';
import ProtectedRoutes from "./ProtectedRoutes";
import PublicRoutes from "./PublicRoutes";
import MainDashboard from "../Pages/Dashboard/Dashboard";
import Logout from "../Pages/Logout/Logout";

export default function AppRouter() {
    return (
        <>
            <Routes>
                <Route path="/" element={<Navigate to="/signup" />} />
                <Route element={<PublicRoutes />}>
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/login" element={<Login />} />
                </Route>
                <Route element={<ProtectedRoutes />} >
                    <Route path="/logout" element={<Logout />} />
                    <Route path="/dashboard" element={<MainDashboard />} />
                </Route>
            </Routes>
        </>
    )
}