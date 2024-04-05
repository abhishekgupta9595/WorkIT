import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { CgDetailsMore } from "react-icons/cg";
import { MdCancel } from "react-icons/md";

import img from "../../components/shopPage/tempImages/loginSystem.jpg";

import "./itemListAdmin.css";
import { useContext, useEffect, useState } from "react";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { database } from "../../database/firebaseConfig";
import { LoaderContext } from "../../context/loaderContext";
import NewFeatureForm from "../../pages/InsertFeature/insertNewFeature";
import EditFeatureForm from "../../pages/InsertFeature/editFeature";



const ItemAdmin =(props)=>{
    const data = props.item.data();
    return(
        <div className="item_admin">
            <div className="content">
                <img src={data.iconUrl? data.iconUrl : img} alt="" />
                <p>{data.name}</p>
            </div>
            <div className="controls">
                <FaEdit className="btns" onClick={()=>{
                    console.log("clicked");
                    props.methods.setEditItem(props.item);
                    props.methods.setShowEditForm(true);
                    }}/>
                <MdDelete className="btns" onClick={()=> props.methods.deleteFeature(props.item.id)}/>
                <CgDetailsMore className="btns"/>
            </div>
        </div>
    )
}

const ItemListAdmin =()=>{
    const mrLoader = useContext(LoaderContext);

    const [items,setItems] = useState(null);
    const [showForm,setShowForm] = useState(false);
    const [showEditForm,setShowEditForm] = useState(false);
    const [editItem,setEditItem] = useState(null);
    const [load,setLoad] =useState(false);

    useEffect(()=>{

        if(!items){
            mrLoader.setIsLoading(true);
        
            getItems().then(()=>mrLoader.setIsLoading(false));
        }
        
        
    },[showForm,load,editItem,showEditForm])

    console.log("edititem:",editItem);
    
    
    const getItems = async ()=>{
        const docRef = collection(database,"features");
        
        const docSnap = await getDocs(docRef);
        console.log("got the items admin",docSnap.docs);
        setItems(docSnap.docs);
    }
    
    const deleteFeature= async (featureId)=>{
        console.log("deletion started");
        const result = window.confirm("Do you really want to delete this item");
        if(result){
            const docRef = doc(database,"features",featureId);
            await deleteDoc(docRef);
            setLoad(!load);
        }
        
    }

    if(items){
        return(
            <div className="item_list_admin">
                {
                    showForm? <div className="new_item_form_element">
                        <div className="cancel_btn"><MdCancel onClick={()=>setShowForm(false)}/></div>
                        <NewFeatureForm/>
                        </div>: <div className="empty">

                        </div>
                }
                {
                    showEditForm? <div className="new_item_form_element">
                        <div className="cancel_btn"><MdCancel onClick={()=>setShowEditForm(false)}/></div>
                        <EditFeatureForm item={editItem}/>
                        </div>: <div className="empty">

                        </div>
                }
                <div className="header">
                    <h1>Features: <i>{items.length}</i></h1>
                    <button onClick={()=>setShowForm(true)}>Add Feature</button>
                </div>
                <div className="body">
                    {
                        items.map((e)=>{
                            return(
                                <ItemAdmin key={e.id} item={e} methods={{deleteFeature,setShowEditForm,setEditItem}}/>
                            )
                        })
                    }
                </div>
            </div>

        )
    }
    
}

export default ItemListAdmin;