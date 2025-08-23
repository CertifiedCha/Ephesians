import { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';
import { Heart, MessageCircle, Share, Bookmark, MoreHorizontal, Play, Users, Trophy, Zap, Image as ImageIcon } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface Post {
  id: string;
  user: {
    name: string;
    handle: string;
    avatar: string;
    verified?: boolean;
  };
  content: string;
  type: 'text' | 'image' | 'poll' | 'challenge' | 'thought-bubble' | 'story';
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
  tags: string[];
  media?: {
    url: string;
    alt: string;
  };
  poll?: {
    question: string;
    options: Array<{
      text: string;
      votes: number;
    }>;
    totalVotes: number;
  };
  challenge?: {
    title: string;
    participants: number;
    deadline: string;
    reward: string;
  };
  isLiked?: boolean;
  isBookmarked?: boolean;
}

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [isBookmarked, setIsBookmarked] = useState(post.isBookmarked || false);
  const [likesCount, setLikesCount] = useState(post.likes);
  const [selectedPollOption, setSelectedPollOption] = useState<number | null>(null);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handlePollVote = (optionIndex: number) => {
    if (selectedPollOption === null) {
      setSelectedPollOption(optionIndex);
    }
  };

  const getPostTypeIcon = () => {
    switch (post.type) {
      case 'challenge': return <Trophy className="w-4 h-4 text-yellow-500" />;
      case 'thought-bubble': return <Zap className="w-4 h-4 text-purple-500" />;
      case 'poll': return <Users className="w-4 h-4 text-blue-500" />;
      case 'story': return <Play className="w-4 h-4 text-green-500" />;
      default: return null;
    }
  };

  const getPostTypeBadge = () => {
    switch (post.type) {
      case 'challenge': return <Badge variant="outline" className="text-yellow-600 border-yellow-200 bg-yellow-50">Challenge</Badge>;
      case 'thought-bubble': return <Badge variant="outline" className="text-purple-600 border-purple-200 bg-purple-50">Thought Bubble</Badge>;
      case 'poll': return <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">Poll</Badge>;
      case 'story': return <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">Story</Badge>;
      default: return null;
    }
  };

  return (
    <Card className="w-full hover:shadow-md transition-all duration-200">
      <CardContent className="p-6">
        {/* User Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
              {post.user.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">{post.user.name}</span>
                {post.user.verified && <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>}
                {getPostTypeIcon()}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>@{post.user.handle}</span>
                <span>•</span>
                <span>{post.timestamp}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getPostTypeBadge()}
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <p className="text-sm leading-relaxed">{post.content}</p>

          {/* Media */}
          {post.media && (
            <div className="rounded-lg overflow-hidden border">
              <ImageWithFallback
                src={post.media.url}
                alt={post.media.alt}
                className="w-full h-64 object-cover"
              />
            </div>
          )}

          {/* Poll */}
          {post.poll && (
            <div className="space-y-3 p-4 bg-muted/30 rounded-lg">
              <h4 className="font-medium">{post.poll.question}</h4>
              <div className="space-y-2">
                {post.poll.options.map((option, index) => {
                  const percentage = post.poll!.totalVotes > 0 ? (option.votes / post.poll!.totalVotes) * 100 : 0;
                  const isSelected = selectedPollOption === index;
                  
                  return (
                    <div key={index} className="space-y-1">
                      <Button
                        variant={isSelected ? "default" : "outline"}
                        className="w-full justify-start h-auto p-3"
                        onClick={() => handlePollVote(index)}
                        disabled={selectedPollOption !== null}
                      >
                        <span>{option.text}</span>
                        {selectedPollOption !== null && (
                          <span className="ml-auto">{percentage.toFixed(1)}%</span>
                        )}
                      </Button>
                      {selectedPollOption !== null && (
                        <Progress value={percentage} className="h-1" />
                      )}
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-muted-foreground">{post.poll.totalVotes} votes</p>
            </div>
          )}

          {/* Challenge */}
          {post.challenge && (
            <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 rounded-lg border border-yellow-200">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="w-5 h-5 text-yellow-600" />
                <h4 className="font-semibold text-yellow-900 dark:text-yellow-100">{post.challenge.title}</h4>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Participants</p>
                  <p className="font-medium">{post.challenge.participants}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Deadline</p>
                  <p className="font-medium">{post.challenge.deadline}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Reward</p>
                  <p className="font-medium">{post.challenge.reward}</p>
                </div>
              </div>
              <Button size="sm" className="mt-3 bg-yellow-600 hover:bg-yellow-700">
                Join Challenge
              </Button>
            </div>
          )}

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {post.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  #{tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <Separator className="my-4" />

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleLike}
              className={isLiked ? "text-red-600 hover:text-red-600" : ""}
            >
              <Heart className={`w-4 h-4 mr-1 ${isLiked ? 'fill-current' : ''}`} />
              {likesCount}
            </Button>
            <Button variant="ghost" size="sm">
              <MessageCircle className="w-4 h-4 mr-1" />
              {post.comments}
            </Button>
            <Button variant="ghost" size="sm">
              <Share className="w-4 h-4 mr-1" />
              {post.shares}
            </Button>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleBookmark}
            className={isBookmarked ? "text-blue-600 hover:text-blue-600" : ""}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}