import ImagesConfig from 'apps/images/Config';

const Config = {
  environment: process.env.REACT_APP_ENVIRONMENT,
  apiUrl: process.env.REACT_APP_API_URL || '',
  webSocketUrl: process.env.REACT_APP_WEBSOCKET_URL || '',
  defaultPageSize: process.env.REACT_APP_DEFAULT_PAGE_SIZE,

  routes: {
    // Images
    ...ImagesConfig.routes,

    //Auth
    login: '/login',

    //Common
    nonExistingPage: '/auth/404',
    home: '/'
  }
};

export default Config;