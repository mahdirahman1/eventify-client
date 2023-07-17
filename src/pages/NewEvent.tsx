import { gql, useMutation } from "@apollo/client";
import {
	Flex,
	Box,
	FormControl,
	FormLabel,
	Input,
	Stack,
	Button,
	Heading,
	useColorModeValue,
	FormErrorMessage,
	Textarea,
	Select,
	HStack,
	useMediaQuery,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const CREATE_EVENT = gql`
	mutation Mutation($event: EventInput) {
		createEvent(event: $event) {
			_id
			title
		}
	}
`;

const NewEvent = () => {
	const navigate = useNavigate();
	let [createEvent, { loading, reset }] = useMutation(CREATE_EVENT, {
		onCompleted: (data) => {
			navigate("/events");
			reset();
			resetFields();
		},
		onError: (err) => {
			setReqError(err.message);
			reset();
		},
	});
	const [largerThan530] = useMediaQuery("(min-width: 531px)");
	const [requestError, setReqError] = useState<null | string>(null);
	const [fieldErrors, setFieldErrors] = useState({
		title: false,
		category: false,
		date: false,
	});
	const titleRef: any = useRef();
	const catRef: any = useRef();
	const dateTimeRef: any = useRef();
	const descRef: any = useRef();

	const resetFields = () => {
		catRef.current.value = "";
		titleRef.current.value = "";
		dateTimeRef.current.value = "";
		descRef.current.value = "";
		setFieldErrors({
			title: false,
			category: false,
			date: false,
		});
		setReqError(null);
	};
	const createEventHandler = async () => {
		const updatedErrors = {
			title: false,
			category: false,
			date: false,
		};
		if (titleRef.current.value === "") updatedErrors.title = true;
		if (catRef.current.value === "") updatedErrors.category = true;
		if (dateTimeRef.current.value === "") updatedErrors.date = true;
		setFieldErrors(updatedErrors);
		if (updatedErrors.date || updatedErrors.title || updatedErrors.category)
			return;

		const event = {
			title: titleRef.current.value,
			date: dateTimeRef.current.value,
			category:
				catRef.current.value === "miscellaneous"
					? "Misc"
					: catRef.current.value,
			description: descRef.current.value,
		};
		await createEvent({
			variables: {
				event,
			},
		});

		//console.log(data);
	};
	return (
		<Flex minH={"100vh"} bg={useColorModeValue("gray.100", "gray.800")}>
			<Stack spacing={8} width={"80vw"} mx={"auto"} py={12} px={12}>
				<Heading fontSize={"4xl"}>Create Event</Heading>

				<Box
					rounded={"lg"}
					bg={useColorModeValue("white", "gray.700")}
					boxShadow={"lg"}
					width={"100%"}
					p={8}
					border={requestError ? "2px solid red" : ""}
				>
					<Stack spacing={6}>
						<FormControl id="title" isInvalid={fieldErrors.title}>
							<FormLabel>Title</FormLabel>
							<Input
								type="text"
								isRequired
								ref={titleRef}
								onChange={() =>
									setFieldErrors({ ...fieldErrors, title: false })
								}
							/>
							{fieldErrors.title && (
								<FormErrorMessage>Title is required.</FormErrorMessage>
							)}
						</FormControl>
						{largerThan530 ? (
							<HStack>
								<FormControl id="category" isInvalid={fieldErrors.category}>
									<FormLabel>Category</FormLabel>
									<Select
										placeholder="Select option"
										ref={catRef}
										onChange={() =>
											setFieldErrors({ ...fieldErrors, category: false })
										}
									>
										<option value="sports">Sports</option>
										<option value="party">Party</option>
										<option value="miscellaneous">Miscellaneous</option>
									</Select>
									{fieldErrors.category && (
										<FormErrorMessage>Category is required.</FormErrorMessage>
									)}
								</FormControl>
								<FormControl id="date" isInvalid={fieldErrors.date}>
									<FormLabel>Date & Time</FormLabel>
									<Input
										type="datetime-local"
										ref={dateTimeRef}
										onChange={() =>
											setFieldErrors({ ...fieldErrors, date: false })
										}
									/>
									{fieldErrors.date && (
										<FormErrorMessage>
											Date & Time is required.
										</FormErrorMessage>
									)}
								</FormControl>
							</HStack>
						) : (
							<Stack spacing={6}>
								<FormControl id="category" isInvalid={fieldErrors.category}>
									<FormLabel>Category</FormLabel>
									<Select
										placeholder="Select option"
										ref={catRef}
										onChange={() =>
											setFieldErrors({ ...fieldErrors, category: false })
										}
									>
										<option value="sports">Sports</option>
										<option value="party">Party</option>
										<option value="miscellaneous">Miscellaneous</option>
									</Select>
									{fieldErrors.category && (
										<FormErrorMessage>Category is required.</FormErrorMessage>
									)}
								</FormControl>
								<FormControl id="date" isInvalid={fieldErrors.date}>
									<FormLabel>Date & Time</FormLabel>
									<Input
										type="datetime-local"
										ref={dateTimeRef}
										onChange={() =>
											setFieldErrors({ ...fieldErrors, date: false })
										}
									/>
									{fieldErrors.date && (
										<FormErrorMessage>
											Date & Time is required.
										</FormErrorMessage>
									)}
								</FormControl>
							</Stack>
						)}
						<FormControl id="desc">
							<FormLabel>Description</FormLabel>
							<Textarea ref={descRef} />
						</FormControl>

						<FormControl isInvalid={requestError ? true : false}>
							<HStack>
								<Button w="50%" onClick={resetFields}>
									Reset
								</Button>
								<Button
									w="50%"
									bg={"teal.400"}
									color={"white"}
									_hover={{
										bg: "teal.500",
									}}
									loadingText="Creating"
									type="submit"
									isLoading={loading}
									onClick={createEventHandler}
								>
									Create
								</Button>
							</HStack>
							<FormErrorMessage justifyContent="center">
								{requestError}
							</FormErrorMessage>
						</FormControl>
					</Stack>
				</Box>
			</Stack>
		</Flex>
	);
};

export default NewEvent;
