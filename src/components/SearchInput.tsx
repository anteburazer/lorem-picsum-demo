import React from 'react';
import { debounce } from 'lodash';

interface SearchInputProps {
  onChange: (searchTerm: string) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ onChange }) => {
  const onChangeDebounced = debounce(onChange, 250);

  return (
    <div>
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