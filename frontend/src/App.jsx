import React from "react";
import RegisterNewUser from "./NewUserComponents/UserRegistration/Registration"
import UserLogin from "./NewUserComponents/UserLogin/Login";
import SignUp_Login from "./NewUserComponents/SignUp_Login/SignUp_Login";
import { NavLink } from "react-router-dom"
import { Outlet } from "react-router-dom";
import NavBar from "./NewUserComponents/NavBar/NavBar";

function App() {
    return (
        <>
         <NavBar />
         <h1>Welcome to Modern Chat Application</h1>
         <Outlet />
        </>
    )
}

export default App