import React from 'react';
import { Search, Landmark, Shield } from 'lucide-react';

export interface DirectoryFiltersProps {
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  chapterFilter: string;
  onChapterFilterChange: (chapter: string) => void;
  batchFilter: string;
  onBatchFilterChange: (batch: string) => void;
  uniqueChapters: string[];
  uniqueBatches: string[];
  totalResults: number;
  onResetFilters: () => void;
}

export function DirectoryFilters({
  searchQuery,
  onSearchQueryChange,
  chapterFilter,
  onChapterFilterChange,
  batchFilter,
  onBatchFilterChange,
  uniqueChapters,
  uniqueBatches,
  totalResults,
  onResetFilters
}: DirectoryFiltersProps) {
  const showReset = searchQuery || chapterFilter !== 'all' || batchFilter !== 'all';

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-navy-950/5 p-4 space-y-3 font-sans text-xs" id="directory_filters_card">
      <div className="flex flex-col md:flex-row gap-3">
        
        {/* Search box */}
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-navy-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            id="directory_search_input"
            type="text"
            placeholder="Search by Name, Slave Name, or Email..."
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            className="pl-10 w-full p-2.5 rounded-xl border border-navy-950/10 focus:outline-none focus:ring-1 focus:ring-gold-500 bg-white text-navy-950 text-xs shadow-inner"
          />
        </div>

        {/* Chapter Filter */}
        <div className="relative md:w-48">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-navy-400">
            <Landmark className="w-4.5 h-4.5 text-[#c5a059]" />
          </span>
          <select
            id="directory_chapter_select"
            value={chapterFilter}
            onChange={(e) => onChapterFilterChange(e.target.value)}
            className="pl-9 w-full p-2.5 rounded-xl border border-navy-950/10 focus:outline-none focus:ring-1 focus:ring-gold-500 bg-white text-navy-950 text-xs appearance-none cursor-pointer"
          >
            <option value="all">All Chapters</option>
            {uniqueChapters.map((ch, idx) => (
              <option key={idx} value={ch}>{ch}</option>
            ))}
          </select>
        </div>

        {/* Batch Filter */}
        <div className="relative md:w-48">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-navy-400">
            <Shield className="w-4.5 h-4.5 text-[#c5a059]" />
          </span>
          <select
            id="directory_batch_select"
            value={batchFilter}
            onChange={(e) => onBatchFilterChange(e.target.value)}
            className="pl-9 w-full p-2.5 rounded-xl border border-navy-950/10 focus:outline-none focus:ring-1 focus:ring-gold-500 bg-white text-navy-950 text-xs appearance-none cursor-pointer"
          >
            <option value="all">All Batches</option>
            {uniqueBatches.map((b, idx) => (
              <option key={idx} value={b}>{b}</option>
            ))}
          </select>
        </div>

      </div>

      {/* Results Metadata */}
      <div className="flex justify-between items-center text-[10px] text-navy-400 font-mono font-bold uppercase tracking-wider">
        <span>Found {totalResults} Registered Members</span>
        {showReset && (
          <button
            id="reset_directory_filters_btn"
            onClick={onResetFilters}
            className="text-rose-600 hover:underline cursor-pointer"
          >
            Reset Filters
          </button>
        )}
      </div>
    </div>
  );
}
