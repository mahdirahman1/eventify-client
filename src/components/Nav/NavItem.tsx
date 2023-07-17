import { Flex, FlexProps, Icon, Link } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import { ReactText } from "react";
import { IconType } from "react-icons";

interface NavItemProps extends FlexProps {
	icon: IconType;
	children: ReactText;
	link: string;
}
const NavItem = ({ icon, children, link, ...rest }: NavItemProps) => {
	return (
		<Link
			as={NavLink}
			to={link}
			style={{ textDecoration: "none" }}
			_activeLink={{ background: "red" }}
            end
		>
			<Flex
				align="center"
				p="4"
				mx="4"
				borderRadius="lg"
				role="group"
				cursor="pointer"
				_hover={{
					bg: "cyan.400",
					color: "white",
				}}
				{...rest}
			>
				{icon && (
					<Icon
						mr="4"
						fontSize="16"
						_groupHover={{
							color: "white",
						}}
						as={icon}
					/>
				)}
				{children}
			</Flex>
		</Link>
	);
};

export default NavItem;
