import React, { Component } from "react";
import timeAgo from "node-time-ago";
import "./NewsList.css";


const NewsList = ({news}) => {
	console.log('news', news);
	return (
		<div className="newslist">
			<div className="header">
				<div className="header-title">
					<strong>Hacker news</strong>
				</div>
			</div>
			{news &&
				news.map((post, index) => (
					<div key={post.objectID} className="news-item">
						<p>
							<span className="news-position">{index + 1}. ▲</span> {post.title}{" "}
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
