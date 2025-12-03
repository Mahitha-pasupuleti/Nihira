import { useState } from "react";
import Navbar from "../Navigations/NavBeforeLogin/Navbar";
import "./SignUp.css";

export default function RegisterNewUser() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");

    const addNewUserToDB = async (event) => {
        event.preventDefault();
        const data = {
            "username" : username,
            "password" : password
        }
    
        try {
            const response = await fetch('http://localhost:8000/api/v1/communications/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            if ( response.status == 201 ) {
                setMessage("User registration successful!")
            } else if ( response.status == 409 ) {
                setMessage("User already exists!")
            } else {
                setMessage("An error occurred. Please try again")
            }
        } catch( error ) {
            console.log(error)
        }
    };

    return (
        <>
            <Navbar />
            <div className="signup-page">
                <h1 className="signup-title">Sign Up</h1>
                <p className="signup-subtitle">Sign up today</p>
                <form className="signup-form" onSubmit={addNewUserToDB}>
                    <input 
                        type="text" 
                        name="username" 
                        id="username" 
                        placeholder="Enter username" 
                        className="signup-input"
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input 
                        type="password" 
                        name="password" 
                        id="password" 
                        placeholder="Enter password" 
                        className="signup-input"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <input 
                        type="password" 
                        name="confirmPassword" 
                        id="confirmPassword" 
                        placeholder="Confirm password" 
                        className="signup-input"
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <button type="submit" className="signup-button">Sign Up</button>
                </form>

                {message && <p className="signup-message">{message}</p>}
            </div>
        </>
    )
}




// import { useState } from "react";
// import Navbar from "../Navigations/NavBeforeLogin/Navbar";

// export default function RegisterNewUser() {

//     const [username, setUsername] = useState("");
//     const [password, setPassword] = useState("");
//     const [confirmPassword, setConfirmPassword] = useState("");
//     const [message, setMessage] = useState("");

//     const addNewUserToDB = async (event) => {
//         event.preventDefault();
//         const data = {
//             "username" : username,
//             "password" : password
//         }
    
//         try {
//             const response = await fetch('http://localhost:8000/api/v1/communications/register', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(data)
//             });
//             // const responseData = await response.json();
//             // console.log("Response Object: ", response.status);

//             if ( response.status == 201 ) {
//                 setMessage("User registration successful!")
//             } else if ( response.status == 409 ) {
//                 setMessage("User already exists!")
//             } else {
//                 setMessage("An error occurred. Please try again")
//             }
//         } catch( error ) {
//             console.log(error)
//         }
//     };

//     return (
//         <>
//             <div>
//                 <Navbar />
//                 <h1>Sign Up</h1>
//                 <p>Sign up today</p>
//                 <form onSubmit={addNewUserToDB}>
//                 {/* <button type="button">Sign Up</button>
//                 <button type="button">Login</button> <br /> */}
//                     <input type="text" name="username" id="username" placeholder="Enter username" onChange={(e) => setUsername(e.target.value)}/> <br />
//                     <input type="password" name="password" id="password" placeholder="Enter password" onChange={(e) => setPassword(e.target.value)}/> <br />
//                     <input type="password" name="confirmPassword" id="confirmPassword" placeholder="Confirm password" onChange={(e) => setConfirmPassword(e.target.value)}/> <br />
//                     <button type="submit">Sign Up</button>
//                 </form>

//                 <p>{message}</p>
//             </div>
//         </>
//     )
// }