import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { Mail, Linkedin, Twitter, Github, MapPin, Calendar, Star, FacebookIcon, InstagramIcon } from 'lucide-react';
import { TeamMember } from '../data/teamMembers';

interface TeamMemberModalProps {
  member: TeamMember | null;
  open: boolean;
  onClose: () => void;
}

export function TeamMemberModal({ member, open, onClose }: TeamMemberModalProps) {
  if (!member) return null;

  const initials = member.name.split(' ').map(n => n[0]).join('');

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl font-semibold tracking-tight">{member.name} Profile</DialogTitle>
          <DialogDescription className="font-light leading-relaxed">
            View detailed information about {member.name}, including their role, experience, and contact details.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src={member.photo} alt={member.name} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              {member.favorite && (
                <Star className="absolute -top-1 -right-1 h-6 w-6 fill-yellow-400 text-yellow-400" />
              )}
            </div>
            
            <div className="flex-1 text-center sm:text-left">
              <h2 className="mb-2 font-display text-xl font-semibold tracking-tight">{member.name}</h2>
              <p className="text-muted-foreground mb-3 font-medium tracking-wide">{member.role}</p>
              
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start mb-4">
                <Badge variant={member.available ? "default" : "secondary"} className="font-medium tracking-wide">
                  {member.available ? "Available" : "Busy"}
                </Badge>
                {member.spotlight && (
                  <Badge variant="outline" className="font-medium tracking-wide">Spotlight</Badge>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-2 text-sm text-muted-foreground font-light">
                <div className="flex items-center gap-1 justify-center sm:justify-start">
                  <MapPin className="h-4 w-4" />
                  <span>{member.department}</span>
                </div>
                <div className="flex items-center gap-1 justify-center sm:justify-start">
                  <Calendar className="h-4 w-4" />
                  <span>{member.experience} years experience</span>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Contact Information */}
          <div>
            <h3 className="mb-3 font-semibold tracking-tight">Contact Information</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a 
                  href={`mailto:${member.email}`}
                  className="text-primary hover:underline font-medium"
                >
                  {member.email}
                </a>
              </div>
              
              <div className="flex gap-2">
                {member.socialLinks.linkedin && (
                  <Button variant="outline" size="sm" asChild className="font-medium tracking-wide">
                    <a href={member.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                      <Linkedin className="h-4 w-4 mr-2" />
                      LinkedIn
                    </a>
                  </Button>
                )}
                {member.socialLinks.twitter && (
                  <Button variant="outline" size="sm" asChild className="font-medium tracking-wide">
                    <a href={member.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                      <Twitter className="h-4 w-4 mr-2" />
                      Twitter
                    </a>
                  </Button>
                )}
                {member.socialLinks.github && (
                  <Button variant="outline" size="sm" asChild className="font-medium tracking-wide">
                    <a href={member.socialLinks.github} target="_blank" rel="noopener noreferrer">
                      <Github className="h-4 w-4 mr-2" />
                      GitHub
                    </a>
                  </Button>
                )}
                {member.socialLinks.facebook && (
                  <Button variant="outline" size="sm" asChild className="font-medium tracking-wide">
                    <a href={member.socialLinks.facebook} target="_blank" rel="noopener noreferrer">
                      <FacebookIcon className="h-4 w-4 mr-2" />
                      Facebook
                    </a>
                  </Button>
                )}
                {member.socialLinks.instagram && (
                  <Button variant="outline" size="sm" asChild className="font-medium tracking-wide">
                    <a href={member.socialLinks.instagram} target="_blank" rel="noopener noreferrer">
                      <InstagramIcon className="h-4 w-4 mr-2" />
                      Instagram
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Biography */}
          <div>
            <h3 className="mb-3 font-semibold tracking-tight">About</h3>
            <p className="text-muted-foreground leading-relaxed font-light">{member.bio}</p>
          </div>

          <Separator />

          {/* Skills */}
          <div>
            <h3 className="mb-3 font-semibold tracking-tight">Skills & Expertise</h3>
            <div className="flex flex-wrap gap-2">
              {member.skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="font-medium tracking-wide">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}