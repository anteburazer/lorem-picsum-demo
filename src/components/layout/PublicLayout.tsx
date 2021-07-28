import React from 'react';

const PublicLayout: React.FC = ({ children }) => (
  <div>
    <div className="container-fluid">{children}</div>
  </div>
);

export default PublicLayout;
