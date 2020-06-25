import React, { useState, useEffect } from "react";
import {withRouter} from "react-router";
import NewsList from "./NewsList";
import "isomorphic-fetch";
import { getUrlParameter, serialize } from "../utils/jsHelper";
import { fetchNews } from "../utils/apiService";

const News = (props) => {
	const { location: { search } } = props;
	let initList = null;
	let initLocalData = null;

	if(!__isBrowser__){
		initList = (props.staticContext && props.staticContext.initialData && props.staticContext.initialData.hits);
		initLocalData = (props.staticContext && props.staticContext.localData);
		
	}
	const [news, setNews] = useState(initList);
	const [localData, setLocalData] = useState(initLocalData);
	const [page, setPage] = useState(search && getUrlParameter(search).page);
	useEffect(() => {
		console.log('Didmount Effect')
		
		let context;
		if (__isBrowser__) {
			context = window.__initialData__;
			delete window.__initialData__;
		}
		if(context && context.initialData && context.initialData.hits){
			setNews(context.initialData.hits);
			setLocalData(context.localData);
		}else {
			News.requestInitialData(getUrlParameter(search)).then((data) => {setNews(data.hits)});
		}
	}, []);

	useEffect(() => {
		console.log('Search Effect')
		if(search && search !== '' && getUrlParameter(search).page !== page){
			setPage(getUrlParameter(search).page);
			News.requestInitialData(getUrlParameter(search)).then(response => {
				setNews(response.hits);
			})
		}
	}, [search])

	return <NewsList 
		news={news} 
		localData={localData}
	/>;
}

News.requestInitialData = (queryObj) => {
	let queryParam = (queryObj && serialize(queryObj)) || '';
	return fetchNews(queryParam).then((response) => response.json());
}
export default withRouter(News);
