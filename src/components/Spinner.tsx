import React from 'react';

const Spinner: React.FC = () => {
  return (
    <div className="col-5 d-flex justify-content-center align-items-center">
      <div className="spinner-grow" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};

export default Spinner;