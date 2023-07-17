import { gql, useLazyQuery, useMutation } from "@apollo/client";
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
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const UPDATE_EVENT = gql`
	mutation Mutation($eventId: ID!, $event: EventInput!) {
		updateEvent(eventId: $eventId, event: $event) {
			_id
			category
			date
			description
			title
		}
	}
`;

const GET_EVENT = gql`
	query EditEvent($eventId: ID!) {
		editEvent(id: $eventId) {
			category
			date
			description
			host {
				name
			}
			title
		}
	}
`;

const EditEvent = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const [title, setTitle] = useState("");
	const [category, setCategory] = useState("");
	const [date, setDate] = useState("");
	const [description, setDescription] = useState("");
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
	let [updateEvent, { loading, reset }] = useMutation(UPDATE_EVENT, {
		onCompleted: (data) => {
			navigate(`/events/${id}`);
			reset();
		},
		onError: (err) => {
			setReqError(err.message);
			reset();
		},
	});
	let [
		getEvent,
		{ loading: event_loading, error: get_error, data: event_data },
	] = useLazyQuery<any>(GET_EVENT, {
		variables: { eventId: id },
		onCompleted: (data: any) => {
			setTitle(data.editEvent.title);
			setCategory(data.editEvent.category);
			setDescription(data.editEvent.description);
			let date = data.editEvent.date.toString();
			let formatted = date.substring(0, 16);

			setDate(formatted);
		},
	});

	const onTitleChange = (e: any) => {
		setTitle(e.target.value);
		setFieldErrors({ ...fieldErrors, title: false });
	};

	const onCatChange = (e: any) => {
		setCategory(e.target.value);
		setFieldErrors({ ...fieldErrors, category: false });
	};

	const onDescrChange = (e: any) => {
		setDescription(e.target.value);
	};

	const onDateChange = (e: any) => {
		setDate(e.target.value);
		setFieldErrors({ ...fieldErrors, date: false });
	};

	const resetFields = () => {
		setTitle("");
		setDate("");
		setCategory("");
		setDescription("");
		setFieldErrors({
			title: false,
			category: false,
			date: false,
		});
		setReqError(null);
	};
	const updateEventHandler = async () => {
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

		await updateEvent({
			variables: {
				eventId: id,
				event,
			},
		});
	};

	useEffect(
		() => {
			getEvent();
		},
		[getEvent]
	);

	return (
		<Flex minH={"100vh"} bg={useColorModeValue("gray.100", "gray.800")}>
			<Stack spacing={8} width={"80vw"} mx={"auto"} py={12} px={12}>
				<Heading fontSize={"4xl"}>Edit Event</Heading>

				<Box
					rounded={"lg"}
					bg={useColorModeValue("white", "gray.700")}
					boxShadow={"lg"}
					width={"100%"}
					p={8}
					border={requestError ? "2px solid red" : ""}
				>
					{event_loading ? (
						"Loading"
					) : (
						<Stack spacing={6}>
							<FormControl id="title" isInvalid={fieldErrors.title}>
								<FormLabel>Title</FormLabel>
								<Input
									type="text"
									isRequired
									ref={titleRef}
									value={title}
									onChange={onTitleChange}
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
											value={category}
											onChange={onCatChange}
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
											value={date}
											onChange={onDateChange}
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
											onChange={onCatChange}
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
											value={date}
											onChange={onDateChange}
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
								<Textarea
									ref={descRef}
									value={description}
									onChange={onDescrChange}
								/>
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
										loadingText="Updating..."
										type="submit"
										isLoading={loading}
										onClick={updateEventHandler}
									>
										Update
									</Button>
								</HStack>
								<FormErrorMessage justifyContent="center">
									{requestError}
								</FormErrorMessage>
							</FormControl>
						</Stack>
					)}
				</Box>
			</Stack>
		</Flex>
	);
};

export default EditEvent;
