// import Cart from "../../components/cart/Cart";
import Filter from "../../components/shopPage/filter";
import NavBar from "../../components/shopPage/navBar"
import Search from "../../components/shopPage/search";
import ItemList from "../../components/shopPage/itemList";

import { onAuthStateChanged } from "firebase/auth";
import { useContext, useEffect, useState } from 'react';
import { getFirestore, getDocs, collection, where,query, or } from "firebase/firestore"
import { app, auth } from "../../database/firebaseConfig";

import "./shop.css";
import { QueryContext } from "../../context/queryContext";
import { ButtonContext } from "../../context/buttonContext";
import { LoaderContext } from "../../context/loaderContext";
import AppsList from "../../components/shopPage/appsList";

const db = getFirestore(app);

const Shop = ()=>{

    const mrLoader = useContext(LoaderContext);
    const condition = useContext(QueryContext);
    const filterToggle = useContext(ButtonContext);

    const [apps,setApps] = useState(null);
    const [items,setItems] = useState(null);
    const [currentPageIsApps,setCurrentPageIsApps] = useState("apps");
    
    useEffect(()=>{
        mrLoader.setIsLoading(true);
        onAuthStateChanged(auth,(user)=>{
            if(user){

                if(currentPageIsApps){
                    getApps(condition.query).then(()=>mrLoader.setIsLoading(false));
                }else{
                    getItems(condition.query).then(()=>mrLoader.setIsLoading(false));
                }
                

                if(filterToggle.filterVisible){
                    document.getElementById("filter_space").classList.remove("filter_hidden");
                    document.getElementById("filter_space").classList.add("filter_visible");
                }else{
                    document.getElementById("filter_space").classList.remove("filter_visible");
                    document.getElementById("filter_space").classList.add("filter_hidden");
                }
            }else{
                window.location.href='/loginsignup';
                mrLoader.setIsLoading(false);
            }
        })
        
    },[condition,filterToggle.filterVisible,currentPageIsApps])

    const getItems = async (condition)=>{
        const docRef = collection(db,"features");

        if(condition !=null && condition != ""){
            const q = query(docRef, or(where("category","==",condition.toLowerCase()),where("name","==",condition.toLowerCase())) );
            const docSnap = await getDocs(q);
            console.log("got the items", docSnap.docs);
            setItems(docSnap.docs);
        }else{
            const docSnap = await getDocs(docRef);
            console.log("got the items", docSnap.docs);
            setItems(docSnap.docs);
        }

        console.log("items set", items);
    }

    const getApps = async (condition)=>{
        const docRef = collection(db,"apps");

        if(condition !=null && condition != ""){
            const q = query(docRef, or(where("category","==",condition.toLowerCase()),where("name","==",condition.toLowerCase())) );
            const docSnap = await getDocs(q);
            console.log("got the items", docSnap.docs);
            setApps(docSnap.docs);
        }else{
            const docSnap = await getDocs(docRef);
            console.log("got the items", docSnap.docs);
            setApps(docSnap.docs);
        }

        console.log("Apps set", apps);
    }

    if(apps){
        console.log("items have been set.",apps);
    
    }else{
        console.log("items not set");
    }


    return (
        <div className="shop_page"> 
            <NavBar/>
            <div className="shop_container">
                <div className="filter_container filter_visible" id="filter_space">
                    <Filter/>
                </div>
                <div className="shop_content">
                    <Search methods={{currentPageIsApps,setCurrentPageIsApps}}/>
                    {
                      (currentPageIsApps)? 
                      (apps!=null?  apps.length==0? <h1 className="fetching">No results found...</h1>: <AppsList apps={apps}/> : <h1>...</h1>)
                      : 
                      (items!=null?  items.length==0? <h1 className="fetching">No results found...</h1>: <ItemList items={items}/> : <h1>...</h1>)

                    }
                </div>
            </div>
            
        </div>
    ) 
    
}
export default Shop;

