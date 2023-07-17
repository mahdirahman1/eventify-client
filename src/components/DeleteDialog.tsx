import { MutableRefObject, useRef } from "react";
import {
	AlertDialog,
	AlertDialogBody,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogOverlay,
	AlertDialogHeader,
	Button,
} from "@chakra-ui/react";
import { gql, useLazyQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";

const DELETE_EVENT = gql`
	query Query($eventId: ID!) {
		deleteEvent(id: $eventId) {
			_id
			title
		}
	}
`;

const DeleteDialog = ({ isOpen, onClose, eventInfo, getUserEvents }: any) => {
	const cancelRef = useRef() as React.MutableRefObject<HTMLButtonElement>;
	const navigate = useNavigate();
	const { _id: id, title } = eventInfo;
	const [deleteEvent, { loading, data }] = useLazyQuery<any>(DELETE_EVENT, {
		variables: { eventId: id },
		onCompleted: () => {
			navigate("/my-events");
		},
	});
	const deleteHandler = async () => {
		await deleteEvent();
		getUserEvents();
		onClose();
	};
	return (
		<>
			<AlertDialog
				isOpen={isOpen}
				leastDestructiveRef={cancelRef}
				onClose={onClose}
			>
				<AlertDialogOverlay>
					<AlertDialogContent>
						<AlertDialogHeader fontSize="lg" fontWeight="bold">
							{`Delete ${title}`}
						</AlertDialogHeader>

						<AlertDialogBody>
							Are you sure you want to delete this event? You can't undo this
							action afterwards.
						</AlertDialogBody>

						<AlertDialogFooter>
							<Button ref={cancelRef} onClick={onClose}>
								Cancel
							</Button>
							<Button
								isLoading={loading}
								loadingText={"Deleting..."}
								colorScheme="red"
								onClick={deleteHandler}
								ml={3}
							>
								Delete
							</Button>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialogOverlay>
			</AlertDialog>
		</>
	);
};

export default DeleteDialog;
