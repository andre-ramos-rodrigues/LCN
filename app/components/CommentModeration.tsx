import { Comment } from '../../types';

export type ModerationComment = Comment & {
  postId: string;
  postTitle: string;
};

interface CommentModerationProps {
  comments: ModerationComment[];
  loading: boolean;
  approveComment: (commentId: string) => void;
  deleteComment: (commentId: string) => void;
}

const CommentModeration: React.FC<CommentModerationProps> = ({
  comments,
  loading,
  approveComment,
  deleteComment,
}) => (
  <div>
    <h2 className="text-2xl font-bold text-primary mb-4">
      Pending Comments
    </h2>

    {loading && <p className="text-text-secondary">Loading…</p>}

    {!loading && comments.length === 0 && (
      <p className="text-text-secondary">No pending comments.</p>
    )}

    <div className="space-y-4">
      {comments.map(comment => (
        <div
          key={comment.id}
          className="p-4 bg-base-100 rounded-lg shadow border"
        >
          <p className="text-sm text-text-secondary">
            On post:{' '}
            <span className="font-semibold">{comment.postTitle}</span>
          </p>

          <p className="font-bold text-text-primary mt-1">
            {comment.author}
          </p>

          <p className="text-text-primary my-2">
            {comment.content}
          </p>

          <button
            onClick={() => approveComment(comment.id)}
            className="bg-accent text-white px-3 py-1 rounded text-sm hover:bg-accent/90"
          >
            Approve
          </button>
                    <button
            onClick={() => deleteComment(comment.id)}
            className="bg-accent text-white px-3 py-1 rounded text-sm hover:bg-accent/90"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  </div>
);

export default CommentModeration;