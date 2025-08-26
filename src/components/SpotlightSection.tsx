// SpotlightSection.tsx
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ChevronLeft, ChevronRight, Play, Clock, Eye, Heart, Star, MessageCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Blog } from '../contexts/BlogContext';
import { motion, AnimatePresence } from 'framer-motion';
import { getCategoryGradient, stripHtmlTags } from '../utils/helpers';
import { authorsAndUsersData } from '../data/authors';

interface SpotlightSectionProps {
  blogs: Blog[];
  onBlogClick: (blog: Blog) => void;
}

const isSpotlightTruthy = (v: any) => v === true || v === 'true' || v === 1 || v === '1';

export const SpotlightSection: React.FC<SpotlightSectionProps> = ({
  blogs,
  onBlogClick,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [direction, setDirection] = useState(0);
  const autoPlayIntervalRef = useRef<number | null>(null);
  const progressIntervalRef = useRef<number | null>(null);

  const spotlightBlogs = useMemo(
    () => (Array.isArray(blogs) ? blogs.filter((b) => isSpotlightTruthy(b?.isSpotlight)) : []),
    [blogs]
  );

  if (spotlightBlogs.length === 0) return null;

  // The fix: A unified useEffect for a single source of truth for the timer.
  useEffect(() => {
    // Clear any existing timers to prevent duplicates and ensure a clean start
    if (autoPlayIntervalRef.current) clearInterval(autoPlayIntervalRef.current);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);

    if (isAutoPlaying && spotlightBlogs.length > 1) {
      // Auto-advance logic
      autoPlayIntervalRef.current = window.setInterval(() => {
        setDirection(1); // Set direction for animation
        setCurrentIndex((prevIndex) => (prevIndex + 1) % spotlightBlogs.length);
        setProgress(0);
      }, 10000);

      // Progress bar logic
      progressIntervalRef.current = window.setInterval(() => {
        setProgress((prev) => (prev >= 100 ? 0 : prev + 1));
      }, 100);
    }

    // Cleanup function to clear intervals when the component unmounts or dependencies change
    return () => {
      if (autoPlayIntervalRef.current) clearInterval(autoPlayIntervalRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [isAutoPlaying, spotlightBlogs.length]);

  const handleSlideChange = (newIndex: number) => {
    setDirection(newIndex > currentIndex ? 1 : -1);
    setCurrentIndex(newIndex);
    setProgress(0);
  };

  const goToPrevious = () => {
    const newIndex = currentIndex === 0 ? spotlightBlogs.length - 1 : currentIndex - 1;
    handleSlideChange(newIndex);
  };

  const goToNext = () => {
    const newIndex = (currentIndex + 1) % spotlightBlogs.length;
    handleSlideChange(newIndex);
  };

  const currentBlog = spotlightBlogs[currentIndex];
  const summary = stripHtmlTags(currentBlog.excerpt).substring(0, 180) + '...';

  const author = authorsAndUsersData[
    (currentBlog?.authorId as keyof typeof authorsAndUsersData) ?? 'author1'
  ] || { name: 'Unknown', avatar: '' };

  const authorInitial = (author?.name?.charAt(0) || 'U').toUpperCase();

  const views = (currentBlog?.views ?? 0).toLocaleString();
  const likesCount = currentBlog?.likes?.length ?? 0;
  const commentsCount = currentBlog?.comments?.length ?? 0;

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  return (
    <motion.section
      className="relative mb-16 rounded-3xl overflow-hidden shadow-2xl"
      initial={{ opacity: 0, y: 100, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 1.2, type: 'spring', bounce: 0.3 }}
      style={{ height: '500px' }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentBlog.id}
          className="absolute inset-0 bg-cover bg-center"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.8 }}
          style={{ backgroundImage: `url(${currentBlog.thumbnailUrl || 'https://via.placeholder.com/1200x800.png?text=No+Image'})` }}
        />
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />

      <div className="relative z-20 h-full flex items-center">
        <div className="container mx-auto px-8">
          <div className="max-w-4xl">
            <AnimatePresence initial={false} mode="wait" custom={direction}>
              <motion.div
                key={currentBlog.id}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: 'spring', stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
                className="space-y-6"
              >
                <motion.div
                  className="flex items-center space-x-2"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                >
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                  >
                    <Star className="w-5 h-5 text-yellow-300" />
                  </motion.div>
                  <Badge
                    className={`
                      bg-gradient-to-r ${getCategoryGradient(currentBlog.category)}
                      text-white px-4 py-2 text-sm font-medium shadow-lg backdrop-blur-sm
                      hover:scale-110 transition-transform duration-300
                    `}
                  >
                    {currentBlog.category}
                  </Badge>
                </motion.div>

                <motion.h1
                  className="text-4xl md:text-6xl font-bold text-white leading-tight"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  style={{ textShadow: '0 4px 20px rgba(0,0,0,0.7), 0 0 40px rgba(255,255,255,0.2)' }}
                >
                  <motion.span
                    animate={{ y: [0, -2, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    {currentBlog.title}
                  </motion.span>
                </motion.h1>

                <motion.p
                  className="text-xl md:text-2xl text-white/95 leading-relaxed max-w-3xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  style={{ textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}
                >
                  <motion.span
                    animate={{ y: [0, -2, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    {summary}
                  </motion.span>
                </motion.p>

                <motion.div
                  className="flex flex-wrap items-center gap-6 text-white/90"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.8 }}
                >
                  <motion.div
                    className="flex items-center space-x-2"
                    animate={{ y: [0, -2, 0] }}
                    transition={{ duration: 3, repeat: Infinity, delay: 0 }}
                  >
                    {author?.avatar ? (
                      <img src={author.avatar} alt={author.name} className="w-8 h-8 rounded-full border border-white/30 object-cover" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center border-2 border-white/20">
                        <span className="text-sm font-bold">{authorInitial}</span>
                      </div>
                    )}
                    <span className="font-medium">{author?.name}</span>
                  </motion.div>

                  <motion.div
                    className="flex items-center space-x-1"
                    animate={{ y: [0, -2, 0] }}
                    transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                  >
                    <Clock className="w-4 h-4" />
                    <span>{currentBlog.readTime} min read</span>
                  </motion.div>

                  <motion.div
                    className="flex items-center space-x-1"
                    animate={{ y: [0, -2, 0] }}
                    transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                  >
                    <Eye className="w-4 h-4" />
                    <span>{views}</span>
                  </motion.div>

                  <motion.div
                    className="flex items-center space-x-1"
                    animate={{ y: [0, -2, 0] }}
                    transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
                  >
                    <Heart className="w-4 h-4" />
                    <span>{likesCount}</span>
                  </motion.div>

                  <motion.div
                    className="flex items-center space-x-1"
                    animate={{ y: [0, -2, 0] }}
                    transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>{commentsCount}</span>
                  </motion.div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9, duration: 0.8 }}
                >
                  <motion.div
                    whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      onClick={() => onBlogClick(currentBlog)}
                      className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border-2 border-white/30 hover:border-white/50 px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 relative overflow-hidden group"
                    >
                      <motion.div
                        className="absolute inset-0 bg-white/10"
                        animate={{ scale: [0, 2], opacity: [0.5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
                      />
                      <motion.div
                        className="flex items-center space-x-2 relative z-10"
                        whileHover={{ x: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Play className="w-5 h-5" />
                        <span>Dive Into Story</span>
                      </motion.div>
                    </Button>
                  </motion.div>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex items-center space-x-4">
          <motion.div whileHover={{ scale: 1.1, x: -2 }} whileTap={{ scale: 0.9 }}>
            <Button
              variant="ghost"
              size="sm"
              onClick={goToPrevious}
              className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border border-white/30"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
          </motion.div>

          <div className="flex space-x-2">
            {spotlightBlogs.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => handleSlideChange(index)}
                className={`relative w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-white scale-125'
                    : 'bg-white/40 hover:bg-white/60'
                }`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                animate={index === currentIndex ? { y: [0, -3, 0] } : {}}
                transition={{ y: { duration: 1, repeat: Infinity } }}
              >
                {index === currentIndex && (
                  <motion.div
                    className="absolute inset-0 rounded-full bg-white"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </motion.button>
            ))}
          </div>

          <motion.div whileHover={{ scale: 1.1, x: 2 }} whileTap={{ scale: 0.9 }}>
            <Button
              variant="ghost"
              size="sm"
              onClick={goToNext}
              className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border border-white/30"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border border-white/30"
            >
              <motion.div
                animate={isAutoPlaying ? { rotate: 360 } : { rotate: 0 }}
                transition={{ duration: 2, repeat: isAutoPlaying ? Infinity : 0, ease: 'linear' }}
              >
                <Play className={`w-4 h-4 ${!isAutoPlaying ? 'opacity-50' : ''}`} />
              </motion.div>
            </Button>
          </motion.div>
        </div>
      </div>

      {isAutoPlaying && spotlightBlogs.length > 1 && (
        <motion.div
          className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-white/50 to-white/80"
          style={{ width: `${progress}%` }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.1 }}
        />
      )}
    </motion.section>
  );
};