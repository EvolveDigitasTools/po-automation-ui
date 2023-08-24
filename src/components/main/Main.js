import { useNavigate } from "react-router-dom";

export default function Main() {
    const navigate = useNavigate();

    function vendorRegistration() {
        navigate('/vendor-registration');
    }

    function addSKUs() {
        navigate('/new-skus');
    }

    function addBuyingOrder() {
        navigate('/new-buying-order');
    }

    return (<div>
        <button onClick={vendorRegistration}>Vendor Registration</button>
        <button onClick={addSKUs}>Add SKUs</button>
        <button onClick={addBuyingOrder}>Add Buying Order</button>
    </div>)
}