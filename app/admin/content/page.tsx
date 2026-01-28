'use client'
import React, { useState, useEffect } from 'react';
import { useApp } from '../../hooks/useApp';
import { Post } from '../../../types';
import CarouselManager from '@/app/components/CarouselManager';

const emptyPost: Omit<Post, 'id' | 'date' | 'comments'> = {
    title: '',
    author: '',
    excerpt: '',
    content: '',
    imageUrls: [''],
};

const ContentManagementPage: React.FC = () => {
    const { posts, addPost, updatePost, deletePost, patchPost, carouselPostIds, toggleCarouselPost, editingPostId, setEditingPostId } = useApp();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPost, setEditingPost] = useState<Omit<Post, 'id' | 'date' | 'comments'> | Post | null>(null);
    //const [carouselIds, setcarouselPostIds] = useState<string[]>(carouselPostIds);

    const openModalForNew = () => {
        setEditingPostId(null);
        setEditingPost(emptyPost);
        setIsModalOpen(true);
    };

    const openModalForEdit = (post: Post) => {
        setEditingPostId(post.id);
        setEditingPost(post);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingPost(null);
        setEditingPostId(null);
    };

        useEffect(() => {
        //setcarouselPostIds(posts.filter(post => post.carrousel === true).map(post => post.id));

        if (editingPostId) {
            const postToEdit = posts.find(p => p.id === editingPostId);
            if (postToEdit) {
                openModalForEdit(postToEdit);
            }
        }
    }, [editingPostId, posts]);

    const handleSave = (postData: Omit<Post, 'id' | 'date' | 'comments'> | Post) => {
        const cleanedPostData = {
            ...postData,
            imageUrls: postData.imageUrls.filter(url => url.trim() !== ''),
        };

        if ('id' in cleanedPostData) {
            updatePost(cleanedPostData.id, cleanedPostData);
        } else {
            addPost(cleanedPostData);
        }
        closeModal();
    };
    
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-4xl font-extrabold text-text-primary">Content Management</h1>
                <button onClick={openModalForNew} className="px-6 py-2 bg-primary text-white font-medium rounded-md shadow-sm hover:bg-primary/90">
                    Create New Post
                </button>
            </div>

            <PostList posts={posts} onEdit={openModalForEdit} onDelete={deletePost} />

            {/* <CarouselManager posts={posts} carouselPostIds={carouselIds} onToggle={toggleCarouselPost} /> */ }

            <CarouselManager />
        
            {isModalOpen && editingPost && (
                <PostEditorModal post={editingPost} onSave={handleSave} onClose={closeModal} />
            )}
        </div>
    );
};

const PostList: React.FC<{ posts: Post[], onEdit: (post: Post) => void, onDelete: (postId: string) => void }> = ({ posts, onEdit, onDelete }) => (
    <div className="p-6 bg-base-100 rounded-lg shadow-lg border">
        <h2 className="text-2xl font-bold text-primary mb-4">Blog Posts</h2>
        <div className="space-y-4">
            {posts.map(post => (
                <div key={post.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md border">
                    <div>
                        <p className="font-semibold text-text-primary">{post.title}</p>
                        <p className="text-sm text-text-secondary">{post.author} - {new Date(post.date).toLocaleDateString()}</p>
                    </div>
                    <div className="space-x-2">
                        <button onClick={() => onEdit(post)} className="px-3 py-1 text-sm bg-secondary text-white rounded hover:bg-secondary/90">Edit</button>
                        <button onClick={() => {
                            if (window.confirm('Are you sure you want to delete this post?')) {
                                onDelete(post.id)
                            }
                        }} className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700">Delete</button>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

/*const CarouselManager: React.FC<{ posts: Post[], onToggle: (postId: string) => void }> = ({ posts, onToggle }) => (
     <div className="p-6 bg-base-100 rounded-lg shadow-lg border">
        <h2 className="text-2xl font-bold text-primary mb-4">Homepage Carousel</h2>
        <p className="text-sm text-text-secondary mb-4">Select up to 6 posts to feature on the homepage.</p>
        <div className="space-y-2">
            {posts.map(post => (
                <label key={post.id} className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-50 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={carouselPostIds.includes(post.id)}
                        onChange={() => onToggle(post.id)}
                        disabled={!carouselPostIds.includes(post.id) && carouselPostIds.length >= 6}
                        className="h-5 w-5 rounded text-primary focus:ring-primary border-gray-300"
                    />
                    <span className="text-text-primary">{post.title}</span>
                </label>
            ))}
        </div>
    </div>
);*/

interface PostEditorModalProps {
    post: Omit<Post, 'id' | 'date' | 'comments'> | Post;
    onSave: (postData: Omit<Post, 'id' | 'date' | 'comments'> | Post) => void;
    onClose: () => void;
}

const PostEditorModal: React.FC<PostEditorModalProps> = ({ post, onSave, onClose }) => {
    const [formData, setFormData] = useState(post);

    useEffect(() => {
        setFormData(post);
    }, [post]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev!, [name]: value }));
    };

    const handleImageUrlChange = (index: number, value: string) => {
        const newImageUrls = [...formData.imageUrls];
        newImageUrls[index] = value;
        setFormData(prev => ({ ...prev!, imageUrls: newImageUrls }));
    };

    const addImageField = () => {
        setFormData(prev => ({ ...prev!, imageUrls: [...prev!.imageUrls, ''] }));
    };

    const removeImageField = (index: number) => {
        if (formData.imageUrls.length > 1) {
            const newImageUrls = formData.imageUrls.filter((_, i) => i !== index);
            setFormData(prev => ({ ...prev!, imageUrls: newImageUrls }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-base-100 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
                <div className="p-6 border-b">
                    <h2 className="text-2xl font-bold text-primary">{'id' in post ? 'Edit Post' : 'Create Post'}</h2>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
                    <div>
                        <label className="block text-sm font-medium text-text-secondary">Title</label>
                        <input type="text" name="title" value={formData.title} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border rounded-md" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-secondary">Author</label>
                        <input type="text" name="author" value={formData.author} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border rounded-md" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-text-secondary">Image URLs</label>
                         {formData.imageUrls.map((url, index) => (
                             <div key={index} className="flex items-center space-x-2 mt-2">
                                 <input
                                     type="text"
                                     value={url}
                                     onChange={(e) => handleImageUrlChange(index, e.target.value)}
                                     required={index === 0}
                                     placeholder={index === 0 ? "Featured Image URL (Required)" : "Additional Image URL"}
                                     className="block w-full px-3 py-2 border rounded-md"
                                 />
                                 {formData.imageUrls.length > 1 && (
                                     <button type="button" onClick={() => removeImageField(index)} className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600">Remove</button>
                                 )}
                             </div>
                         ))}
                         <button type="button" onClick={addImageField} className="mt-2 px-3 py-1 text-sm bg-accent text-white rounded hover:bg-accent/90">Add Image</button>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-secondary">Excerpt</label>
                        <textarea name="excerpt" value={formData.excerpt} onChange={handleChange} required rows={3} className="mt-1 block w-full px-3 py-2 border rounded-md" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-secondary">Content (Markdown supported)</label>
                        <textarea name="content" value={formData.content} onChange={handleChange} required rows={10} className="mt-1 block w-full px-3 py-2 border rounded-md font-mono" />
                    </div>
                </form>
                <div className="p-6 border-t flex justify-end space-x-3 bg-gray-50 rounded-b-lg">
                    <button onClick={onClose} type="button" className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
                    <button onClick={handleSubmit} type="submit" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90">Save Post</button>
                </div>
            </div>
        </div>
    );
};

export default ContentManagementPage;