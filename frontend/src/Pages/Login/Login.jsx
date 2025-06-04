import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import Cookies from "universal-cookie";
import { Navigate, useNavigate } from "react-router-dom";
import Navbar from "../Navigations/NavBeforeLogin/Navbar";

export default function Login() {

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const loginExistingUser = async (event) => {
        event.preventDefault()

        const cookies = new Cookies();

        const data = {
            "username" : username,
            "password" : password
        }
        
        try {
            const response = await fetch('http://localhost:8000/api/v1/communications/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            const responseData = await response.json();
            // console.log("objectId: ", responseData.data.user._id);
            // console.log("AccessToken: ", responseData.data.accessToken);

            const AuthToken = responseData.data.accessToken;
            const objectId = responseData.data.user._id;
            const decode = jwtDecode(responseData.data.accessToken);
            console.log(decode);
            // console.log(response.status);

            if ( response.status == 200 ) {
                setMessage("User logged in successfully!!")
                cookies.set("Authorization", AuthToken);
                cookies.set("objectId", objectId);
                cookies.set("isAuthenticated", true);

                // clear username and password
                setUsername("")
                setPassword("")

                console.log("Waiting 5 seconds before navigating to dashboard...");
                
                // setTimeout(() => {
                //     console.log("Navigating to dashboard...");
                //     navigate("/dashboard");
                // }, 5000)

                window.location.href = "/dashboard";

            } else if ( response.status == 404 ) {
                setMessage("User does not exists!")
            } else {
                setMessage("An error occurred. Please try again")
            }

        } catch(error) {
            console.log("error")
        }
    };

    return (
        <>
            <div>
                <Navbar />
                <h1>Login</h1>
                <p>Login to continue chatting</p>
                <form onSubmit={loginExistingUser}>
                    {/* <button type="button">Sign Up</button>
                    <button type="button">Login</button> */}
                    <input type="text" name="username" id="username" placeholder="Enter username" onChange={(e) => setUsername(e.target.value)}/> <br />
                    <input type="password" name="password" id="password" placeholder="Enter password" onChange={(e) => setPassword(e.target.value)}/> <br />
                    <button type="submit" onClick={loginExistingUser}>Login</button>
                </form>

                <p>{message}</p>
            </div>
        </>
    )
}