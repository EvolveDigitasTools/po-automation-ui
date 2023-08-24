import { Route, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import Main from "./components/main/Main";
import VendorRegistration from "./components/main/vendorRegistration/VendorRegistration";
import AddSKUs from "./components/main/addSKUs/AddSKUs";
import AddBuyingOrder from "./components/main/addBuyingOrder/AddBuyingOrder";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route>
        <Route path="/" element={<Main />} />
        <Route path="/vendor-registration" element={<VendorRegistration />} />
        <Route path="/new-skus" element={<AddSKUs />} />
        <Route path="/new-buying-order" element={<AddBuyingOrder />} />
      </Route>
    </>
  )
)