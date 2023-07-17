import {
	Flex,
	Box,
	FormControl,
	FormLabel,
	Input,
	InputGroup,
	InputRightElement,
	Stack,
	Button,
	Heading,
	Text,
	useColorModeValue,
	Link,
	FormErrorMessage,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { gql, useMutation } from "@apollo/client";
import { setJwtToken } from "../utils";

const CREATE_USER = gql`
	mutation Mutation($user: UserInput) {
		createUser(user: $user) {
			_id
			token
			tokenExp
		}
	}
`;

const Signup = () => {
	const [showPassword, setShowPassword] = useState<Boolean>(false);
	const [error, setError] = useState<null | string>(null);
	const [formErrors, setFormErrors] = useState({
		name: false,
		username: false,
		password: false,
	});
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const userRef: any = useRef();
	const passRef: any = useRef();
	const nameRef: any = useRef();
	let [addUser, { loading, reset }] = useMutation(CREATE_USER, {
		onCompleted: (data) => {
			dispatch({
				type: "LOGIN_USER",
				payload: {
					userId: data.createUser._id,
				},
			});
			setJwtToken(data.createUser.token);
			navigate("/events", { replace: true });
			reset();
		},
		onError: (err) => {
			setError(err.message);
			reset();
		},
	});

	const validateName = () => {
		if (nameRef.current.value === "") {
			setFormErrors({ ...formErrors, name: true });
		} else {
			setFormErrors({ ...formErrors, name: false });
		}
	};

	const validateUsername = () => {
		setError(null);
		if (userRef.current.value === "") {
			setFormErrors({ ...formErrors, username: true });
		} else {
			setFormErrors({ ...formErrors, username: false });
		}
	};

	const validatePass = () => {
		if (passRef.current.value === "") {
			setFormErrors({ ...formErrors, password: true });
		} else {
			setFormErrors({ ...formErrors, password: false });
		}
	};

	const createUser = async () => {
		const updatedErrors = {
			name: false,
			username: false,
			password: false,
		};
		if (passRef.current.value === "") updatedErrors.password = true;
		if (userRef.current.value === "") updatedErrors.username = true;
		if (nameRef.current.value === "") updatedErrors.name = true;
		setFormErrors(updatedErrors);
		if (updatedErrors.name || updatedErrors.username || updatedErrors.password)
			return;

		await addUser({
			variables: {
				user: {
					username: userRef.current.value,
					name: nameRef.current.value,
					password: passRef.current.value,
				},
			},
		});
	};

	return (
		<Flex
			minH={"100vh"}
			align={"center"}
			justify={"center"}
			bg={useColorModeValue("gray.100", "gray.800")}
		>
			<Stack spacing={8} mx={"auto"} maxW={"lg"} w="30rem" py={12} px={6}>
				<Stack align={"center"}>
					<Heading fontSize={"4xl"} textAlign={"center"}>
						Sign up
					</Heading>
					<Text fontSize={"lg"} color={"gray.600"}>
						to enjoy all the cool features and{" "}
						<Link
							color={"blue.400"}
							onClick={() => navigate("/events", { replace: true })}
						>
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
					border={error ? "2px solid red" : ""}
				>
					<Stack spacing={3}>
						<FormControl id="name" isRequired isInvalid={formErrors.name}>
							<FormLabel>Name</FormLabel>
							<Input ref={nameRef} type="text" onChange={validateName} />

							{formErrors.name && (
								<FormErrorMessage>Name is required.</FormErrorMessage>
							)}
						</FormControl>
						<FormControl
							id="username"
							isRequired
							isInvalid={formErrors.username}
						>
							<FormLabel>Username</FormLabel>
							<Input ref={userRef} type="text" onChange={validateUsername} />
							{formErrors.username && (
								<FormErrorMessage>Username is required.</FormErrorMessage>
							)}
						</FormControl>
						<FormControl
							id="password"
							isRequired
							isInvalid={formErrors.password}
						>
							<FormLabel>Password</FormLabel>
							<InputGroup>
								<Input
									type={showPassword ? "text" : "password"}
									ref={passRef}
									onChange={validatePass}
								/>
								<InputRightElement h={"full"}>
									<Button
										variant={"ghost"}
										onClick={() =>
											setShowPassword((showPassword) => !showPassword)
										}
									>
										{showPassword ? <ViewIcon /> : <ViewOffIcon />}
									</Button>
								</InputRightElement>
							</InputGroup>
							{formErrors.password && (
								<FormErrorMessage>Password is required.</FormErrorMessage>
							)}
						</FormControl>

						<FormControl isInvalid={error ? true : false}>
							<Button
								loadingText="Submitting"
								isLoading={loading}
								w="100%"
								size="lg"
								bg={"blue.400"}
								color={"white"}
								_hover={{
									bg: "blue.500",
								}}
								type="submit"
								onClick={createUser}
							>
								Sign up
							</Button>
							<FormErrorMessage justifyContent="center">
								{error}
							</FormErrorMessage>
						</FormControl>

						<Stack pt={6}>
							<Text align={"center"}>
								Already a user?{" "}
								<Link color={"blue.400"} onClick={() => navigate("/login")}>
									Login
								</Link>
							</Text>
						</Stack>
					</Stack>
				</Box>
			</Stack>
		</Flex>
	);
};

export default Signup;
