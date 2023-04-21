import { useCallback, useMemo } from "react";
import useCurrentUser from "./useCurrentUser";
import useLoginModal from "./useLoginModal";
import usePost from "./usePost";
import usePosts from "./usePosts";
import { toast } from "react-hot-toast";
import axios from "axios";


const useLike = ({ postId, userId } : { postId: string, userId: string }) => {
    const { data: currentUser } = useCurrentUser();  
    const { post, mutate: mutateFetchedPost } = usePost(postId);
    const { mutate: mutateFetchedPosts } = usePosts(userId);

    const loginModal = useLoginModal();

    const hasLiked = useMemo(() => {
        const list = post?.linkedIds || [];
        return list.includes(currentUser?.id);
    }, [post?.linkedIds, currentUser?.id]);

    const toggleLike = useCallback(async () => {
        if(!currentUser) {
            return loginModal.onOpen();
        }
        try {
            let request;
            if(hasLiked) {
                request = () => axios.delete(`/api/like?postId=${postId}`);
            } else {
                request = () => axios.post('/api/like', { postId });
            }

            await request();
            mutateFetchedPost();
            mutateFetchedPost();
            toast.success("Success");

            
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");

        }
    }, [currentUser, postId, hasLiked, mutateFetchedPost, mutateFetchedPosts, loginModal.onOpen ]);

    return {
        hasLiked,
        toggleLike
    }
}

export default useLike;