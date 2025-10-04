import React, { createContext, useContext, useState, useEffect, ReactNode, Component } from 'react';
import { useAuth } from './AuthContext'; // Assuming AuthContext is correctly implemented in your project
import { saveToStorage, loadFromStorage } from '../utils/storage'; // Assuming these utilities are correctly implemented in your project
import { toast } from 'sonner'; // Assuming sonner is installed

// Import the blogs from the new JSON file
import initialBlogs from '../data/blogs.json'; // Ensure this path is correct in your project

// --- ErrorBoundary Component ---
// This component catches unhandled JavaScript errors in its children.
// If an error occurs, it displays a fallback UI and reloads the page.
export interface ErrorBoundaryProps {
  children: React.ReactNode;
}

export interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    console.error("ErrorBoundary: An unhandled error occurred:", error);
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary: ComponentDidCatch caught an error:", error, errorInfo);
    // Automatically refresh the page after a short delay
    setTimeout(() => {
      window.location.reload();
    }, 3000); // Refresh after 3 seconds
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-red-900/70 backdrop-blur-sm text-white flex-col space-y-4">
          <div className="p-4 rounded-md bg-red-700 text-white border border-red-800">
            <p className="text-center text-lg">
              Looks like your connection is unstable or an unexpected error occurred.
            </p>
            <p className="text-center text-lg">Refreshing the page in 3 seconds...</p>
          </div>
          <p className="text-sm text-white/80">Please wait while we try to restore your experience.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

// --- Blog Interfaces ---
export interface Comment {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  createdAt: Date;
  isAnonymous?: boolean;
}

