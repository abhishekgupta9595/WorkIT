/* eslint-disable react/prop-types */
import ItemCard from "./itemCard"
import "./itemList.css";

const ItemList =(props)=>{
    
    return (
        <div className="item_list">
            { props.items.map((item) =>{
                return <ItemCard item={ item } key={item.id}/>
            })}
        </div>
    )
}

export default ItemList;