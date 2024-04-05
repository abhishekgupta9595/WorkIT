import "./itemPreview.css";
import closeIcon from "../../assets/icons/closeIcon.svg"
import addButton from "../../assets/icons/add_button.svg"
import { Link, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { database } from "../../database/firebaseConfig";
import { getDoc, doc, collection, where, query, getDocs } from "firebase/firestore";

import image from "./tempImages/loginSystem.jpg";
import icon from "./tempImages/loginIcon.svg";
import { LoaderContext } from "../../context/loaderContext";
import { UserContext } from "../../context/userContext";
import { addToCart, removeFromCart } from "../cart/cartMethods";

const ItemPreview = () => {

    const userInstance = useContext(UserContext);
    const mrLoader = useContext(LoaderContext);
    const [load,setLoad] = useState(false);
    const id = useParams();
    const [item,setItem] = useState(null);
    const [isInCart,setIsInCart] = useState(false);

    useEffect(()=>{
        if(userInstance.user){
            mrLoader.setIsLoading(true);
            getItem(id.productId).then((d)=>{
                checkIfInCart(d.id)
                .then(()=>{
                    mrLoader.setIsLoading(false)
                });
            });
            
            
        }

    },[userInstance.user,isInCart,load])

    const getItem = async (id)=> {
        const docRef = doc(database,"features",id);
        const docSnap = await getDoc(docRef);

        if(!docSnap.data()){
            alert("something went wrong..");
            document.location.href="/shop";
        }
        setItem(docSnap);
        return docSnap;

    }

    const checkIfInCart = async(id)=>{
        const docRef = collection(database,"carts",userInstance.user.uid,"items");
        const q = query(docRef,where("featureId","==",id));
        const docSnap = await getDocs(q);
        if(docSnap.docs.length>0){
            setIsInCart(true);
            console.log("in cart")
        }else{
            setIsInCart(false);
            console.log("not In cart")
        }
    } 

    

    console.log(id);
    console.log("item...",item);
    if(item){
        return (
                <div className="item_preview">
                    <div className="header">
                        <Link to={"/shop"}>
                            <img src={closeIcon} alt="close" onClick={()=>window.close()}/>
                        </Link>
                    </div>
                    <div className="item_section">
                        <div className="image_preview">
                            {/* this section has to be designed separately as a gallery */}
                            <img src={item.data().imgUrl? item.data().imgUrl : image} alt="" />
                        </div>

                        <div className="partition"></div>

                        <div className="details">
                            {/* this section has to be designed separately with a chronological detail section */}
                            <div className="detail_heading">
                                <img src={item.data().iconUrl? item.data().iconUrl: icon} alt="" />
                                <span>{item.data().name}</span>
                            </div>
                            <div className="detail_content">
                                {item.data().description}
                            </div>
                        </div>
                    </div>
                    <div className="interaction_section">
                        {
                            !isInCart? 
                            <button className="add_btn" onClick={()=> {
                                addToCart(item,userInstance.user.uid);
                                setLoad(!load);
                            }}><img src={addButton} alt="" />Add to cart</button>
                            :
                            <button className="remove_btn" onClick={()=> {
                                removeFromCart(item.id,userInstance.user.uid);
                                setLoad(!load);
                            }}><img src={closeIcon} alt="" />Remove from cart</button>
                        }
                        
                        
                    </div>
                </div>
        )
    }
    
}

export default ItemPreview;