import { forwardRef, useState } from 'react';
import { useDrag } from 'react-dnd';

// ⚠️ IMPORTANT: Adjust these import paths to match your project structure.
// Example: import { Button } from '../../components/ui/button';
import { Button } from './ui/button'; 
// Example: import { Badge } from '../../components/ui/badge';
import { Badge } from './ui/badge';   
// Example: import { cn } from '../../lib/utils';
import { cn } from './ui/utils'; 

// Standard lucide-react import
import { Heart, Linkedin, Twitter, Github, Star, FacebookIcon, InstagramIcon } from 'lucide-react'; 

// ⚠️ IMPORTANT: Adjust this import path to match your project structure.
// Example: import { TeamMember } from '../../../data/teamMembers';
import { TeamMember } from '../data/teamMembers'; 


interface TeamMemberCardProps {
  member: TeamMember;
  onClick: () => void;
  isListView: boolean;
  index: number;
}

export const TeamMemberCard = forwardRef<HTMLDivElement, TeamMemberCardProps>(
  ({ member, onClick, isListView, index }, ref) => {
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(member.likes);
    
    const [{ isDragging }, drag] = useDrag({
      type: 'team-member',
      item: { id: member.id, index },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });

    // Combine the forwarded ref with the drag ref
    const combinedRef = (node: HTMLDivElement | null) => {
      drag(node);
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    };

    const handleLike = (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsLiked(!isLiked);
      setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    };

    const handleSocialClick = (e: React.MouseEvent, url: string) => {
      e.stopPropagation();
      window.open(url, '_blank');
    };

    if (isListView) {
      return (
        <div
          ref={combinedRef}
          className={cn(
            "group cursor-pointer transition-all duration-300 hover:shadow-lg",
            isDragging && "opacity-50"
          )}
          onClick={onClick}
        >
          <div className="relative overflow-hidden rounded-lg bg-card border">
            <div className="flex items-center gap-4 p-4">
              <div className="relative">
                <img
                  src={member.photo}
                  alt={member.name}
                  className="h-16 w-16 rounded-full object-cover"
                />
                {member.favorite && (
                  <Star className="absolute -top-1 -right-1 h-4 w-4 fill-yellow-400 text-yellow-400" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="truncate mb-1">{member.name}</h3>
                <p className="text-muted-foreground mb-2 text-sm">{member.role}</p>
                <div className="flex gap-1 overflow-hidden">
                  {member.skills.slice(0, 2).map((skill) => (
                    <Badge key={skill} variant="outline" className="text-xs whitespace-nowrap flex-shrink-0">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <Badge variant={member.available ? "default" : "secondary"}>
                  {member.available ? "Available" : "Busy"}
                </Badge>
                <button
                  onClick={handleLike}
                  className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Heart className={cn("h-4 w-4", isLiked && "fill-red-500 text-red-500")} />
                  <span>{likeCount}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div
        ref={combinedRef}
        className={cn(
          "group relative cursor-pointer overflow-hidden rounded-xl bg-card shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-xl",
          isDragging && "opacity-50"
        )}
        onClick={onClick}
      >
        {/* Main Image */}
        <div className="relative aspect-[3/4] overflow-hidden">
          <img
            src={member.photo}
            alt={member.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />

          {/* Dark Mode: Gradient Overlay (placed before interactive elements) */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent dark:from-black/90 dark:via-black/40 dark:to-transparent opacity-100 dark:opacity-100" />
          
          {/* Social Links - Top Left (appears on hover) - Added z-10 for clickability */}
          <div className="absolute top-3 left-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 z-10">
            {member.socialLinks.linkedin && (
              <Button
                size="sm"
                variant="secondary"
                className="h-8 w-8 p-0 bg-white/90 hover:bg-white dark:bg-black/70 dark:hover:bg-black/90"
                onClick={(e) => handleSocialClick(e, member.socialLinks.linkedin!)}
              >
                <Linkedin className="h-4 w-4" />
              </Button>
            )}
            {member.socialLinks.twitter && (
              <Button
                size="sm"
                variant="secondary"
                className="h-8 w-8 p-0 bg-white/90 hover:bg-white dark:bg-black/70 dark:hover:bg-black/90"
                onClick={(e) => handleSocialClick(e, member.socialLinks.twitter!)}
              >
                <Twitter className="h-4 w-4" />
              </Button>
            )}
            {member.socialLinks.github && (
              <Button
                size="sm"
                variant="secondary"
                className="h-8 w-8 p-0 bg-white/90 hover:bg-white dark:bg-black/70 dark:hover:bg-black/90"
                onClick={(e) => handleSocialClick(e, member.socialLinks.github!)}
              >
                <Github className="h-4 w-4" />
              </Button>
            )}
            {/* Added Facebook button using FacebookIcon */}
            {member.socialLinks.facebook && (
              <Button
                size="sm"
                variant="secondary"
                className="h-8 w-8 p-0 bg-white/90 hover:bg-white dark:bg-black/70 dark:hover:bg-black/90"
                onClick={(e) => handleSocialClick(e, member.socialLinks.facebook!)}
              >
                <FacebookIcon className="h-4 w-4" />
              </Button>
            )}
            {/* Added Instagram button using InstagramIcon */}
            {member.socialLinks.instagram && (
              <Button
                size="sm"
                variant="secondary"
                className="h-8 w-8 p-0 bg-white/90 hover:bg-white dark:bg-black/70 dark:hover:bg-black/90"
                onClick={(e) => handleSocialClick(e, member.socialLinks.instagram!)}
              >
                <InstagramIcon className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Like Button - Top Right (appears on hover) - Added z-10 for clickability */}
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 z-10">
            <button
              onClick={handleLike}
              className="flex items-center gap-1 px-2 py-1 rounded-full bg-white/90 hover:bg-white dark:bg-black/70 dark:hover:bg-black/90 transition-colors text-sm"
            >
              <Heart className={cn("h-4 w-4", isLiked && "fill-red-500 text-red-500")} />
              <span className="font-medium">{likeCount}</span>
            </button>
          </div>

          {/* Favorite Star */}
          {member.favorite && (
            <div className="absolute top-3 right-3 group-hover:top-12 transition-all duration-300 z-10"> {/* Also added z-10 here */}
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 drop-shadow-sm" />
            </div>
          )}
          
          {/* Light Mode: White Bottom Section */}
          <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-transparent p-4 dark:p-0">
            
            {/* Content Container */}
            <div className="relative z-10">
              {/* Always Visible Content */}
              <div className="dark:absolute dark:bottom-4 dark:left-4 dark:right-4 transition-transform duration-300 group-hover:-translate-y-10 dark:group-hover:-translate-y-8">
                <h3 className="text-foreground dark:text-white mb-1 font-semibold text-lg tracking-tight">{member.name}</h3>
                <p className="text-muted-foreground dark:text-white/80 text-sm mb-3 dark:mb-2 font-medium tracking-wide">{member.role}</p>
                
                {/* Expand on Hover Content - Bio */}
                <div className="transform transition-all duration-300 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 dark:translate-y-2 dark:group-hover:translate-y-0 mb-3">
                  <p className="text-xs text-muted-foreground dark:text-white/70 line-clamp-2 font-light leading-relaxed">
                    {member.bio}
                  </p>
                </div>
              </div>

              {/* Skills and Status */}
              <div className="flex items-center justify-between mt-3 dark:absolute dark:bottom-4 dark:left-4 dark:right-4 dark:mt-0">
                <div className="flex gap-1 overflow-hidden flex-1 min-w-0 mr-2">
                  {member.skills.slice(0, 2).map((skill) => (
                    <Badge 
                      key={skill} 
                      variant="secondary" 
                      className="text-xs bg-muted/50 dark:bg-white/20 dark:text-white/90 dark:hover:bg-white/30 font-medium tracking-wide whitespace-nowrap flex-shrink-0"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
                <Badge 
                  variant={member.available ? "default" : "secondary"}
                  className="dark:bg-white/20 dark:text-white font-medium tracking-wide text-xs whitespace-nowrap flex-shrink-0"
                >
                  {member.available ? "Available" : "Busy"}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

TeamMemberCard.displayName = 'TeamMemberCard';
