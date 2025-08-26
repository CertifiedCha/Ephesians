import React, { useState, useEffect, useMemo, memo } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { BlogCard } from './components/BlogCard';
import { SpotlightSection } from './components/SpotlightSection';
import { AuthModal } from './components/AuthModal';
import { BlogEditor } from './components/BlogEditor';
import { BlogDetailView } from './components/BlogDetailView';
import { LoadingScreen } from './components/LoadingScreen';
import { Button } from './components/ui/button';
import { AuthProvider } from './contexts/AuthContext';
import { BlogProvider, useBlog, Blog } from './contexts/BlogContext';
import { Toaster } from './components/ui/sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { FilterSortBar, SortOption } from './components/FilterSortBar';
import { authorsAndUsersData } from './data/authors';

type ViewMode = 'home' | 'editor' | 'detail';

// Simple background components (memoized)
const FloatingOrbs = memo(() => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
    {[...Array(6)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-64 h-64 rounded-full opacity-10"
        style={{
          background: `linear-gradient(135deg, ${
            ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'][i]
          }, transparent)`,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
        animate={{
          x: [0, 100, -50, 0],
          y: [0, -100, 50, 0],
          scale: [1, 1.2, 0.8, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 20 + i * 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: i * 2,
        }}
      />
    ))}
  </div>
));

const ParticleField = memo(() => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
    {[...Array(50)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-1 h-1 bg-primary/20 rounded-full"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
        animate={{
          y: [0, -window.innerHeight],
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: 10 + Math.random() * 10,
          repeat: Infinity,
          delay: Math.random() * 5,
          ease: "linear",
        }}
      />
    ))}
  </div>
));

