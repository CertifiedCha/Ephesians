import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { Textarea } from '../ui/textarea';
import { Comment, Blog } from '../../contexts/BlogContext';
import { authorsAndUsersData } from '../../data/authors';
import { motion, AnimatePresence } from 'framer-motion';

interface CommentsSectionProps {
  blog: Blog;
  isVisible: boolean;
  onAddComment: (blogId: string, content: string, isAnonymous: boolean) => void;
}

const CommentItem: React.FC<{ comment: Comment }> = ({ comment }) => {
  // Use comment.authorId to retrieve user data
  const user = authorsAndUsersData[comment.authorId] || {
    name: 'Anonymous',
    avatar: 'https://via.placeholder.com/150/0000FF/FFFFFF?text=Anon',
  };

  const formattedDate = new Date(comment.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="flex items-start space-x-4 p-4 rounded-lg bg-card/30 backdrop-blur-sm border border-border/50">
      <Avatar className="w-8 h-8">
        <AvatarImage src={user.avatar} />
        <AvatarFallback className="bg-muted-foreground/10 text-muted-foreground">
          {user.name.charAt(0)}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center space-x-2">
          <span className="font-semibold">{user.name}</span>
          <span className="text-xs text-muted-foreground">{formattedDate}</span>
        </div>
        <p className="mt-1 text-sm text-foreground">{comment.content}</p>
      </div>
    </div>
  );
};

export const CommentsSection: React.FC<CommentsSectionProps> = ({
  blog,
  isVisible,
  onAddComment,
}) => {
  const [newComment, setNewComment] = useState('');

  const handlePostComment = () => {
    if (newComment.trim()) {
      onAddComment(blog.id, newComment);
      setNewComment('');
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.section
          className="mt-12"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-6">Comments ({blog.comments.length})</h2>
          <div className="flex flex-col space-y-4">
            {blog.comments.map((comment, index) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <CommentItem comment={comment} />
              </motion.div>
            ))}
          </div>

          <div className="mt-8 p-6 bg-card/30 backdrop-blur-sm rounded-lg border border-border/50">
            <h3 className="text-lg font-bold mb-4">Leave a Comment</h3>
            <Textarea
              placeholder="Write your comment here..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="mb-4 bg-background/50 border-border/50"
            />
            <Button onClick={handlePostComment} className="w-full">
              Post Comment
            </Button>
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
};