export interface Blog {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  thumbnailUrl?: string;
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

// --- BlogContextType ---
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
  isLoading: boolean;
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

/**
 * Utility to ensure a value is a Date object.
 * If the value is a string that can be parsed as a date, it converts it.
 * Otherwise, it returns a fallback Date (defaulting to the current time).
 */
const ensureDate = (dateValue: any, fallbackDate: Date = new Date()): Date => {
  if (dateValue instanceof Date) {
    return dateValue;
  }
  if (typeof dateValue === 'string') {
    const parsedDate = new Date(dateValue);
    // Check if the parsed date is valid
    if (!isNaN(parsedDate.getTime())) {
      return parsedDate;
    }
  }
  // If not a Date object or a valid date string, return fallback and warn
  console.warn(`Invalid date value "${dateValue}". Using fallback date.`);
  return fallbackDate;
};


export const BlogProvider: React.FC<BlogProviderProps> = ({ children }) => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [sortBy, setSortBy] = useState<SortBy>('recent');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth(); // Assuming useAuth is correctly implemented

  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);

      // Simulate a network delay to guarantee loading screen visibility
      const minimumDelay = new Promise(resolve => setTimeout(resolve, 3000)); // Minimum 1-second delay

      try {
        const savedBlogs = loadFromStorage('blogverse_blogs', null);
        let dataToSet: Blog[];

        if (savedBlogs && Array.isArray(savedBlogs) && savedBlogs.length > 0) {
          // Process saved blogs: ensure all date fields are proper Date objects
          const blogsWithDates: Blog[] = savedBlogs.map((blog: any) => ({
            ...blog,
            createdAt: ensureDate(blog.createdAt),
            updatedAt: ensureDate(blog.updatedAt),
            comments: (blog.comments || []).map((comment: any) => ({
              ...comment,
              createdAt: ensureDate(comment.createdAt)
            }))
          }));
          
          // Start with processed saved blogs
          dataToSet = [...blogsWithDates];

          // Merge initialBlogs, ensuring no duplicates and that they also have Date objects
          (initialBlogs as Blog[]).forEach(sampleBlog => {
            if (!dataToSet.some(savedBlog => savedBlog.id === sampleBlog.id)) {
              dataToSet.push({
                ...sampleBlog,
                createdAt: ensureDate(sampleBlog.createdAt),
                updatedAt: ensureDate(sampleBlog.updatedAt),
                comments: (sampleBlog.comments || []).map((comment: any) => ({
                  ...comment,
                  createdAt: ensureDate(comment.createdAt)
                }))
              });
            }
          });
          
        } else {
          // If no blogs are found in storage, use the initial data and save it
          // Ensure initial blogs are also processed to have Date objects
          dataToSet = (initialBlogs as Blog[]).map(blog => ({
            ...blog,
            createdAt: ensureDate(blog.createdAt),
            updatedAt: ensureDate(blog.updatedAt),
            comments: (blog.comments || []).map((comment: any) => ({
                ...comment,
                createdAt: ensureDate(comment.createdAt)
            }))
          }));
          saveToStorage('blogverse_blogs', dataToSet); // Save processed initial data
        }

        await minimumDelay;
        setBlogs(dataToSet);

      } catch (error) {
        console.error('Error loading or processing blogs:', error);
        // Fallback to initial data (ensuring dates are processed) on error
        const fallbackData = (initialBlogs as Blog[]).map(blog => ({
            ...blog,
            createdAt: ensureDate(blog.createdAt),
            updatedAt: ensureDate(blog.updatedAt),
            comments: (blog.comments || []).map((comment: any) => ({
                ...comment,
                createdAt: ensureDate(comment.createdAt)
            }))
        }));
        setBlogs(fallbackData);
        toast.error('Failed to load blogs. Displaying default data.');
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []); // Run only once on component mount

  useEffect(() => {
    // Only save to storage if blogs have been loaded and are not empty
    // and isLoading is false (meaning initial load is complete)
    if (blogs.length > 0 && !isLoading) {
      saveToStorage('blogverse_blogs', blogs);
    }
  }, [blogs, isLoading]);

  const refreshBlogs = () => {
    // This will trigger a re-render of components consuming blogs,
    // and effectively re-sort them based on current sortBy/sortOrder.
    // For local storage, simply updating blogs state (even with a copy) is sufficient
    // to trigger effects that depend on it.
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
    
    if (blogData.content.length > 1000) { // Example for potentially storing large content separately
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
      createdAt: new Date(), // Always create new Date objects for new blogs
      updatedAt: new Date(), // Always create new Date objects for new blogs
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
            updatedAt: new Date(), // Update timestamp on update
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
      createdAt: new Date(), // Always create new Date objects for new comments
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
    // Only allow logged-in users to delete comments, or if they are the author/admin
    if (!user) {
      toast.error('Please log in to delete comments.');
      return;
    }

    setBlogs(prev => prev.map(blog => 
      blog.id === blogId 
        ? { 
            ...blog, 
            comments: blog.comments.filter(comment => 
              comment.id !== commentId || 
              (comment.authorId !== user.id && !user.id.startsWith('admin')) // Restrict deletion to author or admin
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
    return blogs.filter(blog => blog.isSpotlight).sort((a,b) => (b.likes?.length || 0) - (a.likes?.length || 0));
  };

  const getSortedBlogs = (blogsToSort: Blog[] = blogs): Blog[] => {
    // At this point, due to `useEffect` and `createBlog` logic,
    // `createdAt` should already be a Date object.
    // However, we add a defensive `ensureDate` call as a final safeguard.
    const sorted = [...blogsToSort].sort((a, b) => {
      let comparison = 0;
      
      const dateA = ensureDate(a.createdAt);
      const dateB = ensureDate(b.createdAt);

      switch (sortBy) {
        case 'recent':
          comparison = dateB.getTime() - dateA.getTime();
          break;
        case 'oldest':
          comparison = dateA.getTime() - dateB.getTime();
          break;
        case 'likes':
          comparison = (b.likes?.length || 0) - (a.likes?.length || 0);
          break;
        case 'views':
          comparison = b.views - a.views;
          break;
        default:
          comparison = dateB.getTime() - dateA.getTime(); // Default to recent if sortBy is unexpected
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
    blogs: getSortedBlogs(), // Provide already sorted blogs to context consumers
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
    isLoading,
  };

  return (
    <BlogContext.Provider value={value}>
      {children}
    </BlogContext.Provider>
  );
};
