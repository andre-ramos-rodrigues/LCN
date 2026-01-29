'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';

type CarouselPost = {
    id: string;
    title: string;
    excerpt: string;
    imageUrls: string[];
};

type Props = {
    posts: CarouselPost[];
};

const CarouselClient: React.FC<Props> = ({ posts }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const goToNext = useCallback(() => {
        if (posts.length > 1) {
            setCurrentIndex(prev =>
                prev === posts.length - 1 ? 0 : prev + 1
            );
        }
    }, [posts.length]);

    useEffect(() => {
        const timer = setTimeout(goToNext, 8000);
        return () => clearTimeout(timer);
    }, [currentIndex, goToNext]);

    const currentPost = posts[currentIndex];

    return (
        <div className="relative max-w-5xl mx-auto h-[500px] rounded-lg overflow-hidden shadow-2xl group">
            {/* Slides */}
            {posts.map((post, index) => (
                <div
                    key={post.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ${
                        index === currentIndex ? 'opacity-100' : 'opacity-0'
                    }`}
                >
                    <Image
                        src={post.imageUrls[0]}
                        alt={post.title}
                        className="w-full h-full object-cover"
                        width={1000}
                        height={500}
                        priority={index === currentIndex}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
                </div>
            ))}

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white z-10">
                <h3 className="text-4xl font-bold">{currentPost.title}</h3>
                <p className="mt-2 text-lg opacity-90 max-w-3xl">
                    {currentPost.excerpt}
                </p>
                <Link
                    href={`/post/${currentPost.id}`}
                    className="mt-4 inline-block bg-primary px-6 py-2 rounded-md"
                >
                    Leia mais
                </Link>
            </div>

            {/* Dots */}
            {posts.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                    {posts.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`w-3 h-3 rounded-full ${
                                index === currentIndex
                                    ? 'bg-primary'
                                    : 'bg-white/50'
                            }`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default CarouselClient;
