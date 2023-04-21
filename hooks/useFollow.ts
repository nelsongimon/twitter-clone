import useCurrentUser from './useCurrentUser';
import useUser from './useUser';
import { useCallback, useMemo } from 'react';
import useLoginModal from './useLoginModal';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const useFollow = (userId: string) => {
    const { data: currentUser, mutate: mutateCurrentUser } = useCurrentUser();
    const { mutate: mutateFetchedUser } = useUser(userId);

    const loginModal = useLoginModal();

    const isFollowing = useMemo(() => {
        const list = currentUser?.followingIds || [];
        return list.includes(userId);
    }, [currentUser?.followingIds, userId]);

    const toggleFollow = useCallback(async () => {
        if(!currentUser) {
            return loginModal.onOpen();
        }
        try {
            let request;
            if (isFollowing) {
                console.log("Deleting follow", userId);
                request = () => axios.delete(`/api/follow?userId=${userId}`);
            } else {
                request = () => axios.post('/api/follow', { userId });
            }
            await request();
            mutateCurrentUser();
            mutateFetchedUser();
            toast.success("Successfuly updated");

        } catch(error) {
            console.log(error);
            toast.error("Somthing went wrong");
        }
    }, [currentUser, isFollowing, mutateCurrentUser, mutateFetchedUser, userId ]);

    return {
        isFollowing,
        toggleFollow
    }
}

export default useFollow;