import React from 'react';

const AuthLayout: React.FC = ({ children }) => (
  <div>
    <div className="container-fluid">{children}</div>
  </div>
);

export default AuthLayout;
