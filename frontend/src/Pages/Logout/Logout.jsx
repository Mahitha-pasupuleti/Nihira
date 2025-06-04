import { useState } from "react";
import Cookies from "universal-cookie";

export default function Logout() {
    const [message, setMessage] = useState("");
    const cookies = new Cookies();

    const handleLogout = async (e) => {
        e.preventDefault();

        try {
            const authToken = "Bearer " + cookies.get("Authorization");
            // console.log("authToken " + authToken);

            const response = await fetch('http://localhost:8000/api/v1/communications/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': authToken,
                },
            }); 
            console.log(response);

            if ( response.status == 200 ) {

                cookies.remove("Authorization");
                cookies.remove("isAuthenticated");
                cookies.remove("objectId");

                setMessage("Logged out successfully");
            } else if ( response.status == 404 ) {
                setMessage("Unable to logout!")
            } else {
                setMessage("An error occurred. Please try again")
            }

        } catch (error) {
            console.log("error")
        }
    } 
    return (
        <div>
            <button onClick={handleLogout}>Click to Logout</button>
            <p>{message}</p>
        </div>
    )
}