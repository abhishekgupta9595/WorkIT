import ItemListAdmin from "../../components/adminPage/itemListAdmin";
import OrderListAdmin from "../../components/adminPage/ordersListAdmin";

import "./admin.css";

const Admin = ()=>{
    return(
        <div className="admin_panel">
            <ItemListAdmin/>
            <OrderListAdmin/>
        </div>
    )
}

export default Admin;