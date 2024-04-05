/* eslint-disable react/prop-types */
import "./itemCard.css";
import image from "./tempImages/loginSystem.jpg";
import icon from "./tempImages/loginIcon.svg";
import { Link } from "react-router-dom";
import { addToCart, removeFromCart } from "../cart/cartMethods";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/userContext";
import { collection, getDocs, query, where } from "firebase/firestore";
import { database } from "../../database/firebaseConfig";
import { LoaderContext } from "../../context/loaderContext";


const ItemCard = (props) => {
    const userInstance = useContext(UserContext);
    const mrLoader = useContext(LoaderContext);
    const [isInCart,setIsInCart] = useState(false);
    const [load,setLoad] = useState(true);
    const data = props.item.data();
    console.log("props",props.item);

    useEffect(()=>{
        if(userInstance.user){
            mrLoader.setIsLoading(true);
            checkIfInCart().then(()=>{
                mrLoader.setIsLoading(false);
            });
            
            mrLoader.setNavLoad(!mrLoader.navLoad);
        }
    },[isInCart,load]);



    const checkIfInCart = async()=>{
        const docRef = collection(database,"carts",userInstance.user.uid,"items");
        const q = query(docRef,where("featureId","==",props.item.id));
        const docSnap = await getDocs(q);
        if(docSnap.docs.length>0){
            setIsInCart(true);
            console.log("incart")
        }else{
            setIsInCart(false);
            console.log("notIn cart")
        }
    } 
 
    return (
        <div className="item_card">
            <div className="image"> 
                <img src={data.imgUrl!=""? data.imgUrl : image} alt="image" />
                {/* image to imported from database */}
            </div>
            <div className="item_name">
                <img src={ data.iconUrl ? data.iconUrl :icon } alt="icon" />
                <span>{data.name? data.name: "Unknown"}</span>
                {/* icon and name to be imported from the database */}
            </div>
            <div className="details">
                <span>
                    {data.description.slice(0,150)}{data.description.length>150 ? "...":""}
                </span>

            </div>
            <div className="interactions">
                <button className="view_btn"> <Link to={`/product/${props.item.id}`} target="_blank">View details</Link> </button>
                {
                    isInCart? <button className="add_btn" id="rem_btn_item-card" onClick={()=>{
                        removeFromCart(props.item.id,userInstance.user.uid);
                        setLoad(!load);
                    }}>Remove</button> : <button className="add_btn" onClick={()=>{
                        addToCart(props.item,userInstance.user.uid);
                        setLoad(!load);
                    }}>Add to app</button>
                }
            </div>
        </div>
    )
}

export default ItemCard; 