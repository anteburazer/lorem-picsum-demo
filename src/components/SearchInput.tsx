import React from 'react';
import { debounce } from 'lodash';

interface SearchInputProps {
  className?: string;
  onChange: (searchTerm: string) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ className, onChange }) => {
  const onChangeDebounced = debounce(onChange, 250);

  return (
    <div className={className}>
      <input
        type="text"
        className="form-control"
        placeholder="Search images by author"
        onChange={(e) => onChangeDebounced(e.target.value)}
      />
    </div>
  );
};

export default SearchInput;