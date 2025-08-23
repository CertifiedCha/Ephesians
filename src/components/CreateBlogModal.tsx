import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { FileText, Video, Image as ImageIcon, ExternalLink, Plus, X, Hash } from 'lucide-react';

interface CreateBlogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (post: any) => void;
}

export function CreateBlogModal({ isOpen, onClose, onSubmit }: CreateBlogModalProps) {
  const [postType, setPostType] = useState('article');
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [externalUrl, setExternalUrl] = useState('');

  const categories = [
    'Technology',
    'Programming',
    'Design',
    'Tutorial',
    'Opinion',
    'News',
    'Review'
  ];

  const addTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = () => {
    const postData = {
      id: Date.now().toString(),
      title,
      excerpt,
      content,
      category,
      tags,
      type: postType,
      thumbnail,
      videoUrl: postType === 'video' ? videoUrl : undefined,
      externalUrl: postType === 'external' ? externalUrl : undefined,
      author: {
        name: 'Your Name'
      },
      publishedAt: 'Just now',
      readTime: '5 min read',
      views: 0,
      isBookmarked: false
    };

    onSubmit(postData);
    
    // Reset form
    setTitle('');
    setExcerpt('');
    setContent('');
    setCategory('');
    setTags([]);
    setThumbnail('');
    setVideoUrl('');
    setExternalUrl('');
    setPostType('article');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Blog Post</DialogTitle>
        </DialogHeader>

        <Tabs value={postType} onValueChange={setPostType} className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full max-w-2xl">
            <TabsTrigger value="article" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Article
            </TabsTrigger>
            <TabsTrigger value="video" className="flex items-center gap-2">
              <Video className="w-4 h-4" />
              Video
            </TabsTrigger>
            <TabsTrigger value="image" className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              Gallery
            </TabsTrigger>
            <TabsTrigger value="external" className="flex items-center gap-2">
              <ExternalLink className="w-4 h-4" />
              External
            </TabsTrigger>
          </TabsList>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter your blog post title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    placeholder="Write a brief description of your post..."
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    className="min-h-20 resize-none"
                  />
                </div>

                {/* Content based on type */}
                <TabsContent value="article" className="mt-0">
                  <div>
                    <Label htmlFor="content">Content</Label>
                    <Textarea
                      id="content"
                      placeholder="Write your article content here..."
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="min-h-40 resize-none"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="video" className="mt-0 space-y-4">
                  <div>
                    <Label htmlFor="videoUrl">Video URL</Label>
                    <Input
                      id="videoUrl"
                      placeholder="https://youtube.com/watch?v=..."
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="videoContent">Description</Label>
                    <Textarea
                      id="videoContent"
                      placeholder="Describe your video content..."
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="min-h-32 resize-none"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="image" className="mt-0">
                  <div>
                    <Label>Image Gallery</Label>
                    <Card className="border-dashed border-2 border-muted-foreground/25">
                      <CardContent className="flex flex-col items-center justify-center py-12">
                        <ImageIcon className="w-12 h-12 text-muted-foreground mb-4" />
                        <Button variant="outline">
                          Upload Images
                        </Button>
                        <p className="text-sm text-muted-foreground mt-2">
                          Drag and drop or click to select
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="external" className="mt-0 space-y-4">
                  <div>
                    <Label htmlFor="externalUrl">External URL</Label>
                    <Input
                      id="externalUrl"
                      placeholder="https://example.com/article"
                      value={externalUrl}
                      onChange={(e) => setExternalUrl(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="externalContent">Summary</Label>
                    <Textarea
                      id="externalContent"
                      placeholder="Write a summary of the external content..."
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="min-h-32 resize-none"
                    />
                  </div>
                </TabsContent>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardContent className="p-4 space-y-4">
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Tags</Label>
                    <div className="flex gap-2 mb-2">
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
                      <div className="flex gap-1 flex-wrap">
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

                  <div>
                    <Label htmlFor="thumbnail">Thumbnail URL</Label>
                    <Input
                      id="thumbnail"
                      placeholder="https://example.com/image.jpg"
                      value={thumbnail}
                      onChange={(e) => setThumbnail(e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-2">
                <Button variant="outline" onClick={onClose} className="flex-1">
                  Cancel
                </Button>
                <Button 
                  onClick={handleSubmit}
                  disabled={!title.trim() || !category}
                  className="flex-1"
                >
                  Publish
                </Button>
              </div>
            </div>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}