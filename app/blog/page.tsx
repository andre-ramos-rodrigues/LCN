'use client'

import React, { useState, useMemo } from 'react';
import { useRouter} from 'next/navigation';
import Link from 'next/link';
import { useApp } from '../hooks/useApp';
import { UserRole } from '../../types';
import Image from 'next/image';

const BlogPage: React.FC = () => {
    const { posts, role, deletePost, setEditingPostId } = useApp();
    const [searchTerm, setSearchTerm] = useState('');
    const router = useRouter();

    const handleEdit = (postId: string) => {
        setEditingPostId(postId);
        router.push('/admin/content');
    };

    const handleDelete = (postId: string) => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            deletePost(postId);
        }
    };

    const filteredPosts = useMemo(() => {
        return posts.filter(post =>
            post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [posts, searchTerm]);

    return (
        <div className="space-y-12">
            <div className="text-center">
                <h1 className="text-4xl md:text-5xl font-extrabold text-primary">Postagens</h1>
                <p className="mt-4 text-lg text-text-secondary">Artigos sobre psicanálise e psicologia.</p>
            </div>

            <div className="max-w-xl mx-auto">
                <input
                    type="text"
                    placeholder="Pesquisar artigos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-3 bg-base-100 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.length > 0 ? (
                    filteredPosts.map(post => (
                        <div key={post.id} className="bg-base-100 rounded-lg shadow-lg overflow-hidden border border-blue-200 flex flex-col group">
                            <div className="overflow-hidden rounded-t-lg">
                                <Image src={post.imageUrls[0]} alt={post.title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                width={1000}
                                height={500}
                                />
                            </div>
                            <div className="p-6 flex flex-col flex-grow">
                                <h2 className="text-xl font-bold text-primary mb-2">{post.title}</h2>
                                <p className="text-sm text-text-secondary mb-4">Por {post.author} em {new Date(post.date).toLocaleDateString()}</p>

                                <p className="text-text-secondary mb-4 flex-grow">{post.excerpt}</p>
                                <Link href={`/post/${post.id}`} className="self-start mt-auto text-primary font-semibold hover:underline">
                                    Leia mais &rarr;
                                </Link>

                                {role === UserRole.Admin && (
                                    <div className="mt-4 pt-4 border-t flex justify-end space-x-2">
                                        <button onClick={() => handleEdit(post.id)} className="px-3 py-1 text-sm bg-secondary text-white rounded hover:bg-secondary/90">Edit</button>
                                        <button onClick={() => handleDelete(post.id)} className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700">Delete</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-text-secondary md:col-span-2 lg:col-span-3 text-center">Sem postagens ainda.</p>
                )}
            </div>
        </div>
    );
};

export default BlogPage;