import express from "express";
import cors from "cors";
import React from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter, matchPath } from "react-router-dom";
import serialize from "serialize-javascript";
import routes from "../shared/routes";
import App from "../shared/App";
import sourceMapSupport from "source-map-support";

if (process.env.NODE_ENV === "development") {
	sourceMapSupport.install();
}
if (typeof localStorage === "undefined" || localStorage === null) {
	var LocalStorage = require('node-localstorage').LocalStorage;
	localStorage = new LocalStorage('./local-db');
}
const updatedPosts = 'updatedPosts';
localStorage.setItem(updatedPosts, JSON.stringify([]));

const app = express();

app.use(cors());
app.use(express.static("public"));
app.get("/api/upvote/", (req, res, next) => {
	const postId = req.query.id;
	const count = req.query.count;
	const posts = JSON.parse(localStorage.getItem(updatedPosts));
	const myPost = posts.find(post => post.objectID == postId);
	if(myPost){
		myPost.relevancy_score = parseInt(count),
		myPost.created_at = new Date().getTime()
	}else {
		posts.push({
			objectID: postId,
			relevancy_score: parseInt(count),
			created_at: new Date().getTime()
		})
	}
	localStorage.setItem(updatedPosts, JSON.stringify(posts));
	res.json({
		status: 'success',
	});
});
app.get("/api/hide/", (req, res, next) => {
	const postId = req.query.id;
	const posts = JSON.parse(localStorage.getItem(updatedPosts));
	const myPost = posts.find(post => post.objectID == postId);
	if(myPost){
		myPost.hide = true;
	}else {
		posts.push({
			objectID: postId,
			hide: true
		})
	}
	localStorage.setItem(updatedPosts, JSON.stringify(posts));
	res.json({
		status: 'success',
	});
});

app.get("*", (req, res, next) => {
	const activeRoute = routes.find((route) => matchPath(req.url, route));
	const requestInitialData = activeRoute.component.requestInitialData && activeRoute.component.requestInitialData(req.query);
	const localData = JSON.parse(localStorage.getItem(updatedPosts));
	Promise.resolve(requestInitialData)
		.then((initialData) => {
			const context = { initialData, localData };
			const markup = renderToString(
				<StaticRouter location={req.url} context={context}>
					<App />
				</StaticRouter>
			);
			res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Hackernews Clone</title>
          <link rel="stylesheet" href="/css/main.css">
          <script src="/bundle.js" defer></script>
          <script>window.__initialData__ = ${serialize(context)}</script>
        </head>

        <body>
          <div id="root">${markup}</div>
        </body>
      </html>
      `);
		})
		.catch(next);
});

app.listen(process.env.PORT || 80, () => {
	console.log("Server is listening");
});
