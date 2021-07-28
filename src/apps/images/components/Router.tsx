import React, { Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';
import Config from 'apps/images/Config';
import Images from 'apps/images/pages/images/Images';
import ImageEdit from 'apps/images/pages/images/ImageEdit';

const routes = [
  {
    path: Config.routes.home,
    Component: Images,
    exact: true,
  },
  {
    path: Config.routes.edit,
    Component: ImageEdit,
    exact: true,
  },
];

const ImagesRouter: React.FC = () => (
  <Switch>
    {routes.map(({ path, Component, exact }) => (
      <Route
        path={path}
        key={path}
        exact={exact}
        render={() => (
          <Suspense fallback={null}>
            <Component />
          </Suspense>
        )}
      />
    ))}
  </Switch>
);

export default ImagesRouter;