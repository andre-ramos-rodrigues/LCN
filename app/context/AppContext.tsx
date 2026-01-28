'use client'

import React, { createContext, useState, useCallback, useMemo, useEffect } from 'react';
import { Post, Comment, Message, UserRole, Theme } from '../../types';

interface UserData {
    id: number;
    email: string;
    name: string | null;
    role: UserRole;
}

interface AppContextType {
    role: UserRole;
    setRole: (role: UserRole) => void;
    user: UserData | null;
    setUser: (user: UserData | null) => void;
    logout: () => void;
    posts: Post[];
    messages: Message[];
    addMessage: (messageData: { name: string; email: string; message: string; }) => Promise<void>;
    addComment: (postId: string, commentData: { author: string; content: string; }) => Promise<void>;
    approveComment: (postId: string, commentId: string) => Promise<void>;
    carouselPostIds: string[];
    toggleCarouselPost: (postId: string) => void;
    editingPostId: string | null;
    setEditingPostId: (postId: string | null) => void;
    loading: boolean;
    deletePost: (postId: string) => void;
    getSinglePost: (postId: string) => Promise<Post | undefined>;
    post: Post | undefined;
    addPost: (
      data: {
        title: string;
        content: string;
        excerpt: string;
        imageUrls: string[];
      }
    ) => Promise<Post | undefined>;
    updatePost: (
  postId: string,
  data: {
    title: string;
    content: string;
    author: string;
    excerpt: string;
    imageUrls: string[];
  }
) => Promise<Post | undefined>;
    updateTheme: (data: Partial<{ primaryColor: string; secondaryColor: string; accentColor: string; base100Color: string; textPrimaryColor: string; textSecondaryColor: string; headerText: string; footerText: string;}>) => Promise<Theme | undefined>;
    patchPost: (postId: string, data: Partial<{ title: string; content: string; author: string; excerpt: string; imageUrls: string[]; carrousel: boolean }>) => Promise<Post | undefined>;
    getSocials: () => Promise<any>;
    createSocial: (data: { title: string; link: string; logo: string; order?: number }) => Promise<any>;
  }

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [role, setRole] = useState<UserRole>(UserRole.Visitor);
    const [user, setUser] = useState<UserData | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [carouselPostIds, setCarouselPostIds] = useState<string[]>([]);
    const [editingPostId, setEditingPostId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [post, setPost] = useState<Post | undefined>(undefined);

    // Load user from localStorage on mount
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const userData = JSON.parse(storedUser);
                setUser(userData);
                setRole(userData.role);
            } catch (error) {
                console.error('Failed to parse stored user:', error);
            }
        }
        setLoading(false);
    }, []);

    // Save user to localStorage whenever it changes
    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
    }, [user]);

    const logout = useCallback(() => {
        setUser(null);
        setRole(UserRole.Visitor);
        localStorage.removeItem('user');
    }, []);

    // Fetch posts from database on mount
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch('/api/posts');
                if (response.ok) {
                    const data = await response.json();
                    setPosts(data);
                    if (data.length >= 2) {
                        setCarouselPostIds([data[0].id, data[1].id]);
                    } else if (data.length > 0) {
                        setCarouselPostIds([data[0].id]);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch posts:', error);
            }
        };

        fetchPosts();
    }, []);

    const addMessage = useCallback(async (messageData: { name: string; email: string; message: string; }) => {
        try {
            const response = await fetch('/api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(messageData),
            });
            if (response.ok) {
                const newMessage = await response.json();
                setMessages(prev => [...prev, newMessage]);
            }
        } catch (error) {
            console.error('Failed to add message:', error);
            throw error;
        }
    }, []);

    const addComment = useCallback(async (postId: string, commentData: { author: string; content: string; }) => {
        try {
            const response = await fetch(`/api/posts/${postId}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(commentData),
            });
            if (response.ok) {
                // Refresh posts to get updated comments
                const postsResponse = await fetch('/api/posts');
                if (postsResponse.ok) {
                    const updatedPosts = await postsResponse.json();
                    setPosts(updatedPosts);
                }
            }
        } catch (error) {
            console.error('Failed to add comment:', error);
            throw error;
        }
    }, []);

    const approveComment = useCallback(async (postId: string, commentId: string) => {
        try {
            const response = await fetch(`/api/posts/${postId}/comments/${commentId}/approve`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
            });
            if (response.ok) {
                // Refresh posts to get updated comments
                const postsResponse = await fetch('/api/posts');
                if (postsResponse.ok) {
                    const updatedPosts = await postsResponse.json();
                    setPosts(updatedPosts);
                }
            }
        } catch (error) {
            console.error('Failed to approve comment:', error);
            throw error;
        }
    }, []);

    const toggleCarouselPost = useCallback((postId: string) => {
        setCarouselPostIds(prev => {
            if (prev.includes(postId)) {
                return prev.filter(id => id !== postId);
            }
            return [...prev, postId];
        });
    }, []);

    const getSinglePost = useCallback(async (postId: string) => {
        console.log('Fetching single post with id:', postId);

    try {
        const response = await fetch(`/api/singlePost/${postId}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            //body: JSON.stringify({ id: postId }),
        });
        if (!response.ok) {
            throw new Error('Post not found');
        }

        const data = await response.json();
        setPost(data);
        console.log('Fetched post data:', data);
        return data;
    } catch (error) {
        console.error('Failed to fetch post:', error);
        setPost(undefined);
        return undefined;
    }
}, []);

    const addPost = useCallback( 
  async (
    data: {
      title: string;
      content: string;
      //author: string;
      excerpt: string;
      imageUrls: string[];
    }) => {
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          authorId: user?.name,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create post');
      }

      const newPost = await response.json();

      setPosts(prev => [newPost, ...prev]);
      return newPost;
    } catch (error) {
      console.error('Add post error:', error);
      return undefined;
    }
  },
  [user]
);

