const Config = {
  routes: {
    home: '/',
    edit: '/edit/:imageId'
  },
  apiEndpoints: {
    images: '/v2/list',
    image: '/id',
    imageInfo: '/id/:imageId/info'
  }
};

export default Config;