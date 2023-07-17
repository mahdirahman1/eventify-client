import { useSelector } from "react-redux";
import { authState } from "../store/AuthReducer";
import { getJwtToken } from "../utils";

interface IAuthRed {
	Auth: authState;
}

const useAuth = () => {
	const data = useSelector((state: IAuthRed) => state.Auth);
	const token = getJwtToken();
	const { userId } = data;
	return { loggedIn: token ? true : false, userId };
};

export default useAuth;
