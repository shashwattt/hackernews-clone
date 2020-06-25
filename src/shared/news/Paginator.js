import React from "react";
import { useHistory } from "react-router-dom";
import { getUrlParameter } from "../utils/jsHelper";

const Paginator = () => {
    const history = useHistory();
    const { location: { search } } = history;
    
	const changePageNumber = (inc) => {
		let currentPage = 0;
		if(search){
			currentPage = parseInt(getUrlParameter(search).page);
		}
		if(inc){
			//Increment page by 1
			history.push({
				pathname: '/',
  				search: '?page=' + (currentPage + 1)
			})
		}else {
			//decrement page by 1
			if(currentPage > 0){
				history.push({
					pathname: '/',
					  search: '?page=' + (currentPage - 1)
				})
			}
		}
	}
    return(
        <div className="paginator">
            Pagination:{" "}
            <a
                onClick={()=> changePageNumber(false)}>
                {'<< '}Previous
            </a>
            |
            <a
                onClick={()=> changePageNumber(true)}>
                Next >> 
            </a>
        </div>
    )
}

export default Paginator;