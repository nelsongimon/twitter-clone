import useCurrentUser from '@/hooks/useCurrentUser';
import useLoginModal from '@/hooks/useLoginModal';
import { useRouter } from 'next/router';
import React, { useCallback, useMemo } from 'react';
import { formatDistanceToNowStrict } from 'date-fns';
import Avatar from '../Avatar';
import { AiOutlineHeart, AiFillHeart, AiOutlineMessage } from 'react-icons/ai';
import useLike from '@/hooks/useLike';

interface PostItemProps {
    data: Record<string, any>;
    userId?: string;
}

const PostItem: React.FC<PostItemProps> = ({ userId, data }) => {
    const router = useRouter();
    const loginModal = useLoginModal();
    const { data: currentUser } = useCurrentUser();

    const { hasLiked, toggleLike } = useLike({postId: data.id, userId: userId as string});

    const goToUser = useCallback((event: any) => {
        event.stopPropagation();
        router.push(`/users/${data.user.id}`);  
    }, [data.user.id, router]);

    const goToPost = useCallback(() => {
        router.push(`/posts/${data.id}`);
    }, [data.id, router]);

    const onLike = useCallback((event: any) => {
        event.stopPropagation();
        if(!currentUser) {
            return loginModal.onOpen();
        }
        toggleLike();
    }, [loginModal, currentUser, toggleLike]);

    const createdAt = useMemo(() => {
        if(!data.createdAt) {
            return null;
        }
        return formatDistanceToNowStrict(new Date(data.createdAt));

    }, [data?.createdAt]);

    const LikeIcon = hasLiked ? AiFillHeart : AiOutlineHeart;
    return (
        <div onClick={goToPost} className="
            border-b-[1px]
            border-neutral-800
            p-5
            cursor-pointer
            hover:bg-neutral-900
            transition
        ">
            <div className="flex items-start gap-3">
                <Avatar userId={data.user.id} />
                <div>
                    <div className="
                        flex 
                        items-center
                        gap-2
                    ">
                        <p 
                        onClick={goToUser}
                        className="
                            text-white
                            font-semibold
                            cursor-pointer
                            hover:underline
                        "
                         
                        >
                            {data.user.name}
                        </p>
                        <span onClick={goToUser} className="text-neutral-500 cursor-pointer hover:underline hidden md:block">
                            @{data.user.username}
                        </span>
                        <span className="text-neutral-500 text-sm">
                            {createdAt}
                        </span>
                    </div>
                    <div className="text-white mt-1">
                        {data.body}
                    </div>
                    <div className="flex items-center gap-10 mt-3">
                        <div className="
                            flex
                            items-center
                            text-neutral-500
                            gap-2
                            cursor-pointer
                            transition
                            hover:text-sky-500
                        ">
                            <AiOutlineMessage size={20} />
                            {data?.comments?.length || 0}
                        </div>
                        <div 
                        onClick={onLike}
                        className="
                            flex
                            items-center
                            text-neutral-500
                            gap-2
                            cursor-pointer
                            transition
                            hover:text-red-500
                        ">
                            <LikeIcon size={20} color={hasLiked ? 'red' : ''}/>
                            {data?.linkedIds?.length || 0}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PostItem;