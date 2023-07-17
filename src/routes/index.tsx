import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Events from "../pages/Events";
import Signup from "../pages/Signup";
import ProtectedRoute from "./ProtectedRoute";
import NewEvent from "../pages/NewEvent";
import MyEvents from "../pages/MyEvents";
import Settings from "../pages/Settings";
import Event from "../pages/Event";
import EditEvent from "../pages/EditEvent";

const createRoutes = () => {
	return (
		<Routes>
			<Route path="/" element={<ProtectedRoute />}>
				<Route path="/" element={<Navigate to="/events" replace={true} />} />
				<Route path="/create" element={<NewEvent />} />
				<Route path="/my-events" element={<MyEvents />} />
				<Route path="/settings" element={<Settings />} />
				<Route path="/events/:id" element={<Event />} />
				<Route path="/events/:id/edit" element={<EditEvent />} />
			</Route>

			<Route path="/events" element={<Events />} />
			<Route path="/login" element={<Login />} />
			<Route path="/signup" element={<Signup />} />
		</Routes>
	);
};

export default createRoutes;
