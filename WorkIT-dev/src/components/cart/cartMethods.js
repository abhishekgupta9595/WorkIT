import {getDocs,collection,setDoc,doc, deleteDoc} from "firebase/firestore"
import { database } from "../../database/firebaseConfig"

// takes procucts querysnapshot and then use it to add the products data to the cart
export const addToCart = async(productSnap,userId)=>{
    console.log(productSnap.id,userId)
    console.log("adding to cart started...");
    try{
        const docRef = doc(database,"carts",userId,"items",productSnap.id);
        await setDoc(docRef,{
            featureId :productSnap.id,
            ref : productSnap.ref,
            quantity : 1,
            time : Date.now()
        }).then(()=>{
            console.log("added to cart successfully...");
        })
    }catch(err){
        console.log("failed to add to cart",err);
    }
    
}

// take product id to delete the perticulat product
export const removeFromCart = async(productId,userId)=>{
    console.log("cartMethods: removeFromCart: remove started")
    const docRef = doc(database,"carts",userId,"items",productId);

    try{
        await deleteDoc(docRef).then(()=>{
            console.log("cartMethods: removeFromCart: removed successfully");
        });
    }catch(err){
        console.log("error removing item from cart...",err);
    }
}

export const createOrder = async(userId)=>{
    const cartSnap = await getDocs(collection(database,"carts",userId,"items"));
    console.log(cartSnap.docs);
    console.log(cartSnap.docs.length);
    if(cartSnap.docs.length > 0){
        let cartData = [];
        cartSnap.docs.map((e)=>{
            cartData.push(e.data());
        })
        console.log(cartData);
        const docRef = doc(database,"orders",userId+Date.now());
        await setDoc(docRef,{
            items : cartData,
            orderTime : Date.now(),
            status : "pending",
            userId : userId
        })

        try {
            await Promise.all(cartSnap.docs.map(async (e) => {
                await deleteDoc(e.ref);
            }));
            console.log("deleted");
        } catch (err) {
            console.log("document deletion", err);
        }

        alert("Order placed successfully. We will reach you soon for further discussions :)");
        window.location.href="/shop";
    }else{
        console.log("cart is empty");
    }

    

}