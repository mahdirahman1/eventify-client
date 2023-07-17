import { AnyAction } from "redux";

export interface authState {
	userId: string | null;
	token: string | null;
	tokenExp: number | null;
}

const initialState: authState = {
	userId: null,
	token: null,
	tokenExp: null,
};

const AuthReducer = (state = initialState, action: AnyAction) => {
	switch (action.type) {
		case "LOGIN_USER":
			state = action.payload;
			break;

		case "LOG_OUT":
			state = action.payload;

			break;
		default:
			return state;
	}
	return state;
};

export default AuthReducer;
