let accessToken : null | String = null;

export const getJwtToken = () => {
	return accessToken;
};

export const setJwtToken = (token: string | null) => {
	accessToken = token;
};
