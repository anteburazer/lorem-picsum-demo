import React from 'react';
import { Link } from 'react-router-dom';

const NonExistingPage: React.FC = () => (
  <div className="container pl-5 pr-5 pt-5 pb-5 mb-auto text-dark font-size-32">
    <h1 className="display-4">Page not found</h1>
    <p>This page is deprecated, deleted, or does not exist at all</p>
    <h1 className="display-3 font-weight-bold">404</h1>
    <Link to="/" className="btn btn-outline-primary width-100">
      Go Back
    </Link>
  </div>
);

export default NonExistingPage;
