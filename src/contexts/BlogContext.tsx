import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { saveToStorage, loadFromStorage } from '../utils/storage';
import { toast } from 'sonner';

// Import the blogs from the new JSON file
import initialBlogs from '../data/blogs.json';

export interface Comment {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  createdAt: Date;
  isAnonymous?: boolean;
}

// Add thumbnailUrl to the interface
export interface Blog {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  thumbnailUrl?: string; // Add this line
  category: string;
  tags: string[];
  likes: string[];
  views: number;
  comments: Comment[];
  createdAt: Date;
  updatedAt: Date;
  isSpotlight?: boolean;
  readTime: number;
}

type SortBy = 'recent' | 'oldest' | 'likes' | 'views';
type SortOrder = 'asc' | 'desc';

interface BlogContextType {
  blogs: Blog[];
  sortBy: SortBy;
  sortOrder: SortOrder;
  setSortBy: (sort: SortBy) => void;
  setSortOrder: (order: SortOrder) => void;
  createBlog: (blogData: Omit<Blog, 'id' | 'authorId' | 'authorName' | 'authorAvatar' | 'likes' | 'views' | 'comments' | 'createdAt' | 'updatedAt' | 'readTime'>) => Promise<string>;
  updateBlog: (id: string, updates: Partial<Blog>) => void;
  deleteBlog: (id: string) => void;
  toggleLikeBlog: (id: string) => void;
  addComment: (blogId: string, content: string, isAnonymous?: boolean) => void;
  deleteComment: (blogId: string, commentId: string) => void;
  incrementViews: (id: string) => void;
  searchBlogs: (query: string) => Blog[];
  getBlogsByCategory: (category: string) => Blog[];
  getBlogsByTag: (tag: string) => Blog[];
  getBlogsByAuthor: (authorId: string) => Blog[];
  getSpotlightBlogs: () => Blog[];
  getSortedBlogs: (blogsToSort?: Blog[]) => Blog[];
  getAllCategories: () => string[];
  getAllTags: () => string[];
  refreshBlogs: () => void;
  getFullBlogContent: (blogId: string) => string;
  isLoading: boolean; // 👈 Add isLoading to the context type
}

const BlogContext = createContext<BlogContextType | undefined>(undefined);

export const useBlog = (): BlogContextType => {
  const context = useContext(BlogContext);
  if (!context) {
    throw new Error('useBlog must be used within a BlogProvider');
  }
  return context;
};

interface BlogProviderProps {
  children: ReactNode;
}

const calculateReadTime = (content: string): number => {
  const wordsPerMinute = 200;
  const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
};

const fullContentStorage = new Map<string, string>();

