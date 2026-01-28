import prisma from '@/app/lib/prisma'
import { useApp } from './hooks/useApp';
import Carousel from './components/Carousel';
import Link from 'next/link';
import Image from 'next/image';
import SocialLinks from './components/Social';
import { Post } from '@/types';

export const revalidate = 0; // Desabilita cache para sempre buscar dados frescos

type PostPreview = {
  id: string
  title: string
  author: string
  date: string
  excerpt: string
  imageUrls: string[]
  carrousel: boolean
}

export default async function Home() {

  //const posts = await prisma.post.findMany();
  //const recentPosts = posts.slice(0, 3);

  const recentPosts = await prisma.post.findMany({
  orderBy: { date: 'desc' },
  take: 3,
});

  return (
    <div className="space-y-16">
            {/* Featured Posts Carousel */}
            <Carousel />

            {/* Hero Section */}
            <div className="text-center py-16 px-6 bg-primary/5 rounded-lg">
                <h1 className="text-4xl md:text-5xl font-extrabold text-primary">
                    Your Journey to Mental Wellness Starts Here
                </h1>
                <p className="mt-4 text-lg md:text-xl text-text-secondary max-w-3xl mx-auto">
                    Explore insightful articles, practical tips, and compassionate guidance to support your mental health and well-being.
                </p>
                <div className="mt-8 flex justify-center gap-4">
                    <Link href="/blog" className="inline-block bg-primary text-white font-bold text-lg px-8 py-3 rounded-md hover:bg-primary/90 transition-colors">
                        Explore Blog
                    </Link>
                    <Link href="/contact" className="inline-block bg-secondary text-white font-bold text-lg px-8 py-3 rounded-md hover:bg-secondary/90 transition-colors">
                        Contact Us
                    </Link>
                </div>
            </div>

            {/* Recent Blog Posts Section */}
            {recentPosts.length > 0 && (
  <div>
    <h2 className="text-3xl font-bold text-center text-text-primary mb-8">
      Recent Blog Posts
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-2">
            {recentPosts.map(post => (
                <div
                key={post.id}
                className="bg-base-100 rounded-lg shadow-lg overflow-hidden border border-blue-200 flex flex-col group"
                >
                <div className="overflow-hidden rounded-t-lg">
                    <Image
                    src={post.imageUrls[0]}
                    alt={post.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    width={400}
                    height={192}
                    />
                </div>

                <div className="p-6 flex flex-col grow">
                    <h3 className="text-xl font-bold text-primary mb-2">
                    {post.title}
                    </h3>

                    <p className="text-sm text-text-secondary mb-4">
                    By {post.author} on{" "}
                    {new Date(post.date).toLocaleDateString()}
                    </p>

                    <p className="text-text-secondary mb-4 grow">
                    {post.excerpt}
                    </p>

                    <Link
                    href={`/post/${post.id}`}
                    className="self-start mt-auto text-primary font-semibold hover:underline"
                    >
                    Read More &rarr;
                    </Link>
                </div>
                </div>
            ))}
            </div>
        </div>
        )}


            {/* Social Links */}
            <SocialLinks />

        </div>
  );
}