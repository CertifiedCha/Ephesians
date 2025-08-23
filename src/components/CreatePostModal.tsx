import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Type, Image as ImageIcon, BarChart3, Trophy, Zap, Plus, X, Hash, Calendar, Gift } from 'lucide-react';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (post: any) => void;
}

export function CreatePostModal({ isOpen, onClose, onSubmit }: CreatePostModalProps) {
  const [activeTab, setActiveTab] = useState('text');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  
  // Poll state
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '']);
  
  // Challenge state
  const [challengeTitle, setChallengeTitle] = useState('');
  const [challengeDescription, setChallengeDescription] = useState('');
  const [challengeDeadline, setChallengeDeadline] = useState('');
  const [challengeReward, setChallengeReward] = useState('');
  const [challengeDifficulty, setChallengeDifficulty] = useState('Easy');

  const [thoughtBubbleType, setThoughtBubbleType] = useState('question');

  const addTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const addPollOption = () => {
    if (pollOptions.length < 4) {
      setPollOptions([...pollOptions, '']);
    }
  };

  const removePollOption = (index: number) => {
    if (pollOptions.length > 2) {
      setPollOptions(pollOptions.filter((_, i) => i !== index));
    }
  };

  const updatePollOption = (index: number, value: string) => {
    const newOptions = [...pollOptions];
    newOptions[index] = value;
    setPollOptions(newOptions);
  };

  const handleSubmit = () => {
    let postData: any = {
      content,
      tags,
      type: activeTab,
      timestamp: 'now',
      user: {
        name: 'Your User',
        handle: 'yourhandle',
        verified: true
      },
      likes: 0,
      comments: 0,
      shares: 0,
      isLiked: false,
      isBookmarked: false
    };

    switch (activeTab) {
      case 'poll':
        postData.poll = {
          question: pollQuestion,
          options: pollOptions.filter(opt => opt.trim()).map(opt => ({ text: opt, votes: 0 })),
          totalVotes: 0
        };
        break;
      case 'challenge':
        postData.challenge = {
          title: challengeTitle,
          participants: 0,
          deadline: challengeDeadline,
          reward: challengeReward,
          difficulty: challengeDifficulty
        };
        postData.content = challengeDescription;
        break;
      case 'thought-bubble':
        postData.thoughtBubbleType = thoughtBubbleType;
        break;
    }

    onSubmit(postData);
    
    // Reset form
    setContent('');
    setTags([]);
    setPollQuestion('');
    setPollOptions(['', '']);
    setChallengeTitle('');
    setChallengeDescription('');
    setChallengeDeadline('');
    setChallengeReward('');
    setThoughtBubbleType('question');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Post</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="text" className="flex items-center gap-1">
              <Type className="w-4 h-4" />
              Text
            </TabsTrigger>
            <TabsTrigger value="image" className="flex items-center gap-1">
              <ImageIcon className="w-4 h-4" />
              Image
            </TabsTrigger>
            <TabsTrigger value="poll" className="flex items-center gap-1">
              <BarChart3 className="w-4 h-4" />
              Poll
            </TabsTrigger>
            <TabsTrigger value="challenge" className="flex items-center gap-1">
              <Trophy className="w-4 h-4" />
              Challenge
            </TabsTrigger>
            <TabsTrigger value="thought-bubble" className="flex items-center gap-1">
              <Zap className="w-4 h-4" />
              Thought
            </TabsTrigger>
          </TabsList>

          <TabsContent value="text" className="space-y-4">
            <div>
              <Label htmlFor="content">What's on your mind?</Label>
              <Textarea
                id="content"
                placeholder="Share your thoughts, insights, or experiences..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-32 resize-none"
              />
            </div>
          </TabsContent>

          <TabsContent value="image" className="space-y-4">
            <div>
              <Label>Content</Label>
              <Textarea
                placeholder="Add a caption to your image..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-24 resize-none"
              />
            </div>
            <Card className="border-dashed border-2 border-muted-foreground/25">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <ImageIcon className="w-12 h-12 text-muted-foreground mb-4" />
                <Button variant="outline">
                  Upload Image
                </Button>
                <p className="text-sm text-muted-foreground mt-2">
                  Drag and drop or click to select
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="poll" className="space-y-4">
            <div>
              <Label htmlFor="pollQuestion">Poll Question</Label>
              <Input
                id="pollQuestion"
                placeholder="Ask a question..."
                value={pollQuestion}
                onChange={(e) => setPollQuestion(e.target.value)}
              />
            </div>
            <div>
              <Label>Poll Options</Label>
              <div className="space-y-2">
                {pollOptions.map((option, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder={`Option ${index + 1}`}
                      value={option}
                      onChange={(e) => updatePollOption(index, e.target.value)}
                    />
                    {pollOptions.length > 2 && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => removePollOption(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                {pollOptions.length < 4 && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={addPollOption}
                    className="w-full"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Option
                  </Button>
                )}
              </div>
            </div>
            <div>
              <Label>Additional Context</Label>
              <Textarea
                placeholder="Add context or background for your poll..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-20 resize-none"
              />
            </div>
          </TabsContent>

          <TabsContent value="challenge" className="space-y-4">
            <div>
              <Label htmlFor="challengeTitle">Challenge Title</Label>
              <Input
                id="challengeTitle"
                placeholder="Name your challenge..."
                value={challengeTitle}
                onChange={(e) => setChallengeTitle(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="challengeDescription">Description</Label>
              <Textarea
                id="challengeDescription"
                placeholder="Describe the challenge, rules, and objectives..."
                value={challengeDescription}
                onChange={(e) => setChallengeDescription(e.target.value)}
                className="min-h-24 resize-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="challengeDeadline">Deadline</Label>
                <Input
                  id="challengeDeadline"
                  placeholder="e.g., 7 days, 2 weeks"
                  value={challengeDeadline}
                  onChange={(e) => setChallengeDeadline(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="challengeReward">Reward</Label>
                <Input
                  id="challengeReward"
                  placeholder="e.g., $100, Feature, Badge"
                  value={challengeReward}
                  onChange={(e) => setChallengeReward(e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label>Difficulty Level</Label>
              <Select value={challengeDifficulty} onValueChange={setChallengeDifficulty}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Easy">Easy - Beginner friendly</SelectItem>
                  <SelectItem value="Medium">Medium - Some experience needed</SelectItem>
                  <SelectItem value="Hard">Hard - Advanced challenge</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          <TabsContent value="thought-bubble" className="space-y-4">
            <div>
              <Label>Thought Type</Label>
              <Select value={thoughtBubbleType} onValueChange={setThoughtBubbleType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="question">💭 Random Question</SelectItem>
                  <SelectItem value="shower-thought">🚿 Shower Thought</SelectItem>
                  <SelectItem value="realization">💡 Sudden Realization</SelectItem>
                  <SelectItem value="philosophy">🤔 Deep Philosophy</SelectItem>
                  <SelectItem value="observation">👀 Life Observation</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="thoughtContent">Your Thought</Label>
              <Textarea
                id="thoughtContent"
                placeholder="Share a random thought, question, or observation..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-32 resize-none"
              />
            </div>
            <Card className="bg-purple-50 dark:bg-purple-950/20 border-purple-200">
              <CardContent className="p-4">
                <p className="text-sm text-purple-700 dark:text-purple-300">
                  💡 Thought Bubbles are spontaneous ideas or questions that spark conversations. 
                  Keep them authentic and engaging!
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tags section for all post types */}
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Add a tag..."
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTag()}
              />
              <Button onClick={addTag} variant="outline" size="sm">
                <Hash className="w-4 h-4" />
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1">
                    #{tag}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0"
                      onClick={() => removeTag(tag)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={
                !content.trim() || 
                (activeTab === 'poll' && (!pollQuestion.trim() || pollOptions.filter(opt => opt.trim()).length < 2)) ||
                (activeTab === 'challenge' && (!challengeTitle.trim() || !challengeDescription.trim()))
              }
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              Post
            </Button>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}