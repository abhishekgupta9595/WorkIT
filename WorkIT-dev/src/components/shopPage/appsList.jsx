/* eslint-disable react/prop-types */
import AppCard from "./appCard";
import "./itemList.css";

const AppsList =(props)=>{

    return(
        <div className="item_list">
            {
                props.apps.map((e)=>{
                    return <AppCard app={e} key={e.id}/>
                })
            }
        </div>
        
    )
}

export default AppsList;