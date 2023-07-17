import { useLazyQuery, gql } from "@apollo/client";
import {
	Avatar,
	Box,
	Button,
	Heading,
	SimpleGrid,
	Stack,
	useColorModeValue,
	useMediaQuery,
    Text
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../store";
import { setJwtToken } from "../utils";

const GET_USER = gql`
	query Query($userId: ID!) {
		user(id: $userId) {
			name
			username
			hostedEvents {
				_id
			}
		}
	}
`;

const LOGOUT = gql`
query Query {
	logout {
	  success
	}
  }`;

const Settings = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [isLargerThan1040] = useMediaQuery("(min-width: 1040px ");
	const userId: String | null = useSelector(
		(state: RootState) => state.Auth.userId
	);

	const [getUser, { loading, data }] = useLazyQuery<any>(GET_USER, {
		variables: { userId },
	});

	const [logOut, { loading: logOutLoad, data: success }] = useLazyQuery<any>(LOGOUT, {
		onCompleted: () => {
			setJwtToken(null);
			dispatch({ type: "LOG_OUT", payload: {userId : null} });
			navigate("/login", { replace: true })
		},
	});

	useEffect(() => {
		getUser();
	}, []);

	return (
		<Box m={5}>
			<Heading fontSize={"4xl"} my="8">
				Settings
			</Heading>
			<Stack spacing={8} direction={isLargerThan1040 ? "row" : "column"}>
				<Box
					rounded={"lg"}
					bg={useColorModeValue("white", "gray.700")}
					boxShadow={"lg"}
					width={"100%"}
					p={8}
				>
					<Stack direction="row">
						<Avatar bg="teal.500" />
                        <Text fontSize={"2xl"} p={1} px={3} >{data?.user.name}</Text>
					</Stack>
                    <Box my={7}>
                        <Text fontSize={"xl"}>Username: {data?.user.username}</Text>
                        <Text fontSize={"xl"}>Events hosted: {data?.user.hostedEvents.length}</Text>
                    </Box>
				</Box>
				<Box
					rounded={"lg"}
					bg={useColorModeValue("white", "gray.700")}
					boxShadow={"lg"}
					width={isLargerThan1040 ? "40%" : "100%"}
					p={8}
					textAlign="center"
                    paddingY={"auto"}
				>
					<Button width={"100%"} 
                    bg={"red.500"}
                    color={"white"}
                    _hover={{
                        bg: "red.600",
                    }}
                    onClick={() => logOut()}
                    type="submit"
                    my={3}>
						Log Out
					</Button>
					<Button width={"100%"} disabled>
						Update Profile
					</Button>
				</Box>
			</Stack>
            <Heading fontSize={"4xl"} my="8">
				App Preferences
			</Heading>
            <Box
					rounded={"lg"}
					bg={useColorModeValue("white", "gray.700")}
					boxShadow={"lg"}
					width={"100%"}
					p={8}
                    textAlign="center"
				>
					<Text fontSize={"2xl"}>Coming soon</Text>
				</Box>
		</Box>
	);
};

export default Settings;
