import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { X, Plus, Edit, Trash2 } from 'lucide-react';

interface Tag {
  id: string;
  name: string;
  color: string;
  category: string;
  count: number;
}

const tagColors = [
  { value: 'blue', label: 'Blue', class: 'bg-blue-100 text-blue-800 border-blue-200' },
  { value: 'green', label: 'Green', class: 'bg-green-100 text-green-800 border-green-200' },
  { value: 'red', label: 'Red', class: 'bg-red-100 text-red-800 border-red-200' },
  { value: 'yellow', label: 'Yellow', class: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  { value: 'purple', label: 'Purple', class: 'bg-purple-100 text-purple-800 border-purple-200' },
  { value: 'pink', label: 'Pink', class: 'bg-pink-100 text-pink-800 border-pink-200' },
  { value: 'gray', label: 'Gray', class: 'bg-gray-100 text-gray-800 border-gray-200' }
];

const categories = ['General', 'Technology', 'Design', 'Marketing', 'Business', 'Personal'];

export function TagManager() {
  const [tags, setTags] = useState<Tag[]>([
    { id: '1', name: 'React', color: 'blue', category: 'Technology', count: 12 },
    { id: '2', name: 'Design', color: 'purple', category: 'Design', count: 8 },
    { id: '3', name: 'Marketing', color: 'green', category: 'Marketing', count: 15 },
    { id: '4', name: 'Important', color: 'red', category: 'General', count: 3 },
    { id: '5', name: 'TypeScript', color: 'blue', category: 'Technology', count: 7 },
    { id: '6', name: 'UX/UI', color: 'pink', category: 'Design', count: 9 },
  ]);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [newTag, setNewTag] = useState({ name: '', color: 'blue', category: 'General' });

  const filteredTags = tags.filter(tag => {
    const matchesCategory = selectedCategory === 'all' || tag.category === selectedCategory;
    const matchesSearch = tag.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCreateTag = () => {
    if (newTag.name.trim()) {
      const tag: Tag = {
        id: Date.now().toString(),
        name: newTag.name.trim(),
        color: newTag.color,
        category: newTag.category,
        count: 0
      };
      setTags([...tags, tag]);
      setNewTag({ name: '', color: 'blue', category: 'General' });
      setIsDialogOpen(false);
    }
  };

  const handleEditTag = (tag: Tag) => {
    setEditingTag(tag);
    setNewTag({ name: tag.name, color: tag.color, category: tag.category });
    setIsDialogOpen(true);
  };

  const handleUpdateTag = () => {
    if (editingTag && newTag.name.trim()) {
      setTags(tags.map(tag => 
        tag.id === editingTag.id 
          ? { ...tag, name: newTag.name.trim(), color: newTag.color, category: newTag.category }
          : tag
      ));
      setEditingTag(null);
      setNewTag({ name: '', color: 'blue', category: 'General' });
      setIsDialogOpen(false);
    }
  };

  const handleDeleteTag = (tagId: string) => {
    setTags(tags.filter(tag => tag.id !== tagId));
  };

  const getTagColorClass = (color: string) => {
    return tagColors.find(c => c.value === color)?.class || tagColors[0].class;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>Tag Manager</h2>
          <p className="text-muted-foreground">Organize and customize your tags</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {setEditingTag(null); setNewTag({ name: '', color: 'blue', category: 'General' });}}>
              <Plus className="w-4 h-4 mr-2" />
              Add Tag
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingTag ? 'Edit Tag' : 'Create New Tag'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="tagName">Tag Name</Label>
                <Input
                  id="tagName"
                  value={newTag.name}
                  onChange={(e) => setNewTag({ ...newTag, name: e.target.value })}
                  placeholder="Enter tag name"
                />
              </div>
              <div>
                <Label htmlFor="tagColor">Color</Label>
                <Select value={newTag.color} onValueChange={(color) => setNewTag({ ...newTag, color })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {tagColors.map(color => (
                      <SelectItem key={color.value} value={color.value}>
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded ${color.class}`} />
                          {color.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="tagCategory">Category</Label>
                <Select value={newTag.category} onValueChange={(category) => setNewTag({ ...newTag, category })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button 
                onClick={editingTag ? handleUpdateTag : handleCreateTag} 
                className="w-full"
              >
                {editingTag ? 'Update Tag' : 'Create Tag'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-4 items-center">
        <div className="flex-1">
          <Input
            placeholder="Search tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(category => (
              <SelectItem key={category} value={category}>{category}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTags.map(tag => (
          <Card key={tag.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <Badge className={getTagColorClass(tag.color)} variant="outline">
                  {tag.name}
                </Badge>
                <div className="flex gap-1">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleEditTag(tag)}
                    className="h-6 w-6 p-0"
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleDeleteTag(tag.id)}
                    className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Category: {tag.category}</p>
                <p className="text-sm text-muted-foreground">Used in {tag.count} items</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTags.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No tags found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}