/* eslint-disable react/prop-types */
import { CiSearch } from "react-icons/ci";
import { IoFilterSharp } from "react-icons/io5";
// import { LuArrowDownUp } from "react-icons/lu";

import "./search.css";
import { useContext, useEffect, useState } from "react";
import { ButtonContext } from "../../context/buttonContext";
import { QueryContext } from "../../context/queryContext";

const Search = (props) => {

  const [searchTxt,setSearchTxt] = useState("");
  const filterToggle = useContext(ButtonContext);
  const condition = useContext(QueryContext);

  useEffect(()=>{

  },[props.methods.currentPageIsApps]);
  

  const handleSearch =()=>{
    condition.setQuery(searchTxt);
  }

  const handleKeyPress =(e)=>{
    if(e.key === "Enter"){
      handleSearch();
    }
  }

  return (
    <div className='search-bar'>
        <div className="page-control-container">
          <h3>Shop by: </h3>
          <div className="page-control">
            <h3 className={props.methods.currentPageIsApps? "active":""} onClick={()=> props.methods.setCurrentPageIsApps(true)}>Apps</h3>
            <h3 className={props.methods.currentPageIsApps? "":"active"} onClick={()=> props.methods.setCurrentPageIsApps(false)}>Features</h3>
          </div>
        </div>
        
        <div  className="input-group">
            <div className='search-input-icon'>
                <input type="search" name="search" id="search" placeholder='Search...' 
                onChange={e=> setSearchTxt(e.target.value)}
                onKeyDown={handleKeyPress}
                value={searchTxt}/>
                <button className="search_btn" onClick={()=>{handleSearch()}}> <CiSearch className="search_icon"/> </button>
            </div>
            <div className='sort-btn ' id='hide-icon' onClick={()=>filterToggle.setFilterVisible(!filterToggle.filterVisible)}><IoFilterSharp/></div>
            {/* <div className='sort-btn'><LuArrowDownUp/></div> */}
        </div>
    </div>
  )
}

export default Search