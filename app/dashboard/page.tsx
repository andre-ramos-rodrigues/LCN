'use client';

import React, { useEffect, useState } from 'react';
import { Comment } from '../../types';
import CommentModeration from '../components/CommentModeration'; 
import { useApp } from '../hooks/useApp';
import { useRouter } from 'next/navigation';

type ModerationComment = Comment & {
  postId: string;
  postTitle: string;
};

const ClientDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('comments');
  const [pendingComments, setPendingComments] = useState<ModerationComment[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useApp();
  const router = useRouter();

  /* =========================
     Fetch pending comments
  ========================= */
  useEffect(() => {
    if (user?.role !== 'Admin') {
      console.log('Access denied: User is not an admin');

      router.push('/login');
      return
    }
    
    const fetchPendingComments = async () => {
      try {
        setLoading(true);

        const res = await fetch('/api/comments', {
          cache: 'no-store',
        });

        if (!res.ok) throw new Error();

        const data = await res.json();
        setPendingComments(data);
      } catch (err) {
        console.error('Failed to load pending comments', err);
      } finally {
        setLoading(false);
      }
    };

    if (activeTab === 'comments') {
      fetchPendingComments();
    }
  }, [activeTab]);

  /* =========================
     Approve comment
  ========================= */
  const approveComment = async (commentId: string) => {
    await fetch(`/api/comments/${commentId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        commentId,
        isApproved: true,
      }),
    });

    setPendingComments(prev =>
      prev.filter(c => c.id !== commentId)
    );
  };

  /* =========================
     Delete comment
  ========================= */
  const deleteComment = async (commentId: string) => {
    await fetch(`/api/comments/${commentId}`, {
      method: 'DELETE',
    });

    setPendingComments(prev =>
      prev.filter(c => c.id !== commentId)
    );
  };

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-extrabold text-text-primary">
        Client Dashboard
      </h1>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('comments')}
            className={`${
              activeTab === 'comments'
                ? 'border-primary text-primary'
                : 'border-transparent text-text-secondary'
            } py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Comment Moderation
          </button>
        </nav>
      </div>

      {activeTab === 'comments' && (
        <CommentModeration
          loading={loading}
          comments={pendingComments}
          approveComment={approveComment}
          deleteComment={deleteComment}
        />
      )}
    </div>
  );
};

export default ClientDashboard;
