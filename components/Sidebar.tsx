import { BsHouseFill, BsBellFill } from "react-icons/bs";
import { FaUser } from "react-icons/fa";
import SidebarLogo from "./layout/SidebarLogo";
import SidebarItem from "./layout/SidebarItem";
import { BiLogOut } from "react-icons/bi";
import SidebarTweetButton from "./layout/SidebarTweetButton";
import useCurrentUser from "@/hooks/useCurrentUser";
import { signOut } from "next-auth/react";


const Sidebar = () => {
	const { data: currentUser } = useCurrentUser();
	const items = [
		{
			label: "Home",
			href: "/",
			icon: BsHouseFill,
		},
		{
			label: "Notifications",
			href: "/notifications",
			icon: BsBellFill,
			auth: true,
			alert: currentUser?.hasNotifications
		},
		{
			label: "Profile",
			href: `/users/${currentUser?.id}`,
			icon: FaUser,
			auth: true 
		},
	];
	return (
		<div
			className="
            h-full
            pr-4
            md:pr-6
        "
		>
			<div className="flex flex-col items-end">
				<div className="divide-y-1 lg:w-[230px]">
					<SidebarLogo />
					{items.map((item) => (
						<SidebarItem 
							key={item.label}
							label={item.label}
							href={item.href}
							icon={item.icon}
							auth={item.auth}
							alert={item.alert}
						/>
					))}
					{currentUser && (
						<SidebarItem 
							onClick={() => signOut()}
							icon={BiLogOut}
							label="Logout"
						/>
					)}
					<SidebarTweetButton />
				</div>
			</div>
		</div>
	);
};

export default Sidebar;
