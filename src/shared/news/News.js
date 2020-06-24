import React, { useState, useEffect } from "react";
import {withRouter} from "react-router";
import NewsList from "./NewsList";
import "isomorphic-fetch";
import { getUrlParameter, serialize } from "../utils/jsHelper";

const News = (props) => {
	console.log('Comonent', props);
	const { location: { search } } = props;
	let initList = null;

	if(!__isBrowser__){
		initList = (props.staticContext && props.staticContext.initialData && props.staticContext.initialData.hits);
	}
	const [news, setNews] = useState(initList);
	const [page, setPage] = useState(search && getUrlParameter(search).page);
	useEffect(() => {
		console.log('Didmount Effect')
		
		let initialData;
		if (__isBrowser__) {
			initialData = window.__initialData__;
			delete window.__initialData__;
		}
		if(initialData && initialData.hits){
			setNews(initialData && initialData.hits);
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

	return <NewsList news={news} />;
}

News.requestInitialData = (queryObj) => {
	let queryParam = (queryObj && serialize(queryObj)) || '';
	return fetch("http://hn.algolia.com/api/v1/search" + queryParam).then((response) => response.json());
}
export default withRouter(News);
