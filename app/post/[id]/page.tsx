// app/post/[id]/page.tsx
import Image from 'next/image';
import Link from 'next/link';
import prisma from '@/app/lib/prisma';
import { UserRole } from '@/types';
import BlogPostClient from './BlogPostClient';

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function BlogPostPage({ params }: PageProps) {
  const { id } = await params; // ✅ AQUI está a correção

  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      comments: true,
    },
  });

  if (!post) {
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
          className="mt-6 inline-block bg-primary text-white font-bold px-6 py-2 rounded-md"
        >
          Back to Blog
        </Link>
      </div>
    );
  }

  const role = UserRole.Admin; // ou vindo do auth

  return (
    <article className="max-w-4xl mx-auto">
      <header className="mb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-4">
          {post.title}
        </h1>
        <div className="text-text-secondary">
          <span>By {post.author}</span>
          <span className="mx-2">&bull;</span>
          <span>{new Date(post.date).toLocaleDateString()}</span>
        </div>
      </header>

      {post.imageUrls.length > 0 && (
        <Image
          src={post.imageUrls[0]}
          alt={post.title}
          width={800}
          height={400}
          className="w-full h-auto object-cover"
        />
      )}

      <div
        className="prose lg:prose-xl max-w-none text-text-primary"
        style={{ whiteSpace: 'pre-wrap' }}
      >
        {post.content}
      </div>

      <BlogPostClient post={post} role={role} />
    </article>
  );
}
