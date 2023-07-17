import { EditIcon, DeleteIcon, HamburgerIcon } from "@chakra-ui/icons";
import {
	Badge,
	Box,
	Button,
	IconButton,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	useColorModeValue,
	useDisclosure,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import DeleteDialog from "./DeleteDialog";

const Card = ({ eventInfo, edit, getUserEvents }: any) => {
	const { _id: id, category, title, participants, host, date } = eventInfo;
	const formattedDate = new Date(date);
	const navigate = useNavigate();
	const { isOpen, onOpen, onClose } = useDisclosure();
	return (
		<Box
			maxW="sm"
			borderWidth="1px"
			borderRadius="lg"
			overflow="hidden"
			bg={useColorModeValue("white", "gray.700")}
			cursor="pointer"
			onClick={() => navigate(`/events/${id}`)}
		>
			<Box p="6">
				<Box
					display="flex"
					alignItems="baseline"
					justifyContent="space-between"
				>
					<Badge borderRadius="full" px="2" colorScheme="teal">
						{category}
					</Badge>
					<Box
						color="gray.500"
						fontWeight="semibold"
						letterSpacing="wide"
						fontSize="xs"
						textTransform="uppercase"
						ml="2"
					>
						{formattedDate.toDateString()}
					</Box>
				</Box>

				<Box
					display="flex"
					mt="4"
					as="span"
					color="gray.600"
					textTransform="uppercase"
					fontSize="xl"
					fontWeight={"bold"}
				>
					{title}
				</Box>

				<Box
					display="flex"
					mt="2"
					alignItems="center"
					justifyContent={"space-between"}
					flexWrap={"wrap"}
					fontSize="sm"
				>
					{`Hosted by ${host.name}`}
				</Box>
				<Box
					display="flex"
					alignItems="center"
					justifyContent={"space-between"}
					flexWrap={"wrap"}
					fontSize="sm"
				>
					<Box color="gray.600" fontSize="sm">
						{`${participants.length} participants`}
					</Box>
				</Box>
				{edit && (
					<Box
						display="flex"
						alignItems="right"
						justifyContent={"right"}
						flexWrap={"wrap"}
						fontSize="sm"
					>
						<Menu>
							<Box onClick={(e) => e.stopPropagation()}>
								<MenuButton
									as={IconButton}
									aria-label="Options"
									icon={<HamburgerIcon />}
									variant="outline"
								/>
								<MenuList>
									<MenuItem
										icon={<EditIcon />}
										onClick={() => navigate(`/events/${id}`)}
									>
										Edit
									</MenuItem>
									<MenuItem icon={<DeleteIcon />} onClick={onOpen}>
										Delete
									</MenuItem>
								</MenuList>
							</Box>
						</Menu>
					</Box>
				)}
				<DeleteDialog isOpen={isOpen} onClose={onClose} eventInfo={eventInfo} getUserEvents={getUserEvents} />
			</Box>
		</Box>
	);
};

export default Card;
