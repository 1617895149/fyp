import { useState } from 'react';

export default function SearchBar({ onSearch }) {
  const [searchText, setSearchText] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleClear = () => {
    setSearchText('');
    onSearch('');
  };

  return (
    <div className="relative mb-4">
      <input
        type="text"
        value={searchText}
        onChange={(e) => {
          setSearchText(e.target.value);
          onSearch(e.target.value);
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder="搜索聊天记录..."
        className={`w-full px-4 py-2 rounded-lg border transition-all duration-200
          ${isFocused 
            ? 'border-blue-500 bg-white shadow-sm' 
            : 'border-gray-300 bg-gray-50'
          } outline-none`}
      />
      
      {searchText && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <i className="bi bi-x-circle"></i>
        </button>
      )}
      
      {isFocused && (
        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 transform scale-x-100 transition-transform duration-200"></div>
      )}
    </div>
  );
} 