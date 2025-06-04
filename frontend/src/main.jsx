import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.jsx"
import { BrowserRouter as Router } from "react-router-dom";
import SocketContextProvider from "./Contexts/Socket/SocketContextProvider.jsx";
import Cookies from "universal-cookie"

const cookies = new Cookies();
const isAuthenticated = cookies.get("isAuthenticated");

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <Router>
            <SocketContextProvider>
                <App />
            </SocketContextProvider>
        </Router>
    </React.StrictMode>,
);