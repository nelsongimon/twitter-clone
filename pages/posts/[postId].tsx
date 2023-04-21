import CommentFeed from '@/components/posts/CommentFeed';
import Form from '@/components/Form';
import Header from '@/components/Header';
import PostItem from '@/components/posts/PostItem';
import usePost from '@/hooks/usePost';
import { useRouter } from 'next/router';
import { ClipLoader } from 'react-spinners';


const PostView = () => {
    const router = useRouter();
    const  { postId } = router.query;  
    const { post, isLoading } = usePost(postId as string);

    if (isLoading || !post) {
        return (
            <div className="
                flex
                justify-center
                items-center
                h-full
            ">  
                <ClipLoader color="lightblue" size={80} />
            </div>
        ); 
    }

    return (
        <>
            <Header label="Tweet" showBackArrow />
            <PostItem data={post}/>
            <Form 
                postId={postId as string}
                isComment
                placeholder="Tweet your reply"
            />
            <CommentFeed comments={post?.comments} />

        </>
    );
}

export default PostView;