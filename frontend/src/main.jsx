import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.jsx"

import SignUp_Login from "./NewUserComponents/SignUp_Login/SignUp_Login.jsx";
import MainDashboard from "./NewUserComponents/Dashboard/Dashboard.jsx";
import HomePage from "./NewUserComponents/HomePage/HomePage.jsx";

import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
    RouterProvider,
} from "react-router-dom";
import SocketContextProvider from "./Contexts/Socket/SocketContextProvider.jsx";

export const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<App />} >
            <Route index element={<HomePage />} />
            <Route path="SignUp_Login" element={<SignUp_Login />}/>
            <Route path="Dashboard" element={<MainDashboard />}/>
        </Route>
    )
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <SocketContextProvider>
            <RouterProvider router={router} />
        </SocketContextProvider>
    </React.StrictMode>,
);