const deletePost = useCallback(async (postId: string) => {
  try {
    const response = await fetch(`/api/posts/${postId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete post');
    }

    setPosts(prev => prev.filter(post => post.id !== postId));

    setPost(prev => (prev?.id === postId ? undefined : prev));
  } catch (error) {
    console.error('Delete post error:', error);
  }
}, []);

    
const updatePost = useCallback(
  async (
    postId: string,
    data: {
      title: string;
      content: string;
      author: string;
      excerpt: string;
      imageUrls: string[];
    }
  ) => {
    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data), // ✅ no postId here
      });

      if (!response.ok) {
        throw new Error('Failed to update post');
      }

      const updatedPost = await response.json();

      setPosts(prev =>
        prev.map(post =>
          post.id === postId ? updatedPost : post
        )
      );

      setPost(updatedPost);
      return updatedPost;
    } catch (error) {
      console.error('Update post error:', error);
      return undefined;
    }
  },
  []
);

const patchPost = useCallback(
  async (
    postId: string,
    data: Partial<{
      title: string;
      content: string;
      author: string;
      excerpt: string;
      imageUrls: string[];
      carrousel: boolean;
    }>
  ) => {
    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to patch post');
      }

      const updatedPost = await response.json();

      // Update posts list
      setPosts(prev =>
        prev.map(post =>
          post.id === postId ? updatedPost : post
        )
      );

      // Update single post state (if opened)
      setPost(updatedPost);

      return updatedPost;
    } catch (error) {
      console.error('Patch post error:', error);
      return undefined;
    }
  },
  []
);

  const getSocials = useCallback( async () => {
  const res = await fetch('/api/socials', { cache: 'no-store' });
  return res.json();
}, [])

const createSocial = useCallback(async (data: {
  title: string;
  link: string;
  logo: string;
  order?: number;
}) => {
  const res = await fetch('/api/socials', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  return res.json();
}, []);

    const updateTheme = useCallback(
        async (
          data: Partial<{
            primaryColor: string;
            secondaryColor: string;
            accentColor: string;
            base100Color: string;
            textPrimaryColor: string;
            textSecondaryColor: string;
            headerText: string;
            footerText: string;
          }>
        ) => {
          try {
            const response = await fetch('/api/theme', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(data),
            });

            if (!response.ok) {
              throw new Error('Failed to update theme');
            }

            const updatedTheme = await response.json();

            // ✅ update theme in context
            //setTheme(updatedTheme);

            return updatedTheme;
          } catch (error) {
            console.error('Update theme error:', error);
            return undefined;
          }
        },
        []
      );


    const value = useMemo(() => ({
        role,
        setRole,
        user,
        setUser,
        logout,
        posts,
        messages,
        addMessage,
        addComment,
        approveComment,
        carouselPostIds,
        toggleCarouselPost,
        editingPostId,
        setEditingPostId,
        loading,
        getSinglePost,
        post,
        addPost,
        updatePost,
        deletePost,
        patchPost,
        updateTheme,
        getSocials,
        createSocial,
    }), [role, user, posts, messages, carouselPostIds, post, editingPostId, loading, addMessage, addComment, approveComment, logout, toggleCarouselPost, getSinglePost, addPost,
updatePost, deletePost, patchPost, updateTheme, getSocials, createSocial]);

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};
