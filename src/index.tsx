import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import {
	ApolloProvider,
	ApolloClient,
	InMemoryCache,
	createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { Provider as ReduxProvider } from "react-redux";
import store from "./store";
import { getJwtToken } from "./utils";

const link = createHttpLink({
	uri: "http://localhost:4000/graphql",
	credentials: "include",
});

const authLink = setContext((_, { headers }) => {
	// get the authentication token from local storage if it exists
	const token = getJwtToken();
	// return the headers to the context so httpLink can read them
	return {
		headers: {
			...headers,
			authorization: token ? `Bearer ${token}` : "",
		},
	};
});

const client = new ApolloClient({
	link: authLink.concat(link),
	cache: new InMemoryCache(),
});

const root = ReactDOM.createRoot(document.getElementById(
	"root"
) as HTMLElement);
root.render(
	<React.StrictMode>
		<ReduxProvider store={store}>
			<ApolloProvider client={client}>
				<ChakraProvider>
					<BrowserRouter>
						<App />
					</BrowserRouter>
				</ChakraProvider>
			</ApolloProvider>
		</ReduxProvider>
	</React.StrictMode>
);
