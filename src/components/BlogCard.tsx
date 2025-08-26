import React, { useState } from 'react'; 
import { Heart, MessageCircle, Eye, Clock, Calendar, User, Share2 } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Card, CardContent, CardHeader } from './ui/card';
import { Blog } from '../contexts/BlogContext';
import { useAuth } from '../contexts/AuthContext'; // FIXED: Corrected path to AuthContext
import { motion, AnimatePresence } from 'framer-motion';
import { ImageWithFallback } from './figma/ImageWithFallback';
// No longer need to import authorsAndUsersData here as it's passed via props

// Define the Author type, ensuring 'avatar' property for profile picture
export interface Author {
  name: string;
  avatar: string; // Correctly referencing 'avatar' as in authors.js
}

interface BlogCardProps {
  blog: Blog;
  onLike: (id: string) => void;
  onClick: (blog: Blog) => void;
  author: Author; // The author object is passed directly from App.tsx
}

const getCategoryGradient = (category: string): string => {
  const gradients = {
    'Programming': 'from-blue-500 to-purple-600',
    'Design': 'from-pink-500 to-rose-500',
    'Technology': 'from-gray-700 to-gray-900',
    'Science': 'from-green-500 to-teal-600',
    'Art': 'from-purple-500 to-indigo-600',
    'Travel': 'from-orange-500 to-yellow-500',
    'Food': 'from-red-500 to-pink-500',
    'Music': 'from-violet-500 to-purple-600',
    'Gaming': 'from-cyan-500 to-blue-600',
    'Sports': 'from-lime-500 to-green-600',
    'Business': 'from-slate-600 to-gray-800',
    'Health': 'from-emerald-500 to-teal-600',
    'Academics': 'from-amber-400 to-yellow-500',
    'Opinion': 'from-purple-400 to-pink-500'
  };
  return gradients[category as keyof typeof gradients] || 'from-blue-500 to-purple-600';
};

export const BlogCard: React.FC<BlogCardProps> = ({ blog, onLike, onClick, author }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const { user } = useAuth();

  // Use the 'author' prop directly, which is now correctly typed and passed
  const authorName = author?.name || 'Anonymous';
  const authorAvatar = author?.avatar || 'https://via.placeholder.com/150/0000FF/FFFFFF?text=Anon'; // Fallback for avatar

  const isLiked = user ? blog.likes.includes(user.id) : false;
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Unknown Date';
    }
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const stripHtmlTags = (html: string) => {
    return html.replace(/<[^>]*>/g, '').substring(0, 200) + '...';
  };

  return (
    <motion.div
      className="relative group"
      onHoverStart={() => {
        setIsHovered(true);
        setTimeout(() => setShowPreview(true), 300);
      }}
      onHoverEnd={() => {
        setIsHovered(false);
        setShowPreview(false);
      }}
      whileHover={{ y: -8 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card 
        className="h-full bg-card/50 backdrop-blur-sm border-border/50 hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden group-hover:border-primary/30"
        onClick={() => onClick(blog)}
      >
        {/* Image Header */}
        <div className="relative h-48 overflow-hidden">
          <motion.div
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <ImageWithFallback
              src={blog.thumbnailUrl}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
          </motion.div>
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Category Badge */}
          <motion.div 
            className="absolute top-4 left-4"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Badge 
              className={`
                bg-gradient-to-r ${getCategoryGradient(blog.category)} 
                text-white px-3 py-1 text-xs font-medium shadow-lg
                hover:shadow-xl transition-all duration-300
              `}
            >
              {blog.category}
            </Badge>
          </motion.div>

          {/* Reading Time */}
          <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1">
            <span className="text-white text-xs flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              {blog.readTime}m
            </span>
          </div>

          {/* Heart Button Overlay */}
          <motion.div 
            className="absolute bottom-4 right-4"
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                onLike(blog.id);
              }}
              className={`
                w-10 h-10 rounded-full backdrop-blur-sm transition-all duration-300
                ${isLiked 
                  ? 'bg-red-500/90 text-white hover:bg-red-600/90' 
                  : 'bg-black/50 text-white hover:bg-red-500/90'
                }
              `}
            >
              <Heart 
                className={`w-4 h-4 transition-all duration-300 ${
                  isLiked ? 'fill-white' : 'hover:fill-white'
                }`} 
              />
            </Button>
          </motion.div>
        </div>

        <CardHeader className="pb-3">
          <motion.h3 
            className="font-bold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors duration-300"
            whileHover={{ scale: 1.02 }}
          >
            {blog.title}
          </motion.h3>
          
          {/* Author Info */}
          <div className="flex items-center space-x-3 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              {/* Added a red border for debugging the Avatar container */}
              <Avatar className="w-6 h-6 flex items-center justify-center overflow-hidden rounded-full flex-shrink-0 border-2 border-red-500"> 
                <AvatarImage 
                  src={authorAvatar} 
                  alt={authorName} 
                  className="block w-full h-full object-cover z-10" 
                  onError={(e) => { 
                    console.error(`Failed to load avatar for ${authorName}. URL: ${authorAvatar}`, e);
                    e.currentTarget.src = `https://placehold.co/150x150/FF0000/FFFFFF?text=Err`; 
                  }}
                /> 
                {/* TEMPORARY DEBUG: Make fallback transparent */}
                <AvatarFallback className="text-xs bg-transparent text-white"> 
                  {authorName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <span className="font-medium text-foreground">{authorName}</span>
            </div>
            <span>•</span>
            <span className="flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              {formatDate(blog.createdAt)}
            </span>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {/* Excerpt */}
          <p className="text-sm text-muted-foreground line-clamp-3 mb-4 leading-relaxed">
            {blog.excerpt}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-4">
            {blog.tags.slice(0, 3).map((tag, index) => (
              <motion.div
                key={tag}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                whileHover={{ scale: 1.05 }}
              >
                <Badge 
                  variant="outline" 
                  className="text-xs hover:bg-primary/10 hover:border-primary/30 transition-colors duration-300"
                >
                  #{tag}
                </Badge>
              </motion.div>
            ))}
            {blog.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{blog.tags.length - 3}
              </Badge>
            )}
          </div>

          {/* Stats Footer */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center space-x-4">
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  onLike(blog.id);
                }}
                className={`flex items-center space-x-1 transition-colors duration-300 ${
                  isLiked ? 'text-red-500' : 'hover:text-red-500'
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500' : ''}`} />
                <span>{blog.likes?.length || 0}</span>
              </motion.button>

              <div className="flex items-center space-x-1">
                <MessageCircle className="w-4 h-4" />
                <span>{blog.comments?.length || 0}</span>
              </div>

              <div className="flex items-center space-x-1">
                <Eye className="w-4 h-4" />
                <span>{blog.views?.toLocaleString() || 0}</span>
              </div>
            </div>

            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  // Share functionality would go here
                }}
                className="w-8 h-8 rounded-full hover:bg-primary/10 transition-colors duration-300"
              >
                <Share2 className="w-3 h-3" />
              </Button>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
