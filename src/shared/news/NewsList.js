import React, { useEffect, useState } from "react";
import "./NewsList.css";
import NewsItem from "./NewsItem";
import Paginator from "./Paginator";


const NewsList = ({news, localData, setLocalData}) => {
	const [localDataMap, setLocalDataMap] = useState({});

	useEffect(()=> {
		const map = localData && localData.reduce((obj, item) => {
			obj[item.objectID] = item;
			return obj;
		}, {});
		setLocalDataMap(map);
	}, [localData])


	const updateLocalData = (item) => {
		var obj = { ...localDataMap };
		obj[item.objectID] = item;
		 
		setLocalDataMap(obj);
	}

	return (
		<div className="newslist">
			<div className="header">
				<div className="header-title">
					<strong>Hacker news</strong>
				</div>
				<Paginator />
				
			</div>
			{news && news.map((post, index) => {
					if(localDataMap && localDataMap[post.objectID]){
						post = {...post, ...localDataMap[post.objectID]}
					}
					return(
						<NewsItem 
							post={post} 
							key={post.objectID}
							index={index} 
							updateLocalData={updateLocalData} 
						/>
					)
				})};
								
		</div>
	);
}

export default NewsList;
