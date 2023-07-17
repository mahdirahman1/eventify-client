import { IconType } from "react-icons";
import {
	FiCompass,
	FiLogIn,
	FiSettings,
	FiUserPlus,
	FiPlusSquare,
    FiDatabase
} from "react-icons/fi";

interface LinkItemProps {
	name: string;
	icon: IconType;
    to:  string;
}

export const authenticatedItems: Array<LinkItemProps> = [
	{ name: "Explore Events", icon: FiCompass, to: "/events" },
	{ name: "Create Event", icon: FiPlusSquare, to: "/create" },
	{ name: "My Events", icon: FiDatabase, to: "/my-events" },
	{ name: "Settings", icon: FiSettings, to: "/settings" },
];

export const unauthItems: Array<LinkItemProps> = [
	{ name: "Explore Events", icon: FiCompass, to: "/events" },
	{ name: "Login", icon: FiLogIn, to: "/login" },
	{ name: "Sign Up", icon: FiUserPlus, to: "/signup" },
];
