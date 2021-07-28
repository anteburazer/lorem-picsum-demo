import UrlPattern from 'url-pattern';
import Config from '../Config'; 

/**
 * ROUTE GEMERATORS
 * 
 * These methods are helper methods used for generating the routes (defined in the global config)
 * by a given parameters.
 * e.g. we can generates the project details route based on the given project ID: /project/8
 */
export const getImageListRoute = (): string => Config.routes.home;

export const getImageEditRoute = (imageId: string): string => (
  imageId ? getUrlPattern(Config.routes.edit).stringify({ imageId }) : ''
);

export const getImageInfoEndpoint = (imageId: string): string => (
  imageId ? getUrlPattern(Config.apiEndpoints.imageInfo).stringify({ imageId }) : ''
);

/**
 * Creates url UrlPattern object which can be used for creating the routes,
 * parsing the url parameters etc. 
 */
 const getUrlPattern = (route: string) => new UrlPattern(route);