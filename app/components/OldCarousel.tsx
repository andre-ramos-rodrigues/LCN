'use client'

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useApp } from '../hooks/useApp';
import Image from 'next/image';

const Carousel: React.FC = () => {
    const { posts, carouselPostIds } = useApp();
    const [currentIndex, setCurrentIndex] = useState(0);

    //const carouselPosts = posts.filter(post => carouselPostIds.includes(post.id));
    const carouselPosts = posts.filter(post => post.carrousel === true)

    const goToNext = useCallback(() => {
        if (carouselPosts.length > 1) {
            const isLastSlide = currentIndex === carouselPosts.length - 1;
            const newIndex = isLastSlide ? 0 : currentIndex + 1;
            setCurrentIndex(newIndex);
        }
    }, [currentIndex, carouselPosts.length]);

    useEffect(() => {
        const timer = setTimeout(goToNext, 8000);
        return () => clearTimeout(timer);
    }, [currentIndex, goToNext]);

    if (carouselPosts.length === 0) {
        return (
            <div className="text-center py-10 bg-gray-100 rounded-lg">
                <p className="text-text-secondary">No featured posts selected. Admin can select posts in the Content Management page.</p>
            </div>
        );
    }
    
    const currentPost = carouselPosts[currentIndex];

    return (
        <div className="relative max-w-5xl mx-auto h-[500px] rounded-lg overflow-hidden shadow-2xl group">
             {/* Slides */}
            {carouselPosts.map((post, index) => (
                <div key={post.id} className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}>
                    <Image 
                        src={post.imageUrls[0]} 
                        alt={post.title} 
                        className="w-full h-full object-cover"
                        width={1000}
                        height={500}
                        priority={index === currentIndex}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
                </div>
            ))}
            
             {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white z-10">
                <h3 className="text-4xl font-bold">{currentPost.title}</h3>
                <p className="mt-2 text-lg opacity-90 max-w-3xl">{currentPost.excerpt}</p>
                <Link href={`/post/${currentPost.id}`} className="mt-4 inline-block bg-primary text-white font-semibold px-6 py-2 rounded-md hover:bg-primary/90 transition-colors">
                    Read More
                </Link>
            </div>

            {/* Navigation Dots */}
            {carouselPosts.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
                    {carouselPosts.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`w-3 h-3 rounded-full transition-colors ${currentIndex === index ? 'bg-primary' : 'bg-white/50 hover:bg-white'}`}
                            aria-label={`Go to slide ${index + 1}`}
                        ></button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Carousel;