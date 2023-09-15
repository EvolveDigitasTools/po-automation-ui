import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "./useLocalStorage"
import { createContext, useContext, useMemo } from "react";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userToken, setUserToken] = useLocalStorage("login-token", null);
    const navigate = useNavigate();

    const login = async (data) => {
        setUserToken(data);
    };

    const logout = () => {
        setUserToken(null);
        navigate("/", { replace: true });
    };

    const value = useMemo(
        () => ({
            userToken,
            login,
            logout
        }),
        [userToken]
    );
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
};

export const useAuth = () => {
    return useContext(AuthContext);
}