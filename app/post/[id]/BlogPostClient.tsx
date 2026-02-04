// app/blog/[id]/BlogPostClient.tsx
'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import CommentSection from '../../components/CommentSection';
import { UserRole } from '@/types';
import { useAppContext } from '@/app/context/useAppContext';
import { useApp } from '../../hooks/useApp';

type Props = {
  post: any;
  role: UserRole;
};

export default function BlogPostClient({ post, role }: Props) {
  const router = useRouter();
  const { deletePost, setEditingPostId } = useAppContext();
  const { user} = useApp();

  const imageUrls = post.imageUrls ?? [];
  const additionalImages = imageUrls.slice(1);

  const handleEdit = () => {
    setEditingPostId(post.id);
    router.push('/admin/content');
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      deletePost(post.id);
      router.push('/blog');
    }
  };

  return (
    <>
      {user?.role && (
        <div className="my-6 p-4 bg-primary/10 rounded-lg flex justify-end space-x-4">
          <button
            onClick={handleEdit}
            className="px-4 py-2 text-sm bg-secondary text-white rounded-md"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 text-sm bg-red-600 text-white rounded-md"
          >
            Delete
          </button>
        </div>
      )}

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
                  alt={`${post.title} - image ${index + 2}`}
                  width={1000}
                  height={500}
                  className="w-full h-full object-cover aspect-square"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <CommentSection
        postId={post.id}
        comments={post.comments ?? []}
      />
    </>
  );
}
