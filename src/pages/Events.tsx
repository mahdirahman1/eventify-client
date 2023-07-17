import { gql, useLazyQuery, useQuery } from "@apollo/client";
import { Box, Button, Heading, SimpleGrid } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";

const ALL_EVENTS = gql`
	query Events {
		events {
			_id
			title
			description
			date
			category
			host {
				_id
				name
			}
			participants {
				_id
			}
		}
	}
`;
const Events = () => {
	const [ getEvents, {loading, error, data}] = useLazyQuery<any>(ALL_EVENTS);

	useEffect(() => {
	getEvents();
	}, [getEvents])
	
	return (
		<Box m={5}>
			<Heading fontSize={"4xl"} my="8">
				All Events
			</Heading>
			<SimpleGrid columns={{ sm: 1, md: 2, lg: 3, xl: 4 }} spacing="2rem">
			{data?.events?.map((event : any) => (
          <Card key={event.id} eventInfo={event} />
        ))}
			</SimpleGrid>
		</Box>
	);
};

export default Events;
