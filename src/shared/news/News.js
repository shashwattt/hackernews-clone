import React, { useState, useEffect } from "react";
import {withRouter} from "react-router";
import NewsList from "./NewsList";
import "isomorphic-fetch";

const News = (props) => {
	console.log('props', props);
	let initList = null;

	if(!__isBrowser__){
		initList = (props.staticContext && props.staticContext.initialData && props.staticContext.initialData.hits);
	}
	const [news, setNews] = useState(initList);
	
	useEffect(() => {
		console.log('Didmount Effect')

		let initialData;
		if (__isBrowser__) {
			initialData = window.__initialData__;
			delete window.__initialData__;
		}
		console.log("initialData", initialData);
		setNews(initialData && initialData.hits);
	}, []);

	useEffect(() => {
		console.log('News Effect')
		if(!news){
			News.requestInitialData().then((data) => {console.log(data); setNews(data.hits)});
		}
	}, [news]);

	return <NewsList news={news} />;
}

News.requestInitialData = () => {
	return fetch("http://hn.algolia.com/api/v1/search").then((response) => response.json());
}
export default withRouter(News);
