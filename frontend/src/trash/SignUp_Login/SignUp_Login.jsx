import { useState } from "react";
// import UserLogin from "../../Pages/Login/Login";
// import RegisterNewUser from "../../Pages/SignUp/SignUp";

export default function SignUp_Login() {
    const [active, setActive] = useState(false)
    return (
        <>
            <button onClick={() => setActive(true)} type="button">Sign Up</button>
            <button onClick={() => setActive(false)} type="button">Login</button> <br />
            <>
                {active && <RegisterNewUser /> }
            </>
            <>
                {!active && <UserLogin /> }
            </>
        </>
    )
}