import React, { useMemo } from 'react';
import { Home, BookOpen, Palette, Code, Plane, Lightbulb, Heart, TrendingUp, Clock, User } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { useBlog } from '../contexts/BlogContext';
import { motion, AnimatePresence } from 'framer-motion';
import { SortOption } from './FilterSortBar';
import { authorsAndUsersData } from '../data/authors';

interface SidebarProps {
  selectedCategory: string | null;
  selectedAuthor: string | null;
  onCategorySelect: (category: string | null) => void;
  onAuthorSelect: (authorId: string | null) => void;
  onSortSelect: (sort: SortOption) => void;
  onClearAllFilters: () => void;
  isCollapsed: boolean;
}

const categories = [
  { name: 'Programming', icon: Code, color: 'bg-blue-500' },
  { name: 'Design', icon: Palette, color: 'bg-purple-500' },
  { name: 'Technology', icon: Lightbulb, color: 'bg-yellow-500' },
  { name: 'Travel', icon: Plane, color: 'bg-green-500' },
  { name: 'Lifestyle', icon: Heart, color: 'bg-pink-500' },
];

export const Sidebar: React.FC<SidebarProps> = ({
  selectedCategory,
  selectedAuthor,
  onCategorySelect,
  onAuthorSelect,
  onSortSelect,
  onClearAllFilters,
  isCollapsed,
}) => {
  const { blogs, getSortedBlogs } = useBlog();

  const availableCategories = useMemo(() => {
    const categorySet = new Set<string>();
    blogs.forEach((blog) => categorySet.add(blog.category));
    return Array.from(categorySet);
  }, [blogs]);

  const recentBlogs = useMemo(() => {
    return getSortedBlogs().slice(0, 5);
  }, [getSortedBlogs]);

  const getCategoryIcon = (categoryName: string) => {
    const category = categories.find(cat => cat.name === categoryName);
    return category?.icon || BookOpen;
  };

  const getCategoryColor = (categoryName: string) => {
    const category = categories.find(cat => cat.name === categoryName);
    return category?.color || 'bg-gray-500';
  };
  
  const authors = Object.keys(authorsAndUsersData);

  return (
    <motion.aside
      className="hidden md:block h-full bg-background border-r border-sidebar-border overflow-hidden"
      initial={{ x: 0, opacity: 1 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6, type: "spring" }}
    >
      <div className={`pt-4 h-full flex flex-col transition-all duration-300 ${isCollapsed ? 'px-2 items-center' : 'px-4 items-stretch'}`}>

        {/* Navigation */}
        <div className="space-y-2 mb-6">
          <motion.div whileHover={{ scale: 1.02, x: isCollapsed ? 0 : 4 }} whileTap={{ scale: 0.98 }}>
            <Button
              variant={!selectedCategory && !selectedAuthor ? "secondary" : "ghost"}
              className={`w-full flex ${isCollapsed ? 'justify-center' : 'justify-start'} overflow-hidden transition-colors duration-300`}
              onClick={onClearAllFilters}
            >
              <Home className={`h-4 w-4 shrink-0 ${isCollapsed ? '' : 'mr-3'}`} />
              <motion.span
                initial={{ width: 'auto', opacity: 1 }}
                animate={{ width: isCollapsed ? 0 : 'auto', opacity: isCollapsed ? 0 : 1 }}
                transition={{ duration: 0.2 }}
                className="text-base font-medium whitespace-nowrap overflow-hidden"
              >
                Home
              </motion.span>
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Badge variant="secondary" className="ml-auto">
                      {blogs.length}
                    </Badge>
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02, x: isCollapsed ? 0 : 4 }} whileTap={{ scale: 0.98 }}>
            <Button
              variant="ghost"
              className={`w-full flex ${isCollapsed ? 'justify-center' : 'justify-start'} overflow-hidden transition-colors duration-300`}
              onClick={() => {
                onCategorySelect(null);
                onAuthorSelect(null);
                onSortSelect('views');
              }}
            >
              <TrendingUp className={`h-4 w-4 shrink-0 ${isCollapsed ? '' : 'mr-3'}`} />
              <motion.span
                initial={{ width: 'auto', opacity: 1 }}
                animate={{ width: isCollapsed ? 0 : 'auto', opacity: isCollapsed ? 0 : 1 }}
                transition={{ duration: 0.2 }}
                className="text-base font-medium whitespace-nowrap overflow-hidden"
              >
                Trending
              </motion.span>
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02, x: isCollapsed ? 0 : 4 }} whileTap={{ scale: 0.98 }}>
            <Button
              variant="ghost"
              className={`w-full flex ${isCollapsed ? 'justify-center' : 'justify-start'} overflow-hidden transition-colors duration-300`}
              onClick={() => {
                onCategorySelect(null);
                onAuthorSelect(null);
                onSortSelect('newest');
              }}
            >
              <Clock className={`h-4 w-4 shrink-0 ${isCollapsed ? '' : 'mr-3'}`} />
              <motion.span
                initial={{ width: 'auto', opacity: 1 }}
                animate={{ width: isCollapsed ? 0 : 'auto', opacity: isCollapsed ? 0 : 1 }}
                transition={{ duration: 0.2 }}
                className="text-base font-medium whitespace-nowrap overflow-hidden"
              >
                Recent
              </motion.span>
            </Button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: isCollapsed ? 0 : 1 }}
          transition={{ duration: 0.2 }}
          className={`my-4 ${isCollapsed ? 'h-0 overflow-hidden' : 'h-auto'}`}
        >
          <Separator />
        </motion.div>

        {/* Categories */}
        <div className="space-y-3 mb-6">
          <motion.h3
            initial={{ height: 'auto', opacity: 1 }}
            animate={{ height: isCollapsed ? 0 : 'auto', opacity: isCollapsed ? 0 : 1 }}
            transition={{ duration: 0.2 }}
            className={`text-sm font-medium text-sidebar-foreground/70 uppercase tracking-wider overflow-hidden ${isCollapsed ? 'h-0' : 'h-auto'}`}
          >
            Categories
          </motion.h3>
          <div className="space-y-1">
            {availableCategories.map((category) => {
              const IconComponent = getCategoryIcon(category);
              const categoryBlogs = blogs.filter(blog => blog.category === category);

              return (
                <motion.div
                  key={category}
                  whileHover={{ scale: 1.02, x: isCollapsed ? 0 : 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant={selectedCategory === category ? "secondary" : "ghost"}
                    className={`w-full flex ${isCollapsed ? 'justify-center' : 'justify-start'} overflow-hidden transition-colors duration-300`}
                    onClick={() => {
                      onCategorySelect(category);
                      onAuthorSelect(null);
                      onSortSelect('newest');
                    }}
                  >
                    <div className={`w-2 h-2 rounded-full shrink-0 ${isCollapsed ? '' : 'mr-3'} ${getCategoryColor(category)}`} />
                    <IconComponent className={`h-4 w-4 shrink-0 ${isCollapsed ? '' : 'mr-2'}`} />
                    <motion.span
                      initial={{ width: 'auto', opacity: 1 }}
                      animate={{ width: isCollapsed ? 0 : 'auto', opacity: isCollapsed ? 0 : 1 }}
                      transition={{ duration: 0.2 }}
                      className="text-base font-medium whitespace-nowrap overflow-hidden"
                    >
                      {category}
                    </motion.span>
                    <AnimatePresence>
                      {!isCollapsed && (
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Badge variant="secondary" className="ml-auto">
                            {categoryBlogs.length}
                          </Badge>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Button>
                </motion.div>
              );
            })}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: isCollapsed ? 0 : 1 }}
          transition={{ duration: 0.2 }}
          className={`my-4 ${isCollapsed ? 'h-0 overflow-hidden' : 'h-auto'}`}
        >
          <Separator />
        </motion.div>

        {/* Authors Section */}
        <div className="space-y-3 mb-6">
          <motion.h3
            initial={{ height: 'auto', opacity: 1 }}
            animate={{ height: isCollapsed ? 0 : 'auto', opacity: isCollapsed ? 0 : 1 }}
            transition={{ duration: 0.2 }}
            className={`text-sm font-medium text-sidebar-foreground/70 uppercase tracking-wider overflow-hidden ${isCollapsed ? 'h-0' : 'h-auto'}`}
          >
            Authors
          </motion.h3>
          <div className="space-y-1">
            {authors.map((authorId) => {
              const author = authorsAndUsersData[authorId];
              const authorBlogs = blogs.filter(blog => blog.authorId === authorId);

              // Don't display authors who haven't written any blogs
              if (authorBlogs.length === 0) {
                return null;
              }

              return (
                <motion.div
                  key={authorId}
                  whileHover={{ scale: 1.02, x: isCollapsed ? 0 : 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant={selectedAuthor === authorId ? "secondary" : "ghost"}
                    className={`w-full flex ${isCollapsed ? 'justify-center' : 'justify-start'} overflow-hidden transition-colors duration-300`}
                    onClick={() => {
                      onAuthorSelect(authorId);
                      onCategorySelect(null);
                    }}
                  >
                    <User className={`h-4 w-4 shrink-0 ${isCollapsed ? '' : 'mr-3'}`} />
                    <motion.span
                      initial={{ width: 'auto', opacity: 1 }}
                      animate={{ width: isCollapsed ? 0 : 'auto', opacity: isCollapsed ? 0 : 1 }}
                      transition={{ duration: 0.2 }}
                      className="text-base font-medium whitespace-nowrap overflow-hidden"
                    >
                      {author.name}
                    </motion.span>
                    <AnimatePresence>
                      {!isCollapsed && (
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Badge variant="secondary" className="ml-auto">
                            {authorBlogs.length}
                          </Badge>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Button>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Recent Posts Preview */}
        <div className="flex-1 overflow-hidden">
          <motion.h3
            initial={{ height: 'auto', opacity: 1 }}
            animate={{ height: isCollapsed ? 0 : 'auto', opacity: isCollapsed ? 0 : 1 }}
            transition={{ duration: 0.2 }}
            className={`text-sm font-medium text-sidebar-foreground/70 uppercase tracking-wider mb-3 overflow-hidden ${isCollapsed ? 'h-0' : 'h-auto'}`}
          >
            Recent Posts
          </motion.h3>
          <ScrollArea className="h-full">
            <div className="space-y-3">
              {!isCollapsed ? (
                <AnimatePresence>
                  {recentBlogs.map((blog) => (
                    <motion.div
                      key={blog.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="group cursor-pointer"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="p-3 rounded-lg bg-sidebar-accent/50 hover:bg-sidebar-accent transition-colors">
                        <h4 className="text-sm font-medium line-clamp-2 group-hover:text-sidebar-primary transition-colors">
                          {blog.title}
                        </h4>
                        <p className="text-xs text-sidebar-foreground/60 mt-1">
                          {blog.authorName} • {blog.readTime} min read
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <Badge variant="outline" className="text-xs">
                            {blog.category}
                          </Badge>
                          <span className="text-xs text-sidebar-foreground/50">
                            {blog.likes.length} ❤️
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              ) : (
                <motion.div
                  key="collapsed-posts-placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.2 }}
                  className="text-center text-muted-foreground text-sm py-4"
                >
                  <BookOpen className="h-5 w-5 mx-auto mb-2" />
                  <span>Posts</span>
                </motion.div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </motion.aside>
  );
};