import Header from "@/components/Header";
import PostFeed from "@/components/posts/PostFeed";
import UserBio from "@/components/users/UserBio";
import UserHero from "@/components/users/UserHero";
import useUser from "@/hooks/useUser";
import { useRouter } from "next/router";
import { ClipLoader } from "react-spinners";

const UserView = () => {
	const router = useRouter();
	const { userId } = router.query;
	const { data: user, isLoading } = useUser(userId as string);

	if(isLoading || !user) {
		return (
			<div className="
				flex
				justify-center
				items-center
				h-full
			">
				<ClipLoader color="lightblue" size={80} />
			</div>
		)
	}

	return (
		<>
			<Header showBackArrow label={user?.name} />
			<UserHero userId={user.id as string} />
			<UserBio userId={user.id as string} />
			<PostFeed userId={user.id as string} />
		</>
	);
};

export default UserView;
