'use client'

import React, { useEffect } from 'react';
import { useRouter, usePathname, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

import { useAppContext } from '@/app/context/useAppContext';
import CommentSection from '../../components/CommentSection';
import { UserRole } from '../../../types';

const BlogPostPage: React.FC = () => {
    const [loading, setLoading] = React.useState(true);

    const pathname = usePathname();
    console.log('pathname:', pathname);

    const router = useRouter();
    const { id } = useParams<{ id: string }>();

    console.log('post id:', id);

    const {
        getSinglePost,
        post,
        role,
        setEditingPostId,
        deletePost,
    } = useAppContext();

    useEffect(() => {
        const fetchPost = async () => {
            setLoading(true);
            await getSinglePost(id);
            setLoading(false);
        };

        fetchPost();
    }, [id, getSinglePost]);

    const handleEdit = () => {
        if (post) {
            // setEditingPostId(id);
            router.push('/admin/content');
        }
    };

    const handleDelete = () => {
        if (post && window.confirm('Are you sure you want to delete this post?')) {
            deletePost(id);
            router.push('/blog');
        }
    };

    if (loading) {
        return (
            <div className="text-center py-20">
                loading...
            </div>
        );
    }

    if (!loading && !post) {
        return (
            <div className="text-center py-20">
                <h1 className="text-3xl font-bold text-text-primary mb-4">
                    Post not found
                </h1>
                <p className="text-text-secondary">
                    The post you are looking for does not exist.
                </p>
                <Link
                    href="/blog"
                    className="mt-6 inline-block bg-primary text-white font-bold px-6 py-2 rounded-md hover:bg-primary/90 transition-colors"
                >
                    Back to Blog
                </Link>
            </div>
        );
    }

    // ✅ Always arrays (never undefined)
    const imageUrls = post?.imageUrls ?? [];
    const additionalImages = imageUrls.slice(1);

    return (
        <article className="max-w-4xl mx-auto">
            {role === UserRole.Admin && (
                <div className="mb-6 p-4 bg-primary/10 rounded-lg flex justify-end items-center space-x-4 border border-primary/20">
                    <p className="font-semibold text-primary mr-auto">
                        Admin Controls
                    </p>
                    <button
                        onClick={handleEdit}
                        className="px-4 py-2 text-sm bg-secondary text-white rounded-md hover:bg-secondary/90"
                    >
                        Edit Post?
                    </button>
                    <button
                        onClick={handleDelete}
                        className="px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                        Delete Post?
                    </button>
                </div>
            )}

            <header className="mb-8 text-center">
                <h1 className="text-4xl md:text-5xl font-extrabold text-primary leading-tight mb-4">
                    {post?.title}
                </h1>
                <div className="text-text-secondary">
                    <span>By {post?.author}</span>
                    <span className="mx-2">&bull;</span>
                    {post?.date && (
                        <span>{new Date(post.date).toLocaleDateString()}</span>
                    )}
                </div>
            </header>

            {imageUrls.length > 0 && post?.title && (
                <Image
                    src={imageUrls[0]}
                    alt={post?.title}
                    className="w-full h-auto object-cover"
                    width={800}
                    height={400}
                />
            )}

            <div
                className="prose lg:prose-xl max-w-none text-text-primary"
                style={{ whiteSpace: 'pre-wrap' }}
            >
                {post?.content}
            </div>

            {additionalImages.length > 0 && (
                <div className="mt-12">
                    <h3 className="text-2xl font-bold text-text-primary mb-6">
                        Gallery
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {additionalImages.map((url: string, index: number) => (
                            <div
                                key={index}
                                className="rounded-lg overflow-hidden shadow-md"
                            >
                                <Image
                                    src={url}
                                    alt={`${post?.title} - image ${index + 2}`}
                                    className="w-full h-full object-cover aspect-square"
                                    width={1000}
                                    height={500}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ✅ comments always an array */}
            <CommentSection postId={id} comments={post?.comments ?? []} />
        </article>
    );
};

export default BlogPostPage;
