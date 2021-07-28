import React from 'react';
import Helmet from 'react-helmet';
import MainLayout from 'components/layout/MainLayout';
import AuthLayout from 'components/layout/AuthLayout';
import PublicLayout from 'components/layout/PublicLayout';
import { isAuthRoute, isAdminRoute, isClientRoute } from 'core/utils';

const getLayout = () => {
  if (isAuthRoute()) {
    return AuthLayout;
  }

  if (isClientRoute() || isAdminRoute()) {
    return MainLayout;
  }

  return PublicLayout;
};

const Layout: React.FC = ({ children }) => {
  const LayoutBootstrapper = () => {
    const Container = getLayout();

    return <Container>{children}</Container>;
  };

  return (
    <>
      <Helmet titleTemplate="Clinlytics" />
      {LayoutBootstrapper()}
    </>
  );
};


export default Layout;