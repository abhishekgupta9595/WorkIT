import IMG from "../../assets/images/TWJ1.png";
import "./cart.css";
import { MdCancel } from "react-icons/md"; //cross
import { createOrder, removeFromCart } from "./cartMethods";
import { collection, getDoc, getDocs } from "firebase/firestore";
import { database } from "../../database/firebaseConfig";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/userContext";
import { IoMdRemoveCircle } from "react-icons/io";
import { LoaderContext } from "../../context/loaderContext";
import { Link } from "react-router-dom";

function Cart() {

  const mrLoader = useContext(LoaderContext);
  const userInstance = useContext(UserContext);
  const [load,setLoad] = useState(true);
  const [items,setItems] = useState(null);

  useEffect(()=>{
    mrLoader.setIsLoading(true);
    if(userInstance.user){
      getCartData().then(async d=>{
        getFeature(d).then(e=>{
          setItems(e);
        }).then(()=> setTimeout(() => {
          mrLoader.setIsLoading(false);
        }, 0));
      });
    }
    
  },[userInstance.user,load]);

  const getCartData = async ()=>{
    const docRef = collection(database,"carts",userInstance.user.uid,"items");

    const docSnap = await getDocs(docRef);

    if(docSnap.docs.length>0){
      console.log("got the cart data:",docSnap.docs);
      return docSnap.docs;
    }else{
      console.log("problem getting the cart data...")
      return null;
    }
  }

  const getFeature = async (cartItems) => {
    if (cartItems) {
      let tempArr = [];
      await Promise.all(cartItems.map(async d => {
        const docSnap = await getDoc(d.data().ref);
        console.log("feature: ", docSnap.data());
        tempArr.push(docSnap);
      }));
      return tempArr;
    }
  }

  console.log("items",items)



  if(userInstance.user){
    if(items){
      return (
        <>
          <div className="main-container">
            <div className="main">

              <div className="cross">
                <MdCancel onClick={()=>window.location.href="/shop"} className="cross_icon"/>
              </div>

              <div className="content">
                <div className="left">
                  <h1>Cart</h1>
        
                  <div className="list-head">
                    <h2>{items.length} Features added:</h2>
        
                    <div className="list">
                      {
                        items.map(d =>{
                          console.log("id d",d.id);
                          return(
                            <div className="item" key={d.id} >
                              <span>
                                <Link to={d.data()? `/product/${d.id}`: ()=>alert("this item does not exists anymore")} target={d.data()?"blank":"_parent" }>
                                  {d.data()? d.data().name:"! Feature Deleted"}
                                </Link>
                              </span>
                              <span>
                                <IoMdRemoveCircle className="remove_icon" onClick={()=>{
                                  removeFromCart(d.id,userInstance.user.uid);
                                  setLoad(!load);
                                  }}/>
                              </span>
                            </div>
                          )
                        })
                      }
                    </div>
                  </div>
                </div> 
                    
                <div className="right">
                  <div className="imges">
                    <img src={IMG} alt="" />
                  </div>
                  <br />
                  <br />
                    
                  <div className="checkout" onClick={()=>{
                    mrLoader.setIsLoading(true);
                    createOrder(userInstance.user.uid).then(()=>mrLoader.setIsLoading(false));
                    }}>Build the app</div>
                </div>
              </div>
              
            </div>
          </div>
        </>
      );
    }
    else{
      if(!mrLoader.isLoading){
        return(
          <div className="empty_cart_warning">
            <div className="close_btn">
            <MdCancel onClick={()=>window.location.href="/shop"} className="cross_icon"/>
            </div>
            <h1>Cart seems empty</h1>
          </div>
        )
      }
      
    }
  }
  else{
    return(
      <h1>Loading</h1>
    )
  }
}

export default Cart;
