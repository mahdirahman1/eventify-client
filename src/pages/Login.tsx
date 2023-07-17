import {
	Flex,
	Box,
	FormControl,
	FormLabel,
	Input,
	Stack,
	Link,
	Button,
	Heading,
	Text,
	useColorModeValue,
	FormErrorMessage,
} from "@chakra-ui/react";
import {  gql, useLazyQuery } from "@apollo/client";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setJwtToken } from "../utils";

const LOGIN_USER = gql`
	query Query($username: String!, $password: String) {
		login(username: $username, password: $password) {
			userId
			token
			tokenExp
		}
	}
`;

const Login = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const userRef: any = useRef();
	const passRef: any = useRef();

	interface opvars {
		login : {
			token: string,
			userId: string,
			tokenExp: string,
		}
	}

	const [login, { loading, error, data }] = useLazyQuery<opvars>(LOGIN_USER);

	useEffect(
		() => {
			if (data && !loading) {
				//console.log(data);
				dispatch({ type: "LOGIN_USER", payload: { userId: data.login.userId} });
				setJwtToken(data.login.token);
				navigate("/events", { replace: true })
			}
		},
		[data, dispatch, loading, navigate]
	);

	return (
		<Flex
			minH={"100vh"}
			align={"center"}
			justify={"center"}
			bg={useColorModeValue("gray.100", "gray.800")}
		>
			<Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6} >
				<Stack align={"center"}>
					<Heading fontSize={"4xl"}>Sign in to your account</Heading>
					<Text fontSize={"lg"} color={"gray.600"}>
						to enjoy all the fun{" "}
						<Link color={"blue.400"} onClick={() => navigate("/events")}>
							events
						</Link>{" "}
						✌️
					</Text>
				</Stack>
				<Box
					rounded={"lg"}
					bg={useColorModeValue("white", "gray.700")}
					boxShadow={"lg"}
					p={8}
					border={error ? "2px solid red" : ''}
				>
					<Stack spacing={4}>
						<FormControl id="username">
							<FormLabel>Username</FormLabel>
							<Input type="text" ref={userRef} isRequired />
						</FormControl>
						<FormControl id="password">
							<FormLabel>Password</FormLabel>
							<Input type="password" ref={passRef} />
						</FormControl>
						<FormControl isInvalid>
							<Button
								w="100%"
								bg={"blue.400"}
								color={"white"}
								_hover={{
									bg: "blue.500",
								}}
								loadingText="Signing In"
								isLoading={loading}
								type="submit"
								onClick={() =>
									login({
										variables: {
											username: userRef.current.value,
											password: passRef.current.value,
										},
									})
								}
							>
								Sign in
							</Button>
							<FormErrorMessage justifyContent="center">{error?.message}</FormErrorMessage>
						</FormControl>
					</Stack>
					<Stack pt={6}>
						<Text align={"center"}>
							Need an account?{" "}
							<Link color={"blue.400"} onClick={() => navigate("/signup")}>
								Signup
							</Link>
						</Text>
					</Stack>
				</Box>
			</Stack>
		</Flex>
	);
};

export default Login;
