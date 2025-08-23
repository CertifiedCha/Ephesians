import { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent } from './ui/card';
import { Search, Grid, List, X } from 'lucide-react';
import { departments } from '../data/teamMembers';

export type SortOption = 'name' | 'role' | 'experience';
export type ViewMode = 'grid' | 'list';

interface SearchAndFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedDepartments: string[];
  onDepartmentToggle: (department: string) => void;
  showAvailableOnly: boolean;
  onAvailableToggle: (checked: boolean) => void;
  showFavoritesOnly: boolean;
  onFavoritesToggle: (checked: boolean) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export function SearchAndFilters({
  searchTerm,
  onSearchChange,
  selectedDepartments,
  onDepartmentToggle,
  showAvailableOnly,
  onAvailableToggle,
  showFavoritesOnly,
  onFavoritesToggle,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange
}: SearchAndFiltersProps) {
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);

  const clearAllFilters = () => {
    onSearchChange('');
    selectedDepartments.forEach(dept => onDepartmentToggle(dept));
    onAvailableToggle(false);
    onFavoritesToggle(false);
  };

  const hasActiveFilters = searchTerm || selectedDepartments.length > 0 || showAvailableOnly || showFavoritesOnly;

  return (
    <div className="space-y-4 mb-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, role, department, or skill..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Quick Actions Bar */}
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="flex flex-wrap gap-2 items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}
          >
            Filters {hasActiveFilters && `(${
              (searchTerm ? 1 : 0) + 
              selectedDepartments.length + 
              (showAvailableOnly ? 1 : 0) + 
              (showFavoritesOnly ? 1 : 0)
            })`}
          </Button>
          
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearAllFilters}>
              <X className="h-3 w-3 mr-1" />
              Clear All
            </Button>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <Label htmlFor="sort-select" className="text-sm whitespace-nowrap">Sort by:</Label>
            <Select value={sortBy} onValueChange={(value: SortOption) => onSortChange(value)}>
              <SelectTrigger className="w-auto" id="sort-select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="role">Role</SelectItem>
                <SelectItem value="experience">Experience</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-1 border rounded-md p-1">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Expanded Filters */}
      {isFiltersExpanded && (
        <Card>
          <CardContent className="p-4 space-y-4">
            {/* Department Chips */}
            <div>
              <Label className="mb-2 block">Departments:</Label>
              <div className="flex flex-wrap gap-2">
                {departments.map((department) => (
                  <Badge
                    key={department}
                    variant={selectedDepartments.includes(department) ? 'default' : 'outline'}
                    className="cursor-pointer hover:bg-accent"
                    onClick={() => onDepartmentToggle(department)}
                  >
                    {department}
                    {selectedDepartments.includes(department) && (
                      <X className="h-3 w-3 ml-1" />
                    )}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Toggle Switches */}
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center space-x-2">
                <Switch
                  id="available-only"
                  checked={showAvailableOnly}
                  onCheckedChange={onAvailableToggle}
                />
                <Label htmlFor="available-only">Available only</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="favorites-only"
                  checked={showFavoritesOnly}
                  onCheckedChange={onFavoritesToggle}
                />
                <Label htmlFor="favorites-only">Favorites only</Label>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}