'use client';

import { useEffect, useMemo, useState } from 'react';

type Post = {
  id: string;
  title: string;
  carrousel: boolean;
};

export default function CarouselManager() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);

  /* -------------------------------------------
   * Fetch last 20 posts
   * ----------------------------------------- */
  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch('/api/posts?limit=20');
      const data: Post[] = await res.json();

      setPosts(data);

      // Initialize checkbox state from DB
      const initialState: Record<string, boolean> = {};
      data.forEach(post => {
        initialState[post.id] = post.carrousel;
      });
      setSelected(initialState);
    };

    fetchPosts();
  }, []);

  /* -------------------------------------------
   * Derived state
   * ----------------------------------------- */
  const selectedCount = useMemo(
    () => Object.values(selected).filter(Boolean).length,
    [selected]
  );

  /* -------------------------------------------
   * Toggle checkbox
   * ----------------------------------------- */
  const toggle = (postId: string) => {
    setSelected(prev => {
      const isChecked = prev[postId];

      // Prevent selecting more than 6
      if (!isChecked && selectedCount >= 6) {
        alert('You can select a maximum of 6 posts for the carousel.');
        return prev;
      }

      return {
        ...prev,
        [postId]: !isChecked,
      };
    });
  };

  /* -------------------------------------------
   * Save only changed carrousel flags
   * ----------------------------------------- */
  const saveChanges = async () => {
    setLoading(true);

    try {
      const updates = posts.filter(
        post => selected[post.id] !== post.carrousel
      );

      await Promise.all(
        updates.map(post =>
          fetch(`/api/posts/${post.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              carrousel: selected[post.id],
            }),
          })
        )
      );

      // Sync local state with DB
      setPosts(prev =>
        prev.map(post => ({
          ...post,
          carrousel: selected[post.id],
        }))
      );

      alert('Carousel updated successfully.');
    } catch (error) {
      console.error('Failed to update carousel:', error);
      alert('Failed to save changes.');
    } finally {
      setLoading(false);
    }
  };

  /* -------------------------------------------
   * UI
   * ----------------------------------------- */
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">
        Carousel Manager ({selectedCount}/6)
      </h2>

      <ul className="space-y-2">
        {posts.map(post => (
          <li
            key={post.id}
            className="flex items-center gap-3"
          >
            <input
              type="checkbox"
              checked={!!selected[post.id]}
              onChange={() => toggle(post.id)}
            />
            <span>{post.title}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={saveChanges}
        disabled={loading}
        className="px-4 py-2 rounded bg-black text-white disabled:opacity-50"
      >
        {loading ? 'Saving...' : 'Save'}
      </button>
    </div>
  );
}
