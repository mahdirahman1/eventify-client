import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const ProtectedRoute = () => {
	const { loggedIn } = useAuth();
	return loggedIn ? <Outlet /> : <Navigate replace to={"/login"} />;
};

export default ProtectedRoute;
