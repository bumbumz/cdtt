import React, { useState } from 'react';

function FilterNavbar({ onFilterChange, currentPage, totalPages, onPageChange }) {
  const [sortOption, setSortOption] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [searchTerm, setSearchTerm] = useState('');

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
    onFilterChange({ sortOption: e.target.value, priceRange, searchTerm });
  };

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    setPriceRange((prevRange) => ({ ...prevRange, [name]: value }));
    onFilterChange({ sortOption, priceRange: { ...priceRange, [name]: value }, searchTerm });
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onFilterChange({ sortOption, priceRange, searchTerm });
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-between p-4 bg-gray-100">
      <div className="flex items-center mb-4 md:mb-0">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="border rounded px-3 py-2 mr-4"
        />
        <select
          value={sortOption}
          onChange={handleSortChange}
          className="border rounded px-3 py-2 mr-4"
        >
          <option value="">Sort by</option>
          <option value="name-asc">Name: A to Z</option>
          <option value="name-desc">Name: Z to A</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>
      <div className="flex items-center">
        <input
          type="number"
          name="min"
          placeholder="Min price"
          value={priceRange.min}
          onChange={handlePriceChange}
          className="border rounded px-3 py-2 mr-2"
        />
        <input
          type="number"
          name="max"
          placeholder="Max price"
          value={priceRange.max}
          onChange={handlePriceChange}
          className="border rounded px-3 py-2"
        />
      </div>
      <div className="flex items-center mt-4 md:mt-0">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 m-1 bg-gray-200 text-gray-700 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="px-4 py-2 m-1">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 m-1 bg-gray-200 text-gray-700 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default FilterNavbar;
