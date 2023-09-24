import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import "./App.css";
import Navbar from "./components/Nav/Navbar";
import createRoutes from "./routes";
import { setJwtToken } from "./utils";

function App() {
	const routes = createRoutes();
	const dispatch = useDispatch();
	const [loading, setLoading] = useState(false);

	const refreshToken = async () => {
		setLoading(true);
		const data = await fetch(`${process.env.REACT_APP_SERVER}/refresh_token`, {
			method: "POST",
		});
		const json = await data.json();
		console.log(json);
		const { token, userId } = json;
		setJwtToken(token);
		setTimeout(() => {
			refreshToken();
		}, 900000 - 500);
		dispatch({
			type: "LOGIN_USER",
			payload: {
				userId,
			},
		});
		setLoading(false);
	};

	useEffect(() => {
		refreshToken();
	}, []);

	if (loading) {
		return <div>Loading...</div>;
	}

	return (
		<div className="App">
			<Navbar>{routes}</Navbar>
		</div>
	);
}

export default App;
