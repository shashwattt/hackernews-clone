import React, { useState, useEffect } from "react";
import {withRouter} from "react-router";
import NewsList from "./NewsList";
import "isomorphic-fetch";
import { getUrlParameter, serialize } from "../utils/jsHelper";

const News = (props) => {
	console.log('props', props);
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
		console.log("initialData", initialData);
		setNews(initialData && initialData.hits);
	}, []);

	useEffect(() => {
		if(search && search !== '' && getUrlParameter(search).page !== page){
			setPage(getUrlParameter(search).page);
			News.requestInitialData(getUrlParameter(search)).then(response => {
				setNews(response.hits);
			})
		}
	}, [search])

	useEffect(() => {
		console.log('News Effect')
		if(!news){
			News.requestInitialData().then((data) => {console.log(data); setNews(data.hits)});
		}
	}, [news]);

	return <NewsList news={news} />;
}

News.requestInitialData = (queryObj) => {
	let queryParam = (queryObj && serialize(queryObj)) || '';
	return fetch("http://hn.algolia.com/api/v1/search" + queryParam).then((response) => response.json());
}
export default withRouter(News);
