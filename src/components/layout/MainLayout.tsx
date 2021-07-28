import React from 'react';
// import TopBar from 'common/components/TopBar';

const MainLayout: React.FC = ({ children }) => (
  <div>
    {/* <TopBar /> */}
    <div className="container-fluid">{children}</div>
  </div>
);

export default MainLayout;
