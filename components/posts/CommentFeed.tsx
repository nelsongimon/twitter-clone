import React from 'react';
import CommentItem from './CommentItem';

//create an interface for this comments component
interface CommentFeedProps {
    comments?: Record<string, any>[];
}

const CommentFeed: React.FC<CommentFeedProps> = ({ comments = [] }) => {
    return (
        <>
            {comments.map((comment) => (
                <CommentItem key={comment.id} data={comment}/>
            ))}
        </>
    );
}

export default CommentFeed;