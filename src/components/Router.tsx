import React, { lazy, Suspense } from 'react';
import { Router, Route, Redirect, Switch } from 'react-router-dom';
import Config from 'core/Config';
import Login from 'pages/auth/Login';
import { history } from 'core/utils';

const routes = [
  // Images
  {
    path: '/',
    Component: lazy(() => import('apps/images/App')),
    exact: false,
  },
  {
    path: Config.routes.login,
    Component: Login,
    exact: true,
  }
];

const AppRouter: React.FC = () => (
  <Router history={history}>
    <Switch>
      {routes.map(({ path, Component, exact }) => (
        <Route
          path={path}
          key={path}
          exact={exact}
          render={() => (
            // <Layout>
            <Suspense fallback={null}>
              <Component />
            </Suspense>
            // </Layout>
          )}
        />
      ))}

      <Redirect to={Config.routes.nonExistingPage} />
    </Switch>
  </Router>
);

export default AppRouter;