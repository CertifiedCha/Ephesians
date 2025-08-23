import { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { VideoPlayer } from './VideoPlayer';
import { Bookmark, Clock, Eye, Play, FileText, Image as ImageIcon, Video, ExternalLink, Heart, Share, Zap } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  author: {
    name: string;
    avatar?: string;
  };
  publishedAt: string;
  readTime: string;
  category: string;
  tags: string[];
  type: 'article' | 'video' | 'image' | 'external';
  thumbnail?: string;
  videoUrl?: string;
  externalUrl?: string;
  views: number;
  isBookmarked?: boolean;
}

interface BlogPostCardProps {
  post: BlogPost;
  onBookmark?: (postId: string) => void;
  onClick?: (post: BlogPost) => void;
}

export function BlogPostCard({ post, onBookmark, onClick }: BlogPostCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(post.isBookmarked || false);
  const [isLiked, setIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
    onBookmark?.(post.id);
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Mock share functionality
    console.log('Sharing post:', post.title);
  };

  const handleCardClick = () => {
    if (post.type === 'video') {
      // For videos, we handle inline playing
      return;
    } else {
      onClick?.(post);
    }
  };

  const getTypeIcon = () => {
    switch (post.type) {
      case 'video':
        return <Video className="w-4 h-4" />;
      case 'image':
        return <ImageIcon className="w-4 h-4" />;
      case 'external':
        return <ExternalLink className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getTypeColor = () => {
    switch (post.type) {
      case 'video':
        return 'text-red-600 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-950/20 dark:border-red-800';
      case 'image':
        return 'text-green-600 bg-green-50 border-green-200 dark:text-green-400 dark:bg-green-950/20 dark:border-green-800';
      case 'external':
        return 'text-purple-600 bg-purple-50 border-purple-200 dark:text-purple-400 dark:bg-purple-950/20 dark:border-purple-800';
      default:
        return 'text-blue-600 bg-blue-50 border-blue-200 dark:text-blue-400 dark:bg-blue-950/20 dark:border-blue-800';
    }
  };

  const getCategoryGradient = () => {
    switch (post.category) {
      case 'Programming':
        return 'from-blue-500/20 to-cyan-500/20';
      case 'Design':
        return 'from-purple-500/20 to-pink-500/20';
      case 'Technology':
        return 'from-green-500/20 to-emerald-500/20';
      default:
        return 'from-primary/20 to-accent/20';
    }
  };

  return (
    <Card 
      className={`group cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 border-2 ${
        isHovered 
          ? 'border-primary/30 -translate-y-2 shadow-xl shadow-primary/20' 
          : 'border-border/50 hover:border-primary/20'
      }`}
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-0 relative overflow-hidden">
        {/* Category gradient overlay */}
        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${getCategoryGradient()}`} />

        {/* Video/Thumbnail Section */}
        {post.type === 'video' && post.videoUrl ? (
          <div className="p-4 pb-0">
            <div className="relative overflow-hidden rounded-xl">
              <VideoPlayer
                videoUrl={post.videoUrl}
                thumbnail={post.thumbnail}
                title={post.title}
                autoPlay={false}
              />
              {/* Floating play indicator */}
              <div className={`absolute top-3 left-3 flex items-center gap-1 px-2 py-1 bg-black/70 text-white rounded-full text-xs transition-all duration-300 ${
                isHovered ? 'scale-110' : ''
              }`}>
                <Play className="w-3 h-3" />
                <span>Video</span>
              </div>
            </div>
          </div>
        ) : post.thumbnail ? (
          <div className="relative aspect-video overflow-hidden">
            <ImageWithFallback
              src={post.thumbnail}
              alt={post.title}
              className={`w-full h-full object-cover transition-transform duration-500 ${
                isHovered ? 'scale-110' : 'scale-100'
              }`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        ) : null}

        <div className="p-6 space-y-4">
          {/* Header with interactive elements */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className={`${getTypeColor()} transition-all duration-200 hover:scale-105`}>
                {getTypeIcon()}
                <span className="ml-1 capitalize">{post.type}</span>
              </Badge>
              <Badge 
                variant="secondary" 
                className={`bg-gradient-to-r ${getCategoryGradient()} border-0 transition-all duration-200 hover:scale-105`}
              >
                {post.category}
              </Badge>
            </div>
            
            {/* Action buttons */}
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                className={`p-2 transition-all duration-200 ${
                  isLiked 
                    ? 'text-red-500 bg-red-50 hover:bg-red-100 scale-110' 
                    : 'text-muted-foreground hover:text-red-500 hover:bg-red-50'
                }`}
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-200"
              >
                <Share className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBookmark}
                className={`p-2 transition-all duration-200 ${
                  isBookmarked 
                    ? 'text-primary bg-primary/10 scale-110' 
                    : 'text-muted-foreground hover:text-primary hover:bg-primary/10'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
              </Button>
            </div>
          </div>

          {/* Title with hover effect */}
          <h3 className={`text-lg font-semibold line-clamp-2 transition-all duration-300 ${
            isHovered ? 'text-primary' : 'text-foreground'
          }`}>
            {post.title}
          </h3>

          {/* Excerpt */}
          <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
            {post.excerpt}
          </p>

          {/* Interactive tags */}
          <div className="flex gap-2 flex-wrap">
            {post.tags.slice(0, 3).map((tag, index) => (
              <Badge 
                key={tag} 
                variant="outline" 
                className={`text-xs transition-all duration-200 hover:bg-primary/10 hover:border-primary/50 hover:scale-105 cursor-pointer ${
                  isHovered ? 'animate-pulse' : ''
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                #{tag}
              </Badge>
            ))}
            {post.tags.length > 3 && (
              <Badge 
                variant="outline" 
                className="text-xs opacity-70 hover:opacity-100 transition-all duration-200"
              >
                +{post.tags.length - 3} more
              </Badge>
            )}
          </div>

          {/* Footer with enhanced styling */}
          <div className="flex items-center justify-between pt-4 border-t border-border/50">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className={`w-7 h-7 bg-gradient-to-br from-primary/70 to-accent/70 rounded-full flex items-center justify-center text-white text-xs font-semibold transition-all duration-200 ${
                  isHovered ? 'scale-110 shadow-lg' : ''
                }`}>
                  {post.author.name.charAt(0)}
                </div>
                <span className="text-sm text-muted-foreground font-medium">{post.author.name}</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span className="text-xs">{post.readTime}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className={`flex items-center gap-1 transition-all duration-200 ${
                isHovered ? 'text-primary' : ''
              }`}>
                <Eye className="w-3 h-3" />
                <span className="font-medium">{post.views.toLocaleString()}</span>
              </div>
              <span>{post.publishedAt}</span>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className={`absolute top-4 right-4 w-8 h-8 bg-primary/5 rounded-full transition-all duration-500 ${
          isHovered ? 'scale-150 rotate-180' : 'scale-0'
        }`} />
        <div className={`absolute bottom-4 left-4 w-6 h-6 bg-accent/10 rounded-full transition-all duration-700 ${
          isHovered ? 'scale-125 rotate-90' : 'scale-0'
        }`} />
      </CardContent>
    </Card>
  );
}