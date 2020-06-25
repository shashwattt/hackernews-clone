import React from "react";
import { render, hydrate } from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "../shared/App";

hydrate(
	<BrowserRouter>
		<App />
	</BrowserRouter>,
	document.getElementById("root")
);
