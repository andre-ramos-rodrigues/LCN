
import React, { useState } from 'react';
import type { Comment } from '../../types';
import { useApp } from '../hooks/useApp';

interface CommentSectionProps {
  postId: string;
  comments: Comment[];
}

const CommentSection: React.FC<CommentSectionProps> = ({ postId, comments }) => {
  const { addComment } = useApp();
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (author.trim() && content.trim()) {
      addComment(postId, { author, content });
      setAuthor('');
      setContent('');
      setSubmitted(true);
    }
  };

  const approvedComments = comments.filter(c => c.isApproved);

  return (
    <div className="mt-12">
      <h3 className="text-2xl font-bold text-text-primary mb-6">Comments ({approvedComments.length})</h3>
      
      <div className="space-y-6">
        {approvedComments.length > 0 ? (
          approvedComments.map(comment => (
            <div key={comment.id} className="p-4 bg-gray-50 rounded-lg border">
              <p className="font-semibold text-primary">{comment.author}</p>
              <p className="text-sm text-text-secondary mb-2">{new Date(comment.timestamp).toLocaleString()}</p>
              <p className="text-text-primary">{comment.content}</p>
            </div>
          ))
        ) : (
          <p className="text-text-secondary">No comments yet. Be the first to share your thoughts!</p>
        )}
      </div>

      <div className="mt-10 pt-10 border-t">
        <h4 className="text-xl font-bold text-text-primary mb-4">Leave a Comment</h4>
        {submitted ? (
            <div className="p-4 bg-emerald-50 text-emerald-700 rounded-lg">
                <p className="font-semibold">Thank you for your comment!</p>
                <p>It has been submitted for moderation and will appear once approved.</p>
            </div>
        ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="author" className="block text-sm font-medium text-text-secondary">Name</label>
                <input
                type="text"
                id="author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 bg-base-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                />
            </div>
            <div>
                <label htmlFor="content" className="block text-sm font-medium text-text-secondary">Comment</label>
                <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                rows={4}
                className="mt-1 block w-full px-3 py-2 bg-base-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                />
            </div>
            <button
                type="submit"
                className="inline-flex items-center px-6 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
            >
                Submit Comment
            </button>
            </form>
        )}
      </div>
    </div>
  );
};

export default CommentSection;