import React, { useState, useEffect, createContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export const UserContext = createContext();
const allowedPaths = ["/user/signin", "/user/signup"];

const UserProvider = (props) => {
    const [user, setUser] = useState();
    const location = useLocation();

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        setUser({token, ...userInfo});

        if (!token && !allowedPaths.includes(location.pathname)) {
            navigate("/user/signin");
        }
        if(token && allowedPaths.includes(location.pathname)){
            navigate("/")
        }
    }, [navigate]);

    return (
        <>
            <UserContext.Provider
                value={{
                    user
                }}
            >
                {props.children}
            </UserContext.Provider>
        </>
    );
};

export default UserProvider;
