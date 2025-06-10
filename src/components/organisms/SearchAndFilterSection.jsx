import React from 'react';
import { motion } from 'framer-motion';
import SearchInput from '@/components/molecules/SearchInput';
import FilterSelect from '@/components/molecules/FilterSelect';
import Button from '@/components/atoms/Button';

const SearchAndFilterSection = ({
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    genres,
    years,
    handleClearFilters
}) => {
    return (
        <>
            {/* Search Bar */}
            <SearchInput
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                placeholder="Search for movies..."
                className="mb-6"
            />

            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-8">
                <FilterSelect
                    value={filters.genre}
                    onChange={(e) => setFilters(prev => ({ ...prev, genre: e.target.value }))}
                    options={genres.map(genre => ({ value: genre, label: genre }))}
                    defaultValue="All Genres"
                />

                <FilterSelect
                    value={filters.year}
                    onChange={(e) => setFilters(prev => ({ ...prev, year: e.target.value }))}
                    options={years.map(year => ({ value: year, label: year }))}
                    defaultValue="All Years"
                />

                <FilterSelect
                    value={filters.rating}
                    onChange={(e) => setFilters(prev => ({ ...prev, rating: e.target.value }))}
                    options={[
                        { value: "8", label: "8.0+ Stars" },
                        { value: "7", label: "7.0+ Stars" },
                        { value: "6", label: "6.0+ Stars" },
                        { value: "5", label: "5.0+ Stars" },
                    ]}
                    defaultValue="All Ratings"
                />

                {(searchQuery || filters.genre || filters.year || filters.rating) && (
                    <Button
                        onClick={handleClearFilters}
                        animate={true}
                        className="bg-surface-700 text-gray-300 hover:bg-surface-600"
                    >
                        Clear Filters
                    </Button>
                )}
            </div>
        </>
    );
};

export default SearchAndFilterSection;