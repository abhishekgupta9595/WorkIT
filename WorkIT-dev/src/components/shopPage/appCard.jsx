/* eslint-disable react/prop-types */
import "./appCard.css";
import image from "./tempImages/loginSystem.jpg";
import icon from "./tempImages/loginIcon.svg";
const AppCard =(props)=>{
    console.log(props);

    const data = props.app.data();
    return(
        <div className="app_card">
            <div className="image"> 
                <img src={data.imgUrl? data.imgUrl : image} alt="image" />
                {/* image to imported from database */}
            </div>
            <div className="item_name">
                <img src={data.iconUrl? data.iconUrl : icon} alt="icon" />
                <span>{data.name? data.name:"Unknown"}</span>
                {/* icon and name to be imported from the database */}
            </div>
            <div className="details">
                <span>
                    {data?.description? data.description.slice(0,150) : "Unknown"}{data.description?.length>150? "...":""}
                </span>

            </div>
            <div className="interactions">
                <button className="view_btn_app" onClick={()=> window.open(`app/${props.app.id}`,"blank")}>View details</button>
            </div>
        </div>
    )
}

export default AppCard;