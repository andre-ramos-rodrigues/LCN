
'use client'

import React, { useState } from 'react';
import { useApp } from '../hooks/useApp';
import { Comment } from '../../types';
//import { generatePostIdeas } from '../services/geminiService';

const ClientDashboard: React.FC = () => {
    const { posts, messages, approveComment } = useApp();
    const [activeTab, setActiveTab] = useState('comments');
    
    // ProtectedRoute handles access, so no need for a role check here.
    
    const unapprovedComments = posts.flatMap(post => 
        post.comments.filter(c => !c.isApproved).map(c => ({...c, postId: post.id, postTitle: post.title }))
    );

    const tabs = [
        { id: 'comments', label: 'Comment Moderation' },
        { id: 'messages', label: 'Inbox' }
    ];

    return (
        <div className="space-y-8">
            <h1 className="text-4xl font-extrabold text-text-primary">Client Dashboard</h1>

            <div>
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`${
                                    activeTab === tab.id
                                        ? 'border-primary text-primary'
                                        : 'border-transparent text-text-secondary hover:text-text-primary hover:border-gray-300'
                                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>
                <div className="mt-8">
                    {activeTab === 'comments' && <CommentModeration unapprovedComments={unapprovedComments} approveComment={approveComment} />}
                    {activeTab === 'messages' && <MessageInbox messages={messages} />}
                </div>
            </div>
        </div>
    );
};

interface CommentModerationProps {
    unapprovedComments: (Comment & { postId: string; postTitle: string })[];
    approveComment: (postId: string, commentId: string) => void;
}
const CommentModeration: React.FC<CommentModerationProps> = ({ unapprovedComments, approveComment }) => (
    <div>
        <h2 className="text-2xl font-bold text-primary mb-4">Pending Comments</h2>
        {unapprovedComments.length > 0 ? (
            <div className="space-y-4">
                {unapprovedComments.map(comment => (
                    <div key={comment.id} className="p-4 bg-base-100 rounded-lg shadow border">
                        <p className="text-sm text-text-secondary">On post: <span className="font-semibold">{comment.postTitle}</span></p>
                        <p className="font-bold text-text-primary mt-1">{comment.author}</p>
                        <p className="text-text-primary my-2">{comment.content}</p>
                        <button onClick={() => approveComment(comment.postId, comment.id)} className="bg-accent text-white px-3 py-1 rounded text-sm hover:bg-accent/90">
                            Approve
                        </button>
                    </div>
                ))}
            </div>
        ) : <p className="text-text-secondary">No pending comments.</p>}
    </div>
);

const MessageInbox: React.FC<{ messages: any[] }> = ({ messages }) => (
    <div>
        <h2 className="text-2xl font-bold text-primary mb-4">Received Messages</h2>
        {messages.length > 0 ? (
            <div className="space-y-4">
                {messages.map(msg => (
                    <div key={msg.id} className="p-4 bg-base-100 rounded-lg shadow border">
                        <p className="text-sm text-text-secondary">{new Date(msg.timestamp).toLocaleString()}</p>
                        <p className="font-bold text-text-primary mt-1">{msg.name} ({msg.email})</p>
                        <p className="text-text-primary mt-2 whitespace-pre-wrap">{msg.message}</p>
                    </div>
                )).reverse()}
            </div>
        ) : <p className="text-text-secondary">Your inbox is empty.</p>}
    </div>
);


export default ClientDashboard;