const AppContent: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark' || savedTheme === null;
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedSort, setSelectedSort] = useState<SortOption>('newest');
  const [showAuth, setShowAuth] = useState(false);
  const [authType, setAuthType] = useState<'login' | 'signup'>('login');
  const [currentView, setCurrentView] = useState<ViewMode>('home');
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [selectedAuthor, setSelectedAuthor] = useState<string | null>(null);

  const {
    blogs,
    isLoading,
    toggleLikeBlog,
    refreshBlogs,
  } = useBlog();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    if (newTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    blogs.forEach(blog => {
      if (blog.tags) {
        blog.tags.forEach(tag => tags.add(tag));
      }
    });
    return Array.from(tags).sort();
  }, [blogs]);

  const selectedAuthorName = useMemo(() => {
    if (!selectedAuthor) return null;
    return authorsAndUsersData[selectedAuthor]?.name || 'Unknown Author';
  }, [selectedAuthor]);

  const filteredBlogs = useMemo(() => {
    let result = [...blogs];

    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      result = result.filter(blog =>
        blog.title.toLowerCase().includes(lowerCaseQuery) ||
        blog.content.toLowerCase().includes(lowerCaseQuery)
      );
    }

    if (selectedCategory) {
      result = result.filter(blog => blog.category === selectedCategory);
    }
    
    if (selectedAuthor) {
      result = result.filter(blog => blog.authorId === selectedAuthor);
    }

    if (selectedTags.length > 0) {
      result = result.filter(blog => selectedTags.some(tag => blog.tags && blog.tags.includes(tag)));
    }

    switch (selectedSort) {
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'views':
        result.sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
      case 'likes':
        result.sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0));
        break;
    }

    return result;
  }, [blogs, searchQuery, selectedCategory, selectedAuthor, selectedTags, selectedSort]);

  const spotlightBlogs = useMemo(() => {
    return [...blogs].sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0)).slice(0, 6);
  }, [blogs]);

  const handleShowAuth = (type: 'login' | 'signup') => {
    setAuthType(type);
    setShowAuth(true);
  };

  const handleBlogClick = (blog: Blog) => {
    setSelectedBlog(blog);
    setCurrentView('detail');
  };

  const handleLikeBlog = (blogId: string) => {
    toggleLikeBlog(blogId);
  };

  const handleShowEditor = () => {
    setCurrentView('editor');
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setSelectedBlog(null);
    refreshBlogs();
  };

  const toggleAuthType = () => {
    setAuthType(authType === 'login' ? 'signup' : 'login');
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prevTags =>
      prevTags.includes(tag) ? prevTags.filter(t => t !== tag) : [...prevTags, tag]
    );
  };

  const handleClearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory(null);
    setSelectedAuthor(null);
    setSelectedTags([]);
    setSelectedSort('newest');
  };
  
  const handleAuthorSelect = (authorId: string | null) => {
    setSelectedAuthor(authorId);
    setSelectedCategory(null);
    setSelectedTags([]);
  };

  if (isLoading) {
    return (
      <LoadingScreen
        message="Welcome to Ephesians Blog"
        size="full"
      />
    );
  }

  if (currentView === 'editor') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <BlogEditor onBack={handleBackToHome} />
      </motion.div>
    );
  }

  if (currentView === 'detail' && selectedBlog) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <BlogDetailView blog={selectedBlog} onBack={handleBackToHome} />
      </motion.div>
    );
  }

  return (
    <div className="relative overflow-hidden">
      <motion.div
        className="min-h-screen bg-background relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Background Elements */}
        <FloatingOrbs />
        <ParticleField />
        
        {/* Animated gradient overlay */}
        <motion.div
          className="fixed inset-0 bg-gradient-to-br from-background/50 via-transparent to-background/30 pointer-events-none z-0"
          animate={{
            background: isDarkMode 
              ? [
                  "radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)",
                  "radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)",
                  "radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)"
                ]
              : [
                  "radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.05) 0%, transparent 50%)",
                  "radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.05) 0%, transparent 50%)",
                  "radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.05) 0%, transparent 50%)"
                ]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* FIXED HEADER */}
        <motion.div
          className="fixed top-0 left-0 right-0 h-16 z-50 bg-background/80 backdrop-blur-md transition-colors"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
        >
          <Header
            onSearch={setSearchQuery}
            onToggleTheme={toggleTheme}
            isDarkMode={isDarkMode}
            onShowAuth={handleShowAuth}
            onShowCreateBlog={handleShowEditor}
            onToggleSidebar={toggleSidebar}
            isSidebarOpen={isSidebarOpen}
          />
        </motion.div>

        {/* FIXED SIDEBAR CONTAINER */}
        <motion.div
          initial={{ width: '16rem' }}
          animate={{ width: isSidebarOpen ? '16rem' : '4rem' }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="hidden md:block fixed top-16 left-0 h-[calc(100vh-4rem)] overflow-y-auto z-40 bg-background/80 backdrop-blur-md transition-colors"
        >
          <Sidebar
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
            selectedAuthor={selectedAuthor}
            onAuthorSelect={handleAuthorSelect}
            onSortSelect={setSelectedSort}
            onClearAllFilters={handleClearAllFilters}
            isCollapsed={!isSidebarOpen}
            onToggle={toggleSidebar}
          />
        </motion.div>

        {/* MAIN CONTENT WRAPPER */}
        <div className={`relative z-10 pt-16 transition-all duration-300 ${isSidebarOpen ? 'md:pl-64' : 'md:pl-16'}`}>
          <main className="flex-1 p-8 max-w-none">
            <div className="max-w-4xl mx-auto">
              {/* Spotlight section */}
              {spotlightBlogs.length > 0 && (
                <motion.div
                  initial={{ y: 100, opacity: 0, scale: 0.9 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  transition={{ duration: 1, delay: 0.4, type: "spring" }}
                >
                  <SpotlightSection
                    blogs={spotlightBlogs}
                    onBlogClick={handleBlogClick}
                  />
                </motion.div>
              )}

              {/* Main blog grid section */}
              <motion.section
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                {/* Filter and Sort Bar */}
                <FilterSortBar
                  allTags={allTags}
                  selectedTags={selectedTags}
                  selectedSort={selectedSort}
                  onTagToggle={handleTagToggle}
                  onSortSelect={setSelectedSort}
                  onClearFilters={handleClearAllFilters}
                  showClearButton={
                    !!searchQuery || selectedCategory !== null || selectedAuthor !== null || selectedTags.length > 0
                  }
                />

                <motion.div 
                  className="flex items-center justify-between mb-6"
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                >
                  <div>
                    <motion.h2 
                      className="text-2xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent"
                      animate={{ 
                        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                      }}
                      transition={{ duration: 5, repeat: Infinity }}
                    >
                      {searchQuery && `Search results for "${searchQuery}"`}
                      {selectedCategory && `${selectedCategory} Posts`}
                      {selectedAuthorName && `Posts by ${selectedAuthorName}`}
                      {selectedTags.length > 0 && `Posts tagged with #${selectedTags.join(', #')}`}
                      {!searchQuery && !selectedCategory && !selectedAuthor && selectedTags.length === 0 && 'Latest Posts'}
                    </motion.h2>
                    <motion.p 
                      className="text-muted-foreground"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1 }}
                    >
                      {filteredBlogs.length} post{filteredBlogs.length !== 1 ? 's' : ''} found
                    </motion.p>
                  </div>
                  
                  {(!!searchQuery || selectedCategory !== null || selectedAuthor !== null || selectedTags.length > 0) && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", delay: 0.9 }}
                    >
                      <Button
                        variant="outline"
                        onClick={handleClearAllFilters}
                        className="playful-secondary relative overflow-hidden group"
                      >
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent"
                          initial={{ x: '-100%' }}
                          whileHover={{ x: '100%' }}
                          transition={{ duration: 0.6 }}
                        />
                        <span className="relative z-10">Clear All Filters</span>
                      </Button>
                    </motion.div>
                  )}
                </motion.div>

                <AnimatePresence>
                  {filteredBlogs.length > 0 ? (
                    <motion.div 
                      className="grid grid-cols-1 md:grid-cols-2 gap-6"
                      key="blog-list"
                    >
                      {filteredBlogs.map((blog) => {
                          const author = authorsAndUsersData[blog.authorId];

                          return (
                            <motion.div
                              key={blog.id}
                              layout
                              initial={{ opacity: 0, y: 50, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.9 }}
                              transition={{ duration: 0.5, type: 'spring', damping: 20 }}
                              whileHover={{ 
                                y: -8,
                                scale: 1.02,
                                transition: { duration: 0.2 }
                              }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <BlogCard
                                blog={blog}
                                author={author} 
                                onLike={handleLikeBlog}
                                onClick={handleBlogClick}
                              />
                            </motion.div>
                          );
                      })}
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="no-results"
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      className="text-center py-12"
                    >
                      <motion.div 
                        className="max-w-md mx-auto"
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", delay: 0.6 }}
                      >
                        <motion.h3 
                          className="text-lg font-semibold mb-2"
                          animate={{ 
                            scale: [1, 1.05, 1],
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          No posts found
                        </motion.h3>
                        <p className="text-muted-foreground mb-6">
                          {searchQuery || selectedCategory || selectedAuthor || selectedTags.length > 0
                            ? "Try adjusting your search terms or filters to find what you're looking for."
                            : "No blog posts have been created yet. Be the first to share your thoughts!"
                          }
                        </p>
                        <motion.div 
                          className="flex gap-3 justify-center"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.8 }}
                        >
                          {(!!searchQuery || selectedCategory !== null || selectedAuthor !== null || selectedTags.length > 0) && (
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Button
                                onClick={handleClearAllFilters}
                                variant="outline"
                                className="playful-secondary"
                              >
                                Clear all filters
                              </Button>
                            </motion.div>
                          )}
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Button
                              onClick={handleShowEditor}
                              className="playful-button relative overflow-hidden"
                            >
                              <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                                animate={{ x: ['0%', '100%'] }}
                                transition={{ duration: 2, repeat: Infinity }}
                              />
                              <span className="relative z-10">Create First Post</span>
                            </Button>
                          </motion.div>
                        </motion.div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.section>
            </div>
          </main>
        </div>

        {/* Auth Modal */}
        <AnimatePresence>
          {showAuth && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <AuthModal
                isOpen={showAuth}
                onClose={() => setShowAuth(false)}
                type={authType}
                onToggleType={toggleAuthType}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      
      <Toaster />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <BlogProvider>
        <AppContent />
      </BlogProvider>
    </AuthProvider>
  );
}