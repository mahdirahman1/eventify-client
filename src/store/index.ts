import { combineReducers, configureStore } from "@reduxjs/toolkit";
import AuthReducer from "./AuthReducer";

const rootReducer = combineReducers({
	Auth: AuthReducer,
});
export type RootState = ReturnType<typeof rootReducer>;

const store = configureStore({ reducer: rootReducer });

export default store;
