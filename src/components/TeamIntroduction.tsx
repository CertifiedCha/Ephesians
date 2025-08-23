import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { TeamMember } from '../data/teamMembers';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { cn } from './ui/utils';

interface TeamIntroductionProps {
  members: TeamMember[];
  onMemberClick: (member: TeamMember) => void;
}

export function TeamIntroduction({ members, onMemberClick }: TeamIntroductionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const spotlightMembers = members.filter(member => member.spotlight);

  useEffect(() => {
    if (!isAutoPlaying || spotlightMembers.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % spotlightMembers.length);
    }, 4000);

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

  if (spotlightMembers.length === 0) {
    return (
      <div className="mb-12">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 to-accent/30">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1700241956172-1045342673ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXZlcnNlJTIwY3JlYXRpdmUlMjB0ZWFtJTIwbWVldGluZyUyMGJyYWluc3Rvcm1pbmd8ZW58MXx8fHwxNzU1Nzk4NTAyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Our Creative Team"
            className="w-full h-96 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute bottom-8 left-8">
            <h2 className="font-display text-4xl font-bold text-white mb-2 tracking-tight">Meet Our Team</h2>
            <p className="text-white/90 font-light text-lg leading-relaxed">Talented individuals working together to create something extraordinary</p>
          </div>
        </div>
      </div>
    );
  }

  const currentMember = spotlightMembers[currentIndex];

  return (
    <div className="mb-12">
      <div className="grid lg:grid-cols-5 gap-8 items-stretch">
        {/* Team Image - Left Side (3/5) */}
        <div className="lg:col-span-3">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 to-accent/30 h-full min-h-[400px]">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1700241956172-1045342673ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXZlcnNlJTIwY3JlYXRpdmUlMjB0ZWFtJTIwbWVldGluZyUyMGJyYWluc3Rvcm1pbmd8ZW58MXx8fHwxNzU1Nzk4NTAyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Our Creative Team"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <div className="absolute bottom-8 left-8">
              <h2 className="font-display text-4xl font-bold text-white mb-2 tracking-tight">Meet Our Team</h2>
              <p className="text-white/90 font-light text-lg leading-relaxed max-w-md">
                Talented individuals working together to create something extraordinary
              </p>
            </div>
          </div>
        </div>

        {/* Spotlight Member - Right Side (2/5) */}
        <div className="lg:col-span-2">
          <div className="h-full flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <h3 className="font-display text-lg font-semibold tracking-tight">Featured Member</h3>
            </div>

            <div className="relative overflow-hidden rounded-xl bg-card shadow-lg hover:shadow-xl transition-all duration-300 flex-1 group cursor-pointer"
                 onClick={() => onMemberClick(currentMember)}>
              
              {/* Member Image */}
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src={currentMember.photo}
                  alt={currentMember.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                
                {/* Navigation Controls */}
                {spotlightMembers.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white dark:bg-black/70 dark:hover:bg-black/90 opacity-0 group-hover:opacity-100 transition-all duration-300"
                      onClick={(e) => {
                        e.stopPropagation();
                        goToPrevious();
                      }}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white dark:bg-black/70 dark:hover:bg-black/90 opacity-0 group-hover:opacity-100 transition-all duration-300"
                      onClick={(e) => {
                        e.stopPropagation();
                        goToNext();
                      }}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </>
                )}

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                {/* Member Info */}
                <div className="absolute bottom-4 left-4 right-4">
                  <h4 className="font-display text-xl font-semibold text-white mb-1 tracking-tight">
                    {currentMember.name}
                  </h4>
                  <p className="text-white/90 font-medium tracking-wide mb-2">
                    {currentMember.role}
                  </p>
                  <Badge 
                    variant={currentMember.available ? "default" : "secondary"}
                    className="bg-white/20 text-white border-white/30 font-medium tracking-wide text-xs"
                  >
                    {currentMember.available ? "Available" : "Busy"}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Dots Indicator */}
            {spotlightMembers.length > 1 && (
              <div className="flex justify-center gap-2 mt-4">
                {spotlightMembers.map((_, index) => (
                  <button
                    key={index}
                    className={cn(
                      "w-2 h-2 rounded-full transition-all duration-300",
                      index === currentIndex 
                        ? "bg-primary w-6" 
                        : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                    )}
                    onClick={() => setCurrentIndex(index)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}