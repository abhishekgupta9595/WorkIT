/* eslint-disable react/prop-types */
import { collection, doc, getDoc, getDocs, orderBy, query } from "firebase/firestore";
import "./orderListAdmin.css";
import { CgDetailsMore } from "react-icons/cg";
import { MdCancel } from "react-icons/md";
import { database } from "../../database/firebaseConfig";
import { useContext, useEffect, useState } from "react";
import { LoaderContext } from "../../context/loaderContext";
import LoadingIcons from 'react-loading-icons';


const dateFormatter =(dateTime)=>{
    const fDateTime = new Date(dateTime);
    const hours = fDateTime.getHours().toString().padStart(2, '0');
    const minutes = fDateTime.getMinutes().toString().padStart(2, '0');
    const day = fDateTime.getDate().toString().padStart(2, '0');
    const month = (fDateTime.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-indexed
    const year = fDateTime.getFullYear();

    const formattedDate = `${hours}:${minutes} ${day}/${month}/${year}`;

    return formattedDate;
}


const Order =(props)=>{

    const data = props.order.data();
    const [userData,setUserData] = useState(null);


    useEffect(()=>{
        if(data){
            getUserData();
        }
    },[])

    const getUserData = async ()=>{
        const docRef = doc(database,"users",data.userId);
        const docSnap = await getDoc(docRef);
        if(docSnap.data()){
            setUserData(docSnap.data());
            console.log("got userData....",docSnap.data())
        }else{
            setUserData(null);
        } 
        
    }


    return(
        <div className="order">
            <div className="info">
                <h1>Id: {props.order.id}</h1>
                <h2>by: {userData? userData.name:"Loading..."}</h2>
            </div>
            <div className="time_and_control">
                <h1>{dateFormatter(data.orderTime)}</h1>
                <CgDetailsMore className="details_icon"
                onClick={()=>{
                    props.methods.setPreviewOrder({order:props.order,user:userData});
                    props.methods.setShowOrderPreview(true);
                }}/>
            </div>
        </div>
    )

    
}

const OrderPreviewItem =(props)=>{

    console.log("ref...:",props.item);
    const [orderItem,setOrderItem] = useState(null);

    useEffect(()=>{
        getOrderItem();
    },[props.item])

    const getOrderItem = async ()=>{
        const docSnap = await getDoc(props.item);
        console.log("OrderItem doc",docSnap)
        setOrderItem(docSnap);
    }

    console.log("orderItem: ",orderItem);

    if(orderItem){
        return(
            <div className="order_preview_item">
                <img src={orderItem?.data().iconUrl} alt="icon" />
                <p>{orderItem?.data().name}</p>
            </div>
        )
    }
    else{
        return(
            <div className="order_preview_item">
                <LoadingIcons.ThreeDots fill='#1159A8' speed={0.75}/>
            </div>
        )
    }
    
}

const OrderPreview =(props)=>{


    console.log("props order",props.orderData.order);


    if(props.orderData){
        return(
            <div className="order_preview">
                <div className="cancel_btn">
                    <MdCancel onClick={()=> {
                        props.methods.setShowOrderPreview(false)
                        }} className="btn"/>
                </div>
                <h1>Order Details</h1>
                <div className="order_details">
                    <div className="details_content">
                        <h1>Order Id: {props.orderData?.order?.id}</h1>
                        <h2>By: {props.orderData?.user?.name}</h2>
                        <h3>Time: {dateFormatter(props.orderData?.order?.data().orderTime)}</h3>
                        <h3>Status: {props.orderData?.order?.data().status}</h3>
                    </div>

                    <div className="order_items_section">
                        <h1>Items: <span>({props.orderData?.order?.data().items.length})</span></h1>
                        <div className="order_items">
                            {
                                props.orderData.order.data().items.map((e)=>{
                                    return(
                                        <OrderPreviewItem item={e.ref} key={e.ref}/>
                                    )
                                })
                            }
                        </div>
                    </div>
                    
                    
                </div>
            </div>
        )
    }
    
}

const OrderListAdmin =()=>{

    const mrLoader = useContext(LoaderContext);
    const [orders,setOrders] = useState(null);
    const [showOrderPreview,setShowOrderPreview] = useState(false);
    const [previewOrder,setPreviewOrder] =useState(null);

    useEffect(()=>{
        if(!orders){
            mrLoader.setIsLoading(true);
            getOrders().then(()=>mrLoader.setIsLoading(false));
        }
        
    },[])

    const getOrders= async ()=>{
        const docRef = collection(database,"orders");

        const docSnap = await getDocs(query(docRef,orderBy("orderTime","desc")));
        console.log("got the orders...",docSnap.docs);
        setOrders(docSnap.docs);
    }

    console.log("preview",previewOrder);

    if(orders){
        return(
            <div className="order_list">
                {
                    showOrderPreview? <OrderPreview orderData={previewOrder} methods={{showOrderPreview,setShowOrderPreview}}/> : <div className="empty"></div>
                }
                
                <div className="header">
                    <h1>Orders: {orders.length}</h1>
                </div>
                <div className="body">
                    {
                        orders.map((e)=>{
                            return(
                                <Order key={e.id} order={e} methods={{showOrderPreview,setShowOrderPreview,previewOrder,setPreviewOrder}}/>
                            )
                        })
                    }
                </div>

            </div>
        )
    }

    
}

export default OrderListAdmin;