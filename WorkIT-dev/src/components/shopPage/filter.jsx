import Fdata from "./Fdata";
import { QueryContext } from "../../context/queryContext";
import { IoChevronBackCircle } from "react-icons/io5";
import "./filter.css";
import { useContext } from "react";
import { ButtonContext } from "../../context/buttonContext";

const Filter = () => {

    const query = useContext(QueryContext);
    const filterToggle = useContext(ButtonContext);

    const handleCheck =(e,filter)=>{
        const checkboxes = document.getElementsByClassName("filter_checkbox");
        if(e.target.checked){
            console.log("checked ",filter);
            query.setQuery(filter);

            for(let i=0;i<checkboxes.length;i++){
                checkboxes[i].checked=false;
            }
            
            e.target.checked = true;
        }else{
            console.log("unchecked ",filter);
            query.setQuery(null);
        }
        filterToggle.setFilterVisible(!filterToggle.filterVisible);
    }

    console.log("query",query.query)

    return (
        <div className="filter-container">

            <div className="filter-heading">
                <h2 >
                    Filter by category
                </h2>
                <IoChevronBackCircle className="back-btn"
                onClick={()=>{
                    filterToggle.setFilterVisible(false);
                }}/>
            </div>

            <ul>
                {Fdata.map((item) => {
                    return <li key={item.id}>
                        <div className="filter-items">
                            <label>
                                <p > 
                                    {item.filter}
                                </p>
                                <input onChange={(e)=>handleCheck(e,item.filter)} type="checkbox" className="filter_checkbox"/>
                            </label>
                        </div>
                        <hr />
                    </li>
                })}
            </ul>
        </div>
    );
};

export default Filter;
