import { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Plus, Zap, Camera, Palette, BookOpen, Music, Code, Coffee } from 'lucide-react';

interface Story {
  id: string;
  user: {
    name: string;
    handle: string;
  };
  type: 'personal' | 'challenge' | 'tutorial' | 'inspiration' | 'code' | 'music';
  thumbnail: string;
  isViewed: boolean;
  isLive?: boolean;
  duration: string;
}

const storyTypes = {
  personal: { icon: Coffee, color: 'from-blue-400 to-blue-600', label: 'Life' },
  challenge: { icon: Zap, color: 'from-yellow-400 to-orange-600', label: 'Challenge' },
  tutorial: { icon: BookOpen, color: 'from-green-400 to-green-600', label: 'Tutorial' },
  inspiration: { icon: Palette, color: 'from-purple-400 to-pink-600', label: 'Inspiration' },
  code: { icon: Code, color: 'from-gray-400 to-gray-700', label: 'Code' },
  music: { icon: Music, color: 'from-red-400 to-red-600', label: 'Music' }
};

export function StoriesBar() {
  const [stories] = useState<Story[]>([
    { id: '1', user: { name: 'Alex Chen', handle: 'alexdev' }, type: 'code', thumbnail: '', isViewed: false, duration: '45s' },
    { id: '2', user: { name: 'Sarah Kim', handle: 'sarahdesigns' }, type: 'inspiration', thumbnail: '', isViewed: true, isLive: true, duration: 'LIVE' },
    { id: '3', user: { name: 'Mike Johnson', handle: 'mikephoto' }, type: 'tutorial', thumbnail: '', isViewed: false, duration: '2m' },
    { id: '4', user: { name: 'Emma Wilson', handle: 'emmawrites' }, type: 'personal', thumbnail: '', isViewed: false, duration: '1m' },
    { id: '5', user: { name: 'David Lee', handle: 'davidmusic' }, type: 'music', thumbnail: '', isViewed: true, duration: '30s' },
    { id: '6', user: { name: 'Lisa Garcia', handle: 'lisachallenges' }, type: 'challenge', thumbnail: '', isViewed: false, duration: '1m' },
  ]);

  const StoryItem = ({ story }: { story: Story }) => {
    const storyType = storyTypes[story.type];
    const IconComponent = storyType.icon;

    return (
      <div className="flex flex-col items-center gap-2 min-w-0">
        <div className="relative">
          <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${storyType.color} p-0.5 ${story.isViewed ? 'opacity-60' : ''}`}>
            <div className="w-full h-full bg-background rounded-full flex items-center justify-center">
              <IconComponent className="w-7 h-7 text-foreground" />
            </div>
          </div>
          {story.isLive && (
            <Badge className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 bg-red-500 text-white text-xs px-1">
              LIVE
            </Badge>
          )}
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-muted border-2 border-background rounded-full flex items-center justify-center text-xs">
            {story.duration}
          </div>
        </div>
        <div className="text-center min-w-0">
          <p className="text-xs font-medium truncate w-16">{story.user.name.split(' ')[0]}</p>
          <p className="text-xs text-muted-foreground">{storyType.label}</p>
        </div>
      </div>
    );
  };

  return (
    <Card className="p-4 mb-6">
      <div className="flex items-center gap-4 overflow-x-auto pb-2">
        {/* Add Story Button */}
        <div className="flex flex-col items-center gap-2 flex-shrink-0">
          <Button 
            className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 p-0"
          >
            <Plus className="w-6 h-6 text-white" />
          </Button>
          <div className="text-center">
            <p className="text-xs font-medium">Your Story</p>
            <p className="text-xs text-muted-foreground">Create</p>
          </div>
        </div>

        {/* Stories */}
        {stories.map((story) => (
          <div key={story.id} className="flex-shrink-0">
            <StoryItem story={story} />
          </div>
        ))}
      </div>
    </Card>
  );
}