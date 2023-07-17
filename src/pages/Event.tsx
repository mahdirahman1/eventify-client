import { gql, useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { CalendarIcon, TimeIcon } from "@chakra-ui/icons";
import {
	Badge,
	Box,
	Button,
	Heading,
	SimpleGrid,
	Tab,
	Table,
	TableContainer,
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
    Tbody,
    Td,
    Text,
	Th,
	Thead,
	Tr,
	useColorModeValue,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Card from "../components/Card";
import { RootState } from "../store";

const GET_EVENT = gql`
	query Query($eventId: ID!) {
		event(id: $eventId) {
			title
			description
			date
			category
			host {
                _id
				name
			}
			_id
			participants {
				_id
				name
			}
		}
	}
`;

const JOIN = gql`
	mutation Mutation($eventId: ID!) {
  joinEvent(eventId: $eventId) {
    _id
    title
    description
    date
    category
    host {
      name
      _id
    }
    participants {
      _id
      name
    }
  }
}
`

const LEAVE = gql`
	mutation Mutation($eventId: ID!) {
  leaveEvent(eventId: $eventId) {
    _id
    title
    description
    date
    category
    host {
      name
      _id
    }
    participants {
      _id
      name
    }
  }
}
`

const Event = () => {
	const { id } = useParams();
	const navigate = useNavigate();
    const userId: String | null = useSelector(
		(state: RootState) => state.Auth.userId
	);
	const [error, setError] = useState<String | null>(null);
	const [getEvent, { loading, data }] = useLazyQuery<any>(GET_EVENT, {
		variables: { eventId: id },
	});

	const [joinEvent, {loading: loadJoin, reset}] = useMutation<any>(JOIN, {
		onCompleted: () => {
			reset();
			setError(null);
		},
		onError: (err) => {
			setError(err.message);
			reset();
		},
	});

	const [leaveEvent, {loading: loadLeave , reset: leaveRst}] = useMutation<any>(LEAVE, {
		onCompleted: () => {
			leaveRst();
			setError(null);
		},
		onError: (err) => {
			setError(err.message);
			leaveRst();
		},
	});

	useEffect(
		() => {
			getEvent();
		},
		[getEvent]
	);
	
	
	const joinHandler =	async () => {
		await joinEvent({
			variables: {
				eventId: id,
			},
		})
	}

	const leaveHandler = async () => {
		await leaveEvent({
			variables: {
				eventId: id,
			},
		})
	}

    const getButton = () => {
        
        if(!loading && data){
			if(data.event.host._id === userId) return <Button
            w="100%"
            bg={"blue.500"}
            color={"white"}
            _hover={{
                bg: "blue.600",
            }}
            loadingText="Leaving"
			isLoading={loadLeave}
            type="submit"
			onClick={() => navigate(`edit`, { replace: true })}
            
        >
            Edit Event
        </Button>


        const participants = data?.event.participants;
        if(participants.filter((p: (any)) => p._id === userId).length > 0){
            return <Button
            w="100%"
            bg={"red.500"}
            color={"white"}
            _hover={{
                bg: "red.600",
            }}
            loadingText="Leaving"
			isLoading={loadLeave}
            type="submit"
			onClick={leaveHandler}
            
        >
            Leave Event
        </Button>

        } else {
            return <Button
            w="100%"
            bg={"teal.400"}
            color={"white"}
            _hover={{
                bg: "teal.500",
            }}
			loadingText="Joining"
			isLoading={loadJoin}
            type="submit"
			onClick={joinHandler}
            
        >
            Join Event
        </Button>
        }
        
    }
    }

	return (
		<Box m={5} px={5}>
			<Heading fontSize={"4xl"} my="8">
				{`${data?.event.title}`}
			</Heading>
			<SimpleGrid columns={{ sm: 1, md: 1, lg: 1, xl: 1 }} spacing="2rem">
				<Tabs
					isFitted
					variant="enclosed"
					bg={useColorModeValue("white", "gray.700")}
                    
				>
					<TabList mb="1em">
						<Tab
							_selected={{
								bg: "cyan.400",
								color: "white",
							}}
							
						>
							Details
						</Tab>
						<Tab
							_selected={{
								bg: "cyan.400",
								color: "white",
							}}
						>
							Participants
						</Tab>
					</TabList>
					<TabPanels rounded={"lg"} boxShadow={"lg"} minHeight={"22rem"}>
						<TabPanel m={3} >
							<Badge borderRadius="full" px="2" colorScheme="teal" >
								{`${data?.event.category}`}
							</Badge>
                            <Box m={2}>
                                <CalendarIcon  mr={3} mb={1} />
                                {`${new Date(data?.event.date).toDateString()}`}
                            </Box>
                            <Box m={2}>
                                <TimeIcon  mr={3} mb={1} />
                                {`${new Date(data?.event.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`}
                            </Box>
                            <Text my={5}>{`${data?.event.description}`}</Text>
                            <Text>Hosted by {data?.event.host._id === userId ? `you` : `${data?.event.host.name}`}</Text>
                        </TabPanel>
						<TabPanel>
                        <TableContainer>
                        <Table variant='striped' colorScheme='cyan' maxWidth={"100%"}>
                            <Thead>
                            <Tr>
                                <Th>Name</Th>
                            </Tr>
                            </Thead>
                            <Tbody>
                                {data?.event.participants.map((participant: { name: String | null | undefined; }) => {
                                   return <Tr>
                                    <Td>{`${participant.name}`}</Td>
                                </Tr>
                                })}
                            </Tbody>
                        </Table>
                        </TableContainer>
						</TabPanel>
					</TabPanels>
				</Tabs>
				<Box>
                {getButton()}
				{error && <Text color={"red"} textAlign="center">{error}, Try again</Text>}
				</Box>
			</SimpleGrid>
		</Box>
	);
};

export default Event;
