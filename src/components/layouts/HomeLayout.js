import { Outlet } from "react-router-dom";
import AppNavBar from "../navbar/AppNavBar";

export default function HomeLayout() {
    return(<div>
        <AppNavBar />
        <Outlet />
    </div>)
}