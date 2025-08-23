import { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { TeamMember } from '../data/teamMembers';
import { cn } from './ui/utils';

interface SpotlightCarouselProps {
  members: TeamMember[];
  onMemberClick: (member: TeamMember) => void;
}

export function SpotlightCarousel({ members, onMemberClick }: SpotlightCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const spotlightMembers = members.filter(member => member.spotlight);

  useEffect(() => {
    if (!isAutoPlaying || spotlightMembers.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % spotlightMembers.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, spotlightMembers.length]);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % spotlightMembers.length);
    setIsAutoPlaying(false);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + spotlightMembers.length) % spotlightMembers.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  if (spotlightMembers.length === 0) {
    return null;
  }

  const currentMember = spotlightMembers[currentIndex];
  const initials = currentMember.name.split(' ').map(n => n[0]).join('');

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
        <h2 className="font-display text-2xl font-semibold tracking-tight">Team Spotlight</h2>
      </div>
      
      <Card className="relative overflow-hidden">
        <CardContent className="p-0">
          <div className="flex items-center bg-gradient-to-r from-primary/5 to-accent/30 p-8">
            <div className="flex-1">
              <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                  <AvatarImage src={currentMember.photo} alt={currentMember.name} />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1 text-center md:text-left">
                  <h3 className="mb-2 font-display text-2xl font-semibold tracking-tight">{currentMember.name}</h3>
                  <p className="text-muted-foreground mb-3 font-medium tracking-wide">{currentMember.role}</p>
                  <p className="text-sm text-muted-foreground mb-4 max-w-2xl font-light leading-relaxed">
                    {currentMember.bio}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                    <Badge variant="outline" className="font-medium tracking-wide">{currentMember.department}</Badge>
                    <Badge variant="outline" className="font-medium tracking-wide">{currentMember.experience} years</Badge>
                    {currentMember.skills.slice(0, 3).map((skill) => (
                      <Badge key={skill} variant="secondary" className="font-medium tracking-wide">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  
                  <Button 
                    onClick={() => onMemberClick(currentMember)}
                    variant="default"
                    className="font-medium tracking-wide"
                  >
                    View Full Profile
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Navigation Controls */}
            {spotlightMembers.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                  onClick={goToPrevious}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                  onClick={goToNext}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
          
          {/* Dots Indicator */}
          {spotlightMembers.length > 1 && (
            <div className="flex justify-center gap-2 p-4 bg-muted/20">
              {spotlightMembers.map((_, index) => (
                <button
                  key={index}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all",
                    index === currentIndex 
                      ? "bg-primary w-6" 
                      : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  )}
                  onClick={() => goToSlide(index)}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}