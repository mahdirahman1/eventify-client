import { gql, useLazyQuery } from '@apollo/client';
import { Box, Heading, SimpleGrid } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import Card from '../components/Card';
import { useSelector } from "react-redux";
import { RootState } from "../store";
import DeleteDialog from '../components/DeleteDialog';

const USER_EVENTS = gql`
	query User($userId: ID!) {
	user(id: $userId) {
		hostedEvents {
		_id
		title
		description
		date
		category
		participants {
			_id
		}
		host {
			name
		}
		}
	}
}
`

const MyEvents = () => {
	const userId: String | null = useSelector(
		(state: RootState) => state.Auth.userId
	);
	const [getUserEvents, { loading, data }] = useLazyQuery<any>(USER_EVENTS, {
		variables: {userId}
	});

	useEffect(() => {
		getUserEvents();
		if(!loading){
			console.log(data);
		}
	}, [data, getUserEvents, loading])

	
	return (
		<Box m={5}>
			<Heading fontSize={"4xl"} my="8">
				My Events
			</Heading>
			<SimpleGrid columns={{ sm: 1, md: 2, lg: 3, xl: 4 }} spacing="2rem">
				{data?.user?.hostedEvents?.map((event: any) => (
					<Card key={event.id} eventInfo={event} edit getUserEvents={getUserEvents} />
				))}
			</SimpleGrid>
			
		</Box>
	);
};

export default MyEvents;