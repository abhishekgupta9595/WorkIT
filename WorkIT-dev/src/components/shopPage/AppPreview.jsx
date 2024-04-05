/* eslint-disable react/prop-types */
import { MdOutlineAddCircle } from "react-icons/md";
import { AiFillMinusCircle } from "react-icons/ai";
import { useContext, useEffect, useState } from "react";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { database } from "../../database/firebaseConfig";
import { useParams } from "react-router-dom";

import closeIcon from "../../assets/icons/closeIcon.svg"
import { UserContext } from "../../context/userContext";
import { addToCart, removeFromCart } from "../cart/cartMethods";
import { LoaderContext } from "../../context/loaderContext";

// Extracted FeatureItem component
const FeatureItem = (props) => {

  const userInstance = useContext(UserContext);
  const mrLoader = useContext(LoaderContext);
  const [feature,setFeature] = useState(null);
  const [load,setLoad] = useState(false);
  const [isInCart,setIsInCart] = useState(false);

  useEffect(()=>{
    mrLoader.setIsLoading(true);
    getFeature().then(()=>{
      checkIfInCart().then(()=>{
        mrLoader.setIsLoading(false);
      });
    });
  },[isInCart,load]);

  const getFeature =async ()=>{
    const docSnap = await getDoc(props.item.ref);
    setFeature(docSnap);
  }

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

  console.log(feature);

  if(feature){
    return(
      <div
        key={props.item.id}
        className="flex items-center justify-between px-2 py-4 rounded-[5px] shadow-lg border-[#dddddd] border m-[10px] w-full"
      >
        <div className="flex flex-1 items-center justify-start gap-4">
          <img
            src={feature.data().iconUrl}
            alt="icon"
            width={80}
            height={80}
            className="px-2"
          />
          <h3 className="text-xl">
            {feature.data().name}
          </h3>
        </div>
        <div className="flex gap-2 px-4 font-bold text-2xl ">
          {
            isInCart? <AiFillMinusCircle className="cursor-pointer size-8"
            onClick={()=>{
              removeFromCart(feature.id,userInstance.user.uid);
              setLoad(!load);
            }}/> : <MdOutlineAddCircle className="cursor-pointer size-8"
            onClick={()=>{
              addToCart(feature,userInstance.user.uid);
              setLoad(!load);
            }}/>
          }
          
          
        </div>
      </div>
    )
  }
  
  
};

const AppPreview = () => {
  
  const mrLoader = useContext(LoaderContext);
  const id = useParams().appId;
  const [item,setItem]= useState(null);
  console.log("id",id);

  useEffect(()=>{
    mrLoader.setIsLoading(true);
    getItem().then(()=>{
      mrLoader.setIsLoading(false);
    });
  },[])


  const getItem= async ()=>{
    const docRef = doc(database,"apps",id);
    const docSnap = await getDoc(docRef);
    setItem(docSnap);
  }

  if(item){
    return (
      <section className="px-3 w-full  flex flex-col items-center justify-evenly sm:px-16 py-10 h-[100vh] ">
        <div className="flex items-start mt-4 px-4 py-4 w-full rounded-3xl h-fit  ">
          <img src={closeIcon} className="cursor-pointer" alt="cross icon" onClick={()=>window.close()}/>
        </div>

        <div className=" flex sm:flex-row flex-col justify-evenly w-full mt-4 p-4 grow sm:m-0">
          <div className="flex items-start justify-center flex-col px-4 rounded-3xl  sm:w-[40%] w-full h-full">
            <div className="w-full mt-4 flex items-center justify-center">
              <img
                src={item.data().imgUrl}
                alt="app img"
                width={240}
                height={180}
                className="object-fit-contain"
              />
            </div>
            <div className="flex items-center gap-2 p-2 mt-2">
              <img
                src={item.data().iconUrl}
                alt="app icon"
                width={64}
                height={64}
              />
              <h3 className="text-xl px-2">{item.data().name}</h3>
            </div>
            <div className="grow overflow-auto px-2 py-4 mb-4 w-full h-[200px]">
              <p className="text-xl text-justify m-auto h-full">
                  {item.data().description}
              </p>
            </div>
          </div>

          <div className="h-full overflow-y-scroll overflow-hidden px-[10px]">
            {item.data().features.map(feature => <FeatureItem item={feature}  key={item.id}/>)}
          </div>
        </div>
      </section>
    );
  }
  }
  

export default AppPreview;
