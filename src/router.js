import {
    Route,
    createBrowserRouter,
    createRoutesFromElements,
    defer,
} from "react-router-dom";
import Main from "./components/main/Main";
import AddSKUs from "./components/main/addSKUs/AddSKUs";
import AddBuyingOrder from "./components/main/addBuyingOrder/AddBuyingOrder";
import HomeLayout from "./components/layouts/HomeLayout";
import { AuthLayer } from "./components/auth/AuthLayer";
import AuthLayout from "./components/auth/AuthLayout";
import Login from "./components/Login/Login";
import VerifySKUs from "./components/main/verifySKUs/verifySKUs";
import ReviewPO from "./components/main/reviewPO/ReviewPO";
import PORecords from "./components/main/poRecords/poRecords";
import Success from "./components/validate/Success";
import Reconcillation from "./components/main/reconcillation/reconcillation";
import VendorPage from "./components/main/vendorPage/VendorPage";

const getUserData = () =>
    new Promise((resolve) =>
        setTimeout(() => {
            const user = window.localStorage.getItem("login-token");
            resolve(user);
        }, 1000)
    );

export const router = createBrowserRouter(
    createRoutesFromElements(
        <>
            <Route element={<HomeLayout />}>
                <Route path="/" element={<VendorPage />} />
                <Route path="/success" element={<Success />} />
                <Route
                    path="/review-vendor/:validateToken"
                    element={<VendorPage />}
                />
                <Route
                    path="/update-vendor/:validateToken"
                    element={<VendorPage />}
                />
                <Route
                    path="/review-skus/:validateToken"
                    element={<VerifySKUs />}
                />
                <Route
                    path="/review-po/:validateToken"
                    element={<ReviewPO />}
                />
                <Route
                    path="/admin"
                    element={<AuthLayer />}
                    loader={() => defer({ userPromise: getUserData() })}
                >
                    <Route element={<AuthLayout />}>
                        <Route path="login" element={<Login />} />
                        <Route path="" element={<Main />} />
                        <Route
                            path="vendor-registration"
                            element={<VendorPage />}
                        />
                        <Route path="po-records" element={<PORecords />} />
                        <Route path="po-records/:poCode" element={<Reconcillation />} />
                        <Route
                            path="new-skus/:vendorCode"
                            element={<AddSKUs />}
                        />
                        <Route
                            path="new-buying-order/:vendorCode"
                            element={<AddBuyingOrder />}
                        />
                        <Route
                            path="vendor/:vendorCode"
                            element={<VendorPage />}
                        />
                    </Route>
                </Route>
            </Route>
        </>
    )
);