export const BlogProvider: React.FC<BlogProviderProps> = ({ children }) => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [sortBy, setSortBy] = useState<SortBy>('recent');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [isLoading, setIsLoading] = useState(true); // 👈 Initialize isLoading to true
  const { user } = useAuth();

  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true); // Ensure loading is true before starting

      // Simulate a network delay to guarantee loading screen visibility
      const minimumDelay = new Promise(resolve => setTimeout(resolve, 5000)); // 1-second delay

      try {
        const savedBlogs = loadFromStorage('blogverse_blogs', null);
        let dataToSet: Blog[];

        if (savedBlogs && Array.isArray(savedBlogs) && savedBlogs.length > 0) {
          const blogsWithDates = savedBlogs.map((blog: any) => ({
            ...blog,
            createdAt: new Date(blog.createdAt),
            updatedAt: new Date(blog.updatedAt),
            comments: (blog.comments || []).map((comment: any) => ({
              ...comment,
              createdAt: new Date(comment.createdAt)
            }))
          }));
          
          // Merge saved blogs with initial samples, ensuring no duplicates
          dataToSet = [...blogsWithDates];
          initialBlogs.forEach(sampleBlog => {
            if (!dataToSet.some(savedBlog => savedBlog.id === sampleBlog.id)) {
              dataToSet.push(sampleBlog as Blog);
            }
          });
          
        } else {
          // If no blogs are found in storage, use the initial data and save it
          dataToSet = initialBlogs as Blog[];
          saveToStorage('blogverse_blogs', initialBlogs);
        }

        // Wait for both the data processing and the minimum delay to complete
        await minimumDelay; 
        setBlogs(dataToSet);

      } catch (error) {
        console.error('Error loading or processing blogs:', error);
        setBlogs(initialBlogs as Blog[]); // Fallback to initial data on error
      } finally {
        setIsLoading(false); // 👈 Set isLoading to false after everything is done
      }
    };

    loadInitialData();
  }, []); // Run only once on component mount

  useEffect(() => {
    // Only save to storage if blogs have been loaded and are not empty
    if (blogs.length > 0 && !isLoading) { // Add !isLoading check to prevent saving before initial load
      saveToStorage('blogverse_blogs', blogs);
    }
  }, [blogs, isLoading]); // Depend on blogs and isLoading

  const refreshBlogs = () => {
    // This will trigger a re-render of components consuming blogs,
    // but for true re-fetching, you'd need to call `loadInitialData` again
    // For local storage, simply updating blogs state is sufficient.
    setBlogs(prevBlogs => [...prevBlogs]); 
  };

  const getFullBlogContent = (blogId: string): string => {
    const fullContent = fullContentStorage.get(blogId);
    if (fullContent) return fullContent;
    
    const blog = blogs.find(b => b.id === blogId);
    return blog?.content || '';
  };

  const createBlog = async (blogData: Omit<Blog, 'id' | 'authorId' | 'authorName' | 'authorAvatar' | 'likes' | 'views' | 'comments' | 'createdAt' | 'updatedAt' | 'readTime'>): Promise<string> => {
    if (!user) {
      toast.error('Please log in to create blog');
      throw new Error('User must be logged in to create blog');
    }

    const blogId = `blog_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    if (blogData.content.length > 1000) {
      fullContentStorage.set(blogId, blogData.content);
    }

    const newBlog: Blog = {
      ...blogData,
      id: blogId,
      authorId: user.id,
      authorName: user.username,
      authorAvatar: user.avatar,
      likes: [],
      views: Math.floor(Math.random() * 100) + 1,
      comments: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      readTime: calculateReadTime(blogData.content),
    };

    setBlogs(prev => [newBlog, ...prev]);
    
    toast.success('Blog post published successfully! 🎉');
    return blogId;
  };

  const updateBlog = (id: string, updates: Partial<Blog>) => {
    setBlogs(prev => prev.map(blog => 
      blog.id === id 
        ? { 
            ...blog, 
            ...updates, 
            updatedAt: new Date(),
            readTime: updates.content ? calculateReadTime(updates.content) : blog.readTime
          }
        : blog
    ));
  };

  const deleteBlog = (id: string) => {
    setBlogs(prev => prev.filter(blog => blog.id !== id));
    fullContentStorage.delete(id);
  };

  const toggleLikeBlog = (id: string) => {
    if (!user) {
      toast.error('Please log in to like posts');
      return;
    }

    setBlogs(prev => prev.map(blog => {
      if (blog.id === id) {
        const hasLiked = blog.likes.includes(user.id);
        const newLikes = hasLiked
          ? blog.likes.filter(userId => userId !== user.id)
          : [...blog.likes, user.id];
        
        toast.success(hasLiked ? 'Removed like' : 'Post liked! ❤️');
        
        return {
          ...blog,
          likes: newLikes
        };
      }
      return blog;
    }));
  };

  const addComment = (blogId: string, content: string, isAnonymous = false) => {
    if (!user && !isAnonymous) {
      toast.error('Please log in to comment');
      return;
    }

    const newComment: Comment = {
      id: `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      authorId: isAnonymous ? 'anonymous' : user!.id,
      authorName: isAnonymous ? 'Anonymous' : user!.username,
      authorAvatar: isAnonymous ? undefined : user!.avatar,
      content,
      createdAt: new Date(),
      isAnonymous,
    };

    setBlogs(prev => prev.map(blog => 
      blog.id === blogId 
        ? { ...blog, comments: [...blog.comments, newComment] }
        : blog
    ));

    toast.success('Comment added! 💬');
  };

  const deleteComment = (blogId: string, commentId: string) => {
    if (!user) return; // Only allow logged-in users to delete comments

    setBlogs(prev => prev.map(blog => 
      blog.id === blogId 
        ? { 
            ...blog, 
            comments: blog.comments.filter(comment => 
              comment.id !== commentId || 
              (comment.authorId !== user.id && !user.id.startsWith('admin')) // Allow authors or admins to delete
            )
          }
        : blog
    ));

    toast.success('Comment deleted');
  };

  const incrementViews = (id: string) => {
    setBlogs(prev => prev.map(blog => 
      blog.id === id 
        ? { ...blog, views: blog.views + 1 }
        : blog
    ));
  };

  const searchBlogs = (query: string): Blog[] => {
    const lowercaseQuery = query.toLowerCase();
    return blogs.filter(blog =>
      blog.title.toLowerCase().includes(lowercaseQuery) ||
      blog.excerpt.toLowerCase().includes(lowercaseQuery) ||
      blog.content.toLowerCase().includes(lowercaseQuery) ||
      blog.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
      blog.category.toLowerCase().includes(lowercaseQuery) ||
      blog.authorName.toLowerCase().includes(lowercaseQuery)
    );
  };

  const getBlogsByCategory = (category: string): Blog[] => {
    return blogs.filter(blog => blog.category === category);
  };

  const getBlogsByTag = (tag: string): Blog[] => {
    return blogs.filter(blog => blog.tags && blog.tags.includes(tag));
  };

  const getBlogsByAuthor = (authorId: string): Blog[] => {
    return blogs.filter(blog => blog.authorId === authorId);
  };

  const getSpotlightBlogs = (): Blog[] => {
    // Filter for spotlight blogs and sort by likes as a tie-breaker
    return blogs.filter(blog => blog.isSpotlight).sort((a,b) => (b.likes?.length || 0) - (a.likes?.length || 0));
  };

  const getSortedBlogs = (blogsToSort: Blog[] = blogs): Blog[] => {
    const sorted = [...blogsToSort].sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'recent':
          comparison = b.createdAt.getTime() - a.createdAt.getTime();
          break;
        case 'oldest':
          comparison = a.createdAt.getTime() - b.createdAt.getTime();
          break;
        case 'likes':
          comparison = b.likes.length - a.likes.length;
          break;
        case 'views':
          comparison = b.views - a.views;
          break;
        default:
          comparison = b.createdAt.getTime() - a.createdAt.getTime();
      }
      
      return sortOrder === 'desc' ? comparison : -comparison;
    });
    
    return sorted;
  };

  const getAllCategories = (): string[] => {
    const categories = [...new Set(blogs.map(blog => blog.category))];
    return categories.sort();
  };

  const getAllTags = (): string[] => {
    const tags = [...new Set(blogs.flatMap(blog => blog.tags || []))];
    return tags.sort();
  };

  const value: BlogContextType = {
    blogs,
    sortBy,
    sortOrder,
    setSortBy,
    setSortOrder,
    createBlog,
    updateBlog,
    deleteBlog,
    toggleLikeBlog,
    addComment,
    deleteComment,
    incrementViews,
    searchBlogs,
    getBlogsByCategory,
    getBlogsByTag,
    getBlogsByAuthor,
    getSpotlightBlogs,
    getSortedBlogs,
    getAllCategories,
    getAllTags,
    refreshBlogs,
    getFullBlogContent,
    isLoading, // 👈 Provide isLoading via context
  };

  return (
    <BlogContext.Provider value={value}>
      {children}
    </BlogContext.Provider>
  );
};