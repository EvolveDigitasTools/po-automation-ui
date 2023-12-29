import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { useEffect } from "react";

export default function AuthLayout() {
    const { userToken } = useAuth();
    const navigate = useNavigate()

    useEffect(() => {
        if (!userToken)
            navigate('/admin/login')
    }, [userToken])



    return (
        <div>
            <Outlet />
        </div>
    )
}