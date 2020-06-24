import React, { Component } from "react";
import { useHistory } from "react-router-dom";
import timeAgo from "node-time-ago";
import "./NewsList.css";
import routes from "../routes";
import { getUrlParameter } from "../utils/jsHelper";


const NewsList = ({news}) => {
	const history = useHistory();
	const { location: { search } } = history;

	console.log('history', history);

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
	// console.log('news', news);
	return (
		<div className="newslist">
			<div className="header">
				<div className="header-title">
					<strong>Hacker news</strong>
				</div>
				<div className="sort">
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
			</div>
			{news &&
				news.map((post, index) => (
					<div key={post.objectID} className="news-item">
						<p>
							<span className="news-position">{index + 1}. </span> {post.title}{" "}
							<small>(by {post.author})</small>
						</p>
						<small className="news-details">
							{post.relevancy_score} upvotes | {timeAgo(post.created_at)}
						</small>
					</div>
				))}
		</div>
	);
}

export default NewsList;
