import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { ChevronDown, ListFilter, RotateCcw } from 'lucide-react';

export type SortOption = 'newest' | 'oldest' | 'views' | 'likes';

interface FilterSortBarProps {
  allTags: string[];
  selectedTags: string[];
  selectedSort: SortOption;
  onTagToggle: (tag: string) => void;
  onSortSelect: (sort: SortOption) => void;
  onClearFilters: () => void;
  showClearButton: boolean;
}

export const FilterSortBar: React.FC<FilterSortBarProps> = ({
  allTags,
  selectedTags,
  selectedSort,
  onTagToggle,
  onSortSelect,
  onClearFilters,
  showClearButton,
}) => {
  const sortLabels: Record<SortOption, string> = {
    newest: 'Newest',
    oldest: 'Oldest',
    views: 'Most Views',
    likes: 'Relevance (Likes)',
  };

  return (
    <motion.div
      className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.9 }}
    >
      {/* Tags Section */}
      <div className="flex flex-wrap gap-2 items-center overflow-auto pb-2">
        <span className="text-sm font-semibold text-muted-foreground mr-1">Tags:</span>
        {allTags.map((tag) => (
          <motion.div
            key={tag}
            whileHover={{ scale: 1.00 }}
            whileTap={{ scale: 0.95 }}
          >
            <Badge
              variant={selectedTags.includes(tag) ? 'default' : 'secondary'}
              onClick={() => onTagToggle(tag)}
              className="cursor-pointer transition-colors duration-200"
            >
              #{tag}
            </Badge>
          </motion.div>
        ))}
      </div>

      {/* Sort and Clear Section */}
      <div className="flex items-center gap-4 flex-shrink-0">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <ListFilter className="w-4 h-4" />
              <span>Sort by: {sortLabels[selectedSort]}</span>
              <ChevronDown className="w-4 h-4 transition-transform duration-200" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onSortSelect('newest')}>
              Newest
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSortSelect('oldest')}>
              Oldest
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSortSelect('views')}>
              Most Views
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSortSelect('likes')}>
              Relevance (Likes)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <AnimatePresence>
          {showClearButton && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", duration: 0.4 }}
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={onClearFilters}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};